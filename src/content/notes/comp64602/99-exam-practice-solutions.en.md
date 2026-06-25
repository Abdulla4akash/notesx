---
subject: COMP64602
chapter: 99
title: "Exam Practice — Worked Solutions"
language: en
---

# COMP64602 Practice Exam — Worked Solutions (Final, key-verified)

> Answers below are aligned to the **graded answer key** from the Canvas quiz (the marked-correct results), which overrides earlier derivations. Two answers were corrected against the key after grading: **Q6** (hierarchical contrastive loss only) and **Q12** (A1 is credulously accepted; "all rejected" is wrong). Q9, Q10, Q11, Q14 follow the unit's slide definitions.
>
> Topics: knowledge graphs & embeddings (TransE, OnT), Markov Logic Networks, ontology learning, interaction protocols & commitments, institutions, argumentation, circumscription, planning (heuristics, backward search, POCL), Gwendolen/BDI, LTL.

---

## Question 1 — Common approaches to constructing knowledge graphs

**Answer: all four.**

- ✅ Information extraction from natural-language documents
- ✅ Crowdsourcing by domain experts and volunteers
- ✅ KG integration with entity alignment and fusion
- ✅ Rule-based transformation from structured data

These are the four standard KG-construction pathways: text IE, human curation, merging existing graphs (entity resolution + fusion), and mapping structured/relational sources via rules. No distractor among them.

---

## Question 2 — Statements about Markov Logic Networks (MLN)

**Answer: statements 1, 2, and 3.**

- ✅ (1) MLN provides a template for instantiating Markov networks in which **nodes** correspond to predicate instantiations. In the ground network, each ground atom is a binary random-variable node.
- ✅ (2) MLN provides a template in which **features** correspond to formulas with their associated weights. Each grounded formula is a feature carrying the formula's weight.
- ✅ (3) Learning an MLN includes learning **both structure and weights**.
- ❌ (4) "Many very efficient algorithms made MLN widely applied" — too strong; MLN inference and learning are computationally demanding (#P-hard in general), and the literature explicitly discusses the need for more efficient algorithms.

---

## Question 3 — Horn rules "out of interest" for KG rule learning

**Answer: all four.**

- ✅ `hasUncle(x,y1) ∧ hasCousine(y1,y2) ∧ hasFriend(y2,y3) ∧ hasColleague(y1,z) ⇒ knows(x,z)` — body length 4 exceeds the usual small maximum, and `y3` appears only once → not **closed**.
- ✅ `visited(x,y) ⇒ dieIn(x,y)` with head coverage 0.001 — coverage far too low; statistically insignificant.
- ✅ `bornIn(x,y) ⇒ dieIn(x,w)` — `w` (and `y`) occur only once; the head variable `w` is unbound → not closed / not safe.
- ✅ `marriedTo(x,y) ⇒ ∃z : hasChild(x,z)` — existential in the head; not a standard closed/range-restricted Horn–Datalog rule used by miners like AMIE. (**Confirmed correct in the graded key.**)

Interesting rules are short, connected, closed, and sufficiently supported; all four here fail one of those.

---

## Question 4 — Relations TransE cannot model

**Answer: 1-to-n, n-to-1, and m-to-n.** (Do **not** select 1-to-1.) — *confirmed by the graded key.*

TransE scores triples by `h + r ≈ t`. For fixed `(h, r)`, this forces a single `t`:

- **1-to-1** ✅ representable.
- **1-to-n** ❌ — many valid tails would collapse to the same point `h + r`.
- **n-to-1** ❌ — symmetric problem on the head side.
- **m-to-n** ❌ — worst case.

This is the classic motivation for TransH/TransR/TransD.

---

## Question 5 — Negative samples never generated for `<Alan_Turing, LivedIn, Manchester>`

**Answer: `<Alan_Turing, WorksFor, Manchester>` and `<Ada_Lovelace, LivedIn, Liverpool>`.** — *confirmed by the graded key.*

Original TransE corrupts **either the head or the tail (exactly one), keeping the relation fixed**:

- `<Ada_Lovelace, LivedIn, Manchester>` — head corrupted ✓ can appear.
- `<Alan_Turing, LivedIn, Liverpool>` — tail corrupted ✓ can appear.
- `<Alan_Turing, WorksFor, Manchester>` — **relation changed** → ❌ never generated.
- `<Ada_Lovelace, LivedIn, Liverpool>` — **both entities changed** → ❌ never generated.

---

## Question 6 — OnT (ISWC'25) losses composing the hierarchy loss

**Answer (corrected against the graded key): Hierarchical contrastive loss ONLY.**

- ❌ Translation loss (maps one concept to another via a relation's mapping vector) — a relation/role loss, not part of the concept-hierarchy loss.
- ✅ **Hierarchical contrastive loss** — encourages embeddings of related concepts to be closer to each other than to negatives. **This is the only marked-correct option.**
- ❌ Centripetal loss "parents closer to the origin than children in hyperbolic space" — marked **incorrect** in the key.
- ❌ Centripetal loss "related concepts closer than negatives" — marked incorrect (selected-and-wrong).

> Correction note: earlier reasoning (and several AI solvers) treated the hyperbolic-origin centripetal statement as a second correct component. The **graded key marks only the hierarchical contrastive loss as correct** for composing OnT's hierarchy loss, so that is the answer. Trust the key over the derivation here.

---

## Question 7 — Institution: corresponding institutional trace

**Answer: `∅ --paid'(john, peter)--> ∅`.** — *1/1 in the graded key.*

Environmental trace:
```
∅ --deliver(peter,book,john)--> {has(book,john)} --paid(john,peter)--> {has(book,john), has(money,peter)}
```
- `deliver(peter, book, john)`: the generation rule `ordered(X,book,Y) ∈ s ⇒ G(s, deliver(Y,book,X)) → order_fulfilled(Y,X)` only fires when an `ordered` fact is present. There is **no `ordered` fact** in the institutional state, so `deliver` generates **no** institutional event; state stays `∅`.
- `paid(john, peter)`: `G(s, paid(X,Y)) → paid'(X,Y)` fires unconditionally → institutional event `paid'(john, peter)`.

Then `C(s, paid'(X,Y)) → s \ {O(pay(X,Y))}` removes an obligation that isn't there, so the state stays `∅`. Institutional trace: `∅ --paid'(john,peter)--> ∅`.

---

## Question 8 — `in(greybox, bottle)`: belief or goal?

**Answer: A belief.**

The agent has already performed the action (placed the bottle), so `in(greybox, bottle)` describes the perceived current world → a belief. Before the action it could have been a goal; afterwards it is believed, not desired.

---

## Question 9 — Circumscription over the PhD knowledge base

**Answer: `KB ⊨ ¬has_phd(helena)` and `KB ⊭ ¬has_phd(jim)`.**

Rule: `phd_student(X) ∧ ¬switching_field(X) ∧ ¬very_wealthy(X) → ¬has_phd(X)`. Circumscribing `switching_field` and `very_wealthy` minimises them: minimal `switching_field = {jim}`, minimal `very_wealthy = {}`.

- **helena:** `phd_student(helena)` ✓; not switching (minimised) ✓; not wealthy ✓ → rule fires → `¬has_phd(helena)`. ✅ entailed.
- **jim:** `switching_field(jim)` is true → `¬switching_field(jim)` false → antecedent fails → rule says nothing → cannot derive `¬has_phd(jim)`. ✅ `KB ⊭ ¬has_phd(jim)`.

(The conclusion is `¬has_phd` exactly as written; no missing-negation reinterpretation is needed.)

---

## Question 10 — Commitments at each stage of the enactment

**Enactment:** 1. sign-up · 2. set · 3. mitcircs(…tired…) · 4. reject · 5. hand-in · 6. mark.

**Answer: Option C —**
- `C(louise, joe, submit(coursework2), mark(coursework2))` holds **only at stages 2, 3, 4**;
- `C(joe, louise, T, submit(coursework2))` holds **only at stages 2, 3, 4**;
- `C(louise, joe, T, respond(tired, coursework2))` holds **only at stage 3**;
- `C(louise, joe, T, mark(coursework2))` holds **only at stage 5**.

Lifecycle:
- **Stage 2 `set`** creates `C(louise, joe, submit, mark)` and (joe signed-up) `C(joe, louise, T, submit)`.
- **Stage 3 `mitcircs`** creates `C(louise, joe, T, respond(tired, cw2))`.
- **Stage 4 `reject`** declares `respond(tired, cw2)` → discharges the respond-commitment (held only at stage 3); submit/mark commitments remain.
- **Stage 5 `hand-in`** declares `submit(cw2)` → detaches the conditional, producing base-level `C(louise, joe, T, mark(cw2))`; submit-commitments terminate (so they spanned 2–4).
- **Stage 6 `mark`** discharges the mark-commitment.

Gives the 2,3,4 / 2,3,4 / 3 / 5 pattern.

---

## Question 11 — Which A1/A2/A3 make the enactment NOT correct & complete

**Enactment:** 1. sign-up · 2. set · 3. mitcircs(…stressed…) · 4. A1 · 5. A2 · 6. A3.

**Answer: A1 = `accept(...)`, A2 = `hand-in(...)`, A3 = empty.**

Acceptance resolves the mit-circ and releases joe from the submission obligation. Joe then hands in anyway, which activates louise's conditional commitment to mark. Because A3 is empty, that marking commitment is never discharged → the enactment ends with a live commitment → **not complete**.

By contrast: accept→hand-in→marked is complete; accept→nothing→nothing is complete (joe was released); reject→submit→marked is complete under the intended signatures.

---

## Question 12 — Complete extensions of the argumentation framework

**Answer (corrected against the graded key): "No argument is skeptically accepted" AND "A1 is credulously accepted".**

Graded key:
- ✅ **No argument is skeptically accepted** (correct).
- ✅ **A1 is credulously accepted** (a correct option — marked "missed" because it should have been selected).
- ❌ A2 is credulously accepted (incorrect).
- ❌ All arguments are rejected (incorrect).
- ❌ None of these (incorrect).

**What this implies:** since **A1 is credulously accepted**, there exists a **non-empty complete extension containing A1**. So the framework does **not** collapse to the single empty extension — there is at least one non-trivial complete extension (with A1 in it) and at least one other (so no argument is in *every* extension → none skeptically accepted). "All arguments are rejected" is therefore false (A1 is accepted in some extension), regardless of how "rejected" is defined.

> Correction note: an earlier derivation concluded the only complete extension was ∅ and then debated whether "rejected" meant *undecided* (labelling) or *in-no-extension* (the unit's slide definition). The **graded key settles it differently**: A1 *is* credulously accepted, so the ∅-only premise was wrong, and "all rejected" is simply false. Final answer = **(b) + the A1 option**. Trust the key.

---

## Question 13 — Heuristic value for the initial state

**Answer: 3.**

Using the **ignore-preconditions heuristic** (the unit's heuristic). Initial: `ontable(A), ontable(B), on(C,B), clear(A), clear(C), handempty`. Goal: `ontable(C), on(B,C), on(A,B), clear(A), handempty`.

Goal facts already true: `clear(A)`, `handempty`. Missing: `ontable(C)`, `on(B,C)`, `on(A,B)` — each established by one relaxed action (`put-down(C)`, `stack(B,C)`, `stack(A,B)`) → **3 relaxed actions → h = 3**.

(For reference, h⁺/relaxed-plan length would be 6 and h_add 8, but the unit's ignore-preconditions heuristic gives 3.)

---

## Question 14 — Assertion/Reason on backward search

**Answer: Assertion false, Reason true (option 4).**

The unit's notes (§ Cost and efficiency) state: *"In theory, backward search should be as computationally expensive as forward search. In practice, backward search is often more efficient because the final state of the world is often more constrained than the initial state."*

- **Reason** — "the goal state is often more constrained than the initial state" — **true** by the lecture's own framing (this is its stated motivation for backward search; "more constrained" is meant operationally, narrowing the relevant actions).
- **Assertion** — "backward search is *the most* computationally efficient way" — **false**; the notes say "often more efficient," not "most efficient."

→ Assertion false, Reason true.

---

## Question 15 — POCL: which step would NOT repair a causal-link conflict

**Answer: (b) Adding `(s_2, s_3)` to `≺_T`, (c) Adding `(s_3, s_1)` to `≺_T`, and (d) Adding `(s_2, s_3, clear(C))` to `≺_C`.**

The threat: `s_3 = stack(B,C)` has effect `¬clear(C)`, threatening the causal link `⟨s_init, s_1, clear(C)⟩`. Threats are repaired only by **ordering** the threatening step — promotion or demotion (additions to `≺_T`). Demotion before `s_init` is impossible (it's first), so the **only valid repair is promotion: add `(s_1, s_3)` to `≺_T`** (threat after the consumer).

Therefore:
- (a) `(s_1, s_3)` to `≺_T` — the valid repair (promotion). **IS used.**
- (b) `(s_2, s_3)` to `≺_T` — not the repair for this threat. **NOT used.**
- (c) `(s_3, s_1)` to `≺_T` — wrong direction (forces the threat / risks a cycle). **NOT used.**
- (d) `(s_2, s_3, clear(C))` to `≺_C` — a causal-link addition; causal links satisfy open preconditions, never repair threats. **NOT used.**

---

## Question 16 — Gwendolen: fill in the blank

**Answer: `+!pickup [achieve]`** (the achievement-goal addition trigger).

Complete plan:
```
+!pickup [achieve] : {B empty} <- +pickup, -empty, print(done);
```
The initial goal `pickup [achieve]` posts an achievement goal whose trigger is `+!pickup [achieve]`; the guard `{B empty}` holds initially; the body adds `pickup`, removes `empty`, prints `done`, and the agent stops.

---

## Question 17 — Gwendolen reasoning cycle: next stage after applying a plan

**Answer: It executes the top deed on the intention, which will be `move_to(1, 1)`.**

The plan `+!assist_human(X,Y) [perform] : {True} <- move_to(X,Y), assist;` has just been applied to `+!assist_human(1,1)`, so its body is on the intention with `X/1, Y/1`. The next step of the cycle (Stage D) executes the first deed — `move_to(1,1)`. It does not re-perceive or re-select an intention first.

---

## Question 18 — LTL for "if the agent believes there is an obstacle it will stop"

**Answer: `□(B(agent, obstacle) → ◇stop)`.**

- The implication must hold at every state → outer `□`.
- "will stop" = `◇stop` (eventually), not bare `stop` (immediate).

So: *globally, whenever the agent believes there is an obstacle, it will eventually stop.*

---

## Question 19 — Essay: paper review (10 marks)

Open-ended. Required: (1) name the paper; (2) summarise key conclusion(s); (3) one rigour score 1–5 for the whole paper; (4) justify it.

**Rigour scale:** 1 = assertion-only/errors; 2 = minimal (implemented, runs on ≥1 input, no systematic testing); 3 = reasonable (tested on several representative inputs, no proofs); 4 = good (thorough testing + baselines, or proofs of properties); 5 = excellent (extensive theory *and* experiments, multiple metrics, baselines, alternatives discussed).

**Model answer — "Language Models as Ontology Encoders" (Yang, Chen, He, Gao, Horrocks):**

> **Paper.** This review considers *Language Models as Ontology Encoders* (OnT), which combines the strengths of language models and geometric ontology embeddings: geometric methods capture formal relations (e.g. subsumption) but discard textual labels, while LMs capture text but don't preserve logical structure. OnT verbalises atomic and complex 𝓔𝓛 concepts, encodes them with a pretrained LM, and retrains the representations in a hyperbolic Poincaré space, with roles as rotation/scaling and subsumptions as hierarchical relations.
>
> **Key conclusions.** Jointly representing textual meaning and formal logical structure yields stronger general-purpose ontology embeddings. On GALEN, Gene Ontology and Anatomy, OnT achieves the best overall performance on axiom-prediction and inference, with notable mean-rank gains; it shows encouraging cross-ontology transfer and, in a SNOMED CT case study, detects a missing and an erroneous subsumption.
>
> **Rigour score: 4 (Good).**
>
> **Justification.** Two tasks (prediction and inference), three substantial real-world ontologies, a broad baseline set (ELEM, ELBE, BoxEL, Box2EL, TransBox, OPA2Vec, OWL2Vec*, HiT), multiple metrics (Hits@1/10/100, MRR, mean rank), ablations across LMs, a transfer test, a practical case study, a formal proposition on role-transformation invariance, and released code/data. It clears level 3 (tested on representative inputs) and reaches level 4 (thorough baselines + a proved property). It is not a 5 because evidence isn't fully comprehensive: experiments are limited to the 𝓔𝓛 fragment and three ontologies, a random axiom split may not reflect realistic ontology evolution, results are point estimates without significance tests, and several baselines were reimplemented under different regimes. The authors themselves flag wider ontologies and verbalisation-quality analysis as future work.

*(Swap in another listed paper — e.g. "A Defeasible Logic Implementation of Ethical Reasoning," "Generalized Planning in PDDL Domains with Pretrained LLMs," "Tools for Implementing Multi-Agent Systems Based on Protocols" — keeping this four-part shape and grounding the score in the scale's exact wording.)*

---

## Quick answer key (final, graded-key-aligned)

| Q | Answer |
|---|---|
| 1 | All four |
| 2 | (1), (2), (3) — not "many efficient algorithms" |
| 3 | All four |
| 4 | 1-to-n, n-to-1, m-to-n |
| 5 | `<Alan_Turing, WorksFor, Manchester>` + `<Ada_Lovelace, LivedIn, Liverpool>` |
| 6 | **Hierarchical contrastive loss only** |
| 7 | `∅ --paid'(john,peter)--> ∅` |
| 8 | A belief |
| 9 | `KB ⊨ ¬has_phd(helena)` and `KB ⊭ ¬has_phd(jim)` |
| 10 | Option C (submit/mark at 2,3,4; respond at 3; mark at 5) |
| 11 | accept → hand-in → A3 empty |
| 12 | **No argument is skeptically accepted + A1 is credulously accepted** |
| 13 | 3 |
| 14 | Assertion false, Reason true (option 4) |
| 15 | (b), (c), (d) not used; (a) `(s_1,s_3)` is the valid repair |
| 16 | `+!pickup [achieve]` |
| 17 | Executes top deed `move_to(1,1)` |
| 18 | `□(B(agent,obstacle) → ◇stop)` |
| 19 | Essay — model structure above |

*Corrected against the graded Canvas key: **Q6** (contrastive loss only) and **Q12** (A1 credulously accepted, not "all rejected"). Q4 and Q5 confirmed correct by the key. The key is authoritative over any derivation.*
