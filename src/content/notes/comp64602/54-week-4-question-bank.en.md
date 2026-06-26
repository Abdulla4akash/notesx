---
subject: COMP64602
chapter: 54
title: "Week 4 — Question Bank"
language: en
---

# COMP64602 Chapter 4 Week 4 — Worked Question Bank

**Sheet covered:** Logic, intelligent agents, logic-based agents, BDI agents, organisations/roles, and institutions/norms.

**Important scope note:** the sheet says First Order Logic is background rather than directly examinable, but the later agent, institution, and norm material assumes it. So the FOL questions below are included as support drills, not as the main examinable target.

---

## Task types identified from the sheet

The lecture sheet contains these examinable or support-task patterns:

1. **FOL syntax tasks** — classify terms, formulae, connectives, quantifiers, free variables, and bound variables.
2. **FOL semantic evaluation tasks** — evaluate formulae in a model, especially over a small finite domain.
3. **Model/minimal-model tasks** — interpret a model written as a set of true formulae and identify the smallest relevant domain for a knowledge base.
4. **Agent-definition tasks** — decide whether a system is an agent, autonomous, proactive, reactive, and/or socially able.
5. **Logic-based agent tasks** — apply the action-choice algorithm using `Delta |- do(a)`, `Delta not|- not do(a)`, and `noop`.
6. **Unification/action-rule tasks** — instantiate variables in rules using current facts and derive an action.
7. **BDI workflow tasks** — map sensor input to belief revision, options, desires/goals, intentions, plans, action, and later revision.
8. **Organisation/role tasks** — identify organisation goals, roles, role goals, capabilities, obligations, delegation, and design-time/runtime use.
9. **Institution/norm tasks** — classify norms as permissions, obligations, or prohibitions; monitor violations; build external and institutional traces.
10. **Deontic-logic support tasks** — interpret `O`, `P`, `PA ≡ not O not A`, and the three deontic axioms from the sheet.
11. **Edge-case tasks** — handle free-variable conventions, rule conflicts, action-order bias, stale reasoning, and the difference between external facts and institutional facts.

---

# Section 1 — Mechanical / single-step drills

These are deliberately small. The point is to practise the decision procedure before the examples become layered.

## Questions

### Q1. Classify FOL expressions

For each expression, classify it as one of: constant term, variable term, function term, simple formula, complex formula, or quantified formula.

1. `a`
2. `X`
3. `owner(a)`
4. `taller_than(owner(a), b)`
5. `not postman(X)`
6. `forall X. dog(X) -> animal(X)`
7. `height(owner(a))`

---

### Q2. Identify the main connective

For each formula, identify the main connective and state the method for reading it.

1. `P and Q`
2. `P or Q`
3. `P -> Q`
4. `P <-> Q`
5. `not P`

---

### Q3. Find free and bound variables

In the formula below, identify the free and bound variables:

`forall X. (pet(X) and owns(Y, X)) -> responsible(Y)`

---

### Q4. Evaluate the dog/cat model formulae

Use the running dog/cat-style model from the sheet:

- Domain: `Delta = {dog, cat}`
- `I(a) = dog`
- `I(b) = cat`
- `I(is_dog)(dog) = true`
- `I(is_dog)(cat) = false`

Evaluate:

1. `is_dog(a)`
2. `is_dog(b)`
3. `forall X. is_dog(X)`
4. `exists X. is_dog(X)`

---

### Q5. Agent or not?

A thermostat senses the room temperature. If the room is below the target temperature, it turns heating on. If the room is above the target temperature, it turns heating off.

Is it:

1. an agent?
2. autonomous?
3. the kind of intelligent agent emphasised in the unit?

---

### Q6. Classify intelligent-agent properties

For each behaviour, say whether it mainly shows **proactiveness**, **reactiveness**, or **social ability**.

1. A delivery robot keeps choosing actions that move it closer to its delivery destination.
2. The robot detects a sudden obstacle and changes route.
3. The robot negotiates with another robot about which corridor each should use.
4. The robot has the same sensor input as before, but chooses differently because its goal has changed.

---

### Q7. Interpret deontic notation

Interpret each item in ordinary language.

1. `O A`
2. `P A`
3. `P A ≡ not O not A`
4. `O(A -> B) -> (O A -> O B)`
5. `O A -> P A`

---

## Solutions — Section 1

### Solution 1. Classify FOL expressions

**Step 1 — Ask whether the expression denotes an object or has a truth value.**

- If it denotes an object, it is a **term**.
- If it can be true or false, it is a **formula**.

**Step 2 — If it is a term, identify the kind of term.**

- `a` is a **constant term** because it names a fixed object.
- `X` is a **variable term** because it can range over objects.
- `owner(a)` is a **function term** because a function symbol is applied to an argument and returns an object.
- `height(owner(a))` is also a **function term**: `owner(a)` first denotes an object, then `height(...)` maps that object to another object/value.

**Step 3 — If it is a formula, identify whether it is simple or complex.**

- `taller_than(owner(a), b)` is a **simple formula** because a predicate symbol is applied to terms.
- `not postman(X)` is a **complex formula** because it is built from the simpler formula `postman(X)` using negation.
- `forall X. dog(X) -> animal(X)` is a **quantified formula** and also a complex formula because it uses a quantifier and implication.

**Final classification:**

| Expression | Classification |
|---|---|
| `a` | constant term |
| `X` | variable term |
| `owner(a)` | function term |
| `taller_than(owner(a), b)` | simple formula |
| `not postman(X)` | complex formula |
| `forall X. dog(X) -> animal(X)` | quantified formula |
| `height(owner(a))` | function term |

---

### Solution 2. Identify the main connective

**Step 1 — Look for the top-level logical operator.**

The main connective is the operator that combines or modifies the largest formula.

**Step 2 — Translate the connective.**

| Formula | Main connective | Reading method |
|---|---|---|
| `P and Q` | conjunction | true when both `P` and `Q` hold |
| `P or Q` | disjunction | true when at least one of `P`, `Q` holds |
| `P -> Q` | implication | if `P` holds, then `Q` must hold |
| `P <-> Q` | iff / biconditional | `P` and `Q` imply each other |
| `not P` | negation | true when `P` is false |

---

### Solution 3. Find free and bound variables

Formula:

`forall X. (pet(X) and owns(Y, X)) -> responsible(Y)`

**Step 1 — Identify quantified variables.**

The quantifier is `forall X`, so `X` is bound wherever it occurs inside the scope of the quantifier.

**Step 2 — Find all occurrences of `X`.**

`X` occurs in:

- `pet(X)`
- `owns(Y, X)`

Both are inside the scope of `forall X`, so both occurrences of `X` are **bound**.

**Step 3 — Find variables not bound by any quantifier.**

`Y` occurs in:

- `owns(Y, X)`
- `responsible(Y)`

There is no `forall Y` or `exists Y`, so `Y` is **free**.

**Answer:**

- Bound variable: `X`
- Free variable: `Y`

**Exam warning:** in the unit, free capital-letter variables are often treated informally as universally quantified, as in Datalog. Formally, though, `Y` is free unless a quantifier binds it.

---

### Solution 4. Evaluate the dog/cat model formulae

Model:

- `Delta = {dog, cat}`
- `I(a) = dog`
- `I(b) = cat`
- `I(is_dog)(dog) = true`
- `I(is_dog)(cat) = false`

#### 1. `is_dog(a)`

**Step 1 — Interpret the constant.**

`I(a) = dog`.

**Step 2 — Apply the predicate to the interpreted object.**

`I(is_dog)(dog) = true`.

**Answer:** `is_dog(a)` is true in the model.

#### 2. `is_dog(b)`

**Step 1 — Interpret the constant.**

`I(b) = cat`.

**Step 2 — Apply the predicate.**

`I(is_dog)(cat) = false`.

**Answer:** `is_dog(b)` is false in the model.

#### 3. `forall X. is_dog(X)`

**Step 1 — Universal quantifier method.**

Check every object in the domain.

**Step 2 — Check each object.**

- For `dog`: `is_dog(dog)` is true.
- For `cat`: `is_dog(cat)` is false.

**Step 3 — Decide universal truth.**

A universal formula is false if even one domain object fails.

**Answer:** `forall X. is_dog(X)` is false.

#### 4. `exists X. is_dog(X)`

**Step 1 — Existential quantifier method.**

Look for at least one object in the domain that satisfies the formula.

**Step 2 — Check for a witness.**

`dog` satisfies `is_dog(X)`.

**Answer:** `exists X. is_dog(X)` is true.

---

### Solution 5. Agent or not?

**Step 1 — Check situatedness.**

The thermostat is situated in an environment: the room/house temperature.

**Step 2 — Check sensing.**

It senses the temperature.

**Step 3 — Check action.**

It acts by switching heating on or off.

**Step 4 — Check autonomy.**

It acts without a human making each individual on/off decision, so it is autonomous in the lecture’s basic sense.

**Step 5 — Check whether it is the unit’s target kind of intelligent agent.**

Its behaviour is fixed: same temperature reading gives same action. It does not show rich goal-directed choice, adaptive reasoning, or social coordination.

**Answer:**

1. It is an agent.
2. It is autonomous.
3. It is not the richer kind of intelligent agent the unit focuses on.

---

### Solution 6. Classify intelligent-agent properties

**Step 1 — Use the discriminator.**

- **Proactive:** initiative toward a delegated objective.
- **Reactive:** timely response to environmental change.
- **Social ability:** interaction with other agents or humans.

**Step 2 — Classify each behaviour.**

1. Moving closer to a delivery destination is **proactiveness** because the robot is pursuing a goal.
2. Detecting an obstacle and changing route is **reactiveness** because it responds to a change in the environment.
3. Negotiating corridor use is **social ability** because it interacts with another agent.
4. Choosing differently because the goal changed is **proactiveness**, because the same perception can lead to different action depending on the current objective.

---

### Solution 7. Interpret deontic notation

**Step 1 — Decode the symbols.**

- `O` means obligation.
- `P` means permission.

**Step 2 — Translate each expression.**

1. `O A`: it is obligatory that `A` is done/true.
2. `P A`: it is permitted that `A` is done/true.
3. `P A ≡ not O not A`: being permitted to do `A` means the agent is not obliged to avoid `A`.
4. `O(A -> B) -> (O A -> O B)`: if it is obligatory that `A` implies `B`, and `A` is obligatory, then `B` is obligatory.
5. `O A -> P A`: if something is obligatory, then it is permitted.

**Common trap:** `P A` does not mean `O A`. Permission is weaker than obligation.

---

# Section 2 — Multi-condition checks

These questions combine more than one lecture idea at a time.

## Questions

### Q8. Evaluate a finite model with more than one predicate

Use this model:

- Domain: `Delta = {r, k}`
- `I(rover) = r`
- `I(kitty) = k`
- `dog(r) = true`, `dog(k) = false`
- `cat(r) = false`, `cat(k) = true`
- `owns(pat, r) = true`, `owns(pat, k) = false`

Evaluate:

1. `exists X. dog(X) and owns(pat, X)`
2. `forall X. cat(X) -> not dog(X)`
3. `forall X. owns(pat, X)`

---

### Q9. Interpret a model written as a set of formulae

Suppose the lecturer writes a model as:

`M = {open(door1), locked(door2)}`

Assume the relevant atomic formulae are:

- `open(door1)`
- `open(door2)`
- `locked(door1)`
- `locked(door2)`

Using the sheet’s convention, evaluate:

1. `open(door1)`
2. `open(door2)`
3. `not locked(door1)`
4. `exists X. open(X)`

---

### Q10. Identify a minimal model domain

A knowledge base contains:

- constants: `rover`, `kitty`
- facts: `dog(rover)`, `cat(kitty)`
- rule: `forall X. dog(X) -> animal(X)`

Under the lecture’s minimal-model idea, what is the smallest relevant domain, and which obvious formula about `rover` follows from the rule?

---

### Q11. Apply the logic-based action-choice algorithm: positive proof

The action set is ordered as:

`A = [collect, move, stop]`

The knowledge base `Delta` proves:

- `Delta |- do(move)`
- `Delta |- do(stop)`

It does not prove `do(collect)`.

Which action does the algorithm return?

---

### Q12. Apply the action-choice algorithm: second loop

The action set is ordered as:

`A = [a1, a2, a3]`

The knowledge base proves no positive action:

- `Delta not|- do(a1)`
- `Delta not|- do(a2)`
- `Delta not|- do(a3)`

But it proves:

- `Delta |- not do(a1)`
- `Delta not|- not do(a2)`
- `Delta |- not do(a3)`

Which action is returned?

---

### Q13. Apply the action-choice algorithm: `noop`

The action set is:

`A = [a1, a2]`

The knowledge base proves:

- no `do(a)` for any action
- `not do(a1)`
- `not do(a2)`

What is returned?

---

### Q14. Run simple BDI belief revision

An agent currently believes:

`{at(room1), obstacle(corridor), battery_ok}`

New sensor input says:

`{at(room1), clear(corridor), battery_ok}`

Assume this practical BDI system uses **simple belief revision**: add new sensed facts and remove directly contradicted old facts.

What should the new belief base contain?

---

### Q15. Analyse the course as an organisation

Using the sheet’s course-organisation running example, identify:

1. the organisation,
2. an overall organisational goal,
3. three roles,
4. one capability of the lecturer role,
5. one obligation of the lecturer role,
6. one delegation relation.

---

### Q16. Detect a norm violation in the coursework institution

An institution has this norm:

`O(student, submit_by(day2))`

The external trace says:

- day 1: coursework is set
- day 2 passes with no submission
- day 3: the student submits

What institutional fact should be generated after day 2 passes?

---

## Solutions — Section 2

### Solution 8. Evaluate a finite model with more than one predicate

#### 1. `exists X. dog(X) and owns(pat, X)`

**Step 1 — Existential method.**

Find one object in the domain that makes both conjuncts true.

**Step 2 — Try `r`.**

- `dog(r) = true`
- `owns(pat, r) = true`

Both are true.

**Step 3 — Stop once a witness is found.**

Because `r` satisfies the formula, the existential formula is true.

**Answer:** true.

#### 2. `forall X. cat(X) -> not dog(X)`

**Step 1 — Universal method.**

Check every object in the domain.

**Step 2 — Check `r`.**

- `cat(r) = false`
- The implication `cat(r) -> not dog(r)` is true because the antecedent is false.

**Step 3 — Check `k`.**

- `cat(k) = true`
- `dog(k) = false`
- so `not dog(k) = true`
- therefore `cat(k) -> not dog(k)` is true.

**Step 4 — Universal conclusion.**

Both objects pass.

**Answer:** true.

#### 3. `forall X. owns(pat, X)`

**Step 1 — Universal method.**

Check every object.

**Step 2 — Check `r`.**

`owns(pat, r) = true`.

**Step 3 — Check `k`.**

`owns(pat, k) = false`.

**Step 4 — Universal conclusion.**

One counterexample is enough to make the universal false.

**Answer:** false.

---

### Solution 9. Interpret a model written as a set of formulae

Model shorthand:

`M = {open(door1), locked(door2)}`

**Step 1 — Use the sheet’s shorthand convention.**

Formulae listed in the model are true. Relevant simple formulae not listed are false.

So:

- `open(door1)` is true.
- `locked(door2)` is true.
- `open(door2)` is false.
- `locked(door1)` is false.

#### 1. `open(door1)`

Listed in `M`, so true.

#### 2. `open(door2)`

Not listed, so false.

#### 3. `not locked(door1)`

`locked(door1)` is not listed, so `locked(door1)` is false. Therefore `not locked(door1)` is true.

#### 4. `exists X. open(X)`

There is at least one object with `open(...)` true: `door1`.

**Answer:** true.

---

### Solution 10. Identify a minimal model domain

**Step 1 — Identify the constants mentioned by the knowledge base.**

The constants are:

- `rover`
- `kitty`

**Step 2 — Build the smallest relevant domain.**

The minimal domain contains the interpretations of just those constants:

`Delta = {I(rover), I(kitty)}`

Sloppily, the lecturer may write:

`Delta = {rover, kitty}`

**Step 3 — Add facts that are explicitly true.**

The KB contains:

- `dog(rover)`
- `cat(kitty)`

**Step 4 — Apply the rule.**

Rule:

`forall X. dog(X) -> animal(X)`

Instantiate `X = rover`.

Since `dog(rover)` is true, derive:

`animal(rover)`

**Answer:** the minimal relevant domain is `{I(rover), I(kitty)}`, and `animal(rover)` follows.

---

### Solution 11. Apply the action-choice algorithm: positive proof

Algorithm:

```text
for each a in A:
    if Delta |- do(a):
        return a
for each a in A:
    if Delta not|- not do(a):
        return a
return noop
```

Action order:

`[collect, move, stop]`

**Step 1 — First loop: check for positive recommendations.**

- `collect`: `Delta` does not prove `do(collect)`, so skip.
- `move`: `Delta |- do(move)`, so return `move` immediately.

**Step 2 — Do not continue after returning.**

Even though `Delta |- do(stop)` is also true, the algorithm returns the first provably recommended action in the action ordering.

**Answer:** `move`.

---

### Solution 12. Apply the action-choice algorithm: second loop

**Step 1 — First loop: look for `Delta |- do(a)`.**

No positive action is provable, so the first loop returns nothing.

**Step 2 — Second loop: look for the first action not ruled out.**

Check actions in order:

- `a1`: `Delta |- not do(a1)`, so `a1` is ruled out.
- `a2`: `Delta not|- not do(a2)`, so `a2` is not ruled out.

**Step 3 — Return first not-ruled-out action.**

The algorithm returns `a2` immediately.

**Answer:** `a2`.

---

### Solution 13. Apply the action-choice algorithm: `noop`

**Step 1 — First loop: check for positive action proofs.**

No `do(a)` is provable, so no action is returned.

**Step 2 — Second loop: check whether any action is not ruled out.**

- `a1` is ruled out because `Delta |- not do(a1)`.
- `a2` is ruled out because `Delta |- not do(a2)`.

**Step 3 — Final case.**

Every action is ruled out, so the algorithm returns no operation.

**Answer:** `noop`.

---

### Solution 14. Run simple BDI belief revision

Old beliefs:

`{at(room1), obstacle(corridor), battery_ok}`

Sensor input:

`{at(room1), clear(corridor), battery_ok}`

**Step 1 — Keep unchanged beliefs confirmed by perception.**

Both old and new contain:

- `at(room1)`
- `battery_ok`

Keep them.

**Step 2 — Add new sensed facts.**

New sensor input contains:

- `clear(corridor)`

Add it.

**Step 3 — Remove directly contradicted old facts.**

`clear(corridor)` contradicts `obstacle(corridor)`, so remove:

- `obstacle(corridor)`

**Answer:**

`{at(room1), clear(corridor), battery_ok}`

**Why this is BDI-style:** this is simple belief revision, not full theorem proving over all consequences.

---

### Solution 15. Analyse the course as an organisation

**Step 1 — Identify the organisation.**

The organisation is the course/unit structure, e.g. `COMP64602`.

**Step 2 — Identify the overall goal.**

A suitable organisational goal is:

Students learn more about knowledge representation and reasoning by the end of the unit.

**Step 3 — Identify roles.**

Possible roles include:

- unit lead
- lecturer
- graduate teaching assistant
- student

**Step 4 — Identify a capability of the lecturer role.**

The lecturer can edit/add/alter course material and assign coursework grades.

**Step 5 — Identify an obligation of the lecturer role.**

The lecturer has obligations such as releasing material, releasing coursework, marking coursework, or answering questions on time.

**Step 6 — Identify delegation.**

The unit lead may delegate tasks to the lecturer. The lecturer may delegate marking/support tasks to GTAs.

**Answer:**

- Organisation: `COMP64602`
- Goal: students learn KR&R content
- Roles: unit lead, lecturer, GTA, student
- Lecturer capability: edit/add material or assign grades
- Lecturer obligation: release/mark/respond on time
- Delegation: unit lead -> lecturer, lecturer -> GTA

---

### Solution 16. Detect a norm violation in the coursework institution

Norm:

`O(student, submit_by(day2))`

Trace:

- day 1: coursework set
- day 2 passes with no submission
- day 3: student submits

**Step 1 — Identify the obligation.**

The student is obliged to submit by day 2.

**Step 2 — Monitor whether the required event happens by the deadline.**

No submission happens by the time day 2 passes.

**Step 3 — Generate an institutional violation event/fact.**

After the deadline passes, the institution should record a violation such as:

`viol(student, submit_by(day2))`

or an institutional fact such as:

`late_submission(student)`

**Step 4 — Treat day 3 submission carefully.**

The day 3 submission is still an external event, but it does not erase the fact that the day 2 obligation was violated.

**Answer:** after day 2 passes, generate a violation/late-submission institutional fact.

---

# Section 3 — Building things from scratch

These ask you to construct the representation, then run the method.

## Questions

### Q17. Translate a small domain into FOL

Represent the following in FOL-style notation:

1. Every registered user with a valid token can access the dashboard.
2. There exists a registered user who lacks a valid token.
3. `u1` is registered.
4. `u1` has a valid token.

Then state whether `can_access_dashboard(u1)` follows.

---

### Q18. Build a minimal model and evaluate a query

Knowledge base:

- `student(alex)`
- `submitted(alex)`
- `student(blair)`
- `forall X. student(X) and submitted(X) -> compliant(X)`

Use minimal-model style reasoning. What is the minimal relevant domain, and does `exists X. compliant(X)` hold?

---

### Q19. Write rules for a simple logic-based cleaning agent

A cleaning agent has possible actions:

`A = [empty_bin, clean, move, noop_action]`

It has facts:

- `at(room1)`
- `dirty(room1)`
- `bin_full`
- `connected(room1, room2)`

Write rules so that:

1. if the bin is full, empty it;
2. if the current room is dirty and the bin is not full, clean it;
3. if the current room is clean and connected to another room, move there.

Then run the action-choice algorithm for the current facts.

---

### Q20. Run the grid-world logic-based agent

Use the sheet’s grid-world pattern:

Facts initially include:

- `at(1,1)`
- `not_gold`
- `unexplored(0,0)`
- `unexplored(0,1)`

Rules:

1. `at(X,Y) and not_gold and unexplored(A,B) -> do(go(A,B))`
2. `at(X,Y) and gold -> do(collect(gold))`

Assume facts are considered in the listed order.

Work through the first three action decisions if:

- after going to `(0,0)`, the agent perceives `gold`;
- after collecting, perception changes `gold` to `not_gold` and marks `(0,0)` explored.

---

### Q21. Build a BDI trace from a delivery scenario

A delivery agent has:

- beliefs: `{at(depot), road_clear(route1), package_waiting}`
- desires: `{deliver_package, conserve_battery}`
- plans:
  - `deliver_package`: `[pick_up_package, drive_route1, drop_off_package]`
  - `conserve_battery`: `[return_to_charger]`

Sensor input now says `road_blocked(route1)`.

Construct one BDI cycle using the lecturer-style workflow.

---

### Q22. Design an organisation and role structure

A multi-agent warehouse system contains human workers, inventory robots, packing robots, and a supervisor agent. The overall goal is to process orders accurately and on time.

Identify:

1. the organisation,
2. the overall goal,
3. three roles,
4. one capability for each role,
5. one obligation for each role,
6. one delegation relationship.

---

### Q23. Build an institutional trace for a library rule

An institution has this rule:

- When a user borrows a book, they are obliged to return it by day 7.
- If day 7 passes and the book has not been returned, record `late_return(user)`.
- If `late_return(user)` is recorded, the library may impose a fine.

External trace:

- day 0: `borrow(sam, book1)`
- day 7 passes: no return
- day 8: `return(sam, book1)`

Build the institutional trace up to day 8.

---

### Q24. Turn obligations into goals and sanctions

An institutional state contains:

`{O(alex, submit(report, d5)), O(marker, mark(alex, d20)), late_submission(blair)}`

For an agent representing Alex, and for an automated marking system, explain how these institutional facts can be used operationally.

---

## Solutions — Section 3

### Solution 17. Translate a small domain into FOL

**Step 1 — Choose predicates.**

Use:

- `registered(X)`
- `valid_token(X)`
- `can_access_dashboard(X)`

**Step 2 — Represent the universal rule.**

“Every registered user with a valid token can access the dashboard” becomes:

`forall X. (registered(X) and valid_token(X)) -> can_access_dashboard(X)`

**Step 3 — Represent the existential statement.**

“There exists a registered user who lacks a valid token” becomes:

`exists X. registered(X) and not valid_token(X)`

**Step 4 — Represent facts about `u1`.**

`registered(u1)`

`valid_token(u1)`

**Step 5 — Instantiate the universal rule for `u1`.**

From the rule:

`(registered(u1) and valid_token(u1)) -> can_access_dashboard(u1)`

**Step 6 — Check the antecedent.**

Both `registered(u1)` and `valid_token(u1)` are facts.

**Step 7 — Derive the conclusion.**

`can_access_dashboard(u1)` follows.

**Answer:** yes, `can_access_dashboard(u1)` follows.

---

### Solution 18. Build a minimal model and evaluate a query

Knowledge base:

- `student(alex)`
- `submitted(alex)`
- `student(blair)`
- `forall X. student(X) and submitted(X) -> compliant(X)`

**Step 1 — Identify constants.**

Constants appearing in the KB:

- `alex`
- `blair`

**Step 2 — Build the minimal relevant domain.**

`Delta = {I(alex), I(blair)}`

Informally:

`Delta = {alex, blair}`

**Step 3 — Add explicit facts.**

- `student(alex)` true
- `submitted(alex)` true
- `student(blair)` true

**Step 4 — Apply the rule to each relevant object.**

For `alex`:

- `student(alex)` true
- `submitted(alex)` true
- therefore `compliant(alex)` true

For `blair`:

- `student(blair)` true
- `submitted(blair)` is not given
- therefore the rule does not derive `compliant(blair)`

**Step 5 — Evaluate the existential query.**

`exists X. compliant(X)` is true if at least one object is compliant.

`alex` is compliant.

**Answer:** minimal domain `{alex, blair}`; `exists X. compliant(X)` is true.

---

### Solution 19. Write rules for a simple logic-based cleaning agent

Possible actions:

`A = [empty_bin, clean, move, noop_action]`

Current facts:

- `at(room1)`
- `dirty(room1)`
- `bin_full`
- `connected(room1, room2)`

**Step 1 — Write the empty-bin rule.**

`bin_full -> do(empty_bin)`

**Step 2 — Write the clean rule.**

`at(R) and dirty(R) and not bin_full -> do(clean)`

**Step 3 — Write the move rule.**

`at(R1) and clean(R1) and connected(R1, R2) -> do(move(R2))`

**Step 4 — Run the first loop of the action algorithm.**

Check actions in order.

- `empty_bin`: current facts include `bin_full`, so the rule derives `do(empty_bin)`.

**Step 5 — Return immediately.**

The algorithm returns the first action for which `Delta |- do(a)`.

**Answer:** the agent returns `empty_bin`.

**Reasoning note:** even though the current room is dirty, cleaning is blocked by `bin_full`, and action order already returns `empty_bin` first.

---

### Solution 20. Run the grid-world logic-based agent

Initial facts:

- `at(1,1)`
- `not_gold`
- `unexplored(0,0)`
- `unexplored(0,1)`

Rules:

1. `at(X,Y) and not_gold and unexplored(A,B) -> do(go(A,B))`
2. `at(X,Y) and gold -> do(collect(gold))`

#### Decision 1

**Step 1 — Check current facts.**

The agent has:

- `at(1,1)`
- `not_gold`
- `unexplored(0,0)`

**Step 2 — Match Rule 1.**

Rule 1:

`at(X,Y) and not_gold and unexplored(A,B) -> do(go(A,B))`

Unification:

- `X = 1`
- `Y = 1`
- `A = 0`
- `B = 0`

**Step 3 — Derive action.**

`do(go(0,0))`

**Action 1:** `go(0,0)`.

#### Perception update after Action 1

The agent is now at `(0,0)` and perceives gold.

Updated facts include:

- `at(0,0)`
- `gold`

#### Decision 2

**Step 1 — Check Rule 2.**

Rule 2:

`at(X,Y) and gold -> do(collect(gold))`

**Step 2 — Unify.**

- `X = 0`
- `Y = 0`

**Step 3 — Derive action.**

`do(collect(gold))`

**Action 2:** `collect(gold)`.

#### Perception update after Action 2

After collecting:

- `gold` becomes `not_gold`
- `(0,0)` is marked explored
- `unexplored(0,1)` remains
- current position is still `at(0,0)`

#### Decision 3

**Step 1 — Check current facts.**

The agent has:

- `at(0,0)`
- `not_gold`
- `unexplored(0,1)`

**Step 2 — Match Rule 1 again.**

Unification:

- `X = 0`
- `Y = 0`
- `A = 0`
- `B = 1`

**Step 3 — Derive action.**

`do(go(0,1))`

**Action 3:** `go(0,1)`.

**Pattern:** perceive -> update facts -> reason over rules -> act -> perceive again.

---

### Solution 21. Build a BDI trace from a delivery scenario

Initial beliefs:

`{at(depot), road_clear(route1), package_waiting}`

Desires:

`{deliver_package, conserve_battery}`

Plans:

- `deliver_package`: `[pick_up_package, drive_route1, drop_off_package]`
- `conserve_battery`: `[return_to_charger]`

Sensor input:

`road_blocked(route1)`

**Step 1 — Sensor input.**

The agent receives new information: route 1 is blocked.

**Step 2 — Simple belief revision.**

Remove the contradicted belief:

- remove `road_clear(route1)`

Add the new sensed belief:

- add `road_blocked(route1)`

New beliefs:

`{at(depot), road_blocked(route1), package_waiting}`

**Step 3 — Generate options / deliberate / filter.**

The agent considers its desires:

- `deliver_package`
- `conserve_battery`

But the current plan for `deliver_package` uses `drive_route1`, which is blocked.

**Step 4 — Select an intention.**

A reasonable lecturer-style BDI answer is:

- keep `deliver_package` as a desire/goal,
- but do not instantiate the blocked route-1 plan as the current intention,
- either seek an alternative delivery plan or temporarily select another intention such as `conserve_battery` if no delivery plan is available.

**Step 5 — Act.**

If no alternative delivery plan is available, one possible next action is:

`return_to_charger`

or a planning action such as:

`find_alternative_route`

if such an action exists in the system.

**Step 6 — Loop back.**

After acting, the agent senses again and may revise beliefs, goals, and intentions.

**Answer:** the key BDI move is not just “prove an action”; it revises beliefs, filters options against plans, and commits to an intention that remains feasible.

---

### Solution 22. Design an organisation and role structure

Scenario: multi-agent warehouse system.

**Step 1 — Identify the organisation.**

Organisation:

`Warehouse order-processing organisation`

**Step 2 — Identify the organisational goal.**

Overall goal:

Process orders accurately and on time.

**Step 3 — Identify roles.**

Three roles:

1. inventory robot
2. packing robot
3. supervisor agent

Human worker could also be a role, but three are enough.

**Step 4 — Assign capabilities.**

- Inventory robot: access inventory database; move items from shelves.
- Packing robot: package items; print/attach labels.
- Supervisor agent: assign tasks; monitor deadlines; reallocate work.

**Step 5 — Assign obligations.**

- Inventory robot: retrieve correct items promptly.
- Packing robot: pack items safely and accurately.
- Supervisor agent: ensure delayed orders are escalated or reassigned.

**Step 6 — Add delegation.**

The supervisor agent can delegate item-retrieval tasks to inventory robots and packing tasks to packing robots.

**Answer:** this is an organisation because multiple agents coordinate through roles, capabilities, obligations, and delegation to achieve a goal they cannot achieve individually.

---

### Solution 23. Build an institutional trace for a library rule

Rule:

- Borrowing creates an obligation to return by day 7.
- If day 7 passes and no return has happened, record `late_return(user)`.
- Late return may lead to a fine.

External trace:

- day 0: `borrow(sam, book1)`
- day 7 passes: no return
- day 8: `return(sam, book1)`

#### Step 1 — Initial institutional state

Before borrowing:

`s'_0 = {}`

#### Step 2 — External event: borrow

External event:

`borrow(sam, book1)`

Generation function creates institutional event:

`borrowed_inst(sam, book1)`

Consequence function updates institutional state:

`s'_1 = {O(sam, return(book1, day7))}`

#### Step 3 — External event: day 7 passes with no return

External event:

`new_day(day8)` or `deadline_passed(day7)`

The institution checks whether the obligation was satisfied.

It was not.

Generate institutional violation:

`viol(sam, return(book1, day7))`

Update institutional state:

`s'_2 = {O(sam, return(book1, day7)), late_return(sam)}`

#### Step 4 — External event: day 8 return

External event:

`return(sam, book1)`

The institution may update state to record returned status:

`s'_3 = {returned(sam, book1), late_return(sam)}`

Depending on the formalism, it may also remove the active return obligation or keep it for history. The important institutional fact remains:

`late_return(sam)`

#### Step 5 — Possible sanction

Because `late_return(sam)` is present, the institution may impose:

`fine(sam)`

**Answer:** the late return is not merely the external fact of returning on day 8. It is an institutional fact generated by comparing the external trace against the norm.

---

### Solution 24. Turn obligations into goals and sanctions

Institutional state:

`{O(alex, submit(report, d5)), O(marker, mark(alex, d20)), late_submission(blair)}`

#### For Alex’s agent

**Step 1 — Find obligations about Alex.**

`O(alex, submit(report, d5))`

**Step 2 — Convert obligation into a goal.**

Alex’s agent can create a goal:

`submit(report) before d5`

**Step 3 — Use BDI-style reasoning.**

The goal can feed into desires/goals, then into an intention and plan, such as:

`[write_report, check_report, upload_report]`

#### For the automated marking system

**Step 1 — Find institutional violation facts.**

`late_submission(blair)`

**Step 2 — Treat the violation as sanction-relevant.**

The marking system can use this fact when marking Blair’s work.

**Step 3 — Apply sanction if institution specifies one.**

For example:

`late_submission(blair) -> apply_late_penalty(blair)`

**Answer:** obligations can become goals for agents; violation facts can trigger sanctions by institutional software.

---

# Section 4 — Hard edge cases and method-breakdown drills

These are the high-value exam-style traps: places where two methods look similar but give different answers, or where the model exposes a limitation.

## Questions

### Q25. Free-variable convention trap

Consider:

`well_behaved(X) -> owner(X, peter)`

No quantifier is written. Explain the difference between the formal FOL reading and the unit’s informal/Datalog-style convention.

---

### Q26. Universal implication with no matching objects

Domain:

`Delta = {a, b}`

Facts:

- `student(a) = false`
- `student(b) = false`
- `registered(a) = false`
- `registered(b) = true`

Evaluate:

1. `forall X. student(X) -> registered(X)`
2. `exists X. student(X) and registered(X)`

Explain why the answers differ.

---

### Q27. Logic-based agent conflict: both do and not-do

Action set:

`A = [a1, a2]`

The knowledge base proves both:

- `Delta |- do(a1)`
- `Delta |- not do(a1)`

What does the sheet’s action algorithm return, and what problem does this reveal?

---

### Q28. Action-order bias

Action set:

`A = [a1, a2, a3]`

The knowledge base proves:

- `Delta |- do(a2)`
- `Delta |- do(a3)`

Assume `a3` would be better in the real world. What does the algorithm return, and why is this a limitation?

---

### Q29. Stale reasoning problem

A logic-based robot perceives `clear(path1)` and begins theorem proving. While it reasons, another robot blocks `path1`. The first robot then acts on the old conclusion.

Explain the problem using the lecture’s critique of logic-based agents.

---

### Q30. BDI workflow disagreement: textbook vs lecturer

A question says:

“In a BDI agent, beliefs are just atomic facts after belief revision.”

Give the safest answer using the sheet: when is this true, and when is it too simple?

---

### Q31. Intention as whole plan vs top-step execution

A BDI agent has intention:

`deliver_package` with plan `[drive_to_customer, hand_over_package]`

After `drive_to_customer` begins, sensor input says the customer is no longer at home.

Compare two execution styles:

1. execute the whole intention sequence without reconsideration;
2. execute the top step, then loop back and reconsider.

---

### Q32. Design-time organisation vs runtime organisation

A closed multi-agent system has fixed agents and fixed roles known before deployment. A second system allows unknown agents to join later and take on roles dynamically.

Which one most needs a runtime representation of the organisation, and why?

---

### Q33. Role goal vs personal goal

A delivery agent plays the role `courier` in an organisation. The courier role has the goal `deliver_parcel`. The same agent also has a private goal `minimise_energy_use`.

Which goal belongs to the role, and why does the distinction matter?

---

### Q34. External fact vs institutional fact

In an external trace, the event `submit(vicki, day3)` occurs. The deadline was day 2.

Why is `late_submission(vicki)` not simply an external fact, and how does it arise?

---

### Q35. Permission is not obligation

Suppose an institution records:

`P enter_lab(alex)`

Does this imply:

`O enter_lab(alex)`?

Use the deontic relation from the sheet.

---

### Q36. Prohibition as obligation not to act

A norm says:

“Agents must not access restricted data.”

Represent this as an obligation. Then say what happens if an agent accesses restricted data.

---

### Q37. Consequence function update

Current institutional state:

`s'_i = {O(sam, return(book1, d7))}`

Institutional event:

`viol(sam, return(book1, d7))`

Assume the consequence function adds `late_return(sam)` when this violation occurs.

Compute `s'_{i+1}`.

---

### Q38. Continue the coursework trace under an explicit marking rule

Use the coursework example pattern, but add this explicit rule:

“When a student submits, the marker becomes obliged to mark within 20 days. If the marker has not marked by that deadline, record `late_marking(student)`.”

Events:

- Vicki submits on day 3.
- Barbara marks Vicki on day 30.

What institutional violation occurs, assuming the marking deadline for Vicki is day 23?

---

## Solutions — Section 4

### Solution 25. Free-variable convention trap

Formula:

`well_behaved(X) -> owner(X, peter)`

**Step 1 — Formal FOL reading.**

In strict FOL, `X` is free because there is no quantifier such as `forall X` or `exists X`.

An open formula with a free variable does not have a simple truth value in a model unless we also provide a variable assignment.

**Step 2 — Unit/Datalog-style convention.**

The lecturer says the unit often treats free capital-letter variables as if they are universally quantified.

So the informal reading is:

`forall X. well_behaved(X) -> owner(X, peter)`

**Step 3 — Safe exam phrasing.**

Say:

“Formally, `X` is free. In the convention used later in the unit, this is often treated as implicitly universally quantified.”

**Answer:** formal FOL says `X` is free; the course’s later logic-programming convention reads it as `forall X`.

---

### Solution 26. Universal implication with no matching objects

Domain:

`Delta = {a, b}`

Facts:

- `student(a) = false`
- `student(b) = false`
- `registered(a) = false`
- `registered(b) = true`

#### 1. `forall X. student(X) -> registered(X)`

**Step 1 — Universal method.**

Check each object.

**Step 2 — Check `a`.**

`student(a)` is false.

An implication with a false antecedent is true.

So `student(a) -> registered(a)` is true.

**Step 3 — Check `b`.**

`student(b)` is false.

So `student(b) -> registered(b)` is also true.

**Answer:** the universal formula is true.

#### 2. `exists X. student(X) and registered(X)`

**Step 1 — Existential method.**

Find at least one object that is both a student and registered.

**Step 2 — Check both objects.**

- `a` is not a student.
- `b` is not a student.

No object satisfies the conjunction.

**Answer:** the existential formula is false.

**Why they differ:** a universal implication can be vacuously true when no object satisfies the antecedent. An existential conjunction needs an actual witness.

---

### Solution 27. Logic-based agent conflict: both do and not-do

Action set:

`A = [a1, a2]`

The knowledge base proves:

- `Delta |- do(a1)`
- `Delta |- not do(a1)`

**Step 1 — Apply the algorithm literally.**

The first loop checks whether `Delta |- do(a)`.

**Step 2 — Check `a1`.**

`Delta |- do(a1)` is true.

**Step 3 — Return immediately.**

The algorithm returns `a1`.

**Step 4 — Identify the problem.**

The KB is inconsistent or has conflicting rules. The algorithm as presented does not first check consistency or resolve conflicts. It just returns the first positively derivable action.

**Answer:** it returns `a1`, revealing that badly designed rules can make the agent choose an action even when the same KB also says not to do it.

---

### Solution 28. Action-order bias

Action set:

`A = [a1, a2, a3]`

`Delta` proves:

- `do(a2)`
- `do(a3)`

**Step 1 — First loop.**

Check actions in order.

- `a1`: no proof of `do(a1)`, skip.
- `a2`: proof of `do(a2)`, return immediately.

**Step 2 — Note what is ignored.**

The algorithm never reaches `a3`, even if `a3` would be better in the real world.

**Answer:** it returns `a2`.

**Limitation:** unless the programmer encodes priorities carefully, the algorithm may choose the first provable action rather than the genuinely best action.

---

### Solution 29. Stale reasoning problem

**Step 1 — Recall the logic-based agent loop.**

The loop is:

`perception -> reasoning -> action -> perception`

**Step 2 — Identify the timing problem.**

The robot perceived `clear(path1)` before reasoning began.

While theorem proving was happening, the environment changed: another robot blocked the path.

**Step 3 — Explain the failure.**

The chosen action is based on an outdated belief state.

**Step 4 — Connect to the lecture critique.**

The lecture warns that theorem proving can be slow. While the agent reasons, the world may change, so the action may no longer be appropriate by the time it is executed.

**Answer:** this is the stale-reasoning problem: the agent acts on a conclusion derived from an old perception, because it does not continuously re-perceive while reasoning.

---

### Solution 30. BDI workflow disagreement: textbook vs lecturer

Claim:

“In a BDI agent, beliefs are just atomic facts after belief revision.”

**Step 1 — Identify the textbook-style answer.**

In the textbook workflow shown in the sheet, belief revision simplifies the current world state into beliefs that are basically atomic facts.

So the claim is true for the simplified textbook picture.

**Step 2 — Identify the lecturer’s practical qualification.**

The lecturer says real BDI languages often allow beliefs to contain rules as well as facts.

Also, practical systems may use “simple belief revision” rather than full forward chaining.

**Step 3 — Give the safe answer.**

Say:

“The textbook workflow presents beliefs as atomic facts after belief revision, but the lecturer warns this is oversimplified: practical BDI systems may keep rules in the belief base and may use simple add/remove belief revision rather than deriving all consequences.”

**Answer:** true in the simplified textbook model; too simple for the lecturer’s practical BDI view.

---

### Solution 31. Intention as whole plan vs top-step execution

Intention:

`deliver_package`

Plan:

`[drive_to_customer, hand_over_package]`

New sensor input during execution:

`customer_not_home`

#### Style 1 — Execute whole sequence without reconsideration

**Step 1 — Start executing the plan.**

The agent begins `drive_to_customer`.

**Step 2 — Continue the plan mechanically.**

If the system does not reconsider, it may still attempt `hand_over_package`.

**Step 3 — Problem.**

The plan is no longer appropriate because the customer is not home.

#### Style 2 — Execute top step, then loop back

**Step 1 — Execute only the first/top step.**

The agent begins or completes `drive_to_customer`.

**Step 2 — Sense again.**

Sensor input says `customer_not_home`.

**Step 3 — Revise beliefs.**

Add `customer_not_home`; remove any contradicted belief such as `customer_home`.

**Step 4 — Reconsider intention.**

The agent may drop, suspend, or revise the delivery intention.

**Step 5 — Select a better next action.**

Possible next action: reschedule delivery, contact customer, or return to depot.

**Answer:** the second style is more reactive and flexible, matching the lecturer’s point that executing a top step then looping back allows intentions to be dropped or revised.

---

### Solution 32. Design-time organisation vs runtime organisation

**Step 1 — Closed fixed-agent system.**

If agents and roles are fixed before deployment, designers can use the organisation as a design-time tool. They can simply program each agent for its role.

There may be no need for runtime software representing the organisation.

**Step 2 — Dynamic unknown-agent system.**

If unknown agents can join later, the system must communicate:

- roles,
- goals,
- obligations,
- capabilities,
- protocols.

Agents must understand and reason about this information at runtime.

**Step 3 — Choose which needs runtime representation.**

The dynamic system needs runtime organisation more.

**Answer:** the second system most needs runtime organisational representation, because agents entering later must be told what roles mean and how to act within them.

---

### Solution 33. Role goal vs personal goal

Scenario:

- Role: `courier`
- Role goal: `deliver_parcel`
- Private agent goal: `minimise_energy_use`

**Step 1 — Identify the role goal.**

`deliver_parcel` belongs to the courier role because it contributes to the organisation’s overall goal.

**Step 2 — Identify the personal/other goal.**

`minimise_energy_use` belongs to the agent independently of the courier role.

**Step 3 — Explain why the distinction matters.**

The organisation can impose role goals, obligations, capabilities, and delegation rules. But the agent may also have other goals that affect its behaviour.

**Step 4 — State the possible conflict.**

If minimising energy conflicts with fast delivery, the agent must reason about the conflict between role obligations and its own goals.

**Answer:** `deliver_parcel` is the role goal; `minimise_energy_use` is an additional agent goal. The distinction matters because organisations coordinate behaviour through roles, but agents may have goals outside the organisation.

---

### Solution 34. External fact vs institutional fact

External event:

`submit(vicki, day3)`

Deadline:

day 2

**Step 1 — Identify the external trace.**

The external trace records concrete events, such as Vicki submitting on day 3.

**Step 2 — Identify the norm.**

The relevant norm is something like:

`O(vicki, submit_by(day2))`

**Step 3 — Monitor the deadline.**

The institution checks whether submission happened by day 2.

It did not.

**Step 4 — Generate institutional fact.**

The institution creates a fact such as:

`late_submission(vicki)`

or:

`viol(vicki, submit_by(day2))`

**Answer:** `late_submission(vicki)` is not simply observed in the external world. It is generated by the institution from the external trace plus the deadline norm.

---

### Solution 35. Permission is not obligation

Institution records:

`P enter_lab(alex)`

Question: does this imply `O enter_lab(alex)`?

**Step 1 — Use the deontic definition.**

The sheet gives:

`P A ≡ not O not A`

So permission to do `A` means there is no obligation not to do `A`.

**Step 2 — Compare permission and obligation.**

`P A` says Alex may enter the lab.

`O A` would say Alex must enter the lab.

These are different.

**Step 3 — Use the axiom direction.**

The sheet gives:

`O A -> P A`

If something is obligatory, it is permitted.

But the reverse is not given:

`P A -> O A` is not valid from the sheet.

**Answer:** no. `P enter_lab(alex)` does not imply `O enter_lab(alex)`.

---

### Solution 36. Prohibition as obligation not to act

Norm:

“Agents must not access restricted data.”

**Step 1 — Represent the forbidden action.**

Let:

`A = access_restricted_data(agent)`

**Step 2 — Represent prohibition as obligation not to act.**

The sheet says prohibitions can be treated as obligations not to do something:

`O not A`

So:

`O not access_restricted_data(agent)`

**Step 3 — Monitor the external trace.**

If the event occurs:

`access_restricted_data(agent)`

then the agent has done the thing it was obliged not to do.

**Step 4 — Generate violation.**

Institutional fact:

`viol(agent, not access_restricted_data(agent))`

or more naturally:

`restricted_access_violation(agent)`

**Answer:** represent it as an obligation not to access the data; if access occurs, generate a violation and possibly a sanction.

---

### Solution 37. Consequence function update

Current institutional state:

`s'_i = {O(sam, return(book1, d7))}`

Institutional event:

`viol(sam, return(book1, d7))`

Rule:

When this violation occurs, add `late_return(sam)`.

**Step 1 — Recall consequence function role.**

The consequence function maps:

`S_inst x E_inst -> S_inst`

That is:

`c(s'_i, e'_i) = s'_{i+1}`

**Step 2 — Apply the event to the current state.**

Start with:

`{O(sam, return(book1, d7))}`

Add:

`late_return(sam)`

**Step 3 — Compute next institutional state.**

`s'_{i+1} = {O(sam, return(book1, d7)), late_return(sam)}`

**Answer:** `s'_{i+1}` contains the original obligation plus the new late-return fact, unless the formalism specifies deletion of the old obligation.

---

### Solution 38. Continue the coursework trace under an explicit marking rule

Rule added:

When a student submits, the marker becomes obliged to mark within 20 days. If marking has not happened by the deadline, record `late_marking(student)`.

Events:

- Vicki submits on day 3.
- Barbara marks Vicki on day 30.
- Marking deadline for Vicki: day 23.

**Step 1 — Submission creates marking obligation.**

When Vicki submits on day 3, the institution creates:

`O(barbara, mark(vicki, day23))`

**Step 2 — Monitor the deadline.**

At day 23, check whether `mark(vicki)` has occurred.

It has not, because Barbara marks on day 30.

**Step 3 — Generate violation.**

The institution creates:

`viol(barbara, mark(vicki, day23))`

or an institutional fact:

`late_marking(vicki)`

**Step 4 — Process the later marking event.**

On day 30, external event:

`mark(barbara, vicki)`

This may add:

`marked(vicki)`

But it does not erase that the day-23 marking deadline was missed.

**Answer:** the institutional violation is late marking for Vicki: `late_marking(vicki)` or `viol(barbara, mark(vicki, day23))`.

---

# Compact revision checklist

Before the exam, make sure you can do these without notes:

1. Classify FOL expressions as terms, simple formulae, complex formulae, or quantified formulae.
2. Identify free and bound variables.
3. Evaluate atomic, universal, and existential formulae in a small model.
4. Explain model shorthand where listed formulae are true and other relevant simple formulae are false.
5. Identify a minimal model domain from constants in a KB.
6. Decide whether a system is an agent and whether it is proactive, reactive, and/or socially able.
7. Run the logic-based action-choice algorithm exactly in order.
8. Instantiate a rule using unification and current facts.
9. Explain the burden-on-programmer and slow-theorem-proving critiques.
10. Trace the BDI cycle and explain textbook vs lecturer differences.
11. Identify organisation goals, roles, capabilities, obligations, and delegation.
12. Distinguish design-time and runtime organisations.
13. Classify norms as obligations, permissions, or prohibitions.
14. Use `P A ≡ not O not A` and avoid treating permission as obligation.
15. Build an external trace and derive institutional events/states from it.
16. Explain why violations and sanctions are institutional facts, not just external facts.
