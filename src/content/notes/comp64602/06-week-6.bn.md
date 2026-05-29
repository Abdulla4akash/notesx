---
subject: COMP64602
chapter: 6
title: "Week 6"
language: bn
---


# স্টাডি নোটস: এজেন্ট যোগাযোগ, ইন্টারঅ্যাকশন প্রোটোকল, কমিটমেন্ট, এবং আর্গুমেন্ট গেমস

**বিষয় ও পরিধি —** এই লেকচার প্যাকটি বহু-এজেন্ট সিস্টেমে autonomous agents কীভাবে যোগাযোগ করে তা নিয়ে: communication protocols, agent communication languages, sequence diagrams, finite-state machines, commitments, commitment-based protocol enactments, এবং argumentation-as-games। বৃহত্তর বিষয়ের সঙ্গে এর সম্পর্ক হলো: এজেন্টদের interaction এমনভাবে নির্দিষ্ট করা যায় যাতে অর্থটি observable/checkable থাকে, অথচ autonomous agents-এর flexibility বজায় থাকে।

**কোর্স/প্রসঙ্গ —** মূলত **COMP64602: Agent Communication / Commitments**।  
[UNCLEAR: UML sequence diagrams এবং finite-state machines-এর slide deck-টি **COMP26120** হিসেবে লেবেল করা, commitment example deck-টি **COMP64620** হিসেবে লেবেল করা, আর আশপাশের material COMP64602।]

**Source coverage —** এই নোটে uploaded slides এবং transcripts—যেখানে দুটোই পাওয়া গেছে—দুটোই মিলিয়ে ব্যবহার করা হয়েছে। **Agent Communication** material upload-এ slide-only ছিল; **Arguments and Games** material transcript-only ছিল।

---

## 1. Agent Communication এবং Communication Protocols

### 1.1 Key concept: communication protocol

**Intuition.** একটি communication protocol হলো interaction চলাকালে agents কীভাবে messages আদান-প্রদান করবে তার rule-like description। এটি নির্দিষ্ট করে কোন messages ঘটতে পারে এবং অনেক সময় সেগুলোর order কী হবে।

**Formal / slide definition.** Communication protocol “specifies a sequence of messages to be exchanged between agents.” উদাহরণ: কোনো customer-এর কাছ থেকে order পাওয়ার পর একটি merchant software agent-এর উচিত order receipt confirm করা।

### 1.2 Multi-agent systems-এ protocols কেন গুরুত্বপূর্ণ

লেকচারে ধরে নেওয়া হয়েছে agents হতে পারে:

- **autonomous**;
- **intelligent**;
- protocol design করা ব্যক্তিদের থেকে আলাদা মানুষ দ্বারা designed বা implemented।

এই কারণে protocols-এর একসঙ্গে দুইটি জিনিস দরকার:

1. **Protocol ব্যবহারকারী agent-এর জন্য clear meaning**  
   Agent যেন protocol ব্যবহার করে নিজের actions guide করতে পারে।

2. **Observable violations**  
   Multi-agent system বা organisation যেন observe করে বলতে পারে agent protocol মেনেছে কি না।

পুরো lecture pack জুড়ে এটি recurring theme: protocol specifications যেন agents-এর private internals inspect করার ওপর অতিরিক্ত নির্ভর না করে।

---

## 2. MAS Protocol থেকে আমরা কী চাই

### 2.1 Software engineering desiderata

লেকচারে multi-agent system protocols-এর জন্য কয়েকটি software-engineering requirement দেওয়া হয়েছে।

একটি ভালো MAS protocol হওয়া উচিত:

- **Stakeholders-এর কাছে understandable**
  - Protocol এমন terms-এ প্রকাশ করা উচিত যা stakeholders বোঝে, যেমন `offer`, `request`, এবং `reject`।
  - উদ্দেশ্য শুধু mathematical elegance নয়; stakeholders যেন protocol পড়ে interaction বুঝতে পারে।

- **Modify ও understand করা সহজ**
  - Protocol বদলালে developers এবং stakeholders যেন বুঝতে পারে কী বদলেছে।

- **Compose করা সহজ**
  - Slide-এর উদাহরণ: purchase agree করার protocol যেন item shipping-এর protocol-এর সঙ্গে compose করা যায়।

- **Loosely coupled**
  - Agents যেন অন্য agents কীভাবে protocol-এর তাদের অংশ পূরণ করে সে বিষয়ে বেশি জানতে বাধ্য না হয়।
  - তাদের শুধু communicative interface এবং protocol-level meaning জানলেই চলা উচিত।

### 2.2 Flexibility desideratum

Protocol যেন agent কীভাবে protocol fulfil করবে তার ওপর অপ্রয়োজনীয় constraints কমিয়ে দেয়।

Slides-এর উদাহরণ:

- একটি selling agent simple হতে পারে:
  - database lookup করে;
  - database price তার offer-এর অংশ হিসেবে report করে।

- অথবা selling agent complex হতে পারে:
  - comparable prices-এর জন্য internet scrape করে;
  - customer-এর value বিচার করে;
  - appropriate হলে lower price offer করে।

দুই ধরনের agent-ই একই protocol-এ participate করতে পারা উচিত, যতক্ষণ তাদের observable messages protocol মেনে চলে।

### 2.3 Checkability desideratum

একটি protocol observation থেকে checkable হওয়া উচিত।

এর মানে:

- agent protocol comply করছে কি না বলা সম্ভব হওয়া উচিত;
- protocols precise হওয়া দরকার;
- protocols observable information-এর ওপর ভিত্তি করা উচিত।

**Connection.** এটি সরাসরি FIPA ACL-এর পরবর্তী critique-এর সঙ্গে যুক্ত: correctness যদি agent-এর hidden beliefs বা intentions-এর ওপর নির্ভর করে, তাহলে external observer শুধু messages দেখে compliance check করতে নাও পারে।

---

## 3. Agent Communication Languages

### 3.1 Key concept: communicative acts

**Intuition.** একটি communicative act হলো purpose-সহ একটি message। একই logical content sender inform করছে, request করছে, promise করছে ইত্যাদির ওপর নির্ভর করে ভিন্ন অর্থ নিতে পারে।

লেকচারের উদাহরণ:

- Information pass করা: “There is a box in the next room.”
- Action request করা: “Take the box to the next room.”
- Promise / commitment করা: “I will take the box to the next room.”

Underlying logical content এমন কিছু দিয়ে represent করা যায়:

```latex
in(next_room, box)
```

কিন্তু communicative purpose অনুযায়ী meaning বদলায়।

### 3.2 Key concept: performative

**Intuition.** Performative হলো logical content-এর সঙ্গে attached একটি tag, যা receiving agent-কে বলে content-টি কীভাবে interpret করতে হবে।

**Slide-এর formal examples:**

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

- `:tell(...)` মানে sender information pass করছে।
- `:perform(...)` মানে sender receiver-কে formula true করতে request করছে।
- `:promise(...)` মানে sender promise করছে যে formula true হবে।

Lecturer বলেন, দেখানো syntax কিছু BDI-style programming languages-এ ব্যবহৃত syntax-এর মতো, কিন্তু different communication languages different syntax ব্যবহার করতে পারে। মূল concept হলো **logical content** এবং **performative**-এর separation।

### 3.3 Fixed performatives-সহ agent communication languages

অনেক agent communication language fixed set of performatives দেয়। যে agents language-টি ব্যবহার করতে পারে তারা ঐ standard performatives দিয়ে communicate করতে পারে।

Example:

- **KQML** মানে **Knowledge Query and Manipulation Language**।
- এটি ontologies / knowledge bases-এর মধ্যে communication-এর জন্য intended।
- এতে performatives আছে, যেমন:
  - `query`;
  - `tell`।

Fixed performative language restrictive হতে পারে। Specific domains-এর richer, domain-specific performatives দরকার হতে পারে।

### 3.4 Domain-specific performatives

Lecture-এর business-process example:

- `request_quote`
- `provide_quote`

Nuance গুরুত্বপূর্ণ। কিছু domains-এ quote provide করা মানে হতে পারে request করলে ঐ price-এ goods supply করার commitment। অন্য domain-এ quote কেবল indicative হতে পারে। আরেক ক্ষেত্রে এটি অন্য কারও listed price report করতে পারে।

সুতরাং performative-এর meaning domain এবং protocol-এর ওপর নির্ভর করে।

---

## 4. FIPA ACL

### 4.1 Key concept: FIPA ACL

**Intuition.** FIPA ACL হলো একটি agent communication language, যা messages-কে শুধু performative label-এর চেয়ে বেশি semantic structure দেয়।

**Formal / slide definition.** FIPA ACL message semantics specify করতে চায় agents-এর internal mental state—যেমন beliefs এবং intentions—এর terms-এ। Example: কোনো agent কেবল তখনই একটি fact `tell` করতে পারে, যদি fact-টি তার knowledge base থেকে follows করে।

Transcript-এ corresponding promise example-ও আছে:

- কোনো agent কিছু promise করতে পারে কেবল তখনই, যদি সে ঐ জিনিসটি করতে intend করে।

### 4.2 FIPA ACL এবং message sequence diagrams

FIPA ACL communication protocols specify করে message sequence diagrams ব্যবহার করে। পরের lecture/video sequence diagrams-এর refresher দেয়।

### 4.3 Textbook critique এবং lecturer-এর response

Textbook critique:

- FIPA-style semantics correctness determine করতে agent-এর internal state inspect করতে বলে।
- Example: শুধু `tell` message observe করে external observer জানতে পারে না sender fact-টি সত্যিই believe করে কি না।

Lecturer-এর response:

- External observer বা monitoring system-এর perspective থেকে এই critique fair।
- কিন্তু correctness-এর আরেকটি use আছে: implementation validation।
- যে developer agent-এর internals access করতে পারে, সে verify করতে পারে agent কেবল তখনই `tell` ব্যবহার করছে যখন সে fact-টি আসলেই believe করে।
- তাই internal semantics implementations validate করার জন্য, এবং agents তাদের own outgoing messages internally correct কি না check করার জন্য এখনও useful।

**Connection.** এটি সরাসরি MAS protocol checkability requirement-এর সঙ্গে যুক্ত: external monitoring observable criteria prefer করে, কিন্তু implementation verification legitimately internal mental states ব্যবহার করতে পারে।

---

## 5. UML Sequence Diagrams

### 5.1 Key concept: sequence diagram

**Intuition.** Sequence diagram participants-এর মধ্যে ordered interaction দেখায়।

**Formal / slide definition.** Sequence charts বা diagrams participants-এর মধ্যে interactions-এর sequence illustrate করে। এগুলো UML-এ formalised এবং সাধারণত use cases-কে specifications-এ convert করার সময় ব্যবহৃত হয়। FIPA ACL interaction protocols represent করতে sequence diagrams-এর একটি variant ব্যবহার করে।

### 5.2 Sequence diagram কীভাবে পড়তে হয়

Lecturer basics-এ focus করেন:

- Vertical lines হলো **lifelines**।
  - এগুলো agents বা participants-এর timelines represent করে।
- Lifelines-এর মধ্যে arrows হলো **messages/interactions**।
  - Arrow-এর direction দেখায় কে message পাঠাচ্ছে এবং কাকে পাঠাচ্ছে।
- Diagram **top to bottom** পড়তে হয়।
  - Earlier messages উপরে থাকে।
  - Later messages নিচে থাকে।

**[EXAM FLAG]** Lecturer explicitly বলেন exam-এ expected basics হলো:

- vertical timelines/lifelines participants represent করে—এটা জানা;
- diagram top to bottom পড়া;
- প্রতিটি arrow এক agent থেকে আরেক agent-এ interaction—এটা বোঝা।

**[EXAM FLAG]** Lecturer explicitly বলেন arbitrary message sequence diagrams তৈরি করা students-এর কাছ থেকে expected নয়। Exam question-এ যদি `alt` boxes-এর মতো more complex features ব্যবহার করা হয়, question-এই তাদের meaning explain করা হবে।

### 5.3 Worked example: FIPA protocol specification

Slide-এর sequence diagram-এ দুই participants আছে:

- `Initiator`
- `Participant`

Interaction এভাবে এগোয়।

1. **Initiator** পাঠায়:

```latex
Request
```

**Participant**-এর কাছে।

2. তারপর একটি outer `Alt` box দুইটি possible branches দেয়:

   **Branch 1: refusal**

   ```latex
   Participant \rightarrow Initiator: Refuse
   ```

   এর মানে participant request refuse করে।

   **Branch 2: agreement**

   ```latex
   Participant \rightarrow Initiator: Agree
   ```

   Agreement-এর পরে nested `Alt` box তিনটি possible outcome দেয়:

   ```latex
   Participant \rightarrow Initiator: Fail
   ```

   অথবা

   ```latex
   Participant \rightarrow Initiator: Inform\text{-}done
   ```

   অথবা

   ```latex
   Participant \rightarrow Initiator: Inform\text{-}result
   ```

Interpretation:

- `Fail`: agreed task failed।
- `Inform-done`: task succeeded এবং report করার মতো আর কিছু নেই।
- `Inform-result`: task succeeded এবং result report করা হয়েছে।

Lecturer emphasise করেন যে এটি high level-এ interaction describe করে। Agents-এর internals জানার দরকার নেই; message sequence observe করে protocol followed হয়েছে কি না বলা যায়।

### 5.4 FIPA example থেকে correct message sequences

Diagram এই high-level message traces allow করে:

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

এই traces-এর যেকোনোটি diagram follow করে। এমন sequence:

```latex
Request,\ Inform\text{-}result
```

diagram-এর সঙ্গে match করবে না, কারণ `Inform-result` কেবল `Agree`-এর পরে আসে।

---

## 6. Finite-State Machines

### 6.1 Key concept: finite-state machine

**Intuition.** Finite-state machine হলো এমন model যেখানে system সবসময় finite number of states-এর কোনো একটিতে থাকে। Labelled event observe বা consume করলে আরেক state-এ transition ঘটে।

**Formal / slide definition.** Finite-state machine computation-এর mathematical model। এতে থাকে:

- finite set of states;
- states-এর মধ্যে labelled transitions-এর set;
- কিছু initial states;
- কিছু accepting/final states।

Deterministic finite-state machine-এর জন্য lecture tuple দেয়:

```latex
\langle \Sigma, S, s_0, \delta, F \rangle
```

where:

```latex
\Sigma
```

labels-এর set,

```latex
S
```

states-এর set,

```latex
s_0
```

initial state,

```latex
\delta : S \times \Sigma \rightarrow S
```

transition function, এবং

```latex
F
```

final states-এর set।

### 6.2 Transition labels

Transition-এর label হলো application অনুযায়ী observed, generated, বা consumed কিছু।

Communication protocols-এর ক্ষেত্রে labels সাধারণত messages, যেমন:

```latex
Offer(s,b)
```

অথবা

```latex
Accept(b,s)
```

Machine যদি কোনো state-এ থাকে এবং next observed message একটি defined transition-এর সঙ্গে match করে, তাহলে protocol next state-এ advance করে।

### 6.3 Partial transition function

Lecturer stress করেন যে:

```latex
\delta
```

**partial** হতে পারে।

মানে প্রতিটি possible state-এ প্রতিটি possible label-এর জন্য transition define করা বাধ্যতামূলক নয়।

যদি current state হয় `s`, observed label হয় `a`, এবং:

```latex
\delta(s,a)
```

undefined হয়, তাহলে কিছু ভুল হয়েছে।

Communication protocols-এর context-এ এর মানে protocol failed: enactment-এ কেউ incorrect কিছু করেছে।

### 6.4 Algorithm: FSM দিয়ে protocol compliance check করা

একটি FSM protocol দেওয়া আছে:

```latex
\langle \Sigma, S, s_0, \delta, F \rangle
```

এবং observed message trace:

```latex
m_1, m_2, \ldots, m_n
```

checking এভাবে করা হয়।

1. শুরু করো:

   ```latex
   current = s_0
   ```

2. প্রতিটি observed message `m_i`-এর জন্য:

   - যদি:

     ```latex
     \delta(current, m_i)
     ```

     defined হয়, update করো:

     ```latex
     current := \delta(current, m_i)
     ```

   - অন্যথায় protocol enactment failed।

3. Communication থামলে:

   - যদি:

     ```latex
     current \in F
     ```

     তাহলে protocol correctly ended;

   - যদি:

     ```latex
     current \notin F
     ```

     তাহলে protocol correctly ended হয়নি।

Lecture-এর simple protocol example-এ ঠিক এই logic ব্যবহৃত হয়েছে।

### 6.5 Worked example: simple seller-buyer protocol

Slides-এর state diagram-এ states আছে:

```latex
S0,\ S1,\ S2,\ S3
```

এবং seller `s` ও buyer `b`-কে involving messages আছে। Agent Communication slides-এর diagram একই basic graph দেখায়, আর Sequence/FSM deck পরে `S1` ও `S3`-কে double circles দিয়ে final states হিসেবে mark করে।

Graph transitions:

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

Slide-এর formal representation:

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

[UNCLEAR: diagram এবং `\Sigma`-তে `Update(s,b)` ব্যবহার করা হয়েছে, কিন্তু slide-এর formal transition-এ `Update(b,s)` আছে। এটি সম্ভবত slide inconsistency; recording/slides দেখে এই অংশ revise করতে হবে।]

### 6.6 Correct এবং incorrect traces

`S1`-এ ending correct trace:

```latex
Offer(s,b)
```

Reason:

```latex
S0 \xrightarrow{Offer(s,b)} S1
```

এবং `S1` final।

`S3`-এ ending correct trace:

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

এবং `S3` final।

Update-সহ correct trace:

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

এবং `S1` final।

Incorrect trace:

```latex
Accept(b,s)
```

Reason: `S0` থেকে শুধু `Offer(s,b)` defined। কোনো transition নেই:

```latex
\delta(S0, Accept(b,s))
```

তাই protocol fails।

Incorrect stopping point:

```latex
Offer(s,b),\ Accept(b,s)
```

Reason:

```latex
S0 \rightarrow S1 \rightarrow S2
```

কিন্তু `S2` final নয়। Communication যদি `S2`-তে থেমে যায়, কিছু ভুল হয়েছে।

### 6.7 Syntactic correctness সম্পর্কে important note

Lecturer বলেন example-টি “slightly weird”: buyer accept করার পরে seller offer update করতে পারে, এবং protocol loop করতে পারে। Lecturer আরও বলেন textbook example-এ accept এবং reject হয়তো উল্টো হওয়া উচিত ছিল কি না তিনি ভাবেন।

কিন্তু key point হলো:

**একটি protocol syntactically correct হতে sensible হওয়া বাধ্যতামূলক নয়।**

Protocol এখনও একটি well-formed finite-state machine।

**[EXAM FLAG]** Lecturer explicitly বলেন students finite-state-machine tuple representation জানবে বলে expected:

```latex
\langle \Sigma, S, s_0, \delta, F \rangle
```

এবং exam question-এ এটি এলে কী চলছে বুঝতে হবে।

---

## 7. Commitments

### 7.1 Key concept: commitment

**Intuition.** একটি commitment record করে যে এক agent আরেক agent-কে promise করেছে: কোনো triggering condition hold করলে সে কোনো condition bring about করবে।

**Lecture-এর formal definition.**

একটি commitment-এর form:

```latex
C(debtor, creditor, antecedent, consequent)
```

where:

- `debtor` হলো agent যে commitment owed করে;
- `creditor` হলো agent যার কাছে commitment owed;
- `antecedent` হলো first-order formula;
- `consequent` হলো first-order formula।

Meaning:

> debtor creditor-এর কাছে commit করেছে যে antecedent hold করলে consequent true করবে।

Antecedent creditor-এর করা কোনো কাজ হতে হবে এমন নয়। এটি শুধু কোনো circumstance occur করা হতে পারে।

**[EXAM FLAG / IMPORTANT]** Slides commitments-কে agent interaction protocols define করার “an important modern concept” বলে, এবং lecturer বলেন commitments multi-agent systems-এ “definitely a very important concept”।

### 7.2 Detached commitments

Commitment **detached** হয় যখন:

- antecedent holds;
- consequent এখনও hold করে না।

এর জন্য:

```latex
C(x,y,r,u)
```

যদি:

```latex
r
```

holds এবং:

```latex
u
```

এখনও hold না করে, commitment detached।

**Intuition.** Debtor-কে এখন কিছু করতে হবে। Lecturer বলেন detached commitments সম্ভবত এই protocols-এর সবচেয়ে important জিনিস, কারণ detachment parties-এর action drive করে।

**[EXAM FLAG / IMPORTANT]** Detachment কী এবং কেন matter করে তা জানো: detachment হলো point যেখানে debtor actively consequent bring about করতে obliged হয়।

### 7.3 Discharged commitments

Consequent holds করলে commitment **discharged** হয়।

এর জন্য:

```latex
C(x,y,r,u)
```

যদি:

```latex
u
```

holds, তাহলে commitment discharged।

**Intuition.** Promised outcome achieved হওয়ায় commitment চলে যায়।

### 7.4 Formal detachment step

Slide key logical note দেয়:

যদি:

```latex
C(x,y,r,u)
```

একটি commitment হয় এবং detached হয়, অর্থাৎ:

```latex
r
```

holds, তাহলে:

```latex
C(x,y,\top,u)
```

এটিও একটি commitment।

Interpretation:

- `\top` মানে “true” বা “trivially true”।
- তাই:

```latex
C(x,y,\top,u)
```

মানে `x` এখন কোনো further triggering condition ছাড়াই `u` bring about করতে obliged।

### 7.5 Norms-এর সঙ্গে connection

Commitments norms-এর সঙ্গে related, কারণ দুটিই obligation-like structures involve করে।

Lecturer বলেন commitment violations norm violations-এর মতোই detect করা যায়। Monitoring idea:

1. environment-এর events observe করা;
2. সেই events-কে institutionally meaningful facts/events-এ map করা;
3. commitments কখন appear, detach, বা discharge হচ্ছে তা detect করা;
4. norm monitoring-এর মতো similar way-তে violations monitor করা।

[UNCLEAR: transcript “institutional facts/events” phrase-টি “institutional trust/choice” হিসেবে garble করেছে; exact term-এর জন্য recording check করতে হবে।]

---

## 8. Commitment Operations

Lecture এমন operations introduce করে যা commitments appear, disappear, বা change করে। Protocols messages-এর meaning define করতে এগুলো ব্যবহার করে।

### 8.1 `CREATE`

```latex
CREATE(x,y,r,u)
```

`x` দ্বারা performed।

Effect:

```latex
C(x,y,r,u)
```

holds।

Meaning: `x`, debtor, `y`, creditor-এর কাছে একটি commitment create করে।

### 8.2 `CANCEL`

```latex
CANCEL(x,y,r,u)
```

`x` দ্বারা performed।

Effect: এটি বন্ধ করে:

```latex
C(x,y,r,u)
```

আর hold করে না।

Meaning: debtor commitment cancel করে।

Transcript থেকে important restriction: protocol-এ `x` যেন যখন খুশি cancel করতে পারে এমন necessarily allow করা উচিত নয়। Protocol define করবে কখন cancellation acceptable।

### 8.3 `RELEASE`

```latex
RELEASE(x,y,r,u)
```

`y` দ্বারা performed।

Effect: এটি বন্ধ করে:

```latex
C(x,y,r,u)
```

আর hold করে না।

Meaning: creditor debtor-কে commitment থেকে release করে।

Lecturer বলেন এটি generally acceptable, কারণ যার কাছে commitment owed, সে বলতে পারে: “you no longer have to do that.”

### 8.4 `DELEGATE`

```latex
DELEGATE(x,y,z,r,u)
```

`x` দ্বারা performed।

Effect:

```latex
C(z,y,r,u)
```

holds।

Meaning: `x` commitment `z`-এর কাছে delegate করে। `z`-এর এখন `y`-এর কাছে commitment আছে।

Transcript একটি important nuance যোগ করে:

- `x`-এর original commitment এখনও hold করতে পারে;
- `x` হয়তো `z`-কে দিয়ে `u` bring about করিয়ে নিজের commitment discharge করতে চাইছে;
- যদি `z` `u` bring about করে, তাহলে `z` এবং `x`—দুজনের commitments-ই discharged হতে পারে।

Protocol define করবে কখন এবং কাকে delegation acceptable।

### 8.5 `ASSIGN`

```latex
ASSIGN(x,y,z,r,u)
```

`y` দ্বারা performed।

Effect:

```latex
C(x,z,r,u)
```

holds।

Meaning: creditor বদলায়। `x` `y`-এর কাছে committed ছিল, কিন্তু `y` সেই commitment-এর benefit `z`-কে assign করে।

Transcript থেকে intuition:

- `x` `y`-এর কাছে commitment করেছে;
- `y` বলে, `y` নয়, `z` এখন consequent-এ interested party;
- `x`-কে এখন `z`-এর জন্য এটি করতে হবে।

### 8.6 `DECLARE`

```latex
DECLARE(x,y,r)
```

`x` দ্বারা performed।

Effect: `x` `y`-কে inform করে যে `r` holds।

Lecturer বলেন এটি আসলে commitment operation নয়, কিন্তু অনেক protocols-এ ব্যবহৃত হয়। এটি “I’ve done it” বলার একটি উপায় হিসেবে function করতে পারে।

Alternative: declaration message-এর বদলে agents event trace observe করতে পারে। Right action event trace-এ দেখা গেলে সবাই জানতে পারে `r` holds।

---

## 9. Commitment Protocol Example: E-Commerce Store and Customer

### 9.1 Protocol scope

Commitment example হলো store এবং customer-এর মধ্যে e-commerce-style exchange-এর জন্য খুব simple interaction protocol।

Lecturer explicitly বলেন এই protocol particular protocol parts কখন performed হতে পারে সে বিষয়ে conditions include করে না। বরং commitment operations-এর terms-এ messages-এর meanings দেয়।

### 9.2 Commitment operations হিসেবে message meanings

Slide protocol define করে messages plus commitment operations হিসেবে।

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

Store customer-এর কাছে commit করে যে price paid হলে item delivered হবে।

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

Customer store-এর কাছে commit করে যে item delivered হলে price paid হবে।

Lecturer note করেন, এটি store-এর offer commitment-এর converse।

#### `reject`

```latex
reject(Customer, Store, Price, Item)
```

means:

```latex
RELEASE(Store, Customer, paid(Price), delivered(Item))
```

Meaning: customer store-কে price paid হলে item deliver করার store commitment থেকে release করে।

[UNCLEAR: `reject`-এর slide text-এ `delivered(Item)`-এর পরে closing parenthesis missing মনে হয়।]

#### `deliver`

```latex
deliver(Store, Customer, Item)
```

means:

```latex
DECLARE(Store, Customer, delivered(Item))
```

Meaning: store customer-কে declare করে যে item delivered হয়েছে।

#### `pay`

Slide দেয়:

```latex
pay(Customer, Store, Item)
```

means:

```latex
DECLARE(Customer, Store, paid(Item))
```

কিন্তু examples-এ messages ব্যবহার করা হয়েছে যেমন:

```latex
pay(Price)
```

এবং:

```latex
pay(£12)
```

[UNCLEAR: protocol definition `pay(Customer, Store, Item)` এবং `paid(Item)`-এ `Item` ব্যবহার করে, আর protocol-এর বাকি অংশ `paid(Price)` ব্যবহার করে এবং sequence diagrams price payment ব্যবহার করে। Re-listen/check slides করতে হবে এটি `pay(Customer, Store, Price)` এবং `paid(Price)` হওয়া উচিত কি না।]

### 9.3 Worked example 1: offer, pay, deliver

Commitment example slide deck-এর sequence diagram দেখায়:

```latex
:EBook \rightarrow :Customer: offer(Price, Book)
```

```latex
:Customer \rightarrow :EBook: pay(Price)
```

```latex
:EBook \rightarrow :Customer: deliver(Book)
```

এই enactment-এ কোনো `accept` বা `reject` message নেই। তবুও এটি correct।

#### Step-by-step commitment state

**Step 1: offer**

```latex
offer(EBook, Customer, Price, Book)
```

creates:

```latex
C(EBook, Customer, paid(Price), delivered(Book))
```

E-book store committed যে customer price pay করলে book deliver করবে।

**Step 2: pay**

```latex
pay(Customer, EBook, Price)
```

declares:

```latex
paid(Price)
```

এটি store-এর commitment-এর antecedent true করে। ফলে store-এর commitment detached হয়:

```latex
C(EBook, Customer, paid(Price), delivered(Book))
```

becomes, in effect:

```latex
C(EBook, Customer, \top, delivered(Book))
```

Store এখন book deliver করতে obliged।

**Step 3: deliver**

```latex
deliver(EBook, Customer, Book)
```

declares:

```latex
delivered(Book)
```

এটি consequent true করে, তাই store-এর commitment discharged হয়।

#### কেন এই enactment correct

Customer-এর `accept` পাঠানোর দরকার ছিল না। Protocol messages-কে meaning দেয়; payment-এর আগে `accept` message require করে না। Payment নিজেই store-এর commitment detach করে, এবং delivery সেটি discharge করে।

### 9.4 Worked example 2: offer, accept, deliver, pay

Commitment example slide deck-এর sequence diagram দেখায়:

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

Store commit করে যে £12 paid হলে *Brave New World* deliver করবে।

**Step 2: accept**

```latex
accept(Customer, EBook, £12, BraveNewWorld)
```

creates:

```latex
C(Customer, EBook, delivered(BraveNewWorld), paid(£12))
```

Customer commit করে যে store book deliver করলে সে £12 pay করবে।

**Step 3: deliver**

```latex
deliver(EBook, Customer, BraveNewWorld)
```

declares:

```latex
delivered(BraveNewWorld)
```

এর দুইটি effect আছে:

1. Store-এর commitment discharged, কারণ consequent:

   ```latex
   delivered(BraveNewWorld)
   ```

   true।

2. Customer-এর commitment detached, কারণ তার antecedent:

   ```latex
   delivered(BraveNewWorld)
   ```

   true।

তাই customer-এর এখন detached commitment আছে:

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

এটি customer-এর commitment discharge করে।

#### কেন এই enactment correct

Store payment-এর আগে deliver করে, কারণ store customer-কে trust করে। এটি এখনও correct, কারণ `accept` message customer-to-store commitment create করেছে: store deliver করলে customer pay করবে।

### 9.5 Commitment example থেকে main lesson

দুই enactment-ই correct:

1. `offer`, `pay`, `deliver`
2. `offer`, `accept`, `deliver`, `pay`

দুইটাই correct কারণ protocol single rigid message order impose না করে commitment operations ব্যবহার করে messages-এর meanings দেয়। Messages ব্যবহার করার সময় correct থাকলে এটি agents-কে flexibility দেয়।

**Connection.** এটি সরাসরি আগের MAS protocol flexibility desideratum-কে support করে: agents observable correctness বজায় রেখে different ways-এ protocol fulfil করতে পারে।

---

## 10. Argumentation and Games

### 10.1 Topic: multi-agent systems-এ argumentation

Lecture argumentation-কে game theory-এর সঙ্গে connect করে।

Starting point হলো argumentation useful:

- different sources of information reconcile করতে;
- different viewpoints reconcile করতে;
- different proposed courses of action reconcile করতে।

Multi-agent system-এ প্রতিটি agent-এর থাকতে পারে:

- privileged information;
- নিজস্ব objectives;
- পুরো situation সম্পর্কে only partial knowledge।

তাই কোনো individual agent initially complete final argumentation framework জানে না। Agents communicate করে এবং একে অন্যের arguments attack করার সঙ্গে সঙ্গে argument graph incrementally build করতে হয়।

### 10.2 Key concept: argument graph incrementally built হয়

**Intuition.** Complete argument graph আগে থেকেই known ধরে নেওয়ার বদলে agents interaction-এর সময় arguments reveal করে।

প্রতিটি agent arguments এবং attacks contribute করে:

- এক agent একটি course of action propose করে;
- আরেক agent অন্য argument দিয়ে attack করে;
- আরেক agent সেই attack-কে attack করতে পারে;
- dialogue proceed করার সঙ্গে সঙ্গে graph grow করে।

এই incremental construction গুরুত্বপূর্ণ, কারণ এটি multi-agent setting-এর সঙ্গে match করে: agents শুরুতে সব arguments জানে না।

### 10.3 Worked example: smart home system

Example হলো একটি smart home system, যা observe করে যে বাড়ির এক child marijuana smoke করছে।

#### Legal agent

Legal agent argue করে:

- marijuana smoking illegal;
- তাই police alert করা উচিত।

এটি proposed course of action: police contact করা।

#### Social agent

Social agent-এর social norms-এর model আছে এবং সে argue করে:

- child-এর পক্ষ থেকে এটি bad behaviour;
- parents alert করা উচিত;
- parents decide করবে কী করা হবে।

এটি legal agent-এর argument attack করে যে police alert করা উচিত।

#### Legal agent repeats

Legal agent repeat করতে পারে:

- এটি illegal;
- police alert করা উচিত।

Lecturer explain করেন graph form-এ এটি cycle create করে, কিন্তু argument game tree হিসেবে build করলে repeated argument tree-এর নিচে infinite branch হিসেবে চলতে থাকবে। Slide/lecture সীমিত space-এর কারণে compactly represent করে।

#### Privacy agent

Privacy agent argue করে:

- system police contact করতে absolutely legally obliged না হলে, house-এর কেউ request না করলে police contact করা উচিত নয়।

এটি police alert করার argument attack করে।

Lecturer এটিকে reasonable smart-home heuristic হিসেবে frame করেন:

- কেউ injured বা murdered হলে system police contact করতে obliged হতে পারে;
- কিন্তু অনেক other things-এর জন্য household request না করলে police contact করা উচিত নয়।

#### Outcome

Privacy agent-এর argument-এর পরে আর কোনো agents contribute করে না। এরপর system argumentation framework-এর ওপর reasoning করে decide করতে পারে কোন arguments accepted।

[UNCLEAR: transcript বলে outcome হলো “not to contact the police, but to contact the police,” যা contradictory। Surrounding explanation থেকে intended contrast সম্ভবত police contact না করে parents contact করা, কিন্তু transcript check করতে হবে।]

---

## 11. Argument Games

### 11.1 Key concept: game হিসেবে argumentation

**Intuition.** Agents game-এর players-এর মতো। প্রতিটি player arguments put forward করে এবং অন্য side-এর arguments attack করে কোনো proposed course of action support করতে চায়।

Lecture এটি describe করে ব্যবহার করে:

- arguments;
- attacks;
- dispute trees;
- disputes;
- strategies;
- winning strategies।

### 11.2 Key concept: dispute tree

**Intuition.** Dispute tree হলো argument game-এর tree-shaped representation।

Lecture দুইটি structure contrast করে:

1. **Argument graph**
   - Cycles possible।
   - Repeated attacks loops form করতে পারে।

2. **Dispute tree**
   - Argument graph থেকে built।
   - Arguments repeat হতে পারে।
   - Graph-এর cycle tree-তে infinite branch হয়ে যায়।

Dispute tree-এর root হলো initial argument। Smart-home example-এ initial argument হলো legal agent-এর argument যে police contact করা উচিত।

### 11.3 Key concept: dispute

একটি **dispute** হলো dispute tree-এর single branch।

সুতরাং dispute tree-তে attack এবং defence-এর several possible lines থাকলে, tree-এর প্রতিটি path একটি dispute।

### 11.4 Key concept: strategy

Strategy player-কে বলে possible attacks-এর response হিসেবে কোন arguments make করতে হবে।

Lecturer-এর intuition:

- এক player একটি course of action recommend করতে চায়;
- opponents attack করে;
- player-এর relevant arguments defend করার way দরকার;
- winning strategy দেখায় player কীভাবে respond করতে পারে যাতে opponent root argument defeat করতে না পারে।

### 11.5 Formal-ish definition: winning strategy

Transcript garbled কিন্তু recoverable definition দেয়।

Given:

- একটি argument graph;
- root argument `A`-সহ একটি dispute tree `T`;
- একটি subtree `T'`;
- ঐ subtree-এর disputes-এর set, এখানে লেখা হচ্ছে:

```latex
D(T')
```

একটি subtree `T'`, `A`-এর জন্য winning strategy যদি:

1. `D(T')` non-empty এবং finite।

2. `D(T')`-এর প্রতিটি dispute finite।

3. প্রতিটি dispute শেষ হয় [UNCLEAR: transcript says “opponent,” কিন্তু সঙ্গে সঙ্গে explain করে “the proponent has had the final say.” এগুলো conflict করে। Recording/slides check করো।]

4. Strategy যেন শুধু opponent possible attacks make করতে ব্যর্থ হয়েছে বলে win না করে। তাই proponent argument-এ পৌঁছানো কোনো dispute branch-এর জন্য, every possible attacking argument subtree-এর কোথাও represented হতে হবে।

Condition 4-এর intuition:

- যদি কোনো argument attack করা যায়, strategy-তে সেই possible attack-এর response include করতে হবে;
- opponent subtree-তে সব possible attacks “try” করেছে;
- proponent তবুও root argument defend করতে পারলে, proponent-এর winning strategy আছে।

Lecturer-এর summary: strategy দ্বারা specified arguments proponent make করলে opponent proponent-এর argument defeat করতে পারে না।

---

## 12. Dialogue Games

### 12.1 Key concept: dialogue game

**Intuition.** Dialogue game abstract argument game-কে extend করে arguments-এর internal form আরও include করে।

Arguments-কে শুধু graph-এর abstract nodes হিসেবে treat করার বদলে dialogue game logical forms include করতে পারে, যেমন:

- claiming `\phi`;
- asking why `\phi`;
- `\phi`-এর জন্য reason `\psi` দেওয়া;
- contradiction বা complement attack করা।

এটি system-কে arguments-এর logical content-এর ওপর ভিত্তি করে define করতে দেয় কোন ধরনের moves কোন moves attack করতে পারে।

### 12.2 Dialogue move: claiming `\phi`

একটি move হতে পারে:

```latex
claim(\phi)
```

Meaning: agent assert করে যে `\phi` is the case।

Transcript বলে এটি কেবল তখন stated হতে পারে যদি `\phi` agent-এর knowledge base থেকে [UNCLEAR: “disputed usable”] হয়। Intended term সম্ভবত derivable/provable/usable-এর মতো কিছু, কিন্তু transcript check করতে হবে।

### 12.3 Dialogue move: asking why `\phi`

একটি move হতে পারে:

```latex
why(\phi)
```

Meaning: agent জিজ্ঞেস করে কেন `\phi` is the case।

এটি `\phi`-এর bare claim attack করে। কোনো agent reason না দিয়ে `\phi` claim করলে, আরেক agent জিজ্ঞেস করতে পারে:

```latex
why(\phi)?
```

Lecture দুই variants note করে:

- কিছু systems-এ agent কেবল তখনই why `\phi` ask করতে পারে, যদি সে `\phi` believe না করে;
- অন্য systems-এ agent `\phi` believe করলেও why `\phi` ask করতে পারে, কারণ সে অন্য agent-এর reason জানতে চায়।

### 12.4 Dialogue move: `\phi` since `\psi`

একটি move হতে পারে:

```latex
\phi \text{ since } \psi
```

Meaning: `\psi` is the case বলে `\phi` is the case।

এটি attack করে:

```latex
why(\phi)
```

কারণ এটি requested reason provide করে।

Transcript আরও বলে এটি `\phi`-এর complement assert করা argument attack করতে পারে। Overline notation:

```latex
\overline{\phi}
```

মানে `\phi`-এর negation, বা অন্তত `\phi`-কে contradict করে এমন কিছু।

Move:

```latex
\phi \text{ since } \psi
```

শুধু তখন stated হতে পারে যদি agent-এর knowledge base implication contain করে:

```latex
\psi \Rightarrow \phi
```

[UNCLEAR: transcript এই section heavily garble করেছে: “wi fi” হলো `why \phi`, “five” হলো `\phi`, এবং “eight psi implies five” হলো `if \psi implies \phi`। Exact allowed attack relation-এর জন্য re-listen করো।]

### 12.5 Textbook-এর সঙ্গে connection

Lecturer বলেন textbook-এ আছে:

- cycles-এর কারণে infinite graphs prevent করার আরও details;
- আরও dialogue-game moves;
- একটি argument build হওয়ার example।

এই lecture শুধু idea sketch করে।

---

## 13. Consolidated Exam Flags

### Sequence diagrams

**[EXAM FLAG]** Basics জানো:

- lifelines হলো participants-এর vertical timelines;
- diagram top to bottom পড়তে হয়;
- arrows হলো এক participant থেকে আরেক participant-এ interactions/messages।

**[EXAM FLAG]** Arbitrary message sequence diagrams construct করা expected নয়। Exam question-এ `alt` boxes-এর মতো জিনিস ব্যবহার করলে তাদের meaning explain করা হবে।

### Finite-state machines

**[EXAM FLAG]** Deterministic FSM representation জানো:

```latex
\langle \Sigma, S, s_0, \delta, F \rangle
```

with:

```latex
\delta : S \times \Sigma \rightarrow S
```

এবং প্রতিটি component কী বোঝায় জানো।

**[EXAM FLAG]** বোঝো যে `\delta` partial হতে পারে। Current state-এ observed message-এর জন্য transition defined না থাকলে protocol failed।

**[EXAM FLAG]** Final/accepting states বোঝো: `F`-এ stop করা correct; `F`-এর বাইরে stop করা, যেমন worked example-এ `S2`, incorrect।

### Commitments

**[EXAM FLAG / IMPORTANT]** Commitments agent interaction protocols define করার important modern concept। জানো:

```latex
C(debtor, creditor, antecedent, consequent)
```

এবং debtor, creditor, antecedent, consequent-এর roles।

**[EXAM FLAG / IMPORTANT]** Detached commitments action drive করে। Antecedent holds এবং consequent এখনও hold না করলে commitment detached।

**[EXAM FLAG / IMPORTANT]** Detachment transformation জানো:

```latex
C(x,y,r,u),\ r \text{ holds}
\quad \Rightarrow \quad
C(x,y,\top,u)
```

Meaning: `x` এখন `u` bring about করতে obliged।

**[EXAM FLAG]** Basic commitment operations জানো:

```latex
CREATE,\ CANCEL,\ RELEASE,\ DELEGATE,\ ASSIGN,\ DECLARE
```

এবং each operation কে performs করে।

### Protocol design

**[EXAM FLAG / HIGH VALUE]** একটি protocol হওয়া উচিত:

- stakeholders-এর কাছে understandable;
- modifiable;
- composable;
- loosely coupled;
- flexible;
- precise;
- observation থেকে checkable।

---

## 14. Recording/Slides-এ আবার দেখার মতো Unclear Sections

1. **Course code inconsistency**  
   [UNCLEAR] Main material COMP64602, কিন্তু UML/FSM deck COMP26120 এবং commitment example COMP64620।

2. **FIPA / ACL transcript garbling**  
   [UNCLEAR] Transcript কিছু জায়গায় “FIFA ACM” বলে; slides clearly FIPA ACL refer করে।

3. **Sequence diagram transcript garbling**  
   [UNCLEAR] Transcript “sequence sagas” / “secrets diagrams” বলে; slides এবং context sequence diagrams indicate করে।

4. **FSM update argument order**  
   [UNCLEAR] State diagram এবং `\Sigma` ব্যবহার করে:

   ```latex
   Update(s,b)
   ```

   কিন্তু formal transition slide দেয়:

   ```latex
   \delta(S2, Update(b,s)) \rightarrow S1
   ```

   এটি slide typo নাকি intended—check করো।

5. **Simple protocol accept/reject oddness**  
   [UNCLEAR] Lecturer note করেন protocol slightly weird এবং textbook example-এ accept/reject হয়তো উল্টো হওয়া উচিত কি না ভাবেন। Lecture বলে protocol as given নিতে।

6. **Commitment example `pay` signature**  
   [UNCLEAR] Slide দেয়:

   ```latex
   pay(Customer, Store, Item) \mapsto DECLARE(Customer, Store, paid(Item))
   ```

   কিন্তু protocol এবং examples price payment ব্যবহার করে:

   ```latex
   paid(Price),\ pay(Price),\ pay(£12)
   ```

   Slide-এ `Price` rather than `Item` হওয়া উচিত কি না check করো।

7. **Commitment example `reject` parenthesis**  
   [UNCLEAR] Slide-এর `RELEASE(...)` expression-এ closing parenthesis missing মনে হয়।

8. **Commitments এবং institutions wording**  
   [UNCLEAR] Environment events observe করে institutional facts/events-এ map করার phrase transcript garble করেছে।

9. **Argumentation smart-home outcome**  
   [UNCLEAR] Transcript বলে system decide করে “not to contact the police, but to contact the police.” Surrounding explanation indicate করে intended outcome সম্ভবত police contact না করে parents contact করা, কিন্তু recording check করতে হবে।

10. **Winning strategy definition**  
    [UNCLEAR] Transcript বলে each dispute opponent-এর argument দিয়ে ends, তারপর explain করে proponent has had the final say। এগুলো conflict করে। Exact formal definition revisit করো।

11. **Dialogue-game logical conditions**  
    [UNCLEAR] Agent কখন `\phi` claim করতে পারে, `why(\phi)` ask করতে পারে, এবং `\phi` since `\psi` assert করতে পারে—এই conditions transcript garble করেছে। Exact knowledge-base condition এবং attack relation-এর জন্য বিশেষ করে re-listen করো।

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
