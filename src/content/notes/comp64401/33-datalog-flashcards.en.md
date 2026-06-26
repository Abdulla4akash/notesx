---
subject: COMP64401
chapter: 33
title: "Datalog — Flashcards"
language: en
---

# Datalog — Flashcards

83 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> What is the role of Datalog in this lecture block?</summary>

Use it as a rule-based KR language: 1. State base data as ground facts. 2. State general knowledge as rules. 3. Derive all consequences by rule application/fixed point. 4. Use the result for query answering or classification.<br>Ref: Datalog is a logic-programming language for knowledge representation, reasoning, and deductive databases.

</details>

<details>
<summary><strong>Q2.</strong> How do you recognise a logic-programming rule system?</summary>

Use this test: are conclusions written as atoms that follow when body atoms hold? If yes, it is rule-based logic programming.<br>Ref: Logic programming represents knowledge using atoms, rules, and clauses; rules say when atoms follow from other atoms.

</details>

<details>
<summary><strong>Q3.</strong> Which logic-programming variants are mentioned, and what should you do with them in this lecture?</summary>

Use them as context only: recognise Prolog, Answer Set Programming, Constraint Logic Programming, and Datalog as variants. For this lecture, reason with Datalog unless an extension is explicitly named.<br>Ref: The course focuses on Datalog and later mentions limitations/extensions.

</details>

<details>
<summary><strong>Q4.</strong> How do you check whether a symbol can be used as a Datalog term?</summary>

Use: 1. Check whether it is a variable. 2. If not, check whether it is a named individual/constant. 3. If neither, it is not a term in plain Datalog. 4. Do not allow function terms in plain Datalog.<br>Ref: Terms are N_VI := N_V ∪ N_I, where N_V is variables and N_I is individuals/constants.

</details>

<details>
<summary><strong>Q5.</strong> How do you check whether an expression is a well-formed atom?</summary>

Use: 1. Identify the predicate symbol. 2. Look up its arity n. 3. Count the arguments. 4. Check every argument is a term. 5. Accept only if the number of arguments is exactly n.<br>Ref: If P ∈ N_P has arity n and a_i ∈ N_VI, then P(a_1,...,a_n) is an atom.

</details>

<details>
<summary><strong>Q6.</strong> What is the discriminator between a predicate symbol and an atom?</summary>

Ask: has the predicate been applied to the correct number of terms? If no, it is just a predicate symbol; if yes, it is an atom.<br>Ref: An atom has form P(a_1,...,a_n) for an n-ary predicate P.

</details>

<details>
<summary><strong>Q7.</strong> How do you parse a Datalog rule H :- A_1,...,A_m?</summary>

Use: 1. Treat H as the head/conclusion. 2. Treat A_1,...,A_m as the body/premises. 3. Read it as: if all body atoms hold, then the head holds. 4. Check safety: every variable in H occurs in the body.<br>Ref: A Datalog rule is B :- A_1,...,A_m, where B and A_i are atoms, m ≥ 0, and head variables occur in the body.

</details>

<details>
<summary><strong>Q8.</strong> What direction does :- point in a Datalog rule?</summary>

Discriminator: the body is on the right, the conclusion is on the left. H :- A_1,A_2 means A_1 ∧ A_2 ⇒ H, not H ⇒ A_1 ∧ A_2.<br>Ref: ':-' is read as 'if'; body implies head.

</details>

<details>
<summary><strong>Q9.</strong> How do you recognise a Datalog program?</summary>

Use: 1. Check each statement is a valid Datalog rule. 2. Check the collection is finite. 3. Treat facts as rules with empty bodies. 4. Treat the whole set as the program P.<br>Ref: A Datalog program is a finite set of Datalog rules.

</details>

<details>
<summary><strong>Q10.</strong> How do you recognise a ground fact?</summary>

Use: 1. Check it is an atom with no variables. 2. Check it is asserted unconditionally. 3. Rewrite it, if useful, as a rule with an empty body.<br>Ref: A fact is a rule with no body; a ground fact is a variable-free atom asserted unconditionally.

</details>

<details>
<summary><strong>Q11.</strong> What is the discriminator between a ground atom and a non-ground atom?</summary>

Ask: does any argument contain a variable? If yes, it is non-ground. If all arguments are named individuals/constants, it is ground.<br>Ref: A ground atom is an atom with no variables.

</details>

<details>
<summary><strong>Q12.</strong> How do you apply the Datalog safety condition?</summary>

Use: 1. List variables in the rule head. 2. List variables appearing in all body atoms. 3. Check head variables ⊆ body variables. 4. Reject the rule if the head contains a fresh variable.<br>Ref: Plain Datalog requires every head variable to occur in some body atom.

</details>

<details>
<summary><strong>Q13.</strong> Why does the no-fresh-head-variable condition matter?</summary>

Use this intuition: if a head variable does not occur in the body, the rule would have to invent an unnamed individual. Plain Datalog forbids that, so reasoning stays over named individuals only.<br>Ref: Safety supports the active-domain restriction.

</details>

<details>
<summary><strong>Q14.</strong> How do you convert a Datalog rule into a Horn clause?</summary>

Use: 1. Rewrite H :- A_1,...,A_m as A_1 ∧ ... ∧ A_m ⇒ H. 2. Convert implication to disjunction: H ∨ ¬(A_1 ∧ ... ∧ A_m). 3. Push negation through conjunction: H ∨ ¬A_1 ∨ ... ∨ ¬A_m. 4. Check there is at most one positive literal.<br>Ref: Datalog rules are Horn clauses with at most one positive literal.

</details>

<details>
<summary><strong>Q15.</strong> What is the discriminator for a Horn clause?</summary>

Ask: how many positive literals does the clause contain? At most one means Horn; more than one means not Horn.<br>Ref: Horn clauses are clauses with at most one positive literal.

</details>

<details>
<summary><strong>Q16.</strong> How do the three Datalog semantics relate?</summary>

Use them by role: model-theoretic semantics defines truth over interpretations; minimal-model/Herbrand semantics gives one canonical model; fixed-point semantics gives the computation. They agree for plain Datalog.<br>Ref: The lecture states model-theoretic, minimal-model-theoretic, and fixed-point semantics are equivalent.

</details>

<details>
<summary><strong>Q17.</strong> How do you recognise an interpretation for Datalog?</summary>

Use: 1. Provide a non-empty domain Δ^I. 2. Map each n-ary predicate to an n-ary relation over Δ^I. 3. Map each individual/constant to an element of Δ^I. 4. Use substitutions separately for variables.<br>Ref: I = (Δ^I, ·^I), with A^I ⊆ (Δ^I)^n and b^I ∈ Δ^I.

</details>

<details>
<summary><strong>Q18.</strong> Why does Datalog semantics need substitutions?</summary>

Use this distinction: individuals get meaning from the interpretation; variables get temporary values from a substitution. To evaluate an atom with variables, you need both.<br>Ref: A substitution is σ : N_V → Δ^I.

</details>

<details>
<summary><strong>Q19.</strong> How do you evaluate a term under an interpretation and substitution?</summary>

Use: 1. If the term is a variable x, return σ(x). 2. If it is an individual/constant c, return c^I. 3. Use the resulting domain elements inside predicate relations.<br>Ref: d^{I,σ} = σ(d) for variables and d^I for individuals/constants.

</details>

<details>
<summary><strong>Q20.</strong> How do you test satisfaction of an atom?</summary>

Use: 1. Evaluate each argument under I and σ. 2. Form the interpreted tuple. 3. Check whether that tuple belongs to the predicate's interpreted relation.<br>Ref: I,σ ⊨ P(d_1,...,d_n) iff (d_1^{I,σ},...,d_n^{I,σ}) ∈ P^I.

</details>

<details>
<summary><strong>Q21.</strong> How do you test satisfaction of a rule under I and σ?</summary>

Use: 1. Check all body atoms under I,σ. 2. If any body atom fails, the rule is satisfied vacuously. 3. If all body atoms hold, check the head atom holds. 4. The rule fails only when the body holds and the head does not.<br>Ref: I,σ satisfies H :- A_1,...,A_m iff body truth implies head truth.

</details>

<details>
<summary><strong>Q22.</strong> How do you test satisfaction of a Datalog program?</summary>

Use: 1. Take each rule in P. 2. Check that the interpretation/substitution satisfies every rule. 3. A program is satisfied only if no rule is violated.<br>Ref: I,σ satisfies P if it satisfies every rule in P.

</details>

<details>
<summary><strong>Q23.</strong> How do you test model-theoretic entailment P ⊨ α?</summary>

Use: 1. Consider every interpretation and substitution satisfying P. 2. Check whether α is true in all of them. 3. If yes, α is entailed; if one countermodel exists, it is not.<br>Ref: P ⊨ α iff every model/substitution satisfying P also satisfies α.

</details>

<details>
<summary><strong>Q24.</strong> How should variables in Datalog rules be read?</summary>

Discriminator: read rule variables universally, not existentially. H(x) :- A(x) means for every x, if A(x) then H(x).<br>Ref: Variables in Datalog rules are universally quantified.

</details>

<details>
<summary><strong>Q25.</strong> How do you construct the Herbrand base HB(P)?</summary>

Use: 1. List all named individuals/constants occurring in P. 2. List all predicates occurring in P with their arities. 3. For each n-ary predicate, form every possible n-tuple of named individuals. 4. Collect all resulting ground atoms.<br>Ref: HB(P) = {A(b_1,...,b_n) | b_i ∈ N_I, A occurs in P, A has arity n}.

</details>

<details>
<summary><strong>Q26.</strong> What is the discriminator between the Herbrand base and the Herbrand model?</summary>

Ask: is it merely possible, or actually forced by facts/rules? HB(P) contains all possible ground atoms; HM(P) contains only the ground atoms entailed by closure from the facts.<br>Ref: HB(P) is the candidate set; HM(P) is the minimal rule-closed subset of HB(P).

</details>

<details>
<summary><strong>Q27.</strong> How do you recognise the Herbrand model HM(P)?</summary>

Use: 1. It must be a subset of HB(P). 2. It must contain all facts. 3. It must be closed under every grounded rule application. 4. It must contain nothing unnecessary beyond closure.<br>Ref: HM(P) is the smallest subset of HB(P) containing facts and closed under P's rules.

</details>

<details>
<summary><strong>Q28.</strong> How do you check whether a set X is closed under a Datalog program?</summary>

Use: 1. For every rule H :- A_1,...,A_m. 2. For every grounding substitution σ over program individuals. 3. If all σ(A_i) are in X, check σ(H) is also in X. 4. If any such head is missing, X is not closed.<br>Ref: Rule-closed sets contain every grounded head whose grounded body atoms they contain.

</details>

<details>
<summary><strong>Q29.</strong> How do you use the Herbrand-model entailment theorem?</summary>

Use: 1. Ensure α is a ground atom. 2. Compute or reason about HM(P). 3. Answer yes iff α ∈ HM(P).<br>Ref: For ground α, P ⊨ α iff α ∈ HM(P).

</details>

<details>
<summary><strong>Q30.</strong> What is the active domain in Datalog?</summary>

Use this rule: only named individuals already occurring in the program are available for Herbrand reasoning. Do not invent anonymous elements.<br>Ref: The active domain is the set of named individuals/constants occurring in P.

</details>

<details>
<summary><strong>Q31.</strong> How do you estimate the size of HB(P)?</summary>

Use: 1. Let p be the number of predicates. 2. Let m be the number of individuals. 3. Let n be maximum predicate arity. 4. Bound the number of ground atoms by p·m^n.<br>Ref: With fixed maximum arity n, HB(P) and HM(P) are finite and polynomial in |P|.

</details>

<details>
<summary><strong>Q32.</strong> What is the critical complexity caveat for Datalog?</summary>

Discriminator: is predicate arity fixed/bounded? If yes, Herbrand reasoning is polynomial-sized. If arity can grow with input, p·m^n may become exponential.<br>Ref: Polynomiality depends on bounded predicate arity.

</details>

<details>
<summary><strong>Q33.</strong> How do you compute a Herbrand model by forward chaining?</summary>

Use: 1. Build the active domain and relevant ground atoms. 2. Add all ground facts. 3. Repeatedly find rules whose grounded bodies are already known. 4. Add their grounded heads. 5. Stop when no new atoms appear.<br>Ref: HM(P) is obtained by saturating facts under the rules until closure.

</details>

<details>
<summary><strong>Q34.</strong> How do you apply a Datalog rule during derivation?</summary>

Use: 1. Choose a rule H :- A_1,...,A_m. 2. Choose a substitution σ mapping variables to named individuals. 3. Ground the body and head. 4. If every σ(A_i) is known, add σ(H).<br>Ref: A grounded rule instance fires when all grounded body atoms are in the current set.

</details>

<details>
<summary><strong>Q35.</strong> How do you define the immediate consequence operator ICO_P?</summary>

Use it as one-step closure: from current known ground atoms X, keep X and add every grounded rule head whose grounded body is already in X.<br>Ref: ICO_P(X) = X ∪ {σ(H) ∈ HB(P) | H :- A_1,...,A_n ∈ P and all σ(A_i) ∈ X}.

</details>

<details>
<summary><strong>Q36.</strong> Why is ICO_P monotone/additive in this lecture?</summary>

Use: compare X with ICO_P(X). The operator never deletes atoms; it keeps all of X and may add consequences. Therefore X ⊆ ICO_P(X).<br>Ref: Monotonicity here is expressed by X ⊆ ICO_P(X).

</details>

<details>
<summary><strong>Q37.</strong> How do you compute the least fixed point of ICO_P?</summary>

Use: 1. Start from ∅. 2. Apply ICO_P repeatedly. 3. Union all stages. 4. Because HB(P) is finite under bounded arity, iteration stabilises. 5. The stable set is ICO_P*(∅).<br>Ref: Kleene fixed-point theorem gives the least fixed point as ⋃_i ICO_P^i(∅).

</details>

<details>
<summary><strong>Q38.</strong> How do fixed-point semantics and Herbrand semantics connect?</summary>

Use the theorem directly: the result of iterated immediate consequence from ∅ is exactly the Herbrand model. Compute one to get the other.<br>Ref: HM(P) = ICO_P*(∅).

</details>

<details>
<summary><strong>Q39.</strong> How do you answer ground entailment using fixed-point semantics?</summary>

Use: 1. Compute ICO_P*(∅). 2. Check whether the ground atom α appears in the fixed point. 3. Yes iff it appears.<br>Ref: P ⊨ α iff α ∈ ICO_P*(∅).

</details>

<details>
<summary><strong>Q40.</strong> What is the naive algorithm for all ground atomic entailments?</summary>

Use: 1. Set X := ∅. 2. Repeat: copy X to X'. 3. For each rule and each substitution from rule variables to individuals, add the head to X' when all body atoms are in X. 4. If X'=X, return X; else set X:=X'.<br>Ref: The naive fixed-point algorithm computes HM(P).

</details>

<details>
<summary><strong>Q41.</strong> How do you optimise the naive fixed-point algorithm using facts?</summary>

Use: initialise X with all facts instead of ∅, because the first immediate consequence stage from ∅ produces exactly the facts.<br>Ref: ICO_P(∅) is the set of facts in P.

</details>

<details>
<summary><strong>Q42.</strong> How do you optimise substitution search in forward chaining?</summary>

Use: 1. Do not try all variable-to-individual maps blindly. 2. Match body atoms against already known facts. 3. Extend only substitutions that can satisfy the body. 4. Use selective body atoms early.<br>Ref: Focused substitution search considers only substitutions whose grounded body atoms have a chance of being in X.

</details>

<details>
<summary><strong>Q43.</strong> How do you decide one specific ground entailment P ⊨ α naively?</summary>

Use: 1. Compute HM(P). 2. Check α ∈ HM(P). 3. Remember this may be wasteful if α is only one query target.<br>Ref: Ground entailment reduces to membership in the Herbrand model.

</details>

<details>
<summary><strong>Q44.</strong> Why can computing the whole HM(P) be wasteful for one query?</summary>

Use this diagnostic: if you only need yes/no for one α, full saturation may derive many irrelevant atoms. A goal-directed method could reason backwards from α instead.<br>Ref: The lecture notes whole-model computation can be wasteful for single-query answering.

</details>

<details>
<summary><strong>Q45.</strong> How do you recognise a conjunctive query?</summary>

Use: 1. Look for a query head q(x⃗). 2. Look for a body that is a conjunction of atoms. 3. The answer is all tuples of individuals making every body atom true after substitution.<br>Ref: A conjunctive query has form q(x⃗) :- A_1,...,A_n.

</details>

<details>
<summary><strong>Q46.</strong> How do you answer a conjunctive query naively?</summary>

Use: 1. Compute HM(P). 2. Enumerate tuples a⃗ over the program individuals for the query variables. 3. Substitute a⃗ into every query atom. 4. Output a⃗ iff all grounded query atoms are in HM(P).<br>Ref: Return all a⃗ such that P entails each A_i[x⃗/a⃗].

</details>

<details>
<summary><strong>Q47.</strong> How do you recognise rule entailment?</summary>

Use this discriminator: the query is not a single ground atom but an entire rule H :- A_1,...,A_n. You are asking whether the program makes that implication valid in all models.<br>Ref: P entails a rule if every model/substitution satisfying P also satisfies that rule.

</details>

<details>
<summary><strong>Q48.</strong> How do you reduce rule entailment to ground entailment?</summary>

Use the fresh-constant trick: 1. Introduce fresh constants c_1,...,c_k for the rule variables. 2. Add the grounded body atoms as facts to P. 3. Compute the Herbrand model of the extended program. 4. Check whether the grounded head is in it.<br>Ref: P ⊨ H :- A_1,...,A_n iff H(c⃗) ∈ HM(P ∪ {A_1(c⃗),...,A_n(c⃗)}).

</details>

<details>
<summary><strong>Q49.</strong> Why must the constants in the fresh-constant trick be fresh?</summary>

Use: choose constants not already in P so they represent arbitrary placeholders rather than existing individuals with extra facts. This tests the general rule pattern, not an accidental named case.<br>Ref: The reduction uses one fresh constant per variable, none already occurring in P.

</details>

<details>
<summary><strong>Q50.</strong> How do you express a hierarchy in Datalog?</summary>

Use a one-body rule from the narrower predicate to the broader predicate: Broad(x) :- Narrow(x). Chain such rules for multi-level hierarchies.<br>Ref: Datalog expresses class/property hierarchies using implication rules.

</details>

<details>
<summary><strong>Q51.</strong> How do you express domain and range typing for a relation?</summary>

Use: for relation R(x,y), add DomainType(x) :- R(x,y) and RangeType(y) :- R(x,y). For higher arity, add one typing rule for each argument position.<br>Ref: Datalog can infer argument types from relations.

</details>

<details>
<summary><strong>Q52.</strong> How do you express types for higher-arity predicates?</summary>

Use: for an n-ary predicate R(x_1,...,x_n), write separate rules Type_i(x_i) :- R(x_1,...,x_n) for each argument position you want to type.<br>Ref: Datalog predicates may have arity greater than two.

</details>

<details>
<summary><strong>Q53.</strong> How do you recognise that Datalog is using a complex relational structure?</summary>

Use this test: do multiple variables in one rule body connect through several predicates in a graph-like pattern rather than a simple tree? If yes, Datalog is exploiting general relational structure.<br>Ref: Datalog can describe arbitrary finite graph-like patterns among active-domain variables.

</details>

<details>
<summary><strong>Q54.</strong> How do you express an inverse-like relation in Datalog?</summary>

Use: Inv(y,x) :- R(x,y), or equivalently choose the variable order that matches the intended inverse. Do not swap variables accidentally.<br>Ref: Datalog can express inverse-like implications between predicates/properties.

</details>

<details>
<summary><strong>Q55.</strong> How do you express a subproperty-style implication in Datalog?</summary>

Use: Super(x,y) :- Sub(x,y). Preserve variable order unless the intended meaning is inverse.<br>Ref: Datalog can state that one relation/property implies another.

</details>

<details>
<summary><strong>Q56.</strong> How do you define a recursive transitive closure in Datalog?</summary>

Use: 1. Add a base rule from the direct edge relation to the closure relation. 2. Add a recursive rule saying closure(x,z) and closure(z,y) imply closure(x,y). 3. Add symmetry separately if the intended relation is undirected.<br>Ref: Datalog supports recursive rules and can define transitive/symmetric closures over the active domain.

</details>

<details>
<summary><strong>Q57.</strong> What is the discriminator between recursion and a hierarchy chain?</summary>

Ask: does the predicate being defined appear in its own definition? If yes, it is recursion; if no, it is only a chain of implications.<br>Ref: Recursive Datalog rules allow a derived predicate to depend on itself.

</details>

<details>
<summary><strong>Q58.</strong> How do you spot an attempt to express anonymous individuals in plain Datalog?</summary>

Use: check whether the rule requires a head variable, object, or function term not supplied by the body facts. If yes, it is trying to create an unnamed individual and is not plain Datalog.<br>Ref: Plain Datalog cannot introduce anonymous/existential individuals.

</details>

<details>
<summary><strong>Q59.</strong> Why are function terms forbidden in plain Datalog?</summary>

Use this intuition: function terms can generate new terms from old ones, potentially escaping the finite active domain. Plain Datalog disallows them to preserve finite Herbrand reasoning.<br>Ref: Terms in this lecture are only variables or named individuals/constants, not functions.

</details>

<details>
<summary><strong>Q60.</strong> How do you recognise a disjunctive-head statement that plain Datalog cannot express?</summary>

Use: inspect the rule head. If it contains H_1 ∨ H_2 or more than one alternative conclusion, it is not plain Datalog. Plain Datalog heads contain one atom.<br>Ref: Plain Datalog has no disjunction in rule heads.

</details>

<details>
<summary><strong>Q61.</strong> How do you recognise negation that plain Datalog cannot express?</summary>

Use: look for not A, ¬A, disjointness, or negative conclusions. Plain Datalog in this lecture permits only positive atoms in rule bodies and heads.<br>Ref: Plain Datalog has no full negation.

</details>

<details>
<summary><strong>Q62.</strong> How does Datalog with negation-as-failure derive a default conclusion?</summary>

Use: 1. Check the positive body atoms are known/entailed. 2. Check the negated atom is not entailed. 3. Infer the head by default. 4. Be ready to withdraw it if the negated atom is later derived.<br>Ref: Negation as failure allows body literals of the form not A and is non-monotonic.

</details>

<details>
<summary><strong>Q63.</strong> What is monotonicity of a logic?</summary>

Use this test: after adding more premises, can an old entailment disappear? If no, the logic is monotonic. If yes, it is non-monotonic.<br>Ref: A logic is monotonic if P ⊨ α implies P ∪ P' ⊨ α for all P',α.

</details>

<details>
<summary><strong>Q64.</strong> What is the discriminator between plain Datalog and Datalog with negation-as-failure?</summary>

Ask: can adding a new fact invalidate a previous conclusion? Plain Datalog: no, monotonic. Negation-as-failure extension: yes, non-monotonic.<br>Ref: Plain Datalog is monotonic; default negation can force withdrawal of conclusions.

</details>

<details>
<summary><strong>Q65.</strong> When is negation in Datalog easier to give semantics to?</summary>

Use: check whether there are cyclic dependencies through negation. If none, the program is stratified and semantics is easier. If cycles through negation exist, multiple-model/non-unique semantics issues may arise.<br>Ref: The lecture mentions stratified negation, stable model semantics, and Answer Set Programming.

</details>

<details>
<summary><strong>Q66.</strong> How do you recognise disjunctive Datalog?</summary>

Use: inspect rule heads. If a rule can conclude H_1 ∨ ... ∨ H_k, it is disjunctive Datalog rather than plain Datalog.<br>Ref: Disjunctive Datalog allows disjunction in rule heads and is associated in the lecture with disjunctive stable-model semantics.

</details>

<details>
<summary><strong>Q67.</strong> What do data-type extensions add to Datalog?</summary>

Use them when rules need values beyond symbolic constants: numbers, strings, comparisons, arithmetic/operations, aggregation, records, arrays, lists, or pointers.<br>Ref: Datalog with data types is important for program analysis and verification applications.

</details>

<details>
<summary><strong>Q68.</strong> How do guarded Datalog-DL style extensions control expressivity?</summary>

Use: 1. They try to combine Datalog's relational rules with DL-style anonymous/existential individuals. 2. They restrict rules by guardedness. 3. The guard keeps variables tied to a body atom to preserve decidability/complexity control.<br>Ref: A guarded rule has all universally quantified variables occurring together in a single body atom.

</details>

<details>
<summary><strong>Q69.</strong> How do you check whether a rule is guarded?</summary>

Use: 1. List all universally quantified variables of the rule. 2. Search the body for one atom containing all of them together. 3. If such an atom exists, the rule is guarded; if not, it is unguarded.<br>Ref: Guardedness requires all universal variables to occur together in a single body atom.

</details>

<details>
<summary><strong>Q70.</strong> What properties do plain Datalog and the studied description logics share?</summary>

Use: recognise both as restricted first-order fragments designed for decidable, tractable KR reasoning. Both use model-theoretic entailment and are monotonic in their plain forms.<br>Ref: The lecture presents both as Horn-style, decidable fragments of first-order logic; Datalog needs bounded arity for polynomiality.

</details>

<details>
<summary><strong>Q71.</strong> How do you distinguish factual knowledge in DL from factual knowledge in Datalog?</summary>

Discriminator: DL stores individual assertions in the ABox; Datalog stores them as ground facts, also called the extensional database/EDB.<br>Ref: Factual knowledge in Datalog is represented by ground facts.

</details>

<details>
<summary><strong>Q72.</strong> How do you distinguish conceptual knowledge in DL from conceptual knowledge in Datalog?</summary>

Discriminator: DL uses TBox/class axioms; Datalog uses universally quantified rules that derive new facts from existing facts.<br>Ref: Conceptual/class-level knowledge constrains models and supports inferred facts/relations.

</details>

<details>
<summary><strong>Q73.</strong> Where is Datalog stronger than the studied description logics?</summary>

Use this checklist: 1. Need predicates of arity > 2? Datalog handles them directly. 2. Need graph-like variable patterns? Datalog handles them. 3. Need recursion/transitive closure? Datalog handles it naturally.<br>Ref: Datalog is stronger for higher arity, general relational structures, and recursion.

</details>

<details>
<summary><strong>Q74.</strong> Where are description logics stronger than plain Datalog?</summary>

Use this checklist: 1. Need to assert existence of unnamed individuals? DL can. 2. Need existential restrictions over anonymous tree-shaped structures? DL can. Plain Datalog cannot create new individuals.<br>Ref: Description logics can express anonymous/existential individuals; plain Datalog is active-domain only.

</details>

<details>
<summary><strong>Q75.</strong> Active domain vs anonymous individuals: which formalism fits?</summary>

Discriminator: if every object must already be named, use plain Datalog. If the statement says some object exists without naming it, use description logic or an extension.<br>Ref: Datalog reasons over the active domain; DL can use existential restrictions.

</details>

<details>
<summary><strong>Q76.</strong> General graph pattern vs tree-shaped anonymous structure: which formalism fits?</summary>

Discriminator: if the statement needs arbitrary links among several variables, Datalog is natural. If it only needs anonymous existential successors in a tree-shaped pattern, DL is natural.<br>Ref: Datalog supports general relational structures; DL supports tree-shaped anonymous structures.

</details>

<details>
<summary><strong>Q77.</strong> How do propositional logic, DL, and Datalog differ by semantic object?</summary>

Use: propositional logic uses valuations over propositional variables; DL uses interpretations with domain elements and class/role meanings; Datalog uses interpretations plus substitutions/active-domain ground reasoning.<br>Ref: The comparison table contrasts valuation semantics, DL interpretations, and Datalog interpretations over named individuals/active domain.

</details>

<details>
<summary><strong>Q78.</strong> How do propositional logic, DL, and Datalog differ by predicate arity?</summary>

Use: propositional logic has no explicit relational arity; studied DLs mainly use unary classes and binary roles; Datalog allows predicates of any fixed arity.<br>Ref: The lecture table lists Datalog as allowing any arity, with bounded arity needed for tractability.

</details>

<details>
<summary><strong>Q79.</strong> How can non-recursive Datalog be used as a query language over databases?</summary>

Use: 1. Treat ground facts as the extensional database. 2. Treat rules as definitions of derived relations. 3. For non-recursive programs, translate rule-defined queries to SQL. 4. Query the derived relation.<br>Ref: For non-recursive P, Datalog entailment can be matched by SQL query answers over GrFs(P).

</details>

<details>
<summary><strong>Q80.</strong> Why are recursive Datalog queries harder to translate to plain SQL?</summary>

Use: check whether a derived relation depends on itself. If yes, ordinary non-recursive SQL is not enough; recursive database mechanisms such as Common Table Expressions are needed.<br>Ref: Recursive Datalog relates to recursive SQL queries and CTEs.

</details>

<details>
<summary><strong>Q81.</strong> How is Datalog used behind the scenes in program analysis/repair?</summary>

Use: 1. Translate program properties and safety/analysis constraints into Datalog facts/rules/queries. 2. Run a Datalog engine. 3. Use inferred relations to report analysis or repair results.<br>Ref: The lecture lists static analysis, program verification, and repair as behind-the-scenes Datalog applications.

</details>

<details>
<summary><strong>Q82.</strong> What should you check first when asked whether a proposed Datalog rule is valid?</summary>

Use this fast checklist: 1. Is the head exactly one atom? 2. Are body items positive atoms? 3. Are all arguments terms? 4. Does every head variable occur in the body? 5. Are there no function terms, negation, or disjunction? <br>Ref: Plain Datalog rules are positive, single-head, safe rules over variables and constants.

</details>

<details>
<summary><strong>Q83.</strong> What should you check first when asked whether a ground atom is entailed?</summary>

Use this fast checklist: 1. Is the query ground? 2. Compute/approximate HM(P) by rule closure. 3. Check membership. 4. Do not search arbitrary interpretations directly.<br>Ref: For ground α, P ⊨ α iff α ∈ HM(P).

</details>
