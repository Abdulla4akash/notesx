---
subject: COMP64602
chapter: 37
title: "Week 7 — Flashcards"
language: en
---

# Week 7 — Flashcards

70 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> What should you skip as non-examinable in this sheet?</summary>

Use: do not prioritise standalone graph basics or Nash/dominant strategy definitions; use graph terms only where they support AFs or dispute trees.<br>Reference: the sheet explicitly marks graph basics and Nash equilibrium/dominant strategies as not examinable.

</details>

<details>
<summary><strong>Q2.</strong> In argumentation, what is the core evaluation question?</summary>

Use: ask which arguments survive attacks and should be accepted, not merely which formula is classically true.<br>In MAS, agents may have partial information, so arguments and attacks can be built through communication.<br>Reference: argumentation asks which argument wins / should be accepted after attacks.

</details>

<details>
<summary><strong>Q3.</strong> When do you model something as an argument?</summary>

Recognise: a claim is open to doubt and someone gives reasons to support or criticise it.<br>Use: identify the claim, the reasons, and whether the reasons support or attack a conclusion.<br>Reference: argument = giving reasons to support or criticise a claim that is questionable/open to doubt.

</details>

<details>
<summary><strong>Q4.</strong> Structured vs abstract argumentation — what is the discriminator?</summary>

Ask: do I care about internal premises, rules, and conclusions? If yes, use structured arguments.<br>If only defeat relations matter, use an abstract argumentation framework.<br>Reference: structured arguments keep Prem/Concl/Sub, strict/defeasible rules, attacks and preferences; abstract argumentation keeps AF=&lt;A,↝&gt;.

</details>

<details>
<summary><strong>Q5.</strong> How do you read an argumentation system tuple?</summary>

Use: parse the components in order: L = logical language; overline = contrariness; R_s = strict rules; R_d = defeasible rules; ≤ = preference over defeasible rules.<br>Reference: (L, overline(.), R_s, R_d, ≤).

</details>

<details>
<summary><strong>Q6.</strong> How do you use the contrariness function?</summary>

Use: to decide whether one formula conflicts with another.<br>For a conclusion χ and target formula φ, check whether χ ∈ overline(φ).<br>Reference: overline(.): L → 2^L; e.g. ¬φ ∈ overline(φ).

</details>

<details>
<summary><strong>Q7.</strong> Strict rule vs defeasible rule — what is the discriminator?</summary>

Ask: can the rule fail/be defeated?<br>Strict rule: always applies, written →, belongs to R_s.<br>Defeasible rule: generally applies but may fail, written ⇒, belongs to R_d.<br>Reference: R_s strict rules; R_d defeasible rules.

</details>

<details>
<summary><strong>Q8.</strong> Necessary vs contestable premise — what is the discriminator?</summary>

Ask: is φ ∈ K_n? If yes, it is necessary and not undermined.<br>If φ ∈ K∖K_n, it is contestable and may be undermined.<br>Reference: KB=(K,≤′), K_n necessary axioms, ≤′ partial order over K∖K_n.

</details>

<details>
<summary><strong>Q9.</strong> How do you build a base argument from a knowledge base?</summary>

Use: 1. Pick φ ∈ K. 2. Create argument A for φ. 3. Set Prem(A)={φ} and Concl(A)=φ.<br>Reference: if φ ∈ K then φ can be an argument; slide gives Sub(A)={φ}.

</details>

<details>
<summary><strong>Q10.</strong> How do you build an argument using a strict rule?</summary>

Use: 1. Find arguments A1...An. 2. Check their conclusions match a strict rule Concl(A1),...,Concl(An) → ψ in R_s. 3. Construct A = A1,...,An → ψ. 4. Inherit premises/subarguments from inputs.<br>Reference: Prem(A)=⋃Prem(A_i), Concl(A)=ψ, Sub(A)=⋃Sub(A_i)∪{A}.

</details>

<details>
<summary><strong>Q11.</strong> How do you build an argument using a defeasible rule?</summary>

Use: 1. Find arguments A1...An. 2. Check their conclusions match a defeasible rule Concl(A1),...,Concl(An) ⇒ ψ in R_d. 3. Construct A = A1,...,An ⇒ ψ. 4. Mark it defeasible because the top rule is ⇒.<br>Reference: derived arguments use Prem(A)=⋃Prem(A_i), Concl(A)=ψ, Sub(A)=⋃Sub(A_i)∪{A}.

</details>

<details>
<summary><strong>Q12.</strong> How do you determine an argument’s type from its top rule?</summary>

Discriminator: look at the last rule used, not only at its subarguments.<br>If the top rule is →, the constructed argument is strict. If the top rule is ⇒, it is defeasible.<br>Reference: single arrow = strict rule; double arrow = defeasible rule.

</details>

<details>
<summary><strong>Q13.</strong> How do you compute Prem(A), Concl(A), and Sub(A) for a derived argument?</summary>

Use: Prem(A) is the union of immediate subargument premises. Concl(A) is the new rule conclusion ψ. Sub(A) is all input subarguments plus A itself.<br>Reference: Prem(A)=Prem(A1)∪...∪Prem(An); Concl(A)=ψ; Sub(A)=Sub(A1)∪...∪Sub(An)∪{A}.

</details>

<details>
<summary><strong>Q14.</strong> When does one argument support another?</summary>

Use: check whether A is a subargument of B. If A ∈ Sub(B), A supports B.<br>Support may be direct or indirect through a chain of subarguments.<br>Reference: an argument supports another iff it is a subargument of that argument.

</details>

<details>
<summary><strong>Q15.</strong> How do you classify an attack: undercut, rebut, or undermine?</summary>

Discriminator question: what is being contradicted?<br>Defeasible rule application → undercut. Defeasible subargument conclusion → rebut. Contestable premise → undermine.<br>Reference: lecture gives three attack types: undercutting, rebutting, undermining.

</details>

<details>
<summary><strong>Q16.</strong> How do you test for undercutting?</summary>

Use: 1. Look inside B for a defeasible subargument B′ of form B1,...,Bn ⇒ ψ. 2. Check whether Concl(A) attacks the defeasible rule/application itself. 3. If yes, A undercuts B.<br>Reference: A undercuts B if ∃B′∈Sub(B) with defeasible form and Concl(A)∈overline(B′); sheet flags this notation as unclear because contrariness was introduced over formulas.

</details>

<details>
<summary><strong>Q17.</strong> How do you test for rebutting?</summary>

Use: 1. Look inside B for a defeasible subargument B′ ending in ψ. 2. Check whether Concl(A) contradicts ψ. 3. If yes, A rebuts B.<br>Reference: A rebuts B iff ∃B′∈Sub(B), B′ has form ...⇒ψ, and Concl(A)∈overline(ψ).

</details>

<details>
<summary><strong>Q18.</strong> How do you test for undermining?</summary>

Use: 1. Inspect Prem(B). 2. Ignore necessary premises in K_n. 3. For each contestable φ∈Prem(B)∖K_n, check Concl(A)∈overline(φ). 4. If yes, A undermines B.<br>Reference: undermining attacks a non-necessary premise.

</details>

<details>
<summary><strong>Q19.</strong> Attack vs defeat — what is the discriminator?</summary>

Ask: is the attacker strong enough under preferences?<br>Attack = conflict relation. Defeat = attack plus preference success.<br>Reference: A defeats B iff A attacks B and A is preferred to B according to ≤ and ≤′.

</details>

<details>
<summary><strong>Q20.</strong> How do attacks propagate through structured arguments?</summary>

Use: if A attacks a subargument B′ of B, then the attack matters for B because B depends on B′.<br>Trace Sub(B) upward through the construction chain.<br>Reference: attack examples target subarguments and thereby affect larger arguments containing them.

</details>

<details>
<summary><strong>Q21.</strong> How do you convert structured arguments into an abstract argumentation framework?</summary>

Use: 1. Make each argument a node. 2. Draw a directed edge α↝β when α defeats β. 3. Ignore internal premises/rules after edges are fixed.<br>Reference: AF=&lt;A,↝&gt;, where A is a finite set of arguments and ↝⊆A×A.

</details>

<details>
<summary><strong>Q22.</strong> How do you read the defeat relation in an AF?</summary>

Use: if (α,β)∈↝, draw α→β and say α defeats β.<br>Direction matters: attacker first, target second.<br>Reference: α↝β iff α defeats β.

</details>

<details>
<summary><strong>Q23.</strong> How do you compute S⁺?</summary>

Use: for every α∈S, collect every β such that α↝β. Union all those targets.<br>Reference: S⁺={β∈A | α↝β for some α∈S}.

</details>

<details>
<summary><strong>Q24.</strong> How do you compute α⁻?</summary>

Use: scan all arguments β∈A and collect those with β↝α.<br>Reference: α⁻={β∈A | β↝α}.

</details>

<details>
<summary><strong>Q25.</strong> S⁺ vs α⁻ — what is the discriminator?</summary>

Ask direction and input type.<br>S⁺ starts from a set S and moves outward to what S attacks. α⁻ starts from one argument α and moves backward to its attackers.<br>Reference: S⁺ = targets attacked by S; α⁻ = attackers of α.

</details>

<details>
<summary><strong>Q26.</strong> How do you check whether S is conflict-free?</summary>

Use: 1. Compute S⁺. 2. Check whether any attacked argument is also inside S. 3. If S∩S⁺=∅, conflict-free; otherwise not.<br>Reference: S is conflict-free iff S∩S⁺=∅.

</details>

<details>
<summary><strong>Q27.</strong> How do you test whether S defends α?</summary>

Use: 1. Compute α⁻, the attackers of α. 2. Compute S⁺, the arguments attacked by S. 3. Check α⁻⊆S⁺.<br>If every attacker of α is attacked by S, S defends α.<br>Reference: S defends α iff α⁻⊆S⁺.

</details>

<details>
<summary><strong>Q28.</strong> What happens if α has no attackers?</summary>

Use: α⁻=∅. Since ∅⊆S⁺ for every S, every set defends α, including ∅.<br>Reference: defence condition α⁻⊆S⁺ is vacuously true when α⁻=∅.

</details>

<details>
<summary><strong>Q29.</strong> How do you compute the characteristic function F(S)?</summary>

Use: 1. For each α∈A, test whether S defends α. 2. Collect exactly those defended α.<br>Reference: F:2^A→2^A, F(S)={α∈A | S defends α}.

</details>

<details>
<summary><strong>Q30.</strong> How do you check whether S is admissible?</summary>

Use: 1. Check S is conflict-free. 2. Compute F(S). 3. Check S⊆F(S), i.e. every member of S is defended by S.<br>Reference: admissible iff conflict-free and S⊆F(S).

</details>

<details>
<summary><strong>Q31.</strong> How do you check whether S is a complete extension?</summary>

Use: 1. Check S is conflict-free. 2. Compute F(S). 3. Check S=F(S).<br>S must contain all and only the arguments it defends.<br>Reference: complete iff conflict-free and S=F(S).

</details>

<details>
<summary><strong>Q32.</strong> Admissible vs complete — what is the discriminator?</summary>

Ask whether S includes all arguments it defends.<br>Admissible only needs S⊆F(S). Complete needs S=F(S).<br>Reference: complete = self-defending plus no defended arguments left out.

</details>

<details>
<summary><strong>Q33.</strong> How do you find the grounded extension?</summary>

Use: 1. Start with S0=∅. 2. Repeatedly compute S_{k+1}=F(S_k). 3. Stop when S_{k+1}=S_k. 4. The fixed point is grounded.<br>Reference: grounded extension is the minimal complete extension; it always exists.

</details>

<details>
<summary><strong>Q34.</strong> What appears in F(∅)?</summary>

Use: F(∅) contains arguments with no attackers, because they need no defence.<br>Arguments with attackers require ∅ to attack those attackers, which it cannot.<br>Reference: F(S)=arguments defended by S.

</details>

<details>
<summary><strong>Q35.</strong> How do you check whether S is a preferred extension?</summary>

Use: 1. Confirm S is complete. 2. Check there is no strictly larger complete extension T with S⊂T. If none, S is preferred.<br>Reference: preferred = maximal complete extension.

</details>

<details>
<summary><strong>Q36.</strong> Preferred extension: maximal or maximum?</summary>

Discriminator: maximal means cannot be extended while staying complete; it need not be uniquely largest.<br>Therefore multiple preferred extensions can exist.<br>Reference: preferred extensions are maximal complete extensions.

</details>

<details>
<summary><strong>Q37.</strong> How do you check whether S is stable?</summary>

Use: 1. Check S is conflict-free/acceptable under the extension context. 2. Compute S⁺. 3. Check every argument outside S is attacked by S: S⁺=A∖S.<br>Reference: stable iff S⁺=A∖S.

</details>

<details>
<summary><strong>Q38.</strong> How do you check whether S is semi-stable?</summary>

Use: 1. Confirm S is complete. 2. Compute its range S∪S⁺. 3. Compare with complete extensions. 4. S is semi-stable if no complete extension has a strictly larger range.<br>Reference: semi-stable iff S complete and S∪S⁺ maximal.

</details>

<details>
<summary><strong>Q39.</strong> Stable vs semi-stable — what is the discriminator?</summary>

Ask: does S attack every argument outside itself? Yes → stable.<br>If full outside coverage is impossible or not required, choose complete extensions with maximal S∪S⁺ → semi-stable.<br>Reference: stable S⁺=A∖S; semi-stable maximises S∪S⁺ among complete extensions.

</details>

<details>
<summary><strong>Q40.</strong> Grounded vs preferred — what is the discriminator?</summary>

Ask: conservative or maximal?<br>Grounded is the minimal complete extension found from ∅ by F-iteration. Preferred extensions are maximal complete extensions and may be multiple.<br>Reference: grounded=minimal complete; preferred=maximal complete.

</details>

<details>
<summary><strong>Q41.</strong> How do you decide skeptical acceptance?</summary>

Use: choose the relevant extension semantics, list extensions E1...En, then check whether α appears in every Ei.<br>Reference: α skeptically accepted iff α∈Ei for all i=1,...,n.

</details>

<details>
<summary><strong>Q42.</strong> How do you decide credulous acceptance?</summary>

Use: choose the relevant extension semantics, list extensions E1...En, then check whether α appears in at least one Ei.<br>Reference: α credulously accepted iff ∃i such that α∈Ei.

</details>

<details>
<summary><strong>Q43.</strong> How do you decide rejection?</summary>

Use: choose the relevant extension semantics, list extensions E1...En, then check whether α appears in none of them.<br>Reference: α rejected iff no extension Ei contains α.

</details>

<details>
<summary><strong>Q44.</strong> Skeptical vs credulous acceptance — what is the discriminator?</summary>

Ask how many extensions contain α.<br>All extensions → skeptical. At least one extension → credulous. No extension → rejected.<br>Reference: skeptical ∀i; credulous ∃i; rejection ¬∃i.

</details>

<details>
<summary><strong>Q45.</strong> How do you solve an extension-semantics exam question?</summary>

Use: 1. Write A and ↝. 2. Compute S⁺/α⁻ as needed. 3. Check conflict-free. 4. Check defence via α⁻⊆S⁺. 5. Compute F(S). 6. Apply the requested semantics: admissible, complete, grounded, preferred, stable, or semi-stable.<br>Reference: all semantics build from conflict-freeness, defence, and F.

</details>

<details>
<summary><strong>Q46.</strong> Why can stable extensions fail to exist?</summary>

Recognise: some cycles leave outside arguments not all attackable by any conflict-free/complete candidate.<br>Then no S satisfies S⁺=A∖S; use semi-stable if asked for the weaker coverage notion.<br>Reference: the lecture states stable extensions do not always exist; semi-stable weakens stable by maximising S∪S⁺.

</details>

<details>
<summary><strong>Q47.</strong> How do you treat an awkward attack cycle under admissibility?</summary>

Use: test each candidate’s defence. If including an argument requires defence by an argument it conflicts with, the candidate fails admissibility.<br>Reference: the semi-stable example notes that the cycle prevents those arguments from being in an admissible set.

</details>

<details>
<summary><strong>Q48.</strong> What is the role of argumentation in multi-agent systems?</summary>

Use: model agents with different information/objectives as proposing arguments, attacking each other, and incrementally building the AF.<br>Evaluation then selects acceptable arguments/actions.<br>Reference: no agent may initially know all arguments; the graph is built through communication.

</details>

<details>
<summary><strong>Q49.</strong> How is argumentation treated as a game?</summary>

Use: players take turns putting forward arguments, attacks, and defences; the evolving exchange is analysed as strategic interaction.<br>Reference: argument games use game-theory ideas of players, outcomes, utilities, strategies, and strategy profiles.

</details>

<details>
<summary><strong>Q50.</strong> What counts as a game in the lecture’s semi-formal sense?</summary>

Recognise: possible states/outcomes, players, and rules for whose turn it is and how actions change the state.<br>Reference: game consists of outcomes o0...on, players a1...am, and transition/action rules.

</details>

<details>
<summary><strong>Q51.</strong> How do you use a utility function?</summary>

Use: for agent ai and outcome oj, read ui(oj) as how good that outcome is for the agent; agents aim to maximise expected utility.<br>Reference: utility ui(oj).

</details>

<details>
<summary><strong>Q52.</strong> What is a strategy?</summary>

Use: treat it as a complete plan mapping each state/outcome to an action for the agent.<br>Reference: strategy s dictates how the agent should act in any state; s(oj) tells what to do in state oj.

</details>

<details>
<summary><strong>Q53.</strong> What is a strategy profile?</summary>

Use: list one strategy per agent: s=(s1,...,sm). To analyse agent i, write others’ strategies as s_-i and the profile as (si,s_-i).<br>Reference: s_-i=(s1,...,s_{i-1},s_{i+1},...,sm).

</details>

<details>
<summary><strong>Q54.</strong> How do you build a dispute tree from an argument graph?</summary>

Use: 1. Put PRO’s initial argument at the root. 2. Add OPP attacks as children. 3. Add PRO defences as children of those. 4. Continue along branches.<br>Cycles in the graph may unfold into infinite branches.<br>Reference: dispute tree T has a root argument; a dispute is a branch.

</details>

<details>
<summary><strong>Q55.</strong> Argument graph vs dispute tree — what is the discriminator?</summary>

Ask: am I representing static defeat relations or an unfolded dialogue?<br>Graph: nodes/edges and cycles. Dispute tree: branches of possible exchanges; graph cycles may become infinite branches.<br>Reference: lecture contrasts abstract graph cycles with dispute-tree branches.

</details>

<details>
<summary><strong>Q56.</strong> How do you recognise a winning strategy for PRO?</summary>

Use: find a subtree T′ showing PRO can answer every OPP attack and finish every branch with PRO.<br>Reference: winning strategy for root a is a subtree where PRO has the final say on all represented disputes.

</details>

<details>
<summary><strong>Q57.</strong> Winning strategy condition 1: what must hold for disputes?</summary>

Use: collect disputes D_T′. Check D_T′ is non-empty and finite; each dispute is finite; each dispute terminates with a PRO argument.<br>Reference: condition 1 = finite non-empty set of disputes ending with PRO.

</details>

<details>
<summary><strong>Q58.</strong> Winning strategy condition 2: how do you avoid fake wins?</summary>

Use: for every PRO move x in the strategy, include every possible OPP attack y on x as a represented extension/branch.<br>Otherwise PRO only wins because OPP failed to attack.<br>Reference: all possible attacks on PRO moves must be represented and answerable.

</details>

<details>
<summary><strong>Q59.</strong> Why is a winning subtree a strategy?</summary>

Use: it tells PRO which argument to play at each point; if PRO follows the subtree, OPP cannot defeat the root argument.<br>Reference: strategy = plan for what to do in each state; the dispute tree supplies that plan.

</details>

<details>
<summary><strong>Q60.</strong> What is a dialogue game?</summary>

Recognise: an argument game that specifies actual move types, content, logic, and allowed attacks, rather than only abstract argument nodes.<br>Reference: dialogue games instantiate abstract argument games with content and rules.

</details>

<details>
<summary><strong>Q61.</strong> How do you use the dialogue move claim φ?</summary>

Use: an agent may play claim φ only if φ is deducible from its knowledge base.<br>Reference: move claim φ can be stated if φ is deducible from the agent’s KB.

</details>

<details>
<summary><strong>Q62.</strong> How do you use the dialogue move why φ?</summary>

Use: play why φ against claim φ to challenge an unjustified claim. It asks for support and counts as an attack.<br>Reference: why φ attacks claim φ.

</details>

<details>
<summary><strong>Q63.</strong> How do you use the dialogue move φ since ψ?</summary>

Use: play φ since ψ to answer why φ by giving ψ as the reason. It may also attack a move asserting a complement/contradiction of φ.<br>Allowed when ψ⇒φ is in the agent’s knowledge base.<br>Reference: φ since ψ attacks why φ; overline φ denotes contradiction/complement.

</details>

<details>
<summary><strong>Q64.</strong> claim / why / since — what is the discriminator?</summary>

Ask the move’s function.<br>claim φ asserts φ. why φ challenges unsupported claim φ. φ since ψ justifies φ using ψ and attacks the why challenge.<br>Reference: dialogue moves in the sheet: claim φ, why φ, φ since ψ.

</details>

<details>
<summary><strong>Q65.</strong> How do complete extensions connect to evaluation semantics?</summary>

Use: first understand complete extensions, then specialise them: grounded=minimal complete, preferred=maximal complete, semi-stable=complete with maximal range.<br>Stable uses full outside attack coverage.<br>Reference: complete extensions bridge AFs to accepted arguments.

</details>

<details>
<summary><strong>Q66.</strong> How do you select an action from competing agent arguments?</summary>

Use: model each proposed action as supported by arguments; add attacks between incompatible proposals; evaluate the resulting AF/game to see which argument/action survives.<br>Reference: argumentation helps MAS decide what information/action to accept.

</details>

<details>
<summary><strong>Q67.</strong> What does it mean for abstract argumentation to ignore content?</summary>

Use: once you have nodes and defeat edges, do not inspect formulas, text, or rule derivations. Evaluate only graph structure.<br>Reference: abstraction strips away internal logical content and uses graph structure of defeat.

</details>

<details>
<summary><strong>Q68.</strong> How do you handle an extension candidate containing an attacker and its target?</summary>

Use: fail conflict-free immediately; do not test defence or completeness until conflict is removed.<br>Reference: conflict-free requires S∩S⁺=∅.

</details>

<details>
<summary><strong>Q69.</strong> How do you handle a candidate S that defends an argument outside S?</summary>

Use: if testing admissible, this is allowed. If testing complete, S fails unless it includes every argument it defends.<br>Reference: admissible S⊆F(S); complete S=F(S).

</details>

<details>
<summary><strong>Q70.</strong> How do you handle a candidate stable set that leaves one outside argument unattacked?</summary>

Use: fail stable because stability requires every argument outside S to be in S⁺. Then check semi-stable if asked.<br>Reference: stable iff S⁺=A∖S.

</details>
