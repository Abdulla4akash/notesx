---
subject: COMP64602
chapter: 39
title: "Week 9 — Flashcards"
language: en
---

# Week 9 — Flashcards

57 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> How do you recognise a multi-agent planning problem?</summary>

Use this check:<br>1. Ask whether more than one agent or effector can act.<br>2. Check whether actions may happen in parallel.<br>3. Check whether one agent’s action can change a condition another agent relies on.<br>4. If yes, coordination is needed to avoid interference.<br><br>Reference: multi-agent planning is planning involving more than one agent; its extra feature is possible parallel action, and its core issue is interference between plans.

</details>

<details>
<summary><strong>Q2.</strong> What is the main coordination problem in multi-agent planning?</summary>

Use this check:<br>1. Identify each agent’s intended actions.<br>2. Identify shared objects, resources, or state conditions.<br>3. Ask: could one agent’s action remove, change, or pre-empt something another agent needs?<br>4. If yes, the plans interfere and need coordination, communication, or replanning.<br><br>Reference: multi-agent planning requires reasoning about interaction, interference, communication, uncertainty, and replanning, not merely adding more actions.

</details>

<details>
<summary><strong>Q3.</strong> Centralised planning: when is this the approach?</summary>

Discriminator: is there one planner that knows all agents’ capabilities and sends each agent its plan?<br><br>Method:<br>1. Put all agents and possible interactions into one planning problem.<br>2. Construct plans for the agents centrally.<br>3. Communicate each plan to its assigned agent.<br>4. Use this when avoiding inter-agent interference before execution is the priority.<br><br>Reference: a centralised planner constructs and communicates plans for all agents; it reduces interference but is computationally expensive and less flexible under failure.

</details>

<details>
<summary><strong>Q4.</strong> Centralised planning with goal decomposition: how do you recognise it?</summary>

Discriminator: does the central planner assign high-level goals/plans while agents fill in local details?<br><br>Method:<br>1. Central planner decomposes the overall task into high-level goals or abstract plans.<br>2. Each agent locally plans lower-level details.<br>3. Check for low-level interference not anticipated at the high level.<br><br>Reference: hierarchical centralised planning coordinates at a high level while leaving lower-level planning to agents.

</details>

<details>
<summary><strong>Q5.</strong> No central planner, conflicts resolved as they arise: how do you recognise it?</summary>

Discriminator: do agents plan locally and only deal with conflicts during execution?<br><br>Method:<br>1. Let each agent form its own plan.<br>2. Execute without prior global coordination.<br>3. When interference occurs, replan or resolve the conflict locally.<br><br>Reference: this approach has low infrastructure and communication cost but high risk of interference and replanning.

</details>

<details>
<summary><strong>Q6.</strong> Local plans plus communication/negotiation: how do you recognise it?</summary>

Discriminator: do agents plan locally but communicate to agree on a joint plan before or during execution?<br><br>Method:<br>1. Each agent proposes or forms a local plan.<br>2. Agents exchange plan information.<br>3. Negotiate changes until a compatible joint plan is reached.<br><br>Reference: communication/negotiation reduces interference but needs protocol infrastructure and may take time to converge.

</details>

<details>
<summary><strong>Q7.</strong> What multi-agent planning approach do these lectures focus on?</summary>

Use this sequence:<br>1. Agents form local partial-order plans.<br>2. Plans are communicated or collected.<br>3. A central component merges them into a global plan.<br>4. Conflicts and redundant steps are handled using POCL machinery.<br><br>Reference: the lecture path is partial-order planning → POCL → parallel POCL → multi-agent parallel POCL.

</details>

<details>
<summary><strong>Q8.</strong> How do you use a partial-order plan?</summary>

Method:<br>1. List the plan steps.<br>2. Add an ordering only when one step must occur before another.<br>3. Leave independent steps unordered.<br>4. Later linearise the partial order into an executable order.<br><br>Reference: a partial-order plan records only orderings required for correctness; it does not impose arbitrary total order.

</details>

<details>
<summary><strong>Q9.</strong> Partial order vs total order: what is the discriminator?</summary>

Ask: must every pair of steps be ordered?<br><br>If yes, it is a total/fully ordered plan.<br>If no, and only necessary before/after constraints are recorded, it is a partial-order plan.<br><br>Reference: a partial-order plan leaves steps unordered when either order would work; a fully ordered plan fixes a complete sequence.

</details>

<details>
<summary><strong>Q10.</strong> How do you linearise a partial-order plan?</summary>

Method:<br>1. Take the set of steps S and temporal constraints \prec_T.<br>2. Choose an ordering of steps that respects every constraint s_i \prec_T s_j.<br>3. Do not place a consumer before a required provider.<br>4. In the parallel setting, group compatible unordered steps only if concurrency is allowed.<br><br>Reference: linearisation turns a partial-order plan into an executable ordered plan; parallel linearisation may also identify simultaneous steps.

</details>

<details>
<summary><strong>Q11.</strong> POMDP vs ordinary plan: what is the discriminator?</summary>

Ask: is the agent choosing actions under partial/probabilistic information about the state?<br><br>If yes, the solution is a policy, not a fixed plan.<br>If no, a fixed action sequence may be sufficient.<br><br>Reference: a POMDP is a Partially Observable Markov Decision Process; it models probabilistic outcomes and uncertain observations. The lecture says POMDPs are important but not covered here.

</details>

<details>
<summary><strong>Q12.</strong> Plan vs policy: how do you tell them apart?</summary>

Discriminator: does the next action depend on the current or believed state?<br><br>Plan: fixed sequence of actions.<br>Policy: rule mapping current/probable state to the next action.<br><br>Reference: a plan says what to do in order; a policy says what to do given the current or probable state.

</details>

<details>
<summary><strong>Q13.</strong> What does a POCL plan represent?</summary>

Use this checklist:<br>1. Plan steps: instantiated actions.<br>2. Causal links: which step provides which needed condition.<br>3. Temporal orderings: which steps must precede others.<br>4. Init and goal steps: represent initial and desired states.<br>5. Consistency flaws: open preconditions and conflicts to repair.<br><br>Reference: POCL stands for Partial Order Causal Link planning.

</details>

<details>
<summary><strong>Q14.</strong> How do you recognise a plan step?</summary>

Ask: is this a concrete instantiated action rather than an abstract operator schema?<br><br>Method:<br>1. Check that the action name is chosen.<br>2. Check that its objects/arguments are instantiated.<br>3. Treat it as an element of the plan step set S.<br><br>Reference: a plan step is an instantiated action in the plan.

</details>

<details>
<summary><strong>Q15.</strong> How do you form a causal link?</summary>

Method:<br>1. Choose a consumer step s_j with precondition c.<br>2. Find a provider step s_i such that c ∈ post(s_i).<br>3. Add the labelled link ⟨s_i, s_j, c⟩ to \prec_C.<br>4. Read it as: s_i establishes c for s_j.<br><br>Reference: a causal link records that one step establishes a condition needed by another step.

</details>

<details>
<summary><strong>Q16.</strong> How do you read a temporal ordering?</summary>

Method:<br>1. For ⟨s_i, s_j⟩ ∈ \prec_T, place s_i before s_j in every valid linearisation.<br>2. Use temporal orderings to enforce dependencies or prevent interference.<br><br>Reference: s_i \prec_T s_j means step s_i must happen before step s_j.

</details>

<details>
<summary><strong>Q17.</strong> How are init and goal steps used in POCL?</summary>

Method:<br>1. Add s_init to represent the starting state.<br>2. Put the initial state in post(s_init).<br>3. Add s_goal to represent the desired state.<br>4. Put the goal conditions in pre(s_goal).<br>5. Treat goal preconditions as open until supported by causal links.<br><br>Reference: post(s_init)=initial state; pre(s_goal)=goal state.

</details>

<details>
<summary><strong>Q18.</strong> What is the formal tuple for a POCL plan?</summary>

Use the tuple as a decoding checklist:<br>1. S = set of plan steps.<br>2. \prec_T = temporal partial order over S.<br>3. \prec_C = causal-link relation over S.<br>4. Temporal tuple: ⟨s_i, s_j⟩ means s_i \prec_T s_j.<br>5. Causal tuple: ⟨s_i, s_j, c⟩ means s_i provides c for s_j.<br><br>Reference: a POCL plan is ⟨S, \prec_T, \prec_C⟩.

</details>

<details>
<summary><strong>Q19.</strong> Temporal ordering vs causal link: what is the discriminator?</summary>

Ask: does the relation merely say before/after, or does it say one step supports a condition?<br><br>Temporal ordering: ⟨s_i, s_j⟩ ∈ \prec_T, meaning s_i before s_j.<br>Causal link: ⟨s_i, s_j, c⟩ ∈ \prec_C, meaning s_i provides condition c for s_j.<br><br>Reference: temporal orderings constrain time; causal links explain support.

</details>

<details>
<summary><strong>Q20.</strong> How do you detect an open precondition?</summary>

Method:<br>1. For every step s_j, list each precondition c ∈ pre(s_j).<br>2. Search \prec_C for a link ⟨s_i, s_j, c⟩.<br>3. If no such link exists for any suitable s_i, c is open for s_j.<br><br>Reference: an open precondition exists when s_j needs c but no selected causal link establishes c for s_j.

</details>

<details>
<summary><strong>Q21.</strong> How do you repair an open precondition?</summary>

Method:<br>1. Pick the open condition c of step s_j.<br>2. Find an existing step s_i with c ∈ post(s_i), or instantiate a new action step whose postcondition includes c.<br>3. Add ⟨s_i, s_j, c⟩ to \prec_C.<br>4. Continue until all preconditions are supported.<br><br>Reference: repairing an open precondition means selecting a provider step for the required condition.

</details>

<details>
<summary><strong>Q22.</strong> What is the search choice in repairing open preconditions?</summary>

Method:<br>1. You may choose open precondition flaws in any order.<br>2. For each open condition, different provider steps may be possible.<br>3. Each provider choice can branch the search.<br>4. A later conflict may show that a different support choice was needed.<br><br>Reference: flaw-selection order is flexible, but repair choice may require search.

</details>

<details>
<summary><strong>Q23.</strong> How do you detect a causal-link conflict?</summary>

Method:<br>1. Take a causal link ⟨s_i, s_j, c⟩.<br>2. Look for another step s_k with ¬c or not c in post(s_k).<br>3. Check whether some valid linearisation could place s_k between s_i and s_j.<br>4. If yes, s_k threatens the link.<br><br>Reference: a causal-link conflict occurs when a third step could occur between provider and consumer and negate the protected condition.

</details>

<details>
<summary><strong>Q24.</strong> How do you repair a causal-link conflict?</summary>

Method:<br>1. Identify the threatening step s_k for link ⟨s_i, s_j, c⟩.<br>2. Add an ordering that prevents s_k from lying between provider and consumer.<br>3. Either put s_k before the provider: ⟨s_k, s_i⟩ ∈ \prec_T.<br>4. Or put s_k after the consumer: ⟨s_j, s_k⟩ ∈ \prec_T.<br><br>Reference: repair uses temporal ordering to put the threatening step before the causal link starts or after it has been used.

</details>

<details>
<summary><strong>Q25.</strong> Open precondition vs causal-link conflict: what is the discriminator?</summary>

Ask: is support missing, or is existing support threatened?<br><br>Open precondition: no causal link provides required c for s_j.<br>Causal-link conflict: a causal link ⟨s_i, s_j, c⟩ exists, but another step may negate c between them.<br><br>Reference: open preconditions are missing-support flaws; causal-link conflicts are threat flaws.

</details>

<details>
<summary><strong>Q26.</strong> Why use a parallel POCL plan?</summary>

Method:<br>1. Use ordinary POCL to represent causal support and necessary orderings.<br>2. Add information about which steps must or must not occur together.<br>3. Use this when multiple agents or multiple effectors may execute actions simultaneously.<br><br>Reference: a parallel plan allows multiple actions to happen at once while still preserving POCL constraints.

</details>

<details>
<summary><strong>Q27.</strong> What is the formal tuple for a parallel POCL plan?</summary>

Use the tuple as a decoding checklist:<br>1. ⟨S, \prec_T, \prec_C⟩ is the embedded POCL plan.<br>2. # records non-concurrency.<br>3. = records required concurrency.<br>4. Both # and = are symmetric relations over steps.<br><br>Reference: a parallel POCL plan is ⟨S, \prec_T, \prec_C, #, =⟩.

</details>

<details>
<summary><strong>Q28.</strong> How do you use the non-concurrency relation #?</summary>

Method:<br>1. Check whether ⟨s_i, s_j⟩ ∈ #.<br>2. If yes, do not schedule s_i and s_j at the same time.<br>3. Use # for domain restrictions, shared resources, or incompatible simultaneous actions.<br><br>Reference: # is a symmetric non-concurrency relation; related steps must not be concurrent.

</details>

<details>
<summary><strong>Q29.</strong> How do you use the concurrency relation =?</summary>

Method:<br>1. Check whether ⟨s_i, s_j⟩ ∈ =.<br>2. If yes, schedule s_i and s_j at the same time in any valid parallel execution.<br>3. Check that this does not violate causal, temporal, or non-concurrency constraints.<br><br>Reference: = is a symmetric concurrency relation; related steps must occur concurrently.

</details>

<details>
<summary><strong>Q30.</strong> # vs =: what is the discriminator?</summary>

Ask: are the steps forbidden from overlapping, or required to overlap?<br><br># means must not be concurrent.<br>= means must be concurrent.<br><br>Reference: # is symmetric non-concurrency; = is symmetric concurrency.

</details>

<details>
<summary><strong>Q31.</strong> When are # and = filled in?</summary>

Method:<br>1. During planning, leave # or = empty unless the domain requires them.<br>2. During final linearisation, decide which unordered compatible steps can occur together.<br>3. Add # for domain-specific restrictions such as shared constrained resources.<br><br>Reference: the transcript says # and = may be filled during final linearisation rather than during initial planning.

</details>

<details>
<summary><strong>Q32.</strong> How do you detect a parallel step conflict?</summary>

Method:<br>1. Pick two steps s_i and s_j.<br>2. Check whether post(s_i) is inconsistent with post(s_j).<br>3. Check that neither s_i \prec_T s_j nor s_j \prec_T s_i holds.<br>4. Check that ⟨s_i, s_j⟩ ∉ #.<br>5. If all hold, they conflict as possible parallel steps.<br><br>Reference: a parallel step conflict is unordered, non-forbidden concurrency with inconsistent simultaneous effects.

</details>

<details>
<summary><strong>Q33.</strong> How do you repair a parallel step conflict?</summary>

Method:<br>1. Identify the unordered steps with inconsistent postconditions.<br>2. Prevent simultaneous execution by adding # or by sequencing them with a temporal ordering.<br>3. This repair can be left until a candidate solution plan has been chosen.<br><br>Reference: parallel step conflicts can be solved by making steps non-concurrent or by adding ordering.

</details>

<details>
<summary><strong>Q34.</strong> Parallel step conflict vs causal-link conflict: what is the discriminator?</summary>

Ask: is the problem simultaneous effects, or a threat across an interval?<br><br>Parallel step conflict: two unordered steps could occur together and have inconsistent postconditions.<br>Causal-link conflict: a third step could occur between provider and consumer and negate the condition in a causal link.<br><br>Reference: parallel conflicts are concurrency flaws; causal-link conflicts are causal-support threats.

</details>

<details>
<summary><strong>Q35.</strong> How do you build/recognise a multi-agent parallel POCL plan?</summary>

Method:<br>1. Start with each agent’s local POCL plan.<br>2. Combine the steps, causal links, and temporal links.<br>3. Add agent assignments for action steps.<br>4. Resolve open preconditions, causal-link conflicts, and parallel step conflicts.<br>5. Adjust causal links to remove redundant steps where possible.<br><br>Reference: a multi-agent parallel POCL plan extends parallel POCL by assigning steps to agents.

</details>

<details>
<summary><strong>Q36.</strong> What is the formal tuple for a multi-agent parallel POCL plan?</summary>

Use the tuple as a decoding checklist:<br>1. A = set of agents.<br>2. S = set of steps.<br>3. \prec_T = temporal orderings.<br>4. \prec_C = causal links.<br>5. # = non-concurrency; = = concurrency.<br>6. X = step-assignment relation.<br><br>Reference: M = ⟨A, S, \prec_T, \prec_C, #, =, X⟩.

</details>

<details>
<summary><strong>Q37.</strong> How do you read or add a step assignment?</summary>

Method:<br>1. Pick a plan step s.<br>2. Pick an agent a ∈ A responsible for executing it.<br>3. Add ⟨s, a⟩ to X.<br>4. Read it as: agent a executes step s.<br><br>Reference: X is the set of step-assignment tuples in a multi-agent parallel POCL plan.

</details>

<details>
<summary><strong>Q38.</strong> How are each agent’s initial state and goal represented?</summary>

Method:<br>1. Add an init_i step for agent i.<br>2. Put that agent’s initial-state features in post(init_i).<br>3. Add a goal_i step for agent i.<br>4. Put that agent’s conjunctive goal conditions in pre(goal_i).<br><br>Reference: multi-agent POCL models agents’ initial states using init steps and goals using goal steps.

</details>

<details>
<summary><strong>Q39.</strong> Local plan vs merged multi-agent plan: what is the discriminator?</summary>

Ask: does the structure contain one agent’s own plan, or the combined plan with assignments and inter-agent interactions?<br><br>Local plan: one agent’s POCL plan for its goals.<br>Merged multi-agent plan: combined steps/links/orders plus X assignments, with conflicts and redundancy considered across agents.<br><br>Reference: agents create local POCL plans; a central component can merge them into a global multi-agent parallel POCL plan.

</details>

<details>
<summary><strong>Q40.</strong> How do you test whether a step is redundant?</summary>

Method:<br>1. Choose candidate step s.<br>2. List every outgoing causal link ⟨s, s'', c⟩ where s provides c.<br>3. For each such c, find a replacement step s' in some R ⊆ S with c ∈ post(s').<br>4. If every provided condition can be supplied by replacement steps, s is redundant.<br><br>Reference: s is redundant when all causal contributions it makes can be made by other steps.

</details>

<details>
<summary><strong>Q41.</strong> How do you perform a causal-link adjustment?</summary>

Method:<br>1. Start with a causal link l = ⟨s_i, s_j, c⟩.<br>2. Find an alternative provider s_k with c ∈ post(s_k).<br>3. Check the temporal condition s_j \not\prec_T s_k.<br>4. Replace ⟨s_i, s_j, c⟩ with ⟨s_k, s_j, c⟩.<br><br>Reference: causal-link adjustment changes which step provides a condition to a consumer step.

</details>

<details>
<summary><strong>Q42.</strong> Why does causal-link adjustment require s_j \not\prec_T s_k?</summary>

Method check:<br>1. s_j is the consumer step that needs c.<br>2. s_k is the proposed new provider.<br>3. If s_j \prec_T s_k, then the consumer must occur before the provider.<br>4. A later provider cannot support an earlier consumer, so adjustment is invalid.<br><br>Reference: the condition s_j \not\prec_T s_k ensures the new provider is not forced to occur after the consumer.

</details>

<details>
<summary><strong>Q43.</strong> How do you remove a redundant step after merging plans?</summary>

Method:<br>1. Identify the candidate step s.<br>2. Adjust each outgoing causal link from s to alternative provider steps where valid.<br>3. Recheck that s no longer supports any needed causal link.<br>4. Remove s from the plan only after its causal work has been replaced.<br><br>Reference: redundancy removal is driven by causal-link adjustment, then deletion of steps that no longer contribute.

</details>

<details>
<summary><strong>Q44.</strong> Causal-link adjustment vs deleting a step: what is the discriminator?</summary>

Ask: has the step’s causal contribution already been transferred?<br><br>Adjustment: replace the provider in a causal link while preserving support for the consumer.<br>Deletion: remove a step only after it has no remaining needed causal links.<br><br>Reference: the examples show adjust links first, then remove redundant steps.

</details>

<details>
<summary><strong>Q45.</strong> What is total step cost in these lectures?</summary>

Method:<br>1. Count the plan steps under the lecture’s unit-cost assumption.<br>2. Compare plans by total number of steps.<br>3. Remember that richer frameworks could assign non-unit costs, but this lecture does not require that.<br><br>Reference: total step cost is the aggregate cost of plan steps; here it is simply the number of steps.

</details>

<details>
<summary><strong>Q46.</strong> Multi-Agent Plan Coordination by Plan Modification: what should you know?</summary>

Use this exam filter:<br>1. Do not memorise the exact algorithm as an examinable procedure.<br>2. Know the idea: search over causal-link adjustments.<br>3. Know how to identify a viable multi-agent parallel POCL plan.<br>4. Know how to identify whether a proposed change is a valid causal-link adjustment.<br><br>Reference: the slide marks the algorithm as Not Examinable; the expected skill is recognising viability and causal-link adjustment.

</details>

<details>
<summary><strong>Q47.</strong> What is the conceptual search pattern of the non-examinable plan-modification algorithm?</summary>

Method:<br>1. Start from an inconsistent multi-agent parallel plan.<br>2. Put candidate plans in a queue.<br>3. Select a plan, compare its step cost, and check whether causal-link conflicts can be resolved.<br>4. Select a causal link and generate refinements by keeping or changing its provider.<br>5. Remove steps that no longer support needed causal links.<br>6. Repair parallel-step conflicts at the end.<br><br>Reference: the exact algorithm is not examinable, but it searches over causal-link refinements and redundancy removal.

</details>

<details>
<summary><strong>Q48.</strong> How do you infer preconditions/effects of simplified move actions?</summary>

Method:<br>1. Treat move(x,y) as a shorthand for the relevant lower-level block manipulation.<br>2. Infer what must be true before x can move: x is clear, destination y is usable/clear if y is an object, and any holding/hand constraints required by the abstraction.<br>3. Infer what becomes true after the move: x is at/on y, old support may become clear, and destination may stop being clear if y is an object.<br>4. Use the Blocks World meaning, not just the compact action name.<br><br>Reference: the lecture uses merged move actions for simplicity; students should still infer their preconditions and effects.

</details>

<details>
<summary><strong>Q49.</strong> How do you read causal and temporal arrows in the lecture diagrams?</summary>

Method:<br>1. Treat solid arrows as causal links: provider → consumer labelled by a condition.<br>2. Treat dotted arrows as temporal links: one step must occur before another.<br>3. Treat marked parallel groups as possible concurrency during linearisation, not as automatic POCL construction steps.<br><br>Reference: the diagrams use solid arrows for causal links, dotted arrows for temporal links, and green ovals for potential parallel steps.

</details>

<details>
<summary><strong>Q50.</strong> Are potential parallel steps chosen during POCL construction?</summary>

Discriminator: are you building causal support, or producing an executable schedule?<br><br>During POCL construction: build steps, causal links, and necessary orderings.<br>During linearisation/post-processing: decide which compatible unordered steps can run in parallel.<br><br>Reference: the examples emphasise that identifying potential parallel steps happens during linearisation, not during core POCL construction.

</details>

<details>
<summary><strong>Q51.</strong> Post-planning reassignment: is it part of the planning mechanism?</summary>

Discriminator: is the plan being made valid, or execution being made more efficient after validity?<br><br>Planning mechanism: merge plans, adjust causal links, remove redundancy, resolve conflicts.<br>Post-planning reassignment: optionally reassign remaining steps to agents to improve parallel execution.<br><br>Reference: the lecture notes reassignment for efficiency can be considered afterwards and is not part of the planning mechanism itself.

</details>

<details>
<summary><strong>Q52.</strong> How do you check if a multi-agent parallel POCL plan is viable?</summary>

Method checklist:<br>1. The tuple has agents, steps, temporal links, causal links, concurrency/non-concurrency, and assignments.<br>2. Each action step has an assigned agent in X.<br>3. Required preconditions are supported by causal links.<br>4. Causal-link threats are removed by ordering.<br>5. Parallel step conflicts are repaired by sequencing or non-concurrency.<br>6. Redundant steps have been removed only after causal support is preserved.<br><br>Reference: expected exam skill is judging whether a plan is a viable multi-agent parallel POCL plan.

</details>

<details>
<summary><strong>Q53.</strong> Unordered vs concurrent steps: what is the discriminator?</summary>

Ask: are the steps merely not ordered, or explicitly allowed/chosen to run together?<br><br>Unordered: no temporal constraint fixes their relative order.<br>Concurrent: they are scheduled together during parallel linearisation and must not violate #, =, causal, or effect-consistency constraints.<br><br>Reference: partial-order plans leave independent steps unordered; parallel plans decide concurrency during linearisation.

</details>

<details>
<summary><strong>Q54.</strong> How do you merge local POCL plans before simplifying them?</summary>

Method:<br>1. Take the union of local step sets into global S.<br>2. Take the union of local temporal constraints into \prec_T.<br>3. Take the union of local causal links into \prec_C.<br>4. Add step assignments X from each agent’s submitted plan.<br>5. Then search for conflicts, causal-link adjustments, and redundant steps.<br><br>Reference: multi-agent parallel POCL combines individual agents’ partial plans and then removes conflicts or redundancy.

</details>

<details>
<summary><strong>Q55.</strong> What should you do if a lecture example labels the assignment relation ambiguously?</summary>

Method:<br>1. Use the formal definition as the authority.<br>2. Treat A as the set of agents.<br>3. Treat X as the step-assignment relation containing tuples ⟨s,a⟩.<br>4. If an example labels assignments with A, read it as X unless assessed notation says otherwise.<br><br>Reference: formal multi-agent POCL uses A for agents and X for assignments; the sheet flags an example-label ambiguity.

</details>

<details>
<summary><strong>Q56.</strong> What is the high-value mechanism behind redundancy removal?</summary>

Method:<br>1. Find two or more steps that can establish the same needed condition.<br>2. Adjust causal links so one step supplies conditions originally supplied by another.<br>3. After all outgoing useful links from the old step are replaced, mark the old step redundant.<br>4. Remove it to reduce total step cost.<br><br>Reference: the examples repeatedly show causal-link adjustment driving redundant-step removal.

</details>

<details>
<summary><strong>Q57.</strong> What is the expected exam use of formula-sheet definitions?</summary>

Method:<br>1. Do not merely quote the tuple.<br>2. For each tuple component, say what it contains.<br>3. For each relation tuple, say how to read it operationally.<br>4. Use the definition to test links, orderings, conflicts, assignments, and adjustments.<br><br>Reference: the POCL and parallel POCL definitions are formula-sheet items; the skill is using them.

</details>
