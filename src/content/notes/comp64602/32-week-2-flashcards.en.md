---
subject: COMP64602
chapter: 32
title: "Week 2 — Flashcards"
language: en
---

# Week 2 — Flashcards

72 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> How do you recognise when to use Statistical Schema Induction (SSI)?</summary>

Use SSI when the input is factual RDF triples and the task is to induce likely schema-level OWL 2 axioms.<br>Method: 1) acquire terminology from the graph, 2) build transaction tables, 3) mine association rules, 4) translate strong rules into OWL 2 axioms, 5) assemble the learned ontology.<br><br>Reference: SSI learns OWL 2 schema axioms from RDF triples using association-rule mining over transaction-table encodings.

</details>

<details>
<summary><strong>Q2.</strong> What OWL 2 axiom patterns does SSI cover in this sheet?</summary>

Use the target axiom shape to choose the table/rule pattern: named concept inclusion, conjunction inclusion, existential restriction inclusion, domain/inverse-domain style restrictions, role inclusion, or role composition/inclusion.<br><br>Reference: The sheet lists axioms using ⊤, ⊥, C ⊓ D, ∃r.C, C ⊑ D, and r1 ∘ … ∘ rk ⊑ r.

</details>

<details>
<summary><strong>Q3.</strong> How do you read an RDF triple in these methods?</summary>

Treat each fact as subject–predicate–object: subject/entity, predicate/property, object/entity or value. For class membership, use a type-style triple linking an entity to a class.<br><br>Reference: An RDF triple is a fact ⟨s,p,o⟩ used as factual input to SSI and knowledge-graph rule mining.

</details>

<details>
<summary><strong>Q4.</strong> How do you read an association rule X ⇒ Y?</summary>

Read X as the condition/antecedent and Y as the predicted consequent. To evaluate it, first find transactions containing X, then check how often Y also appears.<br><br>Reference: An association rule has form X ⇒ Y, where X is the antecedent and Y is the consequent.

</details>

<details>
<summary><strong>Q5.</strong> How do you calculate support for an itemset X?</summary>

Method: 1) scan every transaction t in D, 2) check whether X ⊆ t, 3) count the transactions that pass.<br><br>Reference: Support(X)=|{t∈D : X⊆t}|.

</details>

<details>
<summary><strong>Q6.</strong> How do you calculate confidence for an association rule X ⇒ Y?</summary>

Method: 1) count Support(X∪Y), 2) count Support(X), 3) divide joint support by antecedent support.<br><br>Reference: Confidence(X⇒Y)=Support(X∪Y)/Support(X).

</details>

<details>
<summary><strong>Q7.</strong> Support vs confidence in association mining — what is the discriminator?</summary>

Ask: am I measuring frequency or conditional reliability? Support measures how often an itemset occurs. Confidence measures how often Y occurs among transactions that already contain X.<br><br>Reference: Support counts X-containing transactions; confidence is Support(X∪Y)/Support(X).

</details>

<details>
<summary><strong>Q8.</strong> How does Apriori prune candidate itemsets?</summary>

Method: for a candidate itemset, inspect its subsets. If any subset is infrequent, discard the candidate without treating it as frequent.<br><br>Reference: Apriori property: if an itemset is frequent, all of its subsets must also be frequent; equivalently, an itemset with an infrequent subset cannot be frequent.

</details>

<details>
<summary><strong>Q9.</strong> How do you run Apriori to discover frequent itemsets?</summary>

Method: 1) find frequent 1-itemsets using min support, 2) generate candidate k-itemsets from frequent (k−1)-itemsets, 3) prune by the Apriori property, 4) scan transactions for support, 5) repeat until no more frequent itemsets appear.<br><br>Reference: Apriori performs level-wise, breadth-first frequent-itemset search.

</details>

<details>
<summary><strong>Q10.</strong> How do you generate rules from a frequent itemset I?</summary>

Method: 1) choose a non-empty proper subset A⊂I, 2) form A ⇒ I\A, 3) compute confidence, 4) keep the rule only if it meets the rule-quality threshold.<br><br>Reference: Rules from a frequent itemset have form A ⇒ I\A.

</details>

<details>
<summary><strong>Q11.</strong> How does SSI turn graph entities into transaction rows for concept axioms?</summary>

Method: 1) make rows from entities/instances, 2) make columns from named or constructed concepts, 3) put 1 if the entity satisfies the column concept and 0 otherwise, 4) mine rules over the columns.<br><br>Reference: In SSI, an entity becomes a transaction and its class/restriction memberships become items.

</details>

<details>
<summary><strong>Q12.</strong> How do you do terminology acquisition in SSI?</summary>

Method: scan the knowledge graph for named classes/concepts and properties/relations; use these symbols to define the possible transaction-table columns and axiom templates.<br><br>Reference: Terminology acquisition gathers named concepts and properties before association-rule mining.

</details>

<details>
<summary><strong>Q13.</strong> How do you select association rules for schema induction?</summary>

Method: calculate support and confidence over the relevant transaction table, keep rules that strongly reflect graph patterns, then translate their antecedent/consequent shape into OWL 2 axiom form.<br><br>Reference: SSI applies association-rule mining to transaction tables and transforms selected rules into OWL 2 axioms.

</details>

<details>
<summary><strong>Q14.</strong> How do you mine a simple subclass axiom Ci ⊑ Cj?</summary>

Method: 1) use an entity-by-concept membership table, 2) mine a rule {Ci}⇒{Cj}, 3) translate a strong rule into Ci ⊑ Cj.<br><br>Reference: Simple subclass mining maps {Ci}⇒{Cj} to Ci ⊑ Cj.

</details>

<details>
<summary><strong>Q15.</strong> How do you mine a conjunction subclass axiom Ci ⊓ Cj ⊑ Ck?</summary>

Method: 1) use the same concept-membership table, 2) mine a rule {Ci,Cj}⇒{Ck}, 3) translate the two-item antecedent into a conjunction on the left-hand side.<br><br>Reference: {Ci,Cj}⇒{Ck} corresponds to Ci ⊓ Cj ⊑ Ck.

</details>

<details>
<summary><strong>Q16.</strong> How do you mine a named concept subclass of an existential restriction, D ⊑ ∃r.C?</summary>

Method: 1) include columns for named concepts and existential restrictions, 2) mine a rule {D}⇒{∃r.C}, 3) translate the consequent item into the superclass restriction.<br><br>Reference: {D}⇒{∃r.C} corresponds to D ⊑ ∃r.C.

</details>

<details>
<summary><strong>Q17.</strong> How do you mine an existential restriction subclass of a named concept, ∃r.C ⊑ D?</summary>

Method: 1) include an existential-restriction column ∃r.C, 2) mine a rule {∃r.C}⇒{D}, 3) translate the antecedent restriction into the subclass side.<br><br>Reference: {∃r.C}⇒{D} corresponds to ∃r.C ⊑ D.

</details>

<details>
<summary><strong>Q18.</strong> How do you mine a domain-style existential axiom ∃r.⊤ ⊑ C?</summary>

Method: 1) create a column ∃r.⊤ that is true for entities with at least one outgoing r edge, 2) mine {∃r.⊤}⇒{C}, 3) translate it into ∃r.⊤ ⊑ C.<br><br>Reference: ∃r.⊤ ⊑ C says entities with some outgoing r relation likely belong to C.

</details>

<details>
<summary><strong>Q19.</strong> How do you mine an inverse existential axiom ∃r⁻¹.⊤ ⊑ C?</summary>

Method: 1) create a column ∃r⁻¹.⊤ that is true for entities with at least one incoming r edge, 2) mine {∃r⁻¹.⊤}⇒{C}, 3) translate it into ∃r⁻¹.⊤ ⊑ C.<br><br>Reference: ∃r⁻¹.⊤ ⊑ C says entities receiving some r relation likely belong to C.

</details>

<details>
<summary><strong>Q20.</strong> How do you mine a role inclusion axiom ri ⊑ rj?</summary>

Method: 1) use rows as entity pairs (a,b), 2) use relation columns, 3) mark whether each relation holds between the pair, 4) mine {ri}⇒{rj}, 5) translate to ri ⊑ rj.<br><br>Reference: Role inclusion mining uses pair-level transaction rows rather than single-entity rows.

</details>

<details>
<summary><strong>Q21.</strong> How do you handle role-composition-style axioms in SSI?</summary>

Method: 1) use rows as entity pairs, 2) include columns for direct relations and relation-composition/path patterns, 3) mine rules where a path/composition item implies a target relation, 4) translate to a role-composition inclusion.<br><br>Reference: Role-composition axioms are handled over pairs of instances with direct and composed relation columns.

</details>

<details>
<summary><strong>Q22.</strong> When is an existential restriction column ∃r.C set to 1 for entity a?</summary>

Method: 1) look for some entity b with triple ⟨a,r,b⟩, 2) check that b has type C, 3) set the column to 1 iff both facts exist; otherwise set 0.<br><br>Reference: a satisfies ∃r.C iff ∃b such that ⟨a,r,b⟩ and ⟨b,rdf:type,C⟩ hold.

</details>

<details>
<summary><strong>Q23.</strong> Which SSI transaction-table pattern should you use for a target axiom?</summary>

Discriminator: single concept ⇒ single concept means simple subclass; multiple concept items ⇒ single concept means conjunction subclass; concept ⇒ existential column means D ⊑ ∃r.C; existential column ⇒ concept means ∃r.C ⊑ D; relation item over entity-pair rows ⇒ role inclusion/composition.<br><br>Reference: SSI chooses transaction tables by axiom type.

</details>

<details>
<summary><strong>Q24.</strong> How should learned SSI schema axioms be treated?</summary>

Treat them as statistically supported schema hypotheses. Check support/confidence and remember that high support does not make the axiom universally certain in an incomplete or noisy graph.<br><br>Reference: SSI learns uncertain schema-level conclusions from factual data.

</details>

<details>
<summary><strong>Q25.</strong> How do you recognise a Horn rule in this lecture?</summary>

Use it when several body atoms act as conditions and one head atom is the predicted conclusion. Evaluate by checking whether body instantiations support the head.<br><br>Reference: A Horn rule has form B1,…,Bn ⇒ r(x,y), abbreviated B⇒r(x,y).

</details>

<details>
<summary><strong>Q26.</strong> Head vs body of a Horn rule — what is the discriminator?</summary>

Ask: which atom is being predicted? That atom is the head. The remaining atoms are body conditions that must hold before the head is expected.<br><br>Reference: In B⇒r(x,y), B is the body and r(x,y) is the head.

</details>

<details>
<summary><strong>Q27.</strong> How do variables and constants affect Horn-rule generality?</summary>

Use variables for reusable patterns across arbitrary entities. Use constants only when the rule is intentionally entity-specific; constants in the head make the rule closer to a specific fact.<br><br>Reference: Horn-rule variables are placeholders; constants are fixed entities.

</details>

<details>
<summary><strong>Q28.</strong> How do you ground or instantiate a Horn rule?</summary>

Method: 1) choose a constant/entity for each variable, 2) replace every occurrence of that variable consistently, 3) evaluate the resulting ground body and ground head as graph facts.<br><br>Reference: Grounding/instantiation replaces rule variables with constants/entities from the knowledge graph.

</details>

<details>
<summary><strong>Q29.</strong> How do you convert predicate notation to an RDF-style triple?</summary>

Method: treat p(s,o) as the triple ⟨s,p,o⟩. For class membership, use a type-style predicate from the entity to the class.<br><br>Reference: Binary predicate notation p(s,o) corresponds to RDF triple ⟨s,p,o⟩.

</details>

<details>
<summary><strong>Q30.</strong> Why do Horn rules matter in knowledge graphs?</summary>

Use them as reusable relational patterns: if the body holds, infer or score the head as likely. Balance truth/reliability against coverage/generality.<br><br>Reference: Horn rules express general patterns over facts and support inference of new facts.

</details>

<details>
<summary><strong>Q31.</strong> How do you compute body length of a Horn rule, and why cap it?</summary>

Method: count the number of atoms in the body. Cap it because more atoms increase search cost and usually reduce satisfying instantiations and generality.<br><br>Reference: Body length is the number of body atoms; AMIE uses a maximum body length.

</details>

<details>
<summary><strong>Q32.</strong> How do you test whether two atoms are connected?</summary>

Method: compare their terms. If they share at least one variable or constant, they are connected.<br><br>Reference: Two atoms are connected iff they share a variable or constant.

</details>

<details>
<summary><strong>Q33.</strong> How do you test whether a whole Horn rule is connected?</summary>

Method: build an atom graph with an edge between atoms that share a variable or constant. The rule is connected if every atom is transitively linked to every other atom.<br><br>Reference: A connected rule has all atoms connected transitively through shared terms.

</details>

<details>
<summary><strong>Q34.</strong> How do you test whether a Horn rule is closed?</summary>

Method: count every variable occurrence across body and head. The rule is closed only if every variable appears at least twice.<br><br>Reference: A variable is closed if it appears at least twice; a rule is closed if all variables are closed.

</details>

<details>
<summary><strong>Q35.</strong> Connected vs closed Horn rule — what is the discriminator?</summary>

Ask two separate questions: are the atoms linked through shared terms? That is connectedness. Does every variable occur at least twice? That is closedness.<br><br>Reference: Connected concerns atom linkage; closed concerns variable occurrence count.

</details>

<details>
<summary><strong>Q36.</strong> Why reject disconnected Horn rules?</summary>

Reject them because the body may not constrain the head variables, so the implication can connect unrelated facts without meaningful relational structure.<br><br>Reference: Disconnected rules lack real-world logical meaning because some atoms do not share terms with the rest.

</details>

<details>
<summary><strong>Q37.</strong> Why reject non-closed Horn rules?</summary>

Reject or penalise them because one-off variables are unspecified, make predictions vague, and add reasoning/search cost.<br><br>Reference: A non-closed rule has at least one variable appearing only once.

</details>

<details>
<summary><strong>Q38.</strong> How do you calculate Horn-rule support?</summary>

Method: 1) find groundings where the body B and head r(x,y) are true, 2) project each successful grounding to its head pair (x,y), 3) count distinct head pairs.<br><br>Reference: supp(B⇒r(x,y)) = #(x,y) : ∃z1,…,zm such that B ∧ r(x,y).

</details>

<details>
<summary><strong>Q39.</strong> What is support monotonicity for Horn rules?</summary>

Use this for pruning: adding more body atoms can only keep or reduce the number of satisfying instantiations; it cannot create more support.<br><br>Reference: If a rule is refined by adding body atoms, child support ≤ parent support.

</details>

<details>
<summary><strong>Q40.</strong> How do you calculate head coverage?</summary>

Method: 1) compute support of the rule, 2) compute size(r), the number of known subject-object pairs for the head relation, 3) divide support by size(r).<br><br>Reference: hc(B⇒r(x,y)) = supp(B⇒r(x,y)) / size(r).

</details>

<details>
<summary><strong>Q41.</strong> Why use head coverage instead of raw support?</summary>

Use head coverage when raw support is hard to compare across relations of different sizes. It normalises rule support by the total size of the head relation.<br><br>Reference: Head coverage = support divided by size of the head relation.

</details>

<details>
<summary><strong>Q42.</strong> How do you calculate standard confidence for a Horn rule?</summary>

Method: 1) count supported predictions where B and r(x,y) both hold, 2) count all distinct (x,y) pairs for which B holds, 3) divide. Under CWA, missing heads are failures.<br><br>Reference: conf(B⇒r(x,y)) = supp(B⇒r(x,y)) / #(x,y):∃z1,…,zm such that B.

</details>

<details>
<summary><strong>Q43.</strong> How does the Closed World Assumption affect rule evaluation?</summary>

Method: treat known or inferable facts as true; treat facts absent from the graph and not inferable as false. Therefore a body grounding with a missing head counts as a failed prediction.<br><br>Reference: CWA says missing facts are false.

</details>

<details>
<summary><strong>Q44.</strong> Association-rule support vs Horn-rule support — what is the discriminator?</summary>

Ask what is being counted. Association support counts transactions containing an itemset. Horn-rule support counts distinct head subject-object pairs supported by full rule instantiations.<br><br>Reference: Association support counts itemset frequency; Horn support counts supported head pairs.

</details>

<details>
<summary><strong>Q45.</strong> Association confidence vs Horn standard confidence — what changes?</summary>

Association confidence divides joint itemset support by antecedent support. Horn standard confidence divides supported head pairs by distinct head pairs whose body is satisfied.<br><br>Reference: Both measure conditional reliability, but over different data structures: transactions vs grounded relational pairs.

</details>

<details>
<summary><strong>Q46.</strong> How do you recognise AMIE’s task?</summary>

Use AMIE when the goal is to mine Horn rules from a large, incomplete knowledge graph, not to mine OWL schema axioms from transaction tables.<br><br>Reference: AMIE = Association Rule Mining under Incomplete Evidence; it mines Horn rules from knowledge graphs.

</details>

<details>
<summary><strong>Q47.</strong> Why does AMIE avoid the Closed World Assumption?</summary>

Because knowledge graphs are incomplete: an absent fact may be unknown rather than false. AMIE therefore uses a weaker assumption before counting missing predictions as failures.<br><br>Reference: AMIE uses the Partial Completeness Assumption instead of CWA.

</details>

<details>
<summary><strong>Q48.</strong> How do you apply the Partial Completeness Assumption (PCA)?</summary>

Method for a candidate head r(x,y): 1) check whether the graph has any known object y′ for the same subject and relation r(x,y′), 2) if yes, treat other missing y values for that (x,r) as false, 3) if no, do not count missing candidates as false.<br><br>Reference: PCA assumes a subject-relation pair is complete once at least one object is known for it.

</details>

<details>
<summary><strong>Q49.</strong> CWA vs PCA — what is the discriminator question?</summary>

Ask: does missing always mean false? Under CWA, yes. Under PCA, missing is false only when the graph already has at least one known object for the same subject-relation pair.<br><br>Reference: CWA treats all missing facts as false; PCA treats only some missing facts as false.

</details>

<details>
<summary><strong>Q50.</strong> How do you calculate PCA confidence?</summary>

Method: 1) compute support as usual, 2) for the denominator, count body-satisfying candidate pairs (x,y) only when there exists some y′ with known head fact r(x,y′), 3) divide support by that PCA denominator.<br><br>Reference: conf_pca(B⇒r(x,y)) = supp(B⇒r(x,y)) / #(x,y):∃z1,…,zm,y′ such that B ∧ r(x,y′).

</details>

<details>
<summary><strong>Q51.</strong> Standard confidence vs PCA confidence — what changes?</summary>

The numerator is the same support. The denominator changes: standard confidence counts all body-satisfying candidate pairs; PCA confidence excludes candidates whose subject has no known object for the head relation.<br><br>Reference: PCA confidence modifies the denominator using partial completeness.

</details>

<details>
<summary><strong>Q52.</strong> When is a body-satisfying candidate excluded from the PCA-confidence denominator?</summary>

Exclude it when the graph has no known fact of the form r(x,y′) for that candidate’s subject x and head relation r. Then AMIE does not assume the missing predicted head is false.<br><br>Reference: PCA only counts candidates for subject-relation pairs that appear complete.

</details>

<details>
<summary><strong>Q53.</strong> What are the inputs to AMIE?</summary>

Use four inputs: the knowledge base/knowledge graph K, minimum head coverage minHC, maximum body length maxLen, and minimum confidence minConf.<br><br>Reference: AMIE(K,minHC,maxLen,minConf) mines rules subject to coverage, length, and confidence constraints.

</details>

<details>
<summary><strong>Q54.</strong> What does AMIE store during search?</summary>

AMIE maintains a queue of candidate rules to process and an output set of accepted rules. The initial queue contains head-only relation templates; the output starts empty.<br><br>Reference: AMIE searches with q for candidates and out for qualified rules.

</details>

<details>
<summary><strong>Q55.</strong> How does AMIE rule mining proceed at a high level?</summary>

Method: 1) dequeue a rule, 2) test whether it is accepted for output, 3) if body length is below maxLen, refine it, 4) enqueue non-duplicate refinements with enough head coverage, 5) repeat until the queue is empty.<br><br>Reference: AMIE performs queue-based rule refinement and returns the accepted output set.

</details>

<details>
<summary><strong>Q56.</strong> When is a rule AcceptedForOutput in AMIE?</summary>

Accept only if: 1) the rule is closed, 2) PCA confidence is at least minConf, and 3) no parent rule in the output has equal or higher PCA confidence.<br><br>Reference: AcceptedForOutput(r) checks closedness, conf_pca(r), and parent-rule comparison.

</details>

<details>
<summary><strong>Q57.</strong> Why compare a child rule with its parent rules before output?</summary>

If a parent has equal or higher PCA confidence, prefer the parent: it has fewer body atoms, so it is more general and at least as reliable.<br><br>Reference: AMIE rejects a child rule when a parent rule has equal or higher PCA confidence.

</details>

<details>
<summary><strong>Q58.</strong> What does refinement mean in AMIE?</summary>

Refinement extends a rule by adding one body atom. The original rule is the parent; the refined rule is the child.<br><br>Reference: AMIE refinement operations generate child rules from parent rules by adding atoms.

</details>

<details>
<summary><strong>Q59.</strong> How do you use Add Dangling Atom?</summary>

Method: add a new atom containing one existing/shared variable and one fresh variable. Use it to extend the rule while keeping the new atom connected to the existing rule.<br><br>Reference: Add Dangling Atom introduces one fresh variable and one shared variable.

</details>

<details>
<summary><strong>Q60.</strong> How do you use Add Instantiated Atom?</summary>

Method: add a new atom containing one existing/shared variable and one fixed entity constant. Use it for entity-specific refinements, but expect high cost because many entity/relation combinations may be possible.<br><br>Reference: Add Instantiated Atom uses one shared variable and one constant/entity.

</details>

<details>
<summary><strong>Q61.</strong> How do you use Add Closing Atom?</summary>

Method: add a new atom using variables already present in the rule. Use it to link existing variables and help produce closed rules.<br><br>Reference: Add Closing Atom uses already-shared variables rather than a fresh variable or constant.

</details>

<details>
<summary><strong>Q62.</strong> Which AMIE refinement operation should you choose?</summary>

Discriminator: need a fresh variable? choose Add Dangling Atom. Need a constant/entity? choose Add Instantiated Atom. Need to connect existing variables or close the rule? choose Add Closing Atom.<br><br>Reference: AMIE has dangling, instantiated, and closing refinement operations.

</details>

<details>
<summary><strong>Q63.</strong> How does minimum head coverage reduce AMIE search?</summary>

Method: after generating a child rule, compute head coverage; enqueue it only if hc(child) ≥ minHC. Because head coverage is monotonic downward under body extension, low-coverage branches can be pruned.<br><br>Reference: AMIE uses minHC and monotonicity to reduce search space.

</details>

<details>
<summary><strong>Q64.</strong> How does maximum body length reduce AMIE search?</summary>

Method: before refinement, compare the rule body length with maxLen. If length(r) ≥ maxLen, do not refine it further.<br><br>Reference: AMIE caps refinement using maximum body length.

</details>

<details>
<summary><strong>Q65.</strong> How does minimum PCA confidence filter AMIE output?</summary>

Method: compute conf_pca(r). Output the rule only if conf_pca(r) ≥ minConf and the other output conditions also hold.<br><br>Reference: AMIE requires minimum PCA confidence for accepted rules.

</details>

<details>
<summary><strong>Q66.</strong> How does duplicate checking reduce AMIE search?</summary>

Method: before enqueuing a refined rule, check whether an equivalent rule is already queued. If yes, skip it.<br><br>Reference: AMIE avoids repeated exploration by duplicate checking.

</details>

<details>
<summary><strong>Q67.</strong> What role does SPARQL play in AMIE implementation?</summary>

Use SPARQL-style graph counting queries to compute supports, coverage, and viable candidate refinements efficiently; do not confuse this with the logical definition of Horn rules.<br><br>Reference: AMIE implementation relies on graph database access and SPARQL counting queries.

</details>

<details>
<summary><strong>Q68.</strong> Which AMIE refinement is most computationally expensive, and why?</summary>

Answer: Add Instantiated Atom. It combines a shared variable with a constant/entity, so the algorithm may need to search many relation–entity combinations in a large graph.<br><br>Reference: Add Instantiated Atom is the most complex refinement operation mentioned in the sheet.

</details>

<details>
<summary><strong>Q69.</strong> What optimisation levers does AMIE use?</summary>

Use minHC pruning, maxLen stopping, minConf filtering, parent-rule comparison, duplicate checking, scalable refinement strategies, and parallelisation where available.<br><br>Reference: AMIE reduces search space using coverage, length, confidence, parent, duplicate, and implementation-level optimisations.

</details>

<details>
<summary><strong>Q70.</strong> How should Markov Logic Networks (MLNs) be handled from this sheet?</summary>

Treat MLN only at summary level: first-order formulas guide the instantiation of Markov networks over instances, combining logical structure with uncertain reasoning.<br><br>Reference: An MLN uses formulas in first-order logic to guide Markov-network instantiation from instances.

</details>

<details>
<summary><strong>Q71.</strong> SSI vs AMIE vs MLN — what is the discriminator?</summary>

Ask what is being produced or used: SSI learns OWL 2 schema axioms from RDF via transaction tables; AMIE mines Horn rules from incomplete knowledge graphs using PCA; MLN uses first-order formulas with Markov networks for uncertain relational modelling.<br><br>Reference: Week 2 links ontology learning, Horn-rule mining, and relational machine learning.

</details>

<details>
<summary><strong>Q72.</strong> What is the common thread across SSI, Horn rules/AMIE, and MLNs?</summary>

All three connect relational graph data to reusable logical structure under uncertainty: SSI induces schema axioms, AMIE mines rules, and MLNs combine logical formulas with probabilistic graphical models.<br><br>Reference: The lecture is about extracting or using logical structure over large graphs.

</details>
