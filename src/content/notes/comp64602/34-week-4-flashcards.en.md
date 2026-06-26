---
subject: COMP64602
chapter: 34
title: "Week 4 — Flashcards"
language: en
---

# Week 4 — Flashcards

114 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> How should you treat First Order Logic in this sheet for revision?</summary>

Use it as background machinery.
1. Do not treat FOL itself as the main examinable target.
2. Still know its syntax and model-based semantics because later agent topics assume them.
3. Prioritise cards on agents/BDI/organisations/institutions, but keep FOL cards for support.
Reference: The sheet flags FOL as not directly examinable, but assumed background.

</details>

<details>
<summary><strong>Q2.</strong> How do you decide whether an expression is an FOL term?</summary>

Use it like this:
1. Ask: does the expression denote an object rather than assert a truth value?
2. If it is a named object, it is a constant.
3. If it stands for an arbitrary object, it is a variable.
4. If it applies an n-ary function symbol to suitable terms, it is a function term.
Reference: A term is a constant, a variable, or a function symbol applied to the appropriate number of terms.

</details>

<details>
<summary><strong>Q3.</strong> Discriminator: constant or variable?</summary>

Ask: is the symbol fixed to a particular object, or can it vary?
1. Fixed name/object → constant.
2. Placeholder whose value may vary → variable.
3. In Datalog-style notation, capitalised symbols often indicate variables.
Reference: Constants refer to particular objects; variables stand for objects that may vary.

</details>

<details>
<summary><strong>Q4.</strong> How do you check whether a function symbol is used correctly?</summary>

Use it like this:
1. Identify the function symbol f.
2. Check its arity n.
3. Count the arguments supplied.
4. Confirm each argument is itself a term.
5. If the count/types fit, f(t1,...,tn) is a term.
Reference: An n-ary function maps n objects/terms to another object.

</details>

<details>
<summary><strong>Q5.</strong> Discriminator: term or formula?</summary>

Ask: does it name/compute an object, or make a claim that can be true/false?
1. Object-denoting expression → term.
2. Predicate applied to terms, or built with connectives/quantifiers → formula.
Reference: Terms denote objects; formulae express truth-evaluable statements.

</details>

<details>
<summary><strong>Q6.</strong> How do you recognize a simple FOL formula?</summary>

Use it like this:
1. Find a predicate symbol P.
2. Check that P is applied to the right number of terms.
3. If the whole expression asserts P of those terms, it is simple/atomic.
Reference: A simple formula is a predicate symbol applied to the appropriate number of terms.

</details>

<details>
<summary><strong>Q7.</strong> How do you build a complex FOL formula?</summary>

Use it like this:
1. Start with one or more formulae φ, ψ.
2. Combine them using logical connectives such as ¬, ∧, ∨, →, ↔.
3. The result is still a formula, now complex.
Reference: Complex formulae are built from simpler formulae using logical connectives.

</details>

<details>
<summary><strong>Q8.</strong> Discriminator: which connective is being used?</summary>

Ask what relationship the formula asserts.
1. ¬φ: not φ.
2. φ ∧ ψ: both φ and ψ.
3. φ ∨ ψ: at least one of φ or ψ.
4. φ → ψ: if φ then ψ.
5. φ ↔ ψ: φ and ψ hold in both directions.
Reference: FOL complex formulae use negation, conjunction, disjunction, implication, and iff.

</details>

<details>
<summary><strong>Q9.</strong> How do you use implication φ → ψ?</summary>

Use it like this:
1. Treat φ as the condition/antecedent.
2. Treat ψ as the consequence/consequent.
3. If φ holds, ψ must hold for the implication to be satisfied.
4. Do not read it as saying φ itself is true.
Reference: φ → ψ means if φ then ψ.

</details>

<details>
<summary><strong>Q10.</strong> How do you use iff φ ↔ ψ?</summary>

Use it like this:
1. Check φ → ψ.
2. Check ψ → φ.
3. The iff holds only when both directions hold.
Reference: φ ↔ ψ abbreviates mutual implication: (φ → ψ) and (ψ → φ).

</details>

<details>
<summary><strong>Q11.</strong> How do you interpret a universal quantifier?</summary>

Use it like this:
1. Locate ∀x. φ(x).
2. Check every object o in the domain.
3. Substitute o for x in φ.
4. The universal is true only if every substitution is true.
Reference: I(∀x φ(x)) = ⊤ iff for every o ∈ Δ, I(φ(o)) = ⊤.

</details>

<details>
<summary><strong>Q12.</strong> How do you interpret an existential quantifier?</summary>

Use it like this:
1. Locate ∃x. φ(x).
2. Search the domain for at least one object o.
3. Substitute o for x in φ.
4. The existential is true if some substitution is true.
Reference: I(∃x φ(x)) = ⊤ iff there exists o ∈ Δ such that I(φ(o)) = ⊤.

</details>

<details>
<summary><strong>Q13.</strong> Discriminator: universal or existential?</summary>

Ask what would make the statement fail.
1. One counterexample kills ∀x φ(x).
2. One witness is enough for ∃x φ(x).
Reference: ∀ quantifies over all domain objects; ∃ quantifies over at least one domain object.

</details>

<details>
<summary><strong>Q14.</strong> How do you find bound variables in a formula?</summary>

Use it like this:
1. Find each quantifier ∀x or ∃x.
2. Mark the scope of that quantifier.
3. Occurrences of x inside that scope are bound.
Reference: A variable is bound if it occurs under a quantifier for that variable.

</details>

<details>
<summary><strong>Q15.</strong> How do you find free variables in a formula?</summary>

Use it like this:
1. List all variable occurrences.
2. For each occurrence, check whether a matching quantifier binds it.
3. Any occurrence not bound by a quantifier is free.
Reference: A variable occurrence is free if it is not quantified in the formula.

</details>

<details>
<summary><strong>Q16.</strong> How should you read capital-letter free variables in this unit?</summary>

Use it like this:
1. Notice capital-letter variables in rule-style formulae.
2. Treat them as Datalog-style variables.
3. Unless told otherwise, read them as implicitly universally quantified.
Reference: The unit often assumes free variables are universally quantified, especially in Datalog-style notation.

</details>

<details>
<summary><strong>Q17.</strong> How do you identify a model in FOL semantics?</summary>

Use it like this:
1. Identify the domain Δ: the objects being talked about.
2. Identify the interpretation I: meanings assigned to constants, functions, predicates, etc.
3. Package them as M = (Δ, I).
Reference: A model of an FOL formula consists of a domain Δ and an interpretation function I.

</details>

<details>
<summary><strong>Q18.</strong> How do you use an interpretation function?</summary>

Use it like this:
1. Map each constant to an object in Δ.
2. Map each function symbol to a function over Δ.
3. Map each predicate to truth values over suitable tuples of Δ.
4. Use these mappings to evaluate formulae.
Reference: I assigns meanings/truth conditions to the symbols of the language in a model.

</details>

<details>
<summary><strong>Q19.</strong> How do you decide whether φ is true in a model M?</summary>

Use it like this:
1. Unpack M as (Δ, I).
2. Interpret every symbol in φ using I.
3. Evaluate the resulting statement over Δ.
4. If the value is ⊤, φ is true in M; if ⊥, it is false.
Reference: φ is true in M when I(φ) = ⊤.

</details>

<details>
<summary><strong>Q20.</strong> How do you evaluate an atomic predicate formula P(t1,...,tn) in a model?</summary>

Use it like this:
1. Evaluate each term ti under I to get an object oi.
2. Apply the predicate interpretation I(P) to (o1,...,on).
3. Return ⊤ or ⊥ according to I(P).
Reference: I(P(t1,...,tn)) is determined by I(P) applied to the interpretations of the terms.

</details>

<details>
<summary><strong>Q21.</strong> How do you evaluate formulae with ¬, ∧, and ∨ in a model?</summary>

Use it like this:
1. Evaluate the component formulae first.
2. ¬φ flips the truth value of φ.
3. φ ∧ ψ is true only if both are true.
4. φ ∨ ψ is true if at least one is true.
Reference: Logical connectives combine truth values of subformulae.

</details>

<details>
<summary><strong>Q22.</strong> How do you evaluate φ → ψ and φ ↔ ψ in a model?</summary>

Use it like this:
1. Evaluate φ and ψ.
2. φ → ψ is false only when φ is true and ψ is false.
3. φ ↔ ψ is true when φ and ψ have the same truth value.
Reference: Implication and iff are truth-functional connectives over formulae.

</details>

<details>
<summary><strong>Q23.</strong> How do you test a universally quantified formula in a finite domain?</summary>

Use it like this:
1. List every object o ∈ Δ.
2. Evaluate φ(o) for each object.
3. If all cases are ⊤, ∀x φ(x) is ⊤.
4. If any case is ⊥, ∀x φ(x) is ⊥.
Reference: ∀ requires truth for every domain object.

</details>

<details>
<summary><strong>Q24.</strong> How do you test an existentially quantified formula in a finite domain?</summary>

Use it like this:
1. List candidate objects o ∈ Δ.
2. Evaluate φ(o).
3. Stop once one object makes φ(o) true.
4. If no object works, the existential is false.
Reference: ∃ requires at least one satisfying domain object.

</details>

<details>
<summary><strong>Q25.</strong> How do you read “φ is true” without naming a model?</summary>

Use it like this:
1. Ask whether the claim is model-relative or model-independent.
2. If the lecture says simply “φ is true,” read it as true in all relevant models.
3. In this unit, “all models” may be restricted to the intended/minimal models.
Reference: Model-theoretically, validity means truth in all models.

</details>

<details>
<summary><strong>Q26.</strong> How do you unpack the shorthand “φ is true in M”?</summary>

Use it like this:
1. Read M as a model M = (Δ, I).
2. Evaluate φ using I over Δ.
3. The shorthand means I(φ) = ⊤.
Reference: “φ is true in M” abbreviates truth under the interpretation of model M.

</details>

<details>
<summary><strong>Q27.</strong> How do you read a model written as a set of formulae M = {φ1,...,φn}?</summary>

Use it like this:
1. Treat the listed simple formulae/negated simple formulae as true.
2. Treat unlisted simple formulae as false, unless the context says otherwise.
3. Remember this is shorthand for a full model (Δ, I).
Reference: The sheet warns that a model may be described sloppily as the set of formulae true in it.

</details>

<details>
<summary><strong>Q28.</strong> How do you decide whether a model is minimal for a knowledge base?</summary>

Use it like this:
1. Check that every formula in KB is true in the model.
2. Check that the domain contains only objects needed to interpret the KB.
3. Prefer the smallest domain satisfying the KB.
4. Reject models with irrelevant extra objects when a smaller satisfying model exists.
Reference: A minimal model makes all KB formulae true and has the smallest possible domain.

</details>

<details>
<summary><strong>Q29.</strong> Discriminator: arbitrary model or minimal model?</summary>

Ask: does the model merely satisfy the formulae, or is its domain also as small as possible?
1. Satisfies the formulae only → model.
2. Satisfies the formulae and avoids irrelevant domain objects → minimal model.
Reference: Minimal models are satisfying models with minimal domains.

</details>

<details>
<summary><strong>Q30.</strong> How do you decide whether a system counts as an agent?</summary>

Use it like this:
1. Identify the environment it is situated in.
2. Check whether it receives information from that environment.
3. Check whether it can act in that environment.
4. Check whether it acts autonomously toward delegated objectives.
Reference: An agent is a computer system situated in an environment, capable of autonomous action in that environment to achieve delegated objectives.

</details>

<details>
<summary><strong>Q31.</strong> How do you identify an agent’s environment?</summary>

Use it like this:
1. Ask what outside world/system the agent interacts with.
2. Include physical or computational surroundings.
3. Check that the agent can sense and act within that setting.
Reference: An environment is the surrounding world/system in which the agent is situated.

</details>

<details>
<summary><strong>Q32.</strong> How do you recognize autonomy in an agent?</summary>

Use it like this:
1. Ask whether the system can act without direct human or other-system intervention.
2. Do not require sophisticated reasoning.
3. Focus on independence of action, not intelligence level.
Reference: Autonomy means agents are able to act without intervention by humans or other systems.

</details>

<details>
<summary><strong>Q33.</strong> How do you identify delegated objectives?</summary>

Use it like this:
1. Ask what goal the agent is meant to achieve.
2. Trace that goal to its designer, deployer, user, or specification.
3. Do not assume the agent invents its own objectives.
Reference: Delegated objectives are objectives given by people or system design.

</details>

<details>
<summary><strong>Q34.</strong> How does the sense-reason-act cycle work?</summary>

Use it like this:
1. Sense: gather information through sensors.
2. Reason: update internal state and decide what to do.
3. Act: use actuators/actions to affect the environment.
4. Repeat after the environment changes.
Reference: Environment → Sensors → Agent → Actuators → Environment.

</details>

<details>
<summary><strong>Q35.</strong> Discriminator: sensor or actuator?</summary>

Ask whether the component brings information in or sends action out.
1. Information from environment to agent → sensor.
2. Action from agent to environment → actuator.
Reference: Sensors provide environmental information; actuators let the agent act on the environment.

</details>

<details>
<summary><strong>Q36.</strong> Discriminator: agent or intelligent agent?</summary>

Ask whether the system merely senses/acts autonomously or also shows intelligent-agent properties.
1. Situated autonomous action toward objectives → agent.
2. Proactiveness, reactiveness, and social ability → intelligent agent in this lecture.
Reference: The sheet distinguishes basic agents from intelligent agents by additional behavioural properties.

</details>

<details>
<summary><strong>Q37.</strong> How do you recognize proactiveness?</summary>

Use it like this:
1. Identify the agent’s delegated objective.
2. Check whether the agent takes initiative toward that objective.
3. Confirm it is not merely waiting for stimuli.
Reference: Proactive agents exhibit goal-directed behaviour by taking initiative to satisfy delegated objectives.

</details>

<details>
<summary><strong>Q38.</strong> How do you recognize reactiveness?</summary>

Use it like this:
1. Check whether the agent perceives environmental changes.
2. Check whether it responds in a timely way.
3. Confirm the response still serves delegated objectives.
Reference: Reactive agents perceive their environment and respond in timely fashion to changes.

</details>

<details>
<summary><strong>Q39.</strong> Discriminator: proactive or reactive behaviour?</summary>

Ask what explains the action.
1. Action mainly driven by pursuing a goal → proactive.
2. Action mainly driven by responding to a change → reactive.
3. Good intelligent agents often need both.
Reference: Proactiveness is initiative toward goals; reactiveness is timely response to environmental change.

</details>

<details>
<summary><strong>Q40.</strong> How do you recognize social ability in an agent?</summary>

Use it like this:
1. Ask whether the agent interacts with other agents or humans.
2. Check whether interaction supports its objectives.
3. Include collaboration, coordination, or negotiation.
Reference: Social ability is the capability to interact with other agents, and possibly humans, to satisfy design objectives.

</details>

<details>
<summary><strong>Q41.</strong> How can a non-physical system still be an agent?</summary>

Use it like this:
1. Do not require a body.
2. Identify the computational environment.
3. Check that the system senses information and acts within that environment.
4. Apply the standard agent definition.
Reference: An agent may be purely computational if it interacts dynamically with a wider environment.

</details>

<details>
<summary><strong>Q42.</strong> How do you recognize a logic-based agent?</summary>

Use it like this:
1. Look for a knowledge base of facts and rules.
2. Check whether perception updates those facts.
3. Check whether action choice is derived by logical reasoning/theorem proving.
Reference: A logic-based agent uses facts, rules, and theorem proving to deduce what action to take.

</details>

<details>
<summary><strong>Q43.</strong> How do you run the logic-based action-choice algorithm?</summary>

Use it like this:
1. For each a ∈ A, test whether Δ ⊢ do(a). If yes, return a.
2. If none is provably recommended, for each a ∈ A test whether Δ ⊬ ¬do(a). If yes, return a.
3. If every action is ruled out, return noop.
Reference: The algorithm chooses a provably recommended action first, then an action not provably forbidden, otherwise noop.

</details>

<details>
<summary><strong>Q44.</strong> Discriminator: provably recommended or merely not ruled out?</summary>

Ask what Δ can prove.
1. If Δ ⊢ do(a), action a is positively recommended.
2. If Δ ⊬ ¬do(a), action a is merely not forbidden.
3. Positive recommendation is checked before not-forbidden choice.
Reference: The first loop searches for do(a); the second loop searches for absence of proof of ¬do(a).

</details>

<details>
<summary><strong>Q45.</strong> How do you interpret Δ ⊢ do(a)?</summary>

Use it like this:
1. Treat Δ as the current facts and rules.
2. Try to derive do(a) using the proof system.
3. If derivable, a is authorised/recommended by the knowledge base.
Reference: Δ ⊢ do(a) means do(a) is derivable from Δ.

</details>

<details>
<summary><strong>Q46.</strong> How do you interpret Δ ⊬ ¬do(a)?</summary>

Use it like this:
1. Try to derive ¬do(a) from Δ.
2. If no proof exists, the action is not known to be forbidden.
3. This does not mean do(a) is positively proven.
Reference: Δ ⊬ ¬do(a) means the knowledge base cannot derive that a should not be done.

</details>

<details>
<summary><strong>Q47.</strong> When does the logic-based agent return noop?</summary>

Use it like this:
1. Check all actions for provable do(a).
2. If none, check all actions for not being provably forbidden.
3. If every action is provably forbidden or unavailable, choose noop.
Reference: noop is returned when no action is selected by either loop.

</details>

<details>
<summary><strong>Q48.</strong> How does perception fit into a logic-based agent?</summary>

Use it like this:
1. Sense the environment.
2. Add, remove, or update facts in Δ.
3. Re-run reasoning over the updated Δ.
4. Execute the selected action.
5. Sense again.
Reference: Logic-based agents implement a sense-reason-act cycle using facts, rules, and reasoning.

</details>

<details>
<summary><strong>Q49.</strong> How do you apply a rule to derive an action?</summary>

Use it like this:
1. Identify a rule body condition C1 ∧ ... ∧ Cn → do(a).
2. Match each condition against current facts in Δ.
3. Instantiate variables consistently.
4. If all conditions match, derive do(a).
Reference: Rules derive action formulae when their antecedent conditions are satisfied by the current knowledge base.

</details>

<details>
<summary><strong>Q50.</strong> How do you use unification in rule-based action choice?</summary>

Use it like this:
1. Identify variables in the rule.
2. Match rule predicates against facts.
3. Substitute concrete terms for variables consistently across the rule.
4. Use the instantiated rule conclusion.
Reference: Unification instantiates variables so a general rule applies to current facts.

</details>

<details>
<summary><strong>Q51.</strong> Why can logic-based agents be hard to program?</summary>

Use it like this:
1. Ask whether the programmer must specify good actions for all relevant situations.
2. Check for missing cases.
3. Check for overlapping rules or conflicting recommendations.
4. Check whether action selection among applicable rules is well-defined.
Reference: A major critique is that the programmer bears the burden of encoding optimal behaviour.

</details>

<details>
<summary><strong>Q52.</strong> Why can theorem proving be a problem for acting agents?</summary>

Use it like this:
1. Remember the loop: perceive → reason → act.
2. If reasoning takes too long, the world may change before action.
3. The selected action may become stale.
Reference: Logic-based agents may be slow because theorem proving can delay action in a changing environment.

</details>

<details>
<summary><strong>Q53.</strong> How do logic-based agents connect to BDI agents?</summary>

Use it like this:
1. Start with the logic-based problem: reasoning directly over facts/rules for every action can be expensive.
2. Separate the agent state into beliefs, desires/goals, intentions, and plans.
3. Use BDI structure to guide action selection more explicitly.
Reference: BDI agents refine logic-based agents by structuring belief, goal, intention, and planning components.

</details>

<details>
<summary><strong>Q54.</strong> Why introduce BDI agents beyond logic-based agents?</summary>

Use it like this:
1. Identify the limits of raw theorem proving for action choice.
2. Separate current world information from goals and commitments.
3. Use plans to achieve selected goals.
4. Monitor execution and revise when needed.
Reference: BDI agents organise behaviour around beliefs, desires/goals, intentions, and plans.

</details>

<details>
<summary><strong>Q55.</strong> How do you recognize beliefs in a BDI agent?</summary>

Use it like this:
1. Ask what the agent currently takes to be true.
2. Include facts, and in some practical systems some rules.
3. Expect beliefs to be updated by sensing/belief revision.
Reference: Beliefs represent the agent’s current information about the world.

</details>

<details>
<summary><strong>Q56.</strong> How do you recognize desires/goals in a BDI agent?</summary>

Use it like this:
1. Ask what states of affairs the agent would like to achieve.
2. Treat them as candidate objectives.
3. Do not assume every desire is currently being pursued.
Reference: Desires are things the agent would like to achieve.

</details>

<details>
<summary><strong>Q57.</strong> How do you recognize intentions in a BDI agent?</summary>

Use it like this:
1. Ask which goals the agent is currently committed to acting on.
2. Check whether the intention includes an instantiated plan or action sequence.
3. Treat intentions as current commitments, not mere wishes.
Reference: Intentions are the things the agent is currently committed to trying to achieve.

</details>

<details>
<summary><strong>Q58.</strong> Discriminator: desire or intention?</summary>

Ask whether the agent merely wants it or is committed to acting on it.
1. Candidate goal/want → desire.
2. Current commitment to pursue a goal → intention.
3. In practical systems, an intention may include a plan.
Reference: Desires are possible goals; intentions are selected commitments.

</details>

<details>
<summary><strong>Q59.</strong> How can an intention be more than a goal?</summary>

Use it like this:
1. Identify the selected goal g.
2. Identify the plan/action sequence π attached to g.
3. Treat the intention as g + instantiated plan π.
Reference: In some BDI systems, an intention is a goal plus a plan of action for achieving it.

</details>

<details>
<summary><strong>Q60.</strong> How do you recognize a plan in BDI?</summary>

Use it like this:
1. Ask what method achieves a goal.
2. Check whether it is programmer-provided or generated by a planning algorithm.
3. Link it to an intention when the agent commits to using it.
Reference: Plans are ways of achieving goals.

</details>

<details>
<summary><strong>Q61.</strong> How does a BDI agent monitor and revise execution?</summary>

Use it like this:
1. Execute or begin executing the current intention/plan.
2. Sense whether circumstances have changed.
3. Drop or revise goals that are impossible or no longer wanted.
4. Drop or revise intentions when plans fail or priorities change.
Reference: BDI systems monitor plans/actions and revise behaviour when needed.

</details>

<details>
<summary><strong>Q62.</strong> How does the textbook BDI workflow run?</summary>

Use it like this:
1. Sensor input arrives.
2. Belief revision updates beliefs.
3. Beliefs plus current intentions generate options.
4. Goals/desires are deliberated/filtered into intentions.
5. An intention is selected and acted on.
6. Loop back to sensing.
Reference: Sensor input → belief revision → beliefs → generate options → deliberate/filter → intentions → select → act.

</details>

<details>
<summary><strong>Q63.</strong> How does belief revision function in the textbook BDI workflow?</summary>

Use it like this:
1. Take new sensor information.
2. Update the belief database.
3. Aim to produce current atomic facts about the world.
4. Reduce repeated theorem proving over raw facts and rules.
Reference: Belief revision updates beliefs from sensor input; in the simplified textbook view, beliefs are atomic facts.

</details>

<details>
<summary><strong>Q64.</strong> How does option generation work in BDI?</summary>

Use it like this:
1. Look at current beliefs and current intentions.
2. Generate possible next goals/actions/options.
3. Add, remove, or change candidate goals if the workflow allows it.
Reference: Generate-options produces candidate courses of action/goals from beliefs and current intentions.

</details>

<details>
<summary><strong>Q65.</strong> How does deliberation/filtering work in BDI?</summary>

Use it like this:
1. Start with candidate goals/desires and existing intentions.
2. Decide which goals matter now.
3. Select the goals to become current intentions.
4. Leave unselected desires as non-committed candidates.
Reference: Deliberation/filtering turns selected goals/desires into intentions.

</details>

<details>
<summary><strong>Q66.</strong> How does intention selection lead to action in BDI?</summary>

Use it like this:
1. Consider the current set of intentions.
2. Select one intention for immediate execution.
3. Perform the next action or plan segment.
4. Return to sensing before continuing if the system is iterative.
Reference: The selected intention tells the agent what to do next.

</details>

<details>
<summary><strong>Q67.</strong> How can practical BDI workflows differ from the textbook diagram?</summary>

Use it like this:
1. Do not assume beliefs are only atomic facts.
2. Do not assume full belief revision/forward chaining.
3. Treat generate-options, deliberate, and filter as language-dependent.
4. Check how plans instantiate intentions in the specific system.
Reference: The sheet says BDI workflows vary across languages and systems.

</details>

<details>
<summary><strong>Q68.</strong> What is simple belief revision in practical BDI systems?</summary>

Use it like this:
1. Add beliefs supported by current sensor input.
2. Remove beliefs contradicted by current sensor input.
3. Do not necessarily compute every logical consequence.
4. Use it to keep reasoning quick.
Reference: Simple belief revision updates beliefs by adding/removing information without full forward chaining.

</details>

<details>
<summary><strong>Q69.</strong> How do plans feed into BDI option generation?</summary>

Use it like this:
1. Start with candidate goals/desires.
2. Find plans capable of achieving them.
3. Instantiate a plan when the goal is selected.
4. Store the result as an intention or intention step sequence.
Reference: Plans help convert goals/desires into executable intentions.

</details>

<details>
<summary><strong>Q70.</strong> Discriminator: execute whole plan or top step only?</summary>

Ask how often the agent reconsiders.
1. Execute whole sequence → less frequent reconsideration.
2. Execute first/top step then loop → more opportunity to revise after sensing.
Reference: Some BDI systems execute a sequence; others execute one step and then reconsider.

</details>

<details>
<summary><strong>Q71.</strong> How should goals change in a careful BDI workflow?</summary>

Use it like this:
1. Treat goals/desires as important commitments, not casual side effects.
2. Change them through deliberate actions, user input, reasoning, or subgoal creation.
3. Avoid assuming option-generation automatically rewrites goals unless the system says so.
Reference: The sheet stresses that goal change should be deliberate and workflow-dependent.

</details>

<details>
<summary><strong>Q72.</strong> What is the exam-level BDI take-home message?</summary>

Use it like this:
1. Name the core constructs: beliefs, goals/desires, intentions.
2. Explain what each contributes to action selection.
3. Add that workflows differ by language/system.
Reference: BDI systems have beliefs for current information, goals/desires for what is wanted, and intentions for what the agent is committed to doing.

</details>

<details>
<summary><strong>Q73.</strong> How do you recognize a multi-agent system?</summary>

Use it like this:
1. Identify more than one agent.
2. Check whether agents interact, coordinate, or depend on one another.
3. Include both computational and human agents where relevant.
Reference: A multi-agent system involves multiple interacting agents.

</details>

<details>
<summary><strong>Q74.</strong> Why add organisational structure to a multi-agent system?</summary>

Use it like this:
1. Ask whether unstructured interaction would be hard to coordinate.
2. Identify shared goals, subgoals, authority, or protocols.
3. Use roles/organisations/institutions/norms to impose coordination.
Reference: Organisations and roles structure how agents coordinate work.

</details>

<details>
<summary><strong>Q75.</strong> How do you recognize an organisation in a multi-agent system?</summary>

Use it like this:
1. Identify a collective goal no single agent can achieve alone.
2. Identify multiple agents coordinated toward it.
3. Look for roles, relationships, authority, and protocols.
Reference: An organisation is a structure allowing multiple agents to coordinate to achieve a goal they cannot achieve individually.

</details>

<details>
<summary><strong>Q76.</strong> How do you identify an organisational structure?</summary>

Use it like this:
1. List the roles.
2. List relationships between roles.
3. List authority/delegation structures.
4. List protocols governing interaction.
Reference: Organisational structure is a collection of roles, relationships, and authority structures.

</details>

<details>
<summary><strong>Q77.</strong> Why can organisations be designed before the agents are known?</summary>

Use it like this:
1. Define roles and protocols abstractly.
2. Allow future agents to enter and assume roles.
3. Check that role requirements do not depend on a specific agent identity.
Reference: Organisational structures can be specified so unknown agents later play roles within them.

</details>

<details>
<summary><strong>Q78.</strong> How do you recognize a role?</summary>

Use it like this:
1. Ask what position/function an agent assumes inside an organisation.
2. Identify associated obligations, goals, capabilities, and delegation relationships.
3. Separate the role from the individual agent playing it.
Reference: Individual agents assume roles within an organisation.

</details>

<details>
<summary><strong>Q79.</strong> How do role goals relate to organisational goals?</summary>

Use it like this:
1. Identify the organisation’s overall goal G.
2. Identify each role’s assigned subgoals gi.
3. Check whether achieving role subgoals contributes to G.
Reference: Role goals are usually subgoals of the organisation’s goals.

</details>

<details>
<summary><strong>Q80.</strong> How can a role grant capabilities?</summary>

Use it like this:
1. Identify actions/resources unavailable to ordinary agents.
2. Check whether assuming the role grants access or permission.
3. Remove the capability when the agent is no longer playing the role, unless otherwise specified.
Reference: A role can give an agent capabilities it does not otherwise have.

</details>

<details>
<summary><strong>Q81.</strong> How does delegation work between roles?</summary>

Use it like this:
1. Identify the delegating role/agent.
2. Identify the receiving role/agent.
3. Identify the task or goal transferred.
4. Check whether the organisational structure permits that delegation.
Reference: Roles may define who can delegate tasks and who can receive delegated tasks.

</details>

<details>
<summary><strong>Q82.</strong> How do you handle agents with goals outside their role?</summary>

Use it like this:
1. Separate the agent’s role goals from its private or other-organisational goals.
2. Check for conflict or prioritisation issues.
3. Do not assume playing a role exhausts the agent’s motivations.
Reference: Agents inside an organisation may also have their own goals or roles in other organisations.

</details>

<details>
<summary><strong>Q83.</strong> Discriminator: organisation as design-time tool or runtime structure?</summary>

Ask whether the organisation exists only in the designer’s model or also in running software.
1. Design-time only → used to guide agent implementation.
2. Runtime structure → represented/communicated/monitored while the system runs.
Reference: Organisations may be design abstractions or runtime frameworks.

</details>

<details>
<summary><strong>Q84.</strong> How does a runtime organisation support agents?</summary>

Use it like this:
1. Communicate roles, goals, obligations, capabilities, and protocols.
2. Let agents enter/leave and assume roles.
3. Require agents to represent and reason about organisational information.
4. Optionally monitor/correct interactions.
Reference: Runtime organisational structures make organisational facts available during system execution.

</details>

<details>
<summary><strong>Q85.</strong> How do roles connect to knowledge representation?</summary>

Use it like this:
1. Encode role obligations, permissions, capabilities, and goals.
2. Let agents reason over these facts.
3. Use that reasoning to decide how to act in the organisation.
Reference: Roles require representable knowledge about obligations, capabilities, protocols, and goals.

</details>

<details>
<summary><strong>Q86.</strong> Discriminator: organisation or institution?</summary>

Ask whether you are describing the coordinating structure or the rules governing it.
1. Coordinating group/roles/goals → organisation.
2. Set of governing rules → institution.
Reference: An institution is the set of rules that govern an organisation.

</details>

<details>
<summary><strong>Q87.</strong> How do you recognize a norm?</summary>

Use it like this:
1. Ask whether it states expected, allowed, or forbidden behaviour for a group.
2. Identify the relevant agents/group.
3. Identify the behaviour the norm regulates.
Reference: A norm is a standard or pattern of social behaviour accepted or expected of a group.

</details>

<details>
<summary><strong>Q88.</strong> How do you classify a norm as permission, obligation, or prohibition?</summary>

Use it like this:
1. Allowed to do A → permission.
2. Required/expected to do A → obligation.
3. Required not to do A → prohibition.
Reference: Norms may express permissions, obligations, or prohibitions.

</details>

<details>
<summary><strong>Q89.</strong> Why is a prohibition treated as a kind of obligation?</summary>

Use it like this:
1. Rewrite “A is forbidden” as “the agent is obliged not to do A.”
2. Monitor violation by checking whether A occurs.
3. If A occurs despite O¬A, a violation occurs.
Reference: A prohibition is essentially an obligation not to perform an action.

</details>

<details>
<summary><strong>Q90.</strong> Discriminator: coordination norm or moral norm?</summary>

Ask what kind of force the norm has.
1. Mainly helps agents coordinate expectations → coordination norm.
2. Carries ethical/social moral weight → moral norm.
3. For this unit, both are still treated as norms.
Reference: Norms can coordinate behaviour or encode moral expectations.

</details>

<details>
<summary><strong>Q91.</strong> How do you identify a norm violation?</summary>

Use it like this:
1. Identify the active norm.
2. Identify the expected/permitted/forbidden behaviour.
3. Compare the actual trace of events/states against the norm.
4. If behaviour fails to satisfy the norm, record a violation.
Reference: A violation occurs when behaviour does not satisfy an applicable norm.

</details>

<details>
<summary><strong>Q92.</strong> How do sanctions relate to violations?</summary>

Use it like this:
1. Detect a norm violation.
2. Check the institution’s sanction rules.
3. Apply the consequence specified by the institution/organisation.
Reference: A sanction is a consequence imposed by an institution after a violation.

</details>

<details>
<summary><strong>Q93.</strong> How do you read deontic symbols O and P?</summary>

Use it like this:
1. OA means it is obligatory that A.
2. PA means it is permitted that A.
3. Use these to represent normative status, not ordinary truth alone.
Reference: Deontic logic is a logic for obligations and permissions.

</details>

<details>
<summary><strong>Q94.</strong> How do you use the deontic equivalence PA ≡ ¬O¬A?</summary>

Use it like this:
1. To show A is permitted, show the agent is not obliged to avoid A.
2. To deny permission, show an obligation not to do A.
3. Read permission as absence of contrary obligation.
Reference: PA ≡ ¬O¬A means A is permitted iff it is not obligatory that not-A.

</details>

<details>
<summary><strong>Q95.</strong> How do you apply deontic Axiom 1?</summary>

Use it like this:
1. Check whether A is valid/tautological.
2. If A is true in all relevant cases, infer OA.
3. Use cautiously: the sheet notes deontic semantics is tricky.
Reference: (⊨ A) → (⊨ OA).

</details>

<details>
<summary><strong>Q96.</strong> How do you apply deontic Axiom 2?</summary>

Use it like this:
1. Check whether O(A → B) holds.
2. Check whether OA holds.
3. If both hold, infer OB.
Reference: O(A → B) → (OA → OB).

</details>

<details>
<summary><strong>Q97.</strong> How do you apply deontic Axiom 3?</summary>

Use it like this:
1. Check whether OA holds.
2. If A is obligatory, infer that A is permitted.
3. Use this to rule out “obligatory but not permitted” cases.
Reference: OA → PA.

</details>

<details>
<summary><strong>Q98.</strong> How do you monitor an obligation to do A?</summary>

Use it like this:
1. Add OA to the institutional state.
2. Watch the external trace for A occurring by any relevant condition/deadline.
3. If A occurs appropriately, discharge/update the obligation.
4. If A fails to occur when required, record a violation.
Reference: To monitor OA, check whether A happens when required.

</details>

<details>
<summary><strong>Q99.</strong> How do you monitor an obligation not to do A?</summary>

Use it like this:
1. Add O¬A to the institutional state.
2. Watch the external trace for A.
3. If A occurs, generate a violation.
4. If A never occurs during the relevant interval, no violation is detected.
Reference: If an agent is obliged not to do A and A happens, there is a violation.

</details>

<details>
<summary><strong>Q100.</strong> How do you model an external environment for institutional monitoring?</summary>

Use it like this:
1. Define external states S_ex.
2. Define external events E_ex, usually actions.
3. Define a transition function τ.
4. Use τ to move from state to state when events occur.
Reference: τ : S_ex × E_ex → S_ex maps an external state and event to the next external state.

</details>

<details>
<summary><strong>Q101.</strong> How do you write an external trace?</summary>

Use it like this:
1. Start with an external state s0.
2. Record an event e0.
3. Record the next state s1 = τ(s0,e0).
4. Continue as s0, e0, s1, e1, s2, ...
Reference: An external trace is a sequence of external states and events.

</details>

<details>
<summary><strong>Q102.</strong> How do you construct an institutional trace from an external trace?</summary>

Use it like this:
1. Observe the external states/events.
2. Generate institutional events for things the institution cares about.
3. Update institutional states with obligations, violations, sanctions, and other institutional facts.
4. Ignore external details irrelevant to the institution.
Reference: An external trace induces an institutional trace s'0, e'0, s'1, e'1, ...

</details>

<details>
<summary><strong>Q103.</strong> Discriminator: external fact or institutional fact?</summary>

Ask where the fact comes from.
1. Directly describes what happened in the environment → external fact.
2. Created by institutional rules, such as obligation/violation/sanction → institutional fact.
Reference: The environment records external states/events; the institution records normative facts derived from them.

</details>

<details>
<summary><strong>Q104.</strong> How do you use a generation function in institutional monitoring?</summary>

Use it like this:
1. Take the current institutional state.
2. Take the current external state.
3. Take the current external event.
4. Produce the institutional event triggered by those inputs.
Reference: g(S_inst, S_ex, e_ex) = e_inst, schematically.

</details>

<details>
<summary><strong>Q105.</strong> How do you use a consequence function in institutional monitoring?</summary>

Use it like this:
1. Take the current institutional state s'_i.
2. Take the institutional event e'_i.
3. Compute the next institutional state s'_{i+1}.
4. Add/delete institutional facts according to the institution’s rules.
Reference: c : S_inst × E_inst → S_inst.

</details>

<details>
<summary><strong>Q106.</strong> Why can institution monitoring need time-passing events?</summary>

Use it like this:
1. Identify norms with deadlines or temporal conditions.
2. Add events that represent time advancing.
3. Use those events to trigger violations when deadlines pass unmet.
Reference: Deadline-based obligations may require time-transition events even if the external state otherwise does not change.

</details>

<details>
<summary><strong>Q107.</strong> How can an agent use obligations as goals?</summary>

Use it like this:
1. Read an institutional obligation O(agent,A).
2. Convert A into a goal for that agent.
3. Use the agent’s planning/action mechanism to try to satisfy A.
Reference: Agents can transform obligations into goals.

</details>

<details>
<summary><strong>Q108.</strong> How can institutional facts support sanctions?</summary>

Use it like this:
1. Detect or store an institutional fact such as a violation.
2. Check the sanction rule linked to that fact.
3. Apply the institution’s consequence when the triggering condition occurs.
Reference: Institutional facts can be used as the basis for sanctions.

</details>

<details>
<summary><strong>Q109.</strong> How do institutions and BDI reasoning connect?</summary>

Use it like this:
1. Institutions produce obligations, permissions, violations, and sanctions.
2. Agents represent those facts as beliefs or goals.
3. BDI-style agents may turn obligations into intentions/plans.
Reference: Institutional obligations can feed into agent programming and BDI-style reasoning.

</details>

<details>
<summary><strong>Q110.</strong> Workflow card: how do you analyse an agent architecture question?</summary>

Use it like this:
1. Identify the environment.
2. Identify sensors/percepts.
3. Identify actions/actuators.
4. Identify objectives.
5. Classify behaviour as autonomous, proactive, reactive, and/or social.
Reference: Agent analysis combines situatedness, autonomous action, delegated objectives, and intelligent-agent properties.

</details>

<details>
<summary><strong>Q111.</strong> Workflow card: how do you analyse a logic-based agent trace?</summary>

Use it like this:
1. Write the current facts/rules Δ.
2. Apply perception updates.
3. Run the action-choice algorithm over A.
4. Execute the selected action.
5. Update Δ again and repeat.
Reference: Logic-based agents repeatedly perceive, reason using Δ, act, and perceive again.

</details>

<details>
<summary><strong>Q112.</strong> Workflow card: how do you analyse a BDI scenario?</summary>

Use it like this:
1. List beliefs: what the agent thinks is true.
2. List desires/goals: what it would like to achieve.
3. List intentions: what it is committed to pursuing now.
4. Identify plans attached to intentions.
5. Check whether sensing should revise any of these.
Reference: BDI analysis separates beliefs, desires/goals, intentions, and plans.

</details>

<details>
<summary><strong>Q113.</strong> Workflow card: how do you analyse an organisation/role scenario?</summary>

Use it like this:
1. Identify the organisation and its overall goal.
2. List roles.
3. For each role, list goals, obligations, capabilities, and delegation links.
4. Decide whether the structure is design-time only or runtime-represented.
Reference: Organisations coordinate agents through roles, authority, protocols, and possibly runtime organisational facts.

</details>

<details>
<summary><strong>Q114.</strong> Workflow card: how do you analyse an institution/norm scenario?</summary>

Use it like this:
1. Identify the organisation being governed.
2. State the institution’s rules as norms.
3. Classify norms as obligations, permissions, or prohibitions.
4. Build external and institutional traces.
5. Detect violations and sanctions.
Reference: Institutions govern organisations by representing and monitoring norms over traces.

</details>
