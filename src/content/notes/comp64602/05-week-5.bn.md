---
subject: COMP64602
chapter: 5
title: "Week 5"
language: bn
---

# COMP64620 স্টাডি নোটস: এজেন্টদের জন্য নন-মোনোটনিক রিজনিং

**কোর্স:** COMP64620  
**লেকচার ক্লাস্টার:** এজেন্টদের জন্য নন-মোনোটনিক রিজনিং  
**লেকচার টপিকস:** Maintaining Truth; Negation as Failure / Closed World Assumption; Default Logic; Circumscription

**টপিক ও স্কোপ:** এই লেকচারগুলো ব্যাখ্যা করে কেন কোনো এজেন্টের চারপাশের জগৎ বদলালে, অথবা তথ্য অসম্পূর্ণ হলে, এজেন্টের **নন-মোনোটনিক রিজনিং** দরকার হয়। আলোচনা শুরু হয়েছে belief base-এ truth maintenance দিয়ে; তারপর default-style reasoning-এর তিনটি পদ্ধতি এসেছে: **negation as failure / closed world assumption**, **default logic**, এবং **circumscription**।

**ব্যবহৃত উৎস:** Maintaining Truth, Negation as Failure / Closed World Assumption, Default Logic, এবং Circumscription বিষয়ের আপলোড করা ট্রান্সক্রিপ্ট ও স্লাইড PDF।

---

## 1. Maintaining Truth

### 1.1 কেন truth maintenance দরকার

#### Intuition

এজেন্ট এমন জগতে কাজ করে যেখানে পরিস্থিতি বদলায়। এজেন্ট তার সেন্সরের মাধ্যমে যা perceive করতে পারে, তা বদলাতে পারে কারণ:

- এজেন্ট নিজে নড়ে/সরতে পারে;
- জগতের বস্তুগুলো নড়তে পারে;
- জগতের বস্তুগুলোর অবস্থা বদলাতে পারে।

এটি logical reasoning-এর জন্য সমস্যা তৈরি করে। কোনো এক সময়ে logical reasoning থেকে যে conclusion পাওয়া গেছে, পরের সময়ে সেটি আর বৈধ নাও থাকতে পারে। লেকচারার দুটি সম্পর্কিত ব্যাপার আলাদা করেছেন:

1. **Default assumptions may be revised** — আরও তথ্য এলে default assumption বদলাতে হতে পারে।
2. **The actual truth of the world may change** — জগতের সত্য নিজেই বদলাতে পারে; গতকাল যা সত্য ছিল আজ তা সত্য নাও হতে পারে।

তাই এজেন্টকে আগের conclusion প্রত্যাহার করতে হতে পারে। এ কারণেই এজেন্টদের **non-monotonic reasoning** দরকার।

**Connection:** লেকচারার এটি আগের **beliefs, desires, intentions** এবং BDI-style system-এ belief revision-এর আলোচনার সঙ্গে যুক্ত করেছেন। আগের default assumption বিষয়টির সঙ্গেও এখানে সংযোগ আছে।

---

### 1.2 Monotonic বনাম non-monotonic reasoning

#### Key concept: monotonic logic

**Intuition:**  
কোনো logic monotonic হলে knowledge base-এ নতুন তথ্য যোগ করলে নতুন conclusion পাওয়া যেতে পারে, কিন্তু আগে পাওয়া conclusion হারিয়ে যায় না।

**Formal definition from the lecture/slides:**  
একটি logical system **monotonic** যদি information যোগ করার সঙ্গে সঙ্গে inference-এর সেট, অর্থাৎ entailed sentences-এর সেট, শুধু বাড়তে পারে; কমে না।

$$
\forall \alpha, \beta.\; KB \vDash \alpha \implies KB \wedge \beta \vDash \alpha
$$

অর্থ:

- যদি knowledge base $KB$ থেকে $\alpha$ entail হয়,
- তাহলে $KB$-তে অতিরিক্ত তথ্য $\beta$ যোগ করলেও $\alpha$ entail হওয়া বন্ধ হবে না।

অতএব যদি:

$$
KB \vDash \alpha
$$

তাহলে monotonic logic-এ:

$$
KB \wedge \beta \vDash \alpha
$$

#### Key concept: non-monotonic logic

**Intuition:**  
কোনো logic non-monotonic হলে knowledge base-এ নতুন তথ্য যোগ করলে আগের conclusion invalid হয়ে যেতে পারে।

**Formal definition:**  
একটি logical system **non-monotonic** যদি উপরের monotonicity property satisfy না করে।

অর্থাৎ এমন হতে পারে:

$$
KB \vDash \alpha
$$

কিন্তু:

$$
KB \wedge \beta \nvDash \alpha
$$

লেকচারের intuition:

- Defaults ব্যবহার করলে কোনো entity সম্পর্কে default property infer করা যায়।
- পরে জানা গেল entity-টি abnormal বা exceptional।
- তখন নতুন তথ্য default inference-টিকে block করে।

এই লেকচারে অতিরিক্ত complication হলো: শুধু exception আবিষ্কৃত হচ্ছে না; **facts genuinely change** — facts নিজেই বদলাতে পারে।

Transcript-এর উদাহরণ:

- এজেন্ট আগে বিশ্বাস করেছিল যে সে কোনো জায়গায় পৌঁছাতে পারবে।
- পরে সে জানল পথে obstacle আছে।
- তখন reachability সম্পর্কে তার beliefs revise করতে হবে।

---

### 1.3 BDI-style agents-এ belief base এবং efficient reasoning

লেকচারার truth maintenance-কে BDI systems-এর সঙ্গে যুক্ত করেছেন।

#### Basic BDI-style belief representation

Agents-এর একটি **set of beliefs** থাকে। Efficiency-এর জন্য ideal case হলো:

- lookup time-এ কোনো logical inference না করা;
- কোনো fact belief set-এ আছে কি না শুধু সেটি check করা;
- hash-like structure-এর মতো efficient lookup mechanism ব্যবহার করা।

তাই belief base-কে যদি facts-এর database হিসেবে ধরা হয়, তাহলে $p$ believed কি না check করা মানে membership check করা:

$$
p \in Beliefs
$$

#### কিন্তু sophisticated reasoning-এর জন্য inference দরকার

Agent যদি আরও sophisticated reasoning করতে চায়, তাহলে নতুন information এলে inference rules apply করে belief set-এ নতুন beliefs যোগ করতে পারে।

Example pattern:

$$
\phi \Rightarrow \psi
$$

System যদি শেখে:

$$
\phi
$$

তাহলে inference দিয়ে যোগ করতে পারে:

$$
\psi
$$

এটি **forward chaining** দিয়ে করা যেতে পারে। লেকচারার বলেন, শিক্ষার্থীদের এটি আগের semester-এ দেখা থাকার কথা।

**Connection:** Forward chaining আগের semester-এর material-এর সঙ্গে linked।

---

### 1.4 Basic truth maintenance problem

ধরা যাক নতুন information একটি simple literal form-এ আসে:

$$
\phi
$$

অথবা:

$$
\neg \phi
$$

যেখানে $\phi$ একটি atomic statement।

লেকচারার স্পষ্ট করে বলেন, এটি অনেক conjunction, disjunction, implication-সহ কোনো জটিল formula নয়। এটি শুধু literal: statement-টি true, অথবা তার negation true।

#### Naive update rule: পুরোনো তথ্য overwrite করা

নতুন information যদি হয়:

$$
\phi
$$

এবং database-এ বর্তমানে থাকে:

$$
\neg \phi
$$

তাহলে $\neg \phi$ remove করে $\phi$ add করা হয়।

নতুন information যদি হয়:

$$
\neg \phi
$$

এবং database-এ বর্তমানে থাকে:

$$
\phi
$$

তাহলে $\phi$ remove করে $\neg \phi$ add করা হয়।

Naive approach-এর idea:

> New information overwrites old information.

#### কেন এটি যথেষ্ট নয়

সমস্যা হলো, পুরোনো fact থেকে অন্য facts infer করা হয়ে থাকতে পারে।

Slides-এর worked example:

Initial rule:

$$
\phi \Rightarrow \psi
$$

Initial knowledge base:

$$
KB = \{\phi\}
$$

Inference ব্যবহার করে $\psi$ যোগ করা হলো, ফলে:

$$
KB = \{\phi, \psi\}
$$

এখন ধরা যাক system শেখে:

$$
\neg \phi
$$

আমরা $\phi$ remove করে $\neg \phi$ add করি। কিন্তু $\psi$-ও remove করতে হবে, কারণ $\psi$ database-এ ছিল শুধু $\phi$-এর কারণে।

তাই $\neg \phi$ শেখার পরে system-এর database শুধু এমন হওয়া উচিত নয়:

$$
\{\neg \phi, \psi\}
$$

কারণ $\psi$-এর justification হারিয়ে গেছে।

লেকচারার আরও বলেন, system হয়তো $\psi$ false ভাবার কারণও পেতে পারে; তবে মূল point হলো system-এর কাছে আর $\psi$ believe করার reason নেই।

---

### 1.5 Truth Maintenance Systems

Truth Maintenance Systems হলো এমন technique-গুলোর সমষ্টি, যেগুলো database বা belief base-কে agent-এর current understanding of the world-এর সঙ্গে consistent রাখে।

লেকচারে তিনটি main approach দেওয়া হয়েছে।

---

### 1.5.1 Facts log করা এবং inference rerun করা

#### Algorithm / procedure

Facts কখন database-এ added হয়েছে তার log রাখা হয়।

কোনো fact remove হলে:

1. log-এ খুঁজে বের করা হয় fact-টি কখন add হয়েছিল।
2. সেই fact remove করা হয়।
3. তার পর থেকে added সব facts remove করা হয়।
4. inference আবার run করা হয়।
5. যে facts এখনও infer করা যায়, সেগুলো আবার add করা হয়।

#### Advantage

এই পদ্ধতি conceptually simple।

#### Problems

লেকচারার দুটি problem দেন।

##### Problem 1: inefficiency

এতে অনেক unnecessary inference আবার করতে হতে পারে।

যদি শুধু একটি old fact বদলায়, তাহলে সেটির পরে সবকিছু delete করে inference rerun করলে এমন অনেক fact recompute করা হয় যেগুলো affected হয়নি।

##### Problem 2: later perceptual facts হারিয়ে যায়

Transcript-এর worked example:

1. সময় $t_1$-এ agent শেখে যে পথে obstacle আছে।
2. সময় $t_2$-এ agent শেখে highway-তে একটি red car আছে।
3. সময় $t_3$-এ agent শেখে obstacle সরানো হয়েছে।

Logging method ব্যবহার করলে:

- system original obstacle fact-এর পরের সব information delete করে;
- ফলে red car সম্পর্কে later fact-টিও delete হয়ে যায়;
- inference rerun করলেও red car fact ফিরে আসবে না, যদি fact-টি inference নয় বরং perception থেকে এসে থাকে।

তাই logging ভালো কাজ করে না যখন:

- perception থেকে continuous নতুন facts আসছে;
- world genuinely changing;
- later facts independent perceptual inputs, inferred consequences নয়।

---

### 1.5.2 Dependencies-কে justifications হিসেবে track করা

লেকচারার এটিকে better approach হিসেবে describe করেন।

#### Key concept: justification

**Justification** record করে কোন অন্য sentences true হলে একটি sentence true থাকে।

কোনো sentence যদি অন্য facts-এর ওপর depend করে, system তাকে সেই facts-এর সঙ্গে link করে। কোনো justification হারিয়ে গেলে sentence remove বা inactive করা যায়।

Example pattern:

$$
\phi \Rightarrow \psi
$$

যদি $\psi$, $\phi$ থেকে inferred হয়ে থাকে, তাহলে $\psi$-এর justification-এর মধ্যে $\phi$ থাকবে।

যদি $\phi$ remove করা হয়, তাহলে $\psi$ তার justification হারায়।

#### In/out marking

লেকচারার বলেন, অনেক system facts বারবার literally delete ও re-add করে না। বরং facts-কে mark করে:

- **in**: বর্তমানে knowledge base / belief base-এর active অংশ;
- **out**: বর্তমানে active knowledge base / belief base-এর অংশ নয়।

এটি useful কারণ facts নিয়মিত in এবং out হতে পারে। Database entry delete করে আবার reconstruct করার চেয়ে in/out marker flip করা efficient।

#### Justification Truth Maintenance System

Transcript এটিকে **justification truth maintenance system** বলে।

Core idea:

- কোন facts কোন অন্য facts-কে justify করে তা track করা;
- কোনো justification KB থেকে out হলে dependent facts-ও out হতে পারে;
- wholesale deletion ছাড়াই current consistency maintain করা।

---

### 1.5.3 Assumption-based systems

এরপর lecture idea-টি extend করে।

Justification-based system-এ মূলত দুটি group থাকে:

- facts that are **in** — current state of the world represent করে;
- facts that are **out** — অতীতে true ছিল বা ভবিষ্যতে true হতে পারে, কিন্তু এখন active নয়।

**Assumption-based system**-এ system several possible states of the world store করে।

#### Key concept: assumptions

Facts-কে তাদের উপর নির্ভরশীল assumption set-এর সঙ্গে link করা হয়। কোনো fact শুধু সেই situations-এ true যেখানে তার সব assumptions true।

তাই শুধু জিজ্ঞেস করা হয় না:

$$
\text{Is } \phi \text{ currently in or out?}
$$

বরং track করা হয়:

$$
\phi \text{ is true under assumption set } A
$$

World বদলালে agent identify করে কোন state of the world প্রযোজ্য, এবং সেই state-এর সঙ্গে associated facts ব্যবহার করে।

#### Purpose

এর ফলে:

- several possible world states represent করা যায়;
- তাদের মধ্যে flexibly switch করা যায়;
- reasoning একটি single flat database of facts-এর মধ্যে বাঁধা থাকে না।

---

### 1.6 End-of-lecture transition

লেকচারার বলেন, সপ্তাহের বাকি অংশে **defaults** নিয়ে reasoning আরও দেখা হবে, কারণ defaults world changing-এর একটি interesting case এবং এদের জন্য অনেক logics আছে।

তিনি আরও বলেন, modern BDI systems সাধারণত “halfway house” ধরনের approach নেয়; তারা এমন করে না যে একটি single fact database maintain করে inference দিয়ে সব possible facts insert করে।

---

## 2. Negation as Failure / Closed World Assumption

### 2.1 Negation as failure কী

লেকচার topic হলো **Negation as Failure**, যা **Closed World Assumption** নামেও পরিচিত।

লেকচারার বলেন, practical reasoning এবং practical logic-এ এটি widely used।

#### Key concept: negation as failure

**Intuition:**  
System যদি কোনো কিছু true প্রমাণ করতে না পারে, তাহলে সেই failure-কে evidence হিসেবে ধরে যে জিনিসটি false।

**Formal definition from slides/transcript:**

$$
KB \nvDash \phi \quad \text{is equivalent to} \quad KB \vDash \neg \phi
$$

অর্থাৎ $\phi$ যদি $KB$ থেকে derive করা না যায়, তাহলে system conclude করে $\neg \phi$।

Classical logic-এ এটি normally valid নয়। Classical logic-এ $\phi$ prove করতে না পারা মানেই $\neg \phi$ true নয়।

---

### 2.2 Simple robot-location example

Knowledge base:

$$
KB = \{at(1,2),\; see(obstacle)\}
$$

Lecturer-এর interpretation:

- $at(1,2)$: robot coordinate $(1,2)$-এ আছে।
- $see(obstacle)$: robot obstacle দেখতে পাচ্ছে।

Question:

$$
at(0,0)?
$$

System knowledge base থেকে derive করতে পারে না:

$$
at(0,0)
$$

Negation as failure অনুযায়ী, তাই system assume করে:

$$
\neg at(0,0)
$$

তাই $at(0,0)$ knowledge base-এ নেই এবং derive করা যায় না বলে system conclude করে robot $(0,0)$-এ নেই।

---

### 2.3 More complicated checked-square example

Lecture একটি grid/square example দেয়।

Knowledge base:

$$
checked(0,0)
$$

$$
checked(1,0)
$$

$$
checked(2,0)
$$

$$
obstacle(1,0)
$$

Rule:

$$
checked(X,Y) \wedge \neg obstacle(X,Y) \rightarrow clear(X,Y)
$$

Interpretation:

- squares $(0,0)$, $(1,0)$, এবং $(2,0)$ check করা হয়েছে।
- $(1,0)$-এ obstacle দেখা হয়েছে।
- কোনো square checked এবং সেই square-এ obstacle না থাকলে square clear।

#### Derivation of $clear(0,0)$

আমাদের আছে:

$$
checked(0,0)
$$

Knowledge base-এ নেই:

$$
obstacle(0,0)
$$

এবং derive-ও করা যায় না:

$$
obstacle(0,0)
$$

তাই negation as failure দিয়ে:

$$
\neg obstacle(0,0)
$$

এখন rule antecedent satisfied:

$$
checked(0,0) \wedge \neg obstacle(0,0)
$$

অতএব:

$$
clear(0,0)
$$

#### Derivation of $clear(2,0)$

আমাদের আছে:

$$
checked(2,0)
$$

Knowledge base-এ নেই:

$$
obstacle(2,0)
$$

এবং derive-ও করা যায় না:

$$
obstacle(2,0)
$$

তাই negation as failure দিয়ে:

$$
\neg obstacle(2,0)
$$

তারপর:

$$
checked(2,0) \wedge \neg obstacle(2,0)
$$

অতএব:

$$
clear(2,0)
$$

#### কেন $clear(1,0)$ derive হয় না

$(1,0)$-এর জন্য knowledge base-এ আছে:

$$
obstacle(1,0)
$$

তাই আমরা পাই না:

$$
\neg obstacle(1,0)
$$

সুতরাং rule antecedent $(1,0)$-এর জন্য satisfied হয় না। Lecture শুধু derive করে:

$$
clear(0,0)
$$

এবং:

$$
clear(2,0)
$$

---

### 2.4 Agents-এর জন্য কেন এটি useful

লেকচারার এটিকে agent paradigm-এর সঙ্গে connect করেন।

Agents perception থেকে facts পায়: যা তারা দেখে বা sense করে। Negation as failure ব্যবহার করে তারা absence থেকেও reason করতে পারে:

- agent কোনো square check করেছে;
- এবং সেখানে obstacle দেখেনি;
- তাহলে সে infer করতে পারে square clear।

এটি useful কারণ agents প্রায়ই যা perceive করেছে অথবা perceive করেনি তার ওপর ভিত্তি করে act করতে হয়।

---

### 2.5 BDI belief revision-এ negation as failure

Lecture বলে, অনেক BDI system **forward chaining** ব্যবহার করে knowledge base-এ প্রতিটি possible consequence insert করে না।

বরং তারা:

1. perception থেকে পাওয়া facts belief base-এ store করে;
2. inference rules store করে;
3. query answer করার সময় rule-based inference এবং negation as failure ব্যবহার করে;
4. সাধারণত proactively সব consequence derive না করে **backward chaining** ব্যবহার করে।

#### Forward chaining approach

Forward chaining system:

- perceptual facts add করে;
- সব possible consequences infer করে;
- সেসব consequences knowledge base-এ insert করে;
- পরে কোনো fact present কি না lookup করে।

New facts frequently এলে এটি expensive হতে পারে, কারণ system বারবার অনেক consequences derive করে।

#### BDI systems-এ backward chaining approach

Lecturer বলেন, BDI systems প্রায়ই:

- observed facts রাখে;
- rules রাখে, যেমন:

$$
checked(X,Y) \wedge \neg obstacle(X,Y) \rightarrow clear(X,Y)
$$

- শুধুমাত্র যখন agent-এর $clear(X,Y)$ জানা দরকার, তখন derive করার চেষ্টা করে।

এতে সময় বাঁচে, কারণ system এমন consequences derive করে না যেগুলো কখনও use করা হবে না।

#### Important condition

এটি programmer-এর sensible inference rules দেওয়ার ওপর depend করে:

- rules কম হওয়া দরকার;
- inference chain খুব long হওয়া উচিত নয়;
- দরকারের সময় reasoning দ্রুত হতে হবে।

---

### 2.6 Negation as failure non-monotonic

Lecture explicitly বলে negation as failure non-monotonic।

আগের example ব্যবহার করে:

Initially:

$$
KB \vDash clear(0,0)
$$

কারণ:

$$
checked(0,0)
$$

এবং negation as failure দিয়ে:

$$
\neg obstacle(0,0)
$$

কিন্তু যদি আমরা add করি:

$$
obstacle(0,0)
$$

তাহলে আর infer করা যায় না:

$$
\neg obstacle(0,0)
$$

তাই আর derive করা যায় না:

$$
clear(0,0)
$$

Slides-এর formal contrast:

$$
KB \vDash clear(0,0)
$$

কিন্তু:

$$
KB \wedge obstacle(0,0) \nvDash clear(0,0)
$$

এটাই non-monotonic pattern: information add করলে আগের conclusion remove হয়ে যায়।

---

### 2.7 Negation as failure-এর semantics

#### Classical monotonic semantics

Classical monotonic logic-এ:

$$
KB \vDash \phi
$$

মানে:

$$
\phi \text{ is true in all models of } KB
$$

একটি **model** of a knowledge base সব variables-কে truth values assign করে এমনভাবে যাতে knowledge base-এর সব formula true হয়।

#### কেন classical model semantics negation as failure-এর সঙ্গে মেলে না

Obstacle example-এ system assume করেছে $(0,0)$-এ obstacle নেই, কারণ সে obstacle দেখতে পায়নি।

কিন্তু classically, knowledge base আসলে $(0,0)$-এ obstacle আছে কি না সে বিষয়ে কিছু বলেনি। তাই knowledge base-এর এমন models থাকতে পারে যেখানে:

$$
obstacle(0,0)
$$

true, যদিও fact-টি knowledge base-এ absent।

তাই negation as failure-এর জন্য অন্য semantics দরকার।

#### Minimal model semantics

Negation as failure-এর অধীনে:

$$
KB \vDash \phi
$$

যদি:

$$
\phi \text{ is true in all minimal models of } KB
$$

একটি **minimal model** হলো এমন model যেখানে true atoms-এর সংখ্যা সবচেয়ে কম।

System therefore unnecessary extra atoms true করা models বাদ দেয়।

Example intuition:

- যদি $obstacle(0,0)$ true হওয়া forced না হয়,
- minimal models সেটিকে true বানাতে পছন্দ করে না;
- তাই closed world assumption-এর অধীনে $\neg obstacle(0,0)$ accept করা হয়।

---

### 2.8 Model preference logics

Lecturer একটি broader class introduce করেন: **model preference logics**।

Model preference logics-এ:

$$
KB \vDash \phi
$$

হয় যখন:

$$
\phi \text{ is true in all preferred models}
$$

Closed world assumption একটি example।

Closed world assumption-এর ক্ষেত্রে:

- preferred models হলো **minimal models**;
- minimal মানে fewest true atoms।

**Connection:** Lecturer বলেন, পরের কয়েকটি video-তে এটি আলোচনা হবে; এটি পরে circumscription lecture-এর সঙ্গে সরাসরি যুক্ত।

---

## 3. Default Logic

### 3.1 Default logic কী

Lecture **default logic** introduce করে negation as failure-এর তুলনায় incomplete এবং changing information নিয়ে reasoning করার আরও sophisticated way হিসেবে।

#### Key concept: default logic

**Intuition:**  
কিছু inference rule শুধু তখন apply করে যখন তার বিরুদ্ধে evidence নেই, অথবা rule apply করলে contradiction তৈরি হয় না।

Default logic এ ধরনের reasoning-এর জন্য:

> Normally, birds fly.  
> কিন্তু যদি জানা থাকে bird exceptional, তাহলে infer করা যাবে না যে সেটি flies।

---

### 3.2 Default rules-এর syntax

Slide syntax দেয়:

$$
A : J / C
$$

#### Formal interpretation from the lecture

$$
A : J / C
$$

মানে:

- $A$ implies $C$,
- provided that $J$-এর justifications knowledge base-এর সঙ্গে consistent।

তাই:

- $A$ হলো prerequisite / condition;
- $J$ হলো justification যা consistent থাকতে হবে;
- $C$ হলো conclusion।

In words:

> If $A$ holds, infer $C$, as long as the justification $J$ does not conflict with what is known.

---

### 3.3 Simple bird example

Lecture standard non-monotonic reasoning example ব্যবহার করে: birds that fly or do not fly।

Default rule:

$$
Bird(X) : Flies(X) / Flies(X)
$$

Interpretation:

- যদি $X$ একটি bird হয়,
- তাহলে assume করো $X$ flies,
- provided that $Flies(X)$ knowledge base-এর সঙ্গে consistent।

Slide বলে, এর মানে আমরা birds fly assume করতে পারি unless:

$$
\neg Flies(X)
$$

knowledge base-এর atomic facts-এ থাকে, অথবা:

$$
KB \vDash \neg Flies(X)
$$

অর্থাৎ knowledge base যদি contain বা entail করে যে bird does not fly, default apply করা যাবে না।

#### Worked version

Suppose:

$$
Bird(Tweety)
$$

এবং knowledge base contain বা entail করে না:

$$
\neg Flies(Tweety)
$$

তাহলে default apply করতে পারে, giving:

$$
Flies(Tweety)
$$

কিন্তু যদি knowledge base contain করে:

$$
\neg Flies(Tweety)
$$

তাহলে default blocked।

---

### 3.4 Penguin/emu example

Lecture আরও specific example দেয়:

$$
Bird(X) : Penguin(X) \vee Emu(X) / Flies(X)
$$

Verbal explanation:

> We can assume a bird flies unless it is a penguin or an emu.

তাই Tweety যদি starling এবং bird হয়, এবং Tweety penguin বা emu এমন কোনো information না থাকে, তাহলে lecture বলে আমরা assume করতে পারি Tweety flies।

[UNCLEAR] Slide-এর displayed formal rule:

$$
Bird(X) : Penguin(X) \vee Emu(X) / Flies(X)
$$

কিন্তু lecturer-এর explanation বলে default blocked হওয়া উচিত যদি $X$ penguin বা emu হয়। আগের syntax $A:J/C$ অনুযায়ী, যেখানে $J$ knowledge base-এর সঙ্গে consistent থাকতে হয়, displayed justification confusing। Verbal meaning clear, কিন্তু formula-তে negation missing হতে পারে অথবা lecture-এ fully explained না করা compressed notation ব্যবহার হতে পারে।

---

### 3.5 Default logic-এর semantics: extensions

Default logic **extension** ধারণা ব্যবহার করে।

#### Key concept: extension

একটি default theory-এর **extension** গঠিত হয়:

1. atomic facts-এর set;
2. non-default rules-এর সব conclusions;
3. theory consistent রেখে যত বেশি possible default rules apply করা যায়, তাদের conclusions।

তাই extension হলো defaults consistently apply করার পরে theory-এর একটি possible completed version।

---

### 3.6 Skeptical বনাম credulous semantics

Lecture বলে default logic-এর বিভিন্ন semantics আছে।

#### Skeptical semantics

$$
\phi
$$

entailed হবে যদি সেটি theory-এর **সব extensions**-এ true হয়।

Skeptical reasoning শুধু সেই conclusions accept করে যা সব possible consistent default application-এ survive করে।

#### Credulous semantics

$$
\phi
$$

entailed হবে যদি সেটি theory-এর **কমপক্ষে একটি extension**-এ true হয়।

Credulous reasoning সেই conclusions accept করে যেগুলো কোনো এক consistent default application দ্বারা supported।

#### Range of possible semantics

Lecturer বলেন skeptical ও credulous semantics-এর মাঝামাঝিও range of semantics হতে পারে।

---

### 3.7 Worked example: default logic-এ Nixon Diamond

Lecture **Nixon Diamond**-কে non-monotonic reasoning-এর famous example হিসেবে দেয়।

#### Facts

$$
Republican(Nixon)
$$

$$
Quaker(Nixon)
$$

#### Default rules

Republicans normally not pacifists:

$$
Republican(X) : \neg Pacifist(X) / \neg Pacifist(X)
$$

Quakers normally pacifists:

$$
Quaker(X) : Pacifist(X) / Pacifist(X)
$$

#### The conflict

Nixon দুটোই:

$$
Republican(Nixon)
$$

এবং:

$$
Quaker(Nixon)
$$

তাই এক default support করে:

$$
\neg Pacifist(Nixon)
$$

আরেক default support করে:

$$
Pacifist(Nixon)
$$

Question:

$$
Pacifist(Nixon)?
$$

অথবা:

$$
\neg Pacifist(Nixon)?
$$

#### Two extensions

Slides দুটি extensions দেয়।

Extension 1:

$$
\{Republican(Nixon),\; Quaker(Nixon),\; \neg Pacifist(Nixon)\}
$$

Extension 2:

$$
\{Republican(Nixon),\; Quaker(Nixon),\; Pacifist(Nixon)\}
$$

দুটিই internally consistent, কিন্তু Nixon pacifist কি না সে বিষয়ে opposite conclusions support করে।

#### Skeptical semantics result

Skeptical semantics-এ কোনো conclusion entailed নয়:

$$
KB \nvDash Pacifist(Nixon)
$$

এবং:

$$
KB \nvDash \neg Pacifist(Nixon)
$$

কারণ প্রতিটি conclusion দুই extension-এর শুধু একটিতে আছে, দুটিতে নয়।

#### Credulous semantics result

Credulous semantics-এ দুটো conclusion-ই entailed:

$$
KB \vDash Pacifist(Nixon)
$$

এবং:

$$
KB \vDash \neg Pacifist(Nixon)
$$

কারণ প্রতিটি conclusion কমপক্ষে একটি extension-এ আছে।

#### কেন preferred extensions useful

Lecturer বলেন, normally আমরা **preferred extensions** ধারণা চাই।

Example preference ordering:

> Religion tends to be more important than political affiliation.

যদি Quaker rule Republican rule-এর চেয়ে preferred হয়, তাহলে যে extension support করে:

$$
Pacifist(Nixon)
$$

সেটি preferred।

তাই ঐ preference-এর অধীনে আমরা conclude করব:

$$
Pacifist(Nixon)
$$

Lecturer আরও বলেন, Nixon Diamond-এর দুই extension same size, তাই শুধু “minimal” বা size-based extension choosing conflict resolve করে না।

---

## 4. Circumscription

### 4.1 Circumscription কী

[UNCLEAR] Transcript-এ বারবার “subscription” বা “circumspection” এসেছে, কিন্তু slides স্পষ্ট করে topic হলো **circumscription**।

#### Key concept: circumscription

**Intuition:**  
Circumscription ধরে নেয় যে selected predicates false, unless known to be true।

Selected predicates-গুলোকে বলা হয় **circumscribed**।

Slide-এর key idea:

> Some predicates are assumed to be false, circumscribed, unless known to be true.

---

### 4.2 Circumscription বনাম closed world assumption

Lecturer circumscription-কে closed world assumption-এর refined version হিসেবে describe করেন।

#### Closed world assumption

Closed world assumption-এ সব predicates false ধরে নেওয়া হয় unless known true।

#### Circumscription

Circumscription-এ শুধু selected predicates false ধরে নেওয়া হয় unless known true।

তাই circumscription আরও selective:

- Closed world assumption: সব atoms/predicates-এর truth minimise করা হয়।
- Circumscription: selected circumscribed predicates minimise করা হয়।

---

### 4.3 `Flightless` দিয়ে simple bird example

Lecture example দেয় যেখানে:

$$
Flightless
$$

circumscribed।

Rule:

$$
Bird(X) \wedge \neg Flightless(X) \rightarrow Flies(X)
$$

কারণ $Flightless$ circumscribed, system assume করে:

$$
\neg Flightless(X)
$$

unless system জানে:

$$
Flightless(X)
$$

তাই system যদি জানে:

$$
Bird(X)
$$

এবং না জানে:

$$
Flightless(X)
$$

তাহলে infer করতে পারে:

$$
Flies(X)
$$

#### Worked version

Suppose:

$$
Bird(Tweety)
$$

এবং $Flightless$ circumscribed।

Knowledge base যদি না বলে:

$$
Flightless(Tweety)
$$

তাহলে circumscription assume করে:

$$
\neg Flightless(Tweety)
$$

এখন rule apply করা যায়:

$$
Bird(Tweety) \wedge \neg Flightless(Tweety) \rightarrow Flies(Tweety)
$$

অতএব:

$$
Flies(Tweety)
$$

পরে system যদি শেখে:

$$
Flightless(Tweety)
$$

তাহলে inference to:

$$
Flies(Tweety)
$$

blocked।

---

### 4.4 Circumscription-এর preferred model semantics

Lecture circumscription-কে model preference logics-এর সঙ্গে আবার connect করে।

Negation-as-failure lecture থেকে recall:

$$
KB \vDash \phi
$$

যদি:

$$
\phi \text{ is true in all preferred models}
$$

Closed world assumption model preference logic-এর একটি example।

Circumscription আরেকটি example।

#### Circumscription-এ preferred models

Circumscription-এর জন্য preferred model হলো এমন model যেখানে circumscribed entities বা objects সবচেয়ে কম।

অতএব preferred models circumscribed predicates-এর extension minimise করে।

Bird example-এ:

- $Flightless$ circumscribed;
- preferred models যত কম সম্ভব জিনিসকে flightless বানায়;
- তাই কোনো কিছু known flightless না হলে তাকে not flightless হিসেবে treat করা হয়।

---

### 4.5 Worked example: circumscription-এ Nixon Diamond

Lecture আবার Nixon Diamond-এ ফিরে আসে, এবার circumscription দিয়ে express করা।

#### Facts

$$
Republican(Nixon) \wedge Quaker(Nixon)
$$

#### Rules

Republicans normally not pacifists unless abnormal in one way:

$$
Republican(X) \wedge \neg Abnormal_1(X) \Rightarrow \neg Pacifist(X)
$$

Quakers normally pacifists unless abnormal in another way:

$$
Quaker(X) \wedge \neg Abnormal_2(X) \Rightarrow Pacifist(X)
$$

#### Circumscribed predicates

$$
Abnormal_1
$$

and:

$$
Abnormal_2
$$

circumscribed।

তাই system prefers models where as few things as possible are abnormal।

#### Conflict

Nixon-এর জন্য:

- যদি $Abnormal_1(Nixon)$ false হয়, Republican rule দেয়:

$$
\neg Pacifist(Nixon)
$$

- যদি $Abnormal_2(Nixon)$ false হয়, Quaker rule দেয়:

$$
Pacifist(Nixon)
$$

কিন্তু দুই conclusion একসঙ্গে থাকলে inconsistent।

#### Two preferred models

Slide বলে দুটি preferred models আছে:

1. একটি model যেখানে:

$$
Abnormal_1(Nixon)
$$

true।

2. আরেকটি model যেখানে:

$$
Abnormal_2(Nixon)
$$

true।

Transcript যোগ করে যে এই logic-এর কাছে এই দুই model-এর মধ্যে কোনো preference নেই।

#### Consequence

এখানে presented circumscription নিজে Nixon Diamond resolve করে না। এটি দুই equally preferred alternatives তৈরি করে: একটি Republican default block করে, অন্যটি Quaker default block করে।

---

## 5. Cross-lecture conceptual map

### 5.1 Overall progression

Lectures একটি sequence তৈরি করে:

1. **Maintaining Truth**  
   Agents-এর non-monotonic reasoning দরকার কারণ তাদের world এবং perceptions বদলায়।

2. **Negation as Failure / Closed World Assumption**  
   কিছু prove করা না গেলে সেটিকে false treat করা। Semantics: minimal models।

3. **Default Logic**  
   Defaults apply করে যখন তাদের justifications consistent। Semantics: extensions, skeptical এবং credulous variants।

4. **Circumscription**  
   কিছু predicates minimise করা হয়: selected predicates false assume করা হয় unless known true। Semantics: preferred models with fewest circumscribed entities।

---

### 5.2 Main semantic contrast

#### Classical monotonic logic

$$
KB \vDash \phi
$$

মানে:

$$
\phi \text{ is true in all models of } KB
$$

#### Negation as failure / closed world assumption

$$
KB \vDash \phi
$$

মানে:

$$
\phi \text{ is true in all minimal models of } KB
$$

#### Model preference logics

$$
KB \vDash \phi
$$

মানে:

$$
\phi \text{ is true in all preferred models}
$$

#### Circumscription

Preferred models হলো যেগুলোতে circumscribed entities/objects সবচেয়ে কম।

#### Default logic

Entailment extensions-এর ওপর based:

- skeptical: true in all extensions;
- credulous: true in at least one extension;
- preferred extension approaches conflict resolve করতে add করা যায়।

---

### 5.3 Main non-monotonic pattern

এই সব systems-এ common idea হলো information add করলে conclusion remove হতে পারে।

Generic form:

$$
KB \vDash \alpha
$$

কিন্তু:

$$
KB \wedge \beta \nvDash \alpha
$$

Lectures থেকে examples:

- Negation as failure:

$$
KB \vDash clear(0,0)
$$

কিন্তু:

$$
KB \wedge obstacle(0,0) \nvDash clear(0,0)
$$

- Bird default:

$$
Bird(X)
$$

may support:

$$
Flies(X)
$$

unless later information gives:

$$
\neg Flies(X)
$$

or an exception such as being flightless.

- Circumscription:

$$
Bird(X) \wedge \neg Flightless(X) \rightarrow Flies(X)
$$

with $Flightless$ circumscribed supports $Flies(X)$, unless $Flightless(X)$ becomes known.

---

## 6. Worked examples collected

### 6.1 Truth maintenance example: inferred facts remove করা

Given:

$$
\phi \Rightarrow \psi
$$

Initial KB:

$$
\{\phi\}
$$

Forward chaining adds:

$$
\psi
$$

So:

$$
KB = \{\phi,\psi\}
$$

New information:

$$
\neg \phi
$$

Naive update gives:

$$
\{\neg \phi,\psi\}
$$

কিন্তু এটি wrong কারণ $\psi$, $\phi$-এর ওপর depend করেছিল।

Truth maintenance requires removing both:

$$
\phi
$$

and:

$$
\psi
$$

কারণ $\psi$-এর justification চলে গেছে।

---

### 6.2 Negation as failure: robot position

Given:

$$
KB = \{at(1,2), see(obstacle)\}
$$

Query:

$$
at(0,0)?
$$

Cannot derive $at(0,0)$, so under negation as failure:

$$
\neg at(0,0)
$$

---

### 6.3 Negation as failure: clear squares

Given:

$$
checked(0,0)
$$

$$
checked(1,0)
$$

$$
checked(2,0)
$$

$$
obstacle(1,0)
$$

$$
checked(X,Y) \wedge \neg obstacle(X,Y) \rightarrow clear(X,Y)
$$

Derive:

$$
clear(0,0)
$$

because:

$$
checked(0,0)
$$

and:

$$
\neg obstacle(0,0)
$$

by negation as failure.

Derive:

$$
clear(2,0)
$$

because:

$$
checked(2,0)
$$

and:

$$
\neg obstacle(2,0)
$$

by negation as failure.

Do not derive:

$$
clear(1,0)
$$

because:

$$
obstacle(1,0)
$$

is explicitly known.

---

### 6.4 Default logic: bird flies

Rule:

$$
Bird(X) : Flies(X) / Flies(X)
$$

Given:

$$
Bird(Tweety)
$$

and no evidence for:

$$
\neg Flies(Tweety)
$$

infer by default:

$$
Flies(Tweety)
$$

If later:

$$
\neg Flies(Tweety)
$$

is known or entailed, the default is blocked.

---

### 6.5 Default logic: Nixon Diamond

Facts:

$$
Republican(Nixon)
$$

$$
Quaker(Nixon)
$$

Defaults:

$$
Republican(X) : \neg Pacifist(X) / \neg Pacifist(X)
$$

$$
Quaker(X) : Pacifist(X) / Pacifist(X)
$$

Extensions:

$$
\{Republican(Nixon), Quaker(Nixon), \neg Pacifist(Nixon)\}
$$

$$
\{Republican(Nixon), Quaker(Nixon), Pacifist(Nixon)\}
$$

Skeptical result:

$$
Pacifist(Nixon)
$$

is not entailed, and:

$$
\neg Pacifist(Nixon)
$$

is not entailed.

Credulous result:

Both are entailed, because each appears in at least one extension.

Preferred extension example:

If religious affiliation is preferred over political affiliation, choose the Quaker-based extension and infer:

$$
Pacifist(Nixon)
$$

---

### 6.6 Circumscription: flightless birds

Circumscribed predicate:

$$
Flightless
$$

Rule:

$$
Bird(X) \wedge \neg Flightless(X) \rightarrow Flies(X)
$$

Given:

$$
Bird(Tweety)
$$

and no known:

$$
Flightless(Tweety)
$$

infer:

$$
\neg Flightless(Tweety)
$$

because $Flightless$ is circumscribed.

Then infer:

$$
Flies(Tweety)
$$

---

### 6.7 Circumscription: Nixon Diamond

Facts:

$$
Republican(Nixon) \wedge Quaker(Nixon)
$$

Rules:

$$
Republican(X) \wedge \neg Abnormal_1(X) \Rightarrow \neg Pacifist(X)
$$

$$
Quaker(X) \wedge \neg Abnormal_2(X) \Rightarrow Pacifist(X)
$$

Circumscribed predicates:

$$
Abnormal_1,\; Abnormal_2
$$

Two preferred models:

$$
Abnormal_1(Nixon)
$$

true in one model, and:

$$
Abnormal_2(Nixon)
$$

true in the other.

Lecture says this logic has no preference between those two models.

---

## 7. Exam flags এবং lecturer emphasis

Uploaded transcripts/slides-এ “this will be on the exam” ধরনের explicit phrase পাওয়া যায়নি।

Revision-এর জন্য high-value emphasized material:

- **Monotonic reasoning**-এর definition:

$$
\forall \alpha,\beta.\; KB \vDash \alpha \implies KB \wedge \beta \vDash \alpha
$$

- **Non-monotonic reasoning** monotonicity-এর failure হিসেবে।
- Changing facts কেন truth maintenance problem তৈরি করে।
- $\phi \Rightarrow \psi$, $KB=\{\phi,\psi\}$, তারপর $\neg\phi$ শেখার example।
- Three truth maintenance approaches:
  - logging and rerunning inference;
  - justifications / in-out marking;
  - assumption-based systems.
- **Negation as failure**-এর definition:

$$
KB \nvDash \phi \iff KB \vDash \neg \phi
$$

- checked/obstacle/clear example।
- কেন negation as failure non-monotonic:

$$
KB \vDash clear(0,0)
$$

কিন্তু:

$$
KB \wedge obstacle(0,0) \nvDash clear(0,0)
$$

- Closed world reasoning-এর minimal model semantics।
- Default logic syntax:

$$
A:J/C
$$

- Default logic extensions, skeptical semantics, এবং credulous semantics।
- Default logic-এ Nixon Diamond।
- Circumscription as minimising selected predicates।
- Circumscription-এর preferred models with fewest circumscribed entities।
- Circumscription-এ Nixon Diamond।

---

## 8. Connections to earlier/later material

### 8.1 Earlier lectures / prior knowledge

- Lecturer maintaining truth-কে **beliefs, desires, intentions** programs এবং belief revision-এর আগের material-এর সঙ্গে connect করেন।
- Lecturer mention করেন যে default assumptions আগে Zhao Yun discuss করেছেন।
- Forward chaining আগের semester-এ দেখা থাকার কথা বলে referenced হয়েছে।
- Minimal/preferred model semantics introduce করার আগে classical model semantics recall করা হয়েছে।

### 8.2 Connections between these lectures

- Truth maintenance generally non-monotonic reasoning motivate করে।
- Negation as failure একটি practical non-monotonic method দেয়।
- Default logic negation as failure-এর চেয়ে more sophisticated হিসেবে introduced।
- Circumscription আরেকটি non-monotonic logic example হিসেবে introduced।
- Closed world assumption এবং circumscription — দুটিই **model preference logics** হিসেবে presented।
- Nixon Diamond default logic এবং circumscription উভয় জায়গায় আসে, conflicting defaults handle করার পার্থক্য দেখাতে।

---

## 9. Unclear / transcript-garbled sections to revisit

- [UNCLEAR] Final lecture transcript-এ “subscription” এবং “circumspection” এসেছে। Slides topic identify করে **circumscription** হিসেবে।
- [UNCLEAR] Transcript phrase “modal preference logic” সম্ভবত **model preference logic**, slides এবং surrounding explanation অনুযায়ী।
- [UNCLEAR] Default logic lecture-এ “impartial and changing information” সম্ভবত “incomplete and changing information”।
- [UNCLEAR] Default rule:

$$
Bird(X) : Penguin(X) \vee Emu(X) / Flies(X)
$$

verbally explain করা হয়েছে “a bird flies unless it is a penguin or an emu” হিসেবে। Displayed formula এবং earlier definition $A:J/C$ পুরোপুরি reconcile হয়নি। এই অংশ re-listen করা উচিত।

- [UNCLEAR] Several transcript terms auto-generated incorrectly: “monitor necessity” for monotonicity, “food chain” for forward chaining, “si obstacle” for `see(obstacle)`, “absolute” for obstacle, “Knicks” for Nixon, “Emmy/Indian” for emu, এবং “abnormal to” for $Abnormal_2$।
- [UNCLEAR] Default logic-এ lecturer বলেন $KB \vDash \phi$ if $\phi$ is true in “some set of extensions”; slides skeptical এবং credulous semantics দিয়ে clarify করে। Exact general entailment condition chosen semantics-এর ওপর depend করে।
