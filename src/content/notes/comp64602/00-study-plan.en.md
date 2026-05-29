---
subject: COMP64602
chapter: 0
title: "Study Plan"
language: en
---

# COMP64602: Advanced KRR — 3-Day Exam Sprint Study Plan

**Exam:** June 1 | **Hours:** ~26 productive | **Sleeps:** 3 | **Format:** Written / derivations

---

## 1. THE FOREST — Index Map (Read First)

**~201 items across 9 branches.** Know where every concept lives. The exam tests relationships, not isolated facts.

### B1: Knowledge Graphs & Semantic Web (Ch 1–2, pp. 1–79) — HEAVY (37 items)

- RDF triples & graph model
- RDFS: classes, subClassOf, domain/range, subPropertyOf
- RDFS limitations (cardinality, properties, equivalence)
- OWL: Description Logic constructs, restrictions
- Relational DB vs RDF comparison (6 dimensions)
- KG construction: NLP pipeline (NER→EL→ET→RE), table matching
- Rule mining: support, confidence, Apriori, AMIE, PCA confidence

### B2: Uncertain Reasoning & Fuzzy Extensions (Ch 1, pp. 19–44) — HEAVY (25 items)

- Probabilistic: Bayesian & Markov Networks
- Fuzzy logic: membership functions, truth in [0,1]
- T-norms (min, product, Lukasiewicz) + T-conorms (max, prob-sum, Lukasiewicz)
- 4 properties: commutativity, associativity, monotonicity, identity
- Fuzzy RDF/RDFS: truth-degree annotations, graded inference
- Fuzzy OWL: TBox/ABox with degrees, car ontology derivation

### B3: Semantic & KG Embeddings (Ch 3, pp. 80–124) — HEAVY (28 items)

- Word2Vec: CBOW, Skip-gram
- TransE: score function, training, limitations (symmetry, 1-to-N)
- TransH/TransR: relation-specific projections
- Box2EL: 7 normal forms, subsumption loss
- 3 paradigms: end-to-end, sequence learning, graph propagation
- OWL2Vec* pipeline

### B4: Agent Foundations: BDI, Norms & Non-Monotonic (Ch 4–5, pp. 125–218) — HEAVY (35 items)

- Agent definition, BDI (Belief, Desire, Intention, Plan)
- BDI reasoning cycle (sensor→revise→options→filter→act)
- Deontic logic: O, P, viol
- Monotonic vs non-monotonic reasoning
- Default logic: Nixon Diamond, skeptical vs credulous
- Circumscription, Negation as Failure / CWA

### B5: Agent Communication & Commitments (Ch 6, pp. 219–255) — MEDIUM (22 items)

- FIPA ACL performatives, protocols (FSMs, sequence diagrams)
- 6 commitment operations: CREATE, CANCEL, RELEASE, DELEGATE, ASSIGN, DECLARE
- Commitment lifecycle: create→detach→discharge

### B6: Argumentation Theory (Ch 7, pp. 256–302) — MEDIUM (24 items)

- Structured arguments (Prakken): 3 attack types
- Abstract argumentation (Dung): extensions (grounded, preferred, stable, semi-stable)
- Acceptance: skeptical, credulous, rejection

### B7: Classical & Multi-Agent Planning (Ch 8–9, pp. 303–392) — HEAVY (30 items)

- PDDL, Blocks World, forward/backward search
- Heuristics (ignore preconditions, A*), HTN planning
- POCL: partial order, causal links, flaw repair
- Multi-agent POCL: agent assignments, redundancy

### B8: BDI Programming with Gwendolen (Ch 10, pp. 393–459) — HEAVY (28 items)

- Gwendolen reasoning cycle (Stages A–F)
- Achieve vs perform goals, plan triggers & guards
- Rubble-search trace, locking/unlocking, mode-switch bug

### B9: Verification & Temporal Logics (Ch 11, pp. 460–491) — MEDIUM (22 items)

- LTL, CTL/CTL*, ATL/ATL*
- Model checking, MIS representation
- MCAPL property symbols: B, G, A, I, ID, P, D

### NOT EXAMINABLE

- LTL semantics, CTL* semantics, Full MIS complexity
- Coordination by Plan Modification (Ch 9)
- FOL background (Ch 4), Graph prerequisites (Ch 7)

---

## 2. CLASSIFICATION — Chunk Types & Risk

**Strategy:** Fact→blank recall | List→mnemonic | Process→step-why chain

**Risk:** 24 HIGH | 22 Medium | 5 Low

| ID | Chunk | Type | Branch | Risk |
|----|-------|------|--------|------|
| 1.1 | RDF triple definition & graph model | fact | B1 | HIGH |
| 1.2 | RDFS vocabulary (4 constructs) | fact | B1 | HIGH |
| 1.3 | RDFS limitations (4 categories) | list | B1 | HIGH |
| 1.4 | OWL DL constructors (5 types) | list | B1 | HIGH |
| 1.5 | Relational DB vs RDF (6 dims) | list | B1 | medium |
| 1.6 | KG construction: NLP pipeline | process | B1 | HIGH |
| 1.7 | Table-to-KG matching (4 tasks) | process | B1 | medium |
| 1.8 | Apriori algorithm | process | B1 | medium |
| 1.9 | AMIE: PCA confidence, OWA | fact | B1 | medium |
| 2.1 | 3 fuzzy logic AND/OR/NOT | list | B2 | HIGH |
| 2.2 | 3 T-norm formulas | list | B2 | HIGH |
| 2.3 | 3 T-conorm formulas | list | B2 | HIGH |
| 2.4 | 4 T-norm/conorm properties | list | B2 | HIGH |
| 2.5 | Fuzzy RDF/RDFS graded inference | process | B2 | HIGH |
| 2.6 | Fuzzy OWL car ontology derivation | process | B2 | HIGH |
| 3.1 | Word2Vec: CBOW vs Skip-gram | fact | B3 | low |
| 3.2 | TransE: score, training, limits | process | B3 | HIGH |
| 3.3 | TransE symmetry derivation | process | B3 | HIGH |
| 3.4 | TransH/TransR projection idea | fact | B3 | medium |
| 3.5 | Box2EL: 7 normal forms | list | B3 | medium |
| 3.6 | 3 embedding paradigms | list | B3 | low |
| 4.1 | BDI concepts (B,D,I,P) | fact | B4 | HIGH |
| 4.2 | BDI reasoning cycle (5 stages) | process | B4 | HIGH |
| 4.3 | Deontic logic: O,P,viol | process | B4 | medium |
| 4.4 | Default logic: Nixon Diamond | process | B4 | HIGH |
| 4.5 | Circumscription: abnormal preds | process | B4 | medium |
| 4.6 | NAF/CWA checked-obstacle-clear | process | B4 | medium |
| 5.1 | FIPA ACL performatives | list | B5 | low |
| 5.2 | 6 commitment operations | list | B5 | HIGH |
| 5.3 | Commitment lifecycle | process | B5 | HIGH |
| 6.1 | 3 attack types (arg) | list | B6 | HIGH |
| 6.2 | 6 argumentation extensions | list | B6 | HIGH |
| 6.3 | Characteristic function F(S) | process | B6 | medium |
| 6.4 | Dialogue game PRO vs OPP | process | B6 | medium |
| 7.1 | PDDL: domain/problem files | fact | B7 | HIGH |
| 7.2 | Blocks World: 4 action schemas | list | B7 | HIGH |
| 7.3 | Forward search + backtracking | process | B7 | HIGH |
| 7.4 | Backward search: goal regression | process | B7 | HIGH |
| 7.5 | Planning heuristics (A*, ignore) | fact | B7 | medium |
| 7.6 | HTN: HLAs, refinement | process | B7 | medium |
| 7.7 | POCL algorithm + flaw repair | process | B7 | HIGH |
| 7.8 | Multi-agent POCL: redundancy | process | B7 | medium |
| 8.1 | Gwendolen cycle A-F | process | B8 | HIGH |
| 8.2 | Achieve vs perform goals | fact | B8 | HIGH |
| 8.3 | Plan triggers & guards | fact | B8 | HIGH |
| 8.4 | Rubble-search full trace | process | B8 | HIGH |
| 8.5 | Locking: mode-switch bug fix | process | B8 | medium |
| 9.1 | LTL operators (NOT EXAMINABLE) | fact | B9 | medium |
| 9.2 | CTL: A/E, CTL vs CTL* | fact | B9 | HIGH |
| 9.3 | Model checking: model+¬prop | fact | B9 | HIGH |
| 9.4 | MIS agent representation | fact | B9 | medium |
| 9.5 | ATL/ATL*: coalitions | fact | B9 | medium |
| 9.6 | MCAPL symbols: B,G,A,I,ID,P,D | list | B9 | HIGH |

---

## 3. HOOKS — Step → Why Chains

> Don't memorize steps — memorize *why each step follows from the previous*. Draw from blank paper.

### B1: Apriori Algorithm
**Tag-skeleton:** 1-itemsets → k-candidates → prune → scan → repeat → rules  
1. Find frequent 1-itemsets → Why: seed candidates
2. Generate k-candidates from (k-1)-frequents → Why: Apriori property
3. Prune candidates with infrequent subsets → Why: anti-monotonicity
4. Scan DB to count support → Why: discover actual frequencies
5. Repeat until no new itemsets → Why: finite max size
6. Generate rules → Why: partitions X→Y testable for confidence

### B1: KG Construction NLP Pipeline
**NER**: identify entities in text → **EL**: link to KG entities → **ET**: assign class/type → **RE**: extract relations

### B2: Fuzzy Graded Inference
**Tag-skeleton:** Input degrees → implicit 1.0s → identify conjunctions → pick T-norm → compute → attach  
**Key:** T_min=min(a,b) | T_prod=a×b | T_luk=max(0,a+b−1)  
**Properties:** Commutativity, Associativity, Monotonicity, Identity (T(γ,1)=γ, S(γ,0)=γ)

### B3: TransE Symmetry Failure
**Tag-skeleton:** Perfect embed → both dirs → A+r=B → B+r=A → sub → A+2r=A → 2r=0 → r=0 → collapse  
||A+r−B||=0 → A+r=B. ||B+r−A||=0 → B+r=A. Sub: (A+r)+r=A → A+2r=A → 2r=0 → r=0. Problem: h+r=t becomes h=t. All entities collapse.

### B4: BDI Reasoning Cycle
**Tag-skeleton:** Sense → Revise → Options → Filter → Act → Loop

### B5: Commitments (CRADDC mnemonic)
"Cats Run After Dogs During Chaos"  
CREATE(debtor) | RELEASE(creditor) | ASSIGN(creditor→new z) | DELEGATE(debtor→new z) | DECLARE(observe) | CANCEL(debtor)

### B7: Forward Search
**Tag-skeleton:** Initial → applicable? → apply → goal? → recurse → backtrack loops

### B7: POCL Flaw Repair
**Tag-skeleton:** Flaw? → Open prec? → add link OR new step | Threat? → promote OR demote

### B8: Gwendolen Cycle A–F
**Tag-skeleton:** A:Select → B:Find plans → C:Apply → D:Execute → E:Perceive → F:Messages

---

## 4. RETRIEVAL DRILLS — 53 Prompts

> Close this doc. Blank paper. Answer WITHOUT looking. Check vs PDF. Re-drill misses after 30 min.

**B1 (8):** RDF triple form + example · 4 RDFS constructs with meaning · 4 RDFS limits + OWL fixes · Cat OWL axioms · DB vs RDF table · NER→EL→ET→RE · Support/Confidence compute · Apriori 5-step  

**B2 (6):** μ_A(x) definition · 3 T-norm compute (0.8,0.4) · 3 T-conorm compute · 4 properties with equations · Manchester graded inference · Car ontology full derivation  

**B3 (6):** TransE score function · Symmetry derivation from ||h+r-t||=0 · 1-to-N derivation · TransH/TransR key idea · 3 paradigms · OWL2Vec* pipeline  

**B4 (7):** Agent definition + 4 properties · BDI cycle diagram labelled · Desire vs Intention · O,P,viol with coursework · Nixon Diamond (both semantics) · Monotonic vs non-monotonic (Bird/Penguin) · 3 truth maintenance  

**B5 (4):** 6 commitment ops with initiator · CREATE→detach→discharge lifecycle · DELEGATE vs ASSIGN · FIPA ACL performatives  

**B6 (5):** 3 attack types with examples · Structured vs abstract args · Conflict-free/admissible/complete · 4 extensions (min/max, existence) · Skeptical/credulous/rejected  

**B7 (7):** PDDL pick-up schema · Forward search 2 branches · Forward vs backward search · A* + admissible heuristic · HLA refinement tree · POCL 3-step plan with threat · Redundant steps + parallelism  

**B8 (5):** 6-stage Gwendolen cycle · Achieve vs perform goal · Guard {~B holding(_)} · Rubble extra-move bug · Locking mode-switch fix  

**B9 (5):** Model checking core idea · CTL A/E + CTL* rule · ATL vs CTL (coalitions) · MIS St_i,d_i,o_i,Pi_i,pi_i · B(ag1,obstacle)→G(ag1,stop)

---

## 5. HOUR-BY-HOUR SCHEDULE

### Thu May 29 (TONIGHT)
| Time | Task |
|------|------|
| 22:00–23:30 | Forest: map all 9 branches in handwriting |
| 23:30 | **SLEEP** |

### Fri May 30 (B1–B6)
| Time | Task |
|------|------|
| 07:00–08:00 | Wake + brief forest review |
| 08:00–09:45 | BLOCK 1: B1 (Knowledge Graphs) |
| 09:45–10:00 | Break |
| 10:00–11:45 | BLOCK 2: B2 (Fuzzy Reasoning — master car ontology) |
| 11:45–12:00 | Break |
| 12:00–13:15 | BLOCK 3: B3 (Embeddings — TransE derivation) |
| 13:15–14:15 | Lunch |
| 14:15–16:00 | BLOCK 4: B4 (BDI + Nixon Diamond) |
| 16:00–16:15 | Break |
| 16:15–18:00 | BLOCK 5: B5+B6 (Commitments + Argumentation) |
| 18:00–19:00 | Dinner |
| 19:00–20:30 | CONSOLIDATION: Re-drill B1-B6 misses |
| 20:30–21:00 | Light tag-skeleton review |
| 22:00 | **SLEEP** |

### Sat May 31 (B7–B9 + full consolidation)
| Time | Task |
|------|------|
| 07:00–08:00 | Wake + flash-recall B1-B6 skeletons |
| 08:00–09:45 | BLOCK 6: B7 (Planning — forward/backward + POCL) |
| 09:45–10:00 | Break |
| 10:00–11:45 | BLOCK 7: B8 (Gwendolen — cycle + rubble trace) |
| 11:45–12:00 | Break |
| 12:00–13:30 | BLOCK 8: B9 (Verification — CTL + model checking) |
| 13:30–14:30 | Lunch |
| 14:30–17:00 | CONSOLIDATION: Full retrieval ALL 9 branches |
| 17:00–17:15 | Break |
| 17:15–19:00 | PRACTICE: Timed derivations from blank |
| 19:00–20:00 | Dinner |
| 20:00–21:30 | FINAL: High-risk items only, top-5 shaky areas |
| 21:30–22:00 | Pack bag, light review |
| 22:00 | **SLEEP** (most important) |

### Sun Jun 1 (Exam Day)
| Time | Task |
|------|------|
| 07:00–07:30 | Wake, breakfast, hydrate |
| 07:30–08:00 | REACTIVATION ONLY: Read tag-skeletons aloud. Nothing new. |
| 08:00–08:15 | Travel |
| 09:00 | **EXAM** |

---

## 6. WHAT TO CUT

### Tier 1: Master (~22h)
| Branch | Budget | Why |
|--------|--------|-----|
| B1 (KG) | 6h | Foundational |
| B2 (Fuzzy) | 3h | Core derivations |
| B3 (Embeddings) | 3h | TransE = exam-perfect derivation |
| B4 (BDI + Non-mono) | 3h | BDI cycle + Nixon Diamond = guaranteed |
| B7 (Planning) | 4h | Algorithm-heavy, high value |
| B8 (Gwendolen) | 3h | Traceable answers |

### Tier 2: Accept Gaps (~4h)
| Branch | Budget | Why |
|--------|--------|-----|
| B5 (Commitments) | 1.5h | CRADDC mnemonic enough |
| B6 (Argumentation) | 1.5h | Definitions only, skip proofs |
| B9 (Verification) | 1h | CTL vs LTL concept only |

### Skip (NOT EXAMINABLE or minimal)
- LTL semantics, CTL* semantics
- Full MIS complexity
- Coordination by Plan Modification (Ch 9)
- FOL background, Graph prerequisites
- Markov Logic Networks detail
- Game theory proofs, POMDPs

### Exam Strategy
1. **DERIVE:** every step — partial credit lives in intermediate reasoning
2. **COMPARE:** use tables — headers win points
3. **DEFINE:** formal definition FIRST, then example
4. **PROCESS:** number steps, show WHY each follows
5. **STUCK:** write what you KNOW — derivation exams reward partial understanding
