---
subject: COMP64602
chapter: 75
title: "Week 5 — Extra Exercises"
language: en
---

# Week 5 — Non-Monotonic Reasoning: Extra Exercise Set

A second layer on top of chapter 55, focused on demonstrating non-monotonicity concretely, computing default logic extensions, and the closed-world assumption's failure modes.

## Exercise types

1. **Non-monotonicity demonstration** — show a conclusion withdrawn on new information.
2. **CWA / negation as failure** — apply, and identify where it breaks.
3. **Default logic extensions** — compute them, including multiple extensions.
4. **Circumscription** — minimise abnormality predicates.
5. **Formalism comparison** — choose the right tool for a stated need.

---

# Section A — Non-monotonicity and the CWA

## E1. Demonstrate non-monotonicity

Show concretely that classical entailment is monotonic while default reasoning is not.

### Solution

**Step 1: State monotonicity.** Classical logic satisfies: if $\Gamma \models \varphi$ then $\Gamma \cup \Delta \models \varphi$ for any $\Delta$. Adding premises never removes conclusions.

**Step 2: Justify it semantically.** $\Gamma \models \varphi$ means every model of $\Gamma$ satisfies $\varphi$. Adding $\Delta$ can only **shrink** the model set. A property holding of all members of a set holds of all members of any subset. Hence $\varphi$ survives.

**Step 3: Set up the default case.** Take the default "birds normally fly" with the fact $\mathsf{Bird}(\mathsf{tweety})$. Default reasoning concludes
$$\mathsf{Flies}(\mathsf{tweety}).$$

**Step 4: Add information.** Now add $\mathsf{Penguin}(\mathsf{tweety})$ together with $\forall x(\mathsf{Penguin}(x) \rightarrow \neg\mathsf{Flies}(x))$.

**Step 5: Observe the withdrawal.** The default's consistency requirement now fails — assuming $\mathsf{Flies}(\mathsf{tweety})$ contradicts the new information. So the conclusion is **retracted**:
$$\neg\mathsf{Flies}(\mathsf{tweety}).$$

**Step 6: State the contrast.** A previously drawn conclusion was withdrawn on **purely additive** new information. This is non-monotonicity, and it is why classical entailment cannot model defeasible commonsense inference — not a defect of the default formalism but its purpose.

**Step 7: Note why this matters for agents.** An agent acts on incomplete information and must revise as observations arrive. Requiring monotonicity would mean either never concluding anything beyond what is entailed, or never being able to correct a conclusion.

---

## E2. Apply the CWA and find where it breaks

A database of flights contains only $\mathsf{Flight}(\mathsf{man}, \mathsf{par})$ and $\mathsf{Flight}(\mathsf{par}, \mathsf{rom})$. (a) What does the CWA conclude about $\mathsf{Flight}(\mathsf{man}, \mathsf{rom})$? (b) Give a case where this is wrong. (c) Show the CWA can produce inconsistency.

### Solution

**Step 1: (a) State the CWA.** Any ground atom not derivable is taken to be **false**. Since $\mathsf{Flight}(\mathsf{man},\mathsf{rom})$ is not in the database and not derivable, the CWA concludes
$$\neg\mathsf{Flight}(\mathsf{man},\mathsf{rom}).$$

**Step 2: Justify when this is legitimate.** It is sound if the database is **complete** for flights — a reasonable assumption for an airline's own schedule, which is exactly why the CWA is the right default for databases.

**Step 3: (b) Give the failure case.** If the database records only *direct* flights operated by one carrier, the conclusion is wrong as a claim about the world: a Manchester–Rome flight may exist on another airline. The CWA converts "not recorded" into "does not exist", which is valid only under genuine completeness.

**Step 4: (c) Construct an inconsistency.** Suppose the knowledge base contains the disjunction
$$\mathsf{Flight}(\mathsf{man},\mathsf{rom}) \lor \mathsf{Flight}(\mathsf{man},\mathsf{mad})$$
and neither disjunct is individually derivable.

**Step 5: Derive the contradiction.** The CWA adds $\neg\mathsf{Flight}(\mathsf{man},\mathsf{rom})$ (not derivable) and $\neg\mathsf{Flight}(\mathsf{man},\mathsf{mad})$ (not derivable). Together with the disjunction, this is **inconsistent**.

**Step 6: State the diagnosis.** The CWA is safe for **Horn** knowledge bases, where a unique least model exists and non-derivability is well behaved (the COMP64401 Datalog result). With disjunction, there is no least model — the disjunction is entailed while neither disjunct is — so negating both individually is unsound. This is the precise reason Datalog excludes disjunction.

---

# Section B — Default logic

## E3. Compute an extension

A default theory has facts $W = \{\mathsf{Bird}(t)\}$ and the default
$$\delta = \frac{\mathsf{Bird}(x) : \mathsf{Flies}(x)}{\mathsf{Flies}(x)}.$$
Compute the extension.

### Solution

**Step 1: Read the notation.** A default $\dfrac{\alpha : \beta}{\gamma}$ has **prerequisite** $\alpha$, **justification** $\beta$, and **consequent** $\gamma$. It applies when $\alpha$ is believed and $\beta$ is **consistent** with what is believed; then $\gamma$ is added.

**Step 2: Check the prerequisite.** $\mathsf{Bird}(t) \in W$ ✓, instantiating $x = t$.

**Step 3: Check the justification.** Is $\mathsf{Flies}(t)$ consistent with $W = \{\mathsf{Bird}(t)\}$? Nothing contradicts it ✓.

**Step 4: Apply and close.** Add $\mathsf{Flies}(t)$. The extension is the deductive closure
$$E = \mathrm{Th}\big(\{\mathsf{Bird}(t), \mathsf{Flies}(t)\}\big).$$

**Step 5: Confirm stability.** No further default applies, and nothing in $E$ undermines the justification used. So $E$ is the unique extension.

**Step 6: Note this is a normal default.** When justification and consequent coincide ($\beta = \gamma$), the default is **normal**. Normal default theories always have at least one extension — a useful guarantee that fails in general.

---

## E4. A theory with two extensions

Compute the extensions of $W = \{\mathsf{Quaker}(n), \mathsf{Republican}(n)\}$ with
$$\delta_1 = \frac{\mathsf{Quaker}(x) : \mathsf{Pacifist}(x)}{\mathsf{Pacifist}(x)}, \qquad \delta_2 = \frac{\mathsf{Republican}(x) : \neg\mathsf{Pacifist}(x)}{\neg\mathsf{Pacifist}(x)}.$$

### Solution

**Step 1: Check prerequisites.** Both hold for $x = n$: $\mathsf{Quaker}(n)$ and $\mathsf{Republican}(n)$ are in $W$.

**Step 2: Observe the conflict.** The consequents are $\mathsf{Pacifist}(n)$ and $\neg\mathsf{Pacifist}(n)$ — contradictory. They cannot both be adopted.

**Step 3: Build extension 1 — apply $\delta_1$ first.** Justification $\mathsf{Pacifist}(n)$ is consistent with $W$ ✓, so add it. Now check $\delta_2$: its justification $\neg\mathsf{Pacifist}(n)$ is **inconsistent** with the current beliefs, so $\delta_2$ is blocked.
$$E_1 = \mathrm{Th}\big(\{\mathsf{Quaker}(n), \mathsf{Republican}(n), \mathsf{Pacifist}(n)\}\big).$$

**Step 4: Build extension 2 — apply $\delta_2$ first.** Symmetrically, add $\neg\mathsf{Pacifist}(n)$, which blocks $\delta_1$.
$$E_2 = \mathrm{Th}\big(\{\mathsf{Quaker}(n), \mathsf{Republican}(n), \neg\mathsf{Pacifist}(n)\}\big).$$

**Step 5: State the result.** **Two** distinct extensions. Each is internally consistent and stable; the theory does not determine which to prefer.

**Step 6: State the interpretive consequence.** Multiple extensions represent genuinely **alternative coherent belief sets** — this is the Nixon diamond. Two reasoning strategies follow:
- **Choice (extension) semantics:** commit to one extension.
- **Cautious semantics:** believe only what is in **every** extension — here, neither $\mathsf{Pacifist}(n)$ nor its negation, so the question is left open.

**Step 7: Note the practical fix.** Adding **priorities** between defaults, or a more specific default that dominates (specificity ordering), restores a unique answer. That is what semi-normal defaults and prioritised default logic provide.

---

## E5. Circumscription by minimising abnormality

Formalise "birds normally fly" using an abnormality predicate, then show how minimising $\mathsf{Ab}$ yields the desired conclusion for a bird and blocks it for a penguin.

### Solution

**Step 1: Write the axioms.**
$$\forall x\, \big(\mathsf{Bird}(x) \land \neg\mathsf{Ab}(x) \rightarrow \mathsf{Flies}(x)\big)$$
$$\forall x\, \big(\mathsf{Penguin}(x) \rightarrow \mathsf{Bird}(x)\big)$$
$$\forall x\, \big(\mathsf{Penguin}(x) \rightarrow \neg\mathsf{Flies}(x)\big)$$

**Step 2: Case 1 — a plain bird.** With $W = \{\mathsf{Bird}(t)\}$, ask what is true in all models **minimising** the extension of $\mathsf{Ab}$.

**Step 3: Minimise.** Nothing forces $\mathsf{Ab}(t)$, so models with $\mathsf{Ab}^{\mathcal{M}} = \emptyset$ are among the minimal ones and are the only minimal ones. In those, the first axiom gives $\mathsf{Flies}(t)$.

Conclusion: $\mathsf{Flies}(t)$ ✓.

**Step 4: Case 2 — a penguin.** With $W = \{\mathsf{Penguin}(p)\}$: axiom 2 gives $\mathsf{Bird}(p)$, axiom 3 gives $\neg\mathsf{Flies}(p)$.

**Step 5: Show $\mathsf{Ab}(p)$ is forced.** Suppose $\neg\mathsf{Ab}(p)$. Then axiom 1 with $\mathsf{Bird}(p)$ yields $\mathsf{Flies}(p)$, contradicting Step 4. So **every** model has $\mathsf{Ab}(p)$, and minimisation cannot remove it — the minimal extension of $\mathsf{Ab}$ is $\{p\}$, not $\emptyset$.

**Step 6: Draw the conclusion.** $\neg\mathsf{Flies}(p)$, with the default correctly blocked. Minimisation gives "as few exceptions as the facts require" — abnormality is admitted only where forced.

**Step 7: Compare with default logic.** Both handle the same example. Circumscription works **model-theoretically**, by preferring minimal models of a classical theory; default logic works **proof-theoretically**, by extending a belief set with consistency-checked rules. Circumscription keeps a classical language and changes the entailment relation; default logic changes the inference rules. Knowing which mechanism a formalism modifies is the examinable distinction.
