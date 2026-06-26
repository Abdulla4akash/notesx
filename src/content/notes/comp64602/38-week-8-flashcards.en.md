---
subject: COMP64602
chapter: 38
title: "Week 8 — Flashcards"
language: en
---

# Week 8 — Flashcards

79 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> Front</summary>

Back

</details>

<details>
<summary><strong>Q2.</strong> How do you recognize a planning problem?</summary>

Use it when an agent has a current state, a goal state, and available actions, and must choose an action sequence before acting.
Method:
1. Identify the initial state facts.
2. Identify the goal facts.
3. Identify available action schemas.
4. Ask whether some sequence of applicable actions can transform the initial state into a goal-satisfying state.
Reference: A planning problem is one where an agent must decide upon a sequence of actions to achieve some goal.

</details>

<details>
<summary><strong>Q3.</strong> How do you check whether the lecture is assuming classical planning?</summary>

Ask: is the world fully known, unchanged during plan execution, and deterministic?
Use:
1. Check whether all relevant facts are known at planning time.
2. Check whether no external change is expected while executing.
3. Check whether each action has definite effects.
If all hold, treat it as classical planning.
Reference: Classical planning assumes a completely known environment, no change during enactment, and deterministic action effects.

</details>

<details>
<summary><strong>Q4.</strong> Discriminator: logic-based plan selection vs planning — supplied plans or generated plans?</summary>

Use this question: does the programmer provide candidate plans, or must the agent construct the plan itself?
- Supplied plan library: earlier logic-based agent chooses among given plans.
- Planning: agent generates a sequence of actions from state/action/goal descriptions.
Reference: The planning lectures move from programmer-supplied plans to agent-constructed plans.

</details>

<details>
<summary><strong>Q5.</strong> What is PDDL used for in planning?</summary>

Use PDDL when you need a formal representation that a planner can read.
Method:
1. Put reusable predicates/actions in a domain file.
2. Put task-specific objects, initial facts, and goals in a problem file.
3. Let action schemas chain together into candidate plans.
Reference: PDDL is a syntax for defining planning problems using action schemas with preconditions and effects.

</details>

<details>
<summary><strong>Q6.</strong> How do you read or write a PDDL action schema?</summary>

Method:
1. Read the action name.
2. Read the typed parameters, usually variables such as ?x.
3. Read :precondition as facts that must already hold.
4. Read positive :effect facts as additions.
5. Read (not fact) effects as deletions.
6. Instantiate variables with objects when applying the action.
Reference: An action schema is a template defining an action’s parameters, preconditions, and effects.

</details>

<details>
<summary><strong>Q7.</strong> How do you tell PDDL variables from constants?</summary>

Ask: does the symbol begin with ?
- ?x, ?y: variables to be substituted.
- object names without ?: constants/actual objects.
Use variables in schemas; use constants in problem instances and grounded actions.
Reference: In PDDL, variables begin with a question mark, while actual objects do not.

</details>

<details>
<summary><strong>Q8.</strong> How do typed parameters work in PDDL?</summary>

Method:
1. List variable names.
2. Attach their type using the typed-parameter form.
3. Only substitute objects of the declared type for those variables.
4. Use the substituted action as a grounded action.
Reference: PDDL parameters can be typed so that variables range over objects of the stated type.

</details>

<details>
<summary><strong>Q9.</strong> How do you test whether an action is applicable?</summary>

Method:
1. Take the current state S.
2. Take the action precondition Pre(a).
3. Try to unify/match variables in Pre(a) with facts in S.
4. If every required precondition fact is matched, the action is applicable.
5. Otherwise, it cannot be applied in that state.
Reference: An action is applicable when its preconditions can be matched to the current state.

</details>

<details>
<summary><strong>Q10.</strong> How do you update a state after applying an action?</summary>

Method:
1. Start with current state S.
2. Add all positive effects of the action.
3. Remove all facts appearing inside negative effects.
4. The result is the successor state.
Reference: PDDL effects are treated as facts added to and removed from the state.

</details>

<details>
<summary><strong>Q11.</strong> Discriminator: positive effect vs negative effect — add fact or delete fact?</summary>

Use this question: is the effect written as a plain fact or inside not?
- Plain fact E: add E to the successor state.
- (not E): remove E from the successor state.
Reference: Positive effects add facts; negative effects remove facts.

</details>

<details>
<summary><strong>Q12.</strong> How do you apply the closed world assumption?</summary>

Method:
1. Look at the current state description.
2. Ask whether the fact can be derived from it.
3. If yes, treat the fact as true.
4. If no, treat it as false.
5. Therefore an action needing that fact is blocked unless the fact is known/derived.
Reference: Under the closed world assumption, if a fact cannot be derived, it is assumed false.

</details>

<details>
<summary><strong>Q13.</strong> How do you construct a PDDL domain file?</summary>

Method:
1. Name the domain.
2. Declare relevant types.
3. Declare predicates that describe states.
4. Define action schemas using parameters, preconditions, and effects.
5. Keep it reusable across many problem instances.
Reference: A planning domain is defined by predicates appearing in action schemas together with the action schemas.

</details>

<details>
<summary><strong>Q14.</strong> How do you construct a PDDL problem file?</summary>

Method:
1. Name the problem.
2. State which domain it uses.
3. Declare the actual objects.
4. Give the initial state facts.
5. Give the goal condition.
Reference: A problem file gives a particular planning task inside a domain: objects, initial state, and goal state.

</details>

<details>
<summary><strong>Q15.</strong> Discriminator: domain file vs problem file — reusable rules or one task?</summary>

Ask: could this information be reused across many tasks?
- Domain file: reusable types, predicates, and action schemas.
- Problem file: one instance’s objects, initial facts, and goal.
Reference: The domain describes the action vocabulary; the problem describes a specific planning instance in that domain.

</details>

<details>
<summary><strong>Q16.</strong> How do you build a simple plan from a PDDL action and a goal?</summary>

Method:
1. Start from the initial state.
2. Choose an action whose preconditions can be matched.
3. Substitute variables with actual objects.
4. Apply add/delete effects to get a new state.
5. Check whether the goal is now satisfied.
6. Repeat until all goal facts hold.
Reference: Action schemas can be chained together to produce plans.

</details>

<details>
<summary><strong>Q17.</strong> Exam flag: what must you be able to do with simple PDDL?</summary>

Revise this procedure:
1. Read action schemas.
2. Identify parameters, preconditions, and effects.
3. Distinguish variables from constants.
4. Apply add/delete effects.
5. Separate domain-file content from problem-file content.
6. Construct simple domain descriptions.
Reference: The lecturer explicitly flags reading and constructing simple PDDL planning domain descriptions as examinable.

</details>

<details>
<summary><strong>Q18.</strong> How do you run forward search in planning?</summary>

Method:
1. Start at the initial state.
2. Test whether the goal holds.
3. Find all applicable actions by matching preconditions.
4. Apply each action notionally to generate successor states.
5. Continue searching successors until a goal state is found.
6. Use BFS, DFS, or another search strategy to choose expansion order.
Reference: Forward search starts at the initial state and applies applicable actions until the goal is reached.

</details>

<details>
<summary><strong>Q19.</strong> How do you generate successors in forward search?</summary>

Method:
1. For each action schema, find substitutions whose preconditions match the current state.
2. Ground the action with those substitutions.
3. Add positive effects.
4. Delete negated effects.
5. Store the resulting state as a successor.
Reference: Forward search expands a state by applying all applicable actions.

</details>

<details>
<summary><strong>Q20.</strong> How do you detect useless loops in a planning search tree?</summary>

Method:
1. Record states already seen on the current path or globally.
2. After applying an action, compare the successor with earlier states.
3. If it returns to a previous state, mark the branch as a loop.
4. Backtrack or avoid re-expanding it.
Reference: Forward search may explore legal but unhelpful branches that undo earlier actions and return to previous states.

</details>

<details>
<summary><strong>Q21.</strong> Discriminator: breadth-first vs depth-first planning search — level first or branch first?</summary>

Ask: does the search expand all options at one depth before going deeper?
- Breadth-first: level by level; finds a shortest-action plan but uses more memory.
- Depth-first: follows one branch deeply, then backtracks; lower memory but can chase loops/dead ends.
Reference: The lecture contrasts BFS as level-order search and DFS as branch-first search with backtracking.

</details>

<details>
<summary><strong>Q22.</strong> When does breadth-first search help in planning?</summary>

Use BFS when you want the fewest-action plan and can afford the memory.
Method:
1. Expand the initial state.
2. Queue all depth-1 successors.
3. Expand all states at depth d before depth d+1.
4. Stop when the first goal state is found.
Reference: Breadth-first search works level by level and finds a plan with the fewest actions.

</details>

<details>
<summary><strong>Q23.</strong> When does depth-first search help in planning?</summary>

Use DFS when memory is tighter and you can tolerate backtracking.
Method:
1. Choose one applicable action.
2. Follow that branch to the next state.
3. Continue until goal, loop, or dead end.
4. Backtrack and try alternatives.
Reference: Depth-first search explores one branch deeply before returning to earlier alternatives.

</details>

<details>
<summary><strong>Q24.</strong> Why can uninformed forward search become large?</summary>

Recognize the risk when many actions are legally applicable but few help the goal.
Method check:
1. Count applicable actions per state.
2. Notice whether actions can undo each other.
3. Notice whether the search lacks goal-directed guidance.
4. Expect rapid branching and many irrelevant states.
Reference: Forward search can create a large state space because it explores many choices before knowing which help reach the goal.

</details>

<details>
<summary><strong>Q25.</strong> Blocks World: how do you apply pick-up(x)?</summary>

Method:
1. Check x is clear.
2. Check x is on the table.
3. Check the hand is empty.
4. Delete ontable(x), clear(x), and handempty.
5. Add holding(x).
Reference: pick-up(x) is applicable when clear(x), ontable(x), and handempty hold; its effects make the agent holding(x).

</details>

<details>
<summary><strong>Q26.</strong> Blocks World: how do you apply put-down(x)?</summary>

Method:
1. Check holding(x).
2. Delete holding(x).
3. Add clear(x), handempty, and ontable(x).
Reference: put-down(x) is applicable when holding(x) holds; its effects put x on the table and empty the hand.

</details>

<details>
<summary><strong>Q27.</strong> Blocks World: how do you apply stack(x,y)?</summary>

Method:
1. Check holding(x).
2. Check clear(y).
3. Delete holding(x).
4. Delete clear(y).
5. Add clear(x), handempty, and on(x,y).
Reference: stack(x,y) places held x on clear y.

</details>

<details>
<summary><strong>Q28.</strong> Blocks World: how do you apply unstack(x,y)?</summary>

Method:
1. Check on(x,y).
2. Check clear(x).
3. Check handempty.
4. Add holding(x) and clear(y).
5. Delete clear(x), handempty, and on(x,y).
Reference: unstack(x,y) removes clear x from y, leaving the agent holding x and y clear.

</details>

<details>
<summary><strong>Q29.</strong> How do you find all applicable Blocks World actions from a state?</summary>

Method:
1. For each object x, test pick-up(x): clear(x), ontable(x), handempty.
2. For each held x, test put-down(x): holding(x).
3. For each held x and clear y, test stack(x,y).
4. For each pair x,y, test unstack(x,y): on(x,y), clear(x), handempty.
5. List only grounded actions whose preconditions all hold.
Reference: Applicable actions are exactly those whose preconditions match the current state.

</details>

<details>
<summary><strong>Q30.</strong> How do you run backward search in planning?</summary>

Method:
1. Start from the goal state/goal condition.
2. Find actions whose effects could have produced goal facts.
3. Reverse those actions to construct predecessor states.
4. Continue backward until a predecessor matches the initial state.
5. Reverse the found action chain to get the forward plan.
Reference: Backward search starts with the goal state and explores actions that could lead to it until it reaches the initial state.

</details>

<details>
<summary><strong>Q31.</strong> How do you choose actions in backward search?</summary>

Ask: which action has an effect matching a fact I need in the current goal/regression state?
Method:
1. Select a required fact.
2. Find action schemas with that fact as a positive effect.
3. Unify variables so the effect matches the required fact.
4. Treat that action as a possible last action.
Reference: Backward search unifies the current target state with action postconditions/effects.

</details>

<details>
<summary><strong>Q32.</strong> How do you reverse action effects in backward search?</summary>

Method:
1. Instantiate the action.
2. For each positive effect E, remove E from the current regression state.
3. For each negative effect (not E), add E to the predecessor requirement.
4. Add the action’s preconditions as requirements for the predecessor.
5. Simplify inconsistent or redundant facts.
Reference: Backward search calculates previous states by reversing action effects.

</details>

<details>
<summary><strong>Q33.</strong> Discriminator: forward vs backward search — preconditions now or effects before?</summary>

Ask: are you asking “what action can I do from here?” or “what action could have produced this target?”
- Forward search: match current state to preconditions, then apply effects.
- Backward search: match target state to effects/postconditions, then regress to a previous state.
Reference: Forward starts at the initial state; backward starts at the goal state.

</details>

<details>
<summary><strong>Q34.</strong> Why can backward search be more efficient in practice?</summary>

Use this idea when the goal is more constrained than the initial state.
Method:
1. Compare how many facts/actions are relevant from the initial state.
2. Compare how many actions could produce the goal facts.
3. If few actions can produce the goal, backward search branches less.
Reference: In theory backward and forward search can be similarly expensive, but backward search is often more efficient because final states are often more constrained.

</details>

<details>
<summary><strong>Q35.</strong> How can variables reduce enumeration in backward search?</summary>

Method:
1. Regress from a goal fact.
2. Identify variables needed in preconditions but not fixed by the positive goal-producing effect.
3. Leave such variables symbolic when any suitable object could work.
4. Delay grounding until necessary.
Reference: Backward search can sometimes represent many possible predecessors using a variable instead of enumerating every object.

</details>

<details>
<summary><strong>Q36.</strong> What is a planning heuristic used for?</summary>

Use a heuristic when search has too many legal branches.
Method:
1. Assign a value h(s) to candidate states.
2. Treat lower values as closer/more promising when the heuristic estimates distance.
3. Expand or prefer states with better heuristic values.
Reference: A planning heuristic is a rule of thumb that usually makes the search for a plan quicker.

</details>

<details>
<summary><strong>Q37.</strong> How do you view a planning problem as a graph?</summary>

Method:
1. Treat each possible state as a vertex.
2. Treat each applicable action as a directed edge to a successor state.
3. Treat the initial state as the start vertex.
4. Treat goal-satisfying states as target vertices.
5. Planning becomes finding a path from start to goal.
Reference: In planning-as-graph-search, states are vertices and actions are edges.

</details>

<details>
<summary><strong>Q38.</strong> How does the shortest-path framing apply to planning?</summary>

Method:
1. Build or imagine the state graph.
2. Put the initial state at the start.
3. Put the goal state/goal condition at the destination.
4. Search for a path with fewest/lowest-cost actions.
Reference: Planning can be framed as a shortest path problem from initial state to goal state.

</details>

<details>
<summary><strong>Q39.</strong> How does A* use a heuristic in the lecture’s simplified planning presentation?</summary>

Method:
1. Generate successor states.
2. Evaluate each state using h.
3. Prefer the successor with the lowest heuristic value.
4. Continue until a goal state is reached.
Reference: The lecture presents A* as using a heuristic h to evaluate states and explore the lowest-valued successor.

</details>

<details>
<summary><strong>Q40.</strong> How do you check whether a heuristic is admissible?</summary>

Ask: can h ever overestimate the true remaining distance to the goal?
Method:
1. For each state s, compare h(s) with the true minimum remaining cost.
2. If h(s) is always less than or equal to true cost, it is admissible.
3. If h(s) is ever greater, it is not admissible.
Reference: An admissible heuristic underestimates the distance to the goal state.

</details>

<details>
<summary><strong>Q41.</strong> Discriminator: optimistic vs pessimistic heuristic — admissible or not?</summary>

Ask: is the heuristic too low or too high?
- Optimistic/underestimate: admissible.
- Exact: admissible.
- Pessimistic/overestimate: not admissible.
Reference: Admissibility means the heuristic may underestimate but must not overestimate remaining distance.

</details>

<details>
<summary><strong>Q42.</strong> How do you compute the ignore-preconditions heuristic?</summary>

Method:
1. Pretend every action is applicable in every state.
2. Identify goal facts not yet true.
3. Find the minimum number of actions whose positive effects can make those goal facts true.
4. Return that relaxed action count as h(s).
Reference: Ignore preconditions heuristic = assume all actions are applicable in all states, then compute the minimum number of actions needed to reach the goal.

</details>

<details>
<summary><strong>Q43.</strong> Why is the ignore-preconditions heuristic admissible?</summary>

Reasoning:
1. Removing preconditions makes the planning problem easier.
2. An easier relaxed problem cannot require more actions than the real problem.
3. Therefore its action count is an underestimate or exact value.
Reference: Because the relaxation ignores obstacles, the computed distance underestimates the true distance to the goal.

</details>

<details>
<summary><strong>Q44.</strong> How do you use heuristic values to choose between planning branches?</summary>

Method:
1. Generate candidate successor states.
2. Compute h(s) for each successor.
3. Prefer lower h(s) if h estimates remaining distance.
4. Delay or avoid branches with worse values.
5. Remember that heuristic choice guides search; it does not physically execute actions yet.
Reference: Planning heuristics guide search toward promising branches and away from less promising ones.

</details>

<details>
<summary><strong>Q45.</strong> How do you apply the serializable sub-goals heuristic?</summary>

Method:
1. Split the goal into individual sub-goal facts.
2. Choose an order for achieving them.
3. Check that once each sub-goal is achieved, later actions need not undo it.
4. Search only branches consistent with that order.
Reference: Serializable sub-goals = an ordering of sub-goals such that once achieved, a sub-goal never has to be undone.

</details>

<details>
<summary><strong>Q46.</strong> When can you use serializable sub-goals safely?</summary>

Ask: is there domain knowledge showing a no-undo ordering exists?
Use:
1. Identify candidate sub-goal order.
2. Test whether later sub-goals require undoing earlier ones.
3. Use the heuristic only if the ordering is stable.
Reference: The serializable sub-goals heuristic requires domain knowledge and works when achieved sub-goals can be left alone.

</details>

<details>
<summary><strong>Q47.</strong> How does serializable sub-goals prune a branch?</summary>

Method:
1. Keep track of already achieved sub-goals in the chosen order.
2. For each candidate action, simulate its effects.
3. If it deletes/undoes an achieved sub-goal, prune or ignore that branch.
4. Otherwise, continue.
Reference: The heuristic rejects branches that undo a sub-goal already achieved in the chosen serial order.

</details>

<details>
<summary><strong>Q48.</strong> How do you apply the state abstraction heuristic?</summary>

Method:
1. Identify the current goal facts.
2. Decide which objects/facts cannot affect those goals.
3. Remove irrelevant facts from the state description.
4. Remove actions involving only irrelevant material.
5. Search in the smaller abstract state space.
Reference: State abstraction means removing irrelevant parts of the state.

</details>

<details>
<summary><strong>Q49.</strong> How do you decide whether a fact/action is irrelevant for state abstraction?</summary>

Ask: can this fact or object affect whether the goal facts become true?
- If yes, keep it.
- If no, abstract it away.
Then ignore actions that only change abstracted-away material.
Reference: State abstraction reduces the planning problem by ignoring state details irrelevant to the current goal.

</details>

<details>
<summary><strong>Q50.</strong> Discriminator: serializable sub-goals vs state abstraction — order goals or remove details?</summary>

Ask what the heuristic changes.
- Serializable sub-goals: orders goal facts and avoids undoing earlier ones.
- State abstraction: removes irrelevant state facts/actions.
Reference: Both reduce search, but one uses goal ordering and the other shrinks the state representation.

</details>

<details>
<summary><strong>Q51.</strong> How do you recognize hierarchical planning?</summary>

Use it when planning directly with primitive actions would create too much low-level branching.
Method:
1. Start with an abstract high-level task.
2. Refine it into smaller high-level tasks.
3. Continue until all tasks are primitive executable actions.
Reference: Hierarchical planning handles complexity by planning at an abstract level first and filling details later.

</details>

<details>
<summary><strong>Q52.</strong> What is an HTN?</summary>

Use the term when a plan is represented as tasks that can be decomposed into lower-level tasks/actions.
Method:
1. Separate higher-level actions from primitive actions.
2. Define refinements/decompositions.
3. Search for a decomposition ending in primitive actions.
Reference: HTN stands for Hierarchical Task Network, a planning approach using primitive actions and higher-level actions.

</details>

<details>
<summary><strong>Q53.</strong> How do you identify a primitive action in HTN planning?</summary>

Ask: does this action need further planning?
- No: primitive action.
- Yes: higher-level action.
Use primitive actions as executable leaves of the plan.
Reference: Primitive actions are lowest-level actions, the same kind as PDDL actions, that no longer need further planning.

</details>

<details>
<summary><strong>Q54.</strong> How do you identify a higher-level action (HLA)?</summary>

Ask: does the action stand for a task that still needs to be refined?
Method:
1. Treat the HLA as an abstract placeholder.
2. Choose one possible decomposition/implementation.
3. Refine until only primitive actions remain.
Reference: Higher-level actions represent things that need to be planned further.

</details>

<details>
<summary><strong>Q55.</strong> What makes a plan an implementation in HTN planning?</summary>

Checklist:
1. Inspect every action in the plan.
2. If any action still needs decomposition, it is not an implementation.
3. If all actions are primitive, it is an implementation.
Reference: If a plan contains only primitive actions, it is called an implementation.

</details>

<details>
<summary><strong>Q56.</strong> When does a high-level plan achieve a goal?</summary>

Method:
1. List possible implementations of the high-level plan.
2. Check whether at least one implementation reaches the goal.
3. If at least one does, the high-level plan achieves the goal.
Reference: A high-level plan achieves a goal if at least one of its implementations achieves the goal.

</details>

<details>
<summary><strong>Q57.</strong> How do you do top-down HTN planning?</summary>

Method:
1. Start with one broad high-level action representing the whole task.
2. Refine it into intermediate high-level actions.
3. Refine each intermediate action further.
4. Stop when the plan contains only primitive actions.
Reference: Hierarchical planning is usually done top down, from high-level actions to primitive actions.

</details>

<details>
<summary><strong>Q58.</strong> Discriminator: BFS vs DFS in HTN planning — refine level or refine one subtask?</summary>

Ask: are all tasks at the current abstraction level handled before going deeper?
- HTN BFS: refine/consider all items at one level first.
- HTN DFS: choose one sub-action and refine it fully before returning.
Reference: HTN planning can use breadth-first, depth-first, or more sophisticated search methods.

</details>

<details>
<summary><strong>Q59.</strong> How does iterative deepening work in hierarchical planning?</summary>

Method:
1. Run depth-first refinement only down to a fixed depth.
2. If no implementation/plan is found, increase the depth limit.
3. Repeat until a plan is found or limits are exhausted.
4. Gain lower memory use than breadth-first search.
Reference: Iterative deepening is depth-first search with gradually increasing depth limits.

</details>

<details>
<summary><strong>Q60.</strong> Discriminator: PDDL planning vs HTN planning — flat actions or decomposed tasks?</summary>

Ask: does the planner search directly over primitive action schemas, or does it decompose high-level tasks first?
- PDDL-style classical planning: actions are primitive schemas over states.
- HTN planning: adds higher-level actions above primitive actions.
Reference: HTNs extend PDDL-style primitive actions with higher-level task structure.

</details>

<details>
<summary><strong>Q61.</strong> Why are higher-level action effects hard to write?</summary>

Reasoning method:
1. List possible implementations of the HLA.
2. Compare their side effects.
3. Notice that different implementations may change different facts.
4. Therefore a single simple effect list may misrepresent the HLA.
Reference: Different implementations of the same higher-level action may have different effects.

</details>

<details>
<summary><strong>Q62.</strong> How does the search-and-reject approach handle HLAs?</summary>

Method:
1. Generate or choose a possible implementation.
2. Test whether it leads to a goal-achieving plan.
3. Reject it if its effects make the plan fail.
4. Try another implementation.
Reference: One approach to HLAs is to search over implementations and reject failed ones.

</details>

<details>
<summary><strong>Q63.</strong> How does abstract-level search with possible effects handle HLAs?</summary>

Method:
1. Represent the HLA using possible effects.
2. Search over abstract actions and possible outcomes.
3. Find a high-level plan with desired possible outcomes.
4. Then choose an implementation that actually realizes those outcomes.
Reference: Abstract-level search can use possible effects to reason before committing to a specific implementation.

</details>

<details>
<summary><strong>Q64.</strong> How do you read possible-effects notation for HLAs?</summary>

Method:
1. Read ~E as “E may be added by some implementation.”
2. Read ~not E as “E may be removed by some implementation.”
3. Treat these as possibilities, not guaranteed effects.
Reference: Possible-effects notation represents effects that may occur under some implementation of a higher-level action.

</details>

<details>
<summary><strong>Q65.</strong> What is the limitation of possible-effects notation for mutually exclusive effects?</summary>

Method to spot the problem:
1. List possible effects of an HLA.
2. Ask whether one implementation can produce all of them together.
3. If effects belong to different mutually exclusive implementations, the abstraction overstates what is possible.
Reference: Possible-effects representation may fail to capture mutually exclusive effects of different implementations.

</details>

<details>
<summary><strong>Q66.</strong> How do you recognize online planning?</summary>

Use it when planning continues during execution rather than being completed entirely beforehand.
Triggers:
1. Unknown facts discovered by acting/perceiving.
2. Failed preconditions during execution.
3. Changed goals.
4. Environment changes that break the remaining plan.
Reference: Online planning is planning that occurs during execution.

</details>

<details>
<summary><strong>Q67.</strong> Discriminator: classical planning vs online planning — fixed known world or changing/uncertain execution?</summary>

Ask: is the whole environment known and stable before execution?
- Yes: classical planning assumptions fit.
- No: online planning/replanning may be needed.
Reference: Online planning relaxes classical assumptions by handling uncertainty, perception during execution, and environmental change.

</details>

<details>
<summary><strong>Q68.</strong> How do you build a contingent plan?</summary>

Method:
1. Identify known unknowns that matter for action choice.
2. Identify perception/actions that reveal those facts.
3. Put those observations before the branch point.
4. Use if-then-else branches for the possible conditions.
5. Include replan if an unexpanded contingency occurs.
Reference: A contingent plan branches depending on perceived information or conditions.

</details>

<details>
<summary><strong>Q69.</strong> How do you read if-then-else structure in contingent planning?</summary>

Method:
1. Execute perception actions first if needed.
2. Test the first condition.
3. If true, execute its branch.
4. Otherwise test the next condition.
5. If no planned branch applies, replan.
Reference: Contingent plans use if-then-else syntax around action choices.

</details>

<details>
<summary><strong>Q70.</strong> What does noop mean in a contingent plan?</summary>

Use noop when the checked condition shows no action is needed.
Method:
1. Test the condition.
2. If the goal is already satisfied for that branch, choose noop.
3. Continue execution without changing the state.
Reference: noop means no operation.

</details>

<details>
<summary><strong>Q71.</strong> When should a planner use replan during execution?</summary>

Use replan when the current plan can no longer safely continue.
Triggers:
1. A needed precondition fails unexpectedly.
2. The remaining plan will not work.
3. The goal changes.
4. The environment changes.
5. A contingent branch was not planned in detail.
Reference: Replanning is needed when execution reveals that the original or remaining plan is no longer adequate.

</details>

<details>
<summary><strong>Q72.</strong> How can variables appear in contingent initial states/effects?</summary>

Method:
1. Use a variable for a value that exists but is not known before execution.
2. Use a perception action to bind/discover that value.
3. Let later conditions or effects depend on the discovered value.
Reference: Contingent planning may require variables in initial states and in action effects.

</details>

<details>
<summary><strong>Q73.</strong> How do you monitor execution for online replanning?</summary>

Method:
1. After each action, compare the expected state with the observed/current state.
2. Check whether the next action’s preconditions still hold.
3. Check whether the remaining plan can still reach the goal.
4. If not, trigger replanning.
Reference: Online planners must monitor failed preconditions, changed goals, and environmental changes during execution.

</details>

<details>
<summary><strong>Q74.</strong> How do you do minimal replanning after an action reaches an unexpected state?</summary>

Method:
1. Let S_actual be the observed state after failure.
2. Let S_expected be the state where the original plan expected to be.
3. Search for a repair plan from S_actual to S_expected.
4. Resume the original plan from S_expected if successful.
Reference: Minimal replanning tries to repair the plan by returning to a state where the original plan can continue.

</details>

<details>
<summary><strong>Q75.</strong> How do you choose alternative repair targets in replanning?</summary>

Method:
1. Start from the unexpected current state.
2. Test whether you can reach the next expected state.
3. Also test whether you can reach later states in the original plan.
4. Prefer a close target that uses fewer resources and preserves more of the original plan.
Reference: Replanning may target the expected next state or a later state in the original plan.

</details>

<details>
<summary><strong>Q76.</strong> Discriminator: contingent planning vs replanning — branch in advance or plan during execution?</summary>

Ask: was the branch prepared before the contingency happened?
- Contingent planning: pre-written if-then-else branches for known possibilities.
- Replanning: generate a new/repair plan during execution when the current plan is inadequate.
Reference: Contingent planning handles known contingencies; online replanning handles execution-time uncertainty or change.

</details>

<details>
<summary><strong>Q77.</strong> Cross-connection: how does PDDL feed into forward and backward search?</summary>

Method:
1. Use PDDL predicates to describe states.
2. Use action schemas to define preconditions and effects.
3. Forward search applies actions by checking preconditions.
4. Backward search regresses through actions by checking effects.
Reference: PDDL is the representation language; forward/backward search are ways to solve problems represented in that style.

</details>

<details>
<summary><strong>Q78.</strong> Cross-connection: how do heuristics and HTNs both reduce planning complexity?</summary>

Discriminator question: do you guide a flat search or avoid flat search?
- Heuristics: guide/prune search among states/actions.
- HTNs: plan abstractly first, then decompose into details.
Reference: Both manage planning complexity, but heuristics evaluate search states while HTNs introduce hierarchical task structure.

</details>

<details>
<summary><strong>Q79.</strong> High-value definition drill: what should you define cleanly from this lecture?</summary>

Checklist definitions to practise:
1. Planning problem.
2. Action schema.
3. Closed world assumption.
4. Forward search.
5. Backward search.
6. Admissible heuristic.
7. Ignore-preconditions heuristic.
8. Serializable sub-goals.
9. State abstraction.
10. HTN and implementation.
11. Contingent plan and online planning.
Reference: These are the lecture’s high-value definitions.

</details>
