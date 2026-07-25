---
subject: COMP64401
chapter: 73
title: "Datalog — Extra Exercises"
language: en
---

# Datalog — Extra Exercise Set

A second layer of problems on top of chapter 53, focused on the safety condition, computing least models by forward chaining, entailment, and the expressiveness boundary.

**Prerequisite.** A Datalog rule has the form $H \leftarrow B_1, \dots, B_n$ where $H$ and each $B_i$ are atoms over variables, individuals, and predicates. A fact is a rule with an empty body and a ground head. Variables are read as universally quantified over the whole rule.

## Exercise types

1. **Syntax and safety** — decide whether a rule is well-formed Datalog.
2. **Herbrand base construction** — enumerate the ground atoms.
3. **Forward chaining** — compute the least model iteratively.
4. **Entailment** — decide $P \models \alpha$ and justify.
5. **Substitution application** — instantiate a rule correctly.
6. **Expressiveness** — identify what Datalog cannot state.

---

# Section A — Syntax, safety, substitution

## E1. Which rules are legal Datalog?

Classify each, and for illegal ones name the violated condition.

(a) $\mathsf{anc}(x,y) \leftarrow \mathsf{par}(x,y)$
(b) $\mathsf{anc}(x,z) \leftarrow \mathsf{par}(x,y)$
(c) $\mathsf{par}(\mathsf{ann},\mathsf{bob}) \leftarrow$
(d) $\mathsf{cold}(x) \leftarrow \mathsf{wet}(x), \mathsf{windy}(x)$

### Solution

**Step 1: Recall the safety condition.** Every variable occurring in the **head** must also occur in the **body**. Equivalently, no fresh variables in the head.

**Step 2: (a).** Head variables $\{x,y\}$; body variables $\{x,y\}$. Head $\subseteq$ body ✓ — **legal**.

**Step 3: (b).** Head variables $\{x,z\}$; body variables $\{x,y\}$. The variable $z$ appears in the head but **not** in the body — **illegal**, violating safety.

**Step 4: Explain why (b) must be rejected.** Variables are universally quantified, so (b) asserts: for all $x,y,z$, if $\mathsf{par}(x,y)$ then $\mathsf{anc}(x,z)$. With $z$ unconstrained, one parent fact would derive $\mathsf{anc}(x,z)$ for **every** $z$ in the domain. The conclusion is unbounded by the data, so derived facts would not be determined by the given individuals.

**Step 5: (c).** No variables at all; the head is ground and the body empty. This is a **fact** — **legal**.

**Step 6: (d).** Head variables $\{x\}$; body variables $\{x\}$ ✓ — **legal**. Multiple body atoms are conjoined.

**Answer.** (a), (c), (d) legal; (b) illegal (unsafe).

---

## E2. Apply a substitution

Given the rule $r = \mathsf{anc}(x,z) \leftarrow \mathsf{par}(x,y), \mathsf{anc}(y,z)$ and the substitution $\sigma = \{x \mapsto \mathsf{ann},\ y \mapsto \mathsf{bob},\ z \mapsto \mathsf{cal}\}$, compute $r\sigma$. Then state what must hold for the instance to fire.

### Solution

**Step 1: Apply $\sigma$ uniformly** — every occurrence of each variable is replaced, in head and body alike:
$$r\sigma = \mathsf{anc}(\mathsf{ann},\mathsf{cal}) \leftarrow \mathsf{par}(\mathsf{ann},\mathsf{bob}),\ \mathsf{anc}(\mathsf{bob},\mathsf{cal}).$$

**Step 2: Check groundness.** No variables remain, so $r\sigma$ is a **ground instance** of $r$.

**Step 3: State the firing condition.** The instance contributes its head only if **every** body atom is already established:
$$\mathsf{par}(\mathsf{ann},\mathsf{bob}) \text{ and } \mathsf{anc}(\mathsf{bob},\mathsf{cal}) \text{ both hold} \implies \mathsf{anc}(\mathsf{ann},\mathsf{cal}) \text{ holds.}$$

**Step 4: Note the consistency requirement.** A substitution must map each variable to **one** term throughout. Replacing the first $z$ by $\mathsf{cal}$ and the second by something else is not a substitution, and the resulting "instance" would be meaningless.

**Step 5: Relate to satisfaction.** An interpretation satisfies $r$ iff it satisfies **every** ground instance $r\sigma$. This is what "variables are universally quantified" amounts to operationally.

---

## E3. Herbrand base

For the program with individuals $\{\mathsf{a},\mathsf{b}\}$ and predicates $\mathsf{p}$ (unary), $\mathsf{q}$ (binary), enumerate the Herbrand base and give its size.

### Solution

**Step 1: Recall the definition.** The Herbrand base is the set of **all ground atoms** formable from the program's predicates and individuals.

**Step 2: Unary predicate $\mathsf{p}$.** One argument, 2 choices:
$$\mathsf{p}(\mathsf{a}),\ \mathsf{p}(\mathsf{b}) \quad (2 \text{ atoms}).$$

**Step 3: Binary predicate $\mathsf{q}$.** Two argument positions, each with 2 choices, and order matters:
$$\mathsf{q}(\mathsf{a},\mathsf{a}),\ \mathsf{q}(\mathsf{a},\mathsf{b}),\ \mathsf{q}(\mathsf{b},\mathsf{a}),\ \mathsf{q}(\mathsf{b},\mathsf{b}) \quad (4 \text{ atoms}).$$

**Step 4: Total.** $2 + 4 = \boxed{6}$ ground atoms.

**Step 5: General formula.** With $|C|$ individuals and a predicate of arity $k$, that predicate contributes $|C|^k$ ground atoms; the base is the sum over all predicates:
$$|\mathcal{HB}| = \sum_{\text{predicates } \pi} |C|^{\mathrm{arity}(\pi)}.$$

**Step 6: Note the significance.** The Herbrand base is **finite** for any Datalog program (no function symbols, so no new terms can be built). Hence the least model is finite and forward chaining must terminate — the reason Datalog is decidable, unlike full first-order logic.

---

# Section B — Least models and entailment

## E4. Compute a least model by forward chaining

$$P = \{\ \mathsf{par}(\mathsf{a},\mathsf{b}),\ \ \mathsf{par}(\mathsf{b},\mathsf{c}),\ \ \mathsf{anc}(x,y) \leftarrow \mathsf{par}(x,y),\ \ \mathsf{anc}(x,z) \leftarrow \mathsf{par}(x,y), \mathsf{anc}(y,z)\ \}$$

Compute the least model.

### Solution

**Step 1: Round 0 — the facts.**
$$M_0 = \{\mathsf{par}(\mathsf{a},\mathsf{b}),\ \mathsf{par}(\mathsf{b},\mathsf{c})\}.$$

**Step 2: Round 1 — fire rule 3** ($\mathsf{anc}(x,y) \leftarrow \mathsf{par}(x,y)$) on each parent fact:
- $\sigma = \{x \mapsto \mathsf{a}, y \mapsto \mathsf{b}\}$ gives $\mathsf{anc}(\mathsf{a},\mathsf{b})$.
- $\sigma = \{x \mapsto \mathsf{b}, y \mapsto \mathsf{c}\}$ gives $\mathsf{anc}(\mathsf{b},\mathsf{c})$.

Rule 4 cannot fire yet — no $\mathsf{anc}$ atoms were available at the start of the round.
$$M_1 = M_0 \cup \{\mathsf{anc}(\mathsf{a},\mathsf{b}),\ \mathsf{anc}(\mathsf{b},\mathsf{c})\}.$$

**Step 3: Round 2 — fire rule 4** ($\mathsf{anc}(x,z) \leftarrow \mathsf{par}(x,y), \mathsf{anc}(y,z)$). Seek a $\mathsf{par}$ atom and an $\mathsf{anc}$ atom that chain:
- $\mathsf{par}(\mathsf{a},\mathsf{b})$ with $\mathsf{anc}(\mathsf{b},\mathsf{c})$, i.e. $\sigma = \{x \mapsto \mathsf{a}, y \mapsto \mathsf{b}, z \mapsto \mathsf{c}\}$, gives $\mathsf{anc}(\mathsf{a},\mathsf{c})$.
- $\mathsf{par}(\mathsf{b},\mathsf{c})$ with an $\mathsf{anc}(\mathsf{c},\cdot)$ atom — none exists.

$$M_2 = M_1 \cup \{\mathsf{anc}(\mathsf{a},\mathsf{c})\}.$$

**Step 4: Round 3 — check for closure.** Rule 3 yields nothing new. Rule 4 needs $\mathsf{anc}(\mathsf{c},\cdot)$ to extend further; there is none. No rule produces a new atom, so we have reached a **fixpoint**.

**Step 5: State the least model.**
$$M = \{\mathsf{par}(\mathsf{a},\mathsf{b}),\ \mathsf{par}(\mathsf{b},\mathsf{c}),\ \mathsf{anc}(\mathsf{a},\mathsf{b}),\ \mathsf{anc}(\mathsf{b},\mathsf{c}),\ \mathsf{anc}(\mathsf{a},\mathsf{c})\}$$
— five atoms.

**Step 6: Sanity-check against intuition.** $\mathsf{anc}$ is the transitive closure of $\mathsf{par}$ over the chain $\mathsf{a} \to \mathsf{b} \to \mathsf{c}$: the pairs are $(\mathsf{a},\mathsf{b})$, $(\mathsf{b},\mathsf{c})$, $(\mathsf{a},\mathsf{c})$ ✓.

**Step 7: Note why "least" matters.** The set containing *every* ground atom also satisfies $P$, but it is not least. The least model contains exactly what the program **forces** — which is why it is the right notion of what a program says.

---

## E5. Entailment and non-entailment

Using $P$ and $M$ from E4, decide: (a) $P \models \mathsf{anc}(\mathsf{a},\mathsf{c})$; (b) $P \models \mathsf{anc}(\mathsf{c},\mathsf{a})$; (c) $P \models \mathsf{par}(\mathsf{a},\mathsf{c})$.

### Solution

**Step 1: State the criterion.** For a ground atom $\alpha$, $P \models \alpha$ iff $\alpha$ belongs to the **least model** of $P$. (Because the least model is contained in every model, membership there is exactly what holds in all models.)

**Step 2: (a).** $\mathsf{anc}(\mathsf{a},\mathsf{c}) \in M$ ✓, derived in round 2. So $P \models \mathsf{anc}(\mathsf{a},\mathsf{c})$ — **yes**.

**Step 3: (b).** $\mathsf{anc}(\mathsf{c},\mathsf{a}) \notin M$. So $P \not\models \mathsf{anc}(\mathsf{c},\mathsf{a})$ — **no**. Nothing makes $\mathsf{anc}$ symmetric; the rules propagate strictly forward along $\mathsf{par}$.

**Step 4: (c).** $\mathsf{par}(\mathsf{a},\mathsf{c}) \notin M$ — **no**. $\mathsf{par}$ appears only in rule bodies and in the two given facts, so no rule ever derives a new $\mathsf{par}$ atom. Ancestry is transitive; parenthood is not.

**Step 5: Note the closed-world reading.** $P \not\models \alpha$ means $\alpha$ is not *derivable*. Under the least-model (closed-world) semantics used here, non-derivable ground atoms are taken to be false — which is why the least model can be read as a complete answer set. Contrast the open-world reading in description logic, where "not entailed" leaves the matter genuinely open.

---

## E6. A program where rounds interleave

$$P' = \{\ \mathsf{e}(1,2),\ \mathsf{e}(2,3),\ \mathsf{e}(3,1),\ \ \mathsf{r}(x,y) \leftarrow \mathsf{e}(x,y),\ \ \mathsf{r}(x,z) \leftarrow \mathsf{r}(x,y), \mathsf{r}(y,z)\ \}$$

Compute the least model's $\mathsf{r}$ atoms and explain why it terminates despite the cycle.

### Solution

**Step 1: Round 1 — base rule.** From the three edges:
$$\mathsf{r}(1,2),\ \mathsf{r}(2,3),\ \mathsf{r}(3,1).$$

**Step 2: Round 2 — compose pairs.** Chain $\mathsf{r}(x,y)$ with $\mathsf{r}(y,z)$:
- $\mathsf{r}(1,2), \mathsf{r}(2,3) \Rightarrow \mathsf{r}(1,3)$
- $\mathsf{r}(2,3), \mathsf{r}(3,1) \Rightarrow \mathsf{r}(2,1)$
- $\mathsf{r}(3,1), \mathsf{r}(1,2) \Rightarrow \mathsf{r}(3,2)$

**Step 3: Round 3 — compose again.** Now available: all of $\mathsf{r}(1,2), \mathsf{r}(2,3), \mathsf{r}(3,1), \mathsf{r}(1,3), \mathsf{r}(2,1), \mathsf{r}(3,2)$. New compositions include
- $\mathsf{r}(1,2), \mathsf{r}(2,1) \Rightarrow \mathsf{r}(1,1)$
- $\mathsf{r}(2,3), \mathsf{r}(3,2) \Rightarrow \mathsf{r}(2,2)$
- $\mathsf{r}(3,1), \mathsf{r}(1,3) \Rightarrow \mathsf{r}(3,3)$

**Step 4: Round 4 — check closure.** We now have all $9$ pairs over $\{1,2,3\}$. Any further composition yields a pair already present, so this is the fixpoint.

**Step 5: State the answer.** $\mathsf{r}$ is the full relation $\{1,2,3\} \times \{1,2,3\}$ — all **9** atoms — because the edges form a cycle, making every node reachable from every node.

**Step 6: Explain termination.** The Herbrand base is finite: with $3$ individuals and binary $\mathsf{r}$, at most $3^2 = 9$ $\mathsf{r}$-atoms exist (plus $9$ possible $\mathsf{e}$-atoms). Forward chaining only **adds** atoms and can never exceed the base, so it must reach a fixpoint within finitely many rounds. The recursion through a cycle does not diverge because there are no function symbols to build new terms — the guarantee from E3, Step 6.

---

# Section C — Expressiveness and comparison

## E7. What Datalog cannot say

Explain why each is not expressible in pure Datalog, and name what is missing: (a) $x$ is not a parent; (b) everyone has a parent; (c) some person exists.

### Solution

**Step 1: (a).** Requires **negation** in the body ($\mathsf{notpar}(x) \leftarrow \neg\mathsf{par}(x,y)$). Pure Datalog rule bodies are conjunctions of **positive** atoms only. Missing: negation (added by extensions such as stratified negation, with care to keep a unique least model).

**Step 2: (b).** Requires asserting the **existence** of an unnamed parent for each individual. A rule head must be an atom over variables already in the body (safety), so it cannot introduce a new individual. Missing: existential quantification in the head — precisely what $\exists p.C$ gives in description logic.

**Step 3: (c).** Same obstacle: Datalog can only assert facts about **named** individuals. It cannot say "something exists" without naming it. Missing: existentials again.

**Step 4: Draw the comparison.** This is the complement of $\mathcal{EL}$'s limits (chapter 72, E8):

| | Datalog | $\mathcal{EL}$ |
|---|---|---|
| Recursion / transitive closure | **yes** | no |
| Existential in conclusion | no | **yes** ($\exists p.C$) |
| Negation | no | no |
| Arbitrary arity | **yes** | binary properties only |
| World assumption | closed | open |

**Step 5: State the lesson.** Neither logic dominates the other. Datalog buys recursion and $n$-ary predicates at the cost of existentials; $\mathcal{EL}$ buys existentials at the cost of recursion. Both drop negation to stay tractable — the recurring trade of expressiveness against reasoning cost.

---

## E8. Rules as Horn clauses

Show that $\mathsf{anc}(x,z) \leftarrow \mathsf{par}(x,y), \mathsf{anc}(y,z)$ is a Horn clause, and say why the Horn restriction guarantees a unique least model.

### Solution

**Step 1: Rewrite the rule as an implication.** A rule means "if the body then the head":
$$\big(\mathsf{par}(x,y) \land \mathsf{anc}(y,z)\big) \Rightarrow \mathsf{anc}(x,z).$$

**Step 2: Convert to clausal form.** Using $\alpha \Rightarrow \beta \equiv \neg\alpha \lor \beta$ and De Morgan:
$$\neg\big(\mathsf{par}(x,y) \land \mathsf{anc}(y,z)\big) \lor \mathsf{anc}(x,z) \;\equiv\; \neg\mathsf{par}(x,y) \lor \neg\mathsf{anc}(y,z) \lor \mathsf{anc}(x,z).$$

**Step 3: Check the Horn condition.** A Horn clause is a disjunction of literals with **at most one positive** literal. Here the literals are $\neg\mathsf{par}(x,y)$, $\neg\mathsf{anc}(y,z)$ (both negative) and $\mathsf{anc}(x,z)$ (positive) — exactly **one** positive ✓. So it is a Horn clause, and the positive literal is precisely the rule's head.

**Step 4: Explain the uniqueness of the least model.** The key property: Horn clauses are closed under intersection of models. If $M_1$ and $M_2$ both satisfy a Horn clause set, so does $M_1 \cap M_2$. Hence the intersection of *all* models is itself a model, and it is contained in every model — so it is **the** least model, and it is unique.

**Step 5: Show where a non-Horn clause breaks this.** Take the disjunction $p \lor q$ (two positive literals, not Horn). It has models $\{p\}$ and $\{q\}$, but their intersection $\emptyset$ satisfies neither disjunct — not a model. So there is no least model, and no single set of derived facts represents what the program says.

**Step 6: Connect to the semantics used.** Because Datalog is Horn, "what the program entails" is well defined as membership in one canonical model, computable by forward chaining (E4). This is exactly why disjunction and negation are excluded — admitting them would forfeit the unique least model that makes the semantics and the algorithm agree.
