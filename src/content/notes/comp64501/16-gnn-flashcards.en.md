---
subject: COMP64501
chapter: 16
title: "Graph Neural Networks — Flashcards"
language: en
---

# Graph Neural Networks — Flashcards

77 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> When should data be treated as a graph rather than a regular array?</summary>

Use: ask whether the data is mainly objects plus relationships, not a fixed 1D/2D ordering.
1. Make each object a node.
2. Make each relationship an edge.
3. Attach node features and edge features where available.
Discriminator: does the meaning come from connections between objects?
Reference: a graph is G=(V,E), with nodes V, edges E, and optional node/edge data.

</details>

<details>
<summary><strong>Q2.</strong> How do you construct a graph representation for a new domain?</summary>

Use:
1. Choose what counts as a node.
2. Choose what relation creates an edge.
3. Decide whether edges are directed or undirected.
4. Decide whether features live on nodes, edges, or both.
5. Store connectivity with E or A and features with X/edge features.
Reference: G=(V,E); node n has feature x_n, and rows of X store node features.

</details>

<details>
<summary><strong>Q3.</strong> How do you recognize a simple graph?</summary>

Use the three checks:
1. At most one edge between any pair of nodes.
2. Edges have no direction.
3. No self-edge connects a node to itself.
Discriminator: are there multi-edges, directed edges, or self-loops? If yes, it is not simple.
Reference: the sheet first focuses on simple undirected graphs with no self-edges.

</details>

<details>
<summary><strong>Q4.</strong> Directed vs undirected edge: what decides whether A must be symmetric?</summary>

Use: ask whether an edge from n to m automatically implies an edge from m to n.
- If yes: undirected, so mirror both entries.
- If no: directed, so A_nm and A_mn can differ.
Reference: for undirected graphs, A=A^T.

</details>

<details>
<summary><strong>Q5.</strong> How do you use the notation G=(V,E), N(n), x_n, and X?</summary>

Use:
1. V is the node/vertex set.
2. E is the edge/link set.
3. N(n) is the set of neighbours of node n.
4. x_n is the feature vector for node n.
5. X stacks node features as rows.
Reference: x_n in R^D and X in R^{N x D}, with row n equal to x_n^T.

</details>

<details>
<summary><strong>Q6.</strong> How do you build the node feature matrix X?</summary>

Use:
1. Fix a temporary node order 1,...,N.
2. Put node n's feature vector x_n into row n.
3. Keep the same node order when building A.
Discriminator: does each row correspond to exactly one node?
Reference: X in R^{N x D}; row n is x_n^T.

</details>

<details>
<summary><strong>Q7.</strong> How do you build an adjacency matrix A from a graph?</summary>

Use:
1. Fix one node order for rows and columns.
2. For each ordered pair (n,m), check whether an edge from n to m exists.
3. Set A_nm=1 if it exists, otherwise 0.
4. For undirected graphs, mirror entries so A_nm=A_mn.
Reference: A_nm=1 if there is an edge from node n to node m, and 0 otherwise.

</details>

<details>
<summary><strong>Q8.</strong> Why can the same graph have different adjacency matrices?</summary>

Use: separate the abstract graph from the chosen node order.
1. Reorder the nodes.
2. The same edges now appear in different rows/columns.
3. A changes even though G does not.
Discriminator: did the graph change, or only the row/column ordering?
Reference: under permutation P, X~ = PX and A~ = P A P^T.

</details>

<details>
<summary><strong>Q9.</strong> Why can’t a standard fixed-array neural network use A naively?</summary>

Use: test whether arbitrary relabelling changes the input array.
1. Same graph + different node order gives a different A.
2. A standard array model may treat that as a different pattern.
3. A graph model must build the symmetry into the architecture.
Reference: adjacency matrices depend on node ordering, so GNNs need permutation invariance/equivariance.

</details>

<details>
<summary><strong>Q10.</strong> Why is data augmentation over all node permutations not enough?</summary>

Use:
1. Count possible node orderings.
2. There are N! permutations for N nodes.
3. Factorial growth makes exhaustive augmentation impractical.
Discriminator: would the model need to see every relabelling?
Reference: the sheet says permutation symmetry should be built into the network, not learned by all reorderings.

</details>

<details>
<summary><strong>Q11.</strong> What architectural fix solves the permutation problem?</summary>

Use:
1. Decide what the output represents: graph, node, or edge/pair.
2. Build invariance for graph-level outputs.
3. Build equivariance for node-level and pair-indexed outputs.
4. Use order-independent aggregation and shared parameters.
Reference: build permutation invariance or equivariance directly into the GNN architecture.

</details>

<details>
<summary><strong>Q12.</strong> How do you recognize or build a permutation matrix P?</summary>

Use:
1. Choose a node reordering pi.
2. Make an N x N matrix with exactly one 1 in each row and each column.
3. Put row n as the basis vector selecting the old row pi(n).
Discriminator: does every row and column contain exactly one 1?
Reference: P=(u_{pi(1)}^T; u_{pi(2)}^T; ...; u_{pi(N)}^T), with u_n the nth standard basis vector.

</details>

<details>
<summary><strong>Q13.</strong> How do you apply a node permutation to X?</summary>

Use:
1. Build the permutation matrix P.
2. Left-multiply X by P.
3. The rows of X are reordered because rows correspond to nodes.
Reference: X~ = P X.

</details>

<details>
<summary><strong>Q14.</strong> How do you apply a node permutation to A?</summary>

Use:
1. Build the permutation matrix P.
2. Left-multiply by P to reorder rows.
3. Right-multiply by P^T to reorder columns consistently.
Discriminator: does the object index nodes on both axes? If yes, permute both axes.
Reference: A~ = P A P^T.

</details>

<details>
<summary><strong>Q15.</strong> How do you decide whether a function should be permutation-invariant or permutation-equivariant?</summary>

Use the output-shape discriminator:
- One output for the whole graph: invariant.
- One output per node or node-pair/edge: equivariant to the same relabelling.
Reference: invariant means y(X~,A~)=y(X,A); equivariant means y(X~,A~)=P y(X,A) for node outputs.

</details>

<details>
<summary><strong>Q16.</strong> Permutation invariance: how do you check it?</summary>

Use:
1. Permute inputs with X~=PX and A~=PAP^T.
2. Run the function on original and permuted inputs.
3. The output must be identical.
Discriminator: should reordering nodes leave the output standing unchanged?
Reference: y(X~,A~)=y(X,A).

</details>

<details>
<summary><strong>Q17.</strong> Permutation equivariance: how do you check it?</summary>

Use:
1. Permute inputs with X~=PX and A~=PAP^T.
2. Run the function on both inputs.
3. The permuted-input output must equal the original output with rows permuted by P.
Discriminator: should reordering nodes reorder the output in the same way?
Reference: y(X~,A~)=P y(X,A).

</details>

<details>
<summary><strong>Q18.</strong> Which symmetry is needed for node-, edge-, and graph-level tasks?</summary>

Use:
1. Node-level: one output per node, so outputs must reorder with nodes.
2. Edge-level: one output per edge/pair, so outputs must relabel consistently with endpoint nodes.
3. Graph-level: one output per graph, so output must not change.
Reference: node-level uses permutation equivariance; graph-level uses permutation invariance; edge-level is pair-indexed equivariance.

</details>

<details>
<summary><strong>Q19.</strong> Why is a CNN-style neighbourhood convolution not directly valid on a general graph?</summary>

Use: ask whether each neighbour has a canonical position.
1. Images have fixed local positions, so weights can depend on position.
2. Graph neighbours have no natural order.
3. A weight for 'neighbour j' depends on arbitrary ordering.
Reference: z_i^{l+1}=f(sum_j w_j z_j^l + b) is not graph-permutation equivariant when w_j depends on ordering.

</details>

<details>
<summary><strong>Q20.</strong> How do you make a graph convolution permutation-equivariant?</summary>

Use:
1. Treat node i separately from its neighbours.
2. Aggregate neighbours with a symmetric operation such as sum.
3. Use one shared neighbour weight for all neighbours.
4. Use a separate self weight for node i.
5. Add bias and activation; share parameters across nodes.
Reference: z_i^{l+1}=f(w_neigh sum_{j in N(i)} z_j^l + w_self z_i^l + b).

</details>

<details>
<summary><strong>Q21.</strong> What is the key discriminator between ordinary CNN weighting and graph convolution weighting?</summary>

Use: ask what the weight is tied to.
- CNN-style on a grid: weight tied to fixed spatial position.
- Graph convolution: weight shared across unordered neighbours.
Reference: graph convolution uses a permutation-invariant neighbour sum and shared w_neigh.

</details>

<details>
<summary><strong>Q22.</strong> What checklist should a message-passing GNN layer satisfy?</summary>

Use:
1. Preserve the required permutation symmetry.
2. Use layers like a deep network.
3. Use nonlinear differentiable functions.
4. Handle variable-sized neighbourhoods/graphs.
5. Scale to large graphs.
6. Share parameters across nodes.
Reference: the sheet lists these as message-passing design principles.

</details>

<details>
<summary><strong>Q23.</strong> How do you run one full message-passing layer?</summary>

Use:
1. For each node n, collect h_m^l from neighbours m in N(n).
2. Aggregate the collected set with an order-invariant function to get z_n^l.
3. Combine z_n^l with h_n^l using an update function.
4. Output h_n^{l+1}.
Reference: z_n^l=Aggregate({h_m^l:m in N(n)}); h_n^{l+1}=Update(h_n^l,z_n^l).

</details>

<details>
<summary><strong>Q24.</strong> How do you initialize node embeddings in the message-passing framework?</summary>

Use:
1. Start before layer 0.
2. Set each node embedding equal to the observed node feature.
3. Then repeatedly aggregate and update through L layers.
Reference: h_n^0=x_n.

</details>

<details>
<summary><strong>Q25.</strong> How do you choose a valid aggregation function?</summary>

Use the two tests:
1. It must ignore the order of neighbours.
2. It must accept any neighbourhood size.
Discriminator: if neighbours are shuffled, does the aggregate stay the same?
Reference: aggregators must be permutation-invariant and handle variable-sized neighbourhoods.

</details>

<details>
<summary><strong>Q26.</strong> How do you perform sum aggregation?</summary>

Use:
1. Take the embedding h_m^l of every neighbour m in N(n).
2. Add them componentwise.
3. Use the resulting fixed-size vector as z_n^l.
Reference: Aggregate({h_m^l}) = sum_{m in N(n)} h_m^l.

</details>

<details>
<summary><strong>Q27.</strong> How do you perform mean aggregation?</summary>

Use:
1. Sum all neighbour embeddings.
2. Divide by the number of neighbours.
3. Use the average as the neighbour message.
Discriminator: should node degree be normalized out?
Reference: Aggregate({h_m^l})=(1/|N(n)|) sum_{m in N(n)} h_m^l.

</details>

<details>
<summary><strong>Q28.</strong> How do max/min aggregation work?</summary>

Use:
1. Collect neighbour embeddings as a set.
2. For each feature dimension, take the maximum or minimum across neighbours.
3. Return the resulting vector.
Discriminator: do you want the strongest/extreme feature rather than total or average evidence?
Reference: the sheet lists element-wise maximum and minimum as possible permutation-invariant aggregators.

</details>

<details>
<summary><strong>Q29.</strong> How do you perform learnable universal aggregation?</summary>

Use:
1. Apply the shared MLP_phi to each neighbour embedding.
2. Sum the transformed neighbour embeddings.
3. Apply the shared MLP_theta to the sum.
4. Use the output as the aggregate.
Reference: Aggregate({h_m^l})=MLP_theta(sum_{m in N(n)} MLP_phi(h_m^l)); the sheet states this is a universal approximator for permutation-invariant functions.

</details>

<details>
<summary><strong>Q30.</strong> How do you apply the linear update function?</summary>

Use:
1. Transform the node's current embedding with W_self.
2. Transform the neighbour aggregate with W_neigh.
3. Add the two transformed vectors plus bias.
4. Apply nonlinearity f.
Reference: Update(h_n^l,z_n^l)=f(W_self h_n^l + W_neigh z_n^l + b).

</details>

<details>
<summary><strong>Q31.</strong> How do you apply the simplified shared-weight update?</summary>

Use:
1. Add the node itself to its neighbourhood: N(n) union {n}.
2. Sum embeddings over that enlarged set.
3. Apply shared W_neigh, add bias, then nonlinearity.
Discriminator: is the self-embedding folded into the same sum as neighbours?
Reference: h_n^{l+1}=f(W_neigh(sum_{m in N(n) union {n}} h_m^l)+b).

</details>

<details>
<summary><strong>Q32.</strong> Linear update vs simplified shared-weight update: which case applies?</summary>

Use the self-handling discriminator:
- Separate self term and neighbour term: linear update with W_self and W_neigh.
- Self included inside the same aggregate as neighbours: simplified shared-weight update.
Reference: Update=f(W_self h_n^l+W_neigh z_n^l+b) versus h_n^{l+1}=f(W_neigh sum_{m in N(n) union {n}} h_m^l+b).

</details>

<details>
<summary><strong>Q33.</strong> How does message passing handle variable-sized graphs?</summary>

Use:
1. Reuse the same local update at every node.
2. Aggregate variable-sized neighbour sets into fixed-size vectors.
3. For graph-level tasks, aggregate variable-sized node sets with an invariant readout.
Reference: message passing uses shared parameters plus permutation-invariant aggregation.

</details>

<details>
<summary><strong>Q34.</strong> How do you recognize and set up a node-level task?</summary>

Use:
1. Ask whether the target is attached to individual nodes.
2. Run message passing to get h_n^L for every node.
3. Apply the same prediction head to each node.
4. Preserve equivariance: relabel nodes, relabel predictions.
Reference: node-level tasks make predictions for individual nodes and require permutation equivariance.

</details>

<details>
<summary><strong>Q35.</strong> How do you compute node classification probabilities?</summary>

Use:
1. For node n, compute one score per class: s_ni=w_i^T h_n^L.
2. Exponentiate each class score.
3. Divide by the sum of exponentiated scores over classes.
Reference: y_ni=exp(w_i^T h_n^L)/sum_j exp(w_j^T h_n^L).

</details>

<details>
<summary><strong>Q36.</strong> How do you compute node classification cross-entropy?</summary>

Use:
1. Restrict the loss sum to labelled training nodes V_train.
2. For each class i, multiply target indicator t_ni by log predicted probability log y_ni.
3. Sum over nodes/classes and negate.
Reference: L=-sum_{n in V_train} sum_{i=1}^C t_ni log y_ni.

</details>

<details>
<summary><strong>Q37.</strong> Why does the node classifier stay equivariant?</summary>

Use: check whether each node uses the same classifier.
1. Message passing produces node embeddings that reorder with the nodes.
2. The same class weights are applied to every node.
3. Therefore reordered inputs produce reordered node predictions.
Reference: shared weights {w_i} across nodes make the node classifier equivariant.

</details>

<details>
<summary><strong>Q38.</strong> Inductive vs transductive learning: what is the discriminator?</summary>

Use: ask whether the test nodes/graph structure are available during training.
- Inductive: test nodes are not available; model must generalise to unseen graph structures.
- Transductive: full graph is known; only some node labels are hidden.
Reference: inductive is standard supervised generalisation; transductive is semi-supervised on a known graph.

</details>

<details>
<summary><strong>Q39.</strong> How are unlabelled nodes used in transductive learning?</summary>

Use:
1. Include unlabelled nodes in the graph during message passing.
2. Let their embeddings influence and be influenced by neighbours.
3. Do not include their unknown labels in the supervised loss.
Reference: in transductive learning, the full graph is known, some nodes are labelled, and unlabelled nodes still participate in message passing.

</details>

<details>
<summary><strong>Q40.</strong> How do you recognize and set up an edge-level task?</summary>

Use:
1. Ask whether the target is attached to an edge or node pair.
2. Learn endpoint embeddings h_n and h_m.
3. Feed endpoint information to an edge predictor.
4. Ensure relabelling nodes relabels edge/pair predictions consistently.
Reference: edge-level tasks include edge prediction, graph completion, and link prediction.

</details>

<details>
<summary><strong>Q41.</strong> How do you compute dot-product edge prediction?</summary>

Use:
1. Obtain embeddings h_n and h_m for the two endpoint nodes.
2. Compute similarity h_n^T h_m.
3. Pass it through sigmoid to get an edge probability.
Discriminator: are two endpoint embeddings enough for a simple edge score?
Reference: p(n,m)=sigma(h_n^T h_m).

</details>

<details>
<summary><strong>Q42.</strong> How do you recognize and set up a graph-level task?</summary>

Use:
1. Ask whether the target is one label/value for the whole graph.
2. Run message passing to obtain final node embeddings.
3. Pool all node embeddings with a permutation-invariant readout.
4. Apply a graph-level predictor.
Reference: graph-level tasks require permutation invariance.

</details>

<details>
<summary><strong>Q43.</strong> How do you perform graph classification with sum readout?</summary>

Use:
1. Compute final node embeddings h_n^L.
2. Sum them over all nodes n in V.
3. Apply a function f such as a linear map or MLP.
Discriminator: should node ordering leave the graph output unchanged?
Reference: y=f(sum_{n in V} h_n^L).

</details>

<details>
<summary><strong>Q44.</strong> Graph readout alternatives: sum, mean, max, or attention?</summary>

Use the aggregation discriminator:
- Sum: preserves total accumulated evidence.
- Mean: normalizes by graph size.
- Max: keeps strongest feature dimension values.
- Attention: learns node importance weights.
Reference: the sheet lists mean pooling, max pooling, and attention-weighted aggregation as graph readout alternatives.

</details>

<details>
<summary><strong>Q45.</strong> What is graph representation learning?</summary>

Use: learn embeddings first, then reuse them for later tasks.
1. Train a GNN to produce useful node, edge, or graph embeddings.
2. Feed those embeddings into downstream prediction or modelling tasks.
Reference: graph representation learning means learning useful embeddings for downstream tasks.

</details>

<details>
<summary><strong>Q46.</strong> When should graph attention be used instead of equal neighbour aggregation?</summary>

Use: ask whether different neighbours should contribute different amounts.
1. Compute a relevance weight for each neighbour.
2. Normalize weights over the neighbourhood.
3. Take a weighted sum of neighbour embeddings.
Reference: graph attention learns attention weights for neighbours rather than treating all neighbours equally.

</details>

<details>
<summary><strong>Q47.</strong> How do you perform attention-weighted aggregation?</summary>

Use:
1. For receiving node n, assign each neighbour m a coefficient A_nm.
2. Multiply each neighbour embedding h_m^l by A_nm.
3. Sum the weighted embeddings over m in N(n).
Reference: z_n^l=sum_{m in N(n)} A_nm h_m^l.

</details>

<details>
<summary><strong>Q48.</strong> How do you check graph attention coefficients are valid?</summary>

Use two checks for each receiving node n:
1. Every neighbour weight is non-negative.
2. The weights over N(n) sum to 1.
Discriminator: do the neighbours form a weighted average?
Reference: A_nm >= 0 and sum_{m in N(n)} A_nm=1.

</details>

<details>
<summary><strong>Q49.</strong> How do you compute the sheet’s example attention coefficient?</summary>

Use:
1. Score neighbour m for receiver n with s_nm=h_n^T W h_m.
2. Exponentiate s_nm.
3. Normalize by the sum of exponentiated scores over all neighbours m' in N(n).
Reference: A_nm=exp(h_n^T W h_m)/sum_{m' in N(n)} exp(h_n^T W h_{m'}).

</details>

<details>
<summary><strong>Q50.</strong> A_nm notation warning: adjacency entry or attention coefficient?</summary>

Use the discriminator: what values can A_nm take?
- Binary 0/1 connection: adjacency matrix entry.
- Non-negative weights summing to 1 over neighbours: attention coefficient.
Reference: the sheet uses A for adjacency earlier and A_nm for attention weights in the attention section.

</details>

<details>
<summary><strong>Q51.</strong> How do you run multi-head graph attention?</summary>

Use:
1. Create H independent attention heads.
2. Give each head its own parameters.
3. Compute each head's neighbour-weighted output.
4. Concatenate or average the head outputs.
Reference: multi-head graph attention computes H independent attention mechanisms and concatenates or averages outputs.

</details>

<details>
<summary><strong>Q52.</strong> When does graph attention become Transformer-like?</summary>

Use: ask whether every node can attend to every other node.
1. Make the graph fully connected.
2. Run multi-head attention over all nodes/tokens.
3. This matches the Transformer encoder view in the sheet.
Reference: fully-connected graph => Transformer encoder; multi-head graph attention generalises this.

</details>

<details>
<summary><strong>Q53.</strong> How do you recognize the general GNN with node, edge, and graph embeddings?</summary>

Use:
1. Node states store local node information.
2. Edge states store relation information.
3. Graph state stores global context.
4. Updates can pass information among all three levels.
Reference: node embeddings h_n^l, edge embeddings e_nm^l, and graph embedding g^l.

</details>

<details>
<summary><strong>Q54.</strong> How do you update an edge embedding in the general GNN?</summary>

Use:
1. Take the old edge embedding e_nm^l.
2. Include endpoint node embeddings h_n^l and h_m^l.
3. Include current graph embedding g^l.
4. Apply the edge update function.
Reference: e_nm^{l+1}=Update_edge(e_nm^l,h_n^l,h_m^l,g^l).

</details>

<details>
<summary><strong>Q55.</strong> How do nodes receive information from updated edges?</summary>

Use:
1. First update edge embeddings to e_nm^{l+1}.
2. For node n, collect updated incident/incoming edge embeddings for m in N(n).
3. Aggregate them with Aggregate_node.
Reference: z_n^{l+1}=Aggregate_node({e_nm^{l+1}:m in N(n)}).

</details>

<details>
<summary><strong>Q56.</strong> How do you update a node embedding in the edge/global GNN?</summary>

Use:
1. Keep the old node embedding h_n^l.
2. Add the aggregated updated-edge message z_n^{l+1}.
3. Include graph context g^l.
4. Apply the node update function.
Reference: h_n^{l+1}=Update_node(h_n^l,z_n^{l+1},g^l).

</details>

<details>
<summary><strong>Q57.</strong> How do you update the graph-level embedding g?</summary>

Use:
1. Start from old graph embedding g^l.
2. Use the set of updated node embeddings.
3. Use the set of updated edge embeddings.
4. Apply the graph update function with invariant handling of sets.
Reference: g^{l+1}=Update_graph(g^l,{h_n^{l+1}},{e_nm^{l+1}}).

</details>

<details>
<summary><strong>Q58.</strong> What is the update order in edge/global message passing?</summary>

Use:
1. Update edges from old edge, endpoint nodes, and graph state.
2. Aggregate updated edges into node messages.
3. Update nodes using old node, edge aggregate, and graph state.
4. Update graph using old graph plus updated node/edge sets.
Reference: edge update -> node aggregation/update -> graph update.

</details>

<details>
<summary><strong>Q59.</strong> How do you recognize over-smoothing in a GNN?</summary>

Use: inspect what happens as depth increases.
1. Repeated message passing mixes neighbourhood information.
2. Node embeddings become increasingly similar.
3. Nodes lose distinguishability, limiting useful depth.
Reference: over-smoothing is when node embeddings become too similar after many GNN layers.

</details>

<details>
<summary><strong>Q60.</strong> How do residual connections address over-smoothing?</summary>

Use:
1. Compute the usual updated node embedding.
2. Add the previous embedding h_n^l directly to it.
3. Preserve old information across layers.
Discriminator: is the previous layer added into the next layer?
Reference: h_n^{l+1}=Update(h_n^l,z_n^{l+1},g^l)+h_n^l.

</details>

<details>
<summary><strong>Q61.</strong> How do skip connections address over-smoothing?</summary>

Use:
1. Keep embeddings from multiple layers.
2. Concatenate h_n^1, h_n^2, ..., h_n^L.
3. Feed the concatenated representation into the final predictor.
Discriminator: does the final prediction use several depths at once?
Reference: y_n=f(h_n^1 ⊕ h_n^2 ⊕ ... ⊕ h_n^L).

</details>

<details>
<summary><strong>Q62.</strong> Residual vs skip connections: what is the discriminator?</summary>

Use:
- Residual: add h_n^l directly to h_n^{l+1} inside the layer stack.
- Skip: concatenate embeddings from multiple layers for the final prediction.
Reference: residual uses addition across adjacent layers; skip uses ⊕ concatenation across depths.

</details>

<details>
<summary><strong>Q63.</strong> Which standard regularisation methods does the sheet list for GNNs?</summary>

Use when overfitting risk is high:
1. Weight decay / L2 regularisation.
2. Dropout on node embeddings.
3. Early stopping.
Reference: these are the standard regularisation methods listed in the sheet.

</details>

<details>
<summary><strong>Q64.</strong> Which graph-specific regularisation methods does the sheet list?</summary>

Use:
1. Share weights across layers to reduce parameter count.
2. Apply node dropout by randomly omitting nodes during training.
3. Apply edge dropout by randomly masking edges during training.
Discriminator: are you regularising parameters, nodes, or edges?
Reference: graph-specific methods listed are weight sharing across layers, node dropout, and edge dropout.

</details>

<details>
<summary><strong>Q65.</strong> Node dropout vs edge dropout: what is randomly removed?</summary>

Use the object discriminator:
- Node dropout: omit nodes during training.
- Edge dropout: mask edges during training.
Reference: both are graph-specific regularisation techniques in the sheet.

</details>

<details>
<summary><strong>Q66.</strong> When do you need geometric deep learning constraints?</summary>

Use: ask whether nodes have spatial positions and predictions should not depend on the coordinate frame.
1. Include 3D spatial embeddings/positions for nodes.
2. Use operations respecting translation, rotation, and reflection symmetries.
3. Build invariance/equivariance into updates.
Reference: the sheet introduces geometric constraints for molecular structures with spatial symmetries.

</details>

<details>
<summary><strong>Q67.</strong> Which spatial symmetries are listed in the sheet?</summary>

Use: check whether the model should respect changes in coordinate frame.
1. Translation invariance.
2. Rotation invariance.
3. Reflection invariance.
Reference: these are the spatial symmetries listed for molecular structures.

</details>

<details>
<summary><strong>Q68.</strong> How do spatial embeddings enter the GNN?</summary>

Use:
1. Assign each node n a spatial embedding r_n^l.
2. Treat r_n^l as a 3D position-like vector.
3. Use r values in distance-based edge updates and spatial updates.
Reference: r_n^l in R^3.

</details>

<details>
<summary><strong>Q69.</strong> How do you perform the geometric edge update using distance?</summary>

Use:
1. For edge (n,m), compute the Euclidean distance ||r_n^l-r_m^l||_2.
2. Combine that distance with e_nm^l, h_n^l, and h_m^l.
3. Apply Update_edge to get e_nm^{l+1}.
Discriminator: do you need a scalar relation that survives translation/rotation? Use distance.
Reference: e_nm^{l+1}=Update_edge(e_nm^l,h_n^l,h_m^l,||r_n^l-r_m^l||_2).

</details>

<details>
<summary><strong>Q70.</strong> Why does using ||r_n-r_m|| help with spatial invariance?</summary>

Use:
1. Translation shifts both positions equally, so the difference is unchanged.
2. Rotation/reflection preserves Euclidean distance.
3. The edge update receives a coordinate-frame-independent scalar.
Reference: the sheet states the Euclidean distance is unaffected by translation and rotation, supporting built-in invariance/equivariance.

</details>

<details>
<summary><strong>Q71.</strong> How do you perform the geometric spatial update?</summary>

Use:
1. For node n, start from r_n^l.
2. For each edge (n,m), compute the relative vector r_n^l-r_m^l.
3. Weight it by phi(e_nm^{l+1}).
4. Sum over edges, multiply by C, and add to r_n^l.
Reference: r_n^{l+1}=r_n^l + C sum_{(n,m) in E} (r_n^l-r_m^l) phi(e_nm^{l+1}).

</details>

<details>
<summary><strong>Q72.</strong> Spatial invariance vs equivariance: what is the discriminator?</summary>

Use:
- Invariant quantity: unchanged when the coordinate frame changes, e.g. distances.
- Equivariant quantity: transforms consistently with the coordinate frame, e.g. position/vector updates.
Reference: the sheet says the geometric update gives built-in invariance/equivariance to 3D transformations.

</details>

<details>
<summary><strong>Q73.</strong> How are sequences, images, and graphs distinguished in the sheet?</summary>

Use the data-structure discriminator:
- Sequence: ordered 1D array.
- Image: regular 2D array/grid.
- Graph: irregular relational structure of nodes and edges.
Reference: previous chapters covered arrays; this lecture handles graph-structured data.

</details>

<details>
<summary><strong>Q74.</strong> How does message passing connect to CNNs?</summary>

Use:
1. Treat local aggregation as the graph analogue of a convolutional neighbourhood.
2. Replace fixed-position neighbour weights with shared weights.
3. Replace ordered local windows with permutation-invariant neighbour aggregation.
Reference: the lecture moves from CNN convolution to graph convolution by sharing neighbour weights and summing over N(i).

</details>

<details>
<summary><strong>Q75.</strong> How does transductive node classification connect to semi-supervised learning?</summary>

Use:
1. The full graph is available.
2. Only some node labels are known.
3. Unlabelled nodes contribute structure/messages but not supervised targets.
Reference: the sheet describes transductive node classification as semi-supervised learning.

</details>

<details>
<summary><strong>Q76.</strong> What is the high-value exam rule for graph-level outputs?</summary>

Use: one graph in, one prediction out.
1. Reorder nodes any way you like.
2. The graph-level output must stay identical.
3. Use invariant pooling/readout.
Reference: graph-level prediction requires y(X~,A~)=y(X,A).

</details>

<details>
<summary><strong>Q77.</strong> What is the high-value exam rule for node-level outputs?</summary>

Use: one node in the input corresponds to one prediction in the output.
1. Reorder nodes with P.
2. The prediction rows must reorder with P.
3. Use equivariant message passing and shared node heads.
Reference: node-level prediction requires y(X~,A~)=P y(X,A).

</details>
