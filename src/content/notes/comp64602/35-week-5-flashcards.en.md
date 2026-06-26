---
subject: COMP64602
chapter: 35
title: "Week 5 — Flashcards"
language: en
---

# Week 5 — Flashcards

65 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> When does an agent need non-monotonic reasoning?</summary>

Use it when a conclusion may need withdrawing.<br>Step 1: Ask whether the world/perception can change, or whether a default assumption can be defeated.<br>Step 2: If new information can remove an old conclusion, treat the reasoning as non-monotonic.<br><b>Reference:</b> Non-monotonic reasoning allows adding information to invalidate earlier inferences.

</details>

<details>
<summary><strong>Q2.</strong> How do you test whether a logic is monotonic?</summary>

Step 1: Start with an entailment <code>KB ⊨ α</code>.<br>Step 2: Add arbitrary extra information <code>β</code>.<br>Step 3: Check whether <code>α</code> still follows from <code>KB ∧ β</code> in every case.<br><b>Reference:</b> Monotonic iff <code>∀α,β. KB ⊨ α ⇒ KB ∧ β ⊨ α</code>.

</details>

<details>
<summary><strong>Q3.</strong> How do you spot non-monotonicity in a reasoning system?</summary>

Step 1: Find a conclusion <code>α</code> derived from <code>KB</code>.<br>Step 2: Add new information <code>β</code>.<br>Step 3: If <code>α</code> no longer follows, the system is non-monotonic.<br><b>Reference:</b> Non-monotonic pattern: <code>KB ⊨ α</code> but <code>KB ∧ β ⊭ α</code>.

</details>

<details>
<summary><strong>Q4.</strong> Fact changed vs default defeated — what is the discriminator?</summary>

Ask: did the world itself change, or did we merely learn an exception?<br>If the truth of a fact changed, use truth maintenance/belief revision.<br>If a normal assumption is defeated by exception information, use default-style non-monotonic reasoning.<br><b>Reference:</b> The sheet distinguishes revised default assumptions from actual truth changes over time.

</details>

<details>
<summary><strong>Q5.</strong> How do you answer a belief query using a simple BDI-style belief base?</summary>

Step 1: Treat the belief base as a stored set of facts.<br>Step 2: Check whether queried atom <code>p</code> is a member.<br>Step 3: Return believed iff membership succeeds; do not infer at lookup time.<br><b>Reference:</b> Simple belief lookup is <code>p ∈ Beliefs</code>.

</details>

<details>
<summary><strong>Q6.</strong> How do you add inferred beliefs with forward chaining?</summary>

Step 1: Add new observed facts to the belief base.<br>Step 2: Scan rules whose antecedents are now satisfied.<br>Step 3: Insert each rule conclusion as an additional belief.<br>Step 4: Repeat until no more consequences are added.<br><b>Reference:</b> From <code>φ ⇒ ψ</code> and <code>φ</code>, forward chaining adds <code>ψ</code>.

</details>

<details>
<summary><strong>Q7.</strong> Forward chaining vs backward chaining — what is the discriminator?</summary>

Ask: are consequences derived immediately or only when queried?<br>Forward chaining: derive and store consequences after facts arrive.<br>Backward chaining: keep facts/rules, then prove the target only when needed.<br><b>Reference:</b> BDI systems often avoid inserting every possible consequence and use query-time reasoning.

</details>

<details>
<summary><strong>Q8.</strong> What is the basic truth-maintenance update problem?</summary>

Step 1: New information arrives as a literal, either <code>φ</code> or <code>¬φ</code>.<br>Step 2: Replace the opposite literal if present.<br>Step 3: Also reconsider any facts inferred from the replaced literal.<br><b>Reference:</b> Truth maintenance is needed because inferred beliefs may lose their justification when old facts change.

</details>

<details>
<summary><strong>Q9.</strong> How does the naive overwrite update rule work?</summary>

Step 1: If new input is <code>φ</code>, remove <code>¬φ</code> if present and add <code>φ</code>.<br>Step 2: If new input is <code>¬φ</code>, remove <code>φ</code> if present and add <code>¬φ</code>.<br>Step 3: Stop there — this is why it is naive.<br><b>Reference:</b> Naive update treats new literal information as overwriting old literal information.

</details>

<details>
<summary><strong>Q10.</strong> Why is naive overwrite insufficient for truth maintenance?</summary>

Step 1: Identify facts inferred from the old literal.<br>Step 2: When that literal is removed, check which inferred facts depended only on it.<br>Step 3: Remove or deactivate those unsupported consequences too.<br><b>Reference:</b> If <code>ψ</code> was inferred from <code>φ</code>, learning <code>¬φ</code> removes the justification for <code>ψ</code>.

</details>

<details>
<summary><strong>Q11.</strong> How do you truth-maintain an inferred consequence after its support is removed?</summary>

Step 1: Record the rule link from support to consequence.<br>Step 2: When support <code>φ</code> becomes inactive, inspect every dependent consequence <code>ψ</code>.<br>Step 3: Keep <code>ψ</code> only if another active justification remains.<br>Step 4: Otherwise mark/remove <code>ψ</code>.<br><b>Reference:</b> A fact should remain believed only while at least one valid justification supports it.

</details>

<details>
<summary><strong>Q12.</strong> What is a Truth Maintenance System used for?</summary>

Use it to keep a belief database consistent with the agent’s current view of the world.<br>Step 1: Track current facts.<br>Step 2: Track inferred consequences.<br>Step 3: Revise consequences when facts change.<br><b>Reference:</b> Truth Maintenance Systems maintain consistency of a database/belief base as information changes.

</details>

<details>
<summary><strong>Q13.</strong> How does logging-and-rerunning truth maintenance work?</summary>

Step 1: Keep a time/order log of added facts.<br>Step 2: When fact <code>φ</code> is removed, rewind to where <code>φ</code> was added.<br>Step 3: Delete <code>φ</code> and all later entries.<br>Step 4: Rerun inference to restore whatever still follows.<br><b>Reference:</b> Logging TMS uses historical order plus recomputation after removals.

</details>

<details>
<summary><strong>Q14.</strong> When is logging-and-rerunning a bad truth-maintenance strategy?</summary>

Ask: are later entries independent perceptual facts rather than inferred consequences?<br>If yes, rewinding can wrongly delete useful later facts and may not restore them.<br>It also recomputes many unaffected inferences.<br><b>Reference:</b> Logging fails especially with continuous perception, genuine world change, and independent later inputs.

</details>

<details>
<summary><strong>Q15.</strong> How does a justification-based TMS work?</summary>

Step 1: For each inferred sentence, store the facts/rules that justify it.<br>Step 2: When a support becomes inactive, follow dependency links.<br>Step 3: Mark dependent sentences inactive unless another justification still holds.<br><b>Reference:</b> A justification records which other sentences must hold for a sentence to hold.

</details>

<details>
<summary><strong>Q16.</strong> How do in/out markings work in a justification-based TMS?</summary>

Step 1: Keep facts in the database rather than physically deleting everything.<br>Step 2: Mark currently active beliefs as <code>in</code>.<br>Step 3: Mark inactive/unsupported beliefs as <code>out</code>.<br>Step 4: Flip markings as supports change.<br><b>Reference:</b> <code>in</code> means currently active in the belief base; <code>out</code> means not currently active.

</details>

<details>
<summary><strong>Q17.</strong> Justification-based vs assumption-based TMS — what is the discriminator?</summary>

Ask: are we maintaining one current state, or several possible states?<br>Justification-based TMS: tracks support for facts in the current state.<br>Assumption-based TMS: tracks which assumption sets make each fact true.<br><b>Reference:</b> Assumption-based systems store facts relative to possible world states/assumption sets.

</details>

<details>
<summary><strong>Q18.</strong> How does an assumption-based truth maintenance system work?</summary>

Step 1: Represent alternative assumption sets <code>A₁, A₂, …</code>.<br>Step 2: Link each fact <code>φ</code> to the assumptions it depends on.<br>Step 3: Treat <code>φ</code> as active only when all assumptions in its set hold.<br>Step 4: Switch active facts when the applicable assumption set changes.<br><b>Reference:</b> Instead of only asking whether <code>φ</code> is in/out, track <code>φ</code> true under assumption set <code>A</code>.

</details>

<details>
<summary><strong>Q19.</strong> How do modern BDI-style systems avoid an overloaded belief database?</summary>

Step 1: Store observed facts and inference rules separately.<br>Step 2: Avoid proactively deriving every possible consequence.<br>Step 3: Use rules when a query/action decision needs them.<br><b>Reference:</b> The sheet describes modern BDI systems as a halfway-house rather than one flat database of all inferred facts.

</details>

<details>
<summary><strong>Q20.</strong> What is Negation as Failure?</summary>

Use it when failure to prove <code>φ</code> is treated as grounds for <code>¬φ</code>.<br>Step 1: Try to derive <code>φ</code> from <code>KB</code>.<br>Step 2: If derivation fails, conclude <code>¬φ</code>.<br><b>Reference:</b> NAF/CWA: <code>KB ⊭ φ ⇔ KB ⊨ ¬φ</code>.

</details>

<details>
<summary><strong>Q21.</strong> Negation as Failure vs classical negation — what is the discriminator?</summary>

Ask: is falsity proved, or merely assumed from lack of proof?<br>Classical negation requires support for <code>¬φ</code>.<br>NAF infers <code>¬φ</code> because <code>φ</code> cannot be derived.<br><b>Reference:</b> In classical logic, failure to prove <code>φ</code> does not normally imply <code>¬φ</code>.

</details>

<details>
<summary><strong>Q22.</strong> How do you use the Closed World Assumption on a query?</summary>

Step 1: Treat the knowledge base as complete for the relevant predicates.<br>Step 2: Try to prove queried atom <code>φ</code>.<br>Step 3: If <code>φ</code> is not known/derivable, treat <code>φ</code> as false.<br><b>Reference:</b> CWA is the practical reading of negation as failure: unknown is treated as false.

</details>

<details>
<summary><strong>Q23.</strong> How do you derive a rule conclusion when the rule body contains NAF?</summary>

Given a rule like <code>A(x) ∧ ¬B(x) → C(x)</code>:<br>Step 1: Prove <code>A(x)</code> positively.<br>Step 2: Try to prove <code>B(x)</code>.<br>Step 3: If <code>B(x)</code> fails, infer <code>¬B(x)</code> by NAF.<br>Step 4: Fire the rule and infer <code>C(x)</code>.<br><b>Reference:</b> NAF can supply negative conditions in rule antecedents.

</details>

<details>
<summary><strong>Q24.</strong> How do you block a NAF-based rule application?</summary>

Step 1: Identify the negative condition <code>¬B(x)</code> needed by the rule.<br>Step 2: Check whether <code>B(x)</code> is known or derivable.<br>Step 3: If <code>B(x)</code> succeeds, do not infer <code>¬B(x)</code> by NAF, so the rule does not fire.<br><b>Reference:</b> NAF only supplies <code>¬B(x)</code> when <code>B(x)</code> cannot be derived.

</details>

<details>
<summary><strong>Q25.</strong> Why is Negation as Failure non-monotonic?</summary>

Step 1: Initially, <code>φ</code> is not derivable, so NAF supports <code>¬φ</code>.<br>Step 2: Later, add evidence deriving <code>φ</code>.<br>Step 3: The earlier NAF conclusion <code>¬φ</code> must be withdrawn.<br><b>Reference:</b> Adding information can remove a NAF conclusion, so NAF is non-monotonic.

</details>

<details>
<summary><strong>Q26.</strong> How do agents use absence of perception under NAF?</summary>

Step 1: Record what the agent has observed or queried.<br>Step 2: For that context, try to prove an unwanted condition <code>B(x)</code>.<br>Step 3: If <code>B(x)</code> is not perceived/derivable, infer <code>¬B(x)</code> and act on that default.<br><b>Reference:</b> NAF lets agents reason from what they have not perceived, not only from positive observations.

</details>

<details>
<summary><strong>Q27.</strong> How should BDI systems use NAF efficiently?</summary>

Step 1: Store perceptual facts in the belief base.<br>Step 2: Store rules separately.<br>Step 3: Use backward chaining plus NAF only when a query/action needs an answer.<br>Step 4: Keep rule chains short enough for fast reasoning.<br><b>Reference:</b> Query-time NAF saves work compared with deriving every consequence after every perception.

</details>

<details>
<summary><strong>Q28.</strong> Classical model semantics — how do you check entailment?</summary>

Step 1: Enumerate/consider the models of <code>KB</code>.<br>Step 2: Check whether <code>φ</code> is true in every model.<br>Step 3: If yes, <code>KB ⊨ φ</code>; otherwise not.<br><b>Reference:</b> Classical <code>KB ⊨ φ</code> means <code>φ</code> is true in all models of <code>KB</code>.

</details>

<details>
<summary><strong>Q29.</strong> Why does classical model semantics not capture NAF?</summary>

Step 1: Notice that absent atoms may still be true in some classical models.<br>Step 2: Therefore absence from <code>KB</code> does not classically imply falsity.<br>Step 3: Use a restricted/preferred model semantics instead.<br><b>Reference:</b> NAF needs semantics where unsupported atoms are not freely made true.

</details>

<details>
<summary><strong>Q30.</strong> Minimal model semantics — how do you use it for CWA/NAF?</summary>

Step 1: Find the models of <code>KB</code>.<br>Step 2: Keep only minimal models, i.e. models with the fewest true atoms.<br>Step 3: Accept <code>φ</code> iff it is true in all minimal models.<br><b>Reference:</b> Under NAF/CWA, <code>KB ⊨ φ</code> iff <code>φ</code> is true in all minimal models of <code>KB</code>.

</details>

<details>
<summary><strong>Q31.</strong> Minimal models vs preferred models — what is the discriminator?</summary>

Ask: is preference specifically about fewest true atoms, or about a chosen preference ordering?<br>Minimal models minimise truth of atoms generally.<br>Preferred models are whatever models the logic ranks as best.<br><b>Reference:</b> CWA uses minimal models; model preference logics use preferred models.

</details>

<details>
<summary><strong>Q32.</strong> How do model preference logics define entailment?</summary>

Step 1: Generate the models allowed by <code>KB</code>.<br>Step 2: Apply the logic’s preference criterion to select preferred models.<br>Step 3: Entail <code>φ</code> iff <code>φ</code> is true in all preferred models.<br><b>Reference:</b> Model preference entailment: <code>KB ⊨ φ</code> when <code>φ</code> is true in all preferred models.

</details>

<details>
<summary><strong>Q33.</strong> How is the Closed World Assumption a model preference logic?</summary>

Step 1: Treat ordinary models with unnecessary true atoms as less preferred.<br>Step 2: Prefer models with the fewest true atoms.<br>Step 3: Accept what holds across those minimal models.<br><b>Reference:</b> For CWA, preferred models are minimal models.

</details>

<details>
<summary><strong>Q34.</strong> What is default logic for?</summary>

Use it when rules should normally apply unless doing so conflicts with what is known.<br>Step 1: State the normal rule.<br>Step 2: State the condition/justification that must remain consistent.<br>Step 3: Apply the rule only when not defeated.<br><b>Reference:</b> Default logic supports inference with incomplete and changing information.

</details>

<details>
<summary><strong>Q35.</strong> How do you read the default rule syntax <code>A:J/C</code>?</summary>

Step 1: Check prerequisite <code>A</code>.<br>Step 2: Check justification <code>J</code> is consistent with what is known.<br>Step 3: If both pass, infer conclusion <code>C</code>.<br><b>Reference:</b> In <code>A:J/C</code>, <code>A</code> is prerequisite, <code>J</code> is justification, and <code>C</code> is conclusion.

</details>

<details>
<summary><strong>Q36.</strong> How do you apply a default rule step by step?</summary>

Step 1: Prove the prerequisite <code>A</code> from facts/non-default rules.<br>Step 2: Test whether the justification <code>J</code> conflicts with known or entailed information.<br>Step 3: If consistent, add <code>C</code>.<br>Step 4: If inconsistent, block the default.<br><b>Reference:</b> Defaults apply only when their justifications remain consistent.

</details>

<details>
<summary><strong>Q37.</strong> How do you decide whether a default is blocked?</summary>

Ask: would accepting the default’s justification contradict the knowledge base/current extension?<br>If yes, block the default.<br>If no, the default may fire.<br><b>Reference:</b> A default is blocked when its justification is inconsistent with what is known or entailed.

</details>

<details>
<summary><strong>Q38.</strong> How do you encode a normal-property default schematically?</summary>

Use a rule of the form <code>P(x):Q(x)/Q(x)</code>.<br>Step 1: Prove <code>P(x)</code>.<br>Step 2: Check that <code>¬Q(x)</code> is not known/entailed.<br>Step 3: Infer <code>Q(x)</code> by default.<br><b>Reference:</b> This captures “normally, P-things have Q” unless evidence against Q appears.

</details>

<details>
<summary><strong>Q39.</strong> How do explicit exceptions defeat a default?</summary>

Step 1: Identify exception information <code>E(x)</code> or direct contradiction <code>¬Q(x)</code>.<br>Step 2: Check whether it makes the default justification inconsistent.<br>Step 3: If it does, do not infer <code>Q(x)</code>.<br><b>Reference:</b> Default reasoning allows normal conclusions to be withdrawn when abnormal/exceptional information is known.

</details>

<details>
<summary><strong>Q40.</strong> What is an extension in default logic?</summary>

Use it as one consistent completed version of the theory.<br>Step 1: Start with atomic facts.<br>Step 2: Close under non-default rules.<br>Step 3: Add as many compatible default conclusions as possible while staying consistent.<br><b>Reference:</b> An extension contains facts, non-default consequences, and consistent default conclusions.

</details>

<details>
<summary><strong>Q41.</strong> How do you construct candidate extensions in default logic?</summary>

Step 1: List facts and strict consequences.<br>Step 2: List applicable defaults.<br>Step 3: Build maximal consistent sets by choosing compatible defaults.<br>Step 4: Reject candidates that are inconsistent or fail to include applicable compatible defaults.<br><b>Reference:</b> Extensions represent possible completed theories after applying defaults consistently.

</details>

<details>
<summary><strong>Q42.</strong> How do you check skeptical entailment in default logic?</summary>

Step 1: Generate all extensions.<br>Step 2: Check whether <code>φ</code> appears/is true in every extension.<br>Step 3: Entail <code>φ</code> only if all extensions support it.<br><b>Reference:</b> Skeptical semantics accepts conclusions true in all extensions.

</details>

<details>
<summary><strong>Q43.</strong> How do you check credulous entailment in default logic?</summary>

Step 1: Generate all extensions.<br>Step 2: Check whether at least one extension contains/supports <code>φ</code>.<br>Step 3: Entail <code>φ</code> if some extension supports it.<br><b>Reference:</b> Credulous semantics accepts conclusions true in at least one extension.

</details>

<details>
<summary><strong>Q44.</strong> Skeptical vs credulous semantics — what is the discriminator?</summary>

Ask: must the conclusion survive every extension, or only one?<br>Skeptical: all extensions.<br>Credulous: at least one extension.<br><b>Reference:</b> Skeptical is cautious; credulous accepts any consistently supported default conclusion.

</details>

<details>
<summary><strong>Q45.</strong> How do you analyze a two-default conflict pattern?</summary>

Step 1: Identify one fact/default path supporting <code>Q(a)</code>.<br>Step 2: Identify another fact/default path supporting <code>¬Q(a)</code>.<br>Step 3: Build one extension for each consistent choice.<br>Step 4: Compare skeptical, credulous, and preferred-extension outcomes.<br><b>Reference:</b> Conflicting defaults can produce multiple internally consistent extensions with opposite conclusions.

</details>

<details>
<summary><strong>Q46.</strong> What do skeptical and credulous semantics return in a symmetric default conflict?</summary>

Step 1: If one extension supports <code>Q(a)</code> and another supports <code>¬Q(a)</code>, inspect where each conclusion occurs.<br>Step 2: Skeptically, accept neither conflicting conclusion.<br>Step 3: Credulously, each may be accepted because each appears in some extension.<br><b>Reference:</b> Skeptical = all extensions; credulous = at least one extension.

</details>

<details>
<summary><strong>Q47.</strong> How do preferred extensions resolve a default conflict?</summary>

Step 1: Add a priority ordering over defaults/extensions.<br>Step 2: Select extensions supported by higher-priority defaults.<br>Step 3: Entail conclusions from the selected preferred extension(s).<br><b>Reference:</b> Preferred-extension approaches refine default logic when multiple extensions conflict.

</details>

<details>
<summary><strong>Q48.</strong> Why may size-based preference fail in a default conflict?</summary>

Ask: do the competing extensions have the same size/amount of information?<br>If yes, choosing the smallest/largest extension cannot break the tie.<br>Use an explicit preference ordering instead.<br><b>Reference:</b> Some default conflicts produce equally sized extensions, so size alone gives no preference.

</details>

<details>
<summary><strong>Q49.</strong> What is circumscription?</summary>

Use it when only selected predicates should be assumed false unless known true.<br>Step 1: Choose the predicates to circumscribe.<br>Step 2: Prefer models where those predicates apply to as few entities as possible.<br>Step 3: Infer consequences that hold in those preferred models.<br><b>Reference:</b> Circumscription minimises selected circumscribed predicates.

</details>

<details>
<summary><strong>Q50.</strong> Closed World Assumption vs circumscription — what is the discriminator?</summary>

Ask: are all predicates minimised, or only selected ones?<br>CWA: treat all unknown atoms/predicates as false.<br>Circumscription: treat only chosen circumscribed predicates as false by default.<br><b>Reference:</b> Circumscription is a more selective/refined closed-world assumption.

</details>

<details>
<summary><strong>Q51.</strong> How do you use a circumscribed exception predicate in a rule?</summary>

Given a strict rule <code>P(x) ∧ ¬Ab(x) → Q(x)</code>:<br>Step 1: Circumscribe <code>Ab</code>.<br>Step 2: If <code>Ab(a)</code> is not known, prefer <code>¬Ab(a)</code>.<br>Step 3: With <code>P(a)</code>, infer <code>Q(a)</code>.<br><b>Reference:</b> Circumscribed predicates are assumed false unless known true.

</details>

<details>
<summary><strong>Q52.</strong> How do you revise a circumscription-based conclusion when an exception becomes known?</summary>

Step 1: Previously, <code>Ab(a)</code> was minimised away, giving <code>¬Ab(a)</code>.<br>Step 2: Add new fact <code>Ab(a)</code>.<br>Step 3: The rule condition <code>¬Ab(a)</code> fails.<br>Step 4: Withdraw the default-like conclusion <code>Q(a)</code> unless supported otherwise.<br><b>Reference:</b> Circumscription is non-monotonic because new exception facts can remove old conclusions.

</details>

<details>
<summary><strong>Q53.</strong> How are preferred models chosen in circumscription?</summary>

Step 1: Fix the non-circumscribed facts/rules.<br>Step 2: Compare models by the extension of circumscribed predicates.<br>Step 3: Prefer models with fewer circumscribed entities/objects.<br><b>Reference:</b> Circumscription preferred models minimise the circumscribed predicates.

</details>

<details>
<summary><strong>Q54.</strong> How do you analyze a circumscription conflict with two abnormality predicates?</summary>

Step 1: Encode competing rules using different abnormality predicates, e.g. <code>Ab₁</code> and <code>Ab₂</code>.<br>Step 2: Circumscribe both abnormality predicates.<br>Step 3: If both rule conclusions conflict, choose models making one abnormality true at a time.<br>Step 4: If neither model is preferred over the other, no single conflict conclusion follows.<br><b>Reference:</b> Circumscription can produce multiple equally preferred models in unresolved conflicts.

</details>

<details>
<summary><strong>Q55.</strong> Default logic vs circumscription — what is the discriminator?</summary>

Ask: are defaults represented as rules with justifications, or as minimised predicates in preferred models?<br>Default logic: use <code>A:J/C</code> and extensions.<br>Circumscription: minimise chosen predicates and reason over preferred models.<br><b>Reference:</b> Both are non-monotonic, but their machinery differs.

</details>

<details>
<summary><strong>Q56.</strong> Extension vs preferred model — what is the discriminator?</summary>

Ask: is the object a completed set of accepted sentences, or a selected interpretation/model?<br>Extension: a consistent closure of facts/rules/defaults.<br>Preferred model: a model selected by a preference/minimisation criterion.<br><b>Reference:</b> Default logic uses extensions; model-preference logics and circumscription use preferred models.

</details>

<details>
<summary><strong>Q57.</strong> Classical vs NAF/CWA vs model preference vs default logic — what semantic test do you use?</summary>

Classical: <code>φ</code> true in all models of <code>KB</code>.<br>NAF/CWA: <code>φ</code> true in all minimal models of <code>KB</code>.<br>Model preference: <code>φ</code> true in all preferred models.<br>Default logic: <code>φ</code> evaluated over extensions according to skeptical/credulous/preferred semantics.<br><b>Reference:</b> The sheet contrasts model-based and extension-based semantics.

</details>

<details>
<summary><strong>Q58.</strong> What is the common non-monotonic pattern across the whole week?</summary>

Step 1: A default/minimal/preferred reasoning method derives <code>α</code> from <code>KB</code>.<br>Step 2: New information <code>β</code> arrives.<br>Step 3: <code>β</code> defeats the assumption/support for <code>α</code>.<br>Step 4: Withdraw <code>α</code>.<br><b>Reference:</b> Generic form: <code>KB ⊨ α</code> but <code>KB ∧ β ⊭ α</code>.

</details>

<details>
<summary><strong>Q59.</strong> When should you choose truth maintenance, NAF, default logic, or circumscription?</summary>

Use truth maintenance when stored beliefs/inferences must be updated after facts change.<br>Use NAF/CWA when unproved atoms should count as false.<br>Use default logic when normal rules need consistency-checked justifications.<br>Use circumscription when selected exception/abnormality predicates should be minimised.<br><b>Reference:</b> The week progresses from maintaining changing beliefs to three default-style reasoning approaches.

</details>

<details>
<summary><strong>Q60.</strong> Perceptual fact vs inferred consequence — why does it matter?</summary>

Ask: did the sentence come directly from sensing/input, or from a rule?<br>Perceptual facts may remain valid independently of earlier facts.<br>Inferred consequences should be withdrawn when their justifications disappear.<br><b>Reference:</b> Truth maintenance must not delete independent later perceptions just because an earlier support changed.

</details>

<details>
<summary><strong>Q61.</strong> What is the safe procedure when a support fact is removed?</summary>

Step 1: Remove/deactivate the support fact.<br>Step 2: Trace all consequences depending on it.<br>Step 3: For each consequence, ask whether another active justification remains.<br>Step 4: Deactivate only unsupported consequences.<br><b>Reference:</b> Dependency tracking avoids wholesale deletion and unnecessary recomputation.

</details>

<details>
<summary><strong>Q62.</strong> How do you write an exam answer for a default-style derivation?</summary>

Step 1: State the facts/strict rules.<br>Step 2: State the default/minimisation assumption being used.<br>Step 3: Check the blocking condition or preferred-model condition.<br>Step 4: Derive the conclusion.<br>Step 5: State what new information would defeat it.<br><b>Reference:</b> Examinable methods repeatedly require showing why a non-monotonic conclusion is currently licensed.

</details>

<details>
<summary><strong>Q63.</strong> How do you write an exam answer for a conflict between defaults?</summary>

Step 1: Show the argument/default path to <code>Q(a)</code>.<br>Step 2: Show the path to <code>¬Q(a)</code>.<br>Step 3: Build the alternative extensions/preferred models.<br>Step 4: State skeptical, credulous, and preference-based outcomes separately.<br><b>Reference:</b> Conflicting defaults are not resolved until the chosen semantics/preference criterion is specified.

</details>

<details>
<summary><strong>Q64.</strong> What is the key condition for efficient backward-chaining BDI reasoning?</summary>

Step 1: Keep rules sensible and targeted.<br>Step 2: Avoid too many rules firing for one query.<br>Step 3: Avoid long inference chains at action time.<br>Step 4: Query only what the agent needs.<br><b>Reference:</b> Backward-chaining BDI reasoning is useful only if rule-based inference remains quick.

</details>

<details>
<summary><strong>Q65.</strong> How do you decide whether a conclusion is unsupported or false after belief revision?</summary>

Ask: did the system gain evidence for the negation, or merely lose support for the original?<br>If support disappeared, mark the old conclusion unsupported/out.<br>Only infer falsity if separate evidence or a non-monotonic rule licenses the negation.<br><b>Reference:</b> Losing a justification means no reason to believe <code>ψ</code>; it does not automatically prove <code>¬ψ</code>.

</details>
