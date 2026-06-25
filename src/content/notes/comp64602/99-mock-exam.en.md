---
subject: COMP64602
chapter: 98
title: "Mock Exam"
language: en
---

# COMP64602: Mock Written Exam — 22 Questions, 230 Marks

**Format:** Written / derivations | **Modeled on:** Exam flags in lecture slides | **Use:** Blank paper → answer → check vs solutions (at end)

---

## B1–B3: Knowledge Graphs, Fuzzy Reasoning & Embeddings (Ch 1–3)

### Q1 [10 marks] — RDF/RDFS/OWL Foundations

**(a)** Write the formal form of an RDF triple. Give a concrete example using entities from the lecture and draw it as a labeled graph edge. [3]

**(b)** RDFS extends RDF with schema-level information. Name the *four* RDFS constructs discussed in the lecture, and for *each* give a concrete triple example and explain what it *means* (not just the syntax). [4]

**(c)** Describe the *four* key limitations of RDFS as presented in the lecture. For each limitation, name the OWL feature that addresses it. [3]

---

### Q2 [8 marks] — Relational DB vs RDF Comparison

**(a)** Construct a 6-row comparison table between relational databases and RDF graph data. Include: Core Model, Schema, Relationships, Querying, Reasoning Support, Web Support. [6]

**(b)** In what scenario would you choose RDF graph data over a relational database? Give one concrete reason. [2]

---

### Q3 [10 marks] — OWL Axioms + KG Construction

**(a)** The OWL axiom `Cat ⊑ ∀hasParent.Cat` expresses: "The parents of any Cat are Cats." Explain the meaning of the universal restriction (∀) in this axiom. Then write the *different* OWL axiom that captures: "If something has a cat parent, it is a cat." [4]

**(b)** Humans have exactly two parents. Write this as an OWL axiom using the cardinality constructor. Why can RDFS *not* express this statement? [3]

**(c)** Name and briefly describe the four NLP tasks used in KG construction from natural language text, in the order the lecture presents them. [3]

---

### Q4 [12 marks] — T-norms & Graded Inference

**(a)** Define the three T-norms presented in the lecture. Write the formula for each. [3]

**(b)** Given the fuzzy RDF triples:
```
⟨Manchester, rdf:type, BigCity, 0.8⟩
⟨BigCity, rdfs:subClassOf, BicycleFriendlyCity, 0.5⟩
```
Compute the graded inference for `⟨Manchester, rdf:type, BicycleFriendlyCity⟩` using *all three* T-norms. Show your working for each. Explain which T-norm gives the *lowest* truth degree and why. [6]

**(c)** List the four properties of T-norms and T-conorms. For each, write the formal equation and explain what the property means in plain English. [3]

---

### Q5 [14 marks] — Fuzzy OWL Full Derivation

**(a)** Consider the fuzzy OWL car ontology:
```
TBox:
  Sedan ⊑ Car
  CheapCar ≡ Car ⊓ ∃HasPrice.CheapPrice
  ModerateCar ≡ Car ⊓ ∃HasPrice.ModeratePrice
  ⟨CheapPrice ⊑ ModeratePrice, 0.8⟩

ABox:
  ⟨a : Sedan ⊓ ∃HasPrice.CheapPrice, 0.9⟩
```
Show the step-by-step *crisp* inference that a : ModerateCar follows (ignoring truth degrees). Then compute the *graded* conclusion using both **minimum** and **product** T-norms. Explain which axioms contribute which truth degrees. [10]

**(b)** Why do non-classical (fuzzy) axioms have explicit truth degrees, while classical OWL axioms are treated as degree 1.0? [2]

**(c)** State the standard fuzzy negation formula. If `High(Peak District) = 0.65`, what is the truth degree of its negation? [2]

---

### Q6 [12 marks] — TransE Derivation

**(a)** Write the TransE score function f(h,r,t). What does a score of 0 mean? What does a large positive score mean? [2]

**(b)** Derive *why* TransE cannot properly represent symmetric relations. Start from the assumption that both triples ⟨A, r, B⟩ and ⟨B, r, A⟩ have perfect embeddings (score = 0). Show every algebraic step, and explain the final problem. [6]

**(c)** TransE also fails on 1-to-N relations. If entity A has children B and C via relation hasChild, derive why B and C must have identical embeddings under TransE. [2]

**(d)** What is the *key idea* of TransH that attempts to address these limitations? Describe it in one sentence. [2]

---

### Q7 [8 marks] — Association Rules & Apriori

**(a)** Define Support and Confidence for association rules. Given: the itemset {Milk, Bread} appears in 120 transactions, and {Milk, Bread, Butter} appears in 96 of those same transactions. Compute the confidence of the rule {Milk, Bread} ⇒ {Butter}. [4]

**(b)** Describe the Apriori algorithm in 5 steps. State the Apriori property and explain *why* pruning works. [4]

---

## B4–B6: Agents, Non-Monotonic Reasoning & Communication (Ch 4–6)

### Q8 [10 marks] — BDI Cycle

**(a)** Define an *Intelligent Agent* as presented in the lecture. What four key properties does an agent possess? [3]

**(b)** Draw and label the full BDI reasoning cycle. Include all five stages in order. For *each* stage, write one sentence explaining what happens and *why* it must occur at that point in the cycle. [7]

---

### Q9 [8 marks] — BDI: Desire vs Intention + Deontic Logic

**(a)** Explain the difference between a *Desire* and an *Intention* in the BDI architecture. Why does the agent need both concepts? [3]

**(b)** What is an *obligation* (O) in deontic logic? What is a *permission* (P)? State the relationship P A ≡ ¬O¬A and explain what it means. [3]

**(c)** Using the coursework submission example: what constitutes the obligation O, the permission P, and what event constitutes a violation (viol)? [2]

---

### Q10 [12 marks] — Nixon Diamond & Default Logic

**(a)** Define *monotonic* and *non-monotonic* reasoning. [2]

**(b)** Present the classic Bird/Penguin example. Show: (i) the initial knowledge base, (ii) the initial conclusion, (iii) the new knowledge that arrives, (iv) the revised conclusion. Explain *why* the reasoning is non-monotonic. [4]

**(c)** Write the general syntactic form of a default rule in Default Logic (A : J / C). Then write the *two* conflicting default rules that create the Nixon Diamond. Explain what *skeptical* semantics concludes and what *credulous* semantics concludes. [6]

---

### Q11 [8 marks] — Negation as Failure

**(a)** Explain Negation as Failure (NAF) / the Closed World Assumption. [2]

**(b)** Given the knowledge base:
```
KB = { checked(0,0), checked(1,0), checked(2,0), obstacle(1,0) }
Rule: checked(X,Y) ∧ ¬obstacle(X,Y) → clear(X,Y)
```
Using NAF, derive whether clear(0,0) and clear(2,0) hold. Show your reasoning for both. Explain *why* clear(1,0) does *not* hold. [6]

---

### Q12 [12 marks] — Commitment Operations

**(a)** Name *all six* commitment operations from the lecture. For each, state: (i) who initiates it (debtor or creditor), (ii) what changes as a result. [6]

**(b)** A debtor x creates a commitment C(x, y, r, u) to a creditor y. Explain the difference between CANCEL and RELEASE. Why does the lecture say that CANCEL should not always be allowed by a protocol? [3]

**(c)** DELEGATE(x, y, z, r, u) is performed by x. After delegation, who holds the new commitment? What happens to x's original commitment? [3]

---

### Q13 [10 marks] — Commitment Lifecycle + FIPA ACL

**(a)** Explain the commitment lifecycle: CREATE → detached → discharged. What does "detached" mean, and why is detachment the critical point in protocols? [4]

**(b)** What is a *FIPA ACL performative*? Name three examples and describe what each means in terms of the speaker's intent. [3]

**(c)** Briefly describe what a finite-state machine representation of a protocol captures, and give one advantage of specifying protocols this way. [3]

---

## B7–B9: Planning, Gwendolen & Verification (Ch 7–11)

### Q14 [10 marks] — Argumentation: Attacks & Extensions

**(a)** In the structured argumentation framework (Prakken), name and define the *three* types of attack. For each, give a concrete example showing which part of the attacked argument is targeted. [6]

**(b)** Define in Dung-style abstract argumentation: conflict-free set, admissible set, complete extension. How do these three concepts relate? [4]

---

### Q15 [8 marks] — Argumentation Extensions

**(a)** Name the four major extension types (grounded, preferred, stable, semi-stable). For each: state whether it is minimal or maximal, and whether it always exists. [4]

**(b)** A claim is *skeptically* accepted if ___. It is *credulously* accepted if ___. It is *rejected* if ___. Fill in the blanks. [2]

**(c)** What is the characteristic function F(S) in argumentation? What does its least fixed point correspond to? [2]

---

### Q16 [12 marks] — PDDL + Forward Search Trace

**(a)** Write a complete PDDL action schema for `stack` in the Blocks World domain. Include: parameters, preconditions, and effects. [4]

**(b)** Given the initial state:
```
ontable(A), ontable(B), clear(B), on(C,A), clear(C), handempty
```
Show two branches of forward search: one starting from pick-up(B) and one starting from unstack(C,A). For each, expand until the branch either reaches the goal (ontable(A), on(B,C), ontable(C)) or loops/backtracks. Explain *why* the pick-up(B) branch fails. [8]

---

### Q17 [10 marks] — Planning Heuristics + POCL

**(a)** Explain the difference between forward search and backward search. When would you prefer backward search? [3]

**(b)** What is an *admissible* heuristic in A*? Give one example for the Blocks World, and explain why it is admissible. [3]

**(c)** Describe the two types of flaws in a POCL plan. For each flaw type, state the repair strategy (or strategies) available. [4]

---

### Q18 [10 marks] — HTN + Multi-Agent POCL

**(a)** What is an HLA in Hierarchical Task Network planning? Draw a 2-level refinement tree showing how one HLA refines into two primitive actions. [3]

**(b)** In multi-agent POCL planning: (i) Under what condition are two steps redundant? (ii) Under what condition can two steps with different agents run in parallel? (iii) What does causal-link adjustment resolve? [4]

**(c)** Name the four approaches to multi-agent planning identified in the lecture, from fully centralised to fully decentralised. [3]

---

### Q19 [16 marks] — Gwendolen Reasoning Cycle + Rubble

**(a)** List the *six* stages (A-F) of the Gwendolen reasoning cycle in order. For *each* stage, describe in one sentence what happens and *why* it happens at that point. [12]

**(b)** Explain the difference between an *achieve goal* (+!g) and a *perform goal* (+!g [perform]) in Gwendolen. When does each type terminate? [2]

**(c)** What is the "extra move" bug in the rubble-search program? Why does the agent sometimes move to (5,5) even though rubble has already been found and lifted? [2]

---

### Q20 [12 marks] — Gwendolen Locking + Waiting

**(a)** Write a Gwendolen plan that triggers on `+!pickup(X)` with guard `{~B holding(_)}`. What does this guard prevent? [3]

**(b)** Explain the *mode-switch bug* that occurs when an agent has multiple intentions without locking. Describe a concrete scenario where it happens, and show how `lock` and `unlock` deeds fix it. [6]

**(c)** What is the purpose of the `*checked(X,Y)` wait deed in the waiting version of the rubble program? Why can't the agent simply continue without waiting? [3]

---

### Q21 [8 marks] — Verification: Logics + MIS

**(a)** What is the core idea of *model checking*? State it precisely: what is combined with what, and what is checked? [2]

**(b)** What do the CTL path quantifiers A and E mean? State the key rule about path quantifiers that distinguishes CTL from CTL*. [2]

**(c)** What does ATL add beyond CTL? Give an example of a property that ATL can express but CTL cannot. [2]

**(d)** In the MIS agent representation Pi = (St_i, d_i, o_i, Pi_i, pi_i), briefly describe what each component represents. [2]

---

### Q22 [8 marks] — MCAPL Verification

**(a)** In the MCAPL property specification language, define the meaning of: `B(ag, phi)`, `G(ag, phi)`, `A(ag, phi)`. [3]

**(b)** Interpret the property `B(ag1, obstacle) → ◯G(ag1, stop)` in plain English. What does the ◯ operator mean? [2]

**(c)** Describe the two typical agent properties flagged as verification targets: PlanningSucceeds and PlanExecutionSucceeds. What is the difference between them? [3]

---

# ANSWER SKETCHES

> These are sketches — in the real exam, write more, show every step, use formal notation, label diagrams.

### Q1 — RDF/RDFS/OWL

**(a)** τ = ⟨s, p, o⟩. Example: ⟨Manchester Baby, hasDeveloper, Tom Kilburn⟩. Draw: Manchester Baby --hasDeveloper→ Tom Kilburn.

**(b)** **rdf:type**: ⟨Tom Kilburn, rdf:type, Computer Scientist⟩ — instance of class. **rdfs:subClassOf**: ⟨Computer Scientist, rdfs:subClassOf, Scientist⟩ — every CS is a Scientist. **rdfs:range**: ⟨hasDeveloper, rdfs:range, People⟩ — objects of hasDeveloper are People. **rdfs:subPropertyOf**: ⟨hasTeammate, rdfs:subPropertyOf, hasColleague⟩ — every teammate is a colleague.

**(c)** (1) No complex domain-range constraints → OWL existential/universal restrictions. (2) No cardinality → OWL =, ≤, ≥ cardinalities. (3) No property characteristics → OWL property axioms. (4) No equivalence → OWL equivalentClass/equivalentProperty.

---

### Q2 — DB vs RDF

**(a)** 6-row table:
| Aspect | Relational DB | RDF Graph Data |
|--------|---------------|----------------|
| Core Model | Tables (rows/columns) | RDF triples |
| Schema | Fixed, predefined | Flexible, evolvable |
| Relationships | Foreign keys | Labeled graph edges |
| Querying | SQL | SPARQL + graph navigation |
| Reasoning | Datalog | RDFS/OWL/Horn rules/SWRL/SHACL |
| Web Support | Local/tabular datasets | URI/IRI-linked web-scale data |

**(b)** Choose RDF when data is heterogeneous, needs web-scale linking, or requires symbolic reasoning over the graph.

---

### Q3 — OWL Axioms

**(a)** ∀hasParent.Cat: for every hasParent relation, the object must be a Cat. Existential version: ∃hasParent.Cat ⊑ Cat.

**(b)** Human ⊑ (= 2 hasParent). RDFS can't express this — it lacks cardinality constructors.

**(c)** NER (identify entity mentions) → Entity Linking (map to KG entities) → Entity Typing (assign class) → Relation Extraction (extract relations).

---

### Q4 — T-norms

**(a)** Minimum: T(γ₁,γ₂)=min(γ₁,γ₂). Product: T(γ₁,γ₂)=γ₁×γ₂. Łukasiewicz: T(γ₁,γ₂)=max(0,γ₁+γ₂−1).

**(b)** Min: min(0.8,0.5)=0.5. Product: 0.8×0.5=0.40. Łukasiewicz: max(0,0.8+0.5−1)=max(0,0.3)=0.3. Łukasiewicz lowest (0.3) — requires both conditions jointly strong.

**(c)** Commutativity: T(a,b)=T(b,a). Associativity: T(a,T(b,c))=T(T(a,b),c). Monotonicity: if a≤a' and b≤b' then T(a,b)≤T(a',b'). Identity: T(γ,1)=γ, S(γ,0)=γ.

---

### Q5 — Fuzzy OWL

**(a) Crisp:** (1) a:Sedan + Sedan⊑Car → a:Car. (2) a:∃HasPrice.CheapPrice + CheapPrice⊑ModeratePrice → a:∃HasPrice.ModeratePrice. (3) a:Car + a:∃HasPrice.ModeratePrice → a:ModerateCar. **Graded:** Fuzzy axioms: 0.9 (ABox) and 0.8 (subClassOf). Min: min(0.9,0.8)=0.8. Product: 0.9×0.8=0.72.

**(b)** Classical axioms represent certain definitions. Fuzzy axioms capture vagueness (e.g., "cheap blends into moderate").

**(c)** N(γ)=1−γ. N(0.65)=0.35.

---

### Q6 — TransE

**(a)** f(h,r,t)=||h+r−t||₂. 0 means perfect embedding. Large means unlikely triple.

**(b)** ||A+r−B||=0 → A+r=B. ||B+r−A||=0 → B+r=A. Substitute: (A+r)+r=A → A+2r=A → 2r=0 → r=0. Problem: h+r=t becomes h=t. All entities collapse.

**(c)** ||A+r−B||=0, ||A+r−C||=0 → A+r=B, A+r=C → B=C. Tail entities must be identical.

**(d)** TransH projects entities onto relation-specific hyperplanes before translation.

---

### Q7 — Association Rules

**(a)** Support(X) = txns containing X. Confidence(X⇒Y)=Support(X∪Y)/Support(X). Confidence = 96/120 = 0.8.

**(b)** (1) Frequent 1-itemsets. (2) Generate k-candidates. (3) Prune with Apriori property. (4) Scan DB. (5) Repeat. Apriori property: if itemset frequent, all subsets frequent. Pruning works because anti-monotonicity of support.

---

### Q8 — BDI Cycle

**(a)** Agent perceives environment through sensors, acts through effectors. Properties: autonomy, reactivity, pro-activeness, social ability.

**(b)** Sensor Input → Belief Revision → (Beliefs+Intentions) → Generate Options → (Goals/Desires) → Deliberate/Filter → Intentions → Select → Act → (loop to Sensor). Each stage justified by the need to perceive, update, consider, prioritise, and execute before re-perceiving.

---

### Q9 — Desire vs Intention

**(a)** Desire: what agent would like (candidate). Intention: what agent is committed to (goal+plan). Both needed: desires are abundant, intentions scarce.

**(b)** O=obligation, P=permission. P A ≡ ¬O¬A: permitted to do A = not obliged NOT to do A.

**(c)** O: submit by deadline. P: submit early or on time. Violation: deadline passes, no submission.

---

### Q10 — Nixon Diamond

**(a)** Monotonic: new knowledge never removes conclusions. Non-monotonic: new knowledge can retract conclusions.

**(b)** KB={Birds fly, Pingu is bird} → Pingu flies. New: Pingu is penguin → Pingu cannot fly. Non-monotonic because original conclusion withdrawn.

**(c)** Default rule: A : J / C. Rule 1: Republican : ¬Pacifist / ¬Pacifist. Rule 2: Quaker : Pacifist / Pacifist. Skeptical: conclude nothing (only in ALL extensions). Credulous: accept either extension.

---

### Q11 — NAF

**(a)** If system cannot prove φ from KB, treats ¬φ as true.

**(b)** clear(0,0): checked(0,0) in KB, no obstacle(0,0) → ¬obstacle(0,0) by NAF → rule fires → clear(0,0). clear(2,0): same pattern → clear(2,0). clear(1,0): checked(1,0) in KB BUT obstacle(1,0) IS in KB → ¬obstacle(1,0) does NOT hold → rule fails.

---

### Q12 — Commitment Operations

**(a)** CREATE (debtor→C holds), CANCEL (debtor→removed), RELEASE (creditor→removed), DELEGATE (debtor→new debtor z), ASSIGN (creditor→new creditor z), DECLARE (observe→records).

**(b)** CANCEL = debtor unilaterally removes. RELEASE = creditor frees debtor. CANCEL shouldn't always be allowed — debtor could escape trivially.

**(c)** After DELEGATE: C(z,y,r,u) holds. x's original C(x,y,r,u) may still hold — z fulfilling u may discharge x's commitment.

---

### Q13 — Commitment Lifecycle

**(a)** CREATE → C(x,y,r,u) holds. Detached: r becomes true → C(x,y,⊤,u) — x actively obliged. Discharged: u holds → fulfilled. Detachment critical: point where debtor must act.

**(b)** FIPA ACL performative = speech act. INFORM (assert truth), REQUEST (ask to perform), PROPOSE (suggest action).

**(c)** FSM: protocol states + message/action transitions. Advantage: unambiguous legal sequences; verifiable for deadlocks.

---

### Q14–15 — Argumentation

**Q14(a):** Undercutting: attack defeasible rule. Rebutting: attack conclusion with opposite. Undermining: attack premise.

**Q14(b):** Conflict-free: no internal attacks. Admissible: conflict-free + all defended. Complete: S=F(S) (fixed-point). All complete are admissible.

**Q15(a):** Grounded = minimal complete (always exists). Preferred = maximal complete (always exists). Stable = S⁺=A\S (may not exist). Semi-stable = maximizes S∪S⁺ (always exists).

**Q15(b):** Skeptically accepted: in ALL extensions. Credulously: in AT LEAST ONE. Rejected: in NO extension.

**Q15(c):** F(S)={a | S defends a}. Least fixed point = grounded extension.

---

### Q16 — PDDL + Forward Search

**(a)** action stack(?x,?y): preconditions: holding(?x), clear(?y); effects: ¬holding(?x), ¬clear(?y), on(?x,?y), clear(?x), handempty.

**(b)** Branch pick-up(B): remove ontable(B), clear(B), handempty; add holding(B) → Result: ontable(A), holding(B), on(C,A), clear(C). Options: put-down(B) [loop], stack(B,C) [on(B,C), handempty, clear(B); removes holding(B), clear(C). Result: ontable(A), on(B,C), on(C,A), clear(B). Only option unstack(B,C) → reverses → backtrack]. Fails: can't get C on table (under A), and stacking B on C blocks C. Branch unstack(C,A): add holding(C), clear(A); remove clear(C), handempty, on(C,A). Result: all on table, holding(C). Options: put-down(C) [all on table → can build on(A,B), on(B,C)], stack(C,A) [loop], stack(C,B) [nearer goal].

---

### Q17–18 — Planning

**Q17(a):** Forward: from initial state forward. Backward: from goal regressing. Prefer backward when goal more constrained.

**Q17(b):** Admissible = never overestimates true cost. Ignore preconditions: counts only unsatisfied goals — ignoring constraints can only make estimate smaller.

**Q17(c):** Open precondition → add link or new step. Causal link threat → promote or demote.

**Q18(a):** HLA = High-Level Action refining into primitives. Navigate → MoveForward → TurnRight.

**Q18(b):** Redundant: another step achieves same effects. Parallel (#): no ordering + no conflicts. Causal-link adjustment: correct agent for needed condition.

**Q18(c):** (1) Centralised, (2) Centralised+decomposition, (3) Local+conflict resolution, (4) Local+communication.

---

### Q19–20 — Gwendolen

**Q19(a):** A:Select intention (one at a time). B:Find plans (match triggers+guards). C:Apply plan (load deeds). D:Execute deed (perform action). E:Perceive (update beliefs). F:Messages (from other agents).

**Q19(b):** Achieve: persists until believed; keeps retrying. Perform: executes once and drops.

**Q19(c):** Perception lag: main achieve-goal reconsidered before perceptual intentions processed. Holding goal appears unsatisfied → agent picks next square (5,5) incorrectly.

**Q20(a):** Plan: +!pickup(X) : {~B holding(_)} ← ... Guard prevents picking up when already holding something.

**Q20(b):** Mode-switch: two intentions (search, return) switch mid-execution. Lock search → complete sequence → unlock.

**Q20(c):** *checked(X,Y) suspends until checked believed. Without wait: achieve goal reconsidered before current square processed → extra move.

---

### Q21–22 — Verification

**Q21(a):** Combine system model with negation of property. Check if any path satisfies negation. If none: property holds. If found: counter-example.

**Q21(b):** A="for all paths". E="there exists a path". CTL rule: every temporal operator immediately preceded by path quantifier. CTL* relaxes this.

**Q21(c):** ATL adds coalition modalities ⟨⟨C⟩⟩φ ("C can ensure φ no matter what others do"). CTL can't express group ability.

**Q21(d):** St_i: local states. d_i: actions. o_i: observation function. Pi_i: atomic propositions. pi_i: valuation.

**Q22(a):** B(ag,phi)=agent believes phi. G(ag,phi)=agent has goal phi. A(ag,phi)=agent performs action phi.

**Q22(b):** "If ag1 believes obstacle, next state ag1 has goal to stop." ◯ = next state.

**Q22(c):** PlanningSucceeds: plan achieves goal. PlanExecutionSucceeds: plan executed correctly. Difference: plan quality vs execution fidelity.
