---
subject: COMP64401
chapter: 34
title: "Linear Temporal Logic — Flashcards"
language: en
---

# Linear Temporal Logic — Flashcards

94 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> Why use LTL instead of only propositional logic, description logics, or datalog?</summary>

Use it when truth can change over time.<br>Step 1: Ask whether the statement needs “next”, “eventually”, “always in the future”, or “until”.<br>Step 2: If yes, model a timeline of changing propositional valuations.<br><b>Reference:</b> LTL is a propositional temporal logic for infinite timelines and dynamic systems.

</details>

<details>
<summary><strong>Q2.</strong> What ontological commitments does plain LTL make about time?</summary>

Recognise plain LTL by these commitments: one line of time, discrete points, point-based evaluation, and future-only operators.<br>Use it when the system can be viewed as a single infinite sequence of moments.<br><b>Reference:</b> LTL time = linear + discrete + point-based + future-only.

</details>

<details>
<summary><strong>Q3.</strong> Discriminator: fluid vs rigid statement</summary>

Ask: can the truth value change from one time point to another?<br>If yes, treat it as fluid and suitable for temporal modelling.<br>If no, treat it as rigid background information.<br><b>Reference:</b> Fluid statements can change over time; rigid statements remain fixed while the relevant objects exist.

</details>

<details>
<summary><strong>Q4.</strong> How do you build an LTL formula from the core grammar?</summary>

Step 1: Start with any propositional variable p ∈ 𝒫.<br>Step 2: If φ and ψ are formulae, you may form ¬φ, φ ∨ ψ, Xφ, and φ U ψ.<br>Step 3: Treat ∧, ⊤, ⊥, E, and G as abbreviations unless expanded.<br><b>Reference:</b> The LTL formulae over 𝒫 are the smallest set closed under p, ¬, ∨, X, and U.

</details>

<details>
<summary><strong>Q5.</strong> How do you check whether an expression is a well-formed LTL formula?</summary>

Step 1: Check every atomic symbol is a propositional variable.<br>Step 2: Check ¬ and X each have exactly one formula argument.<br>Step 3: Check ∨ and U each combine exactly two formulae.<br>Step 4: Reject any bare operator or missing side of U.<br><b>Reference:</b> X is unary; U is binary; all operator arguments must themselves be LTL formulae.

</details>

<details>
<summary><strong>Q6.</strong> Why does every propositional formula count as an LTL formula?</summary>

Use the grammar test: propositional variables are LTL formulae, and Boolean combinations are preserved by the LTL grammar.<br>No temporal operator is required.<br><b>Reference:</b> LTL extends propositional logic syntactically and semantically.

</details>

<details>
<summary><strong>Q7.</strong> How do you evaluate an atomic proposition at time i?</summary>

Step 1: Look up the set V(i).<br>Step 2: Check whether p is an element of that set.<br><b>Reference:</b> V,i ⊨ p iff p ∈ V(i).

</details>

<details>
<summary><strong>Q8.</strong> How do you evaluate negation at time i?</summary>

Step 1: Evaluate φ at the same time point i.<br>Step 2: Flip the truth value.<br><b>Reference:</b> V,i ⊨ ¬φ iff not V,i ⊨ φ.

</details>

<details>
<summary><strong>Q9.</strong> How do you evaluate disjunction at time i?</summary>

Step 1: Evaluate φ at i.<br>Step 2: Evaluate ψ at i.<br>Step 3: Accept if at least one is true.<br><b>Reference:</b> V,i ⊨ φ ∨ ψ iff V,i ⊨ φ or V,i ⊨ ψ, or both.

</details>

<details>
<summary><strong>Q10.</strong> How do you evaluate Xφ at time i?</summary>

Step 1: Move exactly one time point forward from i to i+1.<br>Step 2: Evaluate φ there.<br><b>Reference:</b> V,i ⊨ Xφ iff V,i+1 ⊨ φ.

</details>

<details>
<summary><strong>Q11.</strong> How do you evaluate φ U ψ at time i?</summary>

Step 1: Find a witness time j ≥ i where ψ holds.<br>Step 2: Check every intermediate time ℓ with i ≤ ℓ &lt; j.<br>Step 3: Require φ at every such ℓ.<br>Step 4: If no such j exists, the until formula is false.<br><b>Reference:</b> V,i ⊨ φ U ψ iff ∃j ≥ i such that V,j ⊨ ψ and ∀ℓ(i ≤ ℓ &lt; j ⇒ V,ℓ ⊨ φ).

</details>

<details>
<summary><strong>Q12.</strong> Discriminator: does φ U ψ require φ to stop when ψ starts?</summary>

Ask: does the semantics mention φ at or after the chosen ψ-time?<br>No. It only constrains times before the witness j.<br><b>Reference:</b> φ U ψ requires ψ eventually and φ before ψ; φ may still hold when or after ψ holds.

</details>

<details>
<summary><strong>Q13.</strong> What is an LTL valuation and how do you use it?</summary>

Use it as the timeline you evaluate formulae against.<br>Step 1: Choose a time point i ∈ ℕ.<br>Step 2: Read V(i) as the set of propositions true at i.<br><b>Reference:</b> An LTL valuation is V:ℕ → 2^𝒫.

</details>

<details>
<summary><strong>Q14.</strong> What does V,i ⊨ φ mean?</summary>

Read it locally: in valuation V, at time/world i, formula φ holds.<br>To prove it, apply the semantic clauses recursively according to the main operator of φ.<br><b>Reference:</b> ⊨ is the LTL satisfaction relation between a valuation, a time point, and a formula.

</details>

<details>
<summary><strong>Q15.</strong> How do you expand ∧, ⊤, and ⊥ into the core LTL syntax?</summary>

Step 1: Replace φ ∧ ψ by ¬(¬φ ∨ ¬ψ).<br>Step 2: Replace ⊤ by p ∨ ¬p for some propositional variable p.<br>Step 3: Replace ⊥ by p ∧ ¬p.<br><b>Reference:</b> ∧, ⊤, and ⊥ are syntactic sugar, not primitive LTL syntax.

</details>

<details>
<summary><strong>Q16.</strong> How do you evaluate Eφ (“eventually φ”)?</summary>

Step 1: Search the current-or-future timeline from i onward.<br>Step 2: Accept iff φ holds at some j ≥ i.<br><b>Reference:</b> Eφ := ⊤ U φ, so V,i ⊨ Eφ iff ∃j ≥ i such that V,j ⊨ φ.

</details>

<details>
<summary><strong>Q17.</strong> How do you evaluate Gφ (“globally φ”)?</summary>

Step 1: Check φ at i.<br>Step 2: Check φ at every future time point after i.<br>Step 3: Remember this does not include the past.<br><b>Reference:</b> Gφ := ¬E¬φ, so φ holds everywhere on the future timeline from i onward.

</details>

<details>
<summary><strong>Q18.</strong> Shortcut: when does φ U ψ automatically hold now?</summary>

Discriminator question: does ψ already hold at the current time i?<br>If yes, choose j=i; there are no earlier intermediate times to check.<br><b>Reference:</b> If V,i ⊨ ψ, then V,i ⊨ φ U ψ for any φ.

</details>

<details>
<summary><strong>Q19.</strong> Why does Eφ mean “φ at some future-or-current point”?</summary>

Step 1: Expand Eφ to ⊤ U φ.<br>Step 2: In until, the right side must occur at some j ≥ i.<br>Step 3: Since ⊤ always holds before j, only the occurrence of φ matters.<br><b>Reference:</b> V,i ⊨ Eφ iff ∃j ≥ i with V,j ⊨ φ.

</details>

<details>
<summary><strong>Q20.</strong> Discriminator: do Eφ and Eψ imply E(φ ∧ ψ)?</summary>

Ask whether φ and ψ must occur at the same future time.<br>No. They may occur at different times and never overlap.<br><b>Reference:</b> Eφ ∧ Eψ does not generally entail E(φ ∧ ψ).

</details>

<details>
<summary><strong>Q21.</strong> How do you unfold an until formula for tableau-style reasoning?</summary>

Step 1: Check whether ψ holds now.<br>Step 2: If not, require φ now.<br>Step 3: Carry the same obligation φ U ψ to the next time point using X.<br><b>Reference:</b> φ U ψ ⇒ ψ ∨ (φ ∧ X(φ U ψ)).

</details>

<details>
<summary><strong>Q22.</strong> What is a transition system in LTL model checking?</summary>

Use it to describe allowed system behaviours.<br>It needs: a finite non-empty state set, a successor relation, a labelling function, and start states.<br><b>Reference:</b> 𝓜=(S,→,L,S₀), where →⊆S×S, L:S→2^𝒫, and S₀⊆S.

</details>

<details>
<summary><strong>Q23.</strong> How do you check whether a sequence is a trace of a transition system?</summary>

Step 1: Check the first state is in S₀.<br>Step 2: Check every listed state belongs to S.<br>Step 3: Check every adjacent pair follows the successor relation.<br>Step 4: The sequence must be infinite.<br><b>Reference:</b> A trace is σ=s₀,s₁,s₂,… with s₀∈S₀ and sᵢ→sᵢ₊₁ for all i.

</details>

<details>
<summary><strong>Q24.</strong> How do you get the LTL valuation generated by a trace?</summary>

Step 1: Take the trace σ=s₀,s₁,s₂,….<br>Step 2: At each time i, look at the label of state sᵢ.<br>Step 3: Set the valuation at i to that label.<br><b>Reference:</b> Vσ(i)=L(sᵢ).

</details>

<details>
<summary><strong>Q25.</strong> What does the trace-to-valuation abstraction forget?</summary>

Use the valuation only for propositions, not state identities.<br>If two different states have the same label, LTL sees them as identical at that time point.<br><b>Reference:</b> A valuation records which propositions are true over time; state names themselves disappear.

</details>

<details>
<summary><strong>Q26.</strong> How do you test satisfaction at a time point?</summary>

Step 1: Fix a valuation V and a specific time i.<br>Step 2: Evaluate φ using the satisfaction clauses at i.<br><b>Reference:</b> V satisfies φ at i iff V,i ⊨ φ.

</details>

<details>
<summary><strong>Q27.</strong> How do you test satisfaction by a valuation?</summary>

Step 1: Use the initial time point only.<br>Step 2: Check whether φ holds at time 0.<br><b>Reference:</b> V satisfies φ iff V,0 ⊨ φ.

</details>

<details>
<summary><strong>Q28.</strong> How do you test whether φ is satisfiable in a valuation V?</summary>

Step 1: Keep the valuation V fixed.<br>Step 2: Search for some time point i where φ holds.<br><b>Reference:</b> φ is satisfiable in V iff ∃i such that V,i ⊨ φ.

</details>

<details>
<summary><strong>Q29.</strong> How do you test whether φ is valid in a valuation V?</summary>

Step 1: Keep the valuation V fixed.<br>Step 2: Check every time point i in that valuation.<br>Step 3: Accept only if φ holds everywhere along V.<br><b>Reference:</b> φ is valid in V iff ∀i, V,i ⊨ φ.

</details>

<details>
<summary><strong>Q30.</strong> How do you test ordinary LTL satisfiability?</summary>

Step 1: Do not fix a particular valuation.<br>Step 2: Ask whether some valuation exists where φ holds at time 0.<br><b>Reference:</b> φ is satisfiable iff ∃V such that V,0 ⊨ φ.

</details>

<details>
<summary><strong>Q31.</strong> How do you test ordinary LTL validity?</summary>

Step 1: Quantify over every valuation V.<br>Step 2: Check φ at time 0 in each valuation.<br><b>Reference:</b> φ is valid iff ∀V, V,0 ⊨ φ.

</details>

<details>
<summary><strong>Q32.</strong> Discriminator: satisfaction at a time point vs satisfaction by a valuation</summary>

Ask: am I checking a chosen time i, or only the initial time 0?<br>Chosen i → satisfaction at a time point.<br>Only 0 → satisfaction by the valuation.<br><b>Reference:</b> V,i ⊨ φ vs V,0 ⊨ φ.

</details>

<details>
<summary><strong>Q33.</strong> Discriminator: satisfiable in V vs satisfiable</summary>

Ask: is V fixed?<br>Fixed V → look for some i inside that valuation.<br>Unfixed V → look for some valuation with truth at time 0.<br><b>Reference:</b> satisfiable in V = ∃i V,i ⊨ φ; satisfiable = ∃V V,0 ⊨ φ.

</details>

<details>
<summary><strong>Q34.</strong> Discriminator: valid in V vs valid</summary>

Ask: am I quantifying over time points in one valuation, or over all valuations?<br>One V, all i → valid in V.<br>All V, time 0 → valid.<br><b>Reference:</b> valid in V = ∀i V,i ⊨ φ; valid = ∀V V,0 ⊨ φ.

</details>

<details>
<summary><strong>Q35.</strong> How do you model-check an LTL formula on a transition system?</summary>

Step 1: Generate/consider every trace σ of 𝓜.<br>Step 2: Convert each trace into its valuation Vσ.<br>Step 3: Check φ at time 0 for every Vσ.<br>Step 4: Accept only if all traces pass.<br><b>Reference:</b> 𝓜 ⊨ φ iff for every trace σ of 𝓜, Vσ,0 ⊨ φ.

</details>

<details>
<summary><strong>Q36.</strong> Discriminator: universal vs existential model checking</summary>

Ask: must all traces satisfy φ, or is one good trace enough?<br>Course default: all traces.<br>Existential version: some trace satisfies φ, equivalently 𝓜 ⊭ ¬φ.<br><b>Reference:</b> Universal model checking checks 𝓜 ⊨ φ over every trace.

</details>

<details>
<summary><strong>Q37.</strong> How do you recognise a local property?</summary>

Look for a condition about the current state and the immediately next state, often using X.<br><b>Reference:</b> Local properties constrain what may happen between a state and its successor.

</details>

<details>
<summary><strong>Q38.</strong> How do you recognise a safety property?</summary>

Ask whether the property says that a bad situation never happens.<br>Typical shape: G(no-bad-condition).<br><b>Reference:</b> Safety properties express “bad things do not happen.”

</details>

<details>
<summary><strong>Q39.</strong> How do you recognise a liveness property?</summary>

Ask whether the property says that a desired event eventually happens.<br>Typical shape: G(trigger ⇒ E(response)).<br><b>Reference:</b> Liveness properties express “good things eventually happen.”

</details>

<details>
<summary><strong>Q40.</strong> How do you recognise a fairness property?</summary>

Ask whether repeated or pending opportunities must eventually be honoured.<br>Use the intuition: requests should not be postponed forever.<br><b>Reference:</b> Fairness properties are liveness-like constraints such as every request eventually receiving a reply.

</details>

<details>
<summary><strong>Q41.</strong> How do you recognise a precedence property, and why is it awkward in plain LTL?</summary>

Ask whether one event must have occurred before another.<br>Future-only LTL cannot directly look backwards, so such properties may need past operators or indirect encodings.<br><b>Reference:</b> Precedence properties say one event must occur before another.

</details>

<details>
<summary><strong>Q42.</strong> How do satisfiability and validity relate?</summary>

Use negation to switch the task.<br>Step 1: To test satisfiability of φ, test whether ¬φ is not valid.<br>Step 2: To test validity of φ, test whether ¬φ is not satisfiable.<br><b>Reference:</b> φ is satisfiable iff ¬φ is not valid.

</details>

<details>
<summary><strong>Q43.</strong> How do you reduce model checking to validity?</summary>

Step 1: Introduce a proposition p_s for each system state s.<br>Step 2: Build φ𝓜 describing the initial state, exactly-one-state condition, successor relation, and labelling.<br>Step 3: Check validity of φ𝓜 ⇒ ψ.<br><b>Reference:</b> 𝓜 ⊨ ψ iff φ𝓜 ⇒ ψ is valid.

</details>

<details>
<summary><strong>Q44.</strong> What does the initial-state part of φ𝓜 enforce?</summary>

Use it to force the encoded timeline to start correctly.<br>For a single start state s₀, require p_s₀ at time 0.<br><b>Reference:</b> Initial-state clause: p_s₀.

</details>

<details>
<summary><strong>Q45.</strong> What does the exactly-one-state part of φ𝓜 enforce?</summary>

Step 1: At every time point, require at least one state proposition p_s.<br>Step 2: Also require all other state propositions false when p_s is true.<br><b>Reference:</b> G(∨_{s∈S}(p_s ∧ ∧_{s'≠s} ¬p_s')).

</details>

<details>
<summary><strong>Q46.</strong> What does the successor-relation part of φ𝓜 enforce?</summary>

Step 1: For each current state s, look at its allowed successors.<br>Step 2: Require the next time point to be one of those successor states.<br><b>Reference:</b> G(∧_{s∈S}(p_s ⇒ X(∨_{s→s'}p_s'))).

</details>

<details>
<summary><strong>Q47.</strong> What does the labelling part of φ𝓜 enforce?</summary>

Step 1: If the encoded current state is s, include every proposition in L(s).<br>Step 2: Exclude every proposition not in L(s).<br><b>Reference:</b> G(∧_{s∈S}(p_s ⇒ (∧_{p∈L(s)}p ∧ ∧_{p∉L(s)}¬p))).

</details>

<details>
<summary><strong>Q48.</strong> How do you reduce validity to model checking?</summary>

Step 1: Let the state set be every subset of the formula’s propositions: S=2^𝒫ψ.<br>Step 2: Allow every state to transition to every state.<br>Step 3: Label each state by itself: L(s)=s.<br>Step 4: Model-check ψ on this universal transition system.<br><b>Reference:</b> ψ is valid iff 𝓜ψ ⊨ ψ.

</details>

<details>
<summary><strong>Q49.</strong> What complexity facts from the lecture matter for LTL reasoning?</summary>

Use this as context, not a memorisation trap.<br>Model checking is linear in the number of transition-system states and exponential in formula size.<br>Satisfiability, validity, and model checking are PSPACE-complete in worst case.<br><b>Reference:</b> The lecture flags PSPACE details as context rather than detailed exam content.

</details>

<details>
<summary><strong>Q50.</strong> How is the LTL tableau idea related to propositional tableau?</summary>

Step 1: Keep the propositional idea of decomposing formula sets by cases.<br>Step 2: Add temporal machinery for next-time movement and eventualities.<br>Step 3: Do not assume negation normal form is used.<br><b>Reference:</b> LTL tableau generalises propositional tableau but must handle infinite timelines.

</details>

<details>
<summary><strong>Q51.</strong> How do you recognise an alpha formula?</summary>

Ask whether satisfying the whole formula forces all listed components to hold together.<br>If yes, treat it like a conjunction during expansion.<br><b>Reference:</b> Alpha formulae have conjunctive behaviour: the formula is present iff all its components are present.

</details>

<details>
<summary><strong>Q52.</strong> How do you apply the alpha rule when computing types?</summary>

Step 1: Find an alpha formula in the set.<br>Step 2: Add all of its components to the same set.<br>Step 3: Repeat until no alpha formula is undecomposed.<br><b>Reference:</b> Alpha expansion generalises the propositional ∧-rule.

</details>

<details>
<summary><strong>Q53.</strong> How do you recognise a beta formula?</summary>

Ask whether satisfying the whole formula requires at least one of several components.<br>If yes, treat it like a disjunction during expansion.<br><b>Reference:</b> Beta formulae have disjunctive behaviour: the formula is present iff at least one component is present.

</details>

<details>
<summary><strong>Q54.</strong> How do you apply the beta rule when computing types?</summary>

Step 1: Find a beta formula whose components are not yet represented.<br>Step 2: Branch into one copy per component choice.<br>Step 3: Continue expansion separately on each branch.<br><b>Reference:</b> Beta expansion generalises the propositional ∨-rule.

</details>

<details>
<summary><strong>Q55.</strong> What is the key beta decomposition for until?</summary>

Use the unfolding choice.<br>Branch 1: ψ holds now.<br>Branch 2: φ holds now and X(φ U ψ) carries the obligation forward.<br><b>Reference:</b> φ U ψ has beta components ψ and φ ∧ X(φ U ψ).

</details>

<details>
<summary><strong>Q56.</strong> What is an eventuality in LTL tableau?</summary>

Recognise it as an until obligation that cannot be postponed forever.<br>When checking a future path, ensure the right-hand side eventually appears.<br><b>Reference:</b> Eventualities are formulae of the form φ U ψ.

</details>

<details>
<summary><strong>Q57.</strong> What counts as a literal?</summary>

Use this as the atomic stopping point for local propositional information.<br>A literal is either an atomic proposition or its negation.<br><b>Reference:</b> Literals are p and ¬p.

</details>

<details>
<summary><strong>Q58.</strong> How should you use the alpha/beta table in an exam task?</summary>

Step 1: Do not try to derive every table entry from memory.<br>Step 2: If given the table, classify each formula by its row.<br>Step 3: Apply alpha as “add all”; beta as “branch”.<br><b>Reference:</b> The lecture says the full alpha/beta list need not be memorised, but the behaviour must be understood.

</details>

<details>
<summary><strong>Q59.</strong> How do you construct the closure cl(φ) operationally?</summary>

Step 1: Include ⊤ and φ.<br>Step 2: Include all subformulae of φ.<br>Step 3: Add relevant single negations without generating infinite double-negation chains.<br>Step 4: Add components of alpha and beta formulae.<br><b>Reference:</b> cl(φ) is the smallest finite set containing the formulae needed to reason about φ.

</details>

<details>
<summary><strong>Q60.</strong> Why is closure finite and small enough for tableau reasoning?</summary>

Use the size argument: closure only adds subformulae, single negations, and finitely many components.<br>It does not keep adding arbitrary new formulae.<br><b>Reference:</b> cl(φ) is finite and linear in the length of φ.

</details>

<details>
<summary><strong>Q61.</strong> What is a φ-type?</summary>

Recognise it as a possible local snapshot of what can hold at one time point.<br>It must respect alpha formulae, beta formulae, and avoid clashes.<br><b>Reference:</b> Γ⊆cl(φ) is a φ-type iff alpha formulae are present exactly with all components, beta formulae exactly with at least one component, and Γ is clash-free.

</details>

<details>
<summary><strong>Q62.</strong> How do you check whether Γ is a type?</summary>

Step 1: Confirm Γ⊆cl(φ).<br>Step 2: For each alpha formula, check formula present iff all components present.<br>Step 3: For each beta formula, check formula present iff at least one component present.<br>Step 4: Reject if both χ and ¬χ occur.<br><b>Reference:</b> Types are maximal locally consistent closure subsets.

</details>

<details>
<summary><strong>Q63.</strong> Why do real worlds induce types?</summary>

Step 1: Take every closure formula true at a real time point i.<br>Step 2: Semantic truth automatically respects alpha/beta decompositions.<br>Step 3: A real time point cannot satisfy both χ and ¬χ.<br><b>Reference:</b> If V,i ⊨ ψ, then {φ∈cl(ψ) | V,i ⊨ φ} is a type.

</details>

<details>
<summary><strong>Q64.</strong> Why are X-formulae not decomposed inside the current type?</summary>

Discriminator question: does the operator constrain now or the next time point?<br>Xψ constrains i+1, so ψ is not automatically added to the current local type.<br><b>Reference:</b> Xψ is neither alpha nor beta and has no local components.

</details>

<details>
<summary><strong>Q65.</strong> What are cl(M) and ts(M)?</summary>

Use cl(M) to collect all formulae relevant to a set M.<br>Use ts(M) to list type completions that contain M.<br><b>Reference:</b> cl(M)=⋃_{φ∈M}cl(φ); ts(M)={t⊆cl(M) | t is a type and M⊆t}.

</details>

<details>
<summary><strong>Q66.</strong> How do you compute the types of a set M?</summary>

Step 1: Start with M.<br>Step 2: Exhaustively apply alpha expansion.<br>Step 3: Exhaustively apply beta branching.<br>Step 4: Drop every branch with a clash.<br>Step 5: The surviving type-completions are ts(M).<br><b>Reference:</b> Types are generated by alpha/beta closure plus clash elimination.

</details>

<details>
<summary><strong>Q67.</strong> How do you initialise the pre-tableau for ψ?</summary>

Step 1: Create two initial nodes eψ and e⊤.<br>Step 2: Label them L(eψ)={ψ} and L(e⊤)={⊤}.<br>Step 3: Start with no ∨-edges and no X-edges.<br><b>Reference:</b> The pre-tableau is an edge-labelled graph with local ∨-edges and temporal X-edges.

</details>

<details>
<summary><strong>Q68.</strong> How do you apply the pre-tableau ∨-rule?</summary>

Step 1: Pick a node e whose label is not a type and has no ∨-successor.<br>Step 2: Compute ts(L(e)).<br>Step 3: For each type t, create or reuse a node labelled t.<br>Step 4: Add a ∨-edge from e to that type node.<br><b>Reference:</b> The ∨-rule explores all local type completions.

</details>

<details>
<summary><strong>Q69.</strong> How do you apply the pre-tableau X-rule?</summary>

Step 1: Pick a type node e with no X-successor.<br>Step 2: Compute X_e={φ | Xφ∈L(e)}.<br>Step 3: If X_e is empty, add an X-edge to e⊤.<br>Step 4: Otherwise create or reuse a node labelled X_e and add an X-edge to it.<br><b>Reference:</b> The X-rule moves next-time obligations into the next node label.

</details>

<details>
<summary><strong>Q70.</strong> What does the completed pre-tableau guarantee?</summary>

Use it as a candidate graph, not yet a model.<br>Every ∨-edge goes from a label to a type extension, and every type node has an X-successor.<br><b>Reference:</b> If (e,e′) is a ∨-edge, L(e)⊆L(e′); each type node has an X-successor.

</details>

<details>
<summary><strong>Q71.</strong> Why is the pre-tableau not yet enough to prove satisfiability?</summary>

Check two remaining failure modes.<br>Failure 1: a non-type label may have no type completion.<br>Failure 2: an eventuality may be postponed forever on a cycle.<br><b>Reference:</b> The elimination algorithm is needed after pre-tableau construction.

</details>

<details>
<summary><strong>Q72.</strong> What is the elimination algorithm trying to remove?</summary>

Step 1: Start with the completed pre-tableau.<br>Step 2: Repeatedly remove nodes that cannot represent a point on an infinite satisfying timeline.<br>Step 3: Stop at a fixed point.<br><b>Reference:</b> Elimination removes non-types, bad-next nodes, and bad-future nodes.

</details>

<details>
<summary><strong>Q73.</strong> How do you apply the non-type elimination rule?</summary>

Step 1: Find a node e whose label is not a type.<br>Step 2: For each incoming X-edge e₁→e and outgoing ∨-edge e→e₂, add a direct X-edge e₁→e₂.<br>Step 3: Remove e and its incident edges.<br><b>Reference:</b> Non-type nodes are intermediate local-expansion nodes, not actual time points.

</details>

<details>
<summary><strong>Q74.</strong> How do you apply the bad-next elimination rule?</summary>

Step 1: Find a node with no outgoing X-edge.<br>Step 2: Remove it.<br>Reason: every LTL time point must have a next time point.<br><b>Reference:</b> A node without an X-successor cannot lie on an infinite timeline.

</details>

<details>
<summary><strong>Q75.</strong> How do you apply the bad-future elimination rule?</summary>

Step 1: For each node e, inspect every eventuality φ U ψ in L(e).<br>Step 2: Look for an eventually cyclic X-path from e.<br>Step 3: Require some node on that path to contain ψ for each eventuality.<br>Step 4: Remove e if no such lasso exists.<br><b>Reference:</b> Bad-future nodes postpone an until obligation forever.

</details>

<details>
<summary><strong>Q76.</strong> What is a lasso in the tableau algorithm?</summary>

Recognise it as a finite representation of an infinite path.<br>Step 1: Follow a finite X-path stem.<br>Step 2: Eventually enter a cycle.<br>Step 3: Use the repeated cycle as the infinite future.<br><b>Reference:</b> A lasso is an eventually cyclic X-path.

</details>

<details>
<summary><strong>Q77.</strong> When does a lasso satisfy the eventualities of a node?</summary>

Step 1: List all φ U ψ in the starting node’s label.<br>Step 2: For each one, check whether ψ appears at some node on the lasso.<br>Step 3: Accept only if every eventuality is fulfilled.<br><b>Reference:</b> A lasso satisfies φ U ψ when the right-hand side ψ occurs somewhere along it.

</details>

<details>
<summary><strong>Q78.</strong> What correctness properties should surviving tableau nodes have?</summary>

Check these invariants: labels are types; each node has an X-successor; Xφ in a node forces φ in each X-successor; each until eventuality is eventually fulfilled along an X-path.<br><b>Reference:</b> Surviving nodes match the local and future semantics of LTL.

</details>

<details>
<summary><strong>Q79.</strong> How do you use the final tableau to decide satisfiability of ψ?</summary>

Step 1: Build the pre-tableau for ψ.<br>Step 2: Apply elimination to a fixed point.<br>Step 3: Check whether any surviving node label contains ψ.<br><b>Reference:</b> ψ is satisfiable iff after elimination there is a node e with ψ∈L(e).

</details>

<details>
<summary><strong>Q80.</strong> Why do the pre-tableau and elimination algorithms terminate?</summary>

Step 1: Closure is finite.<br>Step 2: Node labels are unique subsets of closure.<br>Step 3: There are only exponentially many such subsets.<br>Step 4: Construction adds finitely many nodes; elimination removes finitely many nodes.<br><b>Reference:</b> Both algorithms terminate and can be carried out in exponential time.

</details>

<details>
<summary><strong>Q81.</strong> What is the space/optimality caveat for the presented tableau?</summary>

Use it as a conceptually clear algorithm, not the best possible implementation.<br>The presented tableau may use exponential space, while other LTL satisfiability algorithms can use polynomial space.<br><b>Reference:</b> LTL satisfiability is PSPACE-complete; this tableau presentation is not space-optimal.

</details>

<details>
<summary><strong>Q82.</strong> Limitation discriminator: why can’t plain LTL express branching futures?</summary>

Ask whether the formula must distinguish “some possible future” from “all possible futures”.<br>Plain LTL has only one linear future, so it cannot make that distinction directly.<br><b>Reference:</b> LTL is linear-time, not branching-time.

</details>

<details>
<summary><strong>Q83.</strong> Limitation discriminator: why can’t plain LTL express structured objects and relations?</summary>

Ask whether the statement needs individuals, objects, or user-defined relations.<br>Plain LTL worlds are propositional, so internal relational structure is absent.<br><b>Reference:</b> Each LTL world is just a set of true propositional variables.

</details>

<details>
<summary><strong>Q84.</strong> Limitation discriminator: why can’t plain LTL talk directly about the past?</summary>

Ask whether the property needs “previously”, “yesterday”, or “since”.<br>Plain LTL only has future operators, so past reference is not primitive.<br><b>Reference:</b> Plain LTL is future-only.

</details>

<details>
<summary><strong>Q85.</strong> Limitation discriminator: why can’t plain LTL express real-time deadlines?</summary>

Ask whether the property needs measured durations such as seconds or minutes.<br>Plain LTL has abstract equal-spaced time points, not clocks.<br><b>Reference:</b> LTL has no clock variables or quantitative timing constraints.

</details>

<details>
<summary><strong>Q86.</strong> Limitation discriminator: why can’t plain LTL express probabilistic claims?</summary>

Ask whether the statement needs likelihood, probability thresholds, or weighted transitions.<br>Plain LTL is Boolean and transition systems have possible/impossible transitions only.<br><b>Reference:</b> Plain LTL has no probability operators.

</details>

<details>
<summary><strong>Q87.</strong> Which LTL extension matches which missing feature?</summary>

Branching futures → CTL or CTL*.<br>Structured worlds → combine temporal logic with first-order or description logic.<br>Past reference → add past modalities.<br>Real-time constraints → timed temporal logics.<br>Probability thresholds → probabilistic temporal logics.<br><b>Reference:</b> Extensions add features that plain LTL deliberately lacks.

</details>

<details>
<summary><strong>Q88.</strong> How is LTL related to propositional logic?</summary>

Use propositional logic as the local logic inside each time point.<br>An LTL formula with no temporal operators is just propositional.<br><b>Reference:</b> LTL extends propositional logic by evaluating propositions along an infinite timeline.

</details>

<details>
<summary><strong>Q89.</strong> Discriminator: LTL vs description logics/datalog</summary>

Ask: does the formalism natively provide time, or structured individuals/relations?<br>LTL gives time and temporal operators but only propositional worlds.<br>DL/datalog give structured relations but no built-in infinite timeline.<br><b>Reference:</b> LTL is orthogonal to description logics and datalog.

</details>

<details>
<summary><strong>Q90.</strong> Why is model checking central in LTL but not in the same way for earlier static logics?</summary>

Step 1: Represent a dynamic system as a transition system.<br>Step 2: Represent desired behaviour as an LTL formula.<br>Step 3: Check whether every generated run satisfies the formula.<br><b>Reference:</b> LTL adds model checking as a central reasoning task for dynamic systems.

</details>

<details>
<summary><strong>Q91.</strong> How should you prioritise this lecture for exam revision?</summary>

Highest priority: exact X and U semantics; the six reasoning tasks; universal model checking; traces-to-valuations; until unfolding; tableau bad-future rule.<br>Lower priority: memorising the full alpha/beta table, Kripke-structure terminology, and PSPACE proof details.<br><b>Reference:</b> These are the lecture’s explicit exam/high-value flags.

</details>

<details>
<summary><strong>Q92.</strong> What is the safest general method for any LTL semantic question?</summary>

Step 1: Identify the main connective/operator of the formula.<br>Step 2: Apply its semantic clause.<br>Step 3: For X, move one step; for U, find a witness j and check all earlier ℓ.<br>Step 4: For E/G, expand to U/¬ first if unsure.<br><b>Reference:</b> LTL semantics are defined inductively over formula structure.

</details>

<details>
<summary><strong>Q93.</strong> What is the safest general method for any transition-system LTL question?</summary>

Step 1: Identify the relevant traces allowed by the successor relation.<br>Step 2: Convert traces to valuations using labels.<br>Step 3: Evaluate the formula at time 0 for each required trace.<br>Step 4: For model checking, all traces must pass.<br><b>Reference:</b> Transition systems generate traces; traces generate valuations; model checking quantifies over traces.

</details>

<details>
<summary><strong>Q94.</strong> What is the safest general method for tableau satisfiability?</summary>

Step 1: Build the closure of the target formula.<br>Step 2: Build local type completions using alpha/beta expansion.<br>Step 3: Build the pre-tableau with ∨-edges and X-edges.<br>Step 4: Eliminate non-types, bad-next nodes, and bad-future nodes.<br>Step 5: Check whether the target formula survives in some node label.<br><b>Reference:</b> Tableau satisfiability is decided by survival after elimination.

</details>
