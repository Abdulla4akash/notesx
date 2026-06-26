---
subject: COMP64802
chapter: 38
title: "Lecture 8 — Flashcards"
language: en
---

# Lecture 8 — Flashcards

60 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> How do you recognize a clustering problem?</summary>

Use clustering when the data are unlabelled and the task is to discover group structure rather than predict given labels.
Steps:
1. Treat each object as a data point.
2. Decide what similarity means for the data.
3. Group points so within-group similarity is high and between-group similarity is low.
Reference: clustering = grouping data points into clusters with high intra-cluster similarity and low inter-cluster similarity.

</details>

<details>
<summary><strong>Q2.</strong> Discriminator: clustering vs supervised classification — are labels given?</summary>

Use clustering when labels are not given; the algorithm infers groups from the data itself.
Use supervised classification when labelled examples define the target classes.
Reference: clustering is unsupervised learning because there are no labels.

</details>

<details>
<summary><strong>Q3.</strong> How is clustering a representation-learning method?</summary>

Use clustering as representation learning when raw points are replaced or augmented by group membership.
Steps:
1. Start with raw data points.
2. Infer cluster assignments.
3. Use the assignment or cluster structure as a new representation of the data.
Reference: clustering assigns structure to data by representing points through group membership.

</details>

<details>
<summary><strong>Q4.</strong> Discriminator: intra-cluster vs inter-cluster similarity — are the points in the same cluster?</summary>

If the points are in the same cluster, discuss intra-cluster similarity and aim for it to be high.
If the points are in different clusters, discuss inter-cluster similarity and aim for it to be low.
Reference: clustering seeks high intra-cluster similarity and low inter-cluster similarity.

</details>

<details>
<summary><strong>Q5.</strong> How do you state the informal goal of a clustering algorithm?</summary>

Use this phrasing: put similar objects together and keep dissimilar objects apart.
Operationally:
1. Define a similarity or distance notion.
2. Make within-cluster similarity large.
3. Make between-cluster similarity small.
Reference: clustering groups data points into clusters with high intra-cluster and low inter-cluster similarity.

</details>

<details>
<summary><strong>Q6.</strong> What checklist should you use to evaluate a clustering algorithm?</summary>

Check whether the method: 1. handles the relevant data types; 2. scales with data size; 3. scales with dimension; 4. needs little domain knowledge for input parameters; 5. is robust; 6. is interpretable and usable; 7. has theory guarantees; 8. can incorporate user-specified constraints if needed.
Reference: these are the desirable properties of clustering algorithms listed in the sheet.

</details>

<details>
<summary><strong>Q7.</strong> Discriminator: is K-means suitable for the data type? — is a mean/centroid meaningful?</summary>

Use K-means only when cluster centres/means are meaningful for the data.
If the data type has no natural mean, K-means is problematic.
Reference: K-means relies on means/centroids and is only applicable when a mean is defined.

</details>

<details>
<summary><strong>Q8.</strong> What input parameter does K-means require before running?</summary>

Choose the number of clusters before the algorithm starts.
Procedure:
1. Decide the desired number of clusters.
2. Use that value as K.
3. Run the assignment/update loop using K centres.
Reference: K-means requires K, the number of clusters, in advance.

</details>

<details>
<summary><strong>Q9.</strong> How do you run K-means clustering step by step?</summary>

Method:
1. Choose K, the number of clusters.
2. Initialize K cluster centres, randomly if necessary.
3. Assign each object to its nearest cluster centre.
4. Re-estimate the K centres using the current memberships.
5. Repeat assignment and re-estimation until no object changes membership in the last iteration.
Reference: K-means partitions data points x_1,...,x_N into K clusters by alternating assignment and centre-update steps.

</details>

<details>
<summary><strong>Q10.</strong> What is the K-means assignment step?</summary>

Use it after centres are available.
Method:
1. For each point x, compute its distance to each centre μ_k.
2. Find the nearest centre.
3. Assign x to that centre's cluster.
Reference: the assignment step decides class memberships by assigning each object to the nearest cluster centre.

</details>

<details>
<summary><strong>Q11.</strong> What is the K-means update step?</summary>

Use it after memberships are fixed.
Method:
1. For each cluster C_k, collect the points currently assigned to it.
2. Re-estimate the centre μ_k from those assigned points.
3. Use the new centres in the next assignment step.
Reference: K-means re-estimates the K cluster centres assuming the current memberships are correct.

</details>

<details>
<summary><strong>Q12.</strong> When does the K-means loop stop?</summary>

Stop when the latest assignment/update cycle causes no object to change membership.
Check:
1. Compare current cluster assignments with the previous iteration.
2. If all memberships are unchanged, terminate.
3. Otherwise, continue.
Reference: repeat until none of the N objects changed membership in the last iteration.

</details>

<details>
<summary><strong>Q13.</strong> What is a cluster centre in K-means used for?</summary>

Use the centre as the representative point of a cluster.
In the algorithm:
1. Assign points by nearest centre.
2. Re-estimate centres from memberships.
3. Use centres in the objective as μ_k for cluster C_k.
Reference: μ_k denotes the centre of cluster C_k in the K-means objective.

</details>

<details>
<summary><strong>Q14.</strong> How do you write and use the K-means objective?</summary>

Use it to measure total within-cluster squared distance.
Method:
1. For each cluster C_k, compare every assigned point x with its centre μ_k.
2. Square the Euclidean distance ||x - μ_k||^2.
3. Sum over points in each cluster.
4. Sum over all K clusters.
Reference: K-means objective = Σ_{k=1}^K Σ_{x∈C_k} ||x-μ_k||^2.

</details>

<details>
<summary><strong>Q15.</strong> How does the K-means objective encode intra-cluster similarity?</summary>

Use the objective as a tightness score.
Reasoning:
1. Small distance to the centre means points in the same cluster are close.
2. Close points are treated as similar.
3. Minimising the objective increases intra-cluster similarity.
Reference: K-means optimises intra-cluster similarity by minimising squared distances to cluster centres.

</details>

<details>
<summary><strong>Q16.</strong> How do you explain the variance interpretation of K-means?</summary>

Use this interpretation when asked what the objective encourages.
Method:
1. Minimising squared distances to centres makes each cluster internally tight.
2. This minimises total intra-cluster variance.
3. The slides also state this maximises total inter-cluster variance.
Reference: K-means minimises total intra-cluster variance and maximises total inter-cluster variance.

</details>

<details>
<summary><strong>Q17.</strong> Discriminator: finite convergence vs global optimum — did the algorithm stop, or find the best clustering?</summary>

Finite convergence means K-means eventually stops. It does not mean the final clustering is globally optimal.
Use this answer when a question asks whether convergence guarantees the best solution: no, K-means may terminate at a local optimum.
Reference: K-means is guaranteed to converge in a finite number of iterations, but often terminates at a local optimum.

</details>

<details>
<summary><strong>Q18.</strong> Why does initialization matter in K-means?</summary>

Use this when explaining local optima.
Reasoning:
1. Initial centres determine the first memberships.
2. Early memberships affect later centre updates.
3. The algorithm can converge to different local optima from different initializations.
Reference: K-means may terminate at a local optimum, so initialization is important.

</details>

<details>
<summary><strong>Q19.</strong> How do you recognize a K-means shape failure?</summary>

Look for clusters that are not well represented by compact regions around centroids.
Discriminator question: can each true cluster be captured by proximity to one centre?
If no, K-means may cut across the natural structure.
Reference: K-means is not suitable for some non-convex clusters and struggles when clusters are not roughly centroid-separable.

</details>

<details>
<summary><strong>Q20.</strong> What are the main strengths of K-means?</summary>

Use this list when comparing methods:
1. Simple.
2. Easy to implement and debug.
3. Has an intuitive objective.
4. Promotes high intra-cluster similarity and low inter-cluster similarity.
5. Guaranteed to converge.
Reference: the sheet lists these as K-means strengths.

</details>

<details>
<summary><strong>Q21.</strong> What are the main weaknesses of K-means?</summary>

Use this list when explaining why another method may be needed:
1. K must be specified in advance.
2. A mean/centroid must be defined.
3. It may converge to a local optimum.
4. Initialization matters.
5. It is unsuitable for some non-convex clusters.
6. It handles noise and outliers poorly.
Reference: the sheet lists these as K-means weaknesses.

</details>

<details>
<summary><strong>Q22.</strong> Discriminator: K-means or spectral clustering — is the cluster structure centroid-separable?</summary>

If clusters are compact around centres, K-means is a natural baseline.
If the structure is non-convex or not captured by distance to centroids, spectral clustering is motivated.
Reference: spectral clustering is introduced after K-means limitations and is useful for hard non-convex clustering problems.

</details>

<details>
<summary><strong>Q23.</strong> How does K-means measure similarity?</summary>

Use small Euclidean distance as similarity.
Method:
1. Compute distance from a point to each centre.
2. Treat smaller distance as higher similarity.
3. Assign to the nearest centre.
Reference: K-means measures similarity as small Euclidean distance.

</details>

<details>
<summary><strong>Q24.</strong> Discriminator: distance-based vs model-based clustering — distance or density?</summary>

Use distance-based clustering when assignments are made by proximity under a distance notion.
Use model-based clustering when assignments are based on probability density estimation rather than direct distance.
Reference: distance-based methods rely on spatial proximity to centroids; model-based methods rely on probability density estimation.

</details>

<details>
<summary><strong>Q25.</strong> How do other distance measures fit into clustering?</summary>

Use another distance measure by keeping the same principle: smaller distance means greater similarity.
Procedure:
1. Choose a distance appropriate for the data.
2. Compute pairwise or point-to-centre distances.
3. Interpret small distance as high similarity.
Reference: the sheet notes that other distance measures could be used, with similarity still interpreted as small distance.

</details>

<details>
<summary><strong>Q26.</strong> What is the core idea of spectral clustering?</summary>

Use eigenvectors to create a clustering-friendly representation.
Procedure:
1. Build a matrix from pairwise data relationships.
2. Compute eigenvectors of that matrix-derived object.
3. Use those eigenvectors to represent the data.
4. Cluster the new representation.
Reference: spectral clustering algorithms cluster data points using eigenvectors of matrices derived from the data.

</details>

<details>
<summary><strong>Q27.</strong> What is the high-level spectral clustering pipeline?</summary>

Method:
1. Start with data points.
2. Compute pairwise similarities.
3. Store them in a similarity matrix W.
4. Interpret W as a weighted graph.
5. Build the degree matrix D.
6. Compute the Laplacian L = D - W.
7. Use the first k eigenvectors to form an embedding.
8. Cluster the embedded rows.
Reference: spectral clustering builds a similarity graph, computes a graph Laplacian, extracts eigenvectors, then clusters the spectral representation.

</details>

<details>
<summary><strong>Q28.</strong> How do you define a similarity weight between two data points?</summary>

Use a chosen similarity function.
Method:
1. Take two data points x_i and x_j.
2. Apply the similarity function s to the pair.
3. Store the result as w_ij.
Reference: w_ij=s(x_i,x_j), where s is a chosen similarity function.

</details>

<details>
<summary><strong>Q29.</strong> How do you build a weighted graph from data points?</summary>

Method:
1. Create one vertex for each data point.
2. Compute similarity weights w_ij.
3. Add an edge between i and j when w_ij > 0.
4. Store w_ij as the edge weight.
Reference: the dataset becomes a weighted graph G=(V,E,W), with vertices as data points, edges where w_ij>0, and W as edge weights.

</details>

<details>
<summary><strong>Q30.</strong> How do you compute Gaussian-kernel similarity?</summary>

Method:
1. Take two points x_i and x_j.
2. Compute the squared distance ||x_i - x_j||^2.
3. Divide by 2σ^2.
4. Negate the result.
5. Exponentiate.
Reference: w_ij=exp(-||x_i-x_j||^2/(2σ^2)).

</details>

<details>
<summary><strong>Q31.</strong> How do you interpret the Gaussian kernel value?</summary>

Use the value as distance-turned-into-similarity.
Rules:
1. w_ij close to 1 means the points are very similar.
2. w_ij=1 when x_i=x_j.
3. w_ij close to 0 means the points are very dissimilar.
4. w_ij approaches 0 as distance grows.
Reference: the Gaussian kernel has range (0,1].

</details>

<details>
<summary><strong>Q32.</strong> What role does σ play in Gaussian similarity?</summary>

Use σ as the distance scale in the similarity calculation.
Method:
1. Compute distance between points.
2. Compare that distance relative to σ.
3. Larger or smaller σ changes how quickly similarity decays with distance.
Reference: σ controls how distance is scaled inside exp(-||x_i-x_j||^2/(2σ^2)).

</details>

<details>
<summary><strong>Q33.</strong> How do you construct the similarity matrix W?</summary>

Method:
1. List data points x_1,...,x_N.
2. For every pair (i,j), compute w_ij=s(x_i,x_j).
3. Place w_ij in row i, column j.
4. The result is an N×N matrix of pairwise similarities.
Reference: W=(w_ij)_{i,j=1}^N.

</details>

<details>
<summary><strong>Q34.</strong> How do you check whether the similarity matrix is symmetric?</summary>

Check whether the similarity function is symmetric.
Method:
1. Compare s(x_i,x_j) with s(x_j,x_i).
2. If they are equal for all pairs, then w_ij=w_ji.
3. Therefore W is symmetric.
Reference: W is square and symmetric when w_ij=s(x_i,x_j)=s(x_j,x_i)=w_ji.

</details>

<details>
<summary><strong>Q35.</strong> How do you compute the degree of a node in the similarity graph?</summary>

Method:
1. Select node i.
2. Look across row i of W.
3. Sum all weights w_ij over j.
4. The result is the total connection strength of node i.
Reference: d_i=Σ_j w_ij.

</details>

<details>
<summary><strong>Q36.</strong> How do you construct the degree matrix D?</summary>

Method:
1. Compute every node degree d_i.
2. Put d_1,...,d_N on the diagonal.
3. Put 0 in all off-diagonal entries.
Reference: D=diag(d_1,...,d_N).

</details>

<details>
<summary><strong>Q37.</strong> How do you compute the unnormalised graph Laplacian?</summary>

Method:
1. Build the similarity matrix W.
2. Compute the degree matrix D.
3. Subtract W from D.
Reference: the unnormalised graph Laplacian is L=D-W.

</details>

<details>
<summary><strong>Q38.</strong> What information does the graph Laplacian combine?</summary>

Use L when you need a matrix encoding graph connectivity.
Interpretation:
1. D records how strongly each node is connected overall.
2. W records how strongly each pair of nodes is connected.
3. L=D-W combines both and its eigenvectors reveal connectivity structure.
Reference: the graph Laplacian is central to spectral clustering because its eigenvectors encode graph connectivity.

</details>

<details>
<summary><strong>Q39.</strong> How do you use the Laplacian quadratic form identity?</summary>

Use it to interpret smoothness over the graph.
Method:
1. Take any vector y over the nodes.
2. For every pair (i,j), compute (y_i-y_j)^2.
3. Weight that difference by w_ij.
4. Sum over all pairs and multiply by 1/2.
5. A small value means strongly connected nodes have similar y-values.
Reference: y^T L y = (1/2) Σ_{i,j} w_ij (y_i-y_j)^2.

</details>

<details>
<summary><strong>Q40.</strong> Why does a large edge weight strongly penalise different y-values?</summary>

Use the quadratic form.
Reasoning:
1. The term for nodes i and j is w_ij(y_i-y_j)^2.
2. If w_ij is large, the same difference contributes more to y^T L y.
3. Therefore connected/similar nodes are encouraged to have similar y-values.
Reference: y^T L y = (1/2) Σ_{i,j} w_ij (y_i-y_j)^2.

</details>

<details>
<summary><strong>Q41.</strong> What spectral facts about the unnormalised Laplacian should you remember?</summary>

Use these facts when reasoning about eigenvalues:
1. L is symmetric.
2. L is positive semi-definite.
3. Its eigenvalues are real and non-negative.
4. The smallest eigenvalue is 0.
Reference: the Laplacian has eigenvalues ordered 0=λ_1≤λ_2≤...≤λ_N.

</details>

<details>
<summary><strong>Q42.</strong> What is the eigenvector for eigenvalue 0 when the graph is connected?</summary>

Use the constant one vector.
Check:
1. The graph must be connected.
2. The smallest eigenvalue is 0.
3. The corresponding eigenvector is constant on all nodes.
Reference: for a connected graph, the eigenvector for eigenvalue 0 is 1=(1,1,...,1)^T.

</details>

<details>
<summary><strong>Q43.</strong> How do you infer the number of connected components from the Laplacian?</summary>

Method:
1. Compute the eigenvalues of L.
2. Count how many eigenvalues are equal to 0.
3. That count is the number of connected components.
Reference: the algebraic multiplicity of eigenvalue 0 equals the number of connected components of the graph.

</details>

<details>
<summary><strong>Q44.</strong> What spans the eigenspace of eigenvalue 0 for a disconnected graph?</summary>

Use component indicator vectors.
Method:
1. Identify each connected component C_1,...,C_k.
2. Build one indicator vector for each component.
3. These vectors span the zero-eigenvalue eigenspace.
Reference: the eigenspace of eigenvalue 0 is spanned by 1_{C_1},...,1_{C_k}.

</details>

<details>
<summary><strong>Q45.</strong> How do you build an indicator vector for a connected component?</summary>

Method:
1. Choose a component C_i.
2. For each node, write 1 if the node belongs to C_i.
3. Write 0 if the node is outside C_i.
Reference: 1_{C_i} has entries 1 on component C_i and 0 elsewhere.

</details>

<details>
<summary><strong>Q46.</strong> Discriminator: connected vs disconnected graph — how many zero eigenvalues?</summary>

If the graph is connected, there is one zero eigenvalue and the associated eigenvector is the all-ones vector.
If the graph has k connected components, there are k zero eigenvalues and the zero eigenspace is spanned by k component indicator vectors.
Reference: zero-eigenvalue multiplicity equals the number of connected components.

</details>

<details>
<summary><strong>Q47.</strong> How do Laplacian eigenvectors reveal perfect components?</summary>

Use this reasoning for disconnected graphs.
Steps:
1. A disconnected graph separates into independent components.
2. The Laplacian structure separates accordingly.
3. The first k eigenvectors behave as component indicators.
4. These vectors directly encode cluster membership.
Reference: when the graph has k connected components, the first k eigenvectors are the indicator vectors of those components.

</details>

<details>
<summary><strong>Q48.</strong> What are the inputs to the spectral clustering algorithm in the sheet?</summary>

Use two inputs:
1. A similarity weights matrix W in R^(N×N).
2. A positive integer k, the number of clusters to construct.
Reference: spectral clustering takes W ∈ R^(N×N) and cluster count k.

</details>

<details>
<summary><strong>Q49.</strong> How do you perform spectral clustering step by step?</summary>

Method:
1. For each node i, compute d_i = Σ_j w_ij.
2. Build D = diag(d_1,...,d_N).
3. Compute L = D - W.
4. Compute the first k eigenvectors v_1,...,v_k of L.
5. Build V ∈ R^(N×k) with those eigenvectors as columns.
6. Treat each row of V as a projected data point in R^k.
7. Cluster the rows of V using K-means.
8. Return clusters C_1,...,C_k.
Reference: this is the spectral clustering algorithm from the sheet.

</details>

<details>
<summary><strong>Q50.</strong> Which eigenvectors are used in spectral clustering?</summary>

Use the first k eigenvectors of the Laplacian L, ordered by the eigenvalue sequence starting from 0.
Procedure:
1. Compute eigenvectors of L.
2. Order them by increasing eigenvalue.
3. Select v_1,...,v_k.
Reference: the algorithm computes the first k eigenvectors of L.

</details>

<details>
<summary><strong>Q51.</strong> How do you construct the spectral embedding matrix V?</summary>

Method:
1. Compute selected eigenvectors v_1,...,v_k.
2. Place them as columns of a matrix.
3. The result has N rows and k columns.
Reference: V ∈ R^(N×k) with v_1,...,v_k as column vectors.

</details>

<details>
<summary><strong>Q52.</strong> How do you interpret the rows of V in spectral clustering?</summary>

Use each row as the new representation of one original data point.
Method:
1. Row i of V collects the coordinates of point i across the selected eigenvectors.
2. Treat that row as a projected point in R^k.
3. Cluster these projected points.
Reference: the rows of V are treated as projected data points in ℝ^k; the slides call this dimension reduction.

</details>

<details>
<summary><strong>Q53.</strong> Discriminator: K-means in original space vs K-means in spectral clustering — what is being clustered?</summary>

Plain K-means clusters the original data points using distance to centres.
Spectral clustering first builds V from Laplacian eigenvectors, then runs K-means on the rows of V.
Reference: spectral clustering does not run K-means directly on the original data; it runs K-means on the spectral embedding.

</details>

<details>
<summary><strong>Q54.</strong> Why can spectral clustering overcome some K-means limitations?</summary>

Use this explanation for non-centroid-separable structure.
Reasoning:
1. K-means sees only distance to centres in the original space.
2. Spectral clustering first represents pairwise similarities as a graph.
3. Laplacian eigenvectors encode graph connectivity.
4. The resulting low-dimensional embedding can be easier to cluster.
Reference: spectral clustering is useful for hard non-convex clustering problems and obtains a low-dimensional representation that can be clustered.

</details>

<details>
<summary><strong>Q55.</strong> What are the stated strengths of spectral clustering?</summary>

Use this list when comparing it with K-means:
1. Interpretable using basic linear algebra.
2. Efficient to implement.
3. Useful for hard non-convex clustering problems.
4. Produces an explicit low-dimensional representation.
5. Empirically successful across data problems.
Reference: these are the spectral clustering strengths listed in the sheet.

</details>

<details>
<summary><strong>Q56.</strong> How does spectral clustering connect graph theory and linear algebra?</summary>

Use this bridge explanation:
1. Graph theory supplies vertices, edges, weights, and connected components.
2. Linear algebra supplies matrices, eigenvalues, eigenvectors, and the Laplacian.
3. Spectral clustering uses eigenvectors of graph-derived matrices to recover cluster structure.
Reference: the method uses graph-theoretic objects and linear-algebraic objects together.

</details>

<details>
<summary><strong>Q57.</strong> What is the main conceptual reason eigenvectors help in spectral clustering?</summary>

Use the connected-component theorem as motivation.
Reasoning:
1. In an ideal disconnected graph, zero-eigenvalue eigenvectors are component indicators.
2. Indicator vectors encode cluster membership.
3. For data graphs, the first k eigenvectors provide a representation related to this component structure.
Reference: the connection between clusters and the Laplacian is that zero-eigenvalue eigenspaces are spanned by connected-component indicator vectors.

</details>

<details>
<summary><strong>Q58.</strong> Discriminator: similarity matrix W vs degree matrix D vs Laplacian L — what does each store?</summary>

W stores pairwise similarities between data points.
D stores total connection strength per node on the diagonal.
L combines them as D-W to encode graph connectivity for spectral analysis.
Reference: W=(w_ij), D=diag(d_1,...,d_N), and L=D-W.

</details>

<details>
<summary><strong>Q59.</strong> How do you answer a formula-only exam prompt on this lecture?</summary>

Write the core chain:
1. Similarity weight: w_ij=s(x_i,x_j).
2. Gaussian similarity: w_ij=exp(-||x_i-x_j||^2/(2σ^2)).
3. Degree: d_i=Σ_j w_ij.
4. Degree matrix: D=diag(d_1,...,d_N).
5. Laplacian: L=D-W.
6. Quadratic form: y^T L y = 1/2 Σ_ij w_ij(y_i-y_j)^2.
Reference: these are the collected spectral clustering formulas in the sheet.

</details>

<details>
<summary><strong>Q60.</strong> How do you answer an algorithm-only exam prompt on this lecture?</summary>

Separate the two algorithms.
K-means: choose K, initialize centres, assign points to nearest centres, re-estimate centres, repeat until memberships stop changing.
Spectral clustering: compute W, D, L, take first k eigenvectors, form V, cluster rows of V with K-means, return clusters.
Reference: the sheet gives both the K-means algorithm and the spectral clustering algorithm step by step.

</details>
