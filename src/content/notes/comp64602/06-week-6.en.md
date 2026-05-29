---
subject: COMP64602
chapter: 6
title: "Week 6"
language: en
---


# Study Notes: Agent Communication, Interaction Protocols, Commitments, and Argument Games

**Topic and scope —** This lecture pack covers how autonomous agents communicate in multi-agent systems: communication protocols, agent communication languages, sequence diagrams, finite-state machines, commitments, commitment-based protocol enactments, and argumentation-as-games. It fits into the broader subject by showing how agent interactions can be specified with observable, checkable meaning while preserving flexibility for autonomous agents.

**Course/context —** Mainly **COMP64602: Agent Communication / Commitments**.  
[UNCLEAR: one slide deck is labelled **COMP26120** for UML sequence diagrams and finite-state machines, and the commitment example deck is labelled **COMP64620**, while the surrounding material is COMP64602.]

**Source coverage —** These notes combine the uploaded slides and transcripts where both were available. The **Agent Communication** material is slide-only in the upload; the **Arguments and Games** material is transcript-only in the upload.

---

## 1. Agent Communication and Communication Protocols

### 1.1 Key concept: communication protocol

**Intuition.** A communication protocol is a rule-like description of how agents should exchange messages during an interaction. It specifies what messages may occur and often in what order.

**Formal / slide definition.** A communication protocol “specifies a sequence of messages to be exchanged between agents.” Example: after receiving an order from a customer, a merchant software agent should confirm receipt of the order.

### 1.2 Why protocols matter in multi-agent systems

The lecture assumes agents may be:

- **autonomous**;
- **intelligent**;
- designed or implemented by people other than the people who designed the protocol.

Because of this, protocols need two things at once:

1. **Clear meaning for the agent using the protocol**  
   The agent should be able to use the protocol to guide its own actions.

2. **Observable violations**  
   The multi-agent system or organisation should be able to observe whether an agent has complied with the protocol.

This is a recurring theme across the lecture pack: protocol specifications should not depend too heavily on inspecting private internals of agents.

---

## 2. What We Want from an MAS Protocol

### 2.1 Software engineering desiderata

The lecture gives several software-engineering requirements for multi-agent system protocols.

A good MAS protocol should be:

- **Understandable by stakeholders**
  - It should use terms stakeholders understand, such as `offer`, `request`, and `reject`.
  - The point is not just mathematical elegance; stakeholders should be able to read the protocol and understand the interaction.

- **Easy to modify and understand**
  - If a protocol changes, developers and stakeholders should be able to see what changed.

- **Easy to compose**
  - Example from the slide: a protocol for agreeing a purchase should be composable with a protocol for shipping the item.

- **Loosely coupled**
  - Agents should not need to know much about how other agents fulfil their side of the protocol.
  - They should only need to know the communicative interface and protocol-level meaning.

### 2.2 Flexibility desideratum

The protocol should minimise unnecessary constraints on how an agent fulfils it.

Example from the slides:

- A selling agent could be simple:
  - it does a database lookup;
  - it reports the database price as part of its offer.

- Or a selling agent could be complex:
  - it scrapes the internet for comparable prices;
  - it judges the value of the customer;
  - it offers a lower price where appropriate.

Both should be able to participate in the same protocol as long as their observable messages comply.

### 2.3 Checkability desideratum

A protocol should be checkable from observation.

That means:

- it should be possible to tell whether an agent is complying;
- protocols need to be precise;
- protocols should be based on information that can be observed.

**Connection.** This directly connects to the later critique of FIPA ACL: if correctness depends on an agent’s hidden beliefs or intentions, then an external observer may not be able to check compliance just from messages.

---

## 3. Agent Communication Languages

### 3.1 Key concept: communicative acts

**Intuition.** A communicative act is a message with a purpose. The same logical content can mean different things depending on whether the sender is informing, requesting, promising, and so on.

Examples from the lecture:

- Passing information: “There is a box in the next room.”
- Requesting action: “Take the box to the next room.”
- Promising / committing: “I will take the box to the next room.”

The underlying logical content can be represented as something like:

```latex
in(next_room, box)
```

But the meaning changes depending on the communicative purpose.

### 3.2 Key concept: performative

**Intuition.** A performative is a tag attached to logical content telling the receiving agent how to interpret that content.

**Formal examples from the slide:**

```latex
:tell(in(next_room, box))
```

```latex
:perform(in(next_room, box))
```

```latex
:promise(in(next_room, box))
```

Interpretation:

- `:tell(...)` means the sender is passing information.
- `:perform(...)` means the sender is requesting that the receiver make the formula true.
- `:promise(...)` means the sender is promising that the formula will become true.

The lecturer notes that the syntax shown is similar to syntax used in some BDI-style programming languages, but different communication languages may use different syntax. The important concept is the separation between **logical content** and **performative**.

### 3.3 Agent communication languages with fixed performatives

Many agent communication languages provide a fixed set of performatives. Agents that use the language can communicate using those standard performatives.

Example:

- **KQML** stands for **Knowledge Query and Manipulation Language**.
- It is intended for communication between ontologies / knowledge bases.
- It has performatives such as:
  - `query`;
  - `tell`.

A fixed performative language can be restrictive. Specific domains may need richer, domain-specific performatives.

### 3.4 Domain-specific performatives

The lecture’s business-process example:

- `request_quote`
- `provide_quote`

The nuance is important. In some domains, providing a quote might imply a commitment to supply goods at that price if requested. In another domain, a quote might only be indicative. In yet another case, it might report a price listed by someone else.

So the meaning of the performative depends on the domain and protocol.

---

## 4. FIPA ACL

### 4.1 Key concept: FIPA ACL

**Intuition.** FIPA ACL is an agent communication language that gives messages more semantic structure than just a performative label.

**Formal / slide definition.** The FIPA ACL attempts to specify message semantics in terms of the internal mental state of agents, such as beliefs and intentions. Example: an agent can only tell a fact if that fact follows from its knowledge base.

The transcript also gives the corresponding promise example:

- an agent can only promise to do something if it intends to do that thing.

### 4.2 FIPA ACL and message sequence diagrams

FIPA ACL specifies communication protocols using message sequence diagrams. The next lecture/video gives a refresher on sequence diagrams.

### 4.3 Textbook critique and lecturer’s response

The textbook critique:

- FIPA-style semantics require inspecting an agent’s internal state to determine correctness.
- Example: from observing a `tell` message alone, an external observer cannot know whether the sender really believes the fact.

The lecturer’s response:

- This critique is fair from the perspective of an external observer or monitoring system.
- But there is another use of correctness: implementation validation.
- A developer who does have access to the agent’s internals can verify that the agent only uses `tell` when it actually believes the fact.
- Internal semantics are therefore still useful for validating implementations and for agents checking that their own outgoing messages are internally correct.

**Connection.** This connects directly to the MAS protocol checkability requirement: external monitoring prefers observable criteria, but implementation verification may legitimately use internal mental states.

---

## 5. UML Sequence Diagrams

### 5.1 Key concept: sequence diagram

**Intuition.** A sequence diagram shows an ordered interaction between participants.

**Formal / slide definition.** Sequence charts or diagrams illustrate a sequence of interactions between participants. They are formalised in UML and are often used to convert use cases into specifications. A variant is used by FIPA ACL to represent interaction protocols.

### 5.2 How to read a sequence diagram

The lecturer focuses on the basics:

- Vertical lines are **lifelines**.
  - They represent timelines for the agents or participants.
- Arrows between lifelines are **messages/interactions**.
  - The direction of the arrow shows who sends the message to whom.
- Read the diagram **from top to bottom**.
  - Earlier messages appear higher up.
  - Later messages appear lower down.

**[EXAM FLAG]** The lecturer explicitly says the basics expected in the exam are:

- know that the vertical timelines/lifelines represent participants;
- read the diagram from top to bottom;
- understand that each arrow is an interaction from one agent to another.

**[EXAM FLAG]** The lecturer explicitly says students are **not** expected to know how to create arbitrary message sequence diagrams. If more complex features such as `alt` boxes are used in an exam question, their meaning will be explained in the question.

### 5.3 Worked example: FIPA protocol specification

The sequence diagram on the slide has two participants:

- `Initiator`
- `Participant`

The interaction proceeds as follows.

1. The **Initiator** sends:

```latex
Request
```

to the **Participant**.

2. Then an outer `Alt` box gives two possible branches:

   **Branch 1: refusal**

   ```latex
   Participant \rightarrow Initiator: Refuse
   ```

   This means the participant refuses the request.

   **Branch 2: agreement**

   ```latex
   Participant \rightarrow Initiator: Agree
   ```

   After agreement, a nested `Alt` box gives three possible outcomes:

   ```latex
   Participant \rightarrow Initiator: Fail
   ```

   or

   ```latex
   Participant \rightarrow Initiator: Inform\text{-}done
   ```

   or

   ```latex
   Participant \rightarrow Initiator: Inform\text{-}result
   ```

Interpretation:

- `Fail`: the agreed task failed.
- `Inform-done`: the task succeeded and there is nothing more to report.
- `Inform-result`: the task succeeded and a result is reported.

The lecturer emphasises that this describes the interaction at a high level. It does not require knowing the agents’ internals; by observing the message sequence, one can tell whether the protocol was followed.

### 5.4 Correct message sequences from the FIPA example

The diagram allows these high-level message traces:

```latex
Request,\ Refuse
```

```latex
Request,\ Agree,\ Fail
```

```latex
Request,\ Agree,\ Inform\text{-}done
```

```latex
Request,\ Agree,\ Inform\text{-}result
```

Any of these traces follows the diagram. A sequence such as:

```latex
Request,\ Inform\text{-}result
```

would not match the diagram, because `Inform-result` only appears after `Agree`.

---

## 6. Finite-State Machines

### 6.1 Key concept: finite-state machine

**Intuition.** A finite-state machine is a model where a system is always in one of a finite number of states. Observing or consuming a labelled event causes a transition to another state.

**Formal / slide definition.** A finite-state machine is a mathematical model of computation. It consists of:

- a finite set of states;
- a set of labelled transitions between states;
- some initial states;
- some accepting/final states.

For a deterministic finite-state machine, the lecture gives the tuple:

```latex
\langle \Sigma, S, s_0, \delta, F \rangle
```

where:

```latex
\Sigma
```

is the set of labels,

```latex
S
```

is the set of states,

```latex
s_0
```

is the initial state,

```latex
\delta : S \times \Sigma \rightarrow S
```

is the transition function, and

```latex
F
```

is the set of final states.

### 6.2 Transition labels

A label on a transition is something observed, generated, or consumed, depending on the application.

For communication protocols, labels are usually messages such as:

```latex
Offer(s,b)
```

or

```latex
Accept(b,s)
```

If the machine is in a state and the next observed message matches a defined transition, the protocol advances to the next state.

### 6.3 Partial transition function

The lecturer stresses that:

```latex
\delta
```

may be **partial**.

That means it does not need to define a transition for every possible label in every possible state.

If the current state is `s`, the observed label is `a`, and:

```latex
\delta(s,a)
```

is undefined, then something has gone wrong.

In the context of communication protocols, this means the protocol has failed: someone has done something incorrect in the enactment.

### 6.4 Algorithm: checking protocol compliance with an FSM

Given an FSM protocol:

```latex
\langle \Sigma, S, s_0, \delta, F \rangle
```

and an observed message trace:

```latex
m_1, m_2, \ldots, m_n
```

checking proceeds as follows.

1. Start in:

   ```latex
   current = s_0
   ```

2. For each observed message `m_i`:

   - if:

     ```latex
     \delta(current, m_i)
     ```

     is defined, update:

     ```latex
     current := \delta(current, m_i)
     ```

   - otherwise, the protocol enactment has failed.

3. When communication stops:

   - if:

     ```latex
     current \in F
     ```

     then the protocol has ended correctly;

   - if:

     ```latex
     current \notin F
     ```

     then the protocol has not ended correctly.

This is exactly the logic used in the lecture’s simple protocol example.

### 6.5 Worked example: simple seller-buyer protocol

The state diagram on the slides has states:

```latex
S0,\ S1,\ S2,\ S3
```

and messages involving seller `s` and buyer `b`. The diagram in the Agent Communication slides shows the same basic graph, while the Sequence/FSM deck later marks `S1` and `S3` as final states using double circles.

The graph transitions are:

```latex
S0 \xrightarrow{Offer(s,b)} S1
```

```latex
S1 \xrightarrow{Accept(b,s)} S2
```

```latex
S1 \xrightarrow{Reject(b,s)} S3
```

```latex
S2 \xrightarrow{Update(s,b)} S1
```

The formal representation from the slide is:

```latex
\Sigma = \{Offer(s,b), Accept(b,s), Update(s,b), Reject(b,s)\}
```

```latex
S = \{S0,S1,S2,S3\}
```

```latex
s_0 = S0
```

```latex
\delta(S0, Offer(s,b)) \rightarrow S1
```

```latex
\delta(S1, Accept(b,s)) \rightarrow S2
```

```latex
\delta(S1, Reject(b,s)) \rightarrow S3
```

```latex
\delta(S2, Update(b,s)) \rightarrow S1
```

```latex
F = \{S1,S3\}
```

[UNCLEAR: the diagram and `\Sigma` use `Update(s,b)`, but the formal transition on the slide uses `Update(b,s)`. This is likely a slide inconsistency; revise this part against the recording/slides.]

### 6.6 Correct and incorrect traces

Correct trace ending at `S1`:

```latex
Offer(s,b)
```

Reason:

```latex
S0 \xrightarrow{Offer(s,b)} S1
```

and `S1` is final.

Correct trace ending at `S3`:

```latex
Offer(s,b),\ Reject(b,s)
```

Reason:

```latex
S0 \xrightarrow{Offer(s,b)} S1
```

```latex
S1 \xrightarrow{Reject(b,s)} S3
```

and `S3` is final.

Correct trace with update:

```latex
Offer(s,b),\ Accept(b,s),\ Update(s,b)
```

Reason:

```latex
S0 \xrightarrow{Offer(s,b)} S1
```

```latex
S1 \xrightarrow{Accept(b,s)} S2
```

```latex
S2 \xrightarrow{Update(s,b)} S1
```

and `S1` is final.

Incorrect trace:

```latex
Accept(b,s)
```

Reason: from `S0`, only `Offer(s,b)` is defined. There is no transition:

```latex
\delta(S0, Accept(b,s))
```

so the protocol fails.

Incorrect stopping point:

```latex
Offer(s,b),\ Accept(b,s)
```

Reason:

```latex
S0 \rightarrow S1 \rightarrow S2
```

but `S2` is not final. If communication stops at `S2`, something has gone wrong.

### 6.7 Important note about syntactic correctness

The lecturer comments that the example is “slightly weird”: after the buyer accepts, the seller can update the offer, and the protocol can loop. The lecturer also says they wonder whether accept and reject should be the other way round in the textbook example.

But the key point is:

**A protocol does not need to be sensible to be syntactically correct.**

The protocol is still a well-formed finite-state machine.

**[EXAM FLAG]** The lecturer explicitly says students are expected to know the finite-state-machine tuple representation:

```latex
\langle \Sigma, S, s_0, \delta, F \rangle
```

and to understand what is going on if it appears in an exam question.

---

## 7. Commitments

### 7.1 Key concept: commitment

**Intuition.** A commitment records that one agent has promised another agent to bring about some condition if some triggering condition holds.

**Formal definition from the lecture.**

A commitment has the form:

```latex
C(debtor, creditor, antecedent, consequent)
```

where:

- `debtor` is the agent who owes the commitment;
- `creditor` is the agent to whom the commitment is owed;
- `antecedent` is a first-order formula;
- `consequent` is a first-order formula.

The meaning is:

> the debtor has committed to the creditor to make the consequent true if the antecedent holds.

The antecedent does not have to be something the creditor does. It may simply be some circumstance that occurs.

**[EXAM FLAG / IMPORTANT]** The slides call commitments “an important modern concept” in defining agent interaction protocols, and the lecturer says commitments are “definitely a very important concept” in multi-agent systems.

### 7.2 Detached commitments

A commitment becomes **detached** when:

- the antecedent holds;
- the consequent does not yet hold.

For:

```latex
C(x,y,r,u)
```

if:

```latex
r
```

holds and:

```latex
u
```

does not yet hold, the commitment is detached.

**Intuition.** The debtor now has to do something. The lecturer says detached commitments are perhaps the most important thing in these protocols because detachment drives action by the parties.

**[EXAM FLAG / IMPORTANT]** Know what detachment is and why it matters: detachment is the point at which the debtor becomes actively obliged to bring about the consequent.

### 7.3 Discharged commitments

A commitment is **discharged** when the consequent holds.

For:

```latex
C(x,y,r,u)
```

if:

```latex
u
```

holds, then the commitment is discharged.

**Intuition.** The commitment goes away because the promised outcome has been achieved.

### 7.4 Formal detachment step

The slide gives the key logical note:

If:

```latex
C(x,y,r,u)
```

is a commitment and it becomes detached, meaning:

```latex
r
```

holds, then:

```latex
C(x,y,\top,u)
```

is also a commitment.

Interpretation:

- `\top` means “true” or “trivially true”.
- So:

```latex
C(x,y,\top,u)
```

means `x` is now obliged to bring about `u`, without needing any further triggering condition.

### 7.5 Connection to norms

Commitments are related to norms because both involve obligation-like structures.

The lecturer says commitment violations can be detected similarly to norm violations. The monitoring idea is:

1. observe events in the environment;
2. map those events to institutionally meaningful facts/events;
3. detect when commitments appear, detach, or discharge;
4. monitor violations in a similar way to norm monitoring.

[UNCLEAR: the transcript garbles “institutional facts/events” as “institutional trust/choice”; check the recording for the exact term.]

---

## 8. Commitment Operations

The lecture introduces operations that make commitments appear, disappear, or change. These are used by protocols to define what messages mean.

### 8.1 `CREATE`

```latex
CREATE(x,y,r,u)
```

is performed by `x`.

Effect:

```latex
C(x,y,r,u)
```

holds.

Meaning: `x`, the debtor, creates a commitment to `y`, the creditor.

### 8.2 `CANCEL`

```latex
CANCEL(x,y,r,u)
```

is performed by `x`.

Effect: it stops:

```latex
C(x,y,r,u)
```

from holding.

Meaning: the debtor cancels the commitment.

Important restriction from the transcript: a protocol should not necessarily allow `x` to cancel whenever it feels like it. The protocol must define when cancellation is acceptable.

### 8.3 `RELEASE`

```latex
RELEASE(x,y,r,u)
```

is performed by `y`.

Effect: it stops:

```latex
C(x,y,r,u)
```

from holding.

Meaning: the creditor releases the debtor from the commitment.

The lecturer says this is generally acceptable because the person to whom the commitment is owed can say, in effect, “you no longer have to do that.”

### 8.4 `DELEGATE`

```latex
DELEGATE(x,y,z,r,u)
```

is performed by `x`.

Effect:

```latex
C(z,y,r,u)
```

holds.

Meaning: `x` delegates the commitment to `z`. `z` now has a commitment to `y`.

The transcript adds an important nuance:

- the original commitment on `x` may still hold;
- `x` may be trying to discharge its own commitment by getting `z` to bring about `u`;
- if `z` brings about `u`, both `z`’s and `x`’s commitments may be discharged.

The protocol must define when and to whom delegation is acceptable.

### 8.5 `ASSIGN`

```latex
ASSIGN(x,y,z,r,u)
```

is performed by `y`.

Effect:

```latex
C(x,z,r,u)
```

holds.

Meaning: the creditor changes. `x` was committed to `y`, but `y` assigns the benefit of that commitment to `z`.

Intuition from the transcript:

- `x` made a commitment to `y`;
- `y` says `z`, not `y`, is now the party interested in the consequent;
- `x` must now do it for `z`.

### 8.6 `DECLARE`

```latex
DECLARE(x,y,r)
```

is performed by `x`.

Effect: `x` informs `y` that `r` holds.

The lecturer says this is not really a commitment operation, but it is used in many protocols. It can function as a way of saying “I’ve done it.”

Alternative: instead of a declaration message, agents could observe an event trace. If the right action appears in the event trace, everyone can know that `r` holds.

---

## 9. Commitment Protocol Example: E-Commerce Store and Customer

### 9.1 Protocol scope

The commitment example is a very simple interaction protocol for an e-commerce-style exchange between a store and a customer.

The lecturer explicitly says this protocol does **not** include conditions on when particular protocol parts can be performed. Instead, it gives meanings to messages in terms of commitment operations.

### 9.2 Message meanings as commitment operations

The slide defines the protocol as messages plus commitment operations.

#### `offer`

```latex
offer(Store, Customer, Price, Item)
```

means:

```latex
CREATE(Store, Customer, paid(Price), delivered(Item))
```

Meaning:

```latex
C(Store, Customer, paid(Price), delivered(Item))
```

The store commits to the customer that if the price is paid, the item will be delivered.

#### `accept`

```latex
accept(Customer, Store, Price, Item)
```

means:

```latex
CREATE(Customer, Store, delivered(Item), paid(Price))
```

Meaning:

```latex
C(Customer, Store, delivered(Item), paid(Price))
```

The customer commits to the store that if the item is delivered, the price will be paid.

The lecturer notes that this is the converse of the store’s offer commitment.

#### `reject`

```latex
reject(Customer, Store, Price, Item)
```

means:

```latex
RELEASE(Store, Customer, paid(Price), delivered(Item))
```

Meaning: the customer releases the store from the store’s commitment to deliver the item if the price is paid.

[UNCLEAR: the slide text for `reject` appears to be missing a closing parenthesis after `delivered(Item)`.]

#### `deliver`

```latex
deliver(Store, Customer, Item)
```

means:

```latex
DECLARE(Store, Customer, delivered(Item))
```

Meaning: the store declares to the customer that the item has been delivered.

#### `pay`

The slide gives:

```latex
pay(Customer, Store, Item)
```

means:

```latex
DECLARE(Customer, Store, paid(Item))
```

But the examples use messages such as:

```latex
pay(Price)
```

and:

```latex
pay(£12)
```

[UNCLEAR: the protocol definition uses `Item` in `pay(Customer, Store, Item)` and `paid(Item)`, while the rest of the protocol uses `paid(Price)` and the sequence diagrams use payment of a price. Re-listen/check slides for whether this should be `pay(Customer, Store, Price)` and `paid(Price)`.]

### 9.3 Worked example 1: offer, pay, deliver

The sequence diagram in the commitment example slide deck shows:

```latex
:EBook \rightarrow :Customer: offer(Price, Book)
```

```latex
:Customer \rightarrow :EBook: pay(Price)
```

```latex
:EBook \rightarrow :Customer: deliver(Book)
```

There is no `accept` or `reject` message in this enactment. It is still correct.

#### Step-by-step commitment state

**Step 1: offer**

```latex
offer(EBook, Customer, Price, Book)
```

creates:

```latex
C(EBook, Customer, paid(Price), delivered(Book))
```

The e-book store is committed to deliver the book if the customer pays the price.

**Step 2: pay**

```latex
pay(Customer, EBook, Price)
```

declares:

```latex
paid(Price)
```

This makes the antecedent of the store’s commitment true. Therefore the store’s commitment becomes detached:

```latex
C(EBook, Customer, paid(Price), delivered(Book))
```

becomes, in effect:

```latex
C(EBook, Customer, \top, delivered(Book))
```

The store is now obliged to deliver the book.

**Step 3: deliver**

```latex
deliver(EBook, Customer, Book)
```

declares:

```latex
delivered(Book)
```

This makes the consequent true, so the store’s commitment is discharged.

#### Why this enactment is correct

The customer did not need to send `accept`. The protocol gives meaning to messages; it does not require an `accept` message before payment. Payment itself detaches the store’s commitment, and delivery discharges it.

### 9.4 Worked example 2: offer, accept, deliver, pay

The sequence diagram in the commitment example slide deck shows:

```latex
:EBook \rightarrow :Customer: offer(£12, BraveNewWorld)
```

```latex
:Customer \rightarrow :EBook: accept(£12, BraveNewWorld)
```

```latex
:EBook \rightarrow :Customer: deliver(BraveNewWorld)
```

```latex
:Customer \rightarrow :EBook: pay(£12)
```

#### Step-by-step commitment state

**Step 1: offer**

```latex
offer(EBook, Customer, £12, BraveNewWorld)
```

creates:

```latex
C(EBook, Customer, paid(£12), delivered(BraveNewWorld))
```

The store commits to deliver *Brave New World* if £12 is paid.

**Step 2: accept**

```latex
accept(Customer, EBook, £12, BraveNewWorld)
```

creates:

```latex
C(Customer, EBook, delivered(BraveNewWorld), paid(£12))
```

The customer commits to pay £12 if the store delivers the book.

**Step 3: deliver**

```latex
deliver(EBook, Customer, BraveNewWorld)
```

declares:

```latex
delivered(BraveNewWorld)
```

This has two effects:

1. The store’s commitment is discharged, because the consequent:

   ```latex
   delivered(BraveNewWorld)
   ```

   is true.

2. The customer’s commitment is detached, because its antecedent:

   ```latex
   delivered(BraveNewWorld)
   ```

   is true.

So the customer now has the detached commitment:

```latex
C(Customer, EBook, \top, paid(£12))
```

**Step 4: pay**

```latex
pay(Customer, EBook, £12)
```

declares:

```latex
paid(£12)
```

This discharges the customer’s commitment.

#### Why this enactment is correct

The store delivers before payment because it trusts the customer. This is still correct because the `accept` message created a customer-to-store commitment: if the store delivers, the customer will pay.

### 9.5 Main lesson from the commitment example

Both enactments are correct:

1. `offer`, `pay`, `deliver`
2. `offer`, `accept`, `deliver`, `pay`

The reason both are correct is that the protocol gives meanings to messages using commitment operations rather than imposing a single rigid message order. This gives agents flexibility, provided messages are correct when used.

**Connection.** This directly supports the earlier MAS protocol desideratum of flexibility: agents can fulfil the protocol in different ways while preserving observable correctness.

---

## 10. Argumentation and Games

### 10.1 Topic: argumentation in multi-agent systems

The lecture connects argumentation with game theory.

The starting point is that argumentation is useful for reconciling:

- different sources of information;
- different viewpoints;
- different proposed courses of action.

In a multi-agent system, each agent may have:

- privileged information;
- its own objectives;
- only partial knowledge of the whole situation.

Therefore, no individual agent initially knows the complete final argumentation framework. The argument graph must be built incrementally as agents communicate and attack one another’s arguments.

### 10.2 Key concept: argument graph built incrementally

**Intuition.** Instead of assuming a complete argument graph is already known, the agents reveal arguments during interaction.

Each agent contributes arguments and attacks:

- one agent proposes a course of action;
- another agent attacks it with a different argument;
- another agent may attack that attack;
- the graph grows as the dialogue proceeds.

This incremental construction is important because it matches the multi-agent setting: agents do not start with all arguments known.

### 10.3 Worked example: smart home system

The example is a smart home system that observes one of the children in the house smoking marijuana.

#### Legal agent

The legal agent argues:

- smoking marijuana is illegal;
- therefore, the police should be alerted.

This is a proposed course of action: contact the police.

#### Social agent

The social agent has a model of social norms and argues:

- this is bad behaviour by the child;
- the parents should be alerted;
- the parents should decide what to do.

This attacks the legal agent’s argument that the police should be alerted.

#### Legal agent repeats

The legal agent can repeat:

- this is illegal;
- the police should be alerted.

The lecturer explains that this creates a cycle in graph form, but when building an argument game as a tree, the repeated argument would continue down the tree as an infinite branch. The slide/lecture represents it compactly because there is limited space.

#### Privacy agent

The privacy agent argues:

- unless the system is absolutely legally obliged to contact the police, it should not contact the police unless requested by someone in the house.

This attacks the argument that the police should be alerted.

The lecturer frames this as a reasonable smart-home heuristic:

- if someone has been injured or murdered, the system may be obliged to contact police;
- for many other things, it should not contact police unless requested by the household.

#### Outcome

After the privacy agent’s argument, no further agents contribute anything. The system can then reason over the argumentation framework to decide which arguments are accepted.

[UNCLEAR: the transcript says the outcome is “not to contact the police, but to contact the police,” which is contradictory. From the surrounding explanation, the intended contrast is likely not contacting the police and instead contacting the parents, but the transcript must be checked.]

---

## 11. Argument Games

### 11.1 Key concept: argumentation as a game

**Intuition.** The agents are like players in a game. Each player tries to support a proposed course of action by putting forward arguments and attacking the other side’s arguments.

The lecture describes this using:

- arguments;
- attacks;
- dispute trees;
- disputes;
- strategies;
- winning strategies.

### 11.2 Key concept: dispute tree

**Intuition.** A dispute tree is a tree-shaped representation of an argument game.

The lecture contrasts two structures:

1. **Argument graph**
   - Cycles are possible.
   - Repeated attacks can form loops.

2. **Dispute tree**
   - Built from the argument graph.
   - Arguments may repeat.
   - A cycle in the graph becomes an infinite branch in the tree.

The root of the dispute tree is the initial argument. In the smart-home example, the initial argument is the legal agent’s argument that the police should be contacted.

### 11.3 Key concept: dispute

A **dispute** is a single branch of the dispute tree.

So if the dispute tree contains several possible lines of attack and defence, each path down the tree is a dispute.

### 11.4 Key concept: strategy

A strategy tells a player which arguments to make in response to possible attacks.

The lecturer’s intuition:

- one player wants to recommend a course of action;
- opponents attack;
- the player needs a way to defend all relevant arguments;
- a winning strategy shows how the player can respond so that the opponent cannot defeat the root argument.

### 11.5 Formal-ish definition: winning strategy

The transcript gives a garbled but recoverable definition.

Given:

- an argument graph;
- a dispute tree `T` with root argument `A`;
- a subtree `T'`;
- a set of disputes in that subtree, written here as:

```latex
D(T')
```

A subtree `T'` is a winning strategy for `A` if:

1. `D(T')` is non-empty and finite.

2. Each dispute in `D(T')` is finite.

3. Each dispute ends in an argument by [UNCLEAR: the transcript says “opponent,” but immediately explains that “the proponent has had the final say.” These conflict. Check the recording/slides.]

4. The strategy must not win merely because the opponent failed to make possible attacks. So, for a dispute branch that reaches a proponent argument, every possible attacking argument must be represented somewhere in the subtree.

The intuition of condition 4:

- if an argument can be attacked, the strategy must include a response to that possible attack;
- the opponent has “tried” all possible attacks in the subtree;
- if the proponent can still defend the root argument, then the proponent has a winning strategy.

The lecturer’s summary: as long as the proponent makes the arguments specified by the strategy, the opponent cannot defeat the proponent’s argument.

---

## 12. Dialogue Games

### 12.1 Key concept: dialogue game

**Intuition.** A dialogue game extends the abstract argument game by including more of the internal form of arguments.

Instead of treating arguments only as abstract nodes in a graph, a dialogue game can include logical forms such as:

- claiming `\phi`;
- asking why `\phi`;
- giving a reason `\psi` for `\phi`;
- attacking a contradiction or complement.

This allows the system to define what kinds of moves can attack what other moves, based on the logical content of the arguments.

### 12.2 Dialogue move: claiming `\phi`

A move can be:

```latex
claim(\phi)
```

Meaning: the agent asserts that `\phi` is the case.

The transcript says this can only be stated if `\phi` is [UNCLEAR: “disputed usable”] from the agent’s knowledge base. The intended term is likely something like derivable/provable/usable, but the transcript must be checked.

### 12.3 Dialogue move: asking why `\phi`

A move can be:

```latex
why(\phi)
```

Meaning: the agent asks why `\phi` is the case.

This attacks a bare claim of `\phi`. If an agent has claimed `\phi` without giving a reason, another agent can ask:

```latex
why(\phi)?
```

The lecture notes two variants:

- in some systems, an agent can only ask why `\phi` if it does not believe `\phi`;
- in other systems, an agent can ask why `\phi` even if it does believe `\phi`, because it wants the other agent’s reason.

### 12.4 Dialogue move: `\phi` since `\psi`

A move can be:

```latex
\phi \text{ since } \psi
```

Meaning: `\phi` is the case because `\psi` is the case.

This attacks:

```latex
why(\phi)
```

because it provides the requested reason.

The transcript also says it can attack an argument asserting the complement of `\phi`. The overline notation:

```latex
\overline{\phi}
```

means the negation of `\phi`, or at least something that contradicts `\phi`.

The move:

```latex
\phi \text{ since } \psi
```

can only be stated if the agent’s knowledge base contains the implication:

```latex
\psi \Rightarrow \phi
```

[UNCLEAR: the transcript garbles this section heavily: “wi fi” is `why \phi`, “five” is `\phi`, and “eight psi implies five” is `if \psi implies \phi`. Re-listen for the exact allowed attack relation.]

### 12.5 Connection to the textbook

The lecturer says the textbook has:

- more details on preventing infinite graphs caused by cycles;
- more dialogue-game moves;
- an example of an argument being built.

This lecture only sketches the idea.

---

## 13. Consolidated Exam Flags

### Sequence diagrams

**[EXAM FLAG]** Know the basics:

- lifelines are vertical timelines for participants;
- read the diagram top to bottom;
- arrows are interactions/messages from one participant to another.

**[EXAM FLAG]** You are not expected to know how to construct arbitrary message sequence diagrams. If an exam question uses things like `alt` boxes, their meaning will be explained.

### Finite-state machines

**[EXAM FLAG]** Know the deterministic FSM representation:

```latex
\langle \Sigma, S, s_0, \delta, F \rangle
```

with:

```latex
\delta : S \times \Sigma \rightarrow S
```

and know what each component means.

**[EXAM FLAG]** Understand that `\delta` may be partial. If no transition is defined for the observed message in the current state, the protocol has failed.

**[EXAM FLAG]** Understand final/accepting states: stopping in `F` is correct; stopping outside `F`, such as at `S2` in the worked example, is incorrect.

### Commitments

**[EXAM FLAG / IMPORTANT]** Commitments are an important modern concept for defining agent interaction protocols. Know:

```latex
C(debtor, creditor, antecedent, consequent)
```

and the roles of debtor, creditor, antecedent, and consequent.

**[EXAM FLAG / IMPORTANT]** Detached commitments drive action. A commitment is detached when the antecedent holds and the consequent does not yet hold.

**[EXAM FLAG / IMPORTANT]** Know the detachment transformation:

```latex
C(x,y,r,u),\ r \text{ holds}
\quad \Rightarrow \quad
C(x,y,\top,u)
```

Meaning: `x` is now obliged to bring about `u`.

**[EXAM FLAG]** Know the basic commitment operations:

```latex
CREATE,\ CANCEL,\ RELEASE,\ DELEGATE,\ ASSIGN,\ DECLARE
```

and who performs each operation.

### Protocol design

**[EXAM FLAG / HIGH VALUE]** A protocol should be:

- understandable to stakeholders;
- modifiable;
- composable;
- loosely coupled;
- flexible;
- precise;
- checkable from observation.

---

## 14. Unclear Sections to Revisit in the Recording/Slides

1. **Course code inconsistency**  
   [UNCLEAR] Main material is COMP64602, but the UML/FSM deck is COMP26120 and the commitment example is COMP64620.

2. **FIPA / ACL transcript garbling**  
   [UNCLEAR] Transcript says “FIFA ACM” in places; the slides clearly refer to FIPA ACL.

3. **Sequence diagram transcript garbling**  
   [UNCLEAR] Transcript says “sequence sagas” / “secrets diagrams”; the slides and context indicate sequence diagrams.

4. **FSM update argument order**  
   [UNCLEAR] The state diagram and `\Sigma` use:

   ```latex
   Update(s,b)
   ```

   but the formal transition slide gives:

   ```latex
   \delta(S2, Update(b,s)) \rightarrow S1
   ```

   Check whether this is a slide typo or intended.

5. **Simple protocol accept/reject oddness**  
   [UNCLEAR] The lecturer notes the protocol is slightly weird and wonders whether accept/reject should be the other way around in the textbook example. The lecture says to take the protocol as given.

6. **Commitment example `pay` signature**  
   [UNCLEAR] The slide gives:

   ```latex
   pay(Customer, Store, Item) \mapsto DECLARE(Customer, Store, paid(Item))
   ```

   but the protocol and examples use payment of a price:

   ```latex
   paid(Price),\ pay(Price),\ pay(£12)
   ```

   Check whether the slide should say `Price` rather than `Item`.

7. **Commitment example `reject` parenthesis**  
   [UNCLEAR] The slide appears to omit a closing parenthesis in the `RELEASE(...)` expression.

8. **Commitments and institutions wording**  
   [UNCLEAR] The transcript garbles the phrase around observing environment events and mapping them to institutional facts/events.

9. **Argumentation smart-home outcome**  
   [UNCLEAR] The transcript says the system decides “not to contact the police, but to contact the police.” The surrounding explanation indicates the intended outcome is probably not contacting police and instead contacting parents, but the recording should be checked.

10. **Winning strategy definition**  
    [UNCLEAR] The transcript says each dispute ends in an argument by the opponent, then explains that the proponent has had the final say. These conflict. Revisit the exact formal definition.

11. **Dialogue-game logical conditions**  
    [UNCLEAR] The transcript garbles the conditions for when an agent may claim `\phi`, ask `why(\phi)`, and assert `\phi` since `\psi`. Re-listen especially for the exact knowledge-base condition and attack relation.

---

## Source Files Used

- `Agent Communication.pdf`
- `ACLs.pdf`
- `ACLs-English (1).txt`
- `Sequence Diagrams and Finate State Machines.pdf`
- `Sequence Diagrams and Finite State Machines-English (1).txt`
- `Commitments-1.pdf`
- `Commitments (Correct)-English (1).txt`
- `Example.pdf`
- `Commitment Example-English (1).txt`
- `Arguments and Games-English (1)(1).txt`
