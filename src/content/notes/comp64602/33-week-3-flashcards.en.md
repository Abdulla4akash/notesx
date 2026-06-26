---
subject: COMP64602
chapter: 33
title: "Week 3 — Flashcards"
language: en
---

# Week 3 — Flashcards

81 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> How do you use a semantic embedding for symbolic knowledge?</summary>

Use it when symbols must be consumed by numerical ML methods.<br><ol><li>Choose the symbols to embed: words, entities, relations, concepts, or axioms.</li><li>Map each symbol to a vector in ℝ^d.</li><li>Train or design the vectors so related symbols have related positions, directions, or distances.</li><li>Use the vectors for prediction, similarity, downstream ML, or approximate reasoning.</li></ol><b>Reference:</b> A semantic embedding represents symbols as vectors while preserving relationships or correlations in vector space; it is a sub-symbolic form of KR.

</details>

<details>
<summary><strong>Q2.</strong> When is embedding useful for uncertain reasoning?</summary>

Use embeddings when symbolic reasoning is incomplete, noisy, or too expensive for exact inference.<br><ol><li>Represent facts/concepts numerically.</li><li>Use vector geometry to estimate plausibility or similarity.</li><li>Predict missing knowledge or approximate complex reasoning.</li><li>Treat outputs as soft/uncertain, not as exact logical entailments.</li></ol><b>Reference:</b> Embeddings support fuzzy KR, reasoning with incompleteness, missing-knowledge prediction, conceptual induction, and approximate reasoning.

</details>

<details>
<summary><strong>Q3.</strong> When is embedding useful for neural-symbolic integration?</summary>

Use it when symbolic KR must feed into neural/statistical systems.<br><ol><li>Start with symbolic objects such as entities, relations, concepts, or axioms.</li><li>Convert them into vectors.</li><li>Pass those vectors to ML, data mining, or statistical models.</li></ol><b>Reference:</b> Neural-symbolic integration uses embeddings as a bridge from symbolic knowledge to numerical learning methods.

</details>

<details>
<summary><strong>Q4.</strong> How do you construct a one-hot vector for a token?</summary>

<ol><li>Fix a vocabulary V={w₁,…,w_|V|}.</li><li>Assign each vocabulary item one unique coordinate.</li><li>For token wᵢ, create a vector of length |V|.</li><li>Set coordinate i to 1 and all other coordinates to 0.</li></ol><b>Reference:</b> One-hot representation maps each word to a sparse vector with exactly one 1 and all other entries 0.

</details>

<details>
<summary><strong>Q5.</strong> How do you represent a token sequence using one-hot vectors?</summary>

<ol><li>Fix the vocabulary and one-hot code for each token type.</li><li>For each token position in the sequence, write its one-hot row vector.</li><li>Stack the rows in sequence order.</li><li>The result has one row per token and one column per vocabulary item.</li></ol><b>Reference:</b> A sentence/sequence matrix is an ordered stack of one-hot vectors.

</details>

<details>
<summary><strong>Q6.</strong> What is the main limitation test for one-hot representations?</summary>

Ask: do we need semantic similarity between different tokens?<br><ol><li>If yes, one-hot is weak because different tokens are orthogonal.</li><li>If the vocabulary is large, one-hot also becomes high-dimensional.</li><li>If the model needs dense semantic correlations, use learned embeddings instead.</li></ol><b>Reference:</b> One-hot vectors are sparse, vocabulary-sized, and give no direct semantic similarity between distinct words.

</details>

<details>
<summary><strong>Q7.</strong> One-hot vs Word2Vec — what is the discriminator?</summary>

Ask: are the vectors assigned directly or learned from corpus context?<br><ol><li>One-hot: assign one coordinate per vocabulary item; no training needed.</li><li>Word2Vec: train on context prediction and learn dense low-dimensional vectors.</li><li>Use Word2Vec when semantic/contextual correlations matter.</li></ol><b>Reference:</b> One-hot is sparse and vocabulary-sized; Word2Vec is learned, dense, and context-correlation based.

</details>

<details>
<summary><strong>Q8.</strong> How do you train/use Word2Vec embeddings in general?</summary>

<ol><li>Collect a large corpus.</li><li>Choose a context-prediction objective.</li><li>Train a neural model to predict target/context words.</li><li>Take the learned hidden-layer representation as the word vector.</li><li>Use vector distances/directions as learned semantic correlations.</li></ol><b>Reference:</b> Word2Vec learns distributed dense word representations from corpus context.

</details>

<details>
<summary><strong>Q9.</strong> How do you apply the Continuous Skip-gram model?</summary>

<ol><li>Select a target word w_t.</li><li>Use its one-hot vector as input.</li><li>Map it through a hidden layer of embedding dimension.</li><li>Predict surrounding context words w_{t±i}.</li><li>Minimize prediction loss over the corpus.</li><li>Use the hidden representation of w_t as its embedding.</li></ol><b>Reference:</b> Skip-gram predicts context words from the target word.

</details>

<details>
<summary><strong>Q10.</strong> How do you apply the CBOW model?</summary>

<ol><li>Select surrounding context words around a masked/target position.</li><li>Input their one-hot vectors.</li><li>Map each through the input-to-hidden weight matrix.</li><li>Combine hidden representations.</li><li>Predict the target middle word.</li><li>Use the learned hidden representation as the word embedding.</li></ol><b>Reference:</b> CBOW predicts a target word from surrounding words.

</details>

<details>
<summary><strong>Q11.</strong> Skip-gram vs CBOW — what question decides which is which?</summary>

Ask: what is predicted from what?<br><ol><li>Target → context: Skip-gram.</li><li>Context → target: CBOW.</li><li>Both learn embeddings from prediction loss, but the direction of prediction is reversed.</li></ol><b>Reference:</b> Skip-gram predicts surrounding words from a word; CBOW predicts a word from its surrounding words.

</details>

<details>
<summary><strong>Q12.</strong> Contextual vs non-contextual embeddings — what is the discriminator?</summary>

Ask: does the same token type always get the same vector?<br><ol><li>Yes: non-contextual embedding.</li><li>No, vector changes with surrounding tokens: contextual embedding.</li><li>Use contextual embeddings when the meaning depends on usage context.</li></ol><b>Reference:</b> Non-contextual models assign one vector per word type; contextual models assign context-dependent token vectors.

</details>

<details>
<summary><strong>Q13.</strong> How do you set up a TransE representation for a KG triple?</summary>

<ol><li>Write the fact as a triple ⟨h,r,t⟩.</li><li>Represent each entity as a point vector h,t ∈ ℝ^d.</li><li>Represent each relation as a translation vector r ∈ ℝ^d.</li><li>Train so h + r ≈ t for true triples.</li></ol><b>Reference:</b> TransE models relations as translations from head entity vectors to tail entity vectors.

</details>

<details>
<summary><strong>Q14.</strong> How do you score a triple in TransE?</summary>

<ol><li>Embed h, r, and t.</li><li>Compute the translated head h+r.</li><li>Measure the distance from h+r to t.</li><li>Interpret smaller distance as higher plausibility.</li></ol><b>Reference:</b> f(h,r,t)=||h+r−t||_{L1/L2}.

</details>

<details>
<summary><strong>Q15.</strong> How do you choose between L1 and L2 distance in the TransE score?</summary>

Ask: are you summing coordinate gaps or measuring squared/Euclidean-style displacement?<br><ol><li>L1 sums absolute coordinate differences: ∑ᵢ|aᵢ−bᵢ|.</li><li>L2-style distance uses squared coordinate differences as given in the slide: ∑ᵢ(aᵢ−bᵢ)².</li><li>Use whichever norm the model/loss specifies.</li></ol><b>Reference:</b> TransE scoring can use an L1 or L2 norm over h+r−t.

</details>

<details>
<summary><strong>Q16.</strong> How do you generate a negative triple for TransE?</summary>

<ol><li>Start from a positive triple ⟨h,r,t⟩.</li><li>Randomly choose whether to corrupt the head or the tail.</li><li>Replace the chosen entity with another entity from the entity set.</li><li>Keep the relation fixed.</li><li>Use the corrupted triple as a negative training example.</li></ol><b>Reference:</b> TransE negative sampling forms ⟨h′,r,t⟩ or ⟨h,r,t′⟩ from a positive triple.

</details>

<details>
<summary><strong>Q17.</strong> What is the false-negative problem in TransE negative sampling?</summary>

Use this check after corrupting a triple: could the generated triple be true but missing from the KG?<br><ol><li>If the KG is incomplete, absence does not guarantee falsity.</li><li>A corrupted triple may accidentally be a real but unrecorded fact.</li><li>Such a sample is a false negative and can mislead training.</li></ol><b>Reference:</b> TransE negative sampling relies on a closed-world-style assumption that unobserved triples are false.

</details>

<details>
<summary><strong>Q18.</strong> How do you compute the TransE margin ranking loss?</summary>

<ol><li>For each positive triple, generate one or more negative triples.</li><li>Compute f(pos) and f(neg).</li><li>Apply the hinge term [γ + f(pos) − f(neg)]₊.</li><li>Sum over positive/negative pairs.</li><li>Minimize the total loss.</li></ol><b>Reference:</b> L=Σ_{pos∈S}Σ_{neg∈S′}[γ+f(pos)−f(neg)]₊, where [x]₊=max(0,x).

</details>

<details>
<summary><strong>Q19.</strong> When does a TransE positive-negative pair contribute zero loss?</summary>

<ol><li>Compute γ + f(pos) − f(neg).</li><li>If this value ≤ 0, the negative is already worse than the positive by at least the margin.</li><li>The hinge returns 0, so the pair gives no penalty.</li><li>Otherwise, update embeddings to lower f(pos) and/or raise f(neg).</li></ol><b>Reference:</b> The margin γ enforces separation between positive and negative triple scores.

</details>

<details>
<summary><strong>Q20.</strong> How do you train TransE from scratch?</summary>

<ol><li>Choose entity set E, relation set L, training triples S, margin γ, and dimension k.</li><li>Initialize entity and relation vectors uniformly.</li><li>Normalize relation vectors; repeatedly normalize entity vectors.</li><li>Sample a mini-batch of positive triples.</li><li>Generate corrupted negative triples.</li><li>Build positive-negative training pairs.</li><li>Update embeddings by stochastic gradient descent on the margin loss.</li></ol><b>Reference:</b> TransE learns entity/relation embeddings by SGD over margin-ranked positive and corrupted triples.

</details>

<details>
<summary><strong>Q21.</strong> How does TransE model relation composition?</summary>

<ol><li>Represent the first relation as translation r₁.</li><li>Represent the second relation as translation r₂.</li><li>If h+r₁≈m and m+r₂≈t, combine them: h+r₁+r₂≈t.</li><li>Represent the composed relation by r₃≈r₁+r₂.</li></ol><b>Reference:</b> TransE can model relation composition because translations add.

</details>

<details>
<summary><strong>Q22.</strong> Why does TransE struggle with symmetric relations?</summary>

<ol><li>For symmetry, both ⟨h,r,t⟩ and ⟨t,r,h⟩ should hold.</li><li>Perfect TransE requires h+r=t and t+r=h.</li><li>Substitute to get h+2r=h, hence r=0.</li><li>Then h=t, collapsing distinct entities.</li></ol><b>Reference:</b> A symmetric relation satisfies ⟨h,r,t⟩ ⇒ ⟨t,r,h⟩; TransE translation geometry forces degeneration for distinct entities.

</details>

<details>
<summary><strong>Q23.</strong> Why does TransE struggle with 1-to-N relations?</summary>

<ol><li>For one head with several tails, true triples include ⟨h,r,t⟩ and ⟨h,r,t′⟩.</li><li>Perfect TransE requires h+r=t and h+r=t′.</li><li>Therefore t=t′.</li><li>This collapses distinct tail entities, so 1-to-N is not represented well.</li></ol><b>Reference:</b> A 1-to-N relation maps one head to multiple distinct tails; TransE uses one translation target for the same h and r.

</details>

<details>
<summary><strong>Q24.</strong> How do N-to-1 and N-to-N limitations follow from the 1-to-N TransE problem?</summary>

<ol><li>Check whether several distinct entities must share the same translated point.</li><li>N-to-1 forces different heads through the same relation to one tail.</li><li>N-to-N combines both many-head and many-tail ambiguity.</li><li>Single global entity vectors plus one relation translation cannot separate all roles cleanly.</li></ol><b>Reference:</b> TransE struggles with 1-to-N, N-to-1, and N-to-N relations because one translation vector must satisfy incompatible mappings.

</details>

<details>
<summary><strong>Q25.</strong> How does TransH modify TransE?</summary>

<ol><li>For each relation r, learn a relation-specific hyperplane with normal w_r.</li><li>Project h and t onto that hyperplane.</li><li>Translate using a relation vector d_r on the hyperplane.</li><li>Score the projected translation instead of the global point translation.</li></ol><b>Reference:</b> TransH represents each relation by a hyperplane normal w_r and translation d_r, allowing relation-specific entity projections.

</details>

<details>
<summary><strong>Q26.</strong> How do you project an entity in TransH?</summary>

<ol><li>Take entity vector e and relation hyperplane normal w_r.</li><li>Remove the component of e along w_r.</li><li>Use e_⊥=e−(w_r^T e)w_r as the relation-specific projection.</li><li>Use h_⊥+d_r≈t_⊥ for scoring.</li></ol><b>Reference:</b> TransH projects h and t onto a relation-specific hyperplane before applying the relation translation.

</details>

<details>
<summary><strong>Q27.</strong> How does TransR modify TransE?</summary>

<ol><li>For each relation r, learn a projection matrix M_r.</li><li>Map entity vectors into the relation-specific space: h_r=hM_r and t_r=tM_r.</li><li>Score the translation in that relation space.</li><li>Use this when entities behave differently across relations.</li></ol><b>Reference:</b> TransR maps entities into relation-specific spaces and scores f(h,r,t)=||h_r+r−t_r||_{L1/L2}.

</details>

<details>
<summary><strong>Q28.</strong> TransE vs TransH vs TransR — what is the discriminator?</summary>

Ask: where does relation-specific geometry enter?<br><ol><li>TransE: one global entity space; relation is a translation.</li><li>TransH: relation-specific hyperplane projection, then translation.</li><li>TransR: relation-specific matrix projection into a separate relation space, then translation.</li></ol><b>Reference:</b> TransH and TransR are TransE variants designed to handle relation patterns that plain translations model poorly.

</details>

<details>
<summary><strong>Q29.</strong> Why are ontology embeddings more complex than KG embeddings?</summary>

<ol><li>Check whether the data contains only individuals/relations or also concepts and axioms.</li><li>For KGs, point embeddings for entities may suffice.</li><li>For ontologies, concepts need regions because they denote sets/classes of individuals.</li><li>Represent individuals as points and concepts as regions.</li></ol><b>Reference:</b> Ontologies contain individuals, concepts, and logical relationships; ontology embedding therefore distinguishes points from concept regions.

</details>

<details>
<summary><strong>Q30.</strong> How do you recognize the constructors of DL EL++ in this lecture?</summary>

<ol><li>Atomic concept: A.</li><li>Top and bottom: ⊤ and ⊥.</li><li>Conjunction/intersection: C⊓D.</li><li>Existential restriction: ∃r.C.</li><li>Nominal/singleton concept: {a}.</li><li>Roles can also appear in composition/subsumption axioms.</li></ol><b>Reference:</b> EL++ concepts are built from ⊥, ⊤, atomic concepts, conjunction, existential restriction, and nominals; roles allow composition/subsumption.

</details>

<details>
<summary><strong>Q31.</strong> How do you interpret an existential restriction ∃r.C?</summary>

<ol><li>Start from an individual or concept on the left.</li><li>Follow role r to some connected individual.</li><li>Require that connected individual to be an instance of concept C.</li><li>Read it as “has some r-successor in C”.</li></ol><b>Reference:</b> ∃r.C denotes things that are related by role r to at least one instance of C.

</details>

<details>
<summary><strong>Q32.</strong> TBox vs ABox — what is the discriminator?</summary>

Ask: is the axiom about general concept/role structure or about named individuals?<br><ol><li>General subclass, conjunction, existential, or role-inclusion statements: TBox.</li><li>Assertions that an individual belongs to a concept or that two individuals are linked by a role: ABox.</li><li>Box2EL normalisation converts ABox assertions into TBox-style nominal axioms.</li></ol><b>Reference:</b> TBox contains terminological/schema axioms; ABox contains assertions about individuals.

</details>

<details>
<summary><strong>Q33.</strong> How do you normalize an ABox concept assertion for Box2EL?</summary>

<ol><li>Start with an assertion C(a).</li><li>Create the nominal concept {a} for the individual.</li><li>Rewrite the assertion as {a}⊑C.</li><li>Use this TBox-style axiom in training.</li></ol><b>Reference:</b> ABox concept assertion C(a) becomes TBox axiom {a}⊑C.

</details>

<details>
<summary><strong>Q34.</strong> How do you normalize an ABox role assertion for Box2EL?</summary>

<ol><li>Start with role assertion r(a,b).</li><li>Create nominals {a} and {b}.</li><li>Rewrite as {a}⊑∃r.{b}.</li><li>Treat nominals as point-like boxes with zero offset.</li></ol><b>Reference:</b> ABox role assertion r(a,b) becomes {a}⊑∃r.{b}.

</details>

<details>
<summary><strong>Q35.</strong> Why normalize ontology axioms before Box2EL training?</summary>

<ol><li>Convert assertions and complex axioms into a fixed set of normal forms.</li><li>Keep the ontology semantics unchanged.</li><li>Apply the matching Box2EL loss for each normal form.</li><li>Train embeddings over a uniform objective family.</li></ol><b>Reference:</b> Ontology normalisation rewrites axioms into seven normal forms without changing their semantics.

</details>

<details>
<summary><strong>Q36.</strong> How do concept-as-ball embeddings model concepts and individuals?</summary>

<ol><li>Represent each individual as a point x∈ℝ^n.</li><li>Represent each concept C as a ball with center c_C and radius r_C.</li><li>Classify membership by checking whether x lies inside the ball.</li><li>Model subsumption by ball inclusion.</li></ol><b>Reference:</b> A concept-as-ball embedding represents a concept as an n-ball and an individual as a point.

</details>

<details>
<summary><strong>Q37.</strong> How do you test membership in a concept-as-ball embedding?</summary>

<ol><li>Get the individual point x.</li><li>Get the concept center c_C and radius r_C.</li><li>Compute the distance from x to c_C.</li><li>If distance ≤ r_C, treat x as an instance of C.</li></ol><b>Reference:</b> Individual membership is point-inside-ball.

</details>

<details>
<summary><strong>Q38.</strong> How do you test concept subsumption using balls?</summary>

<ol><li>Take the ball for subclass C and the ball for superclass D.</li><li>Check whether every point in Ball(C) lies inside Ball(D).</li><li>If yes, model C⊑D as satisfied.</li></ol><b>Reference:</b> Concept subsumption C⊑D is modeled as Ball(C)⊆Ball(D).

</details>

<details>
<summary><strong>Q39.</strong> Why do ball embeddings struggle with conjunction/intersection?</summary>

<ol><li>Conjunction C⊓D corresponds to region intersection.</li><li>Intersect the two concept balls.</li><li>The resulting region is generally not another ball.</li><li>So the representation is not closed under conjunction.</li></ol><b>Reference:</b> The intersection of two balls is generally not a ball, so concept-as-ball embeddings struggle with C⊓D.

</details>

<details>
<summary><strong>Q40.</strong> Why do boxes help with EL++ conjunction?</summary>

<ol><li>Represent concepts as axis-aligned boxes.</li><li>Interpret conjunction C⊓D as Box(C)∩Box(D).</li><li>The intersection of axis-aligned boxes is still an axis-aligned box.</li><li>Use the resulting box to model conjunction exactly within the representation family.</li></ol><b>Reference:</b> Box embeddings are closed under box intersection, making them suitable for EL++ conjunction.

</details>

<details>
<summary><strong>Q41.</strong> How does Box2EL represent a concept?</summary>

<ol><li>Assign concept C a lower corner l_C∈ℝ^n.</li><li>Assign it an upper corner u_C∈ℝ^n.</li><li>Define Box(C)={x∈ℝ^n | l_C≤x≤u_C} element-wise.</li><li>Use this region for membership, subsumption, and intersection.</li></ol><b>Reference:</b> Box2EL represents each concept as an n-dimensional axis-aligned box.

</details>

<details>
<summary><strong>Q42.</strong> How do you compute center and offset of a Box2EL concept box?</summary>

<ol><li>Start with lower corner l_C and upper corner u_C.</li><li>Compute center c(C)=(l_C+u_C)/2.</li><li>Compute offset o(C)=(u_C−l_C)/2.</li><li>Use center and offset in box-distance and loss formulas.</li></ol><b>Reference:</b> Box2EL parameterizes boxes by lower/upper corners and often uses center/offset form.

</details>

<details>
<summary><strong>Q43.</strong> How do boxes model individual membership, subsumption, and conjunction?</summary>

<ol><li>Membership: check whether point x lies inside Box(C).</li><li>Subsumption C⊑D: check Box(C)⊆Box(D).</li><li>Conjunction C⊓D: compute Box(C)∩Box(D).</li><li>Equivalence to an intersection: set Box(E)=Box(C)∩Box(D).</li></ol><b>Reference:</b> Box2EL uses box containment for subsumption and box intersection for conjunction.

</details>

<details>
<summary><strong>Q44.</strong> Ball vs box concept embeddings — what is the discriminator?</summary>

Ask: must the model represent concept intersection as the same shape type?<br><ol><li>If no exact closure is needed, balls may represent regions and subsumption.</li><li>If conjunction C⊓D is central, boxes are better because box intersections remain boxes.</li><li>Use boxes for EL++-style conjunction-heavy ontology embedding.</li></ol><b>Reference:</b> Balls are not closed under intersection; axis-aligned boxes are.

</details>

<details>
<summary><strong>Q45.</strong> How does Box2EL represent a relation?</summary>

<ol><li>For each relation r, learn a Head(r) box.</li><li>Also learn a Tail(r) box.</li><li>Use these boxes like geometric domain/range regions for relation constraints.</li><li>Combine them with bump vectors for existential restrictions.</li></ol><b>Reference:</b> Box2EL represents each relation using separate head and tail boxes.

</details>

<details>
<summary><strong>Q46.</strong> How does Box2EL model C⊑∃r.D using bumps?</summary>

<ol><li>Give each concept a bump vector.</li><li>Translate Box(C) by Bump(D).</li><li>Require Box(C)+Bump(D)⊆Head(r).</li><li>Translate Box(D) by Bump(C).</li><li>Require Box(D)+Bump(C)⊆Tail(r).</li></ol><b>Reference:</b> Existential restriction C⊑∃r.D is modeled by mutual bumped containment into Head(r) and Tail(r).

</details>

<details>
<summary><strong>Q47.</strong> What does the bump operation do in Box2EL?</summary>

<ol><li>Take a concept box Box(C).</li><li>Take a bump vector Bump(D).</li><li>Add the vector to every point in the box.</li><li>Use the translated box in relation head/tail containment checks.</li></ol><b>Reference:</b> Box(C)⊕Bump(D)={x+Bump(D) | x∈Box(C)}.

</details>

<details>
<summary><strong>Q48.</strong> How do you model role subsumption with relation boxes?</summary>

<ol><li>Start with role inclusion r⊑s.</li><li>Check Head(r)⊆Head(s).</li><li>Check Tail(r)⊆Tail(s).</li><li>Penalize either failed inclusion during training.</li></ol><b>Reference:</b> Box2EL models role subsumption by including both head and tail boxes of the subrole inside those of the superrole.

</details>

<details>
<summary><strong>Q49.</strong> How do you compute element-wise box distance d(A,B)?</summary>

<ol><li>Compute center difference |c(A)−c(B)| element-wise.</li><li>Subtract offsets o(A) and o(B).</li><li>Interpret each dimension separately.</li><li>Positive coordinate means a gap; negative coordinate means overlap in that dimension.</li></ol><b>Reference:</b> d(A,B)=|c(A)−c(B)|−o(A)−o(B).

</details>

<details>
<summary><strong>Q50.</strong> How do you interpret positive vs negative coordinates in box distance?</summary>

<ol><li>For each dimension, compare center separation with total offsets.</li><li>If separation is larger, boxes have a positive gap in that dimension.</li><li>If separation is smaller, boxes overlap and the coordinate is negative.</li><li>Use this sign information in overlap/subsumption losses.</li></ol><b>Reference:</b> Box distance is element-wise: positive means separated; negative means overlapping.

</details>

<details>
<summary><strong>Q51.</strong> How do you compute Box2EL subsumption loss for A⊑B?</summary>

<ol><li>Compute d(A,B)=|c(A)−c(B)|−o(A)−o(B).</li><li>Compute d(A,B)+2o(A)=|c(A)−c(B)|+o(A)−o(B).</li><li>Subtract margin γ.</li><li>Apply element-wise max with 0 and take the norm.</li><li>Zero loss means A is inside B with the required margin.</li></ol><b>Reference:</b> For non-empty B, L_⊑(A,B)=||max{0,d(A,B)+2o(A)−γ}||.

</details>

<details>
<summary><strong>Q52.</strong> How should you read a high Box2EL subsumption score?</summary>

<ol><li>Check whether the subclass box extends outside the superclass box.</li><li>If it does, the max term becomes positive.</li><li>The loss increases, meaning the subsumption is geometrically violated.</li><li>If the subclass is inside the superclass with margin, the loss is 0.</li></ol><b>Reference:</b> Box2EL subsumption loss is higher when A⊑B is less likely/geometrically less satisfied.

</details>

<details>
<summary><strong>Q53.</strong> Which Box2EL normal form loss should you use?</summary>

Use the axiom shape as the discriminator.<br><ol><li>C⊑D → NF1.</li><li>C⊓D⊑E → NF2.</li><li>C⊑∃r.D → NF3.</li><li>∃r.C⊑D → NF4.</li><li>C⊓D⊑⊥ → NF5.</li><li>r⊑s → NF6.</li><li>r₁∘r₂⊑s → NF7.</li></ol><b>Reference:</b> Box2EL normalizes TBox axioms into seven normal forms, each with a matching loss.

</details>

<details>
<summary><strong>Q54.</strong> How do you score NF1: C⊑D?</summary>

<ol><li>Identify subclass concept C and superclass concept D.</li><li>Take Box(C) and Box(D).</li><li>Apply the subsumption loss L_⊑(Box(C),Box(D)).</li><li>Minimize it so Box(C) is contained in Box(D).</li></ol><b>Reference:</b> NF1 loss: L₁(C,D)=L_⊑(Box(C),Box(D)).

</details>

<details>
<summary><strong>Q55.</strong> How do you score NF2: C⊓D⊑E?</summary>

<ol><li>Intersect Box(C) and Box(D).</li><li>Use the intersection box as the left-hand concept region.</li><li>Apply subsumption loss into Box(E).</li><li>Minimize so every point satisfying both C and D lies inside E.</li></ol><b>Reference:</b> NF2 loss: L₂(C,D,E)=L_⊑(Box(C)∩Box(D),Box(E)).

</details>

<details>
<summary><strong>Q56.</strong> How do you score NF3: C⊑∃r.D?</summary>

<ol><li>Translate Box(C) by Bump(D) and include it in Head(r).</li><li>Translate Box(D) by Bump(C) and include it in Tail(r).</li><li>Compute the two subsumption losses.</li><li>Average them.</li></ol><b>Reference:</b> NF3 loss: L₃(C,r,D)=½[L_⊑(Box(C)+Bump(D),Head(r))+L_⊑(Box(D)+Bump(C),Tail(r))].

</details>

<details>
<summary><strong>Q57.</strong> How do you score NF4: ∃r.C⊑D?</summary>

<ol><li>Use the relation head box Head(r).</li><li>Translate it back by subtracting Bump(C).</li><li>Require the resulting region to be contained in Box(D).</li><li>Apply subsumption loss.</li></ol><b>Reference:</b> NF4 loss: L₄(r,C,D)=L_⊑(Head(r)−Bump(C),Box(D)).

</details>

<details>
<summary><strong>Q58.</strong> How do you score NF5: C⊓D⊑⊥?</summary>

<ol><li>Interpret the axiom as C and D must be disjoint.</li><li>Compute box distance d(Box(C),Box(D)).</li><li>Penalize overlap using max{0,−(d+γ)}.</li><li>Minimize so the boxes become separated enough.</li></ol><b>Reference:</b> NF5 loss: L₅(C,D)=||max{0,−(d(Box(C),Box(D))+γ)}||.

</details>

<details>
<summary><strong>Q59.</strong> How do you score NF6: r⊑s?</summary>

<ol><li>Check relation-head inclusion Head(r)⊆Head(s).</li><li>Check relation-tail inclusion Tail(r)⊆Tail(s).</li><li>Compute subsumption loss for both inclusions.</li><li>Average the two losses.</li></ol><b>Reference:</b> NF6 loss: L₆(r,s)=½[L_⊑(Head(r),Head(s))+L_⊑(Tail(r),Tail(s))].

</details>

<details>
<summary><strong>Q60.</strong> How do you score NF7: r₁∘r₂⊑s?</summary>

<ol><li>For the composed role inclusion, use Head(r₁) for the start side.</li><li>Use Tail(r₂) for the end side.</li><li>Require Head(r₁)⊆Head(s).</li><li>Require Tail(r₂)⊆Tail(s).</li><li>Average the two subsumption losses.</li></ol><b>Reference:</b> NF7 loss: L₇(r₁,r₂,s)=½[L_⊑(Head(r₁),Head(s))+L_⊑(Tail(r₂),Tail(s))].

</details>

<details>
<summary><strong>Q61.</strong> Box2EL negative samples vs TransE negative samples — what is the discriminator?</summary>

Ask: is negative sampling required for training?<br><ol><li>TransE relies on positive/negative triple ranking.</li><li>Box2EL can train from positive axiom losses alone.</li><li>Box2EL may still add negative samples to improve convergence/efficiency.</li></ol><b>Reference:</b> Box2EL negative sampling is optional; TransE negative sampling is central to its margin-ranking setup.

</details>

<details>
<summary><strong>Q62.</strong> How are Box2EL negative samples generated?</summary>

<ol><li>Start from an NF3 axiom C⊑∃r.D.</li><li>Randomly replace C or D with a different concept.</li><li>Treat the resulting existential axiom as a negative sample.</li><li>Use a negative-sample loss to keep the corresponding bumped boxes apart.</li></ol><b>Reference:</b> Box2EL generates negatives for NF3 by corrupting one concept in C⊑∃r.D.

</details>

<details>
<summary><strong>Q63.</strong> How do you interpret Box2EL negative-sample loss?</summary>

<ol><li>Compute μ(A,B)=||max{0,d(A,B)+γ}|| for relevant bumped boxes.</li><li>If boxes overlap, μ=0 and loss is high.</li><li>As a gap appears, μ increases and loss falls toward the target δ.</li><li>If boxes are pushed too far beyond δ, loss rises again.</li></ol><b>Reference:</b> L_not⊑ uses squared terms (δ−μ)² to control how unlikely corrupted existential samples become.

</details>

<details>
<summary><strong>Q64.</strong> How is Box2EL trained after losses are defined?</summary>

<ol><li>Normalize axioms into the seven forms.</li><li>Compute the corresponding positive losses.</li><li>Optionally generate negative NF3 samples and compute negative losses.</li><li>Optimize all embedding parameters using stochastic gradient descent.</li></ol><b>Reference:</b> Box2EL learns concept boxes, relation boxes, and bump vectors by minimizing its axiom losses.

</details>

<details>
<summary><strong>Q65.</strong> How do you recognize the end-to-end embedding paradigm?</summary>

<ol><li>Define embeddings directly for entities/concepts/relations.</li><li>Define geometric score functions.</li><li>Define losses over facts or axioms.</li><li>Optimize embeddings directly by minimizing those losses.</li></ol><b>Reference:</b> End-to-end KG/ontology embedding learns vectors/regions from score and loss functions, as in TransE-style and Box2EL-style models.

</details>

<details>
<summary><strong>Q66.</strong> How do you recognize the sequence learning paradigm?</summary>

<ol><li>Convert the KG/ontology into sequences analogous to sentences.</li><li>Include entities, concepts, and relations as sequence tokens.</li><li>Generate sequences from graph walks or serialized axioms.</li><li>Train a word embedding model over those sequences.</li></ol><b>Reference:</b> Sequence learning turns KG/ontology structure into token sequences and learns embeddings with models such as Word2Vec/CBOW.

</details>

<details>
<summary><strong>Q67.</strong> How do you recognize the graph propagation paradigm?</summary>

<ol><li>Convert the knowledge source into a graph if it is not already one.</li><li>Represent entities/concepts/relations as nodes or graph features.</li><li>Use a graph propagation model, such as a GNN, to aggregate neighbourhood information.</li><li>Use the learned graph features as embeddings.</li></ol><b>Reference:</b> Graph propagation models learn entity embeddings from graph structure/features.

</details>

<details>
<summary><strong>Q68.</strong> End-to-end vs sequence learning vs graph propagation — what is the discriminator?</summary>

Ask: what is the training object?<br><ol><li>Scores/losses over facts or axioms: end-to-end.</li><li>Token sequences from walks/axioms: sequence learning.</li><li>Message passing over graph structure: graph propagation.</li></ol><b>Reference:</b> The lecture contrasts direct scoring models, sequence-learning conversions, and graph-feature propagation models.

</details>

<details>
<summary><strong>Q69.</strong> Why do text-aware ontology embeddings use annotations?</summary>

<ol><li>Check whether the ontology contains labels, names, descriptions, definitions, or comments.</li><li>Keep formal axioms as semantic structure.</li><li>Extract annotation text as lexical evidence.</li><li>Train embeddings that correlate formal entities with natural-language words.</li></ol><b>Reference:</b> Text-aware ontology embedding uses both formally defined semantics and textual annotations.

</details>

<details>
<summary><strong>Q70.</strong> What is OWL2Vec* in procedural terms?</summary>

<ol><li>Start with an OWL ontology, optionally after reasoning.</li><li>Transform it into an RDF graph.</li><li>Generate structure, lexical, and combined documents.</li><li>Train a word embedding model over those documents.</li><li>Output vectors for IRIs, words, and entities.</li></ol><b>Reference:</b> OWL2Vec* is a text-aware ontology embedding method in the sequence learning paradigm.

</details>

<details>
<summary><strong>Q71.</strong> How do you transform OWL to an RDF graph in OWL2Vec*?</summary>

<ol><li>Take OWL axioms and entities.</li><li>Apply an OWL-to-RDF graph mapping or projection rules.</li><li>Represent complex OWL restrictions using RDF triples, often with intermediate nodes.</li><li>Use the resulting graph for walks/sequences.</li></ol><b>Reference:</b> OWL2Vec* first converts an OWL ontology into an RDF graph; reasoning can be enabled before sequence generation.

</details>

<details>
<summary><strong>Q72.</strong> W3C OWL-to-RDF mapping vs projection rules — what is the discriminator?</summary>

Ask: preserve OWL structure explicitly or simplify it into direct triples?<br><ol><li>W3C mapping: keeps richer semantics using RDF structures such as restriction nodes.</li><li>Projection rules: create simpler triples.</li><li>Projection is straightforward but may lose or shift some semantics.</li></ol><b>Reference:</b> OWL2Vec* can use standard OWL-to-RDF mapping or simpler projection rules.

</details>

<details>
<summary><strong>Q73.</strong> How do you create the OWL2Vec* structure document?</summary>

<ol><li>Start from the RDF/ontology graph.</li><li>Generate entity-IRI sequences using random walks.</li><li>Optionally enrich walks with Weisfeiler-Lehman subtree kernels.</li><li>Serialize axioms into entity/relation token sequences.</li><li>Store these as sentences of entity IRIs.</li></ol><b>Reference:</b> The structure document contains sequences of entity IRIs from walks, WL-style structures, and serialized axioms.

</details>

<details>
<summary><strong>Q74.</strong> How do you create the OWL2Vec* lexical document?</summary>

<ol><li>Take entity sequences from the structure document and replace IRIs with their words/labels.</li><li>Extract words from annotation properties such as labels, definitions, and comments.</li><li>Store the resulting word sequences as lexical sentences.</li></ol><b>Reference:</b> The lexical document contains sentences of words derived from entity labels and textual annotations.

</details>

<details>
<summary><strong>Q75.</strong> How do you create the OWL2Vec* combined document?</summary>

<ol><li>Start from an entity-IRI sequence.</li><li>Select one or more entities in the sequence.</li><li>Replace selected entities with their lexical words while leaving other IRIs intact.</li><li>Use the mixed sequence to connect entity tokens with word tokens.</li></ol><b>Reference:</b> The combined document contains sentences mixing entity IRIs and words, creating correlations between formal entities and lexical text.

</details>

<details>
<summary><strong>Q76.</strong> Structure vs lexical vs combined OWL2Vec* documents — what is the discriminator?</summary>

Ask: what token types appear in the sentence?<br><ol><li>Only entity IRIs: structure document.</li><li>Only words: lexical document.</li><li>Both IRIs and words: combined document.</li></ol><b>Reference:</b> OWL2Vec* trains over structure, lexical, and combined documents.

</details>

<details>
<summary><strong>Q77.</strong> How do you train the final OWL2Vec* embedding model?</summary>

<ol><li>Collect the structure, lexical, and combined documents.</li><li>Optionally pre-train on an external text corpus.</li><li>Train a word embedding model, specifically CBOW in the lecture.</li><li>Learn vectors for both words and IRIs because both appear as vocabulary items.</li><li>Construct entity embeddings from IRI vectors and/or averaged word vectors.</li></ol><b>Reference:</b> OWL2Vec* outputs IRI vectors, word vectors, and entity embeddings.

</details>

<details>
<summary><strong>Q78.</strong> How do random walks support KG/ontology sequence learning?</summary>

<ol><li>Convert the KG/ontology to a graph.</li><li>Start at a node and traverse adjacent nodes/edges to form a path.</li><li>Treat the path as a sentence of entity/relation tokens.</li><li>Train a word embedding model on many such paths.</li></ol><b>Reference:</b> Random-walk paths over the graph become sequences for sequence-learning embeddings.

</details>

<details>
<summary><strong>Q79.</strong> How does axiom serialization support sequence learning?</summary>

<ol><li>Take a logical axiom.</li><li>Linearize its symbols into an ordered token sequence.</li><li>Keep concept, role, and constructor tokens in the sequence.</li><li>Train a sequence model over these axiom sentences.</li></ol><b>Reference:</b> Axioms can be transformed directly into sequences, for example through syntax serialization.

</details>

<details>
<summary><strong>Q80.</strong> How should you connect this week’s text embeddings to KG/ontology embeddings?</summary>

<ol><li>Text embeddings show how symbols become vectors.</li><li>KG embeddings extend this to entities and relations.</li><li>Ontology embeddings extend it further to concepts, regions, axioms, and annotations.</li><li>Use the same core idea: preserve useful symbolic relationships geometrically.</li></ol><b>Reference:</b> Week 3 begins with text semantic embedding, then moves to KG embedding and ontology embedding.

</details>

<details>
<summary><strong>Q81.</strong> What is the safest exam answer when an embedding only approximates reasoning?</summary>

<ol><li>State that embeddings are not exact logical reasoners by default.</li><li>They encode plausibility, similarity, or approximate semantic constraints geometrically.</li><li>Use them for uncertain reasoning, prediction, and neural-symbolic integration.</li><li>Do not claim exact entailment unless the model/loss explicitly guarantees it.</li></ol><b>Reference:</b> Semantic embeddings support fuzzy/incomplete/approximate reasoning rather than replacing formal reasoning wholesale.

</details>
