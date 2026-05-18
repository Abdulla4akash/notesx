---
subject: COMP64602
chapter: 4
title: "Week 4"
language: bn
---

# COMP64602 স্টাডি নোট: Logic, Intelligent Agents, এবং Multi-Agent Organisation

**বিষয় ও পরিসর:** এই রিভিশন প্যাকটিতে COMP64602-এর ছয়টি লেকচার-জোড়া কভার করা হয়েছে, এবং আপলোড করা স্লাইড ও ট্রান্সক্রিপ্ট—দুটিই ব্যবহার করা হয়েছে: First Order Logic, Intelligent Agents, Logic-Based Agents, BDI Agents, Organisations and Roles, এবং Institutions and Norms।

**ব্যবহৃত উৎস উপকরণ:**

- `First Order Logic-English (1).txt` এবং `FOL.pdf`
- `Intelligent_Agents_Video1-English (1).txt` এবং `Video1.pdf`
- `LogicBasedAgentsFinal-English (1).txt` এবং `LogicBasedAgents.pdf`
- `BDI-English (1).txt` এবং `BDI.pdf`
- `Organisations-English (1).txt` এবং `organisations.pdf`
- `Institutions-English (1).txt` এবং `intitutions.pdf`

---

## সামগ্রিক পরীক্ষা-সংকেত

**পরীক্ষা-সংকেত — First Order Logic:** লেকচারার স্পষ্টভাবে বলেছেন First Order Logic **সরাসরি পরীক্ষাযোগ্য নয়**; কিন্তু পরবর্তী অনেক উপাদান FOL syntax এবং কিছু semantics জানা আছে ধরে নেয়। তাই পরীক্ষাযোগ্য অংশ বুঝতে এটি প্রয়োজনীয় ব্যাকগ্রাউন্ড জ্ঞান হিসেবে ধরতে হবে।

**পরীক্ষা-সংকেত — BDI:** লেকচারার পরীক্ষার জন্য স্পষ্ট “take-home message” দিয়েছেন: BDI systems-এর মূল construct হলো **beliefs**, **goals/desires**, এবং **intentions**; তবে নির্দিষ্ট workflow ভাষা/সিস্টেম অনুযায়ী বদলায়। লেকচারারের নিজের সিস্টেমের workflow পরীক্ষাযোগ্য হবে শুধু তখনই, যদি পরে সেটিকে exemplar হিসেবে ব্যবহার করা হয়।

---

# ১. First Order Logic

## বিষয় ও পরিসর

এই লেকচারটি **First Order Logic**-এর একটি দ্রুত ব্যাকগ্রাউন্ড ট্যুর দেয়। ফোকাস: syntax, semantics, models, quantifiers, free/bound variables, এবং minimal models। এটি Datalog, description logics, এবং knowledge representation/reasoning-এর আগের উপাদানের সঙ্গে যুক্ত, এবং পরবর্তী agent-সংক্রান্ত উপাদানের জন্য ব্যাকগ্রাউন্ড ধরে নেওয়া হয়।

## কোর্সে এর অবস্থান

লেকচারার বলেছেন First Order Logic **আসলে পরীক্ষাযোগ্য নয়**, কিন্তু পরবর্তী অনেক topic ধরে নেয় যে আপনি অন্তত এর syntax এবং কিছু semantics-এর সঙ্গে পরিচিত। লেকচারটি Russell and Norvig Chapter 8-ও উল্লেখ করে, তবে বলে যে Russell and Norvig একটি non-standard syntax ব্যবহার করে।

## First Order Logic-এর syntax

### Terms

**Intuition:**  
একটি term হলো এমন expression যা আলোচ্য domain-এর কোনো object-কে refer করে, অথবা কোনো object compute করে।

**লেকচারের definition:**  
First order logic-এ একটি term হতে পারে:

- একটি **constant**, যেমন  
  $$a, b, c, dog, cat, peter, jane, robot$$

  Constants সাধারণত নির্দিষ্ট object বোঝায়, যেমন dog, cat, Peter, Jane, বা robot।

- একটি **variable**, যেমন  
  $$v_1, v_2, \ldots, v_n$$

  Variables এমন object-এর জায়গা নেয় যা vary করতে পারে।

- যথাযথ সংখ্যক constants এবং variables-এর ওপর প্রয়োগ করা একটি **function symbol**, যেমন:

  $$owner(dog)$$

  $$height(peter)$$

  $$child(peter,jane)$$

**Function symbols:**  
একটি function কোনো object, অথবা object-এর একটি set-কে অন্য কোনো object-এ map করে।

লেকচারের উদাহরণ:

- $$owner(dog)$$ কোনো person নির্দেশ করে।
- $$height(peter)$$ কোনো number নির্দেশ করে।
- $$child(peter,jane)$$ কোনো person নির্দেশ করে।

**আগের উপাদানের সঙ্গে connection:**  
লেকচারার বলেছেন এটি গত semester থেকে পরিচিত হওয়া উচিত, বিশেষ করে constants ও variables-এর পার্থক্য এবং arity / n-ary function symbol-এর ধারণা।

[UNCLEAR / অস্পষ্ট] ট্রান্সক্রিপ্টে “entry function symbol” বলা হয়েছে; এটি প্রায় নিশ্চিতভাবে “n-ary function symbol”।

---

## Formulae

### Simple formulae

**Intuition:**  
একটি simple formula বলে যে কিছু term-এর ক্ষেত্রে একটি predicate সত্য।

**লেকচারের definition:**  
একটি formula হতে পারে যথাযথ সংখ্যক terms-এর ওপর প্রয়োগ করা একটি **predicate symbol**।

Predicate উদাহরণ:

$$well\_behaved$$

$$taller\_than$$

$$postman$$

Formula উদাহরণ:

$$well\_behaved(dog)$$

অর্থ: dog টি well behaved।

$$taller\_than(owner(dog), peter)$$

অর্থ: dog-এর owner Peter-এর চেয়ে taller।

$$postman(v_1)$$

অর্থ: $v_1$ একজন postman।

লেকচারার একটি গুরুত্বপূর্ণ distinction জোর দিয়ে বলেছেন: একটি **simple formula** হলো কিছু সংখ্যক terms-এর ওপর প্রয়োগ করা একটি predicate।

---

### Complex formulae

Complex formulae simpler formulae থেকে logical connectives ব্যবহার করে তৈরি হয়।

#### Negation

$$\neg well\_behaved(dog)$$

অর্থ: dog টি well behaved নয়।

#### Conjunction

$$well\_behaved(dog) \land taller\_than(owner(dog), peter)$$

অর্থ: dog টি well behaved **এবং** dog-এর owner Peter-এর চেয়ে taller।

#### Disjunction

$$well\_behaved(dog) \lor taller\_than(owner(dog), peter)$$

অর্থ: dog টি well behaved **অথবা** dog-এর owner Peter-এর চেয়ে taller।

[UNCLEAR / অস্পষ্ট] ট্রান্সক্রিপ্টে “distinction” বলা হয়েছে, কিন্তু slide ও context অনুযায়ী এটি “disjunction”।

#### Implication

$$well\_behaved(dog) \Rightarrow taller\_than(owner(dog), peter)$$

অর্থ: যদি dog টি well behaved হয়, তাহলে তার owner Peter-এর চেয়ে taller।

#### If and only if

$$well\_behaved(dog) \Leftrightarrow taller\_than(owner(dog), peter)$$

অর্থ: দুই দিকই hold করে:

$$well\_behaved(dog) \Rightarrow taller\_than(owner(dog), peter)$$

এবং

$$taller\_than(owner(dog), peter) \Rightarrow well\_behaved(dog)$$

লেকচারার বলেছেন unit-এর বিভিন্ন অংশে iff symbol কখনও double bar, কখনও single bar দিয়ে দেখানো হতে পারে।

---

## Quantifiers

### Universal quantifier

**Symbol:**  
$$\forall$$

**Name:** universal quantifier।

**Intuition:**  
Statement টি domain-এর প্রত্যেক object-এর জন্য প্রযোজ্য।

**লেকচারের উদাহরণ:**

$$\forall v_1.\ well\_behaved(v_1) \Rightarrow owner(v_1)=peter$$

অর্থ: সব objects-এর জন্য, যদি object টি well behaved হয়, তাহলে তার owner Peter।

Variable $v_1$ **universally quantified**।

---

### Existential quantifier

**Symbol:**  
$$\exists$$

**Name:** existential quantifier।

**Intuition:**  
Domain-এ অন্তত একটি object আছে যার জন্য statement টি hold করে।

**লেকচারের উদাহরণ:**

$$\exists v_1.\ well\_behaved(v_1) \land owner(v_1)=peter$$

অর্থ: এমন একটি object exists যা well behaved এবং Peter-এর owned।

Variable $v_1$ **existentially quantified**।

---

## Free এবং bound variables

### Bound variables

**Definition:**  
যদি একটি variable quantified হয়, সেটি **bound**।

Example:

$$\forall v_1.\ well\_behaved(v_1) \Rightarrow owner(v_1)=peter$$

এখানে $v_1$ bound।

### Free variables

**Definition:**  
যদি একটি variable কোনো formula-তে থাকে কিন্তু quantified না হয়, সেটি **free**।

Example:

$$well\_behaved(v_1) \Rightarrow owner(v_1)=peter$$

এখানে $v_1$ free।

### Unit-এ ব্যবহৃত convention

লেকচারার বলেছেন free variables-কে আসলে universally quantified ধরে নেওয়ার প্রবণতা আছে। Free variables প্রায়ই capital letters দিয়ে লেখা হয়:

$$well\_behaved(V) \Rightarrow owner(V)=peter$$

**Datalog-এর সঙ্গে connection:**  
এটি Datalog-এর একই style। Datalog universal এবং existential quantifiers-কে একইভাবে explicit handle করে না; বরং capital letters দিয়ে represent করা free variables ব্যবহার করে।

---

# First Order Logic-এর semantics

## Models

**Intuition:**  
একটি model domain-এর objects দেয় এবং language-এর symbols ঐ domain-এ কী বোঝায় তা বলে।

**লেকচারের definition:**  
First order logic formula-এর একটি model হলো:

$$M = (\Delta, I)$$

যেখানে:

- $\Delta$ হলো **domain**।
- $I$ হলো একটি **interpretation function**।

Strictly, লেকচারার বলেছেন constants, variables, function symbols, predicates ইত্যাদির জন্য আলাদা interpretation functions থাকে; কিন্তু লেকচারে এগুলো simplify করে একটি interpretation function $I$ বলা হয়েছে।

[UNCLEAR / অস্পষ্ট] ট্রান্সক্রিপ্টে “settlement amputation functions” বলা হয়েছে; context এবং slide অনুযায়ী এর অর্থ “set of interpretation functions”।

---

## Model-এ truth

একটি formula $\phi$ কোনো model-এ true, যদি:

$$I(\phi)=\top$$

লেকচারে ব্যবহার করা হয়েছে:

$$\top$$

true বোঝাতে, এবং

$$\bot$$

false বোঝাতে।

---

## Worked example: dog এবং cat domain

### Domain

$$\Delta = \{dog, cat\}$$

Formulae সরাসরি $dog$ এবং $cat$ নামগুলো ব্যবহার করে না। তার বদলে constants $a$ এবং $b$ ব্যবহার করে।

### Constants-এর interpretation

$$I(a)=dog$$

$$I(b)=cat$$

### Predicate

Predicate:

$$is\_dog$$

Interpretation:

$$I(is\_dog)(dog)=\top$$

$$I(is\_dog)(cat)=\bot$$

### Formulae evaluate করা

#### Formula 1

$$is\_dog(a)$$

Step-by-step:

1. $a$ maps to $dog$:

   $$I(a)=dog$$

2. $dog$-এর ওপর প্রয়োগ করা $is\_dog$ true:

   $$I(is\_dog)(dog)=\top$$

3. Therefore:

   $$I(is\_dog(a))=\top$$

তাই এই model-এ $is\_dog(a)$ true।

#### Formula 2

$$is\_dog(b)$$

Step-by-step:

1. $b$ maps to $cat$:

   $$I(b)=cat$$

2. $cat$-এর ওপর প্রয়োগ করা $is\_dog$ false:

   $$I(is\_dog)(cat)=\bot$$

3. Therefore:

   $$I(is\_dog(b))=\bot$$

তাই এই model-এ $is\_dog(b)$ false।

---

## Quantifiers-এর semantics

### Universal quantification

একটি universally quantified formula-এর জন্য:

$$I(\forall v.\ \phi(v))=\top$$

if and only if domain-এর প্রত্যেক object $o$-এর জন্য:

$$I(\phi(o))=\top$$

### Worked example

Formula:

$$\forall v_1.\ is\_dog(v_1)$$

Domain:

$$\{dog,cat\}$$

প্রতিটি object check করা:

$$I(is\_dog(dog))=\top$$

কিন্তু

$$I(is\_dog(cat))=\bot$$

কারণ domain-এর অন্তত একটি object dog নয়:

$$I(\forall v_1.\ is\_dog(v_1))=\bot$$

---

### Existential quantification

একটি existentially quantified formula-এর জন্য:

$$I(\exists v.\ \phi(v))=\top$$

যদি domain-এ এমন কোনো object $o$ থাকে যার জন্য:

$$I(\phi(o))=\top$$

### Worked example

Formula:

$$\exists v_1.\ is\_dog(v_1)$$

Domain:

$$\{dog,cat\}$$

Predicate satisfy করে এমন অন্তত একটি object আছে কি না check করা:

$$I(is\_dog(dog))=\top$$

সুতরাং:

$$I(\exists v_1.\ is\_dog(v_1))=\top$$

---

## সব model-এ truth

লেকচার বলে:

$$\phi$$

true iff এটি সব model-এ true।

লেকচারার আরও বলেন যে practice-এ এটি প্রায়ই restricted হয়, কারণ unit-এ প্রায়ই restricted set of domains নিয়ে কাজ করা হয়।

---

# Unit-এ পরে ব্যবহৃত sloppy terminology

লেকচারার স্পষ্টভাবে সতর্ক করেছেন যে explanation দ্রুত করার জন্য পরে তিনি terminology imprecisely ব্যবহার করতে পারেন।

## “$\phi$ is true in $M$” বলা

লেকচারার যখন বলেন:

$$\phi \text{ is true in } M$$

তখন তার অর্থ:

$$M=(\Delta,I)$$

এবং

$$I(\phi)=\top$$

এটি slide page 7-এ দেখানো হয়েছে।

---

## একটি model-কে formulae-এর set হিসেবে describe করা

লেকচারার লিখতে পারেন:

$$M=\{\phi_1,\phi_2,\phi_3\}$$

যেখানে $\phi_i$ হলো simple formulae অথবা simple formulae-এর negations।

এর অর্থ:

$$M=(\Delta,I)$$

এবং

$$I(\phi_1)=\top$$

$$I(\phi_2)=\top$$

$$I(\phi_3)=\top$$

এবং অন্য সব simple formulae $\phi$-এর জন্য:

$$I(\phi)=\bot$$

### Example

Dog/cat example-এ:

$$is\_dog(dog)$$

$M$-এ true, এবং লেকচারার লিখতে পারেন:

$$M=\{is\_dog(dog)\}$$

এর অর্থ $is\_dog(dog)$ true এবং অন্য সব simple formulae false।

---

# Minimal models

## Motivation

লেকচারার বলেন formulae-এর যেকোনো set-এর জন্য infinitely many models আছে—শুধু numbers-এর প্রতিটি subset-এর জন্যও একটি model থাকতে পারে বলে। কিন্তু একটি particular knowledge base নিয়ে ভাবলে এদের বেশিরভাগই interesting নয়।

## Example knowledge base

$$KB = \{is\_dog(rover),\ is\_cat(kitty),\ldots\}$$

এর সঙ্গে dogs এবং cats সম্পর্কে কিছু complex formulae।

এই ক্ষেত্রে, লেকচারার বলেন আমরা এমন domains-এ interested যেখানে $rover$ এবং $kitty$-এর interpretations আছে। Tweety বা SpongeBob-এর মতো unrelated objects থাকা domain-এ আমরা interested নই, কারণ knowledge base এগুলো নিয়ে কথা বলছে না।

Formally, relevant domain হলো:

$$\Delta = \{I(rover), I(kitty)\}$$

Sloppily, লেকচারার লিখতে পারেন:

$$\Delta = \{rover, kitty\}$$

## Definition: minimal model

একটি knowledge base-এর minimal model হলো এমন model যেখানে:

1. knowledge base-এর সব formulae model-এ true; এবং
2. domain যতটা সম্ভব ছোট।

লেকচারার বলেন তিনি প্রায়ই “all models” বলবেন যখন তার অর্থ “all minimal models”।

---

## Connections

- FOL Datalog-এর সঙ্গে connected: capital-letter variables-কে implicitly universally quantified variables-এর মতো treat করা হয়।
- FOL model-based semantics-এর মাধ্যমে description logics এবং Datalog-এর সঙ্গে connected।
- পরবর্তী agent lectures-এর জন্য এই material assumed background।
- Russell and Norvig Chapter 8 suggested, যদিও লেকচারার বলেছেন এর syntax non-standard।

## আবার শোনার জন্য অস্পষ্ট অংশ

- [UNCLEAR / অস্পষ্ট] “First order logic is not actually examine evil” = “not actually examinable.”
- [UNCLEAR / অস্পষ্ট] “entry function symbol” সম্ভবত “n-ary function symbol।”
- [UNCLEAR / অস্পষ্ট] Complex formulae-তে “distinction” হওয়া উচিত “disjunction।”
- [UNCLEAR / অস্পষ্ট] “settlement amputation functions” হওয়া উচিত “set of interpretation functions।”
- [UNCLEAR / অস্পষ্ট] iff explanation-এর কিছু অংশ garbled: “its own understood than Peter” হওয়া উচিত “its owner is taller than Peter।”

---

# ২. Intelligent Agents and Multi-Agent Organisation

## বিষয় ও পরিসর

এই lecture **intelligent agents** এবং সেগুলো কীভাবে **multi-agent organisation**-এ fit করে তা introduce করে। লেকচারার বলেছেন পুরো unit জুড়ে আরও কয়েকটি topic-এ intelligent agents ব্যবহার করা হবে।

---

# Agent কী?

## Formal definition

লেকচারার textbook definition দেন:

> একটি agent হলো একটি computer system যা কোনো environment-এ situated, এবং delegated objectives achieve করার জন্য ঐ environment-এ autonomous action নিতে সক্ষম।

## Intuition

একটি agent হলো এমন system যা:

1. কোনো environment-এর মধ্যে exists করে;
2. ঐ environment থেকে information receives করে;
3. ঐ environment-এ acts করে;
4. constant human intervention ছাড়াই act করতে পারে;
5. মানুষ বা system design দ্বারা দেওয়া objectives pursue করে।

লেকচারার জোর দেন যে agent হতে physical robot হওয়া বাধ্যতামূলক নয়। এটি purely computational system-ও হতে পারে, যদি এটি কোনো wider computational environment-এর সঙ্গে dynamically interact করে।

---

## Definition-এর key parts

### Environment

কোনো কিছুকে agent বলার জন্য সেটিকে কোনোভাবে outside world-এর সঙ্গে interact করতে হবে।

Examples:

- একটি robot sensors এবং manipulators ব্যবহার করে physical world-এর সঙ্গে interact করে।
- একটি purely computational agent wider computational environment-এর সঙ্গে interact করে।

### Autonomous action

Agent-কে এমন কাজ করতে সক্ষম হতে হবে যা environment-এ কী ঘটে তা change করতে পারে।

### Delegated objectives

Objectives আসে যারা agent deploy করেছে তাদের কাছ থেকে, অথবা system specification/design থেকে।

লেকচারার স্পষ্টভাবে বলেছেন unit মূলত futuristic systems নিয়ে নয়, যারা নিজে নিজে objectives invent করে। Unit concerned এমন systems নিয়ে, যাদের objectives মানুষ delegate করেছে।

---

# Autonomy

## Definition

Autonomy বলতে লেকচারার বোঝান:

> agents are able to act without the intervention of humans or other systems.

বাংলায়: agents মানুষ বা অন্য systems-এর intervention ছাড়াই act করতে পারে।

## গুরুত্বপূর্ণ nuance

Definition টি বলে না:

- action কত জটিল;
- reasoning কত intelligent;
- action sophisticated কি না।

এটি শুধু বলে agent direct intervention ছাড়া act করতে পারে।

---

# Sense-Reason-Act cycle

Slide page 3 basic structure দেখায়:

$$Environment \rightarrow Sensors \rightarrow Agent \rightarrow Actuators \rightarrow Environment$$

## Sensors

Sensors agent-কে environment থেকে information দেয়।

Embodied agents-এর ক্ষেত্রে examples:

- cameras;
- infrared detectors;
- motion detectors।

## Actuators

Actuators agent-কে environment-এর ওপর act করতে দেয়।

Examples:

- grippers;
- motors।

## Cycle

Cycle হলো:

1. Agent environment sense করে।
2. Agent কী করবে decide করে।
3. Agent environment-এর ওপর act করে।
4. Environment change হয়।
5. Agent আবার sense করে।

এটিকে **sense-reason-act cycle** বলা হয়।

---

# Worked example: thermostat as an agent

লেকচারার thermostat ব্যবহার করেন দেখানোর জন্য যে সব agents intelligent agents নয়।

## Environment

House/environment-এর একটি temperature আছে।

## Sensor input

Thermostat temperature detect করে।

## Internal rule

Thermostat-এর একটি target থাকে, যেমন 20 degrees।

## Actions

Detected temperature target-এর নিচে হলে central heating on করে।

Detected temperature target-এর ওপরে হলে central heating off করে।

## কেন এটি agent

এটি environment sense করে এবং environment-এর ওপর act করে।

## কেন এটি unit-এ focus করা intelligent agent নয়

এর behaviour খুব simple এবং fixed। একই sensor input পেলে এটি একই কাজ করে।

[UNCLEAR / অস্পষ্ট] ট্রান্সক্রিপ্টে “below 22 C 20 degrees” বলা হয়েছে; intended threshold সম্ভবত 20 degrees।

---

# কী একটি agent-কে intelligent করে?

Lecture তিনটি property identify করে:

1. proactiveness;
2. reactiveness;
3. social ability।

এগুলো slide page 4-এও listed।

---

## Proactive intelligent agents

### Slide থেকে formal definition

Proactive intelligent agents তাদের delegated objectives satisfy করার জন্য initiative নিয়ে goal-directed behaviour exhibit করতে পারে।

### Intuition

Proactive agent শুধু current sensor input-এ mechanically react করে না। এটি currently যে goal pursue করছে তার ওপর ভিত্তি করে action choose করে।

### Thermostat-এর সঙ্গে contrast

একটি thermostat একই temperature reading-এর জন্য সবসময় একইভাবে behave করে।

একটি proactive agent একই sensor input থাকলেও current goal/objective-এর ওপর depend করে ভিন্নভাবে behave করতে পারে।

---

## Reactive intelligent agents

### Slide থেকে formal definition

Reactive intelligent agents তাদের environment perceive করতে পারে এবং delegated objectives satisfy করার জন্য environment-এ হওয়া changes-এ timely fashion-এ respond করতে পারে।

### Intuition

Reactive agent changes-এর দিকে attention দেয় এবং environment change হলে behaviour adjust করে।

### Worked example: robot obstacle

একটি robot যত দ্রুত সম্ভব কোনো location-এ পৌঁছাতে চেষ্টা করছে।

এর proactive objective হলো goal location-এ পৌঁছানো।

যদি হঠাৎ obstacle আসে, robot-কে react করতে হবে:

1. obstacle perceive করতে হবে;
2. shortest route follow করা বন্ধ করতে হবে;
3. obstacle-এর চারপাশ দিয়ে navigate করতে হবে;
4. goal pursue করা চালিয়ে যেতে হবে।

এটি balance দেখায়:

- **proactive behaviour**: goal pursue করা;
- **reactive behaviour**: environmental change-এ respond করা।

---

## Social ability

### Slide থেকে formal definition

Social ability মানে intelligent agents তাদের design objectives satisfy করার জন্য অন্য agents, এবং সম্ভব হলে humans-এর সঙ্গে interact করতে সক্ষম।

### Intuition

একটি intelligent agent-এর collaborate, coordinate, বা negotiate করতে হতে পারে।

লেকচারার এটিকে distributed computing এবং multi-agent systems-এর সঙ্গে connect করেন:

- agents বিভিন্ন computer-এ থাকতে পারে;
- agents বিভিন্ন robot-এ থাকতে পারে;
- agents একটি task achieve করতে একসঙ্গে কাজ করতে হতে পারে;
- agents-এর objectives আলাদা হতে পারে, কিন্তু collaborate করলে সবাই নিজেদের goals achieve করতে পারে।

---

## Connections

- এই lecture intelligent agents introduce করে, যা later lectures-এ logic-based agents, BDI agents, organisations, roles, institutions, এবং norms-এ ব্যবহৃত হয়।
- Social ability সরাসরি multi-agent systems-এ নিয়ে যায়।
- Lecture সেট আপ করে যে agents-এর groups, communities, societies, বা organisations কীভাবে coordinate করে।

## Exam flags

এই lecture-এ explicit “this is on the exam” statement নেই। তবে agent, autonomy, এবং তিনটি intelligent-agent properties-এর definitions central lecture content।

## আবার শোনার জন্য অস্পষ্ট অংশ

- [UNCLEAR / অস্পষ্ট] “how do I textbook” garbled; এটি course textbook-কে refer করে।
- [UNCLEAR / অস্পষ্ট] “delicate delegated objectives” হওয়া উচিত “delegated objectives।”
- [UNCLEAR / অস্পষ্ট] Robot example-এ “girl” হওয়া উচিত “goal।”

---

# ৩. Logic-Based Agents

## বিষয় ও পরিসর

এই lecture **logic-based agents** ব্যাখ্যা করে: এমন agents যারা facts, rules, এবং theorem proving ব্যবহার করে next action decide করে। লেকচারার এটিকে Datalog এবং logic programming-এর সঙ্গে explicitly connect করেন।

---

# Key idea

## Slide formulation

একটি computational intelligent agent logically reason করে পরবর্তী কী করবে তা নির্ধারণ করে। Rules এবং facts ব্যবহার করে theorem proving-এর মাধ্যমে optimal action deduce করে।

## Intuition

একটি logic-based agent-এর মধ্যে facts এবং rules-এর knowledge base থাকে। Perception-এর মাধ্যমে facts update হয়, তারপর logical reasoning ব্যবহার করে agent infer করে কোন action perform করা উচিত।

লেকচারার এটিকে agent architecture-এর মধ্যে Datalog-এর মতো কিছু বসিয়ে agent-এর actions control করার ধারণা হিসেবে frame করেন।

---

# Action choice algorithm

## Inputs

Action choice algorithm ধরে নেয়:

- possible actions-এর একটি set:

  $$A$$

- facts এবং rules-এর একটি set:

  $$\Delta$$

## Algorithm

Slide থেকে algorithm-এর clean version:

```text
Assume set of actions A, and set of facts and rules Δ.

for each a ∈ A do
    if Δ ⊢ do(a)
        return a

for each a ∈ A do
    if Δ ⊬ ¬do(a)
        return a

return noop
```

## Symbols-এর অর্থ

$$\Delta \vdash do(a)$$

অর্থ: $\Delta$-এর facts এবং rules থেকে system derive করতে পারে যে action $a$ করা উচিত।

$$\Delta \nvdash \neg do(a)$$

অর্থ: $\Delta$ থেকে system derive করতে পারে না যে action $a$ করা উচিত নয়।

## Algorithm-এর interpretation

### First loop

Agent actions-এর মধ্যে search করে এবং action choose করে যদি এটি prove করতে পারে:

$$do(a)$$

এর অর্থ action টি knowledge base দ্বারা positively recommended।

### Second loop

যদি কোনো action provably recommended না হয়, agent আবার এমন action খোঁজে যা ruled out নয়। এটি action $a$ return করে যদি prove করতে না পারে:

$$\neg do(a)$$

তাই second loop এমন action choose করে যা knowledge base-এর সঙ্গে contradict করে না।

### Final case

যদি এমন কোনো action না পাওয়া যায়, agent return করে:

$$noop$$

অর্থ no operation / no action।

[UNCLEAR / অস্পষ্ট] ট্রান্সক্রিপ্টে “no some, no action” বলা হয়েছে; slide-এ পরিষ্কারভাবে `noop` আছে।

---

# Programmer এবং perception-এর role

Programmer facts এবং rules লিখে ধরে নেয় যে এই algorithm in place আছে।

Facts perception-এর মাধ্যমে updated হয়।

Repeated cycle হলো:

1. world perceive করা;
2. facts update করা;
3. logic program / reasoning run করা;
4. কোন action করা হবে decide করা;
5. action perform করা;
6. আবার perceive করা।

এটি আগের **sense-reason-act** cycle-এর সঙ্গে link করে।

---

# Worked example: grid world

Slide page 4-এ teleporting robot এবং দুইটি gold square সহ grid world দেখানো হয়েছে। লেকচারার navigation simplify করেন robot-কে square-by-square navigate না করিয়ে এক square থেকে আরেক square-এ teleport করতে দিয়ে।

## Environment

Grid coordinates 0 থেকে 2 পর্যন্ত ব্যবহার করে।

[UNCLEAR / অস্পষ্ট] ট্রান্সক্রিপ্টে “coordinates that go from not to two” বলা হয়েছে; অর্থ 0 থেকে 2।

Robot middle square-এ start করে:

$$at(1,1)$$

দুইটি square-এ gold আছে।

Robot perceive/update করতে পারে:

- এটি কোনো square-এ আছে কি না:

  $$at(X,Y)$$

- কোনো square explored হয়েছে কি না:

  $$explored(X,Y)$$

- কোনো square unexplored কি না:

  $$unexplored(X,Y)$$

- current square-এ gold আছে কি না:

  $$gold$$

- current square-এ gold নেই কি না:

  $$not\_gold$$

Robot teleport করলে বা gold collect করলে এই perceptions updated হয়।

---

## Initial facts

Program শুরু হয়:

$$at(1,1).$$

$$not\_gold.$$

$$unexplored(0,0).$$

$$unexplored(0,1).$$

$$\ldots$$

$$unexplored(2,2).$$

লেকচারার note করেন program সম্ভবত এটিও believe করা উচিত:

$$explored(1,1)$$

কিন্তু এটি slide-এ লেখা হয়নি।

---

## Rules

### Rule 1: gold না থাকলে unexplored square-এ যাও

$$at(X,Y) \land not\_gold \land unexplored(A,B) \rightarrow do(go(A,B))$$

অর্থ: robot যদি কোনো location $(X,Y)$-এ থাকে, gold না দেখে, এবং অন্য square $(A,B)$ unexplored believe করে, তাহলে তার $(A,B)$-এ যাওয়া উচিত।

### Rule 2: gold present থাকলে collect কর

$$at(X,Y) \land gold \rightarrow do(collect(gold))$$

অর্থ: robot যদি কোনো square-এ থাকে এবং gold দেখে, তাহলে gold collect করা উচিত।

### Rule 3: square $(2,2)$ explored হলে stop কর

$$explored(2,2) \rightarrow do(stop)$$

অর্থ: bottom-corner square $(2,2)$ explored হলে robot stop করবে।

[UNCLEAR / অস্পষ্ট] ট্রান্সক্রিপ্টে “square two two inches the bottom corner” বলা হয়েছে; অর্থ square $(2,2)$।

---

## Variables এবং unification

লেকচারার বলেন Datalog-এর মতো capital letters variables represent করতে ব্যবহৃত হয়।

তাই:

$$X,Y,A,B$$

variables, এবং unification দ্বারা instantiate হয়।

---

## Step-by-step execution

### Step 1: $(1,1)$-এ start

Current beliefs include:

$$at(1,1)$$

$$not\_gold$$

$$unexplored(0,0)$$

Rule 1 applies:

$$at(X,Y) \land not\_gold \land unexplored(A,B) \rightarrow do(go(A,B))$$

using:

$$X=1,\ Y=1,\ A=0,\ B=0$$

Therefore:

$$do(go(0,0))$$

Robot square $(0,0)$-এ teleport করে।

---

### Step 2: $(0,0)$-এ perceive

Teleport করার পরে perception facts update করে।

Robot এখন perceive করে:

$$at(0,0)$$

লেকচারার বলেন এটি ঐ square-এ gold perceive করবে।

এটি আরও update করতে পারে:

$$explored(1,1)$$

এবং previous unexplored status delete বা replace করতে পারে।

---

### Step 3: $(0,0)$-এ gold collect

এখন current facts include:

$$at(0,0)$$

$$gold$$

Rule 2 applies:

$$at(X,Y) \land gold \rightarrow do(collect(gold))$$

using:

$$X=0,\ Y=0$$

Therefore:

$$do(collect(gold))$$

Robot gold collect করে।

লেকচারার কল্পনা করেন robot gold একটি backpack-এ রাখছে।

Collect করার পরে perception changes:

$$gold$$

to:

$$not\_gold$$

---

### Step 4: next unexplored square choose করা

এখন Rule 1 আবার applies:

$$at(X,Y) \land not\_gold \land unexplored(A,B) \rightarrow do(go(A,B))$$

Next unexplored square likely:

$$(0,1)$$

তাই agent derive করে এমন কিছু:

$$do(go(0,1))$$

লেকচারার বলেন facts choose করার order specify করা হয়নি, কিন্তু সাধারণত facts যেভাবে written সেই order-এ picked up হয়।

---

### Step 5: $(0,1)$-এ gold collect

$(0,1)$-এ robot gold perceive করে।

Rule 2 আবার applies:

$$at(0,1) \land gold \rightarrow do(collect(gold))$$

Robot second gold collect করে।

এরপর perception updates:

$$gold$$

to:

$$not\_gold$$

---

### Step 6: exploring continue

Robot unexplored squares-এ moving continue করে।

লেকচারার বলেন start-এ যে square explored হয়েছিল সেটি skip করে।

Eventually, robot reaches square:

$$(2,2)$$

Perception updates:

$$explored(2,2)$$

Now Rule 3 applies:

$$explored(2,2) \rightarrow do(stop)$$

Therefore:

$$do(stop)$$

Robot stops।

---

# Example-টি যে general pattern দেখায়

Agent যখনই action নেয়:

1. facts perception-এর মাধ্যমে change হয়;
2. logic program আবার run হয়;
3. updated facts এবং rules next action determine করে;
4. action executed হয়;
5. perception আবার ঘটে।

এটি sense-reason-act-এর logic-programming version।

---

# Logic-based agents-এর critiques

## 1. Programmer-এর ওপর burden

Programmer-কে rules লিখে সব situations-এ optimal action determine করতে হয়।

Problems:

- Programmer এমন কোনো situation imagine করতে fail করতে পারে যা agent encounter করতে পারে।
- কোনো rule situation handle না করলে agent-এর adapt করার flexibility খুব কম।
- Programmer-কে ensure করতে হয় rules badly overlap না করে।
- Multiple rules একসঙ্গে apply করলে system-কে somehow best rule choose করতে হয়।

## 2. Theorem proving slow হতে পারে

Agent কী করবে তা reason করতে সময় নিতে পারে।

Problem: agent reasoning করার সময় world change হতে পারে।

লেকচারার emphasise করেন loop হলো:

$$perception \rightarrow reasoning \rightarrow action$$

Reasoning করার সময় agent world আবার check করছে না।

তাই agent যে action choose করে, act করার সময় সেটি আর optimal নাও হতে পারে।

## 3. Practical qualification

লেকচারার note করেন practice-এ good logic programmers প্রায়ই এমন programs construct করতে পারে যা quickly execute করে, তাই slowness সবসময় বড় practical issue নয়।

Agents-কে real world-এ কাজ করানোর জন্য specialized logic programming languages আছে।

---

# Connections

- Datalog এবং logic programming-এর সঙ্গে directly connected।
- Earlier agent sense-reason-act architecture-এর ওপর builds।
- BDI agents-এ leads করে, যা action selection-কে আরও structured এবং potentially quicker করার চেষ্টা করে।
- Later planning material agent-এর flexibility এবং adaptability বাড়াবে।

## Exam flags

এই lecture-এ explicit exam phrase নেই, কিন্তু action choice algorithm, grid-world example, এবং critiques হলো major lecture content।

## আবার শোনার জন্য অস্পষ্ট অংশ

- [UNCLEAR / অস্পষ্ট] “logic based engines” হওয়া উচিত “logic-based agents।”
- [UNCLEAR / অস্পষ্ট] “current signature” হওয়া উচিত “current square।”
- [UNCLEAR / অস্পষ্ট] “coordinates that go from not to two” অর্থ coordinates 0 থেকে 2।
- [UNCLEAR / অস্পষ্ট] “explored one more” সম্ভবত $explored(1,1)$।
- [UNCLEAR / অস্পষ্ট] “two two inches the bottom corner” অর্থ square $(2,2)$।

---

# ৪. Beliefs-Desires-Intentions Agents

## বিষয় ও পরিসর

এই lecture **Beliefs-Desires-Intentions agents**, সাধারণত **BDI agents** নামে পরিচিত, introduce করে। BDI agents-কে logic-based agents ছাড়িয়ে যাওয়ার একটি উপায় হিসেবে উপস্থাপন করা হয়, তবে precise behavioural specification এবং analysis-এর সুবিধা retain করে।

---

# Logic-based agents ছাড়িয়ে যাওয়ার কারণ

Lecture চারটি motivation দেয়, slide page 2-এও দেখানো হয়েছে।

BDI agents aim to:

1. current state সম্পর্কে reasoning simplify করা;
2. goals—যেগুলো intentions বা desires বলা হয়—এর মাধ্যমে action direct করা;
3. goals achieve করার plans provide করা, অথবা computer দিয়ে construct করানো;
4. plan এবং action execution monitor করে necessary হলে revise করা।

## Intuition

Logic-based agents-এ next action decide করতে facts এবং rules-এর ওপর theorem proving দরকার হতে পারে। BDI systems এই burden reduce করতে আলাদা করে:

- agent কী believe করে;
- agent কী চায়;
- agent currently কী করতে committed;
- goals achieve করার জন্য agent-এর কী plans আছে।

---

# Core BDI concepts

## Beliefs

**Intuition:**  
Beliefs represent করে agent বর্তমানে world সম্পর্কে কী true ধরে নেয়।

Textbook-style BDI workflow-তে belief revision-এর মাধ্যমে beliefs atomic facts-এ simplified হয়।

Practical languages-এ, লেকচারারের মতে, belief bases-এ প্রায়ই কিছু rules থাকে।

## Desires

**লেকচারের definition:**  
Desires হলো world-এ agent যা কিছু achieve করতে চাইতে পারে।

**Intuition:**  
Desires হলো candidate goals। Agent অনেক কিছু চাইতে পারে, কিন্তু সবগুলোর ওপর currently act করছে না।

## Intentions

**লেকচারের definition:**  
Intentions হলো যেগুলো achieve করার জন্য agent বর্তমানে committed।

**গুরুত্বপূর্ণ nuance:**  
কিছু programming language-এ intention শুধু goal নয়। এটি goal plus attached plan of action হতে পারে।

তাই একটি intention হতে পারে:

$$goal + instantiated\ plan$$

এটি ঐ goal নিয়ে কিছু করার commitment-এর meaning দেয়।

## Plans

Plans হলো goals achieve করার ways।

লেকচারার বলেন plans হতে পারে:

- programmer দ্বারা provided; অথবা
- AI planning ব্যবহার করে computer দ্বারা constructed।

Lecture আরও বলে AI planning পরে unit-এ cover করা হবে।

---

# Execution monitor এবং revise করা

BDI systems plans এবং actions execute হওয়ার সময় monitor করে।

এটি agent-কে behaviour revise করতে দেয়, including:

- goals drop করা যদি সেগুলো আর achievable না হয়;
- goals drop করা যদি agent আর interested না থাকে;
- intentions drop করা যদি plan কাজ না করে;
- intentions drop করা যদি goal আর priority না থাকে।

---

# Textbook অনুযায়ী BDI workflow

Slide page 3 textbook workflow দেখায়।

## Overall flow

$$Sensor\ Input \rightarrow Belief\ Revision \rightarrow Beliefs$$

Then:

$$Beliefs + Current\ Intentions \rightarrow Generate\ Options$$

Then:

$$Goals/Desires \rightarrow Deliberate/Filter \rightarrow Intentions$$

Then:

$$Intentions \rightarrow Select \rightarrow Act$$

Then process sensor input-এ ফিরে যায়।

## Step-by-step explanation

### 1. Sensor input

Agent sensors থেকে new information receives করে।

[UNCLEAR / অস্পষ্ট] ট্রান্সক্রিপ্টে বারবার “censor” বলা হয়েছে; হওয়া উচিত “sensor।”

### 2. Belief revision

Agent তার belief database update করে।

Textbook version belief revision ব্যবহার করে, যেন facts ও rules রেখে প্রতিবার theorem proving করে current world state বের করার বদলে beliefs হয়ে যায় world সম্পর্কে atomic statements-এর set।

তাই textbook picture-এ:

- beliefs শুধু facts;
- beliefs-এ rules নেই।

লেকচারার বলেন belief revision পরের week-এ covered হবে।

### 3. Generate options

Agent current intentions দেখে options generate করে।

এটি goal base modify করতে পারে:

- goals add করা;
- goals remove করা;
- goals change করা।

[UNCLEAR / অস্পষ্ট] ট্রান্সক্রিপ্টে “object options” বলা হয়েছে; হওয়া উচিত “options।”

### 4. Deliberation/filtering

Agent তার goals-এর মধ্য দিয়ে কাজ করে এবং decide করে currently কোনগুলোর achievement নিয়ে কিছু করবে।

Selected goals current set of intentions হয়।

Existing current intentions-ও considered হয়, কারণ agent-কে immediate priorities decide করতে হয়।

### 5. Select intention and act

Agent একটি intention select করে।

Selected intention agent-কে বলে next কী করতে হবে।

Agent acts, তারপর sensing-এ ফিরে যায়।

---

# Lecturer অনুযায়ী BDI workflow

লেকচারার বলেন textbook presentation practical BDI languages-এ যা ঘটে তার oversimplification।

Slides pages 4–6 লেকচারারের preferred workflow দেখায়।

## Textbook থেকে main differences

### 1. Beliefs may include rules

Practice-এ অনেক BDI language belief base-এ শুধু atomic facts রাখে না।

প্রায়ই কিছু rules থাকে।

### 2. Belief revision হলো “simple belief revision”

লেকচারার practical version-কে বলেন:

$$Simple\ Belief\ Revision$$

Sensor information beliefs add বা remove করতে পারে।

Example:

- আগে agent obstacle দেখেছিল;
- এখন আর obstacle দেখে না;
- obstacle সম্পর্কে belief remove করা উচিত।

কিন্তু system necessarily full forward chaining করে every atomic consequence compute করে না।

Reason: full forward chaining computationally expensive হতে পারে।

### 3. Generate options / deliberate / filter messy

লেকচারার বলেন new goals, deliberation, এবং intentions নিয়ে step অনেক systems-এ messy।

Different languages এটি differently করে।

তাই লেকচারার এটিকে একটি combined stage হিসেবে represent করেন:

$$Generate\ Options / Deliberate / Filter$$

### 4. Plans option generation-এ feed করে

Plans workflow-তে added হয়।

Plans আসতে পারে:

- programmer থেকে; অথবা
- planning algorithm থেকে।

Plans intentions instantiate করতে সাহায্য করে।

### 5. Intentions steps-এর sequences হতে পারে

Practice-এ intentions প্রায়ই goals achieve করার currently instantiated plans হয়ে যায়।

তাই intention শুধু:

$$goal$$

না-ও হতে পারে।

এটি হতে পারে:

$$sequence\ of\ actions\ for\ achieving\ a\ goal$$

Intention select করার সময় agent:

- whole sequence execute করতে পারে; অথবা
- শুধু first/top step execute করে reconsider করার জন্য loop back করতে পারে।

লেকচারার suggest করেন second approach agent-কে circumstances change হলে intentions drop বা revise করতে দেয়।

---

# Lecturer-এর নিজের system-এ BDI workflow

লেকচারার নিজের system Gwendolen উল্লেখ করেন।

[UNCLEAR / অস্পষ্ট] ট্রান্সক্রিপ্টে “Gwendolyn” এবং “Gwendolen” দুটোই আছে; system name সম্ভবত Gwendolen।

## Key difference

লেকচারারের system-এ:

$$Generate\ Options / Deliberate / Filter$$

এবং:

$$Goals/Desires$$

এর মধ্যে arrow one-way।

ঐ stage-এ system goals update করে **না**। এটি শুধু ব্যবহার করে:

- goals;
- intentions;
- plans;

পরবর্তী set of intentions কী হবে তা decide করতে।

## Goals এবং beliefs কীভাবে change হয়

Intentions হলো plans-এর ওপর ভিত্তি করা things-to-do-এর sequences।

ঐ sequences-এ এমন actions থাকতে পারে যা change করে:

- goals;
- beliefs।

তাই Act থেকে ফিরে arrows আছে:

$$Beliefs$$

এবং:

$$Goals/Desires$$

## কেন goal change deliberate

লেকচারার বলেন goal change এমন কিছু যা deliberate হওয়া উচিত।

Goals change হতে পারে কারণ:

- user agent-কে goals update করতে message পাঠায়;
- agent reason করে যে goal out of date;
- agent subgoal পায়।

---

# Exam flag: BDI take-home message

লেকচারার স্পষ্টভাবে বলেন exam-level গুরুত্বপূর্ণ message হলো:

BDI systems-এর core constructs আছে:

1. beliefs-এর একটি set, যা hopefully quick to reason about;
2. goals/desires-এর একটি set, যা agent কী করতে চায় তা decide করতে সাহায্য করে;
3. intentions-এর একটি set, যা বলে agent next period of time-এ কোন goals নিয়ে act করতে চেষ্টা করবে এবং কীভাবে করবে।

Exact workflow languages এবং systems অনুযায়ী differs।

লেকচারার বলেন তার own workflow examinable হবে শুধু যদি তার system পরে exemplar হিসেবে used হয়।

---

# Connections

- BDI agents হলো logic-based agents-এর refinement।
- Formal precision এবং analyzability ধরে রেখে reasoning simplify করার চেষ্টা করে।
- Belief revision একটি later lecture-এর সঙ্গে connected।
- AI planning unit-এর later part-এর সঙ্গে connected।
- Course যদি Gwendolen বা অন্য exemplar ব্যবহার করে, agent programming পরে covered হবে।

## আবার শোনার জন্য অস্পষ্ট অংশ

- [UNCLEAR / অস্পষ্ট] “beliefs disaster intentions” = “beliefs, desires, intentions।”
- [UNCLEAR / অস্পষ্ট] “thing improving” = “theorem proving।”
- [UNCLEAR / অস্পষ্ট] “object options” = “options।”
- [UNCLEAR / অস্পষ্ট] “censor” = “sensor।”
- [UNCLEAR / অস্পষ্ট] “examiner or” ঘিরে final sentence garbled, কিন্তু exam message clear: lecturer-এর own workflow শুধু তখন examinable যদি পরে exemplar system হিসেবে used হয়।

---

# ৫. Organisations and Roles

## বিষয় ও পরিসর

এই lecture **organisations** এবং **roles** introduce করে multi-agent systems coordinate করার mechanisms হিসেবে। এটি পরবর্তী institutions and norms lecture-এর জন্য প্রস্তুতি দেয়।

---

# Multi-agent systems

## Basic idea

Multi-agent system-এ agents-এর প্রায়ই অন্য agents-এর সঙ্গে interact করতে হয়।

এই agents হতে পারে:

- computational agents;
- human agents।

অনেক multi-agent systems design করা হয় যাতে humans এবং computational agents একসঙ্গে কোনো end achieve করে।

## Lecture থেকে examples

Multi-agent systems-এর examples include:

- sensor networks;
- business process management systems;
- e-commerce platforms;
- agentic workflows, বিশেষ করে যেখানে multiple large language models একসঙ্গে coordinate করে।

[UNCLEAR / অস্পষ্ট] ট্রান্সক্রিপ্টে “genetic workflows” বলা হয়েছে; slide বলে “Agentic workflows।”

---

# Structure কেন প্রয়োজন

Designers প্রায়ই multi-agent system কীভাবে work coordinate করে তার ওপর কিছু structure impose করতে চান।

Traditional coordination mechanisms include:

- organisations;
- roles;
- institutions;
- norms।

এই lecture organisations এবং roles focus করে। পরের lecture institutions এবং norms cover করে।

---

# Organisations

## Definition

Organisation হলো এমন structure যা multiple agents-কে এমন কোনো goal achieve করতে coordinate করতে দেয় যা তারা individually achieve করতে পারে না।

## Intuition

Organisation হলো coordinating framework। এটি agents-কে structured way-তে একসঙ্গে কাজ করতে দেয়।

## Organisational structure

Organisational structure হলো collection of:

- roles;
- relationships;
- authority structures।

এগুলো govern করে:

- organisation as a whole-এর behaviour;
- organisation-এর ভিতরের agents-এর behaviour।

Computational systems-এ organisational structures প্রায়ই defined হয়:

- models-এর মাধ্যমে;
- interaction protocols-এর মাধ্যমে।

এগুলো roles-এর মধ্যে delegation include করতে পারে।

## Design time-এ unknown agents

লেকচারার বলেন theory অনুযায়ী, একবার organisational structure define হলে individual agents organisation-এ enter করে roles play করতে পারে, এমনকি design time-এ তাদের identities বা programmers জানা না থাকলেও।

---

# Roles

## Definition

Individual agents organisation-এর মধ্যে roles assume করে।

## একটি role কী define করে

একটি role define করতে পারে:

1. rules, obligations, বা norms যা agent follow করবে;
2. agent achieve করার goals;
3. role play করার সময় agent যে capabilities পায়;
4. delegation relationships।

## Roles-এ goals

Roles-এ assigned goals সাধারণত organisation-এর goals-এর subgoals।

Idea হলো:

$$Agents\ achieve\ role\ goals \Rightarrow Organisation\ achieves\ overall\ goal$$

## Capabilities

একটি role agent-কে এমন capabilities দিতে পারে যা অন্যথায় তার নেই।

Lecture থেকে example:

Web agents-এর ক্ষেত্রে role নির্দিষ্ট data access এবং manipulate করার capability দিতে পারে।

Agent যদি ঐ role play না করে, তাহলে ঐ data access বা manipulate করতে পারবে না।

## Delegation

Roles এমন relationships define করতে পারে যেখানে:

- agent অন্য agents-কে tasks delegate করতে পারে;
- agent অন্য agents থেকে tasks delegated পেতে পারে।

## Agents-এর other goals থাকতে পারে

Organisation-এর ভিতরের agents-এর আরও থাকতে পারে:

- নিজের goals;
- অন্য organisations-এ roles।

লেকচারার note করেন এটি software agents এবং human agents—দুটোর ক্ষেত্রেই true।

---

# Worked example: COMP64602 as an organisation

লেকচারার COMP64602 নিজেকেই example হিসেবে ব্যবহার করেন।

## Organisation

$$COMP64602$$

একটি organisation হিসেবে consider করা যায়।

## Organisational goal

Goal হলো unit-এর শেষে students যেন knowledge representation and reasoning সম্পর্কে বেশি শিখে এবং বেশি জানে।

## Roles

Roles include:

- unit lead;
- lecturer;
- graduate teaching assistant;
- student।

## Protocols for interaction

Organisation-এর protocols আছে, যেমন:

- Canvas-এ modules কখন released হয়;
- lectures কখন হয়;
- coursework কখন marked হয়;
- coursework কীভাবে marked হয়।

---

# Worked example: course lecturer as a role

Lecturer role-এর particular capabilities, goals, obligations, এবং delegation relationships আছে।

## Capabilities

Lecturer করতে পারে:

- Canvas space edit করা;
- material add করা;
- material alter করা;
- coursework-এর grades assign করা।

Lecturer অন্য units-এ এই capabilities রাখে না।

Students এই unit-এর অংশ হলেও তাদের এই capabilities নেই।

## Delegation

Lecturer unit lead দ্বারা tasks delegated পেতে পারে।

Lecturer GTAs-কে tasks delegate করতে পারে।

[UNCLEAR / অস্পষ্ট] ট্রান্সক্রিপ্টে “GCS” বলা হয়েছে; context এবং slides অনুযায়ী অর্থ GTAs।

## Goals

Lecturer-এর goals:

- material release করা;
- coursework release করা;
- coursework mark করা।

## Obligations

Lecturer-এর obligations:

- এসব সময়মতো achieve করা;
- student questions সময়মতো answer করা।

## Nested organisations

Lecturer-এর university-তে আরও roles আছে।

COMP64602 নিজেও larger university organisation-এর অংশ হিসেবে দেখা যায়।

Lecturer-এর work-এর বাইরেও personal goals আছে।

---

# Design time vs runtime

## Organisations as design-time tools

Organisations এবং roles প্রায়ই multi-agent system-এর design process-এর অংশ।

Designers যদি closed multi-agent system তৈরি করে, তারা organisations এবং roles শুধু design-এর সময় ব্যবহার করতে পারে।

Design-এর পরে তারা simply agents program করে যাতে intended roles play করে।

সে ক্ষেত্রে runtime-এ organisation represent করার কোনো software নাও থাকতে পারে।

## Organisations at runtime

Organisations runtime-এও exist করতে পারে।

Runtime frameworks support করতে পারে concepts যেমন:

- agents-কে goals communicate করা;
- obligations communicate করা;
- capabilities grant করা;
- protocols communicate করা।

এটি বিশেষভাবে useful যদি agents organisation-এ enter এবং leave করতে পারে।

এটি কাজ করতে হলে agents-কে:

- information understand করতে হবে;
- relevant knowledge represent করতে হবে;
- role কীভাবে play করবে তা reason করতে হবে।

Runtime organisational structures interactions monitor করতে এবং কিছু ঠিকমতো না গেলে correct করতে পারে।

---

# Connections

- Intelligent agents-কে multi-agent coordination-এর সঙ্গে connect করে।
- Business processes এবং organisational theory থেকে draws।
- Directly institutions and norms-এ leads করে।
- Roles, obligations, capabilities, এবং protocols runtime-এ communicate হলে knowledge representation কেন দরকার তা দেখায়।

## Exam flags

কোনো explicit exam flag stated হয়নি।

## আবার শোনার জন্য অস্পষ্ট অংশ

- [UNCLEAR / অস্পষ্ট] “multi-agency system” = “multi-agent system।”
- [UNCLEAR / অস্পষ্ট] “genetic workflows” = “agentic workflows।”
- [UNCLEAR / অস্পষ্ট] “code 64602” = “COMP64602।”
- [UNCLEAR / অস্পষ্ট] “GCS” = “GTAs।”

---

# ৬. Institutions and Norms

## বিষয় ও পরিসর

এই lecture **institutions** এবং **norms** introduce করে multi-agent systems-এ organisations govern করার rule-based structures হিসেবে। এটি বিশেষ করে states এবং events-এর traces ব্যবহার করে norm violations কীভাবে monitored হতে পারে তার ওপর focus করে।

---

# Organisations, institutions, এবং norms

## Organisations

আগে organisations introduce করা হয়েছিল agents-এর groups coordinate করে কোনো goal achieve করার structures হিসেবে।

## Institutions

Multi-agent systems-এ organisations institutions-এর সঙ্গে associated।

## Definition: institution

Institution হলো organisation govern করা rules-এর set।

লেকচারার stress করেন এটি একটি technical definition। Everyday language-এ “institution” আরও wider range of things বোঝাতে পারে, কিন্তু এখানে specifically rules-এর set বোঝায়।

## Norms

Institution-এর rules প্রায়ই norms হিসেবে represented হয়।

---

# Norm কী?

## Definition

একটি norm হলো:

> কোনো group-এর accepted বা expected social behaviour-এর standard বা pattern।

## Norms-এর types

Norms express করতে পারে:

- permissions: agents কী করতে allowed;
- obligations: agents কী করতে expected বা required;
- prohibitions: agents কী না করতে obliged।

লেকচারার বলেন prohibitions obligations-এর অধীনে included, কারণ prohibition মূলত কিছু না করার obligation।

---

## Coordination norms

কিছু norms simple coordination devices।

Examples:

- always drive on the left;
- first time কারও সঙ্গে দেখা হলে shake hands।

লেকচারার বলেন এগুলোতে necessarily moral weight নেই। এগুলো society coordinate করে বা social attitudes indicate করে।

## Moral norms

কিছু norms-এর moral বা ethical weight আছে।

Examples:

- do not kill people;
- care for your children;
- treat people with dignity।

লেকচারার difference নিয়ে detail-এ যান না। এই unit-এর জন্য “norms” obligations, prohibitions, এবং permissions—সব কেস cover করে।

---

# Norm violations এবং sanctions

Agents norms violate করতে পারে।

লেকচারার বলেন agents often norms violate করে, এবং কখনও তা করার good reasons থাকতে পারে।

Agent norm violate করলে institution বা organisation sanction impose করতে choose করতে পারে।

তাই structure:

$$Norm \rightarrow Expected\ behaviour$$

$$Violation \rightarrow Behaviour\ does\ not\ satisfy\ norm$$

$$Sanction \rightarrow Consequence\ imposed\ by\ institution$$

---

# Aside: Deontic logic

Slide page 4 obligations এবং permissions-এর logic হিসেবে deontic logic introduce করে।

[UNCLEAR / অস্পষ্ট] ট্রান্সক্রিপ্টে “logic called logic,” “downtick logic,” এবং “down logic” বলা হয়েছে; এগুলো সব **deontic logic** বোঝায়।

## Symbols

$$O$$

মানে obligation।

$$P$$

মানে permission।

## Permission as absence of obligation not to act

Lecture দেয়:

$$PA \equiv \neg O \neg A$$

অর্থ: $A$ করার permission থাকা equivalent to $A$ না করার obligation না থাকা।

কথায়: আপনি চাইলে $A$ করতে পারেন।

## Axioms

Slide তিনটি axioms দেয়।

### Axiom 1

$$(\vDash A) \rightarrow (\vDash OA)$$

অর্থ: যদি $A$ always true হয়, তাহলে $A$ true হওয়া obligatory।

[UNCLEAR / অস্পষ্ট] ট্রান্সক্রিপ্টে “A is a technology” বলা হয়েছে; হওয়া উচিত “A is a tautology।”

### Axiom 2

$$O(A \rightarrow B) \rightarrow (OA \rightarrow OB)$$

অর্থ: যদি obligatory হয় যে $A$ implies $B$, তাহলে $A$ obligatory হলে $B$-ও obligatory।

### Axiom 3

$$OA \rightarrow PA$$

অর্থ: যদি আপনি কিছু করতে obliged হন, তাহলে সেটি করার permission-ও আছে।

## Semantics vs monitoring

লেকচারার বলেন deontic logic-এর semantics tricky।

তবে violations monitoring সাধারণত straightforward:

- যদি agent $A$ করতে obliged হয়, monitor করা হয় $A$ happens কি না।
- যদি agent $A$ না করতে obliged হয়, এবং $A$ happens, তাহলে violation আছে।

---

# Events and states: norm violations monitor করা

## External environment

Institution এমন external environment-এর চারপাশে placed যেখানে concrete things happen।

## External events

Let:

$$\mathcal{E}_{ex}$$

external environment-এর events-এর set।

Events সাধারণত agent actions।

## External states

Let:

$$S_{ex}$$

external environment-এর states-এর set।

একটি state সাধারণত সেই state-এ true propositions-এর set হিসেবে considered।

## Transition function

Environment-এর একটি transition function আছে:

$$\tau : S_{ex} \times \mathcal{E}_{ex} \rightarrow S_{ex}$$

এটি বলে কোনো event কীভাবে এক state-কে আরেক state-এ transform করে।

লেকচারার simplicity-এর জন্য determinism assume করেন।

তাই environment যদি state $s_0$-এ থাকে, এবং event $e_0$ ঘটে, system state $s_1$-এ transition করে:

$$s_0 \xrightarrow{e_0} s_1$$

Trace তখন:

$$s_0,\ e_0,\ s_1,\ e_1,\ s_2,\ldots$$

লেকচারার বলেন এটি “real world”-এ যা ঘটে: agents actions নেয় এবং states ও transitions-এর sequence generate করে।

---

# Institutional trace

Institution external trace monitor করে এবং নিজের institutional trace create করে।

## Institutional events

Let:

$$\mathcal{E}_{inst}$$

institutional events-এর set।

## Institutional states

Let:

$$S_{inst}$$

institutional states-এর set।

Institutional states হলো facts-এর sets, যা include করতে পারে:

- obligations;
- violations;
- sanctions;
- other institutional facts।

## Environment trace induces institution trace

External trace একটি institutional trace induce করে:

$$s'_0,\ e'_0,\ s'_1,\ e'_1,\ s'_2,\ldots$$

Institutional trace শুধু institution যে জিনিসগুলো care করে সেগুলো record করে।

---

# Generation এবং consequence functions

## Generation function

লেকচারার একটি generation function describe করেন যা নেয়:

- current institutional state;
- current environmental state;
- external event;

এবং produce করে একটি institutional event।

Parsed slide text-এ formula garbled, কিন্তু intended idea হলো:

$$generation: (S_{inst}, S_{ex}, \mathcal{E}_{ex}) \rightarrow \mathcal{E}_{inst}$$

অথবা, loosely:

$$g(S_{inst}, S_{ex}, e_{ex}) = e_{inst}$$

[UNCLEAR / অস্পষ্ট] Slide-এ exact formal type parsed হয়েছে এরকম কিছু হিসেবে:

$$inst \cup ex \times \mathcal{E}_{ex} \rightarrow \mathcal{E}_{inst}$$

তাই notation recording/slides দেখে check করা উচিত।

## Consequence function

Consequence function নেয়:

- একটি institutional state;
- একটি institutional event;

এবং next institutional state return করে:

$$consequence: S_{inst} \times \mathcal{E}_{inst} \rightarrow S_{inst}$$

or:

$$c(s'_{i}, e'_{i}) = s'_{i+1}$$

লেকচারার বলেন textbook version আরও complicated: directly next institutional state দেওয়ার বদলে consequence function institutional state-এ add/delete করার facts generate করতে পারে।

---

# Worked example: coursework submission and marking

Lecture coursework deadlines নিয়ে concrete example দেয়।

## Event sequence

1. Lecturer Barbara 2 February deadline সহ coursework set করেন।
2. Student Susan 1 February coursework complete করে submit করে।
3. Student Vicki 3 February coursework complete করে submit করে।
4. Barbara 4 February Susan-এর coursework mark করেন।
5. Barbara 4 March Vicki-এর coursework mark করেন।

---

# Environment trace

Slide page 8 environment trace দেখায়।

## Abbreviations

$$cs$$

মানে coursework set।

$$ss$$

মানে Susan submits।

$$sv$$

মানে Vicki submits।

$$ms$$

মানে Barbara marks Susan’s coursework।

$$mv$$

মানে Barbara marks Vicki’s coursework।

$$cd(x)$$

মানে coursework due for $x$।

## Trace

Initial state:

$$start$$

Barbara coursework set করেন:

$$start \xrightarrow{cs} \{cd(susan), cd(vicki)\}$$

Susan submits:

$$\{cd(susan), cd(vicki)\} \xrightarrow{ss} \{submitted(susan), cd(vicki)\}$$

Vicki submits:

$$\{submitted(susan), cd(vicki)\} \xrightarrow{sv} \{submitted(susan), submitted(vicki)\}$$

Barbara marks Susan’s coursework:

$$\{submitted(susan), submitted(vicki)\} \xrightarrow{ms} \{marked(susan), submitted(vicki)\}$$

Barbara marks Vicki’s coursework:

$$\{marked(susan), submitted(vicki)\} \xrightarrow{mv} \{marked(susan), marked(vicki)\}$$

## Important observation

Environment trace শুধু external facts যেমন submission এবং marking record করে।

এটি নিজে Vicki-এর submission late বা Barbara-এর marking late হিসেবে mark করে না। এগুলো institutional facts।

---

# New-day transitions যোগ করা

লেকচারার add করেন:

$$new\_day$$

events, কারণ deadlines institutionally matter করে।

New-day event external state change নাও করতে পারে, কিন্তু institution-এর জন্য matter করতে পারে কারণ obligations-এর deadlines আছে।

Slides pages 9–10-এ এগুলো simplified হিসেবে:

$$nd$$

Simplified environment trace হলো:

$$s_0 \xrightarrow{cs} s_1$$

$s_1$-এর around একটি $nd$ transition, তারপর:

$$s_1 \xrightarrow{ss} s_2$$

আরেকটি $nd$, তারপর:

$$s_2 \xrightarrow{sv} s_3$$

আরেকটি $nd$, তারপর:

$$s_3 \xrightarrow{ms} s_4$$

আরেকটি $nd$, তারপর:

$$s_4 \xrightarrow{mv} s_5$$

---

# Institution trace

Institution environment trace observe করে এবং institutional events ও states create করে।

## Initial institutional state

$$s'_0$$

## Coursework set

External event:

$$cs$$

Institutional event:

$$cs'$$

Institution coursework set হওয়ার ব্যাপারে interested, তাই এটি obligations create করে।

New institutional state:

$$\{O(susan, submit(f2)),\ O(vicki, submit(f2))\}$$

অর্থ:

- Susan 2 February-এর মধ্যে submit করতে obliged।
- Vicki 2 February-এর মধ্যে submit করতে obliged।

Here:

$$f2$$

মানে February 2।

---

## Susan submits

External event:

$$ss$$

Institutional event:

$$ss'$$

Susan-এর submission Susan-এর submit করার obligation remove করে।

এটি Barbara-এর জন্য Susan-এর coursework 20 February-এর মধ্যে mark করার obligation-ও create করে।

New institutional state:

$$\{O(barbara, mark(susan,f20)),\ O(vicki, submit(f2))\}$$

অর্থ:

- Barbara 20 February-এর মধ্যে Susan-এর coursework mark করতে obliged।
- Vicki এখনও 2 February-এর মধ্যে submit করতে obliged।

Here:

$$f20$$

মানে February 20।

---

## Vicki-এর deadline passes

Deadline-এর পরে যখন new-day event occurs করে, Vicki তখনও submit করেনি।

Institution এটিকে institutional violation event-এ translate করে:

$$viol(vicki, submit(f2))$$

এর অর্থ Vicki 2 February-এর মধ্যে submit করার obligation violate করেছে।

New institutional state becomes:

$$\{O(barbara, mark(susan,f20)),\ O(vicki, submit(f2)),\ late\_submission(vicki)\}$$

অর্থ:

- Barbara এখনও 20 February-এর মধ্যে Susan-এর coursework mark করতে obliged।
- Vicki-এর original obligation এখনও represented।
- Vicki-এর এখন institutional fact আছে:

  $$late\_submission(vicki)$$

লেকচারার detailed trace এখানে stop করেন এবং বাকিটা exercise হিসেবে রেখে দেন।

তিনি note করেন যে পরে আরেকটি violation হতে পারে যদি Barbara Vicki-এর coursework সময়মতো mark না করেন।

---

# Agent institutional facts দিয়ে কী করে?

লেকচারার বলেন obligations এবং permissions-এর semantics complex হলেও, agent institutional facts ব্যবহার করে কী করবে তা reason করতে পারে।

## Obligations as goals

Agent obligations-কে goals-এ transform করতে পারে।

Example:

$$O(susan, submit(f2))$$

Susan’s agent-এর জন্য goal হতে পারে:

$$submit\ coursework\ by\ February\ 2$$

## Institutional facts as basis for sanctions

Agents institutional facts যেমন:

$$late\_submission(vicki)$$

sanctions apply করতে ব্যবহার করতে পারে।

Lecture থেকে example:

Canvas-এর মতো coursework marking system-এর software agent observe করতে পারে যে Vicki-এর coursework late ছিল। Barbara যখন coursework mark করেন, system automatically late penalty হিসেবে marks deduct করতে পারে।

এটি norm violation-এর কারণে imposed sanction।

---

# Connections

- Directly organisations lecture-এর ওপর builds।
- Institutions হলো organisations govern করা rules।
- Norms হলো rules represent করার একটি way।
- Deontic logic previous semester-এর logic material-এর সঙ্গে connects।
- Example abstract norms-কে practical multi-agent systems এবং institutional monitoring-এর সঙ্গে connect করে।
- Obligations as goals agent programming এবং BDI-style reasoning-এর সঙ্গে connect করে।

## Exam flags

এই lecture-এ explicit exam phrase নেই, কিন্তু institution/norm definitions, deontic notation, trace-based monitoring, এবং coursework example central lecture content।

## আবার শোনার জন্য অস্পষ্ট অংশ

- [UNCLEAR / অস্পষ্ট] “downtick logic” / “down logic” = deontic logic।
- [UNCLEAR / অস্পষ্ট] “A is a technology” = A is a tautology।
- [UNCLEAR / অস্পষ্ট] Transcript বলে “This is not a simplified version of the textbook,” কিন্তু surrounding explanation অনুযায়ী lecturer textbook version simplify করছেন। Recording recheck করুন।
- [UNCLEAR / অস্পষ্ট] Generation function-এর exact formal type parsed slide text-এ garbled।
- [UNCLEAR / অস্পষ্ট] “PHE is Vikki submits” garbled; slide abbreviation হলো $sv$, Vicki submits।
- [UNCLEAR / অস্পষ্ট] Transcript কখনও “Ricky” বলে যেখানে slide এবং context অনুযায়ী Vicki।
