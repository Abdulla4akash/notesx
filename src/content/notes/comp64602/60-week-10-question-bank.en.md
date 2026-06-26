---
subject: COMP64602
chapter: 60
title: "Week 10 — Question Bank"
language: en
---

# COMP64602 Week 10 — Gwendolen Worked Question Bank

Source used: uploaded lecture sheet, **COMP64602 Chapter 10 - Week 10**, covering Gwendolen/BDI programming, events, intentions, plan guards, reasoning rules, list recursion, goals in guards, waiting, and locking.

## Examinable task types identified from the sheet

The sheet is not mainly numerical. The examinable “computational” work is trace-and-diagnose work. The task types it actually teaches are:

1. Parse a Gwendolen plan into trigger, guard, and deeds.
2. Classify deeds as belief updates, goal updates, actions, waits, locks, or unlocks.
3. Decide whether a plan is triggered by an event, not merely by a true condition.
4. Check whether a guard is satisfied against a belief base and goal set.
5. Distinguish achieve goals from perform goals during execution.
6. Construct or update intention-stack rows of the form `(trigger event, deed, unifier)`.
7. Explain the special deeds `no plan yet` / `npy` and `null`.
8. Trace how perception creates separate intentions before beliefs are actually added.
9. Trace the simple pickup example.
10. Trace the rubble-search example, including the extra `move_to(5, 5)`.
11. Rewrite guard logic using reasoning rules.
12. Derive predicates from reasoning rules, including negative belief conditions.
13. Use Prolog-style list matching `[Head | Tail]`.
14. Trace recursive reasoning rules over a list.
15. Use goals in guards, especially `G holding(rubble) [achieve]`.
16. Add waiting deeds such as `*checked(X, Y)` and trace their effect.
17. Diagnose why waiting fixes premature progress but does not freeze the whole agent.
18. Diagnose mode-switch bugs caused by interleaving intentions.
19. Add locking with `+.lock` and `-.lock` to make a short internal update atomic.
20. Choose between waiting and locking, including the “do not put long actions in locks” warning.

---

# Section A — Mechanical / single-step drills

These are quick recognition tasks. Do them fast, but always write the step headers before answering.

---

## Q1. Parse a plan into trigger, guard, and deeds

Given the plan:

```gwendolen
+!pickup [achieve] : {B empty} <-
    +pickup,
    -empty,
    print(done);
```

Identify:

1. the trigger;
2. the guard;
3. each deed, in order;
4. which deeds are belief updates and which are actions.

### Worked solution

**Step 1 — Locate the trigger.**  
The trigger is the part before the colon:

```gwendolen
+!pickup [achieve]
```

This means: the goal `pickup [achieve]` has appeared.

**Step 2 — Locate the guard.**  
The guard is the condition inside curly braces:

```gwendolen
{B empty}
```

This means: the plan applies only if the agent believes `empty`.

**Step 3 — List the deeds.**  
The deeds are the right-hand side after `<-`, in order:

```gwendolen
+pickup
-empty
print(done)
```

**Step 4 — Classify the deeds.**

| Deed | Type | Meaning |
|---|---|---|
| `+pickup` | belief addition | add belief `pickup` |
| `-empty` | belief removal | remove belief `empty` |
| `print(done)` | action | ask the environment/low-level system to print `done` |

**Answer.**  
Trigger: `+!pickup [achieve]`.  
Guard: `{B empty}`.  
Deeds: `+pickup`, `-empty`, `print(done)`.  
The first two are belief updates; `print(done)` is an action.

---

## Q2. Decode event notation

Classify each item as a belief event, goal event, belief-removal event, or goal-removal event:

```gwendolen
+at(X, Y)
-rubble(X, Y)
+!holding(rubble) [achieve]
-!cleanup [perform]
```

### Worked solution

**Step 1 — Check whether the item contains `!`.**  
If it contains `!`, it is about a goal. If it does not contain `!`, it is about a belief.

**Step 2 — Check whether the item begins with `+` or `-`.**  
`+` means something appeared or was added.  
`-` means something disappeared or was removed.

**Step 3 — Classify each event.**

| Event | Classification | Meaning |
|---|---|---|
| `+at(X, Y)` | belief-addition event | belief `at(X, Y)` appeared |
| `-rubble(X, Y)` | belief-removal event | belief `rubble(X, Y)` disappeared |
| `+!holding(rubble) [achieve]` | goal-addition event | achieve goal `holding(rubble)` appeared |
| `-!cleanup [perform]` | goal-removal event | perform goal `cleanup` was removed |

**Answer.**  
The discriminator is: `!` means goal; no `!` means belief. `+` means appeared/added; `-` means disappeared/removed.

---

## Q3. Decide whether a guard is satisfied

Belief base:

```gwendolen
empty
on_ground(block)
battery_ok
```

Goal set:

```gwendolen
holding(block) [achieve]
```

For each guard, decide whether it holds:

```gwendolen
{B empty}
{~B empty}
{B on_ground(block), B battery_ok}
{B on_ground(block), ~B broken(gripper)}
{G holding(block) [achieve]}
{G holding(box) [achieve]}
```

### Worked solution

**Step 1 — Mark known beliefs.**  
The agent believes:

```gwendolen
empty
on_ground(block)
battery_ok
```

It does not believe `broken(gripper)` because that belief is absent.

**Step 2 — Mark current goals.**  
The agent currently has the goal:

```gwendolen
holding(block) [achieve]
```

It does not have the goal `holding(box) [achieve]`.

**Step 3 — Evaluate each guard atom.**

| Guard | Holds? | Reason |
|---|---:|---|
| `{B empty}` | yes | `empty` is in the belief base |
| `{~B empty}` | no | the agent does believe `empty` |
| `{B on_ground(block), B battery_ok}` | yes | both beliefs are present |
| `{B on_ground(block), ~B broken(gripper)}` | yes | `on_ground(block)` is present and `broken(gripper)` is absent |
| `{G holding(block) [achieve]}` | yes | that goal is in the goal set |
| `{G holding(box) [achieve]}` | no | that goal is not in the goal set |

**Answer.**  
A positive belief guard requires the belief to be present. A negative belief guard `~B p` requires the belief `p` to be absent. A goal guard `G g [type]` requires that goal to be currently active.

---

## Q4. Distinguish actions from belief/goal updates

Classify the deeds below:

```gwendolen
move_to(X, Y)
+visited(X, Y)
-available(X, Y)
+!inspect(X, Y) [perform]
-!holding(rubble) [achieve]
*checked(X, Y)
+.lock
-.lock
```

### Worked solution

**Step 1 — Look for belief/goal markers.**  
A deed with `+` or `-` and no `!` is a belief update.  
A deed with `+!` or `-!` is a goal update.

**Step 2 — Look for special control markers.**  
A deed beginning with `*` is a wait.  
`+.lock` starts a lock.  
`-.lock` releases a lock.

**Step 3 — Anything undecorated is an action.**  
A deed such as `move_to(X, Y)` has no `+`, `-`, `!`, `*`, or lock marker, so it is an action.

| Deed | Type |
|---|---|
| `move_to(X, Y)` | action |
| `+visited(X, Y)` | belief addition |
| `-available(X, Y)` | belief removal |
| `+!inspect(X, Y) [perform]` | perform-goal addition |
| `-!holding(rubble) [achieve]` | achieve-goal removal |
| `*checked(X, Y)` | wait deed |
| `+.lock` | lock deed |
| `-.lock` | unlock deed |

**Answer.**  
The main discriminator is decoration: undecorated terms are actions; `+/-` are belief updates; `+!/-!` are goal updates; `*` is waiting; `.lock` controls interleaving.

---

## Q5. Event trigger or state condition?

A plan is:

```gwendolen
+obstacle : {T} <- turn_90, forward;
```

The robot perceives an obstacle, turns, and moves forward. While moving, the belief `obstacle` remains true the whole time. Does the plan trigger again just because `obstacle` is still true?

### Worked solution

**Step 1 — Identify the trigger.**  
The trigger is:

```gwendolen
+obstacle
```

This means the plan fires when the belief `obstacle` appears.

**Step 2 — Separate event from condition.**  
The event is not “`obstacle` is true”. The event is “`obstacle` has just been added”.

**Step 3 — Check whether a new event occurs.**  
If the belief `obstacle` remains true, then it has not disappeared and reappeared. So there is no new `+obstacle` event.

**Answer.**  
No. The plan does not trigger again merely because `obstacle` remains true. It would trigger again only if a new `+obstacle` event occurred, for example if `obstacle` disappeared and later appeared again.

---

## Q6. Achieve or perform?

For each goal, say whether Gwendolen should treat it as “do the procedure and drop it” or “keep trying until the corresponding belief is true”:

```gwendolen
scan(Room) [perform]
holding(rubble) [achieve]
goto(Room) [perform]
clean [achieve]
```

### Worked solution

**Step 1 — Read the goal type marker.**  
`[perform]` means perform goal.  
`[achieve]` means achieve goal.

**Step 2 — Apply the execution rule.**  
Perform goal: find a plan, execute it, then drop it.  
Achieve goal: check whether the corresponding belief is true; if not, plan and execute; then check again.

| Goal | Type | Execution behaviour |
|---|---|---|
| `scan(Room) [perform]` | perform | do the scan procedure and drop the goal |
| `holding(rubble) [achieve]` | achieve | keep trying until belief `holding(rubble)` is present |
| `goto(Room) [perform]` | perform | do the goto procedure and drop the goal |
| `clean [achieve]` | achieve | keep trying until belief `clean` is present |

**Answer.**  
Perform goals behave like subroutine calls. Achieve goals behave like persistent objectives checked against the belief base.

---

## Q7. What does `no plan yet` mean?

An intention stack contains this top row:

| Trigger | Deed | Unifier |
|---|---|---|
| `+!deliver(parcel) [achieve]` | `no plan yet` | `{}` |

What should Gwendolen do next?

### Worked solution

**Step 1 — Inspect the top deed.**  
The top deed is:

```gwendolen
no plan yet
```

**Step 2 — Use the special-deed rule.**  
`no plan yet` means the event is on the stack, but Gwendolen has not yet selected a plan for handling it.

**Step 3 — Search for applicable plans.**  
Gwendolen should look for plans whose trigger matches:

```gwendolen
+!deliver(parcel) [achieve]
```

and whose guard is satisfied by the current belief base and goal set.

**Answer.**  
Gwendolen should search for applicable plans for the event `+!deliver(parcel) [achieve]`. If one applies, its deeds are pushed onto the intention stack with the relevant unifier.

---

## Q8. What does `null` mean for a perform goal?

A perform goal deed is:

```gwendolen
+!goto(Room) [perform]
```

It becomes a new event to be planned. What happens to the original deed in the old intention stack, and why?

### Worked solution

**Step 1 — Identify the goal type.**  
The goal is marked `[perform]`, so it is a perform goal.

**Step 2 — Apply the perform-goal stack rule.**  
When the perform goal becomes a new event, the original deed is replaced by:

```gwendolen
null
```

**Step 3 — Explain why.**  
A perform goal is not kept around for achievement checking. It is executed like a procedure and then dropped.

**Answer.**  
The original perform-goal deed becomes `null`. This is different from an achieve goal, which remains active so Gwendolen can later check whether the corresponding belief has actually been achieved.

---

# Section B — Multi-condition checks and local derivations

These questions combine triggers, guards, unifiers, goal sets, and reasoning rules.

---

## Q9. Which plan applies?

Belief base:

```gwendolen
empty
on_ground(block)
on_ground(box)
fragile(box)
```

Current event:

```gwendolen
+!holding(A) [achieve]
```

Plans:

```gwendolen
+!holding(X) [achieve] : {B empty, B on_ground(X)} <- pick_up(X);

+!holding(X) [achieve] : {B empty, B fragile(X)} <- careful_pick_up(X);

+!holding(X) [achieve] : {~B empty, B on_ground(X)} <- free_hands, pick_up(X);
```

List all applicable plan instances for the event and belief base.

### Worked solution

**Step 1 — Match the event against plan triggers.**  
The current event is:

```gwendolen
+!holding(A) [achieve]
```

All three plans have trigger pattern:

```gwendolen
+!holding(X) [achieve]
```

So all three trigger patterns can match the event, with `X` corresponding to `A`.

**Step 2 — Use the guards to find concrete bindings.**  
The belief base says:

```gwendolen
empty
on_ground(block)
on_ground(box)
fragile(box)
```

For the first plan, the guard is:

```gwendolen
{B empty, B on_ground(X)}
```

`B empty` holds. `B on_ground(X)` holds for `X = block` and `X = box`.  
So the first plan has two applicable instances:

```gwendolen
pick_up(block)
pick_up(box)
```

**Step 3 — Check the second plan.**  
The second guard is:

```gwendolen
{B empty, B fragile(X)}
```

`B empty` holds. `B fragile(X)` holds for `X = box`.  
So the second plan has one applicable instance:

```gwendolen
careful_pick_up(box)
```

**Step 4 — Check the third plan.**  
The third guard is:

```gwendolen
{~B empty, B on_ground(X)}
```

`~B empty` fails because the agent does believe `empty`.  
So the third plan is not applicable.

**Answer.**  
Applicable instances are:

```gwendolen
X = block  -> pick_up(block)
X = box    -> pick_up(box)
X = box    -> careful_pick_up(box)
```

The exact selected plan is not determined by this question; the task was only to list applicable instances.

---

## Q10. Trigger matches, guard fails

Belief base:

```gwendolen
at(room1)
door_closed(room2)
```

Current event:

```gwendolen
+!enter(room2) [achieve]
```

Plan:

```gwendolen
+!enter(R) [achieve] : {B at(R), ~B door_closed(R)} <- walk_in(R);
```

Does the plan apply?

### Worked solution

**Step 1 — Match the trigger.**  
The event is:

```gwendolen
+!enter(room2) [achieve]
```

The plan trigger is:

```gwendolen
+!enter(R) [achieve]
```

They match with:

```gwendolen
R = room2
```

**Step 2 — Substitute into the guard.**  
The guard becomes:

```gwendolen
{B at(room2), ~B door_closed(room2)}
```

**Step 3 — Check each guard condition.**  
The belief base contains `at(room1)`, not `at(room2)`. So `B at(room2)` fails.  
The belief base contains `door_closed(room2)`, so `~B door_closed(room2)` also fails.

**Answer.**  
No. The trigger matches, but the guard fails. A matching trigger is not enough; the guard must also hold in the current belief base.

---

## Q11. Derive a reasoning-rule predicate

Belief base:

```gwendolen
possible_rubble(1, 1)
possible_rubble(3, 3)
possible_rubble(5, 5)
no_rubble(1, 1)
```

Reasoning rule:

```gwendolen
square_to_check(X, Y) :-
    possible_rubble(X, Y),
    ~no_rubble(X, Y);
```

Which `square_to_check(X, Y)` facts can be derived?

### Worked solution

**Step 1 — Read the rule body.**  
The rule derives:

```gwendolen
square_to_check(X, Y)
```

when both of these hold:

```gwendolen
possible_rubble(X, Y)
~no_rubble(X, Y)
```

**Step 2 — List possible rubble locations.**

```gwendolen
(1, 1)
(3, 3)
(5, 5)
```

**Step 3 — Remove locations where `no_rubble` is believed.**  
The belief base contains:

```gwendolen
no_rubble(1, 1)
```

So `~no_rubble(1, 1)` is false.

**Step 4 — Keep the locations where `no_rubble` is absent.**  
There is no belief `no_rubble(3, 3)`.  
There is no belief `no_rubble(5, 5)`.

So the rule derives:

```gwendolen
square_to_check(3, 3)
square_to_check(5, 5)
```

**Answer.**  
The derivable facts are `square_to_check(3, 3)` and `square_to_check(5, 5)`.

---

## Q12. Replace a complex guard with a reasoning rule

Original plan:

```gwendolen
+!holding(rubble) [achieve] :
    {B possible_rubble(X, Y), ~B no_rubble(X, Y)} <-
        move_to(X, Y);
```

Rewrite it using a reasoning rule called `square_to_check(X, Y)`.

### Worked solution

**Step 1 — Identify the guard logic to factor out.**  
The complex guard condition is:

```gwendolen
B possible_rubble(X, Y), ~B no_rubble(X, Y)
```

The underlying predicate should mean: “`(X, Y)` is a possible rubble square and has not been ruled out.”

**Step 2 — Write the reasoning rule.**

```gwendolen
square_to_check(X, Y) :-
    possible_rubble(X, Y),
    ~no_rubble(X, Y);
```

**Step 3 — Replace the plan guard with the derived predicate.**

```gwendolen
+!holding(rubble) [achieve] :
    {B square_to_check(X, Y)} <-
        move_to(X, Y);
```

**Step 4 — Check behaviour.**  
The behaviour is the same: the plan still moves to a possible rubble square that has not been marked `no_rubble`.

**Answer.**

```gwendolen
:Reasoning Rules:

square_to_check(X, Y) :-
    possible_rubble(X, Y),
    ~no_rubble(X, Y);

:Plans:

+!holding(rubble) [achieve] :
    {B square_to_check(X, Y)} <-
        move_to(X, Y);
```

---

## Q13. Match a Prolog-style list pattern

Given the list:

```gwendolen
[sq(2, 4), sq(6, 8), sq(10, 12)]
```

Match it against:

```gwendolen
[sq(X, Y) | T]
```

What are `X`, `Y`, and `T`?

### Worked solution

**Step 1 — Identify the head.**  
The first element of the list is:

```gwendolen
sq(2, 4)
```

**Step 2 — Match the head against `sq(X, Y)`.**  
So:

```gwendolen
X = 2
Y = 4
```

**Step 3 — Identify the tail.**  
The tail is the rest of the list after the first element:

```gwendolen
[sq(6, 8), sq(10, 12)]
```

**Answer.**

```gwendolen
X = 2
Y = 4
T = [sq(6, 8), sq(10, 12)]
```

---

## Q14. Recursive list rule: first unchecked square

Belief base:

```gwendolen
possible_rubble([sq(1, 1), sq(3, 3), sq(5, 5)])
no_rubble(1, 1)
```

Reasoning rules:

```gwendolen
square_to_check(X, Y) :-
    possible_rubble(L),
    check_rubble(L, X, Y);

check_rubble([sq(X, Y) | T], X, Y) :-
    ~no_rubble(X, Y);

check_rubble([sq(X, Y) | T], X1, Y1) :-
    no_rubble(X, Y),
    check_rubble(T, X1, Y1);
```

Which square is selected by `square_to_check(X, Y)`?

### Worked solution

**Step 1 — Start with the top-level rule.**  
To derive:

```gwendolen
square_to_check(X, Y)
```

we need:

```gwendolen
possible_rubble(L)
check_rubble(L, X, Y)
```

The list is:

```gwendolen
L = [sq(1, 1), sq(3, 3), sq(5, 5)]
```

**Step 2 — Try the base case on the head of the list.**  
The head is:

```gwendolen
sq(1, 1)
```

The base case requires:

```gwendolen
~no_rubble(1, 1)
```

But the belief base contains:

```gwendolen
no_rubble(1, 1)
```

So the base case fails for `(1, 1)`.

**Step 3 — Apply the recursive case.**  
The recursive rule applies because `no_rubble(1, 1)` is believed. It recurses on the tail:

```gwendolen
[sq(3, 3), sq(5, 5)]
```

**Step 4 — Try the base case on the new head.**  
The new head is:

```gwendolen
sq(3, 3)
```

The base case requires:

```gwendolen
~no_rubble(3, 3)
```

There is no belief `no_rubble(3, 3)`, so this succeeds.

**Answer.**  
The selected square is:

```gwendolen
square_to_check(3, 3)
```

---

## Q15. Goal in guard

Belief base:

```gwendolen
at(5, 5)
rubble(5, 5)
```

Current goals:

```gwendolen
rubble(2, 2) [achieve]
holding(rubble) [achieve]
```

Event:

```gwendolen
+rubble(5, 5)
```

Plan:

```gwendolen
+rubble(X, Y) :
    {B at(X, Y), G holding(rubble) [achieve]} <-
        lift_rubble;
```

Does the plan apply?

### Worked solution

**Step 1 — Match the trigger.**  
The event is:

```gwendolen
+rubble(5, 5)
```

The plan trigger is:

```gwendolen
+rubble(X, Y)
```

So:

```gwendolen
X = 5
Y = 5
```

**Step 2 — Substitute into the guard.**  
The guard becomes:

```gwendolen
{B at(5, 5), G holding(rubble) [achieve]}
```

**Step 3 — Check the belief condition.**  
The belief base contains:

```gwendolen
at(5, 5)
```

So `B at(5, 5)` holds.

**Step 4 — Check the goal condition.**  
The goal set contains:

```gwendolen
holding(rubble) [achieve]
```

So `G holding(rubble) [achieve]` holds.

**Answer.**  
Yes. The trigger matches and both guard conditions hold, so the agent may execute:

```gwendolen
lift_rubble
```

---

## Q16. Goal guard blocks irrelevant action

Use the same plan:

```gwendolen
+rubble(X, Y) :
    {B at(X, Y), G holding(rubble) [achieve]} <-
        lift_rubble;
```

Belief base:

```gwendolen
at(5, 5)
rubble(5, 5)
```

Current goals:

```gwendolen
photograph(rubble) [achieve]
```

Event:

```gwendolen
+rubble(5, 5)
```

Does the plan apply?

### Worked solution

**Step 1 — Match the trigger.**  
The trigger matches with:

```gwendolen
X = 5
Y = 5
```

**Step 2 — Substitute into the guard.**

```gwendolen
{B at(5, 5), G holding(rubble) [achieve]}
```

**Step 3 — Check the belief part.**  
`B at(5, 5)` holds because `at(5, 5)` is in the belief base.

**Step 4 — Check the goal part.**  
The current goal is:

```gwendolen
photograph(rubble) [achieve]
```

The agent does not have:

```gwendolen
holding(rubble) [achieve]
```

So the goal guard fails.

**Answer.**  
No. The plan does not apply. The point of the goal guard is to prevent the robot from lifting rubble merely because it sees rubble; it should lift only when the active goal is to hold the rubble.

---

# Section C — Building and tracing from scratch

These questions are longer. They model the step-by-step written trace style you want in the exam.

---

## Q17. Trace the simple pickup example

Program:

```gwendolen
GWENDOLEN

:name: ag1

:Initial Beliefs:
empty

:Initial Goals:
pickup [achieve]

:Plans:
+!pickup [achieve] : {B empty} <-
    +pickup,
    -empty,
    print(done);
```

Trace the execution until the output is produced.

### Worked solution

**Step 1 — Write the initial belief base.**

```gwendolen
empty
```

**Step 2 — Write the initial goal.**

```gwendolen
pickup [achieve]
```

Because this is an initial goal, Gwendolen creates a start intention that introduces the goal.

**Step 3 — Check whether the achieve goal is already satisfied.**  
The goal is:

```gwendolen
pickup [achieve]
```

For an achieve goal, Gwendolen checks whether the corresponding belief exists:

```gwendolen
pickup
```

The belief base contains only `empty`, so the goal is not yet achieved.

**Step 4 — Create the goal event and find a plan.**  
The relevant event is:

```gwendolen
+!pickup [achieve]
```

The plan trigger matches. The guard is:

```gwendolen
{B empty}
```

This holds because `empty` is in the belief base.

**Step 5 — Execute the plan deeds in order.**

First deed:

```gwendolen
+pickup
```

Belief base becomes:

```gwendolen
empty
pickup
```

Second deed:

```gwendolen
-empty
```

Belief base becomes:

```gwendolen
pickup
```

Third deed:

```gwendolen
print(done)
```

This is an action, so the program prints:

```gwendolen
done
```

**Answer.**  
The trace is: initial goal `pickup [achieve]`; plan applies because `B empty`; add `pickup`; remove `empty`; execute `print(done)`. Final belief base contains `pickup`, and the output is `done`.

---

## Q18. Build the intention stack after adding an achieve goal

Initial goal:

```gwendolen
clean [achieve]
```

Assume the agent does not believe `clean`. What does the intention stack look like immediately after the achieve goal has been added as an event but before a plan is selected?

### Worked solution

**Step 1 — Start from the initial goal intention.**  
Initial goals are introduced by the special start event:

| Trigger | Deed | Unifier |
|---|---|---|
| `+start` | `+!clean [achieve]` | `{}` |

**Step 2 — Apply the achieve-goal rule.**  
For an achieve goal, Gwendolen checks whether the corresponding belief already exists:

```gwendolen
clean
```

The question says the agent does not believe `clean`, so the goal is not already achieved.

**Step 3 — Add the new goal event.**  
Adding the goal creates a new event:

```gwendolen
+!clean [achieve]
```

At first, no plan has been selected for that event, so the deed is:

```gwendolen
no plan yet
```

**Answer.**  
The stack is:

| Trigger | Deed | Unifier |
|---|---|---|
| `+!clean [achieve]` | `no plan yet` | `{}` |
| `+start` | `+!clean [achieve]` | `{}` |

The top row now tells Gwendolen to search for an applicable plan for `+!clean [achieve]`.

---

## Q19. Apply the `clean` plan and record the unifier

Program fragment:

```gwendolen
+!clean [achieve] : {B dirty(Room)} <-
    +!goto(Room) [perform],
    +!vacuum(Room) [perform];
```

Belief base:

```gwendolen
dirty(room1)
```

Current intention top row:

| Trigger | Deed | Unifier |
|---|---|---|
| `+!clean [achieve]` | `no plan yet` | `{}` |

Apply the plan. What deeds are pushed, and what is the unifier?

### Worked solution

**Step 1 — Match the trigger.**  
The event is:

```gwendolen
+!clean [achieve]
```

The plan trigger is also:

```gwendolen
+!clean [achieve]
```

So the trigger matches.

**Step 2 — Evaluate the guard.**  
The guard is:

```gwendolen
{B dirty(Room)}
```

The belief base contains:

```gwendolen
dirty(room1)
```

So the guard holds with:

```gwendolen
Room = room1
```

**Step 3 — Push the plan deeds with the unifier.**  
The deeds are:

```gwendolen
+!goto(Room) [perform]
+!vacuum(Room) [perform]
```

Both carry the unifier:

```gwendolen
{Room = room1}
```

**Answer.**  
The updated stack begins:

| Trigger | Deed | Unifier |
|---|---|---|
| `+!clean [achieve]` | `+!goto(Room) [perform]` | `{Room = room1}` |
| `+!clean [achieve]` | `+!vacuum(Room) [perform]` | `{Room = room1}` |

The unifier is `{Room = room1}`.

---

## Q20. Trace a perform goal becoming `null`

Continuing the previous question, the top deed is:

```gwendolen
+!goto(Room) [perform]
```

with unifier:

```gwendolen
{Room = room1}
```

Show what happens when this perform goal becomes its own event.

### Worked solution

**Step 1 — Identify the top deed.**  
The top deed is a perform-goal addition:

```gwendolen
+!goto(Room) [perform]
```

With the unifier, this means:

```gwendolen
+!goto(room1) [perform]
```

**Step 2 — Create a new event for the perform goal.**  
The new top event is:

```gwendolen
+!goto(Room) [perform]
```

and because no plan has been selected yet, its deed is:

```gwendolen
no plan yet
```

**Step 3 — Replace the original perform-goal deed with `null`.**  
Because this is a perform goal, the original deed is not kept around for achievement checking. It becomes:

```gwendolen
null
```

**Answer.**  
The stack becomes:

| Trigger | Deed | Unifier |
|---|---|---|
| `+!goto(Room) [perform]` | `no plan yet` | `{Room = room1}` |
| `+!clean [achieve]` | `null` | `{Room = room1}` |
| `+!clean [achieve]` | `+!vacuum(Room) [perform]` | `{Room = room1}` |

The important point is that perform goals are planned and executed, but not later rechecked against a belief.

---

## Q21. Trace the baseline rubble program up to the first `no_rubble`

Running example program fragment:

```gwendolen
:Initial Beliefs:
possible_rubble(1, 1)
possible_rubble(3, 3)
possible_rubble(5, 5)

:Initial Goals:
holding(rubble) [achieve]

:Plans:
+!holding(rubble) [achieve] :
    {B possible_rubble(X, Y), ~B no_rubble(X, Y)} <-
        move_to(X, Y);

+at(X, Y) :
    {~B rubble(X, Y)} <-
        +no_rubble(X, Y);
```

Environment fact: there is no rubble at `(1, 1)`. Trace from the initial goal through adding `no_rubble(1, 1)`.

### Worked solution

**Step 1 — Start with the initial achieve goal.**  
The initial goal is:

```gwendolen
holding(rubble) [achieve]
```

The corresponding belief `holding(rubble)` is not in the belief base, so the achieve goal is not satisfied.

**Step 2 — Select the achievement plan.**  
The event is:

```gwendolen
+!holding(rubble) [achieve]
```

The guard is:

```gwendolen
{B possible_rubble(X, Y), ~B no_rubble(X, Y)}
```

Initially, the agent believes:

```gwendolen
possible_rubble(1, 1)
possible_rubble(3, 3)
possible_rubble(5, 5)
```

and has no `no_rubble` beliefs. One applicable binding is:

```gwendolen
X = 1
Y = 1
```

**Step 3 — Execute the movement deed.**  
The selected deed is:

```gwendolen
move_to(1, 1)
```

The action executes.

**Step 4 — Account for perception lag.**  
After moving, the environment produces perception that the robot is at `(1, 1)`. This does not instantly become a belief. It creates a new intention to add:

```gwendolen
at(1, 1)
```

**Step 5 — Process the `+at(1, 1)` event.**  
When `at(1, 1)` is added, the event is:

```gwendolen
+at(1, 1)
```

The plan trigger:

```gwendolen
+at(X, Y)
```

matches with:

```gwendolen
X = 1
Y = 1
```

The guard is:

```gwendolen
{~B rubble(1, 1)}
```

The agent does not believe `rubble(1, 1)`, so the guard holds.

**Step 6 — Execute the belief update.**  
The plan adds:

```gwendolen
+no_rubble(1, 1)
```

**Answer.**  
The trace is: add achieve goal `holding(rubble)`; choose `(1, 1)` because it is possible and not ruled out; execute `move_to(1, 1)`; perception creates an intention to add `at(1, 1)`; the `+at(1, 1)` plan applies because the agent does not believe `rubble(1, 1)`; add `no_rubble(1, 1)`.

---

## Q22. Continue the rubble trace: why move to `(3, 3)` next?

After Q21, suppose the belief base includes:

```gwendolen
possible_rubble(1, 1)
possible_rubble(3, 3)
possible_rubble(5, 5)
at(1, 1)
no_rubble(1, 1)
```

The goal `holding(rubble) [achieve]` is still active and not yet achieved. Which location can the achievement plan choose next, and why?

### Worked solution

**Step 1 — Check whether the achieve goal is satisfied.**  
The goal is:

```gwendolen
holding(rubble) [achieve]
```

The corresponding belief would be:

```gwendolen
holding(rubble)
```

That belief is absent, so the goal is still unsatisfied.

**Step 2 — Re-evaluate the achievement plan guard.**  
The plan guard is:

```gwendolen
{B possible_rubble(X, Y), ~B no_rubble(X, Y)}
```

**Step 3 — Test `(1, 1)`.**  
`possible_rubble(1, 1)` is believed, but `no_rubble(1, 1)` is also believed.  
So `~B no_rubble(1, 1)` fails.

**Step 4 — Test `(3, 3)`.**  
`possible_rubble(3, 3)` is believed.  
There is no belief `no_rubble(3, 3)`.  
So the guard holds for:

```gwendolen
X = 3
Y = 3
```

**Answer.**  
The next chosen location can be `(3, 3)`. `(1, 1)` has been ruled out by `no_rubble(1, 1)`, while `(3, 3)` is still possible and not yet ruled out.

---

## Q23. Full baseline rubble trace: explain the extra move

The baseline rubble program’s intended environment is:

```text
No rubble at (1, 1)
No rubble at (3, 3)
Rubble at (5, 5)
```

The expected intuitive action sequence is:

```gwendolen
move_to(1, 1)
move_to(3, 3)
move_to(5, 5)
lift_rubble
print(done)
```

But the actual lecture trace includes:

```gwendolen
move_to(1, 1)
move_to(3, 3)
move_to(5, 5)
lift_rubble
move_to(5, 5)
print(done)
```

Explain why the extra `move_to(5, 5)` happens.

### Worked solution

**Step 1 — State the relevant achieve-goal rule.**  
The initial goal is:

```gwendolen
holding(rubble) [achieve]
```

An achieve goal remains active until the agent believes:

```gwendolen
holding(rubble)
```

**Step 2 — State the movement plan.**

```gwendolen
+!holding(rubble) [achieve] :
    {B possible_rubble(X, Y), ~B no_rubble(X, Y)} <-
        move_to(X, Y);
```

This plan keeps applying whenever the achievement goal is reconsidered and the agent still lacks `holding(rubble)`.

**Step 3 — Trace the search.**  
The agent checks `(1, 1)` and adds `no_rubble(1, 1)`.  
Then it checks `(3, 3)` and adds `no_rubble(3, 3)`.  
Then it moves to `(5, 5)` and perceives rubble there.

**Step 4 — Trace lifting.**  
The event:

```gwendolen
+rubble(5, 5)
```

triggers:

```gwendolen
+rubble(X, Y) : {B at(X, Y)} <- lift_rubble;
```

because the agent believes:

```gwendolen
at(5, 5)
```

So it executes:

```gwendolen
lift_rubble
```

**Step 5 — Apply the perception-lag rule.**  
After `lift_rubble`, the environment produces a perception that the robot is holding rubble. But perception is not instantly added to the belief base. It creates a separate intention to add:

```gwendolen
holding(rubble)
```

**Step 6 — Reconsider the achieve goal before the perception intention is processed.**  
Before `holding(rubble)` is actually added to the belief base, the original achieve-goal intention can be selected again. At that moment:

```gwendolen
holding(rubble)
```

is still absent.

So the achieve goal is still considered unsatisfied.

**Step 7 — Check whether the movement plan still applies for `(5, 5)`.**  
The agent still believes:

```gwendolen
possible_rubble(5, 5)
```

and it does not believe:

```gwendolen
no_rubble(5, 5)
```

So the movement plan still applies with:

```gwendolen
X = 5
Y = 5
```

**Answer.**  
The extra `move_to(5, 5)` happens because `lift_rubble` has caused a perception of `holding(rubble)`, but that perception has not yet been processed into the belief base. The achieve goal is reconsidered while `holding(rubble)` is still absent, so the movement plan applies once more for `(5, 5)`.

---

## Q24. Trace the reasoning-rule rubble version

Use this reasoning rule:

```gwendolen
square_to_check(X, Y) :-
    possible_rubble(X, Y),
    ~no_rubble(X, Y);
```

and this plan:

```gwendolen
+!holding(rubble) [achieve] :
    {B square_to_check(X, Y)} <-
        move_to(X, Y);
```

Belief base:

```gwendolen
possible_rubble(1, 1)
possible_rubble(3, 3)
possible_rubble(5, 5)
no_rubble(1, 1)
no_rubble(3, 3)
```

Which movement is selected?

### Worked solution

**Step 1 — Derive `square_to_check` facts.**  
A square is checkable if it is possible rubble and not known to be no-rubble.

**Step 2 — Test `(1, 1)`.**  
`possible_rubble(1, 1)` holds, but `no_rubble(1, 1)` also holds.  
So `~no_rubble(1, 1)` fails.

**Step 3 — Test `(3, 3)`.**  
`possible_rubble(3, 3)` holds, but `no_rubble(3, 3)` also holds.  
So `~no_rubble(3, 3)` fails.

**Step 4 — Test `(5, 5)`.**  
`possible_rubble(5, 5)` holds.  
There is no `no_rubble(5, 5)` belief.  
So the rule derives:

```gwendolen
square_to_check(5, 5)
```

**Step 5 — Apply the plan.**  
The guard:

```gwendolen
{B square_to_check(X, Y)}
```

holds with:

```gwendolen
X = 5
Y = 5
```

So the deed is:

```gwendolen
move_to(5, 5)
```

**Answer.**  
The selected movement is `move_to(5, 5)`. The reasoning-rule version gives the same behaviour as the original complex guard, but factors the condition into `square_to_check`.

---

## Q25. Build a goal-in-guard relocation plan

You want the robot to achieve:

```gwendolen
rubble(TargetX, TargetY) [achieve]
```

by first achieving:

```gwendolen
holding(rubble) [achieve]
```

then moving to the target and dropping the rubble. Also, the robot should lift rubble only if it currently has the goal `holding(rubble) [achieve]`. Write the two relevant plan patterns.

### Worked solution

**Step 1 — Write the high-level relocation plan.**  
The high-level goal is to make rubble be at a target location. When that achieve goal appears, the robot should first get the rubble, then move to the target, then drop it.

```gwendolen
+!rubble(TargetX, TargetY) [achieve] : {True} <-
    +!holding(rubble) [achieve],
    move_to(TargetX, TargetY),
    drop;
```

**Step 2 — Write the guarded rubble-lifting plan.**  
The event is seeing rubble:

```gwendolen
+rubble(X, Y)
```

The robot should lift only if it is at that location and currently has the goal of holding rubble:

```gwendolen
+rubble(X, Y) :
    {B at(X, Y), G holding(rubble) [achieve]} <-
        lift_rubble;
```

**Step 3 — Explain why the goal guard matters.**  
Without the goal guard, the robot might lift rubble whenever it sees rubble, even if its current task is unrelated. The goal guard restricts lifting to cases where lifting contributes to the active goal.

**Answer.**

```gwendolen
+!rubble(TargetX, TargetY) [achieve] : {True} <-
    +!holding(rubble) [achieve],
    move_to(TargetX, TargetY),
    drop;

+rubble(X, Y) :
    {B at(X, Y), G holding(rubble) [achieve]} <-
        lift_rubble;
```

---

## Q26. Add waiting to stop premature progress

Baseline achievement plan:

```gwendolen
+!holding(rubble) [achieve] :
    {B possible_rubble(X, Y), ~B no_rubble(X, Y)} <-
        move_to(X, Y);
```

Modify it so that, after moving to a square, the original achievement intention waits until that square has been processed. Also write the two perception-handling plans that produce `checked(X, Y)`.

### Worked solution

**Step 1 — Identify the problem.**  
After `move_to(X, Y)`, the original achievement intention can be selected again before perception has added `no_rubble(X, Y)` or processed `rubble(X, Y)`.

**Step 2 — Add a wait deed after movement.**  
The wait should be for:

```gwendolen
checked(X, Y)
```

So the achievement plan becomes:

```gwendolen
+!holding(rubble) [achieve] :
    {B possible_rubble(X, Y), ~B no_rubble(X, Y)} <-
        move_to(X, Y),
        *checked(X, Y);
```

**Step 3 — Ensure non-rubble squares become checked.**

```gwendolen
+at(X, Y) :
    {~B rubble(X, Y)} <-
        +no_rubble(X, Y),
        +checked(X, Y);
```

**Step 4 — Ensure rubble squares become checked.**

```gwendolen
+rubble(X, Y) :
    {B at(X, Y)} <-
        lift_rubble,
        +checked(X, Y);
```

**Step 5 — Explain the effect.**  
The main achievement intention pauses at `*checked(X, Y)`. Other intentions can still run, including the perception-handling intention that adds `checked(X, Y)`. Once `checked(X, Y)` is believed, the wait succeeds and the achievement intention can continue.

**Answer.**

```gwendolen
+!holding(rubble) [achieve] :
    {B possible_rubble(X, Y), ~B no_rubble(X, Y)} <-
        move_to(X, Y),
        *checked(X, Y);

+at(X, Y) :
    {~B rubble(X, Y)} <-
        +no_rubble(X, Y),
        +checked(X, Y);

+rubble(X, Y) :
    {B at(X, Y)} <-
        lift_rubble,
        +checked(X, Y);
```

---

## Q27. Trace waiting at one square

The current intention is:

| Trigger | Deed |
|---|---|
| `+!holding(rubble)` | `move_to(1, 1)` |
| `+!holding(rubble)` | `*checked(1, 1)` |
| `+start` | `+!holding(rubble)` |

After `move_to(1, 1)`, the agent does not yet believe `checked(1, 1)`. Explain what happens next.

### Worked solution

**Step 1 — Execute the first top deed.**  
The top deed is:

```gwendolen
move_to(1, 1)
```

The action executes.

**Step 2 — Move to the next deed in the same intention.**  
The next deed is:

```gwendolen
*checked(1, 1)
```

This means: wait until the agent believes `checked(1, 1)`.

**Step 3 — Check the current belief base.**  
The question says the agent does not yet believe:

```gwendolen
checked(1, 1)
```

So the wait cannot be discharged.

**Step 4 — Apply the waiting rule.**  
The current intention is suspended or skipped for now. It does not continue past the wait.

**Step 5 — Let other intentions run.**  
Perception can create another intention to add:

```gwendolen
at(1, 1)
```

Then the `+at(1, 1)` plan can add:

```gwendolen
no_rubble(1, 1)
checked(1, 1)
```

**Step 6 — Return to the waiting intention.**  
Once `checked(1, 1)` is in the belief base, the wait deed succeeds and is removed.

**Answer.**  
The original achievement intention pauses at `*checked(1, 1)`. Other intentions continue, especially perception-handling intentions. Once a perception-handling plan adds `checked(1, 1)`, the wait succeeds and the original intention can proceed.

---

## Q28. Fix a mode-switch bug with locking

Buggy mode-switch plan:

```gwendolen
+rubble(X, Y) : {B at(X, Y)} <-
    -search_mode,
    +lift_mode;
```

Explain the bug, then rewrite the plan using locking.

### Worked solution

**Step 1 — Identify the intended mode switch.**  
The plan is meant to change the agent from:

```gwendolen
search_mode
```

to:

```gwendolen
lift_mode
```

**Step 2 — Locate the interleaving danger.**  
The two deeds are:

```gwendolen
-search_mode
+lift_mode
```

They are not atomic by default. Gwendolen may execute `-search_mode`, then switch to another intention before executing `+lift_mode`.

**Step 3 — Describe the bad intermediate state.**  
After `-search_mode` but before `+lift_mode`, the agent believes neither:

```gwendolen
search_mode
```

nor:

```gwendolen
lift_mode
```

If the achievement goal `holding(rubble)` is reconsidered in this state, neither the search plan nor the lift plan applies.

**Step 4 — Add lock and unlock around the short internal update.**

```gwendolen
+rubble(X, Y) : {B at(X, Y)} <-
    +.lock,
    -search_mode,
    +lift_mode,
    -.lock;
```

**Step 5 — Explain the fix.**  
Between `+.lock` and `-.lock`, Gwendolen keeps selecting the current intention. So another intention cannot observe the half-updated mode state.

**Answer.**  
The fixed plan is:

```gwendolen
+rubble(X, Y) : {B at(X, Y)} <-
    +.lock,
    -search_mode,
    +lift_mode,
    -.lock;
```

Locking makes the mode update atomic with respect to intention interleaving.

---

# Section D — Hard edge cases: where methods disagree or break down

These are the highest-value exam-style traps. The answer is usually not “run the next line”; it is “which semantic mechanism wins?”

---

## Q29. Achieve goal already satisfied

Belief base:

```gwendolen
charged
```

Initial goal:

```gwendolen
charged [achieve]
```

Plan:

```gwendolen
+!charged [achieve] : {T} <- plug_in, wait_full;
```

Does the agent need to execute `plug_in`?

### Worked solution

**Step 1 — Identify the goal type.**  
The goal is an achieve goal:

```gwendolen
charged [achieve]
```

**Step 2 — Apply the achieve-goal check.**  
Before planning, Gwendolen checks whether the corresponding belief is already present:

```gwendolen
charged
```

**Step 3 — Check the belief base.**  
The belief base already contains:

```gwendolen
charged
```

**Step 4 — Decide whether planning is needed.**  
Since the goal is already achieved, the agent does not need to use the plan for achieving it.

**Answer.**  
No. The agent should not need to execute `plug_in`. For achieve goals, belief-base satisfaction is checked before planning.

---

## Q30. Belief stays true, event does not repeat

Belief `alarm` is added once and remains true. The plan is:

```gwendolen
+alarm : {T} <- notify, silence;
```

After `notify`, the belief `alarm` is still present. Does `+alarm` trigger again automatically?

### Worked solution

**Step 1 — Identify the trigger.**  
The trigger is:

```gwendolen
+alarm
```

This means “the belief `alarm` has just appeared”.

**Step 2 — Check whether the belief merely remains true or appears again.**  
The question says `alarm` remains true. It has not been removed and re-added.

**Step 3 — Apply the event rule.**  
Plans are triggered by events, not by facts merely being true.

**Answer.**  
No. The plan does not trigger again automatically. To get another `+alarm` event, `alarm` would need to disappear and then be added again.

---

## Q31. Negative belief does not mean proven false

Belief base:

```gwendolen
at(2, 2)
```

No belief about rubble at `(2, 2)` is present. Plan:

```gwendolen
+at(X, Y) : {~B rubble(X, Y)} <- +no_rubble(X, Y);
```

Event:

```gwendolen
+at(2, 2)
```

Does the guard hold? What subtle interpretation issue should you notice?

### Worked solution

**Step 1 — Match the trigger.**  
The event `+at(2, 2)` matches `+at(X, Y)` with:

```gwendolen
X = 2
Y = 2
```

**Step 2 — Substitute into the guard.**

```gwendolen
{~B rubble(2, 2)}
```

**Step 3 — Check the belief base.**  
The belief base does not contain:

```gwendolen
rubble(2, 2)
```

So `~B rubble(2, 2)` holds.

**Step 4 — State the subtlety.**  
`~B rubble(2, 2)` means “the agent does not believe rubble is there”. It does not mean the world has logically proven there is no rubble there.

**Answer.**  
Yes, the guard holds, so the plan can add `no_rubble(2, 2)`. The subtle point is that `~B p` is absence of belief in `p`, not necessarily proof that `p` is false in the external world.

---

## Q32. All squares checked in the list-recursive rule

Belief base:

```gwendolen
possible_rubble([sq(1, 1), sq(3, 3)])
no_rubble(1, 1)
no_rubble(3, 3)
```

Rules:

```gwendolen
square_to_check(X, Y) :-
    possible_rubble(L),
    check_rubble(L, X, Y);

check_rubble([sq(X, Y) | T], X, Y) :-
    ~no_rubble(X, Y);

check_rubble([sq(X, Y) | T], X1, Y1) :-
    no_rubble(X, Y),
    check_rubble(T, X1, Y1);
```

What does `square_to_check(X, Y)` derive?

### Worked solution

**Step 1 — Start from the list.**

```gwendolen
[sq(1, 1), sq(3, 3)]
```

**Step 2 — Try the base case at `(1, 1)`.**  
The base case requires:

```gwendolen
~no_rubble(1, 1)
```

But `no_rubble(1, 1)` is believed, so the base case fails.

**Step 3 — Recurse past `(1, 1)`.**  
The recursive rule applies and calls:

```gwendolen
check_rubble([sq(3, 3)], X1, Y1)
```

**Step 4 — Try the base case at `(3, 3)`.**  
The base case requires:

```gwendolen
~no_rubble(3, 3)
```

But `no_rubble(3, 3)` is believed, so it fails.

**Step 5 — Recurse to the empty list.**  
The recursive rule would call:

```gwendolen
check_rubble([], X1, Y1)
```

But the sheet’s rules do not provide a base case for the empty list.

**Answer.**  
No `square_to_check(X, Y)` fact is derived. All listed squares have been ruled out, and there is no empty-list rule that returns another candidate.

---

## Q33. Waiting for a belief that nobody produces

Plan:

```gwendolen
+!inspect(site) [achieve] : {T} <-
    move_to(site),
    *checked(site),
    report;
```

No other plan ever adds:

```gwendolen
checked(site)
```

What happens to this intention after `move_to(site)`?

### Worked solution

**Step 1 — Execute the action before the wait.**  
The first deed is:

```gwendolen
move_to(site)
```

It executes.

**Step 2 — Reach the wait deed.**  
The next deed is:

```gwendolen
*checked(site)
```

This means the intention must wait until `checked(site)` is believed.

**Step 3 — Check whether the required belief can appear.**  
The question says no plan ever adds:

```gwendolen
checked(site)
```

So the waited-for belief will not be produced by this program.

**Step 4 — Apply the waiting rule.**  
The current intention is suspended or skipped whenever selected, because the wait condition is not satisfied.

**Answer.**  
The intention gets stuck waiting at `*checked(site)`. Other intentions may still run, but this intention cannot reach `report` unless some perception or plan eventually adds `checked(site)`.

---

## Q34. Waiting vs locking: choose the right mechanism

You have two problems:

**Problem A.** After `move_to(X, Y)`, the agent must wait until perception has processed the square and added `checked(X, Y)`. Other intentions should still run.

**Problem B.** The agent must remove `search_mode` and add `lift_mode` without another intention observing the intermediate state where neither mode is true.

Which mechanism should be used for each problem?

### Worked solution

**Step 1 — Diagnose Problem A.**  
Problem A is about pausing one intention until a belief appears:

```gwendolen
checked(X, Y)
```

Other intentions must still run, because those other intentions may be the ones processing perception and adding `checked(X, Y)`.

So Problem A needs waiting:

```gwendolen
move_to(X, Y),
*checked(X, Y)
```

**Step 2 — Diagnose Problem B.**  
Problem B is about preventing interleaving during a short internal update:

```gwendolen
-search_mode,
+lift_mode
```

The danger is that another intention sees the belief base after the first deed but before the second.

So Problem B needs locking:

```gwendolen
+.lock,
-search_mode,
+lift_mode,
-.lock
```

**Step 3 — Contrast the mechanisms.**  
Waiting preserves responsiveness.  
Locking temporarily blocks other intentions from running.

**Answer.**  
Use waiting for Problem A. Use locking for Problem B.

---

## Q35. Why not lock movement?

A student proposes:

```gwendolen
+!holding(rubble) [achieve] :
    {B possible_rubble(X, Y), ~B no_rubble(X, Y)} <-
        +.lock,
        move_to(X, Y),
        -.lock;
```

Explain why this is bad according to the lecture advice.

### Worked solution

**Step 1 — Identify what is inside the lock.**  
The locked segment is:

```gwendolen
move_to(X, Y)
```

**Step 2 — Recall the purpose of locking.**  
Locking keeps the current intention current until the lock is released. Other intentions cannot be selected during the locked segment.

**Step 3 — Identify why movement is different from a short belief update.**  
`move_to(X, Y)` may take time. While moving, the robot may need to react to perceptions such as obstacles, new information, or other events.

**Step 4 — Apply the lecture warning.**  
The lecturer’s advice is not to put long-running actions inside locks. Locks are suitable for short internal updates such as:

```gwendolen
+.lock,
-search_mode,
+lift_mode,
-.lock
```

They are not suitable for long external actions such as movement.

**Answer.**  
The plan is bad because it locks the agent during `move_to(X, Y)`. That reduces responsiveness and may prevent other important intentions, such as obstacle-handling intentions, from running while the robot is moving.

---

## Q36. Missing unlock

A plan contains:

```gwendolen
+rubble(X, Y) : {B at(X, Y)} <-
    +.lock,
    -search_mode,
    +lift_mode;
```

There is no `-.lock`. What is the problem?

### Worked solution

**Step 1 — Identify the locking segment.**  
The plan starts a lock with:

```gwendolen
+.lock
```

**Step 2 — Check whether the lock is released.**  
A lock should be released with:

```gwendolen
-.lock
```

The plan does not contain `-.lock`.

**Step 3 — Apply the meaning of lock.**  
While locked, Gwendolen keeps the current intention current and does not select other intentions.

**Step 4 — Diagnose the failure.**  
If the lock is never released, other intentions may be blocked indefinitely. That can stop perception-handling, responsiveness, or other goals from progressing.

**Answer.**  
The problem is that the lock is acquired but never released. The update should be:

```gwendolen
+.lock,
-search_mode,
+lift_mode,
-.lock
```

---

## Q37. Mode-switch edge case: no applicable plan

Mode-based plans:

```gwendolen
+!holding(rubble) [achieve] :
    {B possible_rubble(X, Y), ~B no_rubble(X, Y), B search_mode} <-
        move_to(X, Y);

+!holding(rubble) [achieve] :
    {B rubble(X, Y), B at(X, Y), B lift_mode} <-
        lift_rubble;
```

Belief base at a bad intermediate moment:

```gwendolen
possible_rubble(5, 5)
rubble(5, 5)
at(5, 5)
```

The agent believes neither `search_mode` nor `lift_mode`. What happens when `holding(rubble) [achieve]` is reconsidered?

### Worked solution

**Step 1 — Check whether the achieve goal is satisfied.**  
The corresponding belief would be:

```gwendolen
holding(rubble)
```

The belief base does not contain it, so the achieve goal is still unsatisfied.

**Step 2 — Check the search plan.**  
The search plan guard requires:

```gwendolen
B possible_rubble(X, Y)
~B no_rubble(X, Y)
B search_mode
```

The agent may satisfy the first two conditions for `(5, 5)`, but it does not believe:

```gwendolen
search_mode
```

So the search plan fails.

**Step 3 — Check the lift plan.**  
The lift plan guard requires:

```gwendolen
B rubble(X, Y)
B at(X, Y)
B lift_mode
```

The agent believes `rubble(5, 5)` and `at(5, 5)`, but it does not believe:

```gwendolen
lift_mode
```

So the lift plan fails.

**Step 4 — State the consequence.**  
No plan applies to the unsatisfied achievement goal.

**Answer.**  
Gwendolen has no applicable plan for `holding(rubble) [achieve]`. This is exactly the mode-switch bug: another intention has observed the belief base after `search_mode` was removed but before `lift_mode` was added.

---

## Q38. Multiple applicable plans: do not invent deterministic choice

Belief base:

```gwendolen
possible_rubble(1, 1)
possible_rubble(3, 3)
```

No `no_rubble` beliefs are present. Plan:

```gwendolen
+!holding(rubble) [achieve] :
    {B possible_rubble(X, Y), ~B no_rubble(X, Y)} <-
        move_to(X, Y);
```

Event:

```gwendolen
+!holding(rubble) [achieve]
```

Which bindings are applicable? Can you claim from this information alone exactly which one Gwendolen must choose?

### Worked solution

**Step 1 — Match the trigger.**  
The event matches the plan trigger exactly:

```gwendolen
+!holding(rubble) [achieve]
```

**Step 2 — Evaluate the guard for `(1, 1)`.**  
The agent believes:

```gwendolen
possible_rubble(1, 1)
```

and does not believe:

```gwendolen
no_rubble(1, 1)
```

So `(1, 1)` is applicable.

**Step 3 — Evaluate the guard for `(3, 3)`.**  
The agent believes:

```gwendolen
possible_rubble(3, 3)
```

and does not believe:

```gwendolen
no_rubble(3, 3)
```

So `(3, 3)` is also applicable.

**Step 4 — Avoid overclaiming.**  
The sheet says that if multiple plans apply, one is selected. From the guard information alone, we can list applicable bindings, but we should not invent a deterministic choice unless the selection rule or ordering is specified.

**Answer.**  
Applicable bindings include:

```gwendolen
X = 1, Y = 1
X = 3, Y = 3
```

From this information alone, do not claim exactly which one must be chosen. The safe answer is: both are applicable; Gwendolen selects one according to its plan/binding selection mechanism.

---

## Q39. Perception lag vs immediate belief update

A student says: “After `lift_rubble`, the robot immediately believes `holding(rubble)`, so the extra move cannot happen.” Correct this statement using the reasoning-cycle order.

### Worked solution

**Step 1 — Identify the action.**  
The action is:

```gwendolen
lift_rubble
```

This may cause the environment to produce the perception:

```gwendolen
holding(rubble)
```

**Step 2 — Apply the perception rule from the sheet.**  
Perception does not automatically become a belief immediately. It creates an intention whose job is to add the perceived belief.

So perception creates something like:

| Trigger | Deed |
|---|---|
| `+start` | `+holding(rubble)` |

**Step 3 — Explain the lag.**  
Until that perception intention is selected and processed, the belief base still lacks:

```gwendolen
holding(rubble)
```

**Step 4 — Connect to the extra move.**  
If the original achieve-goal intention is selected before the perception intention, Gwendolen still thinks the achieve goal is unsatisfied. Therefore the movement plan can apply again.

**Answer.**  
The student’s statement is wrong. `lift_rubble` may generate a perception of `holding(rubble)`, but that perception becomes a belief only after its own intention is processed. The extra move can happen in the gap between perception generation and belief-base update.

---

## Q40. Final synthesis: diagnose and repair a broken rubble controller

A student writes this controller:

```gwendolen
:Initial Beliefs:
possible_rubble(1, 1)
possible_rubble(3, 3)
possible_rubble(5, 5)
search_mode

:Initial Goals:
holding(rubble) [achieve]

:Plans:
+!holding(rubble) [achieve] :
    {B possible_rubble(X, Y), ~B no_rubble(X, Y), B search_mode} <-
        move_to(X, Y);

+!holding(rubble) [achieve] :
    {B rubble(X, Y), B at(X, Y), B lift_mode} <-
        lift_rubble;

+at(X, Y) :
    {~B rubble(X, Y)} <-
        +no_rubble(X, Y);

+rubble(X, Y) :
    {B at(X, Y)} <-
        -search_mode,
        +lift_mode;

+holding(rubble) :
    {True} <-
        print(done);
```

Identify two separate problems from the sheet and repair them.

### Worked solution

**Step 1 — Identify the first problem: premature progress after movement.**  
The search plan is:

```gwendolen
+!holding(rubble) [achieve] :
    {B possible_rubble(X, Y), ~B no_rubble(X, Y), B search_mode} <-
        move_to(X, Y);
```

After `move_to(X, Y)`, perception is processed through separate intentions. The original achievement intention may continue before the square has been fully processed.

The sheet’s repair is waiting:

```gwendolen
move_to(X, Y),
*checked(X, Y)
```

**Step 2 — Add beliefs that discharge the wait.**  
The perception-handling plans should add `checked(X, Y)`.

For no-rubble squares:

```gwendolen
+at(X, Y) :
    {~B rubble(X, Y)} <-
        +no_rubble(X, Y),
        +checked(X, Y);
```

For rubble squares, the rubble-handling plan can add `checked(X, Y)` after lifting or after mode-processing, depending on the design. The important sheet pattern is that some perception-handling plan must produce `checked(X, Y)`.

**Step 3 — Identify the second problem: non-atomic mode switch.**  
The mode switch is:

```gwendolen
-search_mode,
+lift_mode
```

This can be interleaved. After `-search_mode` but before `+lift_mode`, another intention may run and see neither mode.

**Step 4 — Repair the mode switch with locking.**

```gwendolen
+rubble(X, Y) :
    {B at(X, Y)} <-
        +.lock,
        -search_mode,
        +lift_mode,
        -.lock;
```

**Step 5 — Write a repaired core version.**  
One repaired core is:

```gwendolen
+!holding(rubble) [achieve] :
    {B possible_rubble(X, Y), ~B no_rubble(X, Y), B search_mode} <-
        move_to(X, Y),
        *checked(X, Y);

+!holding(rubble) [achieve] :
    {B rubble(X, Y), B at(X, Y), B lift_mode} <-
        lift_rubble;

+at(X, Y) :
    {~B rubble(X, Y)} <-
        +no_rubble(X, Y),
        +checked(X, Y);

+rubble(X, Y) :
    {B at(X, Y)} <-
        +.lock,
        -search_mode,
        +lift_mode,
        +checked(X, Y),
        -.lock;

+holding(rubble) :
    {True} <-
        print(done);
```

**Step 6 — Explain the repairs.**  
Waiting stops the search intention from charging ahead before perception has marked the square as processed. Locking prevents another intention from seeing the mode beliefs half-updated.

**Answer.**  
The two problems are: missing waiting after movement, and an unlocked mode switch. Add `*checked(X, Y)` after movement and ensure perception-handling plans add `checked(X, Y)`. Surround the mode update with `+.lock` and `-.lock`.

---

# Compact revision checklist

Before answering any Gwendolen trace question, ask:

1. What event just occurred?
2. Which plan triggers match that event?
3. Which guards hold in the current belief base and goal set?
4. What unifier is produced?
5. Is the top deed an action, belief update, goal update, wait, lock, unlock, `no plan yet`, or `null`?
6. If it is an achieve goal, is the corresponding belief already present?
7. If it is a perform goal, where does `null` appear?
8. Did an action create perception, and has that perception actually been processed into a belief yet?
9. Is a reasoning rule deriving the guard predicate?
10. If there is a list, what is the head and what is the tail?
11. If there is a wait, who produces the waited-for belief?
12. If there is a lock, is the locked segment short and internal?
13. If there is a mode switch, can another intention observe a half-updated state?
14. Are you confusing a trigger event with a state condition?

