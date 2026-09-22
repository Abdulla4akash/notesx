---
subject: COMP64602
chapter: 76
title: "Week 6 — Extra Exercises"
language: en
---

# Week 6 — Agent Communication and Commitments: Extra Exercise Set

A second layer on top of chapter 56, focused on commitment lifecycles, why commitment protocols beat rigid message orderings, and reading FSM and sequence-diagram specifications.

## Exercise types

1. **Speech-act classification** — identify the performative and its effect.
2. **Commitment notation** — write and read a commitment.
3. **Lifecycle tracing** — track a commitment's state through operations.
4. **Protocol critique** — compare FSM protocols with commitment protocols.
5. **Dialogue-game reasoning** — apply argument-game rules.

---

# Section A — Communication and speech acts

## E1. Why message passing needs more than syntax

An agent receives the string `deliver(book, tomorrow)`. Explain why this is insufficient for coordination and what an ACL adds.

### Solution

**Step 1: Identify the ambiguity.** The content is clear but the **intent** is not. It could be a request to deliver, a promise to deliver, a question about delivery, or an assertion that delivery happened. Each demands a different response.

**Step 2: Name what is missing.** The **performative** (illocutionary force) — what the sender is *doing* in sending the message, as distinct from what the message says.

**Step 3: State what an ACL supplies.** An agent communication language separates the performative from the content, so the message becomes

```
(request
  :sender    customer
  :receiver  store
  :content   (deliver book tomorrow)
  :language  ...
  :ontology  ...)
```

**Step 4: List the fields that matter and why.** `performative` fixes the intent; `sender`/`receiver` fix the participants; `content` carries the proposition; `language` and `ontology` fix how the content is to be parsed and interpreted — without a shared ontology, agents may both parse `book` and mean different things.

**Step 5: Name common FIPA ACL performatives.** `inform`, `request`, `agree`, `refuse`, `propose`, `accept-proposal`, `reject-proposal`, `query-if`, `not-understood`, `failure`.

**Step 6: State the theoretical grounding.** This is **speech act theory**: an utterance both says something (locution) and does something (illocution). Coordination requires the doing, not just the saying — which is why ACLs make the performative a first-class field rather than something to be inferred.

---

## E2. Classify performatives and state their effects

For each, name a suitable FIPA performative and the effect on the recipient's state: (a) telling a peer the price is £10; (b) asking a peer to ship an item; (c) declining that request; (d) asking whether an item is in stock.

### Solution

**Step 1: (a) `inform`.** Effect: the recipient may adopt the belief that the price is £10, subject to trusting the sender. It creates a **belief**, not an obligation.

**Step 2: (b) `request`.** Effect: the recipient is asked to adopt a goal. Crucially it does **not** by itself create an obligation — the recipient may `agree` or `refuse`. Only an `agree` creates a commitment.

**Step 3: (c) `refuse`.** Effect: the sender learns the goal will not be adopted, and no commitment arises. This closes the interaction branch cleanly, which is why explicit refusal is part of the protocol rather than mere silence.

**Step 4: (d) `query-if`.** Effect: the recipient is asked to `inform` whether a proposition holds. The expected reply is an `inform`, not an `agree`.

**Step 5: Note the important asymmetry.** `inform` traffics in **beliefs**; `request`/`agree` traffic in **commitments**. Conflating them is the standard error: receiving a `request` obliges nothing, and an agent that treats requests as obligations has no autonomy — which defeats the purpose of modelling it as an agent.

---

# Section B — Commitments

## E3. Write and trace a commitment

Express *"the store commits to the customer to deliver the book if payment is made"* in commitment notation, then trace its lifecycle when the customer pays and the store delivers.

### Solution

**Step 1: Recall the notation.** A conditional commitment is written
$$C(\mathit{debtor},\ \mathit{creditor},\ \mathit{antecedent},\ \mathit{consequent})$$
meaning the debtor is committed to the creditor to bring about the consequent **if** the antecedent holds.

**Step 2: Instantiate.**
$$C(\mathsf{store},\ \mathsf{customer},\ \mathsf{paid},\ \mathsf{delivered})$$

**Step 3: State the initial state.** On creation the commitment is **conditional** (sometimes called *active/unresolved*): nothing is owed yet, because the antecedent has not been satisfied.

**Step 4: Customer pays.** $\mathsf{paid}$ becomes true, so the antecedent is discharged. The conditional commitment is **detached**, becoming the unconditional
$$C(\mathsf{store},\ \mathsf{customer},\ \top,\ \mathsf{delivered}).$$
The store now genuinely owes delivery.

**Step 5: Store delivers.** $\mathsf{delivered}$ becomes true, so the commitment is **discharged** — satisfied and no longer outstanding.

**Step 6: Summarise the trace.**
$$\text{conditional} \xrightarrow{\ \mathsf{paid}\ } \text{detached (unconditional)} \xrightarrow{\ \mathsf{delivered}\ } \text{discharged}$$

**Step 7: Note the key property.** The commitment's state is determined by **what has been brought about**, not by which messages were sent in which order. That is precisely what makes commitment protocols flexible (E5).

---

## E4. Commitment operations

Name the standard operations on commitments and say who may perform each. Then state what happens if the store never delivers after payment.

### Solution

**Step 1: List the operations.**

| Operation | Performed by | Effect |
|---|---|---|
| **Create** | debtor | brings the commitment into being |
| **Discharge** | debtor | consequent achieved; commitment satisfied |
| **Cancel** | debtor | debtor withdraws (usually a violation) |
| **Release** | creditor | creditor excuses the debtor; no violation |
| **Delegate** | debtor | transfers debtor role to another agent |
| **Assign** | creditor | transfers creditor role to another agent |

**Step 2: Note the role asymmetry.** Only the **debtor** may cancel or delegate; only the **creditor** may release or assign. This is not arbitrary — it reflects who bears the obligation and who holds the entitlement. A creditor cannot cancel someone else's obligation, and a debtor cannot excuse itself by "releasing" its own commitment.

**Step 3: Answer the non-delivery case.** After payment the commitment is detached and unconditional. If $\mathsf{delivered}$ is never brought about, the commitment is **violated**.

**Step 4: State why this is valuable.** Violation is **detectable from the commitment state alone**, without reference to message ordering. There is an objective, machine-checkable notion of who failed and what they failed to do.

**Step 5: Contrast with release.** Had the customer **released** the store, no violation would arise even with no delivery — the obligation was extinguished by the entitled party. Distinguishing cancel (debtor, violating) from release (creditor, non-violating) is a standard exam discrimination.

---

## E5. FSM protocols versus commitment protocols

An e-commerce protocol is specified as an FSM requiring exactly: `request` → `quote` → `pay` → `deliver`. Give two legitimate interactions this wrongly rejects, and explain how a commitment protocol admits them.

### Solution

**Step 1: State how an FSM protocol constrains.** It enumerates **legal message sequences**. Any interaction whose message order differs from a path through the machine is non-compliant, regardless of outcome.

**Step 2: Rejected interaction 1 — paying early.** A returning customer already knows the price and sends `pay` before receiving a `quote`. The FSM has no transition for `pay` in the post-`request` state, so this is rejected — even though the commercial outcome is exactly as intended.

**Step 3: Rejected interaction 2 — delivering before payment.** A trusted customer is sent the goods first and invoiced after. The outcome satisfies everyone, but the message order violates the machine.

**Step 4: Give further examples.** Batching a quote and delivery into one message; interleaving two purchases over one channel; a third party paying on the customer's behalf. All are commercially normal and all break a rigid sequence.

**Step 5: Explain the commitment protocol's treatment.** It specifies **what must hold**, not the order of messages:
$$C(\mathsf{store}, \mathsf{customer}, \mathsf{paid}, \mathsf{delivered})$$
Compliance means no commitment is violated. Any message order that discharges the commitments is legal, so all the interactions above comply — early payment simply detaches the commitment sooner.

**Step 6: State the trade-off honestly.** FSMs are simple, and compliance is checkable by inspecting the trace against the machine. Commitment protocols require reasoning about states and about what has been brought about, which is more work. The gain is **flexibility with a meaningful compliance notion**: agents retain autonomy over *how* to fulfil obligations, and violation remains objectively detectable.

**Step 7: Note the modelling lesson.** Over-specifying a protocol as a message sequence **conflates the goal with one way of reaching it** — the recurring error in protocol design, and the reason commitments are introduced.

---

# Section C — Argument and dialogue games

## E6. Trace an argument game

Two agents dispute a claim. The proponent asserts $P$; the opponent attacks with $Q$ (which defeats $P$); the proponent attacks $Q$ with $R$ (which defeats $Q$) and the opponent has no further move. Who wins, and what does this show?

### Solution

**Step 1: State the game shape.** An argument game alternates moves: the proponent advances an argument, the opponent attacks, the proponent counter-attacks. A player unable to move **loses**.

**Step 2: Trace the moves.**
1. Proponent: $P$.
2. Opponent: $Q$, defeating $P$.
3. Proponent: $R$, defeating $Q$.
4. Opponent: no move available.

**Step 3: Determine the outcome.** The opponent cannot move, so the **proponent wins** and $P$ is defensible in this dispute.

**Step 4: Explain why $P$ survives despite being defeated.** $P$ was attacked by $Q$, but $Q$ is itself defeated by $R$. So $P$ is **reinstated** — defended by $R$. Being attacked is not the same as being defeated overall.

**Step 5: Connect to argumentation semantics.** This is the proof-theoretic counterpart of **admissibility**: a set of arguments is admissible if it is conflict-free and defends each of its members against all attackers. Here $\{P, R\}$ defends $P$ by countering $Q$. The game is a procedural way of establishing membership in an acceptable set without computing all extensions.

**Step 6: Note the burden of proof.** The proponent must have an answer to **every** attack; the opponent needs only **one** successful attack that goes unanswered. This asymmetry mirrors entailment versus refutation throughout both KR&R units — one counterexample suffices to refute, whereas establishing a claim requires covering all cases.
