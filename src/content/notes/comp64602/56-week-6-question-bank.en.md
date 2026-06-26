---
subject: COMP64602
chapter: 56
title: "Week 6 — Question Bank"
language: en
---

# COMP64602 Week 6 Worked Question Bank

**Topic:** Agent communication, interaction protocols, commitments, and argument/dialogue games  
**Source:** Uploaded Week 6 lecture sheet  
**Use:** Cover each solution block, attempt the question, then reveal/check the worked method.

## Task types identified from the sheet

The lecture sheet contains these examinable/procedural task types:

1. **Reading sequence diagrams:** identify participants, sender/receiver, top-to-bottom ordering, and allowed traces from `alt` branches.
2. **Checking traces against a protocol diagram:** decide whether a message sequence is allowed and identify the first point of failure.
3. **Representing and running finite-state machines:** use the tuple $\langle \Sigma, S, s_0, \delta, F \rangle$, follow transitions, detect undefined transitions, and check final states.
4. **Tracking commitments:** represent $C(debtor, creditor, antecedent, consequent)$, detect detachment, and detect discharge.
5. **Applying commitment operations:** `CREATE`, `CANCEL`, `RELEASE`, `DELEGATE`, `ASSIGN`, and `DECLARE`; identify who performs the operation and what commitment state changes.
6. **Checking commitment-based protocol enactments:** map each message to a commitment operation and track which commitments are active, detached, or discharged.
7. **Comparing rigid message-order protocols with commitment protocols:** explain why a sequence may fail an FSM/sequence-diagram protocol but still make sense under a commitment semantics.
8. **Building argument/dispute structures:** construct argument graphs incrementally, turn graph cycles into dispute-tree branches, identify disputes, strategies, and winning-strategy failures.
9. **Using dialogue-game moves:** classify `claim(φ)`, `why(φ)`, and `φ since ψ`; identify what each move attacks or answers.
10. **Applying protocol desiderata:** check whether a design is understandable, modifiable, composable, loosely coupled, flexible, precise, and observable/checkable.

> **Notation note.** The lecture sheet has a couple of recorded/slide inconsistencies. In this bank, I use `Update(s,b)` consistently for the seller-to-buyer update in the simple FSM, and I use `paid(Price)` for payment facts in the e-commerce commitment protocol.

---

# Section A — Mechanical / single-step drills

## Q1. Sequence diagram: identify sender, receiver, and order

A sequence diagram has two lifelines, `A` and `B`. The diagram contains the following arrows from top to bottom:

1. `A → B: request(x)`
2. `B → A: agree(x)`
3. `B → A: inform-done(x)`

How should you read this interaction?

<details>
<summary>Worked solution</summary>

**Step 1: Identify lifelines.**  
The vertical lifelines are the participants: `A` and `B`.

**Step 2: Read top to bottom.**  
Earlier arrows are higher; later arrows are lower.

**Step 3: Interpret each arrow.**

- `A → B: request(x)` means `A` sends `request(x)` to `B`.
- `B → A: agree(x)` means `B` sends `agree(x)` to `A`.
- `B → A: inform-done(x)` means `B` sends `inform-done(x)` to `A`.

**Answer:** `A` requests `x`; `B` agrees; then `B` reports that the task is done.

</details>

---

## Q2. FIPA-style sequence diagram: is this trace allowed?

A FIPA-style request protocol has this structure:

1. `Initiator → Participant: Request`
2. Then either:
   - `Participant → Initiator: Refuse`, or
   - `Participant → Initiator: Agree`, followed by one of:
     - `Fail`
     - `Inform-done`
     - `Inform-result`

Is the trace below allowed?

```text
Request, Agree, Inform-result
```

<details>
<summary>Worked solution</summary>

**Step 1: Start at the first required message.**  
The protocol starts with `Request`, so the first message is correct.

**Step 2: Choose the outer branch.**  
After `Request`, the participant may either `Refuse` or `Agree`. The trace has `Agree`, so it chooses the agreement branch.

**Step 3: Check the nested branch after agreement.**  
After `Agree`, the participant may send `Fail`, `Inform-done`, or `Inform-result`.

**Step 4: Match the final message.**  
The trace has `Inform-result`, which is one of the allowed nested outcomes.

**Answer:** Yes. `Request, Agree, Inform-result` is allowed.

</details>

---

## Q3. FIPA-style sequence diagram: find the first illegal point

Using the same FIPA-style request protocol, is this trace allowed?

```text
Request, Inform-done
```

<details>
<summary>Worked solution</summary>

**Step 1: Check the first message.**  
`Request` is correct; the protocol begins with a request.

**Step 2: Check what may happen immediately after `Request`.**  
After `Request`, the participant may send either:

- `Refuse`, or
- `Agree`.

**Step 3: Compare the observed second message.**  
The observed second message is `Inform-done`.

**Step 4: Locate the error.**  
`Inform-done` is only allowed after `Agree`; it is not allowed immediately after `Request`.

**Answer:** The trace is invalid at message 2. It skips the required `Agree` branch before `Inform-done`.

</details>

---

## Q4. FSM single-message check: does the trace end correctly?

Consider the simple seller-buyer FSM:

```text
States: S0, S1, S2, S3
Initial state: S0
Final states: {S1, S3}
Transitions:
S0 --Offer(s,b)--> S1
S1 --Accept(b,s)--> S2
S1 --Reject(b,s)--> S3
S2 --Update(s,b)--> S1
```

Check the trace:

```text
Offer(s,b)
```

<details>
<summary>Worked solution</summary>

**Step 1: Start at the initial state.**  
`current = S0`.

**Step 2: Read the first message.**  
The message is `Offer(s,b)`.

**Step 3: Apply the transition function.**  
The FSM defines:

```text
δ(S0, Offer(s,b)) = S1
```

So update:

```text
current = S1
```

**Step 4: Check whether communication stops in a final state.**  
The final states are `{S1, S3}`. Since `S1 ∈ F`, stopping here is correct.

**Answer:** The trace is valid and ends correctly in final state `S1`.

</details>

---

## Q5. FSM undefined transition: why does this fail?

Using the same seller-buyer FSM, check the trace:

```text
Accept(b,s)
```

<details>
<summary>Worked solution</summary>

**Step 1: Start at the initial state.**  
`current = S0`.

**Step 2: Read the first message.**  
The message is `Accept(b,s)`.

**Step 3: Ask whether the transition is defined.**  
We need:

```text
δ(S0, Accept(b,s))
```

But from `S0`, the only defined transition is:

```text
δ(S0, Offer(s,b)) = S1
```

**Step 4: Apply the partial-transition rule.**  
If `δ(current, message)` is undefined, the protocol enactment fails.

**Answer:** The trace fails immediately. `Accept(b,s)` is not defined from `S0`.

</details>

---

## Q6. FSM non-final stopping: why is this not a correct ending?

Using the same seller-buyer FSM, check the trace:

```text
Offer(s,b), Accept(b,s)
```

<details>
<summary>Worked solution</summary>

**Step 1: Start at the initial state.**  
`current = S0`.

**Step 2: Process `Offer(s,b)`.**

```text
δ(S0, Offer(s,b)) = S1
```

So `current = S1`.

**Step 3: Process `Accept(b,s)`.**

```text
δ(S1, Accept(b,s)) = S2
```

So `current = S2`.

**Step 4: Check whether communication stops in a final state.**  
The final states are `{S1, S3}`.

`S2` is not final.

**Answer:** No undefined transition occurs, but the trace does not end correctly because it stops in non-final state `S2`.

</details>

---

## Q7. Commitment detachment: what happens when the antecedent becomes true?

Suppose this commitment exists:

```text
C(Store, Customer, paid(P), delivered(I))
```

Now `paid(P)` becomes true, but `delivered(I)` is not yet true. What is the commitment status?

<details>
<summary>Worked solution</summary>

**Step 1: Identify the antecedent and consequent.**

```text
Antecedent = paid(P)
Consequent = delivered(I)
```

**Step 2: Check the antecedent.**  
`paid(P)` is true.

**Step 3: Check the consequent.**  
`delivered(I)` is not yet true.

**Step 4: Apply the detachment rule.**  
A commitment is detached when the antecedent holds and the consequent does not yet hold.

So:

```text
C(Store, Customer, paid(P), delivered(I))
```

becomes, effectively:

```text
C(Store, Customer, ⊤, delivered(I))
```

**Answer:** The commitment is detached. The store is now actively obliged to bring about `delivered(I)`.

</details>

---

## Q8. Commitment discharge: what happens when the consequent becomes true?

Suppose this detached commitment exists:

```text
C(Store, Customer, ⊤, delivered(I))
```

Now `delivered(I)` becomes true. What happens?

<details>
<summary>Worked solution</summary>

**Step 1: Identify the consequent.**  
The consequent is:

```text
delivered(I)
```

**Step 2: Check whether the consequent holds.**  
The question says `delivered(I)` becomes true.

**Step 3: Apply the discharge rule.**  
A commitment is discharged when its consequent holds.

**Answer:** The commitment is discharged. The store has fulfilled the commitment.

</details>

---

## Q9. Commitment operation: creditor waives the obligation

There is a commitment:

```text
C(x, y, r, u)
```

Agent `y` says that `x` no longer needs to bring about `u`. Which operation is this, who performs it, and what is the effect?

<details>
<summary>Worked solution</summary>

**Step 1: Identify roles.**

In:

```text
C(x, y, r, u)
```

- `x` is the debtor.
- `y` is the creditor.

**Step 2: Match the described action.**  
The creditor is releasing the debtor from the commitment.

**Step 3: Choose the operation.**  
This is:

```text
RELEASE(x, y, r, u)
```

**Step 4: State who performs it.**  
`RELEASE` is performed by the creditor, so it is performed by `y`.

**Step 5: State the effect.**  
The commitment:

```text
C(x, y, r, u)
```

no longer holds.

**Answer:** `RELEASE(x,y,r,u)`, performed by `y`; it removes `C(x,y,r,u)`.

</details>

---

## Q10. Dialogue game move: answering a bare claim

An agent states:

```text
claim(φ)
```

Another agent wants to challenge the claim by asking for justification. What move should it make? If the first agent has a reason `ψ` such that `ψ ⇒ φ`, how can it answer?

<details>
<summary>Worked solution</summary>

**Step 1: Identify the move being attacked.**  
The first agent made a bare claim:

```text
claim(φ)
```

**Step 2: Choose the challenge move.**  
A request for justification is:

```text
why(φ)
```

This attacks the bare claim of `φ`.

**Step 3: Choose the response move.**  
If the first agent has a reason `ψ` and knows that `ψ ⇒ φ`, it can answer with:

```text
φ since ψ
```

**Answer:** The challenger plays `why(φ)`. The original agent can answer with `φ since ψ`, provided `ψ ⇒ φ` is available.

</details>

---

# Section B — Multi-condition protocol checks

## Q11. Enumerate all allowed traces from the FIPA request protocol

The protocol is:

1. `Initiator → Participant: Request`
2. Then either:
   - `Participant → Initiator: Refuse`, or
   - `Participant → Initiator: Agree`, followed by exactly one of:
     - `Fail`
     - `Inform-done`
     - `Inform-result`

List all allowed high-level traces.

<details>
<summary>Worked solution</summary>

**Step 1: Start with the compulsory prefix.**  
Every valid trace starts with:

```text
Request
```

**Step 2: Expand the outer alternatives.**  
After `Request`, there are two outer branches:

```text
Refuse
Agree
```

**Step 3: Complete the refusal branch.**  
If the participant refuses, the trace is:

```text
Request, Refuse
```

**Step 4: Expand the agreement branch.**  
If the participant agrees, one nested outcome follows:

```text
Fail
Inform-done
Inform-result
```

So the agreement traces are:

```text
Request, Agree, Fail
Request, Agree, Inform-done
Request, Agree, Inform-result
```

**Answer:** The allowed traces are:

```text
Request, Refuse
Request, Agree, Fail
Request, Agree, Inform-done
Request, Agree, Inform-result
```

</details>

---

## Q12. Classify several FIPA request traces

Using the same FIPA-style request protocol, classify each trace as valid or invalid:

A. `Request, Refuse`  
B. `Request, Agree, Fail`  
C. `Request, Fail`  
D. `Agree, Inform-done`  
E. `Request, Agree, Inform-done`

<details>
<summary>Worked solution</summary>

**Step 1: Recall the legal traces.**

```text
Request, Refuse
Request, Agree, Fail
Request, Agree, Inform-done
Request, Agree, Inform-result
```

**Step 2: Check A.**

```text
Request, Refuse
```

This exactly matches the refusal branch.  
**A is valid.**

**Step 3: Check B.**

```text
Request, Agree, Fail
```

This matches the agreement-then-failure branch.  
**B is valid.**

**Step 4: Check C.**

```text
Request, Fail
```

`Fail` is only allowed after `Agree`, not immediately after `Request`.  
**C is invalid.**

**Step 5: Check D.**

```text
Agree, Inform-done
```

The protocol must start with `Request`, so this fails at the first message.  
**D is invalid.**

**Step 6: Check E.**

```text
Request, Agree, Inform-done
```

This matches the agreement-then-success-with-no-result branch.  
**E is valid.**

**Answer:** A valid, B valid, C invalid, D invalid, E valid.

</details>

---

## Q13. FSM with loop: does the trace end correctly?

Use the seller-buyer FSM:

```text
S0 --Offer(s,b)--> S1
S1 --Accept(b,s)--> S2
S1 --Reject(b,s)--> S3
S2 --Update(s,b)--> S1
F = {S1, S3}
```

Check this trace:

```text
Offer(s,b), Accept(b,s), Update(s,b), Reject(b,s)
```

<details>
<summary>Worked solution</summary>

**Step 1: Start at `S0`.**

```text
current = S0
```

**Step 2: Process `Offer(s,b)`.**

```text
δ(S0, Offer(s,b)) = S1
```

So:

```text
current = S1
```

**Step 3: Process `Accept(b,s)`.**

```text
δ(S1, Accept(b,s)) = S2
```

So:

```text
current = S2
```

**Step 4: Process `Update(s,b)`.**

```text
δ(S2, Update(s,b)) = S1
```

So:

```text
current = S1
```

**Step 5: Process `Reject(b,s)`.**

```text
δ(S1, Reject(b,s)) = S3
```

So:

```text
current = S3
```

**Step 6: Check the final state.**  
`S3 ∈ F`, so stopping here is correct.

**Answer:** The trace is valid and ends correctly in `S3`.

</details>

---

## Q14. FSM: can communication continue after reaching a final state?

Use the seller-buyer FSM. Check this trace:

```text
Offer(s,b), Reject(b,s), Accept(b,s)
```

Assume there are no transitions out of `S3`.

<details>
<summary>Worked solution</summary>

**Step 1: Start at `S0`.**

```text
current = S0
```

**Step 2: Process `Offer(s,b)`.**

```text
δ(S0, Offer(s,b)) = S1
```

So `current = S1`.

**Step 3: Process `Reject(b,s)`.**

```text
δ(S1, Reject(b,s)) = S3
```

So `current = S3`.

**Step 4: Notice that `S3` is final, but the trace has not stopped.**  
A final state means stopping there would be correct. It does not automatically make every later message valid.

**Step 5: Process `Accept(b,s)` from `S3`.**  
The question says there are no transitions out of `S3`, so:

```text
δ(S3, Accept(b,s))
```

is undefined.

**Answer:** The trace fails at the third message. Reaching a final state is only a correct stopping point; if communication continues, later messages still need defined transitions.

</details>

---

## Q15. Commitment protocol: offer, pay, deliver

In the e-commerce commitment protocol:

```text
offer(Store, Customer, Price, Item)
  ↦ CREATE(Store, Customer, paid(Price), delivered(Item))

pay(Customer, Store, Price)
  ↦ DECLARE(Customer, Store, paid(Price))

deliver(Store, Customer, Item)
  ↦ DECLARE(Store, Customer, delivered(Item))
```

Track the commitments in this enactment:

```text
offer(Store, Customer, Price, Item)
pay(Customer, Store, Price)
deliver(Store, Customer, Item)
```

<details>
<summary>Worked solution</summary>

**Step 1: Process `offer`.**

The offer creates:

```text
C(Store, Customer, paid(Price), delivered(Item))
```

Meaning: the store commits to deliver the item if the customer pays the price.

**Step 2: Process `pay`.**

The payment declares:

```text
paid(Price)
```

This makes the antecedent of the store's commitment true.

**Step 3: Check for detachment.**

The commitment is:

```text
C(Store, Customer, paid(Price), delivered(Item))
```

Now:

```text
paid(Price) = true
delivered(Item) = not yet true
```

So it detaches:

```text
C(Store, Customer, ⊤, delivered(Item))
```

The store is now actively obliged to deliver.

**Step 4: Process `deliver`.**

The delivery declares:

```text
delivered(Item)
```

**Step 5: Check for discharge.**

The consequent of the store's commitment is now true, so the commitment is discharged.

**Answer:** The enactment is clean: offer creates the store commitment, payment detaches it, and delivery discharges it.

</details>

---

## Q16. Commitment protocol: offer, accept, deliver, pay

In the same e-commerce protocol:

```text
offer(Store, Customer, Price, Item)
  ↦ CREATE(Store, Customer, paid(Price), delivered(Item))

accept(Customer, Store, Price, Item)
  ↦ CREATE(Customer, Store, delivered(Item), paid(Price))

deliver(Store, Customer, Item)
  ↦ DECLARE(Store, Customer, delivered(Item))

pay(Customer, Store, Price)
  ↦ DECLARE(Customer, Store, paid(Price))
```

Track this enactment:

```text
offer(Store, Customer, Price, Item)
accept(Customer, Store, Price, Item)
deliver(Store, Customer, Item)
pay(Customer, Store, Price)
```

<details>
<summary>Worked solution</summary>

**Step 1: Process `offer`.**

Create the store-to-customer commitment:

```text
C(Store, Customer, paid(Price), delivered(Item))
```

The store commits to deliver if paid.

**Step 2: Process `accept`.**

Create the customer-to-store commitment:

```text
C(Customer, Store, delivered(Item), paid(Price))
```

The customer commits to pay if the item is delivered.

**Step 3: Process `deliver`.**

Delivery declares:

```text
delivered(Item)
```

Now check both commitments.

For the store commitment:

```text
C(Store, Customer, paid(Price), delivered(Item))
```

The consequent `delivered(Item)` is true, so the store commitment is discharged.

For the customer commitment:

```text
C(Customer, Store, delivered(Item), paid(Price))
```

The antecedent `delivered(Item)` is true, but `paid(Price)` is not yet true, so it detaches:

```text
C(Customer, Store, ⊤, paid(Price))
```

**Step 4: Process `pay`.**

Payment declares:

```text
paid(Price)
```

This makes the consequent of the detached customer commitment true.

**Step 5: Discharge the customer commitment.**

```text
C(Customer, Store, ⊤, paid(Price))
```

is discharged.

**Answer:** The enactment is clean. The store's commitment is discharged by delivery; the customer's commitment detaches on delivery and is discharged by payment.

</details>

---

## Q17. Commitment protocol: offer, accept, pay, deliver

Track this enactment:

```text
offer(Store, Customer, Price, Item)
accept(Customer, Store, Price, Item)
pay(Customer, Store, Price)
deliver(Store, Customer, Item)
```

Is it commitment-consistent?

<details>
<summary>Worked solution</summary>

**Step 1: Process `offer`.**

Create:

```text
C(Store, Customer, paid(Price), delivered(Item))
```

**Step 2: Process `accept`.**

Create:

```text
C(Customer, Store, delivered(Item), paid(Price))
```

**Step 3: Process `pay`.**

Declare:

```text
paid(Price)
```

This affects the store commitment:

```text
C(Store, Customer, paid(Price), delivered(Item))
```

Its antecedent is true and its consequent is not yet true, so it detaches:

```text
C(Store, Customer, ⊤, delivered(Item))
```

**Step 4: Ask whether the customer commitment also detaches.**

The customer commitment is:

```text
C(Customer, Store, delivered(Item), paid(Price))
```

Its antecedent is `delivered(Item)`, which is not yet true. So it does not detach at this point.

Also, its consequent `paid(Price)` is already true, so once delivery occurs later, there will be no unpaid obligation remaining.

**Step 5: Process `deliver`.**

Declare:

```text
delivered(Item)
```

This discharges the detached store commitment.

For the customer commitment, both antecedent and consequent are now true. Since the consequent `paid(Price)` is true, the customer commitment is discharged rather than becoming an active unpaid obligation.

**Answer:** Yes, it is commitment-consistent. Paying before delivery detaches the store's commitment; delivery discharges the store commitment, and the customer commitment is already satisfied because payment has already occurred.

</details>

---

## Q18. Commitment protocol: offer, accept, deliver, then stop

Track this enactment:

```text
offer(Store, Customer, Price, Item)
accept(Customer, Store, Price, Item)
deliver(Store, Customer, Item)
```

What commitment remains at the end?

<details>
<summary>Worked solution</summary>

**Step 1: Process `offer`.**

Create:

```text
C(Store, Customer, paid(Price), delivered(Item))
```

**Step 2: Process `accept`.**

Create:

```text
C(Customer, Store, delivered(Item), paid(Price))
```

**Step 3: Process `deliver`.**

Declare:

```text
delivered(Item)
```

**Step 4: Update the store commitment.**

For:

```text
C(Store, Customer, paid(Price), delivered(Item))
```

`delivered(Item)` is the consequent, so the store commitment is discharged.

**Step 5: Update the customer commitment.**

For:

```text
C(Customer, Store, delivered(Item), paid(Price))
```

`delivered(Item)` is the antecedent. It is now true. But `paid(Price)` is not true.

So the customer commitment detaches:

```text
C(Customer, Store, ⊤, paid(Price))
```

**Answer:** The store has fulfilled its commitment, but the customer now has a detached commitment to pay. If the interaction stops here, an active unpaid obligation remains.

</details>

---

## Q19. Commitment protocol: offer, reject, then pay

Track this enactment:

```text
offer(Store, Customer, Price, Item)
reject(Customer, Store, Price, Item)
pay(Customer, Store, Price)
```

where:

```text
reject(Customer, Store, Price, Item)
  ↦ RELEASE(Store, Customer, paid(Price), delivered(Item))
```

Does the final payment detach a store commitment?

<details>
<summary>Worked solution</summary>

**Step 1: Process `offer`.**

Create:

```text
C(Store, Customer, paid(Price), delivered(Item))
```

**Step 2: Process `reject`.**

`reject` means:

```text
RELEASE(Store, Customer, paid(Price), delivered(Item))
```

This is performed by the creditor, `Customer`, and removes:

```text
C(Store, Customer, paid(Price), delivered(Item))
```

**Step 3: Process `pay`.**

Payment declares:

```text
paid(Price)
```

**Step 4: Ask what commitments exist.**

The store commitment was already released. There is no active commitment:

```text
C(Store, Customer, paid(Price), delivered(Item))
```

left to detach.

**Answer:** No. The payment declares `paid(Price)`, but it does not detach the store's delivery commitment because that commitment was released by `reject`.

</details>

---

## Q20. Commitment operations chain: delegate and assign

Suppose the following commitment exists:

```text
C(x, y, r, u)
```

Now these operations occur:

```text
DELEGATE(x, y, z, r, u)
ASSIGN(x, y, w, r, u)
```

Track the commitment effects. Assume delegation creates the new delegated commitment but does not automatically erase the original unless the protocol explicitly says so.

<details>
<summary>Worked solution</summary>

**Step 1: Start with the original commitment.**

```text
C(x, y, r, u)
```

`x` owes `y`: if `r`, then `u`.

**Step 2: Apply `DELEGATE(x,y,z,r,u)`.**

Delegation is performed by the debtor `x`.

Its effect is to create:

```text
C(z, y, r, u)
```

Now `z` also has a commitment to `y`.

Under the assumption in the question, the original may still remain:

```text
C(x, y, r, u)
C(z, y, r, u)
```

**Step 3: Apply `ASSIGN(x,y,w,r,u)`.**

Assignment is performed by the creditor `y`.

It changes the creditor of `x`'s commitment from `y` to `w`:

```text
C(x, w, r, u)
```

**Step 4: Ask what happened to the delegated commitment.**

The operation was specifically:

```text
ASSIGN(x, y, w, r, u)
```

So it applies to `x`'s commitment, not automatically to `z`'s commitment.

The delegated commitment remains:

```text
C(z, y, r, u)
```

unless the protocol also performs:

```text
ASSIGN(z, y, w, r, u)
```

**Answer:** After both operations, the likely commitment set is:

```text
C(x, w, r, u)
C(z, y, r, u)
```

assuming delegation did not erase the original and assignment only targeted `x`'s commitment.

</details>

---

# Section C — Building things from scratch

## Q21. Build an FSM tuple from a protocol description

Protocol description:

- A buyer first sends `RequestQuote(b,s)` to a seller.
- The seller then either sends `RefuseQuote(s,b)` and the protocol ends, or sends `Quote(s,b)`.
- After a quote, the buyer either sends `AcceptQuote(b,s)` and the protocol ends, or sends `RejectQuote(b,s)` and the protocol ends.

Build a deterministic FSM tuple:

```text
⟨Σ, S, s0, δ, F⟩
```

<details>
<summary>Worked solution</summary>

**Step 1: Identify the messages.**

The message labels are:

```text
RequestQuote(b,s)
RefuseQuote(s,b)
Quote(s,b)
AcceptQuote(b,s)
RejectQuote(b,s)
```

So:

```text
Σ = {RequestQuote(b,s), RefuseQuote(s,b), Quote(s,b), AcceptQuote(b,s), RejectQuote(b,s)}
```

**Step 2: Create states for protocol stages.**

Use:

```text
S0 = before request
S1 = after request, waiting for seller response
S2 = after quote, waiting for buyer response
S3 = ended by seller refusal
S4 = ended by buyer acceptance
S5 = ended by buyer rejection
```

So:

```text
S = {S0, S1, S2, S3, S4, S5}
```

**Step 3: Identify the initial state.**

The protocol begins before any message:

```text
s0 = S0
```

**Step 4: Define transitions.**

First message:

```text
δ(S0, RequestQuote(b,s)) = S1
```

Seller response:

```text
δ(S1, RefuseQuote(s,b)) = S3
δ(S1, Quote(s,b)) = S2
```

Buyer response after quote:

```text
δ(S2, AcceptQuote(b,s)) = S4
δ(S2, RejectQuote(b,s)) = S5
```

**Step 5: Define final states.**

The protocol ends after refusal, acceptance, or rejection:

```text
F = {S3, S4, S5}
```

**Answer:**

```text
Σ = {RequestQuote(b,s), RefuseQuote(s,b), Quote(s,b), AcceptQuote(b,s), RejectQuote(b,s)}
S = {S0, S1, S2, S3, S4, S5}
s0 = S0
δ(S0, RequestQuote(b,s)) = S1
δ(S1, RefuseQuote(s,b)) = S3
δ(S1, Quote(s,b)) = S2
δ(S2, AcceptQuote(b,s)) = S4
δ(S2, RejectQuote(b,s)) = S5
F = {S3, S4, S5}
```

</details>

---

## Q22. Use your FSM to check a new trace

Use the FSM from Q21. Check this trace:

```text
RequestQuote(b,s), Quote(s,b), RefuseQuote(s,b)
```

<details>
<summary>Worked solution</summary>

**Step 1: Start at the initial state.**

```text
current = S0
```

**Step 2: Process `RequestQuote(b,s)`.**

```text
δ(S0, RequestQuote(b,s)) = S1
```

So `current = S1`.

**Step 3: Process `Quote(s,b)`.**

```text
δ(S1, Quote(s,b)) = S2
```

So `current = S2`.

**Step 4: Process `RefuseQuote(s,b)`.**

From `S2`, the buyer is supposed to send either:

```text
AcceptQuote(b,s)
RejectQuote(b,s)
```

There is no transition:

```text
δ(S2, RefuseQuote(s,b))
```

**Answer:** The trace fails at the third message. `RefuseQuote(s,b)` is allowed after the request, but not after a quote has already been sent.

</details>

---

## Q23. Build a commitment protocol for a tutoring exchange

Design commitment meanings for this tutoring protocol:

- `offerSession(Tutor, Student, Fee, Session)`
- `acceptSession(Student, Tutor, Fee, Session)`
- `rejectSession(Student, Tutor, Fee, Session)`
- `teach(Tutor, Student, Session)`
- `pay(Student, Tutor, Fee)`

Use the same commitment style as the e-commerce example.

<details>
<summary>Worked solution</summary>

**Step 1: Decide what the tutor's offer should mean.**  
The tutor should commit to teach if the fee is paid:

```text
offerSession(Tutor, Student, Fee, Session)
  ↦ CREATE(Tutor, Student, paid(Fee), taught(Session))
```

This creates:

```text
C(Tutor, Student, paid(Fee), taught(Session))
```

**Step 2: Decide what the student's acceptance should mean.**  
The student should commit to pay if the session is taught:

```text
acceptSession(Student, Tutor, Fee, Session)
  ↦ CREATE(Student, Tutor, taught(Session), paid(Fee))
```

This creates:

```text
C(Student, Tutor, taught(Session), paid(Fee))
```

**Step 3: Decide what rejection should mean.**  
Rejection releases the tutor from the offer commitment:

```text
rejectSession(Student, Tutor, Fee, Session)
  ↦ RELEASE(Tutor, Student, paid(Fee), taught(Session))
```

**Step 4: Decide what teaching should mean.**  
Teaching declares that the session has been taught:

```text
teach(Tutor, Student, Session)
  ↦ DECLARE(Tutor, Student, taught(Session))
```

**Step 5: Decide what payment should mean.**  
Payment declares that the fee has been paid:

```text
pay(Student, Tutor, Fee)
  ↦ DECLARE(Student, Tutor, paid(Fee))
```

**Answer:**

```text
offerSession(Tutor, Student, Fee, Session)
  ↦ CREATE(Tutor, Student, paid(Fee), taught(Session))

acceptSession(Student, Tutor, Fee, Session)
  ↦ CREATE(Student, Tutor, taught(Session), paid(Fee))

rejectSession(Student, Tutor, Fee, Session)
  ↦ RELEASE(Tutor, Student, paid(Fee), taught(Session))

teach(Tutor, Student, Session)
  ↦ DECLARE(Tutor, Student, taught(Session))

pay(Student, Tutor, Fee)
  ↦ DECLARE(Student, Tutor, paid(Fee))
```

</details>

---

## Q24. Use your tutoring protocol to track an enactment

Using the tutoring protocol from Q23, track:

```text
offerSession(Tutor, Student, Fee, Session)
acceptSession(Student, Tutor, Fee, Session)
teach(Tutor, Student, Session)
```

What remains unresolved?

<details>
<summary>Worked solution</summary>

**Step 1: Process the offer.**

Create:

```text
C(Tutor, Student, paid(Fee), taught(Session))
```

**Step 2: Process the acceptance.**

Create:

```text
C(Student, Tutor, taught(Session), paid(Fee))
```

**Step 3: Process `teach`.**

Declare:

```text
taught(Session)
```

**Step 4: Update the tutor commitment.**

For:

```text
C(Tutor, Student, paid(Fee), taught(Session))
```

`taught(Session)` is the consequent, so the tutor's commitment is discharged.

**Step 5: Update the student commitment.**

For:

```text
C(Student, Tutor, taught(Session), paid(Fee))
```

`taught(Session)` is the antecedent. It is true. But `paid(Fee)` is not yet true.

So the student commitment detaches:

```text
C(Student, Tutor, ⊤, paid(Fee))
```

**Answer:** The tutor has fulfilled the teaching commitment. The student now has a detached unresolved commitment to pay the fee.

</details>

---

## Q25. Build an argument graph from incremental arguments

A system is deciding whether to perform action `α`.

Arguments:

- `A`: perform `α` because it is legally required.
- `B`: do not perform `α` because it violates privacy.
- `C`: `B` is defeated because the user gave consent.
- `D`: do not perform `α` because it is too costly.

Attacks:

- `B` attacks `A`.
- `C` attacks `B`.
- `D` attacks `A`.

Build the argument graph and list the possible dispute branches starting from root `A`.

<details>
<summary>Worked solution</summary>

**Step 1: Make each argument a node.**

Nodes:

```text
A, B, C, D
```

**Step 2: Add attack edges.**

The attacks are:

```text
B → A
C → B
D → A
```

**Step 3: Choose the root.**

The root argument is:

```text
A
```

because the dispute asks whether action `α` should be performed.

**Step 4: Build branches by following attacks and counterattacks.**

Attackers of `A`:

```text
B
D
```

So there are at least two branches:

```text
A, B, C
A, D
```

The first branch means: `A` is attacked by `B`, and `B` is attacked by `C`.  
The second branch means: `A` is attacked by `D`, with no given counterattack.

**Answer:**

Argument graph:

```text
B → A
C → B
D → A
```

Possible dispute branches from `A`:

```text
A - B - C
A - D
```

</details>

---

## Q26. Build a dialogue-game exchange

Construct a dialogue-game exchange where:

1. Agent 1 claims `φ`.
2. Agent 2 asks for justification.
3. Agent 1 gives reason `ψ` for `φ`.
4. Agent 2 attacks by asserting something contradictory to `φ`.

Use the lecture's move forms.

<details>
<summary>Worked solution</summary>

**Step 1: Agent 1 makes the initial claim.**

```text
Agent 1: claim(φ)
```

**Step 2: Agent 2 challenges the bare claim.**

```text
Agent 2: why(φ)
```

This asks why `φ` is the case.

**Step 3: Agent 1 gives a reason.**

If Agent 1 has `ψ` and `ψ ⇒ φ`, it can say:

```text
Agent 1: φ since ψ
```

This answers `why(φ)`.

**Step 4: Agent 2 attacks with a contradiction/complement.**

The lecture uses an overline/complement idea. A contradictory assertion can be written schematically as:

```text
Agent 2: claim(¬φ)
```

or:

```text
Agent 2: claim(overline(φ))
```

**Answer:** One valid exchange shape is:

```text
Agent 1: claim(φ)
Agent 2: why(φ)
Agent 1: φ since ψ
Agent 2: claim(¬φ)
```

where `why(φ)` attacks the bare claim, `φ since ψ` answers the request for justification, and `claim(¬φ)` attacks by contradiction.

</details>

---

## Q27. Build a candidate winning-strategy subtree

Root argument `A` is attacked by `B` and `C`.

The proponent has these counterarguments:

- `D` attacks `B`.
- `E` attacks `C`.

Build the smallest candidate winning-strategy subtree for defending `A`, assuming `B` and `C` have no further attackers or counterattackers beyond those listed.

<details>
<summary>Worked solution</summary>

**Step 1: Put the root in the subtree.**

```text
A
```

**Step 2: Include all possible attacks on the root.**  
The root `A` is attacked by both `B` and `C`.

A winning strategy cannot ignore a possible attack. So include:

```text
A - B
A - C
```

**Step 3: Include proponent replies to each attack.**

`D` attacks `B`, so include:

```text
A - B - D
```

`E` attacks `C`, so include:

```text
A - C - E
```

**Step 4: Check finiteness.**  
The subtree has finitely many disputes:

```text
A, B, D
A, C, E
```

Each branch is finite.

**Step 5: Check coverage.**  
Every attack on `A` has been represented and answered.

**Answer:** The candidate winning-strategy subtree is:

```text
A
├── B
│   └── D
└── C
    └── E
```

It is a plausible winning strategy because it includes all attacks on `A` and gives a response to each.

</details>

---

## Q28. Apply protocol desiderata to two designs

Two protocol designs are proposed for negotiation.

**Design 1:** The seller sends `offer(Price)`. The buyer sends `accept` or `reject`. The protocol only uses observable messages.

**Design 2:** The seller may send `offer(Price)` only if it internally believes the price is optimal and internally intends to honour it. External observers cannot inspect those beliefs or intentions.

Which design is more checkable from observation, and why?

<details>
<summary>Worked solution</summary>

**Step 1: Recall the checkability desideratum.**  
A protocol is checkable from observation if an external observer can tell whether agents complied by observing messages/events.

**Step 2: Evaluate Design 1.**  
Design 1 uses observable messages:

```text
offer(Price), accept, reject
```

An observer can check whether the message order was followed.

**Step 3: Evaluate Design 2.**  
Design 2 depends on the seller's internal beliefs and intentions:

```text
believes price is optimal
intends to honour the offer
```

An external observer cannot directly inspect these mental states.

**Step 4: Decide.**  
Design 1 is more externally checkable. Design 2 may still help implementation validation if the developer can inspect internals, but it is weaker for external monitoring.

**Answer:** Design 1 is more checkable from observation because compliance depends on observable messages rather than hidden beliefs or intentions.

</details>

---

# Section D — Hard edge cases and method conflicts

## Q29. Same trace, different protocol style: FSM vs commitment protocol

Suppose a rigid sequence protocol says the only correct order is:

```text
offer, accept, deliver, pay
```

But a commitment protocol gives these meanings:

```text
offer ↦ CREATE(Store, Customer, paid(Price), delivered(Item))
accept ↦ CREATE(Customer, Store, delivered(Item), paid(Price))
pay ↦ DECLARE(Customer, Store, paid(Price))
deliver ↦ DECLARE(Store, Customer, delivered(Item))
```

Now consider:

```text
offer, pay, deliver
```

How is this trace judged under each protocol style?

<details>
<summary>Worked solution</summary>

**Step 1: Check the rigid sequence protocol.**  
The rigid order is:

```text
offer, accept, deliver, pay
```

The observed trace is:

```text
offer, pay, deliver
```

It has `pay` where the rigid sequence expected `accept`.

So under the rigid sequence protocol, the trace is invalid.

**Step 2: Check the commitment protocol.**

Process `offer`:

```text
C(Store, Customer, paid(Price), delivered(Item))
```

Process `pay`:

```text
paid(Price)
```

This detaches the store's commitment:

```text
C(Store, Customer, ⊤, delivered(Item))
```

Process `deliver`:

```text
delivered(Item)
```

This discharges the store commitment.

**Step 3: Compare the two judgements.**  
The rigid protocol rejects the trace because it violates message order.  
The commitment protocol accepts the enactment as meaningful because obligations are created, detached, and discharged correctly.

**Answer:** Invalid under the rigid sequence protocol; commitment-consistent under the commitment protocol.

</details>

---

## Q30. Syntactically valid FSM, strange real-world meaning

A protocol says:

```text
S0 --Offer--> S1
S1 --Accept--> S2
S2 --Update--> S1
S1 --Reject--> S3
F = {S1, S3}
```

Someone says: “This protocol is weird. Why can a seller update after the buyer accepts? Therefore it is not a valid FSM.” Is that reasoning correct?

<details>
<summary>Worked solution</summary>

**Step 1: Separate syntactic validity from sensible domain meaning.**  
An FSM is syntactically valid if it has:

```text
Σ, S, s0, δ, F
```

with labelled transitions between states.

**Step 2: Check whether the structure is an FSM.**  
The protocol has states, an initial state, labelled transitions, and final states.

So it is structurally a valid FSM.

**Step 3: Evaluate the “weirdness” objection.**  
The domain meaning may be strange: after `Accept`, the seller can `Update`, returning to a state where the buyer can accept or reject again.

But weird business logic does not make the FSM mathematically invalid.

**Answer:** No. The reasoning is not correct. The protocol may be strange as a business protocol, but it is still a syntactically valid finite-state machine.

</details>

---

## Q31. Undefined transition vs non-final stopping

For the seller-buyer FSM, compare these two traces:

A. `Accept(b,s)`  
B. `Offer(s,b), Accept(b,s)`

Which fails because of an undefined transition, and which fails because it stops in a non-final state?

<details>
<summary>Worked solution</summary>

**Step 1: Check trace A.**

Start:

```text
current = S0
```

Message:

```text
Accept(b,s)
```

There is no transition:

```text
δ(S0, Accept(b,s))
```

So A fails because of an undefined transition.

**Step 2: Check trace B.**

Start:

```text
current = S0
```

Process `Offer(s,b)`:

```text
S0 → S1
```

Process `Accept(b,s)`:

```text
S1 → S2
```

No undefined transition occurred.

**Step 3: Check the stopping state.**  
Final states are:

```text
F = {S1, S3}
```

The trace stops at `S2`, which is not final.

**Answer:** A fails because `δ(S0, Accept(b,s))` is undefined. B follows defined transitions but stops in non-final state `S2`.

</details>

---

## Q32. CANCEL vs RELEASE: raw operation effect vs protocol acceptability

A debtor `x` has commitment:

```text
C(x, y, r, u)
```

Then `x` performs:

```text
CANCEL(x, y, r, u)
```

Does this remove the commitment? Does that automatically mean the cancellation is acceptable?

<details>
<summary>Worked solution</summary>

**Step 1: Identify who performs `CANCEL`.**  
`CANCEL(x,y,r,u)` is performed by the debtor `x`.

**Step 2: State the raw operation effect.**  
The operation removes:

```text
C(x, y, r, u)
```

from holding.

**Step 3: Ask whether the protocol allows arbitrary cancellation.**  
The lecture notes an important restriction: a protocol should not necessarily let the debtor cancel whenever it feels like it.

**Step 4: Separate effect from acceptability.**  
The operation's semantic effect is removal of the commitment.  
But whether the operation is permitted depends on the protocol rules.

**Answer:** `CANCEL` removes the commitment as an operation, but that does not automatically make the cancellation acceptable. The protocol must specify when debtor cancellation is allowed.

</details>

---

## Q33. Consequent true before antecedent: does detachment still matter?

Suppose this commitment exists:

```text
C(x, y, r, u)
```

Now `u` becomes true before `r` becomes true. Later, `r` becomes true. What should happen?

<details>
<summary>Worked solution</summary>

**Step 1: Recall discharge.**  
A commitment is discharged when the consequent holds.

The consequent is:

```text
u
```

**Step 2: Apply the first event.**  
`u` becomes true before `r`.

So:

```text
C(x, y, r, u)
```

is discharged.

**Step 3: Apply the later event.**  
Later, `r` becomes true.

But the commitment has already been discharged because the promised outcome `u` already holds.

**Step 4: Decide whether detachment creates a new active obligation.**  
No. Detachment matters when the antecedent holds and the consequent does not yet hold. Here the consequent already holds.

**Answer:** The commitment is discharged when `u` becomes true. Later `r` becoming true does not create a new active detached obligation, because the consequent has already been achieved.

</details>

---

## Q34. Assignment does not automatically follow delegation

Start with:

```text
C(x, y, r, u)
```

Then:

```text
DELEGATE(x, y, z, r, u)
ASSIGN(x, y, w, r, u)
```

A student writes:

```text
Final commitments: C(x,w,r,u) and C(z,w,r,u)
```

Is this necessarily correct?

<details>
<summary>Worked solution</summary>

**Step 1: Apply delegation.**

`DELEGATE(x,y,z,r,u)` creates:

```text
C(z, y, r, u)
```

Under the lecture's nuance, the original commitment may still remain unless the protocol says otherwise:

```text
C(x, y, r, u)
C(z, y, r, u)
```

**Step 2: Apply the assignment exactly as written.**

`ASSIGN(x,y,w,r,u)` changes the creditor of `x`'s commitment from `y` to `w`:

```text
C(x, w, r, u)
```

**Step 3: Ask whether the assignment also named `z`.**  
It did not. The assignment operation was not:

```text
ASSIGN(z,y,w,r,u)
```

So it does not automatically transfer the creditor of `z`'s delegated commitment.

**Step 4: Correct the student's answer.**  
The final set is more carefully written as:

```text
C(x, w, r, u)
C(z, y, r, u)
```

unless the protocol has an additional rule saying that assignment of `x`'s commitment also assigns delegated commitments.

**Answer:** Not necessarily. `C(z,w,r,u)` would require assigning `z`'s commitment too, or a protocol rule that propagates assignment through delegation.

</details>

---

## Q35. Argument graph cycle: what happens in the dispute tree?

An argument graph has two arguments:

```text
A attacks B
B attacks A
```

The dispute tree is rooted at `A`. What happens if we unfold the graph into a tree? Is the simple unfolding a finite winning strategy?

<details>
<summary>Worked solution</summary>

**Step 1: Draw the graph cycle.**

```text
A ↔ B
```

`A` attacks `B`, and `B` attacks `A`.

**Step 2: Start the dispute tree at root `A`.**

```text
A
```

**Step 3: Add attackers of `A`.**  
`B` attacks `A`, so:

```text
A
└── B
```

**Step 4: Add attackers of `B`.**  
`A` attacks `B`, so:

```text
A
└── B
    └── A
```

**Step 5: Continue unfolding.**  
Now `B` attacks `A` again:

```text
A
└── B
    └── A
        └── B
            └── A
                └── ...
```

**Step 6: Apply the winning-strategy finiteness condition from the lecture.**  
The lecture says a winning strategy subtree should have non-empty finite disputes, and each dispute should be finite.

The simple unfolding creates an infinite branch.

**Answer:** The cycle becomes an infinite branch in the dispute tree. Under the lecture's simple winning-strategy idea, this unfolding is not a finite winning strategy. The textbook has extra machinery for handling cycles, but the lecture only sketches that issue.

</details>

---

## Q36. Winning strategy failure by ignoring an attack

Root argument `A` has two attackers:

```text
B attacks A
C attacks A
```

The proponent has a reply:

```text
D attacks B
```

A proposed strategy subtree is:

```text
A
└── B
    └── D
```

Is this a winning strategy for `A`?

<details>
<summary>Worked solution</summary>

**Step 1: Identify all attacks on the root.**  
`A` is attacked by both:

```text
B
C
```

**Step 2: Inspect the proposed strategy.**  
The subtree includes:

```text
A - B - D
```

So it handles attack `B`.

**Step 3: Check whether attack `C` is represented.**  
`C` is missing.

**Step 4: Apply the lecture's coverage idea.**  
A strategy must not win merely because the opponent failed to make a possible attack. If a proponent argument can be attacked, the strategy must include the possible attacks and show how they are handled.

**Answer:** No. The subtree is not a winning strategy because it ignores the possible attack `C` on `A`.

</details>

---

## Q37. Dialogue-game ambiguity: can an agent ask `why(φ)` if it already believes `φ`?

An agent hears:

```text
claim(φ)
```

The agent also believes `φ`, but wants to know the speaker's reason. Can it ask:

```text
why(φ)
```

?

<details>
<summary>Worked solution</summary>

**Step 1: Recall the purpose of `why(φ)`.**  
`why(φ)` asks for justification of the claim `φ`.

**Step 2: Recall the lecture's two variants.**  
The lecture notes that some dialogue systems allow `why(φ)` only if the agent does not believe `φ`.

Other dialogue systems allow `why(φ)` even if the agent does believe `φ`, because the agent may still want the other speaker's reason.

**Step 3: Decide whether the answer is fixed without extra rules.**  
No. It depends on the particular dialogue-game rules.

**Answer:** You cannot decide from the move form alone. In some systems, the agent may ask `why(φ)` only if it does not believe `φ`; in others, it may ask even if it believes `φ`, to request the speaker's justification.

</details>

---

## Q38. FIPA ACL: internal correctness vs external checkability

An observer sees this message:

```text
tell(p)
```

The language semantics say an agent should only `tell(p)` if `p` follows from its beliefs. Can an external observer determine from the message alone whether the agent used `tell(p)` correctly? Can a developer with access to the agent internals do better?

<details>
<summary>Worked solution</summary>

**Step 1: State the semantic rule.**  
The rule is internal-state-based:

```text
The agent may tell p only if p follows from its beliefs.
```

**Step 2: Ask what the external observer sees.**  
The observer sees only:

```text
tell(p)
```

The observer does not see the agent's beliefs.

**Step 3: Decide external checkability.**  
From the message alone, the observer cannot know whether `p` really follows from the sender's beliefs.

So external checkability is weak.

**Step 4: Ask whether a developer with internals can do better.**  
A developer may inspect the agent's belief base and implementation.

That developer can check whether the agent only sends `tell(p)` when `p` follows from its beliefs.

**Answer:** An external observer cannot verify correctness from `tell(p)` alone. A developer with access to internals can use the mental-state semantics for implementation validation.

</details>

---

# Extra mixed exam-style drills

## Q39. Mixed: trace plus commitment state

A protocol is commitment-based, not FSM-based. It defines:

```text
promise(A, B, r, u) ↦ CREATE(A, B, r, u)
announce(A, B, r) ↦ DECLARE(A, B, r)
announce(A, B, u) ↦ DECLARE(A, B, u)
```

Track:

```text
promise(A, B, r, u)
announce(A, B, u)
announce(A, B, r)
```

Does the later declaration of `r` create a detached obligation?

<details>
<summary>Worked solution</summary>

**Step 1: Process the promise.**

Create:

```text
C(A, B, r, u)
```

**Step 2: Process `announce(A,B,u)`.**

Declare:

```text
u
```

Since `u` is the consequent, the commitment is discharged.

**Step 3: Process `announce(A,B,r)`.**

Declare:

```text
r
```

**Step 4: Ask whether the commitment still exists.**  
No. It was already discharged when `u` became true.

**Step 5: Apply detachment condition.**  
Detachment requires an existing commitment whose antecedent holds while the consequent is not yet true. Here the consequent is already true, and the commitment has already been discharged.

**Answer:** No. The later declaration of `r` does not create a detached obligation because the commitment was already discharged when `u` became true.

</details>

---

## Q40. Mixed: choose the right protocol representation

You need to specify a delivery interaction. The only thing that matters is strict message order: `request`, then `agree/refuse`, then `inform/fail`. You do not need to model obligations. Which representation from the lecture is most direct: FSM/sequence diagram or commitment protocol?

<details>
<summary>Worked solution</summary>

**Step 1: Identify what the protocol cares about.**  
The question says the only thing that matters is strict message order.

**Step 2: Match to lecture tools.**  
Sequence diagrams and FSMs are direct tools for specifying allowed message sequences.

**Step 3: Ask whether commitments are needed.**  
Commitments are useful when we want to model obligations, detachment, discharge, and flexible enactments.

The question explicitly says obligations are not needed.

**Answer:** Use an FSM or sequence diagram. They directly specify allowed message order. A commitment protocol would be extra machinery unless obligations/flexibility matter.

</details>

---

## Q41. Mixed: choose commitments over a rigid order

You need to specify a purchase interaction where either of these should be acceptable:

```text
offer, pay, deliver
```

or:

```text
offer, accept, deliver, pay
```

The important thing is that whoever is owed something can tell whether the corresponding obligation has been fulfilled. Which lecture idea fits best?

<details>
<summary>Worked solution</summary>

**Step 1: Notice the multiple acceptable orders.**  
The two traces have different message orders:

```text
pay before deliver
```

versus:

```text
deliver before pay
```

A single rigid sequence would need explicit branches for these cases.

**Step 2: Identify the common underlying structure.**  
Both cases involve obligations:

- store delivers if customer pays;
- customer pays if store delivers, once accepted.

**Step 3: Match to commitment semantics.**  
Commitment protocols define what messages mean in terms of creating, detaching, and discharging obligations.

**Step 4: Explain why this gives flexibility.**  
The agents can choose different enactments as long as the commitments are eventually discharged.

**Answer:** A commitment-based protocol fits best. It allows flexible message order while preserving observable obligations and fulfilment.

</details>

---

## Q42. Mixed: argument game vs dialogue game

You are given only an abstract graph:

```text
B attacks A
C attacks B
```

No internal logical contents are provided. Should you analyse this primarily as an abstract argument game or as a dialogue game with `claim`, `why`, and `since` moves?

<details>
<summary>Worked solution</summary>

**Step 1: Check what information is given.**  
Only abstract attack relations are given:

```text
B attacks A
C attacks B
```

No formulas such as `φ`, `ψ`, or implications like `ψ ⇒ φ` are given.

**Step 2: Match to abstract argument games.**  
Argument games can work with abstract arguments as graph nodes and attack edges.

**Step 3: Match to dialogue games.**  
Dialogue games need more internal structure: claims, requests for reasons, reasons, contradictions, and logical relationships.

**Answer:** Analyse it primarily as an abstract argument game. A dialogue-game analysis would require extra logical content that has not been specified.

</details>

---

# Fast method templates

## FSM trace-checking template

```text
Step 1: Set current = s0.
Step 2: For each observed message mi:
        check whether δ(current, mi) is defined.
        If undefined: fail at mi.
        If defined: current := δ(current, mi).
Step 3: When the trace stops, check current ∈ F.
        If yes: ended correctly.
        If no: stopped in a non-final state.
```

## Commitment tracking template

```text
Step 1: Translate each message into its operation.
Step 2: Apply CREATE/CANCEL/RELEASE/DELEGATE/ASSIGN/DECLARE.
Step 3: After every DECLARE, update which facts now hold.
Step 4: For each active commitment C(x,y,r,u):
        if u holds: discharge it.
        else if r holds and u does not hold: detach it as C(x,y,⊤,u).
Step 5: At the end, list active detached commitments as unresolved obligations.
```

## Argument/dispute-game template

```text
Step 1: Treat each argument as a node.
Step 2: Draw attack edges.
Step 3: Choose the root argument.
Step 4: Build dispute branches by following attacks and counterattacks.
Step 5: For a candidate winning strategy, check:
        finite non-empty subtree;
        finite disputes;
        all possible attacks on proponent arguments are represented;
        the proponent has replies so the opponent cannot defeat the root.
```

## Dialogue-game move template

```text
claim(φ): assert φ.
why(φ): ask for justification of φ; attacks a bare claim of φ.
φ since ψ: give ψ as a reason for φ; requires ψ ⇒ φ in the relevant knowledge base/rules.
claim(¬φ) or claim(overline(φ)): attack by contradiction/complement.
```
