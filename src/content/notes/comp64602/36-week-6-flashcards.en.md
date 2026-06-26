---
subject: COMP64602
chapter: 36
title: "Week 6 — Flashcards"
language: en
---

# Week 6 — Flashcards

70 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> What does a communication protocol let you check in an agent interaction?</summary>

Use it as a rule for allowed message exchange:<br>1. Identify the participating agents.<br>2. List the message types the protocol permits.<br>3. Check whether the observed messages occur in an allowed order.<br>4. Treat a message outside the specification as a protocol violation.<br>Reference: A communication protocol specifies a sequence of messages to be exchanged between agents.

</details>

<details>
<summary><strong>Q2.</strong> Why do MAS protocols need observable meaning?</summary>

Use this test: could an external monitor decide compliance from messages/events alone?<br>1. If yes, the protocol is checkable.<br>2. If no, and it needs hidden beliefs/goals, it is weak for external monitoring.<br>3. Still allow agents to use the protocol internally to guide action.<br>Reference: MAS protocols should guide autonomous agents and allow observable violations.

</details>

<details>
<summary><strong>Q3.</strong> Protocol design checklist: what should a good MAS protocol satisfy?</summary>

Check the specification against these desiderata:<br>1. Stakeholders can understand the terms.<br>2. Developers can modify and inspect changes easily.<br>3. It composes with other protocols.<br>4. Agents remain loosely coupled.<br>5. It avoids unnecessary constraints on implementation.<br>6. Compliance is precise and observable.<br>Reference: The lecture lists stakeholder understandability, modifiability, composability, loose coupling, flexibility, precision, and checkability.

</details>

<details>
<summary><strong>Q4.</strong> Flexibility discriminator: does the protocol constrain behaviour or only observable interaction?</summary>

Ask: are two agents with different internal methods still compliant if their observable messages match?<br>1. If yes, the protocol is flexible.<br>2. If no, it may over-specify implementation details.<br>3. Prefer constraining message-level meaning, not private decision procedures.<br>Reference: Flexibility means minimising unnecessary constraints on how an agent fulfils the protocol.

</details>

<details>
<summary><strong>Q5.</strong> Checkability discriminator: can compliance be judged without inspecting private internals?</summary>

Use this rule:<br>1. Base compliance on observable messages, events, and institutional facts.<br>2. Avoid making external correctness depend on hidden beliefs or intentions.<br>3. Use internal states only for implementation validation when the developer has access.<br>Reference: A protocol is checkable when compliance can be determined from observation.

</details>

<details>
<summary><strong>Q6.</strong> What is a communicative act?</summary>

Recognise it by asking: what is the sender trying to do with this content?<br>1. Separate the logical content from the communicative purpose.<br>2. The same content may inform, request, promise, or commit depending on the act.<br>3. Interpret the message using its purpose, not content alone.<br>Reference: A communicative act is a message with a communicative purpose.

</details>

<details>
<summary><strong>Q7.</strong> Logical content vs performative — what is the discriminator?</summary>

Ask: is this the proposition, or the instruction for interpreting it?<br>1. The logical content is the formula/proposition, such as φ.<br>2. The performative is the tag saying how φ should be understood.<br>3. Changing the performative can change the message meaning while leaving φ unchanged.<br>Reference: A performative is a tag attached to logical content that tells the receiver how to interpret it.

</details>

<details>
<summary><strong>Q8.</strong> How do you interpret a message of the form performative(φ)?</summary>

Procedure:<br>1. Read φ as the content being communicated.<br>2. Read the performative as the communicative force.<br>3. Apply the protocol/language rule for that performative.<br>4. Do not infer the force from φ alone.<br>Reference: Agent communication languages separate logical content from performative force.

</details>

<details>
<summary><strong>Q9.</strong> Fixed performatives vs domain-specific performatives — what decides the meaning?</summary>

Discriminator: is the performative part of a standard language, or defined by the domain protocol?<br>1. Fixed performatives have standard meanings supplied by the ACL.<br>2. Domain-specific performatives get their meaning from the protocol/context.<br>3. Never assume a domain-specific label has one universal meaning.<br>Reference: Fixed-performative ACLs provide a standard set; domain-specific performatives may carry protocol-specific meaning.

</details>

<details>
<summary><strong>Q10.</strong> When is a fixed-performative communication language useful but restrictive?</summary>

Use it when agents need shared standard message types.<br>1. Choose the language’s standard performatives for common acts.<br>2. Check whether the domain needs richer meanings.<br>3. If standard performatives cannot express needed commitments/nuance, define protocol-specific meanings.<br>Reference: Languages such as KQML use fixed performatives, but fixed sets can be restrictive.

</details>

<details>
<summary><strong>Q11.</strong> Can a domain-specific performative be interpreted from its name alone?</summary>

No. Use the protocol definition:<br>1. Locate the performative’s rule in the protocol.<br>2. Check whether it creates information, a request, a commitment, or another institutional effect.<br>3. Apply that defined effect to the interaction state.<br>Reference: The meaning of a domain-specific performative depends on the domain and protocol.

</details>

<details>
<summary><strong>Q12.</strong> What is FIPA ACL trying to add beyond a bare performative label?</summary>

Use it as an ACL with mental-state semantics:<br>1. Read the message performative and content.<br>2. Check the semantic rule tied to agent beliefs, knowledge, or intentions.<br>3. Use those rules to validate whether the sender is permitted to send that message.<br>Reference: FIPA ACL specifies message semantics in terms of agents’ internal mental states.

</details>

<details>
<summary><strong>Q13.</strong> How do you internally validate a FIPA-style outgoing message?</summary>

Procedure:<br>1. Identify the performative and content φ.<br>2. Find the mental-state precondition for that performative.<br>3. Check the sender’s own beliefs/knowledge/intentions satisfy it.<br>4. Send only if the semantic precondition holds.<br>Reference: In FIPA-style semantics, correctness can depend on beliefs and intentions, such as believing φ before telling φ or intending an action before promising it.

</details>

<details>
<summary><strong>Q14.</strong> FIPA critique: why is mental-state semantics hard to monitor externally?</summary>

Use the external-observer test:<br>1. Observe the message.<br>2. Ask whether the sender’s private belief/intention is visible.<br>3. If not, the observer cannot verify semantic correctness from the message alone.<br>Reference: The critique is that FIPA-style correctness may require inspecting internal agent states.

</details>

<details>
<summary><strong>Q15.</strong> Lecturer’s response to the FIPA critique: when are internal semantics still useful?</summary>

Use the distinction:<br>1. External monitoring prefers observable criteria.<br>2. Implementation validation can inspect the agent’s internals.<br>3. Internal semantics help developers verify that agents send messages only when their own mental-state conditions hold.<br>Reference: FIPA-style internal semantics are useful for validating implementations even if they are weak for external monitoring.

</details>

<details>
<summary><strong>Q16.</strong> External compliance vs implementation validation — what evidence is allowed?</summary>

Discriminator:<br>1. For external compliance, use observable traces and public facts.<br>2. For implementation validation, use code, beliefs, goals, intentions, or knowledge bases.<br>3. Do not confuse the two kinds of correctness evidence.<br>Reference: The lecture separates observable protocol checkability from internal FIPA-style validation.

</details>

<details>
<summary><strong>Q17.</strong> What is a UML sequence diagram used for in protocol specification?</summary>

Use it to read an ordered interaction:<br>1. Identify the participants/lifelines.<br>2. Read messages from top to bottom.<br>3. Use arrows to determine sender and receiver.<br>4. Use branch notation, if supplied, to identify alternatives.<br>Reference: Sequence diagrams illustrate a sequence of interactions between participants and are used to represent interaction protocols.

</details>

<details>
<summary><strong>Q18.</strong> How do you read lifelines and arrows in a sequence diagram?</summary>

Procedure:<br>1. Each vertical lifeline is one participant’s timeline.<br>2. Each arrow is a message/interaction.<br>3. The arrow direction gives sender → receiver.<br>4. Higher arrows happen before lower arrows.<br>Reference: Sequence diagrams are read top-to-bottom across participant lifelines.

</details>

<details>
<summary><strong>Q19.</strong> How do you check whether a trace matches a sequence diagram with alternatives?</summary>

Procedure:<br>1. Start at the top of the diagram.<br>2. Match each trace message to the next required arrow.<br>3. At an alternative, choose one permitted branch only.<br>4. For nested alternatives, resolve the inner branch after the outer branch is chosen.<br>5. Reject the trace if it skips a required earlier message or takes an unavailable branch.<br>Reference: Alternative branches specify permitted message-sequence choices within the diagram.

</details>

<details>
<summary><strong>Q20.</strong> Sequence diagram exam scope: what are you expected to know?</summary>

Know the basics only:<br>1. Lifelines are participants’ timelines.<br>2. Arrows are interactions/messages.<br>3. Read from top to bottom.<br>4. If advanced boxes appear, use the meaning given in the question.<br>Reference: The lecture flags basic sequence-diagram reading as examinable, not arbitrary construction of complex diagrams.

</details>

<details>
<summary><strong>Q21.</strong> Sequence diagram vs FSM — what is the discriminator?</summary>

Ask what form the protocol specification takes:<br>1. A sequence diagram is visual and interaction-order oriented.<br>2. An FSM is state-based and transition-function oriented.<br>3. Both can be used to check message traces.<br>Reference: FIPA uses sequence diagrams; finite-state machines provide a mathematical state-transition representation.

</details>

<details>
<summary><strong>Q22.</strong> What is a finite-state machine in protocol checking?</summary>

Use it as a trace recogniser:<br>1. Keep a current state.<br>2. Consume one observed message label at a time.<br>3. Follow the matching transition if defined.<br>4. Accept only if the trace ends in a final state.<br>Reference: An FSM has finite states, labelled transitions, initial state(s), and accepting/final states.

</details>

<details>
<summary><strong>Q23.</strong> FSM tuple: what does ⟨Σ, S, s₀, δ, F⟩ mean?</summary>

Read the tuple as:<br>1. Σ = set of labels/messages.<br>2. S = set of states.<br>3. s₀ = initial state.<br>4. δ: S × Σ → S = transition function.<br>5. F = set of final/accepting states.<br>Reference: The deterministic FSM representation is ⟨Σ, S, s₀, δ, F⟩.

</details>

<details>
<summary><strong>Q24.</strong> How do you construct an FSM tuple from a protocol state diagram?</summary>

Procedure:<br>1. Put every transition label into Σ.<br>2. Put every state node into S.<br>3. Identify the initial state s₀.<br>4. For each labelled arrow s --a→ s′, add δ(s,a)=s′.<br>5. Put every accepting/final state into F.<br>Reference: An FSM protocol is represented by ⟨Σ, S, s₀, δ, F⟩.

</details>

<details>
<summary><strong>Q25.</strong> What does a transition label mean in a communication-protocol FSM?</summary>

Use labels as observable events:<br>1. Read the next observed message as a label a ∈ Σ.<br>2. Check whether δ(current,a) is defined.<br>3. If defined, move to the target state.<br>4. If undefined, the enactment fails.<br>Reference: Transition labels are observed/generated/consumed labels; in protocols they are usually messages.

</details>

<details>
<summary><strong>Q26.</strong> Partial transition function: what happens if δ(s,a) is undefined?</summary>

Discriminator: is there a defined transition from the current state for the observed label?<br>1. If δ(s,a) exists, update the current state.<br>2. If δ(s,a) is undefined, the protocol has failed at that message.<br>3. Do not invent a transition just because the label exists elsewhere.<br>Reference: δ may be partial; not every label is defined in every state.

</details>

<details>
<summary><strong>Q27.</strong> Algorithm: how do you check protocol compliance with an FSM?</summary>

Procedure:<br>1. Set current := s₀.<br>2. For each observed message mᵢ, check δ(current,mᵢ).<br>3. If defined, set current := δ(current,mᵢ).<br>4. If undefined, reject the trace immediately.<br>5. After the final message, accept only if current ∈ F.<br>Reference: FSM compliance checking consumes the trace through δ and then checks final-state membership.

</details>

<details>
<summary><strong>Q28.</strong> How do you diagnose an incorrect FSM trace?</summary>

Procedure:<br>1. Simulate from s₀ message by message.<br>2. If a transition is undefined, report the first illegal message and state.<br>3. If all transitions are defined but current ∉ F at stopping time, report an incorrect/incomplete stopping state.<br>Reference: Protocol failure can be caused by an undefined transition or by stopping outside F.

</details>

<details>
<summary><strong>Q29.</strong> Undefined transition vs non-final stopping state — what is the discriminator?</summary>

Ask where the failure occurs:<br>1. Undefined transition: the trace contains a message not allowed from the current state.<br>2. Non-final stopping: every message was allowed, but communication stopped in a non-accepting state.<br>Reference: δ undefined gives immediate failure; current ∉ F after the trace means the protocol did not end correctly.

</details>

<details>
<summary><strong>Q30.</strong> Does a protocol have to be sensible to be syntactically correct?</summary>

No. Check form before usefulness:<br>1. If states, labels, transitions, initial state, and final states are well-defined, it can be a valid FSM.<br>2. The allowed behaviour may still be odd or undesirable.<br>3. Syntactic correctness does not imply good protocol design.<br>Reference: A protocol can be a well-formed FSM even if its interaction pattern is strange.

</details>

<details>
<summary><strong>Q31.</strong> What is a commitment C(x,y,r,u)?</summary>

Read it by roles:<br>1. x is the debtor: the agent who owes the commitment.<br>2. y is the creditor: the agent to whom it is owed.<br>3. r is the antecedent/trigger.<br>4. u is the consequent/outcome to be brought about.<br>Reference: C(debtor, creditor, antecedent, consequent) means the debtor commits to the creditor to make the consequent true if the antecedent holds.

</details>

<details>
<summary><strong>Q32.</strong> How do you apply a commitment to decide who must act?</summary>

Procedure:<br>1. Identify debtor x and creditor y.<br>2. Check whether antecedent r holds.<br>3. Check whether consequent u already holds.<br>4. If r holds and u does not, x now has an active obligation to bring about u.<br>Reference: In C(x,y,r,u), x must make u true for y if r holds.

</details>

<details>
<summary><strong>Q33.</strong> Does the antecedent of a commitment have to be an action by the creditor?</summary>

No. Use the formula directly:<br>1. Treat the antecedent r as any first-order condition/circumstance.<br>2. It may be caused by the creditor, debtor, another agent, or the environment.<br>3. Detachment depends on r holding, not on who caused r.<br>Reference: The antecedent of C(debtor, creditor, antecedent, consequent) need not be something the creditor does.

</details>

<details>
<summary><strong>Q34.</strong> Detached vs discharged commitment — what is the discriminator?</summary>

Ask which formula has become true:<br>1. Detached: antecedent r holds, but consequent u does not yet hold.<br>2. Discharged: consequent u holds.<br>3. Detached means the debtor now needs to act; discharged means the commitment goes away.<br>Reference: C(x,y,r,u) detaches when r holds and u does not; it discharges when u holds.

</details>

<details>
<summary><strong>Q35.</strong> How do you perform the formal detachment step?</summary>

Procedure:<br>1. Start with C(x,y,r,u).<br>2. Observe that r holds.<br>3. Replace the antecedent with ⊤.<br>4. Read C(x,y,⊤,u) as an unconditional active obligation to bring about u.<br>Reference: C(x,y,r,u) plus r holding yields C(x,y,⊤,u).

</details>

<details>
<summary><strong>Q36.</strong> What does ⊤ mean in a detached commitment?</summary>

Use it as a trivial trigger:<br>1. ⊤ means true.<br>2. C(x,y,⊤,u) has no remaining triggering condition.<br>3. The debtor is now simply obliged to bring about u.<br>Reference: Detachment replaces the antecedent with ⊤.

</details>

<details>
<summary><strong>Q37.</strong> How are commitments connected to norms?</summary>

Monitor them similarly:<br>1. Observe messages/events.<br>2. Map them to institutional facts.<br>3. Update commitments as created, detached, discharged, cancelled, released, delegated, or assigned.<br>4. Detect violations using the protocol’s obligation rules.<br>Reference: Commitments are obligation-like structures and can be monitored similarly to norm violations.

</details>

<details>
<summary><strong>Q38.</strong> What are commitment operations used for in protocols?</summary>

Use them to define message meaning:<br>1. For each message type, state which commitment operation it performs.<br>2. Apply the operation to the commitment state when the message occurs.<br>3. Judge enactments by the resulting commitments/facts, not just by rigid message order.<br>Reference: Commitment operations make commitments appear, disappear, or change.

</details>

<details>
<summary><strong>Q39.</strong> CREATE(x,y,r,u): who performs it and what is the effect?</summary>

Method:<br>1. Identify x as the performer/debtor.<br>2. Identify y as the creditor.<br>3. Add C(x,y,r,u) to the commitment state.<br>Reference: CREATE(x,y,r,u), performed by x, causes C(x,y,r,u) to hold.

</details>

<details>
<summary><strong>Q40.</strong> CANCEL(x,y,r,u): who performs it and what is the effect?</summary>

Method:<br>1. Check that x is the debtor/performer.<br>2. Check whether the protocol permits cancellation in the current context.<br>3. Remove C(x,y,r,u) if cancellation is allowed.<br>Reference: CANCEL(x,y,r,u), performed by x, stops C(x,y,r,u) from holding.

</details>

<details>
<summary><strong>Q41.</strong> RELEASE(x,y,r,u): who performs it and what is the effect?</summary>

Method:<br>1. Check that y is the creditor/performer.<br>2. Remove C(x,y,r,u).<br>3. Read this as the creditor freeing the debtor from the commitment.<br>Reference: RELEASE(x,y,r,u), performed by y, stops C(x,y,r,u) from holding.

</details>

<details>
<summary><strong>Q42.</strong> CANCEL vs RELEASE — who has the authority?</summary>

Discriminator:<br>1. CANCEL is performed by the debtor x.<br>2. RELEASE is performed by the creditor y.<br>3. Cancellation may need protocol restrictions; release is naturally by the party owed the commitment.<br>Reference: CANCEL(x,y,r,u) is debtor-performed; RELEASE(x,y,r,u) is creditor-performed.

</details>

<details>
<summary><strong>Q43.</strong> DELEGATE(x,y,z,r,u): what changes?</summary>

Method:<br>1. Identify x as the original debtor/delegator.<br>2. Identify z as the new debtor.<br>3. Add C(z,y,r,u).<br>4. Check the protocol to see whether C(x,y,r,u) also remains.<br>Reference: DELEGATE(x,y,z,r,u), performed by x, creates C(z,y,r,u).

</details>

<details>
<summary><strong>Q44.</strong> ASSIGN(x,y,z,r,u): what changes?</summary>

Method:<br>1. Identify y as the original creditor/performer.<br>2. Identify z as the new creditor.<br>3. Add C(x,z,r,u).<br>4. Read this as transferring the benefit of the commitment from y to z.<br>Reference: ASSIGN(x,y,z,r,u), performed by y, creates C(x,z,r,u).

</details>

<details>
<summary><strong>Q45.</strong> DELEGATE vs ASSIGN — what is the discriminator?</summary>

Ask which role changes:<br>1. DELEGATE changes the debtor: x’s obligation is passed/extended to z as debtor.<br>2. ASSIGN changes the creditor: y transfers the benefit to z.<br>3. Delegation is debtor-driven; assignment is creditor-driven.<br>Reference: DELEGATE(x,y,z,r,u) gives C(z,y,r,u); ASSIGN(x,y,z,r,u) gives C(x,z,r,u).

</details>

<details>
<summary><strong>Q46.</strong> DECLARE(x,y,r): how do you use it in a commitment protocol?</summary>

Method:<br>1. Treat r as a newly declared fact between x and y.<br>2. Add r to the interaction facts if the protocol accepts the declaration.<br>3. Re-check commitments: r may detach commitments where it is an antecedent or discharge commitments where it is a consequent.<br>Reference: DECLARE(x,y,r), performed by x, informs y that r holds; it is used in protocols though not really a commitment operation.

</details>

<details>
<summary><strong>Q47.</strong> DECLARE vs commitment operation — what is the discriminator?</summary>

Ask whether the move directly changes a commitment or asserts a fact:<br>1. CREATE/CANCEL/RELEASE/DELEGATE/ASSIGN directly alter commitments.<br>2. DECLARE asserts that r holds.<br>3. A declaration can indirectly detach or discharge commitments by making r true.<br>Reference: DECLARE is not really a commitment operation, but it is used by many protocols.

</details>

<details>
<summary><strong>Q48.</strong> How do you analyse a commitment-based trace?</summary>

Procedure:<br>1. Start with an empty or given commitment state.<br>2. For each message, apply its protocol-defined operation.<br>3. Add declared facts when DECLARE occurs.<br>4. After each fact update, detach commitments whose antecedents now hold.<br>5. Discharge commitments whose consequents now hold.<br>6. Check whether any remaining detached commitments are unresolved under the protocol rules.<br>Reference: Commitment protocols define message meanings through commitment operations and facts.

</details>

<details>
<summary><strong>Q49.</strong> Why can a commitment protocol allow different message orders?</summary>

Use commitment semantics instead of fixed ordering:<br>1. Check what commitments each message creates.<br>2. Check what facts each message declares.<br>3. If all detached commitments are eventually discharged, the enactment can be correct even if the order differs from another correct enactment.<br>Reference: Commitment-based protocols can preserve observable correctness while allowing flexible enactments.

</details>

<details>
<summary><strong>Q50.</strong> Generic enactment pattern: CREATE C(x,y,r,u), then DECLARE(r), then DECLARE(u). What happens?</summary>

Step-by-step:<br>1. CREATE adds C(x,y,r,u).<br>2. DECLARE(r) makes the antecedent true, so the commitment detaches to C(x,y,⊤,u).<br>3. DECLARE(u) makes the consequent true, so the commitment discharges.<br>Reference: Detachment occurs when the antecedent holds; discharge occurs when the consequent holds.

</details>

<details>
<summary><strong>Q51.</strong> Generic reciprocal enactment: C(x,y,r,u) and C(y,x,u,r). How do declarations update them?</summary>

Step-by-step:<br>1. C(x,y,r,u) says x owes u if r.<br>2. C(y,x,u,r) says y owes r if u.<br>3. DECLARE(u) discharges x’s commitment and detaches y’s commitment.<br>4. DECLARE(r) discharges y’s commitment and would also detach/discharge x’s commitment if still relevant.<br>Reference: Reciprocal commitments can make either party’s performance trigger the other party’s obligation.

</details>

<details>
<summary><strong>Q52.</strong> Rigid sequence protocol vs commitment-based protocol — what is the discriminator?</summary>

Ask what determines correctness:<br>1. A rigid sequence protocol accepts only specified message orders.<br>2. A commitment-based protocol assigns social meaning to messages and checks resulting commitments/facts.<br>3. Commitment-based correctness can allow multiple valid enactments.<br>Reference: The lecture’s commitment lesson is that protocols can define message meanings rather than impose a single rigid order.

</details>

<details>
<summary><strong>Q53.</strong> What is argumentation used for in multi-agent systems?</summary>

Use it when agents must resolve competing inputs:<br>1. Agents contribute arguments for or against courses of action.<br>2. Other agents attack or defend those arguments.<br>3. The system reasons over the resulting framework to decide what is accepted.<br>Reference: Argumentation helps reconcile different information sources, viewpoints, and proposed actions in MAS.

</details>

<details>
<summary><strong>Q54.</strong> Why is the argument graph built incrementally in MAS?</summary>

Reasoning procedure:<br>1. Assume no single agent has all information initially.<br>2. Let agents reveal arguments and attacks during dialogue.<br>3. Add each new argument/attack to the graph.<br>4. Evaluate acceptance over the graph once enough interaction has occurred.<br>Reference: In MAS, agents may have privileged information, objectives, and partial knowledge, so the argument graph grows through communication.

</details>

<details>
<summary><strong>Q55.</strong> How do arguments and attacks update an argument graph?</summary>

Procedure:<br>1. Add a node for each argument introduced.<br>2. Add a directed attack edge from an attacking argument to the argument it challenges.<br>3. Allow later arguments to attack earlier arguments or attacks.<br>4. Remember cycles may occur.<br>Reference: Agents incrementally contribute arguments and attacks, growing the argument graph.

</details>

<details>
<summary><strong>Q56.</strong> Argument graph vs dispute tree — what is the discriminator?</summary>

Ask whether repetition/cycles are represented compactly or unfolded:<br>1. An argument graph can contain cycles.<br>2. A dispute tree is tree-shaped and may repeat arguments.<br>3. A cycle in the graph can become an infinite branch in the tree.<br>Reference: A dispute tree is built from the argument graph; graph cycles can unfold into infinite tree branches.

</details>

<details>
<summary><strong>Q57.</strong> What is the root of a dispute tree?</summary>

Use it as the starting claim:<br>1. Choose the initial argument being defended or challenged.<br>2. Place it at the root.<br>3. Expand attacks and defences below it.<br>Reference: The root of the dispute tree is the initial argument.

</details>

<details>
<summary><strong>Q58.</strong> What is a dispute?</summary>

Recognise it as one line through the tree:<br>1. Start at the root of the dispute tree.<br>2. Follow one branch through attacks and responses.<br>3. That branch/path is a dispute.<br>Reference: A dispute is a single branch of a dispute tree.

</details>

<details>
<summary><strong>Q59.</strong> What is a strategy in an argument game?</summary>

Use it as a response plan:<br>1. Identify possible attacks by the opponent.<br>2. Specify which argument the player will give in response to each relevant attack.<br>3. Ensure the plan defends the root argument across the relevant branches.<br>Reference: A strategy tells a player which arguments to make in response to possible attacks.

</details>

<details>
<summary><strong>Q60.</strong> Strategy vs winning strategy — what is the discriminator?</summary>

Ask whether the response plan actually guarantees defence:<br>1. A strategy is any specified response plan.<br>2. A winning strategy covers the opponent’s possible attacks and still leaves the root argument undefeated.<br>3. It must not win merely because a possible attack was ignored.<br>Reference: A winning strategy is a subtree showing that the proponent can respond so the opponent cannot defeat the root argument.

</details>

<details>
<summary><strong>Q61.</strong> How do you check the lecture’s winning-strategy conditions at a high level?</summary>

Procedure:<br>1. Choose the dispute tree T and root argument A.<br>2. Choose a subtree T′ as the proposed strategy.<br>3. Check that D(T′) is non-empty and finite.<br>4. Check each dispute in D(T′) is finite.<br>5. Check the subtree represents all possible attacks against relevant proponent arguments.<br>6. Conclude winning only if the proponent can defend A after those attacks.<br>Reference: A winning strategy is a finite defensive subtree covering the opponent’s possible attacks; the transcript’s exact final-speaker condition was flagged unclear.

</details>

<details>
<summary><strong>Q62.</strong> Why must a winning strategy include all possible attacks?</summary>

Reason:<br>1. A proponent should not win just because the opponent’s attack was omitted from the model.<br>2. For each proponent argument that can be attacked, the strategy must account for those attacks.<br>3. If the proponent can still defend the root, the strategy is winning.<br>Reference: The lecture says the strategy must not win merely because the opponent failed to make possible attacks.

</details>

<details>
<summary><strong>Q63.</strong> What is a dialogue game?</summary>

Use it when argument moves have logical form:<br>1. Treat moves as structured acts such as claim(φ), why(φ), or φ since ψ.<br>2. Use the protocol rules to decide which moves attack or answer which other moves.<br>3. Use logical content to determine allowed attacks and defences.<br>Reference: A dialogue game extends abstract argument games by including the internal logical form of arguments.

</details>

<details>
<summary><strong>Q64.</strong> Abstract argument game vs dialogue game — what is the discriminator?</summary>

Ask whether arguments are opaque nodes or structured logical moves:<br>1. Abstract argument games use arguments and attacks at graph level.<br>2. Dialogue games include moves with formulas and reasons.<br>3. Dialogue games can define attacks using logical relations such as support or contradiction.<br>Reference: Dialogue games include moves like claiming φ, asking why φ, and giving ψ as a reason for φ.

</details>

<details>
<summary><strong>Q65.</strong> Dialogue move claim(φ): how do you use it?</summary>

Method:<br>1. Treat claim(φ) as the agent asserting φ.<br>2. Check the dialogue protocol’s permission condition for making the claim.<br>3. Allow other agents to challenge it, for example by asking why(φ).<br>Reference: claim(φ) means the agent asserts that φ is the case; the exact knowledge-base condition was flagged unclear in the transcript.

</details>

<details>
<summary><strong>Q66.</strong> Dialogue move why(φ): what does it attack?</summary>

Method:<br>1. Use why(φ) when an agent asks for a reason for φ.<br>2. Treat it as an attack/challenge to an unsupported or bare claim(φ).<br>3. Depending on the dialogue system, it may require disbelief of φ or may simply request the other agent’s reason.<br>Reference: why(φ) asks why φ is the case and attacks a bare claim of φ.

</details>

<details>
<summary><strong>Q67.</strong> Dialogue move φ since ψ: how does it function?</summary>

Method:<br>1. Read it as giving ψ as the reason for φ.<br>2. Use it to answer or attack why(φ).<br>3. Check that the agent’s knowledge base supports ψ ⇒ φ under the dialogue rules.<br>4. It may also attack a contradictory/complementary claim.<br>Reference: φ since ψ means φ holds because ψ holds, and can be stated only when the protocol’s support condition is met.

</details>

<details>
<summary><strong>Q68.</strong> What does overline φ mean in dialogue-game notation?</summary>

Use it as a contradiction marker:<br>1. Read overline φ as not-φ or a formula contradicting φ.<br>2. A move supporting φ can attack a move supporting overline φ.<br>3. Apply the exact attack relation specified by the dialogue rules.<br>Reference: The overline notation denotes the negation or complement/contradiction of φ.

</details>

<details>
<summary><strong>Q69.</strong> How do dialogue moves create attacks and defences?</summary>

Procedure:<br>1. claim(φ) introduces φ.<br>2. why(φ) challenges the need for support for φ.<br>3. φ since ψ answers why(φ) by giving ψ as support.<br>4. Claims or reasons can attack contradictory complements.<br>Reference: Dialogue games define move types and attack relations using logical content.

</details>

<details>
<summary><strong>Q70.</strong> When the argument dialogue stops, what is evaluated?</summary>

Procedure:<br>1. Take the argument graph/tree built so far.<br>2. Apply the chosen argumentation semantics or game criterion.<br>3. Decide which arguments or proposed actions are accepted.<br>Reference: After agents stop contributing, the system reasons over the constructed argumentation framework.

</details>
