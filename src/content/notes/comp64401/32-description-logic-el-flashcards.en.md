---
subject: COMP64401
chapter: 32
title: "Description Logic EL — Flashcards"
language: en
---

# Description Logic EL — Flashcards

102 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> Discriminator: when should you model with description logic instead of propositional atoms?</summary>

Use:
1. Ask whether the domain has objects, kinds of objects, and relations between objects.
2. If the same rule would be duplicated for many objects/contexts in propositional logic, use DL structure instead.
3. Model kinds as classes, binary links as properties, and named objects as individuals.
Reference: DL represents structured conceptual and factual knowledge using classes, properties, individuals, and axioms.

</details>

<details>
<summary><strong>Q2.</strong> How do you decide whether something is a class, property, or individual?</summary>

Use:
1. If it denotes a kind/set of things, make it a class A.
2. If it denotes a binary relation from one thing to another, make it a property p.
3. If it denotes one named object/entity, make it an individual b.
Reference: Classes are sets/kinds of things; properties are binary relations; individuals are particular objects.

</details>

<details>
<summary><strong>Q3.</strong> Discriminator: conceptual knowledge or factual knowledge?</summary>

Use:
Ask whether the statement is about general concepts or about named individuals.
- General concept relationship → TBox axiom, usually a GCI C ⊑ D.
- Fact about named individuals → ABox assertion b:C or (b,c):p.
Reference: TBox = finite set of GCIs; ABox = finite set of class/property assertions; KB K = T ∪ A.

</details>

<details>
<summary><strong>Q4.</strong> How do you build a legal EL class expression?</summary>

Use:
1. Start with ⊤ or a class name A ∈ N_C.
2. If C and D are already EL classes, C ⊓ D is legal.
3. If C is an EL class and p ∈ N_P, ∃p.C is legal.
4. Do not introduce ¬, ⊔, or implication as class constructors.
Reference: EL classes are generated inductively by ⊤, class names A, conjunction C ⊓ D, and existential restriction ∃p.C.

</details>

<details>
<summary><strong>Q5.</strong> How do you use ⊤ in EL?</summary>

Use:
Treat ⊤ as the class containing every domain element. It is useful when you only need to say that some p-successor exists, without restricting its class.
Reference: ⊤^I = Δ^I; ⊤ is the universal class.

</details>

<details>
<summary><strong>Q6.</strong> How do you use conjunction C ⊓ D?</summary>

Use:
1. Use C ⊓ D when membership requires both conditions.
2. To test membership, check membership in C and in D.
3. To compute its extension, intersect the two extensions.
Reference: (C ⊓ D)^I = C^I ∩ D^I.

</details>

<details>
<summary><strong>Q7.</strong> How do you use an existential restriction ∃p.C?</summary>

Use:
1. Pick a candidate element x.
2. Look for some y with (x,y) ∈ p^I.
3. Check whether y ∈ C^I.
4. If such a y exists, x ∈ (∃p.C)^I.
Reference: (∃p.C)^I = {x ∈ Δ^I | ∃y ∈ C^I such that (x,y) ∈ p^I}.

</details>

<details>
<summary><strong>Q8.</strong> How do you read a nested existential restriction?</summary>

Use:
1. Work from the innermost class outward.
2. For each ∃p.C, replace C by its computed extension/condition.
3. An element qualifies if it has the required chain of p-successors ending in the inner class.
Reference: Nested expressions are built by repeated use of (∃p.C)^I = {x | ∃y ∈ C^I and (x,y) ∈ p^I}.

</details>

<details>
<summary><strong>Q9.</strong> Discriminator: EL class constructor or EL axiom?</summary>

Use:
- Inside class expressions: ⊤, A, C ⊓ D, ∃p.C.
- At axiom level: C ⊑ D, b:C, (b,c):p.
- Do not treat ⊑ as a class constructor.
Reference: EL syntax separates class expressions from axioms; C ⊑ D is a GCI axiom, not a class expression.

</details>

<details>
<summary><strong>Q10.</strong> What is missing from plain EL class syntax, and why does that matter?</summary>

Use:
When checking whether an expression is plain EL, reject full disjunction, full negation, and implication-as-a-class-constructor. These restrictions are part of why EL reasoning stays polynomial.
Reference: Plain EL has ⊤, class names, C ⊓ D, and ∃p.C, but not C ⊔ D, ¬C, or class-level implication.

</details>

<details>
<summary><strong>Q11.</strong> How do you specify an interpretation I for EL?</summary>

Use:
1. Choose a non-empty domain Δ^I.
2. Map each class name A to a subset A^I ⊆ Δ^I.
3. Map each property name p to a binary relation p^I ⊆ Δ^I × Δ^I.
4. If individuals are present, map each individual b to b^I ∈ Δ^I.
Reference: I = (Δ^I, ·^I), with Δ^I non-empty and ·^I interpreting names.

</details>

<details>
<summary><strong>Q12.</strong> How do you compute the extension of an EL class expression?</summary>

Use:
1. Interpret class names using the given mapping.
2. Replace ⊤ by Δ^I.
3. Replace conjunctions by intersections.
4. Replace existentials by the set of elements with an appropriate p-successor.
Reference: ⊤^I = Δ^I; (C ⊓ D)^I = C^I ∩ D^I; (∃p.C)^I = {x | ∃y ∈ C^I, (x,y) ∈ p^I}.

</details>

<details>
<summary><strong>Q13.</strong> Discriminator: class expression vs extension of a class expression</summary>

Use:
- C is syntax: a formal expression in the language.
- C^I is semantics: the set assigned to C under interpretation I.
- Only C^I is literally a set.
Reference: The interpretation function ·^I maps syntactic class expressions to subsets of Δ^I.

</details>

<details>
<summary><strong>Q14.</strong> How do you recognize a p-successor?</summary>

Use:
Given elements x and y, y is a p-successor of x exactly when the ordered pair (x,y) is in p^I.
Reference: If (x,y) ∈ p^I, then y is a p-successor of x.

</details>

<details>
<summary><strong>Q15.</strong> How do you draw/check an interpretation as a graph?</summary>

Use:
1. Draw each domain element as a node.
2. Mark class membership by labels/regions on nodes.
3. Draw each property pair (x,y) ∈ p^I as a directed p-arrow from x to y.
4. Evaluate ∃p.C by following p-arrows to C-labelled nodes.
Reference: Interpretations can be viewed as graphs: elements are nodes, class membership labels nodes, and properties are arrows.

</details>

<details>
<summary><strong>Q16.</strong> How do you classify an EL axiom by type?</summary>

Use:
1. If it has form C ⊑ D, it is a GCI.
2. If it has form b:C, it is a class assertion.
3. If it has form (b,c):p, it is a property assertion.
Reference: EL axioms are GCIs C ⊑ D, class assertions b:C, or property assertions (b,c):p.

</details>

<details>
<summary><strong>Q17.</strong> How do you use a GCI C ⊑ D?</summary>

Use:
1. Read it as: all C-instances must be D-instances.
2. To test it in I, compute C^I and D^I.
3. Check C^I ⊆ D^I.
Reference: I satisfies C ⊑ D iff C^I ⊆ D^I.

</details>

<details>
<summary><strong>Q18.</strong> Precision trap: why is “C is a subset of D” imprecise for C ⊑ D?</summary>

Use:
Say “C is subsumed by D” or “all C-instances are D-instances.” If you mention subsets, specify extensions under an interpretation.
Reference: C and D are syntactic class expressions; only C^I and D^I are sets, and I ⊨ C ⊑ D iff C^I ⊆ D^I.

</details>

<details>
<summary><strong>Q19.</strong> How do you use a class assertion b:C?</summary>

Use:
1. Interpret the individual name b as b^I.
2. Compute C^I.
3. Check whether b^I ∈ C^I.
Reference: I satisfies b:C iff b^I ∈ C^I.

</details>

<details>
<summary><strong>Q20.</strong> How do you use a property assertion (b,c):p?</summary>

Use:
1. Interpret b and c as b^I and c^I.
2. Interpret p as p^I.
3. Check whether (b^I,c^I) ∈ p^I.
Reference: I satisfies (b,c):p iff (b^I,c^I) ∈ p^I.

</details>

<details>
<summary><strong>Q21.</strong> Discriminator: TBox, ABox, or knowledge base?</summary>

Use:
- Only GCIs → TBox.
- Only class/property assertions → ABox.
- TBox plus ABox → KB.
Reference: TBox T is a finite set of GCIs; ABox A is a finite set of assertions; K = T ∪ A.

</details>

<details>
<summary><strong>Q22.</strong> How are individual names interpreted?</summary>

Use:
Map each individual name b to some domain element b^I. Do not assume two different names denote different elements unless the logic/KB states that separately.
Reference: Individual names satisfy b^I ∈ Δ^I; the basic definition does not impose unique names.

</details>

<details>
<summary><strong>Q23.</strong> How do you test whether I satisfies a whole TBox, ABox, or KB?</summary>

Use:
1. Test every axiom separately using the relevant satisfaction condition.
2. If every axiom is satisfied, I satisfies the set.
3. If one axiom fails, I is not a model.
Reference: I is a model of a TBox/ABox/KB iff I satisfies every axiom in it.

</details>

<details>
<summary><strong>Q24.</strong> Discriminator: model in description logic vs machine-learning model</summary>

Use:
In DL, a model is not a trained predictor. It is an interpretation that makes all axioms true.
Reference: A model of K is an interpretation I such that I satisfies every axiom in K.

</details>

<details>
<summary><strong>Q25.</strong> How do you test entailment K ⊨ α?</summary>

Use:
1. Identify the axiom α.
2. Consider all models I of K.
3. If every such I satisfies α, then K entails α.
4. A single model of K that violates α refutes the entailment.
Reference: K ⊨ α iff every model of K satisfies α.

</details>

<details>
<summary><strong>Q26.</strong> Discriminator: satisfied by one interpretation or entailed by a KB?</summary>

Use:
- I ⊨ α asks whether α holds in one interpretation.
- K ⊨ α asks whether α holds in every model of K.
Reference: Satisfaction is interpretation-relative; entailment quantifies over all models of K.

</details>

<details>
<summary><strong>Q27.</strong> How do you use equivalence C ≡ D in EL notation?</summary>

Use:
1. Replace C ≡ D by two GCIs.
2. Add C ⊑ D.
3. Add D ⊑ C.
4. Reason using those two inclusions.
Reference: C ≡ D is syntactic sugar for C ⊑ D and D ⊑ C.

</details>

<details>
<summary><strong>Q28.</strong> How do you solve an entailment-testing task?</summary>

Use:
1. Input: KB K and axiom α.
2. Determine whether K ⊨ α.
3. Typical α forms: C ⊑ D or b:C.
Reference: Entailment testing asks whether K ⊨? α.

</details>

<details>
<summary><strong>Q29.</strong> How do you solve an instance-retrieval task?</summary>

Use:
1. Input: KB K and class C.
2. For each individual name b, test whether K ⊨ b:C.
3. Return exactly those b.
Reference: Instance retrieval returns all individual names b such that K ⊨ b:C.

</details>

<details>
<summary><strong>Q30.</strong> How do you solve a classification task in EL?</summary>

Use:
1. For each A,B ∈ N_C ∪ {⊤}, test whether K ⊨ A ⊑ B.
2. For each individual b and class A, test whether K ⊨ b:A.
3. Use the entailed subsumptions to build the inferred hierarchy.
Reference: Classification computes the inferred class hierarchy and atomic class memberships.

</details>

<details>
<summary><strong>Q31.</strong> Discriminator: DL classification or ML classification?</summary>

Use:
If the task is computing subsumption relations among classes in a KB, it is DL classification. If it assigns labels to data examples using a trained predictor, it is ML classification.
Reference: In this sheet, classification means computing the inferred class hierarchy, not image/data classification.

</details>

<details>
<summary><strong>Q32.</strong> How do you recognize the inferred class hierarchy?</summary>

Use:
1. Take the entailed class subsumptions A ⊑ B.
2. Arrange classes by the subclass relation.
3. Remove or keep shortcut edges depending on presentation.
Reference: The inferred class hierarchy is a transitive partial order representable as a DAG.

</details>

<details>
<summary><strong>Q33.</strong> Precision trap: what should a modelling axiom not silently confuse?</summary>

Use:
When writing a GCI, separate normative/default claims from factual claims. Ask whether the axiom states what must always follow or merely what often happens.
Reference: DL axioms are logical constraints; models must satisfy them exactly.

</details>

<details>
<summary><strong>Q34.</strong> Why put an EL KB into normal form?</summary>

Use:
1. Convert many syntactic shapes into a small fixed set of axiom shapes.
2. Design consequence rules only for those shapes.
3. Prove termination/correctness more easily.
Reference: Normal forms simplify reasoning algorithms by reducing syntactic cases.

</details>

<details>
<summary><strong>Q35.</strong> How do you recognize an ENF axiom?</summary>

Use:
Check whether the axiom has exactly one of these shapes: A ⊑ B; A1 ⊓ A2 ⊑ B; A ⊑ ∃p.B; ∃p.A ⊑ B; b:A; (b,c):p.
Reference: In ENF, A,A1,A2,B ∈ N_C ∪ {⊤}, p ∈ N_P, and b,c ∈ N_I.

</details>

<details>
<summary><strong>Q36.</strong> How do you check whether a KB is fully in ENF?</summary>

Use:
1. Inspect every axiom.
2. Match each one against the six ENF shapes.
3. Reject any axiom with a complex RHS conjunction, complex filler where only a name is allowed, complex left conjunct where only a name is allowed, or complex class assertion.
Reference: A KB is in ENF iff every axiom is in one of the allowed ENF forms.

</details>

<details>
<summary><strong>Q37.</strong> Discriminator: why is A ⊑ C ⊓ D not ENF?</summary>

Use:
Look at the right-hand side. ENF allows A ⊑ B only when B is a class name or ⊤; it does not allow conjunction on the RHS.
Reference: RHS conjunctions must be split using A ⊑ C and A ⊑ D.

</details>

<details>
<summary><strong>Q38.</strong> Discriminator: why is C ⊓ ∃p.D ⊑ A not ENF?</summary>

Use:
Look inside the left conjunction. ENF permits A1 ⊓ A2 ⊑ B only when both conjuncts are class names or ⊤. A complex existential inside the conjunction violates ENF.
Reference: ENF left-conjunction form is A1 ⊓ A2 ⊑ B with A1,A2,B ∈ N_C ∪ {⊤}.

</details>

<details>
<summary><strong>Q39.</strong> Discriminator: why is b:C complex assertion not ENF?</summary>

Use:
Check the class after the colon. ENF permits b:A only when A is a class name or ⊤, not an arbitrary complex class.
Reference: ENF ABox class assertion form is b:A with A ∈ N_C ∪ {⊤}.

</details>

<details>
<summary><strong>Q40.</strong> General procedure: how do you transform an EL KB into ENF?</summary>

Use:
1. Scan for an axiom not matching an ENF shape.
2. Apply the transformation rule matching the offending syntactic pattern.
3. Introduce a fresh class name X whenever the rule requires naming a complex subexpression.
4. Repeat until no rule applies.
5. Keep the resulting ENF axioms as the transformed KB K′.
Reference: A transformation of K is the result of exhaustively applying the ENF transformation rules.

</details>

<details>
<summary><strong>Q41.</strong> How do you split a right-hand conjunction without fresh names?</summary>

Use:
1. Identify A ⊑ C ⊓ D.
2. Replace it by A ⊑ C and A ⊑ D.
3. This is exact over the same interpretation.
Reference: I ⊨ A ⊑ C ⊓ D iff I ⊨ A ⊑ C and I ⊨ A ⊑ D.

</details>

<details>
<summary><strong>Q42.</strong> Discriminator: exact equivalence or conservative extension?</summary>

Use:
- If no fresh vocabulary is introduced and the same interpretations work both ways, use exact equivalence.
- If fresh names are introduced, require conservative extension instead.
Reference: Conservative extension preserves consequences over the original vocabulary while allowing new names in K₂.

</details>

<details>
<summary><strong>Q43.</strong> How do you define conservative extension?</summary>

Use:
For K₁ and K₂ where all names of K₁ occur in K₂, check two directions: every model of K₂ is a model of K₁; every model of K₁ can be extended by interpreting new names to become a model of K₂.
Reference: K₂ is a conservative extension of K₁ iff those two model-extension conditions hold.

</details>

<details>
<summary><strong>Q44.</strong> What do the ENF transformation-rule metavariables mean?</summary>

Use:
Read A as a class name or ⊤; C,D as arbitrary EL classes; 𝓒,𝓓 as complex classes that are neither class names nor ⊤; X as a fresh class name.
Reference: Each rule application introduces a fresh, different X when needed.

</details>

<details>
<summary><strong>Q45.</strong> ENF Rule 1: how do you separate complex left and complex right sides?</summary>

Use:
1. Detect 𝓒 ⊑ 𝓓 where both sides are complex.
2. Introduce fresh X.
3. Replace by 𝓒 ⊑ X and X ⊑ 𝓓.
Reference: 𝓒 ⊑ 𝓓 ↝ 𝓒 ⊑ X, X ⊑ 𝓓.

</details>

<details>
<summary><strong>Q46.</strong> ENF Rule 2r: how do you name a complex right conjunct on the LHS?</summary>

Use:
1. Detect C ⊓ 𝓓 ⊑ A where the right conjunct 𝓓 is complex.
2. Introduce fresh X for 𝓓.
3. Replace by 𝓓 ⊑ X and C ⊓ X ⊑ A.
Reference: C ⊓ 𝓓 ⊑ A ↝ 𝓓 ⊑ X, C ⊓ X ⊑ A.

</details>

<details>
<summary><strong>Q47.</strong> ENF Rule 2l: how do you name a complex left conjunct on the LHS?</summary>

Use:
1. Detect 𝓒 ⊓ C ⊑ A where the left conjunct 𝓒 is complex.
2. Introduce fresh X for 𝓒.
3. Replace by 𝓒 ⊑ X and X ⊓ C ⊑ A.
Reference: 𝓒 ⊓ C ⊑ A ↝ 𝓒 ⊑ X, X ⊓ C ⊑ A.

</details>

<details>
<summary><strong>Q48.</strong> ENF Rule 3: how do you handle a complex existential filler on the left?</summary>

Use:
1. Detect ∃p.𝓓 ⊑ A where the filler 𝓓 is complex.
2. Introduce fresh X.
3. Add 𝓓 ⊑ X.
4. Replace the existential by ∃p.X ⊑ A.
Reference: ∃p.𝓓 ⊑ A ↝ 𝓓 ⊑ X, ∃p.X ⊑ A.

</details>

<details>
<summary><strong>Q49.</strong> ENF Rule 4: how do you handle a complex existential filler on the right?</summary>

Use:
1. Detect A ⊑ ∃p.𝓓 where the filler 𝓓 is complex.
2. Introduce fresh X.
3. Add X ⊑ 𝓓.
4. Replace the existential by A ⊑ ∃p.X.
Reference: A ⊑ ∃p.𝓓 ↝ X ⊑ 𝓓, A ⊑ ∃p.X.

</details>

<details>
<summary><strong>Q50.</strong> Discriminator: Rule 3 or Rule 4 fresh-name direction?</summary>

Use:
Ask which side the existential is on.
- Left existential ∃p.𝓓 ⊑ A → define upward: 𝓓 ⊑ X.
- Right existential A ⊑ ∃p.𝓓 → define downward: X ⊑ 𝓓.
Reference: Rule 3 uses 𝓓 ⊑ X; Rule 4 uses X ⊑ 𝓓.

</details>

<details>
<summary><strong>Q51.</strong> ENF Rule 5: how do you split a conjunction on the RHS?</summary>

Use:
1. Detect A ⊑ C ⊓ D.
2. Replace it by two inclusions with the same left side.
3. Add A ⊑ C and A ⊑ D.
Reference: A ⊑ C ⊓ D ↝ A ⊑ C, A ⊑ D.

</details>

<details>
<summary><strong>Q52.</strong> ENF Rule 6: how do you handle a complex class assertion?</summary>

Use:
1. Detect b:𝓒 where 𝓒 is complex.
2. Introduce fresh X.
3. Replace the assertion by b:X.
4. Add X ⊑ 𝓒 to connect X to the complex class.
Reference: b:𝓒 ↝ b:X, X ⊑ 𝓒.

</details>

<details>
<summary><strong>Q53.</strong> How do you choose which ENF transformation rule to apply?</summary>

Use:
1. Both sides complex GCI → Rule 1.
2. Complex conjunct on LHS → Rule 2l/2r.
3. Complex filler inside left existential → Rule 3.
4. Complex filler inside right existential → Rule 4.
5. RHS conjunction → Rule 5.
6. Complex class assertion → Rule 6.
Reference: ENF transformation is pattern-directed rewriting until no rule applies.

</details>

<details>
<summary><strong>Q54.</strong> How do you know an ENF transformation is exhausted?</summary>

Use:
Scan the KB after rewriting. If every axiom matches an ENF form and no transformation-rule pattern remains, the transformation is exhausted.
Reference: Exhaustive application means no ENF transformation rule is still applicable.

</details>

<details>
<summary><strong>Q55.</strong> What does the ENF transformation theorem give you?</summary>

Use:
After exhaustive rule application, you may rely on four facts: the process terminates, the result is linear in size, the result is a conservative extension, and the result is in ENF.
Reference: For EL K, transformation yields K′ that terminates, has linear size in K, is a conservative extension of K, and is in ENF.

</details>

<details>
<summary><strong>Q56.</strong> When does ENF transformation preserve entailment?</summary>

Use:
1. Let K′ be a transformation of K.
2. Check that α uses only original names from K.
3. Then reason over K′ instead of K.
Reference: If α uses only names from K, then K ⊨ α iff K′ ⊨ α.

</details>

<details>
<summary><strong>Q57.</strong> Proof sketch: why does ENF transformation terminate and stay linear?</summary>

Use:
1. Each rule targets a problematic complex subexpression.
2. A given relevant subexpression is named/simplified at most once.
3. There are only linearly many subexpressions in the original KB.
Reference: Termination and linear size follow from one bounded rewrite per relevant subexpression.

</details>

<details>
<summary><strong>Q58.</strong> Proof sketch: how do fresh names support conservative extension?</summary>

Use:
1. Show every K′ model satisfies the original axiom by chaining inclusions through X.
2. Show every K model can be extended by assigning X an appropriate set between the old-side extensions.
Reference: For Rule 1, 𝓒 ⊑ X and X ⊑ 𝓓 imply 𝓒^I ⊆ 𝓓^I; an old model can interpret X so K′ holds.

</details>

<details>
<summary><strong>Q59.</strong> How does the EL classification pipeline work?</summary>

Use:
1. Start with an original KB.
2. Transform it into ENF.
3. Saturate it with the consequence-based classifier.
4. Read off the inferred class hierarchy.
Reference: Original KB → ENF transformer → classifier → inferred class hierarchy.

</details>

<details>
<summary><strong>Q60.</strong> How do you initialise the consequence-based classification algorithm?</summary>

Use:
For every class name A occurring in K, add A ⊑ A and A ⊑ ⊤. These trivial inclusions help later rules fire uniformly.
Reference: Initialise K := K ∪ {A ⊑ A, A ⊑ ⊤ | A ∈ N_C occurs in K}.

</details>

<details>
<summary><strong>Q61.</strong> How do you apply the classification rules?</summary>

Use:
1. Start from the ENF KB after initialisation.
2. Apply CR1–CR6 whenever their premises are present.
3. Add the conclusion only if it is new.
4. Repeat until saturation: no rule can add anything.
Reference: Rule application continues until no more rules apply; rules are applied only when they change K.

</details>

<details>
<summary><strong>Q62.</strong> CR1: how do you use subsumption transitivity?</summary>

Use:
1. Find A1 ⊑ A2.
2. Find A2 ⊑ A3.
3. Add A1 ⊑ A3 if new.
Reference: If A1 ⊑ A2 ∈ K and A2 ⊑ A3 ∈ K, add A1 ⊑ A3.

</details>

<details>
<summary><strong>Q63.</strong> CR2: how do you use a conjunction-left GCI for class subsumption?</summary>

Use:
1. Find A ⊑ A1 and A ⊑ A2.
2. Find A1 ⊓ A2 ⊑ B.
3. Add A ⊑ B.
Reference: If A ⊑ A1, A ⊑ A2, and A1 ⊓ A2 ⊑ B are in K, add A ⊑ B.

</details>

<details>
<summary><strong>Q64.</strong> CR3: how do you reason through an existential restriction?</summary>

Use:
1. Find A ⊑ ∃p.A1.
2. Find A1 ⊑ B1.
3. Find ∃p.B1 ⊑ B.
4. Add A ⊑ B.
Reference: If A ⊑ ∃p.A1, A1 ⊑ B1, and ∃p.B1 ⊑ B are in K, add A ⊑ B.

</details>

<details>
<summary><strong>Q65.</strong> CR4: how do class assertions inherit along subsumption?</summary>

Use:
1. Find b:A.
2. Find A ⊑ B.
3. Add b:B.
Reference: If b:A and A ⊑ B are in K, add b:B.

</details>

<details>
<summary><strong>Q66.</strong> CR5: how do you use conjunction for an individual?</summary>

Use:
1. Find b:A and b:B.
2. Find A ⊓ B ⊑ C.
3. Add b:C.
Reference: If b:A, b:B, and A ⊓ B ⊑ C are in K, add b:C.

</details>

<details>
<summary><strong>Q67.</strong> CR6: how do you use a property assertion with an existential-left GCI?</summary>

Use:
1. Find (b,c):p.
2. Find c:B.
3. Find ∃p.B ⊑ A.
4. Add b:A.
Reference: If (b,c):p, c:B, and ∃p.B ⊑ A are in K, add b:A.

</details>

<details>
<summary><strong>Q68.</strong> Discriminator: CR4, CR5, or CR6 for deriving b:A?</summary>

Use:
- b has one known class and there is A ⊑ B → CR4.
- b has two known classes and a conjunction GCI → CR5.
- b is linked to c by p, c has class B, and ∃p.B ⊑ A → CR6.
Reference: CR4 propagates along subsumption; CR5 combines two class assertions; CR6 follows a property edge into an existential-left GCI.

</details>

<details>
<summary><strong>Q69.</strong> Precision trap: why is classification rule order not one-and-done?</summary>

Use:
Do not run CR1, then CR2, etc. just once. Any newly added axiom can make an earlier rule applicable again, so repeat all rules to saturation.
Reference: Classification applies CR1–CR6 until no rule can add a new axiom.

</details>

<details>
<summary><strong>Q70.</strong> What does the classification correctness theorem give you?</summary>

Use:
After saturating an ENF KB, you may rely on: termination, polynomial size, soundness of all added axioms, completeness for atomic subsumptions, and completeness for atomic class assertions.
Reference: For ENF K, the algorithm yields K′ with K ⊨ α for each α ∈ K′, and it contains all entailed A ⊑ B and b:B of the specified atomic forms.

</details>

<details>
<summary><strong>Q71.</strong> Discriminator: soundness vs completeness for the EL classifier</summary>

Use:
- Soundness: every axiom added is truly entailed by the original KB.
- Completeness here: every entailed atomic subsumption and atomic class assertion eventually appears in the saturated KB.
Reference: Soundness is no wrong additions; completeness is no missing target entailments for A ⊑ B and b:B.

</details>

<details>
<summary><strong>Q72.</strong> Why does the classification algorithm terminate in polynomially many additions?</summary>

Use:
1. Count only possible ENF-shaped axioms over the finite vocabulary.
2. The number of possible axioms is polynomial in class, property, and individual names.
3. Rules only add new axioms and never remove axioms.
4. Therefore only polynomially many additions can occur.
Reference: With m classes including ⊤, n properties, and i individuals, possible forms are bounded by m², m³, m²n, m²n, im, and i²n.

</details>

<details>
<summary><strong>Q73.</strong> Proof sketch: why is CR1 sound?</summary>

Use:
1. Take any model I of K.
2. From A1 ⊑ A2 get A1^I ⊆ A2^I.
3. From A2 ⊑ A3 get A2^I ⊆ A3^I.
4. By subset transitivity, A1^I ⊆ A3^I.
Reference: Therefore every model of K satisfies A1 ⊑ A3, so K ⊨ A1 ⊑ A3.

</details>

<details>
<summary><strong>Q74.</strong> Proof sketch: why is CR6 sound?</summary>

Use:
1. In any model I, (b,c):p gives (b^I,c^I) ∈ p^I.
2. c:B gives c^I ∈ B^I.
3. Therefore b^I ∈ (∃p.B)^I.
4. ∃p.B ⊑ A gives (∃p.B)^I ⊆ A^I.
5. Hence b^I ∈ A^I.
Reference: Every model satisfying the CR6 premises satisfies b:A, so K ⊨ b:A.

</details>

<details>
<summary><strong>Q75.</strong> Proof idea: how does the completeness proof use a canonical interpretation?</summary>

Use:
1. Build a canonical domain with one element for each class name and individual.
2. Interpret each class B by the saturated facts A ⊑ B and b:B.
3. Interpret each property p by saturated existential facts and property assertions.
4. Use missing saturated facts to build countermodels to non-entailed atomic claims.
Reference: The canonical interpretation for saturated K′ has elements x_A and x_b, with B^I′ and p^I′ defined from axioms in K′.

</details>

<details>
<summary><strong>Q76.</strong> How does EL express a class hierarchy?</summary>

Use:
Write subclass axioms A ⊑ B and let classification compute implied indirect superclass/subclass relations.
Reference: EL can represent class hierarchies using GCIs and infer the hierarchy through classification.

</details>

<details>
<summary><strong>Q77.</strong> How do you express necessary and sufficient conditions in EL notation?</summary>

Use:
1. Write A ≡ C when A should hold exactly when condition C holds.
2. Expand to A ⊑ C and C ⊑ A for reasoning.
3. Use this to define classes by conjunctions and existentials.
Reference: A ≡ C is syntactic sugar for A ⊑ C and C ⊑ A.

</details>

<details>
<summary><strong>Q78.</strong> How do you express the domain of a property in EL?</summary>

Use:
1. Use ∃p.⊤ to denote things with at least one p-successor.
2. Add ∃p.⊤ ⊑ A to say every subject of p is an A.
Reference: Domain-of-p-as-A is expressible as ∃p.⊤ ⊑ A.

</details>

<details>
<summary><strong>Q79.</strong> How does multi-dimensional modelling work in EL?</summary>

Use:
1. Avoid one huge hand-built hierarchy.
2. Define classes using several independent dimensions, such as properties and component hierarchies.
3. Let the reasoner classify the combined definitions.
Reference: EL supports taxonomy maintenance by defining classes through multiple smaller hierarchies and classifying the result.

</details>

<details>
<summary><strong>Q80.</strong> Can plain EL express class disjointness?</summary>

Use:
No. If the desired statement needs bottom/contradiction, plain EL cannot state it directly.
Reference: Disjointness would require a form like A ⊓ B ⊑ ⊥, but plain EL lacks ⊥/full negation.

</details>

<details>
<summary><strong>Q81.</strong> Can plain EL express the range of a property?</summary>

Use:
No. Plain EL can express domain via ∃p.⊤ ⊑ A, but it cannot constrain all p-successors to be in a range class.
Reference: Property ranges are not expressible in plain EL but are supported by EL++/OWL 2 EL-style extensions.

</details>

<details>
<summary><strong>Q82.</strong> Can plain EL express property hierarchies?</summary>

Use:
No. If you need p ⊑ q between properties, plain EL does not provide that property-inclusion construct.
Reference: Property hierarchies are listed as beyond plain EL and included in EL++ extensions.

</details>

<details>
<summary><strong>Q83.</strong> Can plain EL express transitive properties?</summary>

Use:
No. If you need p∘p ⊑ p or trans(p), plain EL cannot state it.
Reference: Transitivity of properties is not expressible in plain EL but is an EL++-style extension.

</details>

<details>
<summary><strong>Q84.</strong> Can plain EL use individuals as classes?</summary>

Use:
No. If the class condition refers to exactly one named individual as a nominal, plain EL cannot express it.
Reference: Plain EL lacks nominals/individuals-as-classes such as {b}.

</details>

<details>
<summary><strong>Q85.</strong> Can plain EL express inverse properties?</summary>

Use:
No. If you need p and q to be inverse directions of the same relationship, plain EL cannot link them as inverses.
Reference: Inverse properties are a limitation of plain EL and belong to richer DL/OWL-style features.

</details>

<details>
<summary><strong>Q86.</strong> What does EL++ add while preserving tractability?</summary>

Use:
Use EL++ when plain EL needs selected extra features such as disjointness, ranges, property hierarchies, transitivity, or nominals, while still avoiding full disjunction/negation.
Reference: EL++ extends EL with several expressive features while preserving polynomial-time reasoning.

</details>

<details>
<summary><strong>Q87.</strong> Why does EL++ still exclude full disjunction?</summary>

Use:
Full disjunction requires reasoning by cases. Case splits branch, and branching can lead to exponential behaviour, so it is excluded to preserve polynomial reasoning.
Reference: EL++ keeps polynomial-time reasoning by avoiding full disjunction.

</details>

<details>
<summary><strong>Q88.</strong> Discriminator: plain EL limitation or EL++ feature?</summary>

Use:
If the feature is selected structural expressivity—disjointness, range, property hierarchy, transitivity, or nominal—think EL++. If it is full C ⊔ D or full ¬C, it is still not in EL++.
Reference: EL++ adds selected features but still lacks full disjunction and full negation.

</details>

<details>
<summary><strong>Q89.</strong> How do propositional logic, EL, and richer DLs differ?</summary>

Use:
Compare by semantics and reasoning: propositional logic uses single-point valuations and focuses on satisfiability; EL uses many-element interpretations and focuses on entailment/classification with polynomial reasoning; richer DLs add expressivity and can be more complex.
Reference: DLs vary in complexity; EL/EL++ are polynomial, while propositional satisfiability is NP-complete and richer DLs may be higher.

</details>

<details>
<summary><strong>Q90.</strong> What is OWL in description-logic terms?</summary>

Use:
Treat OWL as a practical web ontology language whose logical meaning is inherited from underlying description logics. It supports axioms/ontologies and reasoning tasks such as entailment/classification.
Reference: OWL 2 is an ontology language built on DL foundations; OWL 2 EL is based on EL++.

</details>

<details>
<summary><strong>Q91.</strong> Discriminator: ontology, TBox, ABox, or knowledge graph terminology?</summary>

Use:
Ask how the speaker is using the terms. In CS, ontology can mean the whole KB or just the TBox; knowledge graph often refers to ABox-style factual assertions.
Reference: Terminology varies: TBox is often called ontology, ABox is often called knowledge graph, and ontology may also mean KB.

</details>

<details>
<summary><strong>Q92.</strong> Discriminator: EL logic or OWL 2 language?</summary>

Use:
- EL is the formal logic: syntax, semantics, axioms, entailment, classification.
- OWL 2 is a web-oriented ontology language with practical syntaxes/features built on DL semantics.
Reference: OWL 2 inherits semantics and reasoning from underlying DLs and adds annotations, datatypes, imports, versioning, and variants.

</details>

<details>
<summary><strong>Q93.</strong> What is the relationship between EL++ and OWL 2 EL?</summary>

Use:
When you see OWL 2 EL, remember it is the OWL profile grounded in the tractable EL++ family of description logics.
Reference: EL++ is the logical basis of OWL 2 EL.

</details>

<details>
<summary><strong>Q94.</strong> How do OWL annotations separate meaning from labels?</summary>

Use:
1. Treat the class/concept as the logical entity.
2. Attach one or more labels/terms as annotations.
3. Do not confuse lexical names with logical class identity.
Reference: OWL annotations distinguish a class/concept from the labels or terms used for it.

</details>

<details>
<summary><strong>Q95.</strong> How does OWL-style taxonomy maintenance use definitions?</summary>

Use:
1. Define classes using logical conditions.
2. Run a reasoner/classifier.
3. Let the reasoner place classes in the inferred taxonomy.
4. Avoid manual placement when definitions can imply it.
Reference: OWL/DL reasoners classify ontologies by deriving subsumptions from class definitions.

</details>

<details>
<summary><strong>Q96.</strong> How does OWL-style individual typing support querying?</summary>

Use:
1. Assert facts about an individual using class/property assertions.
2. Use TBox definitions to infer additional class memberships.
3. Query by the inferred class, not only explicit assertions.
Reference: Class assertions plus TBox axioms can entail new b:C facts for instance retrieval.

</details>

<details>
<summary><strong>Q97.</strong> How do OWL-style property chains link individuals?</summary>

Use:
1. Use a chain axiom when two consecutive properties imply a third relationship.
2. Match a path b --p→ c --q→ d.
3. Infer b --r→ d when p∘q ⊑ r is available.
Reference: Property-chain-style axioms have schematic form p∘q ⊑ r.

</details>

<details>
<summary><strong>Q98.</strong> What practical OWL tool categories should you recognize?</summary>

Use:
Recognize the ecosystem roles: reasoners derive entailments/classifications; ontology editors let users build ontologies; APIs/libraries manipulate OWL programmatically; specialist tools explain, modularize, or diff ontologies.
Reference: The sheet lists OWL reasoners, ontology editors, APIs/libraries, and tools for explanation, module extraction, and diffing.

</details>

<details>
<summary><strong>Q99.</strong> Precision trap: what vocabulary restriction applies after ENF transformation?</summary>

Use:
When comparing K and transformed K′, only ask entailment preservation for axioms using original names from K. Do not ask K to entail statements involving fresh auxiliary X names.
Reference: If α uses only names from K, then K ⊨ α iff K′ ⊨ α.

</details>

<details>
<summary><strong>Q100.</strong> Precision trap: what should you not assume about fresh auxiliary names?</summary>

Use:
Do not assume a fresh X already has the intended meaning in old interpretations. Its interpretation is chosen only when extending old models to models of the transformed KB.
Reference: Fresh names motivate conservative extension rather than exact equivalence over the same interpretations.

</details>

<details>
<summary><strong>Q101.</strong> Precision trap: why should Rules 3 and 4 not be direction-swapped?</summary>

Use:
Ask whether the complex filler is on the left or right of ⊑. Left existential uses 𝓓 ⊑ X; right existential uses X ⊑ 𝓓. Swapping breaks the conservative-extension argument.
Reference: Rule 3: ∃p.𝓓 ⊑ A ↝ 𝓓 ⊑ X, ∃p.X ⊑ A; Rule 4: A ⊑ ∃p.𝓓 ↝ X ⊑ 𝓓, A ⊑ ∃p.X.

</details>

<details>
<summary><strong>Q102.</strong> Precision trap: why is naive rule scanning not the implementation story?</summary>

Use:
For exam reasoning, know the rules. For large ontologies, do not assume practical reasoners scan every possible combination blindly; they need indexing/optimisation to apply rules efficiently.
Reference: The theoretical polynomial bound limits possible additions, but practical classification requires clever rule application.

</details>
