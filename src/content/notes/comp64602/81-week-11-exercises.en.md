---
subject: COMP64602
chapter: 81
title: "Week 11 — Extra Exercises"
language: en
---

# Week 11 — Verification, LTL, CTL and ATL: Extra Exercise Set

A second layer on top of chapter 61, focused on evaluating temporal formulae over transition systems, distinguishing LTL from CTL, and reading ATL strategic operators.

## Exercise types

1. **Transition-system modelling** — build a Kripke structure.
2. **LTL evaluation** over paths.
3. **CTL evaluation** over states, with path quantifiers.
4. **LTL versus CTL** — show a property expressible in one only.
5. **ATL reasoning** — apply the strategic operator.

---

# Section A — LTL over transition systems

## E1. Build a transition system and evaluate LTL

A traffic light cycles red → green → amber → red. Model it, then evaluate on the path from red: (a) $\mathsf{G}\mathsf{F}\,\mathit{green}$; (b) $\mathsf{G}(\mathit{green} \rightarrow \mathsf{X}\,\mathit{amber})$; (c) $\mathsf{F}\mathsf{G}\,\mathit{green}$.

### Solution

**Step 1: Define the structure.** States $S = \{s_r, s_g, s_a\}$; transitions $s_r \to s_g \to s_a \to s_r$; labelling $L(s_r) = \{\mathit{red}\}$, $L(s_g) = \{\mathit{green}\}$, $L(s_a) = \{\mathit{amber}\}$.

**Step 2: Identify the path.** The system is deterministic, so from $s_r$ there is exactly one path:
$$\pi = s_r, s_g, s_a, s_r, s_g, s_a, \dots$$
with period 3.

**Step 3: (a) $\mathsf{G}\mathsf{F}\,\mathit{green}$.** Fix any position $i$. Since the cycle repeats forever, some $j \ge i$ has state $s_g$. So $\mathsf{F}\,\mathit{green}$ holds at every position, hence $\mathsf{G}\mathsf{F}\,\mathit{green}$ holds — **true**. Green occurs infinitely often.

**Step 4: (b) $\mathsf{G}(\mathit{green} \rightarrow \mathsf{X}\,\mathit{amber})$.** The implication is vacuous except where $\mathit{green}$ holds, i.e. at positions $1, 4, 7, \dots$. At each, the next state is $s_a$, where $\mathit{amber}$ holds ✓. So — **true**.

**Step 5: (c) $\mathsf{F}\mathsf{G}\,\mathit{green}$.** We would need a position from which $\mathit{green}$ holds **forever after**. But every position is followed by $s_a$, where $\mathit{green}$ is false. No such position — **false**.

**Step 6: Note the (a)/(c) contrast.** This path is the canonical witness that
$$\mathsf{G}\mathsf{F}\varphi \not\models \mathsf{F}\mathsf{G}\varphi.$$
Recurring forever (a) is strictly weaker than eventually becoming permanent (c). The valid direction is $\mathsf{F}\mathsf{G}\varphi \models \mathsf{G}\mathsf{F}\varphi$.

---

## E2. LTL on a branching system

Now let the light be non-deterministic: from $s_r$ it may go to $s_g$ **or** stay at $s_r$. Evaluate $\mathsf{F}\,\mathit{green}$ and state what LTL model checking asks.

### Solution

**Step 1: Enumerate the paths from $s_r$.** Infinitely many, including
- $\pi_1 = s_r, s_g, s_a, s_r, \dots$ (proceeds immediately)
- $\pi_2 = s_r, s_r, s_g, s_a, \dots$ (stays once)
- $\pi_\infty = s_r, s_r, s_r, \dots$ (stays forever)

**Step 2: Evaluate on individual paths.** On $\pi_1$ and $\pi_2$, $\mathit{green}$ eventually occurs, so $\mathsf{F}\,\mathit{green}$ holds. On $\pi_\infty$ it never occurs, so $\mathsf{F}\,\mathit{green}$ **fails**.

**Step 3: State the LTL model-checking question.** For a system $M$ and LTL formula $\varphi$, model checking asks whether $\varphi$ holds on **all** paths from the initial state:
$$M \models \varphi \iff \text{for every path } \pi \text{ from } s_0,\ \pi \models \varphi.$$

**Step 4: Answer.** Since $\pi_\infty$ falsifies it, $M \not\models \mathsf{F}\,\mathit{green}$. The path $\pi_\infty$ is a **counterexample** — and producing exactly such a witness is what makes model checking useful in practice.

**Step 5: Note the fairness point.** $\pi_\infty$ may be unrealistic — a real controller would not stall forever. Verification handles this with **fairness constraints**, restricting attention to paths that do not unfairly starve a transition. Under a fairness assumption excluding $\pi_\infty$, the property would hold.

**Step 6: Note the implicit quantifier.** LTL formulae contain **no path quantifier**; the "for all paths" is supplied by the model-checking problem itself. This is precisely what CTL makes explicit (E3), and it is why LTL cannot say "there exists a path…".

---

# Section B — CTL and expressiveness

## E3. Evaluate CTL formulae

On the branching system of E2, evaluate at $s_r$: (a) $\mathsf{EF}\,\mathit{green}$; (b) $\mathsf{AF}\,\mathit{green}$; (c) $\mathsf{AG}\,\mathsf{EF}\,\mathit{green}$.

### Solution

**Step 1: Recall the syntax rule.** In CTL every temporal operator is **immediately preceded by a path quantifier**: $\mathsf{A}$ (all paths) or $\mathsf{E}$ (some path). So $\mathsf{EF}$, $\mathsf{AF}$, $\mathsf{AG}$, $\mathsf{EX}$, and so on are the legal combinations.

**Step 2: (a) $\mathsf{EF}\,\mathit{green}$.** Is there **some** path from $s_r$ on which $\mathit{green}$ eventually holds? Yes — $\pi_1$. **True**.

**Step 3: (b) $\mathsf{AF}\,\mathit{green}$.** Does **every** path eventually reach $\mathit{green}$? No — $\pi_\infty$ never does. **False**.

**Step 4: (c) $\mathsf{AG}\,\mathsf{EF}\,\mathit{green}$.** Read it as: on all paths, at every state, it is *still possible* to reach green. Check each reachable state:
- $s_r$: $\mathsf{EF}\,\mathit{green}$ ✓ (by (a))
- $s_g$: green holds here, so ✓
- $s_a$: $s_a \to s_r \to s_g$ ✓

Every reachable state satisfies $\mathsf{EF}\,\mathit{green}$, so — **true**.

**Step 5: Interpret (c).** This is the standard **non-starvation / resettability** pattern: whatever happens, the good state remains reachable. Note it is much weaker than (b) — it promises possibility, not inevitability.

**Step 6: Note the key difference from LTL.** LTL formulae are evaluated over **paths**; CTL formulae over **states**, with quantification over the paths leaving each state. That is why CTL can express (a) and (c) at all, and why LTL's implicit universal quantification cannot.

---

## E4. A property expressible in CTL but not LTL

Show that $\mathsf{AG}\,\mathsf{EF}\,p$ has no LTL equivalent, and give an LTL property with no CTL equivalent.

### Solution

**Step 1: State what $\mathsf{AG}\,\mathsf{EF}\,p$ says.** From every reachable state, **some** continuation reaches $p$.

**Step 2: Explain why LTL cannot say it.** An LTL formula is evaluated on a single path and the model-checking problem quantifies **universally** over paths. There is no way to assert the *existence* of an alternative path from a state reached along the current one — LTL cannot refer to the branching structure at all.

**Step 3: Give the standard separating argument.** Two systems can have **exactly the same set of paths** yet different branching structure. LTL, depending only on the path set, cannot distinguish them; $\mathsf{AG}\,\mathsf{EF}\,p$ can. Hence no LTL formula is equivalent.

**Step 4: Give the converse — an LTL property with no CTL equivalent.** The fairness property
$$\mathsf{F}\mathsf{G}\,p$$
has no CTL equivalent. The natural candidate $\mathsf{AF}\,\mathsf{AG}\,p$ is **strictly stronger**: it demands that on every path a state is reached from which $p$ holds on *all* continuations, whereas $\mathsf{F}\mathsf{G}\,p$ only requires stabilisation **along each path individually**.

**Step 5: Conclude.** Neither logic subsumes the other — their expressive powers are **incomparable**. CTL adds path quantification; LTL allows unrestricted nesting of temporal operators along a path, which CTL's syntax forbids.

**Step 6: Name the union.** **CTL\*** removes CTL's requirement that each temporal operator carry its own path quantifier, and so subsumes both LTL and CTL. The cost is higher model-checking complexity — CTL is linear in the formula and model size, LTL is exponential in the formula, and CTL\* is at least as hard as LTL. The familiar expressiveness-versus-cost trade.

---

# Section C — ATL

## E5. Read and apply the ATL strategic operator

Two robots must move a carriage that needs both to push. Express in ATL: (a) robot 1 alone can guarantee the carriage moves; (b) the two together can guarantee it. Evaluate both.

### Solution

**Step 1: State the operator.** ATL replaces path quantifiers with a **coalition** modality
$$\langle\!\langle A \rangle\!\rangle \varphi$$
meaning: the coalition $A$ has a **strategy** ensuring $\varphi$, **whatever the agents outside $A$ do**.

**Step 2: (a) Write it.**
$$\langle\!\langle \{r_1\} \rangle\!\rangle \mathsf{F}\,\mathit{moved}$$

**Step 3: Evaluate (a).** Moving requires both robots to push. Whatever $r_1$ does, $r_2$ may refuse, in which case the carriage does not move. So $r_1$ has no strategy that works against all behaviours of $r_2$ — **false**.

**Step 4: (b) Write it.**
$$\langle\!\langle \{r_1, r_2\} \rangle\!\rangle \mathsf{F}\,\mathit{moved}$$

**Step 5: Evaluate (b).** The coalition contains every agent, so there is no adversary. The joint strategy "both push" achieves $\mathit{moved}$ — **true**.

**Step 6: Note what ATL adds.** CTL's $\mathsf{E}$ asks whether a path *exists*; it does not ask **who can bring it about**. $\langle\!\langle A \rangle\!\rangle$ asks whether a *specific coalition* can force an outcome against arbitrary opposition. That distinction — ability versus mere possibility — is what makes ATL the right logic for multi-agent systems.

**Step 7: Relate to the CTL fragments.** $\langle\!\langle \emptyset \rangle\!\rangle \varphi$ corresponds to $\mathsf{A}\varphi$ (no agent cooperates, so $\varphi$ must hold however everyone acts), and $\langle\!\langle \mathit{All} \rangle\!\rangle \varphi$ corresponds to $\mathsf{E}\varphi$ (everyone cooperates, so it suffices that some path exists). The interesting cases are the **intermediate** coalitions, which CTL cannot express — the whole point of the logic.

**Step 8: Note the modelling caveat.** ATL as standardly presented assumes **perfect information** and **perfect recall**. With imperfect information a coalition may be *unable to act on* a strategy it formally possesses, and model checking becomes considerably harder — which is why logics such as ATL with imperfect information, and frameworks like Modular Interpreted Systems, are introduced for realistic multi-agent verification.
