---
subject: COMP64401
chapter: 53
title: "Datalog — Question Bank"
language: en
---

# COMP64401 Chapter 3 — Datalog Worked Question Bank

Based on the uploaded Chapter 3 Datalog lecture sheet.

Use this as a cover-and-check workbook: try each question first, then reveal the solution immediately below it.

---

## Task types identified from the sheet

The sheet covers these examinable computational/procedural task types:

1. Recognising Datalog syntax: terms, atoms, ground atoms, facts, rules, heads, bodies, predicates, arities.
2. Checking Datalog rule safety: every head variable must occur in the body.
3. Reading `H :- A1, ..., An` in the correct direction.
4. Translating rules into first-order universal implications and Horn clauses.
5. Applying substitutions to atoms and rules.
6. Constructing and counting the Herbrand base.
7. Computing the Herbrand model using bottom-up rule application.
8. Computing fixed points using the immediate consequence operator `ICO_P`.
9. Testing ground entailment by membership in `HM(P)` / `ICO_P*(∅)`.
10. Answering conjunctive queries from a computed Herbrand model.
11. Testing rule entailment using the fresh-constant trick.
12. Building Datalog encodings for hierarchies, domain/range rules, higher-arity relations, inverse/subproperty rules, non-tree relational patterns, and recursion.
13. Recognising limitations of plain Datalog: no anonymous individuals, no function terms, no disjunctive heads, no full negation.
14. Reasoning about extensions: negation as failure, non-monotonicity, disjunctive Datalog, data types, Datalog±, and guardedness.
15. Comparing Datalog with description logic: active domain vs anonymous individuals, arbitrary relational structures vs tree-shaped anonymous structures.
16. Applying the complexity caveat: polynomial Herbrand base/model only under bounded predicate arity.

---

# Section A — Mechanical / single-step skills

## A1. Parse a rule: head, body, variables, predicates

Given the rule:

```prolog
Slippery(x) :- Rain(x), BelowF(x).
```

Identify:

1. the head;
2. the body atoms;
3. the variables;
4. the predicates and their arities;
5. the informal reading of the rule.

---

### Solution A1

**Step 1 — Find the head.**

The head is the atom to the left of `:-`:

```prolog
Slippery(x)
```

**Step 2 — Find the body.**

The body is the comma-separated list to the right of `:-`:

```prolog
Rain(x), BelowF(x)
```

So the body atoms are:

```prolog
Rain(x)
BelowF(x)
```

**Step 3 — List the variables.**

The only variable is:

```text
x
```

**Step 4 — List predicates and arities.**

Each predicate is unary because each takes one argument:

```text
Slippery/1
Rain/1
BelowF/1
```

**Step 5 — Read the rule in the correct direction.**

`H :- A, B` means:

```text
if A and B hold, then H holds.
```

So the rule says:

```text
If x is rainy and x is below freezing, then x is slippery.
```

Equivalently:

```text
Rain(x) ∧ BelowF(x) ⇒ Slippery(x)
```

---

## A2. Classify atoms, ground atoms, facts, and rules

Classify each item as one or more of: atom, ground atom, fact, rule.

```prolog
Person(Bijan).
wears(x,y)
ColdLegs(x) :- Person(x), wears(x,y), Shorts(y).
BelowF(W).
Rain(x)
```

---

### Solution A2

**Step 1 — Recall the tests.**

- An **atom** is a predicate applied to the right number of terms.
- A **ground atom** has no variables.
- A **fact** is a ground atom asserted unconditionally; equivalently, a rule with an empty body.
- A **rule** has the form `Head :- Body`.

**Step 2 — Classify each item.**

```prolog
Person(Bijan).
```

This is an atom. It has no variables, so it is ground. Since it is asserted unconditionally, it is a fact.

```text
Classification: atom, ground atom, fact
```

```prolog
wears(x,y)
```

This is an atom. It contains variables, so it is not ground. It is not written as an unconditional assertion with a full stop in this list, so treat it as a non-ground atom, not as a fact.

```text
Classification: atom
```

```prolog
ColdLegs(x) :- Person(x), wears(x,y), Shorts(y).
```

This has a head and body, so it is a rule. The head and body components are atoms, but the whole expression is a rule.

```text
Classification: rule
```

```prolog
BelowF(W).
```

Assuming `W` is used as a named individual/constant, this is an atom, ground atom, and fact.

```text
Classification: atom, ground atom, fact
```

```prolog
Rain(x)
```

This is an atom. It contains a variable, so it is not ground and not a fact.

```text
Classification: atom
```

---

## A3. Check rule safety

For each rule, decide whether it is a valid plain Datalog rule under the safety condition.

```prolog
R1: Parent(x,y) :- Mother(y,x).
R2: hasParent(x,y) :- Person(x).
R3: Happy(x) :- Person(x), hasParent(x,y).
R4: Ancestor(x,z) :- Parent(x,y), Ancestor(y,z).
```

---

### Solution A3

**Step 1 — Recall the safety discriminator.**

A Datalog rule is safe if every variable in the head also occurs somewhere in the body.

Body-only variables are allowed. Head-only variables are not allowed.

**Step 2 — Check `R1`.**

```prolog
Parent(x,y) :- Mother(y,x).
```

Head variables:

```text
x, y
```

Body variables:

```text
y, x
```

Both head variables occur in the body.

```text
R1 is safe.
```

**Step 3 — Check `R2`.**

```prolog
hasParent(x,y) :- Person(x).
```

Head variables:

```text
x, y
```

Body variables:

```text
x
```

The variable `y` occurs in the head but not in the body.

```text
R2 is unsafe.
```

It would require Datalog to invent an unnamed parent, which plain Datalog cannot do.

**Step 4 — Check `R3`.**

```prolog
Happy(x) :- Person(x), hasParent(x,y).
```

Head variables:

```text
x
```

Body variables:

```text
x, y
```

Every head variable occurs in the body. The body-only variable `y` is allowed.

```text
R3 is safe.
```

**Step 5 — Check `R4`.**

```prolog
Ancestor(x,z) :- Parent(x,y), Ancestor(y,z).
```

Head variables:

```text
x, z
```

Body variables:

```text
x, y, z
```

Every head variable occurs in the body.

```text
R4 is safe.
```

---

## A4. Convert a Datalog rule into a Horn clause

Convert the rule into a universally quantified implication and then into Horn-clause form.

```prolog
ColdLegs(x) :- Person(x), wears(x,y), Shorts(y).
```

---

### Solution A4

**Step 1 — Read the rule as an implication.**

The body implies the head:

```text
Person(x) ∧ wears(x,y) ∧ Shorts(y) ⇒ ColdLegs(x)
```

**Step 2 — Add universal quantification.**

Variables in Datalog rules are universally quantified:

```text
∀x∀y (Person(x) ∧ wears(x,y) ∧ Shorts(y) ⇒ ColdLegs(x))
```

**Step 3 — Rewrite implication as disjunction.**

Use:

```text
A ⇒ B  ≡  ¬A ∨ B
```

So:

```text
¬(Person(x) ∧ wears(x,y) ∧ Shorts(y)) ∨ ColdLegs(x)
```

**Step 4 — Push negation inside using De Morgan's law.**

```text
¬Person(x) ∨ ¬wears(x,y) ∨ ¬Shorts(y) ∨ ColdLegs(x)
```

**Step 5 — Check why it is Horn.**

A Horn clause has at most one positive literal. Here the only positive literal is:

```text
ColdLegs(x)
```

So this is a Horn clause.

---

## A5. Apply a substitution to atoms and rules

Let the substitution be:

```text
σ = {x ↦ Alice, y ↦ Bob, z ↦ Alice}
```

Apply `σ` to:

```prolog
Friend(x,y)
SamePerson(x,z)
Knows(x,z) :- Friend(x,y), Friend(y,z).
```

---

### Solution A5

**Step 1 — Apply the substitution term-by-term.**

Replace each variable by its assigned individual.

For:

```prolog
Friend(x,y)
```

we get:

```prolog
Friend(Alice,Bob)
```

**Step 2 — Handle repeated or shared variables consistently.**

For:

```prolog
SamePerson(x,z)
```

`x` and `z` both map to `Alice`, so:

```prolog
SamePerson(Alice,Alice)
```

**Step 3 — Apply the substitution to the whole rule.**

Original rule:

```prolog
Knows(x,z) :- Friend(x,y), Friend(y,z).
```

Apply `σ` to the head:

```prolog
Knows(Alice,Alice)
```

Apply `σ` to the body:

```prolog
Friend(Alice,Bob), Friend(Bob,Alice)
```

So the grounded rule instance is:

```prolog
Knows(Alice,Alice) :- Friend(Alice,Bob), Friend(Bob,Alice).
```

---

## A6. Count the Herbrand base

A program contains constants:

```text
a, b, c
```

and predicates:

```text
Person/1, Likes/2, Sale/3
```

1. How many ground atoms are in the Herbrand base exactly?
2. What is the simple upper bound using `p · m^n`, where `p` is the number of predicates, `m` is the number of individuals, and `n` is the maximum arity?

---

### Solution A6

**Step 1 — Identify the number of constants.**

There are three constants:

```text
m = 3
```

**Step 2 — Count ground atoms predicate-by-predicate.**

For a unary predicate, there are `3^1 = 3` ground atoms:

```text
Person(a), Person(b), Person(c)
```

For a binary predicate, there are `3^2 = 9` ground atoms:

```text
Likes(_, _): 9 possibilities
```

For a ternary predicate, there are `3^3 = 27` ground atoms:

```text
Sale(_, _, _): 27 possibilities
```

**Step 3 — Add the exact counts.**

```text
|HB(P)| = 3 + 9 + 27 = 39
```

**Step 4 — Compute the lecture-style upper bound.**

There are:

```text
p = 3 predicates
m = 3 individuals
n = 3 maximum arity
```

So:

```text
p · m^n = 3 · 3^3 = 3 · 27 = 81
```

**Step 5 — Interpret the difference.**

The exact Herbrand base has 39 atoms. The bound 81 is only an upper bound because it treats every predicate as if it had maximum arity 3.

---

## A7. Decide whether a ground fact is immediately derivable

Given:

```prolog
Likes(Alice,Bob).
Likes(Bob,Carol).
Knows(x,z) :- Likes(x,y), Likes(y,z).
```

Is `Knows(Alice,Carol)` an immediate consequence of the facts and rule?

---

### Solution A7

**Step 1 — Identify the rule to use.**

```prolog
Knows(x,z) :- Likes(x,y), Likes(y,z).
```

To derive `Knows(Alice,Carol)`, we need:

```text
x = Alice
z = Carol
```

**Step 2 — Find a value for the body-only variable.**

The body is:

```prolog
Likes(x,y), Likes(y,z)
```

With `x = Alice` and `z = Carol`, this becomes:

```prolog
Likes(Alice,y), Likes(y,Carol)
```

The facts include:

```prolog
Likes(Alice,Bob).
Likes(Bob,Carol).
```

So choose:

```text
y = Bob
```

**Step 3 — Check both body atoms.**

Under `σ = {x ↦ Alice, y ↦ Bob, z ↦ Carol}`:

```prolog
Likes(Alice,Bob)  is present.
Likes(Bob,Carol)  is present.
```

**Step 4 — Add the head.**

Therefore the rule derives:

```prolog
Knows(Alice,Carol)
```

So yes, `Knows(Alice,Carol)` is an immediate consequence.

---

# Section B — Multi-condition checks and fixed-point reasoning

## B1. Compute one iteration of the immediate consequence operator

Let `X` contain:

```prolog
Student(Alice).
Takes(Alice,Logic).
Hard(Logic).
```

Program `P` contains:

```prolog
Busy(x) :- Student(x), Takes(x,y), Hard(y).
Stressed(x) :- Busy(x).
```

Compute `ICO_P(X)`.

---

### Solution B1

**Step 1 — Start with everything already in `X`.**

The immediate consequence operator keeps existing atoms:

```prolog
Student(Alice).
Takes(Alice,Logic).
Hard(Logic).
```

**Step 2 — Check the first rule.**

```prolog
Busy(x) :- Student(x), Takes(x,y), Hard(y).
```

Try:

```text
x = Alice
y = Logic
```

The body becomes:

```prolog
Student(Alice), Takes(Alice,Logic), Hard(Logic)
```

All three atoms are in `X`, so add:

```prolog
Busy(Alice).
```

**Step 3 — Check the second rule using the original `X`.**

```prolog
Stressed(x) :- Busy(x).
```

In one synchronous application of `ICO_P(X)`, the body must already be in `X`, not merely newly added during this same check.

`Busy(Alice)` is not in the original `X`, so this rule does not yet derive `Stressed(Alice)` in this one iteration.

**Step 4 — Return old atoms plus immediate new atoms.**

```prolog
ICO_P(X) = {
  Student(Alice),
  Takes(Alice,Logic),
  Hard(Logic),
  Busy(Alice)
}
```

---

## B2. Compute a fixed point for a simple chain program

Given program `P`:

```prolog
A(a).
B(x) :- A(x).
C(x) :- B(x).
D(x) :- C(x).
```

Compute `HM(P)` using fixed-point iterations starting from the facts.

---

### Solution B2

**Step 1 — Start with the facts.**

```text
X0 = { A(a) }
```

**Step 2 — First iteration.**

Check:

```prolog
B(x) :- A(x).
```

Since `A(a)` is in `X0`, infer:

```prolog
B(a)
```

The other rules need `B(a)` or `C(a)` in the previous set, so they do not fire yet under synchronous iteration.

```text
X1 = { A(a), B(a) }
```

**Step 3 — Second iteration.**

Now `B(a)` is available, so:

```prolog
C(a) :- B(a).
```

fires and adds:

```prolog
C(a)
```

```text
X2 = { A(a), B(a), C(a) }
```

**Step 4 — Third iteration.**

Now `C(a)` is available, so:

```prolog
D(a) :- C(a).
```

fires and adds:

```prolog
D(a)
```

```text
X3 = { A(a), B(a), C(a), D(a) }
```

**Step 5 — Fourth iteration.**

No new atoms can be added.

```text
X4 = X3
```

So the fixed point is:

```prolog
HM(P) = { A(a), B(a), C(a), D(a) }
```

---

## B3. Compute the running weather/cold-legs Herbrand model

Use the lecture's running-style program:

```prolog
WeatherC(x) :- Temp(x).
Temp(x) :- Cold(x).
Cold(x) :- BelowF(x).
IoC(x) :- Shorts(x).
Person(x) :- wears(x,y), IoC(y).
ColdLegs(x) :- Person(x), wears(x,y), Shorts(y),
               isLocIn(x,z), hasWeather(z,w), Cold(w).

wears(B,S).
Shorts(S).
isLocIn(B,M).
hasWeather(M,W).
BelowF(W).
```

Compute the full Herbrand model using fixed-point reasoning.

---

### Solution B3

**Step 1 — Start with the ground facts.**

```text
X0 = {
  wears(B,S),
  Shorts(S),
  isLocIn(B,M),
  hasWeather(M,W),
  BelowF(W)
}
```

**Step 2 — First iteration from `X0`.**

Rule:

```prolog
IoC(x) :- Shorts(x).
```

Since `Shorts(S)` is in `X0`, infer:

```prolog
IoC(S)
```

Rule:

```prolog
Cold(x) :- BelowF(x).
```

Since `BelowF(W)` is in `X0`, infer:

```prolog
Cold(W)
```

No other rule has its body fully satisfied yet.

```text
X1 = X0 ∪ { IoC(S), Cold(W) }
```

**Step 3 — Second iteration from `X1`.**

Rule:

```prolog
Person(x) :- wears(x,y), IoC(y).
```

Use substitution:

```text
x ↦ B
y ↦ S
```

The body becomes:

```prolog
wears(B,S), IoC(S)
```

Both are in `X1`, so infer:

```prolog
Person(B)
```

Rule:

```prolog
Temp(x) :- Cold(x).
```

Since `Cold(W)` is in `X1`, infer:

```prolog
Temp(W)
```

```text
X2 = X1 ∪ { Person(B), Temp(W) }
```

**Step 4 — Third iteration from `X2`.**

Rule:

```prolog
WeatherC(x) :- Temp(x).
```

Since `Temp(W)` is in `X2`, infer:

```prolog
WeatherC(W)
```

Rule:

```prolog
ColdLegs(x) :- Person(x), wears(x,y), Shorts(y),
               isLocIn(x,z), hasWeather(z,w), Cold(w).
```

Use substitution:

```text
x ↦ B
y ↦ S
z ↦ M
w ↦ W
```

The body becomes:

```prolog
Person(B), wears(B,S), Shorts(S), isLocIn(B,M), hasWeather(M,W), Cold(W)
```

All are in `X2`, so infer:

```prolog
ColdLegs(B)
```

```text
X3 = X2 ∪ { WeatherC(W), ColdLegs(B) }
```

**Step 5 — Fourth iteration.**

No rule derives anything new.

```text
X4 = X3
```

So the full Herbrand model is:

```prolog
HM(P) = {
  wears(B,S),
  Shorts(S),
  isLocIn(B,M),
  hasWeather(M,W),
  BelowF(W),
  IoC(S),
  Cold(W),
  Person(B),
  Temp(W),
  WeatherC(W),
  ColdLegs(B)
}
```

**Step 6 — Important edge note.**

If a slide/model list contains `Cold(W)` but omits `Temp(W)` and `WeatherC(W)` while still containing the rules:

```prolog
Temp(x) :- Cold(x).
WeatherC(x) :- Temp(x).
```

then that list is incomplete or truncated. A closed Herbrand model must include all rule consequences.

---

## B4. Test ground entailments using the Herbrand model

Using the model computed in B3, decide whether each entailment holds:

```text
P ⊨ ColdLegs(B)
P ⊨ WeatherC(W)
P ⊨ WeatherC(M)
P ⊨ Person(S)
P ⊨ wears(B,S)
```

---

### Solution B4

**Step 1 — Recall the theorem.**

For a ground atom `α`:

```text
P ⊨ α  iff  α ∈ HM(P)
```

So we just check membership in the Herbrand model.

**Step 2 — Check `ColdLegs(B)`.**

`ColdLegs(B)` is in `HM(P)`.

```text
P ⊨ ColdLegs(B): yes
```

**Step 3 — Check `WeatherC(W)`.**

`WeatherC(W)` is in `HM(P)`.

```text
P ⊨ WeatherC(W): yes
```

**Step 4 — Check `WeatherC(M)`.**

`WeatherC(M)` is not in `HM(P)`. There is no chain deriving `Temp(M)` or `Cold(M)`.

```text
P ⊨ WeatherC(M): no
```

**Step 5 — Check `Person(S)`.**

`Person(S)` is not in `HM(P)`. We only derived `Person(B)`.

```text
P ⊨ Person(S): no
```

**Step 6 — Check `wears(B,S)`.**

`wears(B,S)` is a ground fact, so it is in `HM(P)`.

```text
P ⊨ wears(B,S): yes
```

---

## B5. Answer a conjunctive query from a Herbrand model

Let `HM(P)` contain:

```prolog
Person(Alice).
Person(Bob).
Person(Carol).
Takes(Alice,Logic).
Takes(Alice,ML).
Takes(Bob,Logic).
Hard(Logic).
Easy(ML).
```

Answer the query:

```prolog
q(x) :- Person(x), Takes(x,y), Hard(y).
```

---

### Solution B5

**Step 1 — Identify the output variable.**

The query is:

```prolog
q(x)
```

So the answer should be all individuals `x` satisfying the body.

**Step 2 — Read the body.**

```prolog
Person(x), Takes(x,y), Hard(y)
```

This asks for people who take some hard course.

The variable `y` is body-only, so it is existentially matched during query answering: find some named individual `y` that makes the body true.

**Step 3 — Test `x = Alice`.**

Need:

```prolog
Person(Alice)
Takes(Alice,y)
Hard(y)
```

`Alice` takes `Logic`, and `Hard(Logic)` holds.

So `Alice` is an answer.

**Step 4 — Test `x = Bob`.**

Need:

```prolog
Person(Bob)
Takes(Bob,y)
Hard(y)
```

`Bob` takes `Logic`, and `Hard(Logic)` holds.

So `Bob` is an answer.

**Step 5 — Test `x = Carol`.**

Need:

```prolog
Person(Carol)
Takes(Carol,y)
Hard(y)
```

There is no `Takes(Carol,...)` atom.

So `Carol` is not an answer.

**Step 6 — Return the answer tuples.**

```text
q = { Alice, Bob }
```

---

## B6. Answer a conjunctive query with two output variables

Let `HM(P)` contain:

```prolog
Sale(Phone,Aisha,Shop1).
Sale(Laptop,Aisha,Shop1).
Sale(Book,Ben,Shop2).
Product(Phone).
Product(Laptop).
Product(Book).
Assistant(Aisha).
Assistant(Ben).
Shop(Shop1).
Shop(Shop2).
```

Answer:

```prolog
q(p,s) :- Sale(p,a,s), Assistant(a), Shop(s).
```

---

### Solution B6

**Step 1 — Identify the output variables.**

The query returns pairs:

```text
(p, s)
```

The variable `a` is body-only. It only has to be matched by some individual.

**Step 2 — Use each `Sale` atom as a candidate.**

Candidate 1:

```prolog
Sale(Phone,Aisha,Shop1)
```

This gives:

```text
p = Phone
a = Aisha
s = Shop1
```

Check the remaining atoms:

```prolog
Assistant(Aisha) is present.
Shop(Shop1) is present.
```

So output:

```text
(Phone, Shop1)
```

Candidate 2:

```prolog
Sale(Laptop,Aisha,Shop1)
```

Check:

```prolog
Assistant(Aisha) is present.
Shop(Shop1) is present.
```

So output:

```text
(Laptop, Shop1)
```

Candidate 3:

```prolog
Sale(Book,Ben,Shop2)
```

Check:

```prolog
Assistant(Ben) is present.
Shop(Shop2) is present.
```

So output:

```text
(Book, Shop2)
```

**Step 3 — Return all answer tuples.**

```text
q = {
  (Phone, Shop1),
  (Laptop, Shop1),
  (Book, Shop2)
}
```

---

## B7. Test rule entailment using the fresh-constant trick

Program `P` is:

```prolog
Mammal(x) :- Dog(x).
Animal(x) :- Mammal(x).
```

Does `P` entail the rule below?

```prolog
Animal(x) :- Dog(x).
```

Use the fresh-constant trick.

---

### Solution B7

**Step 1 — State the rule-entailment task.**

We want to know whether:

```text
P ⊨ Animal(x) :- Dog(x)
```

This means: in every model of `P`, every dog is an animal.

**Step 2 — Introduce a fresh constant.**

The rule has one variable, `x`. Introduce a fresh constant not already in `P`:

```text
c
```

**Step 3 — Add the grounded body to the program.**

The body is:

```prolog
Dog(x)
```

Ground it with `x ↦ c` and add it as a fact:

```prolog
Dog(c).
```

So compute the Herbrand model of:

```prolog
P' = P ∪ { Dog(c). }
```

**Step 4 — Derive consequences in `P'`.**

Start:

```text
X0 = { Dog(c) }
```

Using:

```prolog
Mammal(x) :- Dog(x).
```

infer:

```prolog
Mammal(c)
```

Using:

```prolog
Animal(x) :- Mammal(x).
```

infer:

```prolog
Animal(c)
```

**Step 5 — Check the grounded head.**

The grounded head is:

```prolog
Animal(c)
```

It is in `HM(P')`.

Therefore:

```text
P ⊨ Animal(x) :- Dog(x)
```

---

## B8. Rule entailment where the candidate rule is not entailed

Program `P` is:

```prolog
Mammal(x) :- Dog(x).
Animal(x) :- Mammal(x).
```

Does `P` entail the rule below?

```prolog
Dog(x) :- Animal(x).
```

Use the fresh-constant trick.

---

### Solution B8

**Step 1 — Introduce a fresh constant.**

The candidate rule has one variable `x`, so introduce:

```text
c
```

**Step 2 — Add the grounded body as a fact.**

The body is:

```prolog
Animal(x)
```

Ground it:

```prolog
Animal(c).
```

Construct:

```prolog
P' = P ∪ { Animal(c). }
```

**Step 3 — Compute consequences.**

Start:

```text
X0 = { Animal(c) }
```

Rules in `P` are:

```prolog
Mammal(x) :- Dog(x).
Animal(x) :- Mammal(x).
```

Neither rule derives `Dog(c)` from `Animal(c)`.

So the fixed point contains:

```text
Animal(c)
```

but not:

```text
Dog(c)
```

**Step 4 — Check the grounded head.**

The grounded head is:

```prolog
Dog(c)
```

It is not in `HM(P')`.

Therefore:

```text
P does not entail Dog(x) :- Animal(x).
```

**Step 5 — Interpret the failure.**

The original program says dogs are mammals and mammals are animals. It does not say every animal is a dog.

---

# Section C — Building Datalog programs from scratch

## C1. Encode a class hierarchy

Write Datalog rules for:

1. every duck is a bird;
2. every bird is an animal;
3. every animal is a living thing.

Then state what follows from the fact:

```prolog
Duck(Daffy).
```

---

### Solution C1

**Step 1 — Convert each hierarchy statement into a unary rule.**

Every duck is a bird:

```prolog
Bird(x) :- Duck(x).
```

Every bird is an animal:

```prolog
Animal(x) :- Bird(x).
```

Every animal is a living thing:

```prolog
LivingThing(x) :- Animal(x).
```

**Step 2 — Add the fact.**

```prolog
Duck(Daffy).
```

**Step 3 — Apply rules bottom-up.**

From `Duck(Daffy)` infer:

```prolog
Bird(Daffy).
```

From `Bird(Daffy)` infer:

```prolog
Animal(Daffy).
```

From `Animal(Daffy)` infer:

```prolog
LivingThing(Daffy).
```

**Step 4 — State the resulting entailments.**

```text
P ⊨ Duck(Daffy)
P ⊨ Bird(Daffy)
P ⊨ Animal(Daffy)
P ⊨ LivingThing(Daffy)
```

---

## C2. Encode domain and range rules

Write Datalog rules for the statement:

> If `owns(x,y)` holds, then `x` is a person and `y` is an inanimate object.

Then derive all consequences from:

```prolog
owns(Alice,Car).
owns(Bob,Phone).
```

---

### Solution C2

**Step 1 — Encode the domain.**

The first argument of `owns(x,y)` is a person:

```prolog
Person(x) :- owns(x,y).
```

**Step 2 — Encode the range.**

The second argument of `owns(x,y)` is an inanimate object:

```prolog
InanimateObject(y) :- owns(x,y).
```

**Step 3 — Start with the facts.**

```text
X0 = {
  owns(Alice,Car),
  owns(Bob,Phone)
}
```

**Step 4 — Apply the domain rule.**

From `owns(Alice,Car)` infer:

```prolog
Person(Alice).
```

From `owns(Bob,Phone)` infer:

```prolog
Person(Bob).
```

**Step 5 — Apply the range rule.**

From `owns(Alice,Car)` infer:

```prolog
InanimateObject(Car).
```

From `owns(Bob,Phone)` infer:

```prolog
InanimateObject(Phone).
```

**Step 6 — Final derived facts.**

```prolog
Person(Alice).
Person(Bob).
InanimateObject(Car).
InanimateObject(Phone).
```

---

## C3. Encode typing for a ternary relation

The predicate:

```prolog
Sale(product, assistant, shop)
```

is ternary. Write rules saying:

1. the first argument of `Sale` is a product;
2. the second argument is an assistant;
3. the third argument is a shop.

Then derive all type facts from:

```prolog
Sale(Phone,Aisha,Shop1).
```

---

### Solution C3

**Step 1 — Use one rule per argument position.**

First argument:

```prolog
Product(x) :- Sale(x,y,z).
```

Second argument:

```prolog
Assistant(y) :- Sale(x,y,z).
```

Third argument:

```prolog
Shop(z) :- Sale(x,y,z).
```

**Step 2 — Add the fact.**

```prolog
Sale(Phone,Aisha,Shop1).
```

**Step 3 — Apply each rule.**

Using substitution:

```text
x ↦ Phone
y ↦ Aisha
z ↦ Shop1
```

derive:

```prolog
Product(Phone).
Assistant(Aisha).
Shop(Shop1).
```

**Step 4 — Note the Datalog advantage.**

Plain Datalog can directly use a ternary predicate like `Sale/3`. Description logics such as `EL` work with unary and binary predicates, so this ternary relation is not represented directly in the same way.

---

## C4. Encode inverse and subproperty rules

Write Datalog rules for:

1. if `hasParent(x,y)`, then `isChildOf(x,y)`;
2. if `hasParent(x,y)`, then `isParentOf(y,x)`;
3. if `hasDaughter(x,y)`, then `hasChild(x,y)`.

Then derive consequences from:

```prolog
hasParent(Alice,Bob).
hasDaughter(Bob,Carol).
```

---

### Solution C4

**Step 1 — Encode same-direction implication.**

If `hasParent(x,y)` means `x` has parent `y`, then `isChildOf(x,y)` has the same argument order:

```prolog
isChildOf(x,y) :- hasParent(x,y).
```

**Step 2 — Encode the inverse.**

If `x` has parent `y`, then `y` is parent of `x`:

```prolog
isParentOf(y,x) :- hasParent(x,y).
```

**Step 3 — Encode subproperty.**

Having a daughter implies having a child. Keep the same variable order:

```prolog
hasChild(x,y) :- hasDaughter(x,y).
```

**Step 4 — Apply rules to the facts.**

From:

```prolog
hasParent(Alice,Bob)
```

infer:

```prolog
isChildOf(Alice,Bob).
isParentOf(Bob,Alice).
```

From:

```prolog
hasDaughter(Bob,Carol)
```

infer:

```prolog
hasChild(Bob,Carol).
```

**Step 5 — Avoid the common variable-order bug.**

Do not accidentally write:

```prolog
hasChild(y,x) :- hasDaughter(x,y).
```

unless the intended meaning really swaps the argument order. The lecture explicitly flags this kind of variable-order issue.

---

## C5. Encode a non-tree relational pattern

Write a Datalog rule for:

> `x` is a bicycle if `x` has two wheel parts `y` and `z`, has a frame part `f`, both `y` and `z` are wheels, `f` is a frame, and both wheels are connected to the frame.

Then explain one limitation of the rule if plain Datalog has no inequality predicate.

---

### Solution C5

**Step 1 — Identify the head.**

The derived fact is:

```prolog
Bicycle(x)
```

**Step 2 — Add part relations.**

`x` has parts `y`, `z`, and `f`:

```prolog
hasPart(x,y), hasPart(x,z), hasPart(x,f)
```

**Step 3 — Add type conditions.**

```prolog
Wheel(y), Wheel(z), Frame(f)
```

**Step 4 — Add connection conditions.**

```prolog
connectedTo(y,f), connectedTo(z,f)
```

**Step 5 — Combine into one rule.**

```prolog
Bicycle(x) :- hasPart(x,y), hasPart(x,z), hasPart(x,f),
              Wheel(y), Wheel(z), Frame(f),
              connectedTo(y,f), connectedTo(z,f).
```

**Step 6 — State the important limitation.**

This rule does not force `y` and `z` to be different wheels. Without an inequality predicate such as `y != z`, Datalog may satisfy both wheel positions using the same individual.

If inequality is available as an extension, one could add:

```prolog
y != z
```

as a body condition. But plain Datalog in the lecture does not rely on such built-in comparisons.

---

## C6. Build and compute a recursive relation

Use Datalog to define `Ancestor(x,y)` as the transitive closure of `Parent(x,y)`:

1. a parent is an ancestor;
2. if `x` is parent of `z` and `z` is ancestor of `y`, then `x` is ancestor of `y`.

Then compute all ancestors from:

```prolog
Parent(Alice,Bob).
Parent(Bob,Carol).
Parent(Carol,Dina).
```

---

### Solution C6

**Step 1 — Write the base rule.**

A direct parent is an ancestor:

```prolog
Ancestor(x,y) :- Parent(x,y).
```

**Step 2 — Write the recursive rule.**

If `x` is parent of `z`, and `z` is ancestor of `y`, then `x` is ancestor of `y`:

```prolog
Ancestor(x,y) :- Parent(x,z), Ancestor(z,y).
```

**Step 3 — Start with the parent facts.**

```text
X0 = {
  Parent(Alice,Bob),
  Parent(Bob,Carol),
  Parent(Carol,Dina)
}
```

**Step 4 — Apply the base rule.**

Infer:

```prolog
Ancestor(Alice,Bob).
Ancestor(Bob,Carol).
Ancestor(Carol,Dina).
```

**Step 5 — Apply the recursive rule once.**

Use:

```prolog
Parent(Alice,Bob), Ancestor(Bob,Carol)
```

infer:

```prolog
Ancestor(Alice,Carol).
```

Use:

```prolog
Parent(Bob,Carol), Ancestor(Carol,Dina)
```

infer:

```prolog
Ancestor(Bob,Dina).
```

**Step 6 — Apply the recursive rule again.**

Use:

```prolog
Parent(Alice,Bob), Ancestor(Bob,Dina)
```

infer:

```prolog
Ancestor(Alice,Dina).
```

**Step 7 — Stop at fixed point.**

No more ancestor facts can be derived.

All derived `Ancestor` facts are:

```prolog
Ancestor(Alice,Bob).
Ancestor(Bob,Carol).
Ancestor(Carol,Dina).
Ancestor(Alice,Carol).
Ancestor(Bob,Dina).
Ancestor(Alice,Dina).
```

---

## C7. Build a Datalog query over derived facts

Suppose the program contains:

```prolog
Product(x) :- Sale(x,y,z).
Assistant(y) :- Sale(x,y,z).
Shop(z) :- Sale(x,y,z).

Sale(Phone,Aisha,Shop1).
Sale(Book,Ben,Shop2).
Sale(Laptop,Aisha,Shop1).
```

Write a conjunctive query returning all products sold by `Aisha`, then answer it.

---

### Solution C7

**Step 1 — Identify the output variable.**

We want products, so use output variable `p`:

```prolog
q(p)
```

**Step 2 — Encode the condition.**

A product sold by Aisha appears in a `Sale` fact with second argument `Aisha`:

```prolog
Sale(p,Aisha,s)
```

The shop variable `s` is body-only.

**Step 3 — Write the query.**

```prolog
q(p) :- Sale(p,Aisha,s).
```

**Step 4 — Match against facts.**

Facts with `Aisha` as second argument:

```prolog
Sale(Phone,Aisha,Shop1).
Sale(Laptop,Aisha,Shop1).
```

So:

```text
p = Phone
p = Laptop
```

**Step 5 — Return the answers.**

```text
q = { Phone, Laptop }
```

---

# Section D — Hard edge cases and method-breaking cases

## D1. Unsafe head variable vs allowed body-only variable

For each rule, decide whether it is allowed in plain Datalog. Then explain the difference.

```prolog
R1: Happy(x) :- Person(x), hasParent(x,y).
R2: hasParent(x,y) :- Person(x).
```

---

### Solution D1

**Step 1 — Recall the safety rule.**

Every head variable must occur in the body.

Body-only variables are allowed. Head-only variables are not allowed.

**Step 2 — Check `R1`.**

```prolog
Happy(x) :- Person(x), hasParent(x,y).
```

Head variables:

```text
x
```

Body variables:

```text
x, y
```

Every head variable occurs in the body. The variable `y` occurs only in the body, and that is fine.

```text
R1 is allowed.
```

It means: if `x` is a person and has some named parent `y`, then `x` is happy.

**Step 3 — Check `R2`.**

```prolog
hasParent(x,y) :- Person(x).
```

Head variables:

```text
x, y
```

Body variables:

```text
x
```

The variable `y` occurs in the head but not in the body.

```text
R2 is not allowed.
```

**Step 4 — Explain the conceptual difference.**

`R1` uses `y` as a witness already found in the active domain through `hasParent(x,y)`.

`R2` would require Datalog to invent a new parent `y` just because `Person(x)` holds. Plain Datalog cannot create anonymous individuals.

---

## D2. Active-domain failure: why Datalog cannot infer an unnamed parent

Program `P` contains:

```prolog
Person(Alice).
```

Can plain Datalog express and use the rule:

```text
Every person has a parent.
```

so that `hasParent(Alice, something)` is entailed?

---

### Solution D2

**Step 1 — Try the tempting rule.**

The natural-looking rule is:

```prolog
hasParent(x,y) :- Person(x).
```

**Step 2 — Check safety.**

Head variables:

```text
x, y
```

Body variables:

```text
x
```

The variable `y` is in the head but not in the body.

So the rule is unsafe and not allowed in plain Datalog.

**Step 3 — Try a function-term workaround.**

One might try:

```prolog
hasParent(x,motherOf(x)) :- Person(x).
```

But plain Datalog does not allow function terms like `motherOf(x)`.

**Step 4 — Use active-domain reasoning.**

The only named individual in the program is:

```text
Alice
```

Plain Datalog reasons over named individuals in the active domain. It cannot create a new anonymous parent.

**Step 5 — Conclude.**

Plain Datalog cannot express the existential statement:

```text
Every person has some parent.
```

This is something description logic can express with an existential restriction, but plain Datalog cannot.

---

## D3. Repeated variables in a query

Let `HM(P)` contain:

```prolog
Edge(a,a).
Edge(a,b).
Edge(b,c).
Node(a).
Node(b).
Node(c).
```

Answer:

```prolog
q(x) :- Node(x), Edge(x,x).
```

---

### Solution D3

**Step 1 — Notice the repeated variable.**

The atom:

```prolog
Edge(x,x)
```

requires both arguments of `Edge` to be the same individual.

**Step 2 — Test `x = a`.**

Need:

```prolog
Node(a)
Edge(a,a)
```

Both are present.

So `a` is an answer.

**Step 3 — Test `x = b`.**

Need:

```prolog
Node(b)
Edge(b,b)
```

`Node(b)` is present, but `Edge(b,b)` is not.

So `b` is not an answer.

**Step 4 — Test `x = c`.**

Need:

```prolog
Node(c)
Edge(c,c)
```

`Node(c)` is present, but `Edge(c,c)` is not.

So `c` is not an answer.

**Step 5 — Return the query result.**

```text
q = { a }
```

---

## D4. No disjunction in rule heads

Can plain Datalog express the statement below directly?

> Every student is either an undergraduate student or a postgraduate student.

Consider the tempting rule:

```prolog
UGStudent(x) v PGTStudent(x) :- Student(x).
```

---

### Solution D4

**Step 1 — Recall the shape of a plain Datalog rule.**

A plain Datalog rule has one atom in the head:

```prolog
Head :- Body.
```

**Step 2 — Inspect the tempting rule.**

```prolog
UGStudent(x) v PGTStudent(x) :- Student(x).
```

The head contains a disjunction:

```prolog
UGStudent(x) v PGTStudent(x)
```

That is not a single atom.

**Step 3 — Conclude for plain Datalog.**

Plain Datalog cannot express this directly.

**Step 4 — Name the relevant extension.**

This belongs to disjunctive Datalog, where rule heads may contain disjunctions.

---

## D5. Negation as failure and non-monotonicity

Consider Datalog with negation as failure:

```prolog
UGStudent(x) :- Student(x), not PGTStudent(x).
Student(Bob).
```

1. What is inferred about `Bob`?
2. What happens after adding the fact below?

```prolog
PGTStudent(Bob).
```

3. Why is this non-monotonic?

---

### Solution D5

**Step 1 — Evaluate the original program.**

Facts:

```prolog
Student(Bob).
```

Rule:

```prolog
UGStudent(x) :- Student(x), not PGTStudent(x).
```

For `x = Bob`, the body asks for:

```prolog
Student(Bob)
not PGTStudent(Bob)
```

`Student(Bob)` is known.

`PGTStudent(Bob)` is not known or entailed.

Under negation as failure, `not PGTStudent(Bob)` succeeds.

So infer:

```prolog
UGStudent(Bob).
```

**Step 2 — Add new information.**

Now add:

```prolog
PGTStudent(Bob).
```

**Step 3 — Re-evaluate the default rule.**

For `x = Bob`, the body is:

```prolog
Student(Bob), not PGTStudent(Bob)
```

Now `PGTStudent(Bob)` is known, so `not PGTStudent(Bob)` fails.

Therefore `UGStudent(Bob)` is no longer inferred from this rule.

**Step 4 — Explain non-monotonicity.**

A logic is monotonic if adding more facts never removes old entailments.

Here, before adding `PGTStudent(Bob)`, we inferred:

```prolog
UGStudent(Bob)
```

After adding `PGTStudent(Bob)`, that conclusion is withdrawn.

So negation as failure is non-monotonic.

**Step 5 — Contrast with plain Datalog.**

Plain Datalog has no negation as failure and is monotonic: adding facts can produce more consequences but cannot invalidate previous ones.

---

## D6. Complexity edge case: bounded vs unbounded arity

A Datalog program has:

```text
m = 10 named individuals
p = 4 predicates
maximum arity n = 2
```

Another family of programs has:

```text
m = 10 named individuals
p = 1 predicate
maximum arity n = input size k
```

Compare the Herbrand-base size bounds.

---

### Solution D6

**Step 1 — Recall the bound.**

The lecture gives the bound:

```text
|HB(P)| ≤ p · m^n
```

where:

- `p` is number of predicates;
- `m` is number of individuals;
- `n` is maximum predicate arity.

**Step 2 — Compute the bounded-arity case.**

Here:

```text
p = 4
m = 10
n = 2
```

So:

```text
p · m^n = 4 · 10^2 = 4 · 100 = 400
```

This is polynomial and small when arity is fixed.

**Step 3 — Compute the unbounded-arity family.**

Here:

```text
p = 1
m = 10
n = k
```

So:

```text
p · m^n = 1 · 10^k = 10^k
```

**Step 4 — Interpret the difference.**

If `k` grows with the input, then `10^k` is exponential in `k`.

So Datalog's polynomial-size Herbrand base/model guarantee depends critically on bounded predicate arity.

---

## D7. Fresh-constant rule entailment with recursion

Program `P` is:

```prolog
Ancestor(x,y) :- Parent(x,y).
Ancestor(x,y) :- Parent(x,z), Ancestor(z,y).
```

Does `P` entail the rule:

```prolog
Ancestor(x,z) :- Parent(x,y), Parent(y,z).
```

Use the fresh-constant trick.

---

### Solution D7

**Step 1 — Identify variables in the candidate rule.**

The rule is:

```prolog
Ancestor(x,z) :- Parent(x,y), Parent(y,z).
```

Variables:

```text
x, y, z
```

**Step 2 — Introduce fresh constants.**

Use:

```text
cx, cy, cz
```

**Step 3 — Add the grounded body as facts.**

Ground the body:

```prolog
Parent(cx,cy).
Parent(cy,cz).
```

Construct:

```prolog
P' = P ∪ { Parent(cx,cy), Parent(cy,cz) }
```

**Step 4 — Compute consequences.**

From the base rule:

```prolog
Ancestor(x,y) :- Parent(x,y).
```

derive:

```prolog
Ancestor(cx,cy).
Ancestor(cy,cz).
```

Now use the recursive rule:

```prolog
Ancestor(x,y) :- Parent(x,z), Ancestor(z,y).
```

Choose substitution:

```text
x ↦ cx
z ↦ cy
y ↦ cz
```

The body becomes:

```prolog
Parent(cx,cy), Ancestor(cy,cz)
```

Both are present, so derive:

```prolog
Ancestor(cx,cz).
```

**Step 5 — Check the grounded head.**

The grounded head of the candidate rule is:

```prolog
Ancestor(cx,cz)
```

It is in `HM(P')`.

Therefore:

```text
P ⊨ Ancestor(x,z) :- Parent(x,y), Parent(y,z).
```

---

## D8. Entailment does not mean the converse holds

Program `P` is:

```prolog
Ancestor(x,y) :- Parent(x,y).
Ancestor(x,y) :- Parent(x,z), Ancestor(z,y).
```

Does `P` entail?

```prolog
Parent(x,y) :- Ancestor(x,y).
```

Use the fresh-constant trick.

---

### Solution D8

**Step 1 — Introduce fresh constants.**

The candidate rule has variables `x` and `y`. Use fresh constants:

```text
cx, cy
```

**Step 2 — Add the grounded body.**

The body is:

```prolog
Ancestor(x,y)
```

Ground it:

```prolog
Ancestor(cx,cy).
```

Construct:

```prolog
P' = P ∪ { Ancestor(cx,cy). }
```

**Step 3 — Compute consequences.**

The program has rules deriving `Ancestor` from `Parent`, but no rule deriving `Parent` from `Ancestor`.

Starting with:

```text
X0 = { Ancestor(cx,cy) }
```

No rule derives:

```prolog
Parent(cx,cy)
```

**Step 4 — Check the grounded head.**

The grounded head is:

```prolog
Parent(cx,cy)
```

It is not in `HM(P')`.

Therefore:

```text
P does not entail Parent(x,y) :- Ancestor(x,y).
```

**Step 5 — Interpret.**

Every parent link is an ancestor link, but not every ancestor link is necessarily a direct parent link.

---

## D9. Guardedness check for Datalog±-style rules

For each rule, decide whether all universally quantified variables occur together in a single body atom.

```prolog
R1: hasParent(x,y) :- Person(x).
R2: R(x,y) :- S(x,z), T(z,y).
R3: Good(x,y,z) :- BigAtom(x,y,z), Other(x), More(y,z).
```

Treat head-only variables in existential-style rules as existential variables when relevant.

---

### Solution D9

**Step 1 — Recall the guardedness discriminator.**

A rule is guarded if all universally quantified variables occur together in one body atom.

For existential-style rules, variables that appear only in the head are treated as existential, not universal.

**Step 2 — Check `R1`.**

```prolog
hasParent(x,y) :- Person(x).
```

Universal body variable:

```text
x
```

The head-only variable `y` is existential in the Datalog± reading.

The body atom:

```prolog
Person(x)
```

contains all universal variables, namely `x`.

```text
R1 is guarded in the Datalog± sense.
```

It is not a valid plain Datalog rule, but it is the kind of existential rule Datalog± is designed to handle under restrictions.

**Step 3 — Check `R2`.**

```prolog
R(x,y) :- S(x,z), T(z,y).
```

Universal variables:

```text
x, y, z
```

Body atoms:

```prolog
S(x,z)   contains x,z
T(z,y)   contains z,y
```

No single body atom contains `x`, `y`, and `z` together.

```text
R2 is not guarded.
```

**Step 4 — Check `R3`.**

```prolog
Good(x,y,z) :- BigAtom(x,y,z), Other(x), More(y,z).
```

Universal variables:

```text
x, y, z
```

The body atom:

```prolog
BigAtom(x,y,z)
```

contains all three universal variables.

```text
R3 is guarded.
```

---

## D10. Datalog vs description logic: choose the better fit

For each statement, say whether it is naturally expressible in plain Datalog, description logic, both, or neither in their plain lecture versions.

1. Every bird is an animal.
2. Every person has some parent, possibly unnamed.
3. A bicycle has two wheels and a frame connected in a graph-like pattern.
4. A sale involves a product, assistant, and shop as a ternary relation.
5. Students are undergraduate or postgraduate students.

---

### Solution D10

**Step 1 — Statement 1: every bird is an animal.**

Datalog:

```prolog
Animal(x) :- Bird(x).
```

Description logic:

```text
Bird ⊑ Animal
```

```text
Answer: both.
```

**Step 2 — Statement 2: every person has some parent, possibly unnamed.**

Description logic can express anonymous existence:

```text
Person ⊑ ∃hasParent.⊤
```

Plain Datalog cannot express this because it would need a fresh head variable:

```prolog
hasParent(x,y) :- Person(x).
```

which is unsafe.

```text
Answer: description logic, not plain Datalog.
```

**Step 3 — Statement 3: bicycle graph-like part structure.**

Datalog can express a rule connecting variables in an arbitrary body pattern:

```prolog
Bicycle(x) :- hasPart(x,y), hasPart(x,z), hasPart(x,f),
              Wheel(y), Wheel(z), Frame(f),
              connectedTo(y,f), connectedTo(z,f).
```

Description logic can express tree-shaped anonymous part existence, but not this same arbitrary internal graph among the parts in plain `EL` style.

```text
Answer: Datalog is the natural fit over named individuals.
```

**Step 4 — Statement 4: ternary sale relation.**

Datalog allows higher-arity predicates:

```prolog
Sale(product, assistant, shop)
```

Lecture-style `EL` description logic uses unary and binary predicates, so this ternary predicate is not direct.

```text
Answer: Datalog is the natural fit.
```

**Step 5 — Statement 5: students are undergraduate or postgraduate.**

This requires disjunction:

```prolog
UGStudent(x) v PGTStudent(x) :- Student(x).
```

Plain Datalog has no disjunctive heads. Plain `EL` also lacks full disjunction.

```text
Answer: neither in the plain lecture versions; use an extension such as disjunctive Datalog or a more expressive DL.
```

---

## D11. Non-recursive vs recursive Datalog as database queries

For each program, say whether the lecture's simple SQL-translation story applies directly, or whether recursion is involved.

Program A:

```prolog
Person(x) :- owns(x,y).
InObj(y) :- owns(x,y).
```

Program B:

```prolog
Related(x,y) :- Parent(x,y).
Related(x,y) :- Related(y,x).
Related(x,y) :- Related(x,z), Related(z,y).
```

---

### Solution D11

**Step 1 — Check Program A for recursion.**

Program A:

```prolog
Person(x) :- owns(x,y).
InObj(y) :- owns(x,y).
```

Neither rule refers to `Person` or `InObj` in its own body, directly or indirectly.

So Program A is non-recursive.

The lecture states that non-recursive Datalog can be translated into SQL queries over the ground facts.

```text
Program A: simple SQL-translation story applies directly.
```

**Step 2 — Check Program B for recursion.**

Program B:

```prolog
Related(x,y) :- Parent(x,y).
Related(x,y) :- Related(y,x).
Related(x,y) :- Related(x,z), Related(z,y).
```

The predicate `Related` appears in the body of rules that also derive `Related`.

So Program B is recursive.

**Step 3 — State the implication.**

Recursive Datalog is exactly where Datalog is powerful for transitive/symmetric closure. But it is not handled by the simple non-recursive SQL translation story.

The lecture notes that recursive queries need special support, such as recursive query mechanisms or Common Table Expressions.

```text
Program B: recursion is involved; needs recursive-query support or a Datalog engine.
```

---

## D12. Spot an incomplete Herbrand model

A program is:

```prolog
A(a).
B(x) :- A(x).
C(x) :- B(x).
```

Someone claims:

```prolog
HM(P) = { A(a), B(a) }
```

Is this correct?

---

### Solution D12

**Step 1 — Start from the facts.**

```text
X0 = { A(a) }
```

**Step 2 — Apply the first rule.**

```prolog
B(x) :- A(x).
```

Since `A(a)` holds, infer:

```prolog
B(a)
```

```text
X1 = { A(a), B(a) }
```

**Step 3 — Apply the second rule.**

```prolog
C(x) :- B(x).
```

Since `B(a)` holds, infer:

```prolog
C(a)
```

```text
X2 = { A(a), B(a), C(a) }
```

**Step 4 — Check fixed point.**

No further atoms can be added.

So:

```prolog
HM(P) = { A(a), B(a), C(a) }
```

**Step 5 — Diagnose the claimed model.**

The claimed set:

```prolog
{ A(a), B(a) }
```

is not closed under the rule:

```prolog
C(x) :- B(x).
```

Therefore it is not a Herbrand model.

---

# Section E — Mixed exam-style worked problems

## E1. Full mini-program: syntax, safety, fixed point, entailment, query

Consider program `P`:

```prolog
Course(Logic).
Course(ML).
Student(Alice).
Student(Bob).
Enrolled(Alice,Logic).
Enrolled(Bob,ML).
Difficult(Logic).

Busy(x) :- Student(x), Enrolled(x,c), Difficult(c).
NeedsSupport(x) :- Busy(x).
```

Answer all parts:

1. Are both rules safe?
2. Compute `HM(P)`.
3. Does `P ⊨ NeedsSupport(Alice)`?
4. Does `P ⊨ NeedsSupport(Bob)`?
5. Answer `q(x) :- Student(x), Enrolled(x,c), Course(c).`

---

### Solution E1

**Step 1 — Check safety of the first rule.**

```prolog
Busy(x) :- Student(x), Enrolled(x,c), Difficult(c).
```

Head variables:

```text
x
```

Body variables:

```text
x, c
```

Every head variable appears in the body.

```text
Rule 1 is safe.
```

**Step 2 — Check safety of the second rule.**

```prolog
NeedsSupport(x) :- Busy(x).
```

Head variable:

```text
x
```

Body variable:

```text
x
```

```text
Rule 2 is safe.
```

**Step 3 — Start the fixed point with facts.**

```text
X0 = {
  Course(Logic),
  Course(ML),
  Student(Alice),
  Student(Bob),
  Enrolled(Alice,Logic),
  Enrolled(Bob,ML),
  Difficult(Logic)
}
```

**Step 4 — First iteration: derive `Busy`.**

For `Alice`:

```prolog
Student(Alice), Enrolled(Alice,Logic), Difficult(Logic)
```

all hold, so infer:

```prolog
Busy(Alice)
```

For `Bob`:

```prolog
Student(Bob), Enrolled(Bob,ML), Difficult(ML)
```

`Difficult(ML)` is not present, so do not infer `Busy(Bob)`.

```text
X1 = X0 ∪ { Busy(Alice) }
```

**Step 5 — Second iteration: derive `NeedsSupport`.**

Rule:

```prolog
NeedsSupport(x) :- Busy(x).
```

Since `Busy(Alice)` is in `X1`, infer:

```prolog
NeedsSupport(Alice)
```

```text
X2 = X1 ∪ { NeedsSupport(Alice) }
```

No further atoms can be derived.

**Step 6 — State `HM(P)`.**

```prolog
HM(P) = {
  Course(Logic),
  Course(ML),
  Student(Alice),
  Student(Bob),
  Enrolled(Alice,Logic),
  Enrolled(Bob,ML),
  Difficult(Logic),
  Busy(Alice),
  NeedsSupport(Alice)
}
```

**Step 7 — Test ground entailments.**

`NeedsSupport(Alice)` is in `HM(P)`:

```text
P ⊨ NeedsSupport(Alice): yes
```

`NeedsSupport(Bob)` is not in `HM(P)`:

```text
P ⊨ NeedsSupport(Bob): no
```

**Step 8 — Answer the conjunctive query.**

Query:

```prolog
q(x) :- Student(x), Enrolled(x,c), Course(c).
```

For Alice:

```prolog
Student(Alice), Enrolled(Alice,Logic), Course(Logic)
```

all hold, so `Alice` is an answer.

For Bob:

```prolog
Student(Bob), Enrolled(Bob,ML), Course(ML)
```

all hold, so `Bob` is an answer.

```text
q = { Alice, Bob }
```

---

## E2. Full mini-program with recursion and a query

Program `P`:

```prolog
Road(a,b).
Road(b,c).
Road(c,d).
Reach(x,y) :- Road(x,y).
Reach(x,y) :- Road(x,z), Reach(z,y).
```

1. Compute all `Reach` facts.
2. Answer `q(y) :- Reach(a,y).`
3. Does `P ⊨ Reach(a,d)`?
4. Does `P ⊨ Reach(d,a)`?

---

### Solution E2

**Step 1 — Start from the road facts.**

```text
X0 = {
  Road(a,b),
  Road(b,c),
  Road(c,d)
}
```

**Step 2 — Apply the base reachability rule.**

```prolog
Reach(x,y) :- Road(x,y).
```

Derive:

```prolog
Reach(a,b).
Reach(b,c).
Reach(c,d).
```

**Step 3 — Apply the recursive rule for paths of length 2.**

Rule:

```prolog
Reach(x,y) :- Road(x,z), Reach(z,y).
```

Using:

```prolog
Road(a,b), Reach(b,c)
```

infer:

```prolog
Reach(a,c).
```

Using:

```prolog
Road(b,c), Reach(c,d)
```

infer:

```prolog
Reach(b,d).
```

**Step 4 — Apply the recursive rule for paths of length 3.**

Using:

```prolog
Road(a,b), Reach(b,d)
```

infer:

```prolog
Reach(a,d).
```

**Step 5 — Stop at fixed point.**

No more `Reach` atoms can be derived.

All `Reach` facts:

```prolog
Reach(a,b).
Reach(b,c).
Reach(c,d).
Reach(a,c).
Reach(b,d).
Reach(a,d).
```

**Step 6 — Answer `q(y) :- Reach(a,y)`.**

Facts with first argument `a`:

```prolog
Reach(a,b)
Reach(a,c)
Reach(a,d)
```

So:

```text
q = { b, c, d }
```

**Step 7 — Test `Reach(a,d)`.**

`Reach(a,d)` is in the computed model.

```text
P ⊨ Reach(a,d): yes
```

**Step 8 — Test `Reach(d,a)`.**

There is no road out of `d`, and no rule makes roads symmetric.

`Reach(d,a)` is not in the model.

```text
P ⊨ Reach(d,a): no
```

---

## E3. Diagnose expressivity and choose an extension

For each requirement, say whether plain Datalog can express it. If not, name the relevant extension or alternative from the lecture.

1. Infer `Adult(x)` when `Person(x)` and `age(x,n)` and `n >= 18`.
2. Infer `Related(x,y)` as the transitive closure of parent links.
3. Infer that every person has some unnamed parent.
4. Infer `UGStudent(x)` when `Student(x)` and there is no evidence that `x` is a postgraduate student.
5. Infer `UGStudent(x)` or `PGTStudent(x)` from `Student(x)` without choosing which one.

---

### Solution E3

**Step 1 — Requirement 1: age comparison.**

This needs data types and comparisons such as `>=`.

Plain Datalog in the lecture does not include built-in numeric comparisons.

```text
Plain Datalog: not in the basic version.
Relevant extension: Datalog with data types/comparisons.
```

**Step 2 — Requirement 2: transitive closure.**

Datalog supports recursion:

```prolog
Related(x,y) :- Parent(x,y).
Related(x,y) :- Parent(x,z), Related(z,y).
```

```text
Plain Datalog: yes.
```

**Step 3 — Requirement 3: unnamed parent.**

This requires an existential/anonymous individual:

```text
Person(x) ⇒ ∃y hasParent(x,y)
```

Plain Datalog cannot introduce fresh head variables.

```text
Plain Datalog: no.
Relevant alternative/extension: description logic existential restriction or guarded Datalog±-style existential rules.
```

**Step 4 — Requirement 4: default undergraduate.**

This requires negation as failure:

```prolog
UGStudent(x) :- Student(x), not PGTStudent(x).
```

```text
Plain Datalog: no.
Relevant extension: Datalog with negation as failure / stable-model-style semantics.
```

**Step 5 — Requirement 5: undergraduate or postgraduate.**

This requires a disjunctive rule head:

```prolog
UGStudent(x) v PGTStudent(x) :- Student(x).
```

```text
Plain Datalog: no.
Relevant extension: disjunctive Datalog.
```

---

## E4. Explain why computing the whole model can be wasteful

Program `P` contains 10,000 facts and many rules defining derived relations. You only need to answer:

```prolog
P ⊨ Target(a)?
```

The naive method computes all of `HM(P)` first. Explain why this is correct but potentially wasteful, and name the more focused idea mentioned in the lecture.

---

### Solution E4

**Step 1 — State why the naive method is correct.**

For any ground atom `α`, the lecture theorem says:

```text
P ⊨ α  iff  α ∈ HM(P)
```

So to decide:

```prolog
P ⊨ Target(a)
```

we can compute `HM(P)` and check whether `Target(a)` is a member.

**Step 2 — State why it can be wasteful.**

Computing `HM(P)` derives every ground atomic consequence of the program, not just consequences relevant to `Target(a)`.

If the program has many unrelated predicates and facts, most derived atoms may be irrelevant to the query.

**Step 3 — Name the focused idea.**

The lecture mentions that a more goal-directed reasoner can work backwards or focus on substitutions/rules that have a chance of proving the target.

**Step 4 — Link to the fixed-point optimisation.**

Even in bottom-up reasoning, one optimisation is not to blindly try every substitution. Instead, focus on substitutions whose body atoms are already present in the current set `X`.

So the naive full-model method is semantically clean but operationally inefficient for single-query answering.

---

# Final exam checklist from this bank

Before the exam, make sure you can do these without looking:

- Parse any Datalog rule into head/body/variables/predicates.
- Check safety by looking for head-only variables.
- Convert a rule into a universal implication and Horn clause.
- Apply a substitution consistently, especially with repeated variables.
- Construct/count the Herbrand base.
- Compute a Herbrand model by bottom-up fixed-point iteration.
- Use `P ⊨ α iff α ∈ HM(P)` for ground entailment.
- Answer conjunctive queries by matching body atoms in `HM(P)`.
- Test rule entailment using fresh constants.
- Build rules for hierarchies, domain/range, higher-arity relations, inverses, non-tree structures, and recursion.
- Recognise when plain Datalog breaks: anonymous individuals, function terms, disjunction, negation, data types/comparisons.
- Explain monotonic vs non-monotonic reasoning.
- State why bounded predicate arity matters for polynomial reasoning.
- Compare Datalog with description logic: active domain/general relational structure/recursion vs anonymous tree-shaped existential structure.
