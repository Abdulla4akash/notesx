---
subject: COMP64602
chapter: 7
title: "Week 7"
language: bn
---

# অধ্যয়ন নোট — COMP64602: Argumentation, Evaluation, and Games

**কোর্স:** COMP64602  
**লেকচার টপিক:** Argumentation: structured arguments, abstract argumentation frameworks, evaluating arguments, game theory, এবং argument/dialogue games।  
**টপিক ও পরিসর:** এই লেকচারগুলো মৌলিক graph terminology থেকে শুরু করে formal argument construction, তারপর abstract argument graphs, extension-based evaluation semantics, এবং শেষে agents-দের argumentative interaction মডেল করার জন্য game-theoretic ধারণা ব্যবহার পর্যন্ত এগোয়। Argumentation-কে এখানে competing information, viewpoints, এবং proposed actions মিলিয়ে দেখার একটি পদ্ধতি হিসেবে উপস্থাপন করা হয়েছে।

**ব্যবহৃত উৎস:** Graphs, What is an Argument, Abstract Arguments, Evaluating Arguments, Game Theory, এবং Arguments and Games — এই সব slides ও transcripts।

---

## পরীক্ষার ইঙ্গিত ও লেকচারারের জোর দেওয়া অংশ

### স্পষ্টভাবে examinable নয়

- **Graphs lecture:** লেকচারার বলেছেন graph basics **পরীক্ষায় নেওয়া হবে না**, কিন্তু পরে argumentation এবং planning-এ graph ব্যবহার বোঝার জন্য এগুলো দরকার।
- **Game theory strategy types:** Nash equilibrium এবং dominant strategies স্লাইডে **“Not examinable”** হিসেবে চিহ্নিত। লেকচারার বলেন এগুলো game theory-র fundamental concept, কিন্তু unit-এ এগুলো আর ব্যবহার করা হবে না।

### Definition মুখস্থ করা না লাগলেও ব্যবহার বোঝা জরুরি

- **Prakken’s framework / structured arguments**-এর ক্ষেত্রে লেকচারার বলেছেন সব definition মুখস্থ করা দরকার নেই, কিন্তু বুঝতে হবে; কারণ পরীক্ষায় symbol-গুলোর মানে বের করতে সময় নষ্ট করা যাবে না। প্রয়োজনে definitions দেওয়া হতে পারে।
- **Argumentation frameworks এবং সংশ্লিষ্ট definitions**-এর ক্ষেত্রেও লেকচারার বলেছেন formal definition মুখস্থ করা দরকার নেই, কিন্তু এটি একটি **fundamental concept**, তাই কীভাবে কাজ করতে হয় তা জানতে হবে।

### গুরুত্বপূর্ণ conceptual emphasis

- Argumentation-এ মূল প্রশ্ন classical logic-এর মতো সরাসরি “কী সত্য?” নয়; বরং কাছাকাছি প্রশ্ন হলো **কোন argument জেতে / attacks বিবেচনার পর কোন argument গ্রহণযোগ্য**।
- Abstract argumentation argument-এর internal logical content বাদ দিয়ে **defeat-এর graph structure**-এ মনোযোগ দেয়: arguments হলো nodes, defeats হলো directed edges। এর মাধ্যমে কোন arguments attacks থেকে টিকে থাকে তা নিয়ে reason করা যায়।
- Multi-agent systems-এ শুরুতেই কোনো একক agent সব arguments জানে না। Agents যোগাযোগ করে এবং একে অন্যের arguments attack করার মাধ্যমে argument graph ধীরে ধীরে তৈরি করে।

---

# 1. Graph prerequisites

## 1.1 এখানে graphs কেন আসে

Graphs background terminology হিসেবে পরিচয় করানো হয়েছে। এগুলো argumentation-এর মূল topic নয়, কিন্তু পরে argumentation frameworks আসলে graph-ই হয়: arguments nodes হয়, আর defeat/attack relations directed edges হয়। লেকচারার আরও বলেন planning-এও graphs ব্যবহার হয়।

### Key concept: graph

**Intuition:**  
Graph হলো কিছু object এবং তাদের মধ্যে connection-এর collection।

**Formal definition given:**  
Graph হলো **vertices**-এর একটি set, যা **edges**-এর একটি set দ্বারা connected।

স্লাইডের example:

$$
\langle \{A,B,C,D\}, \{(A,B),(B,C),(A,C)\}\rangle
$$

- Vertices: $A,B,C,D$
- Edges: $(A,B),(B,C),(A,C)$
- Diagram-এ vertex $D$ isolated।

---

## 1.2 Directed graphs

### Key concept: directed graph

**Intuition:**  
Directed graph-এ arrows থাকে: $A$ থেকে $B$ edge, $B$ থেকে $A$ edge-এর একই জিনিস নয়।

**Formal definition given:**  
Directed graph হলো এমন graph যেখানে edges-এর directions থাকে।

স্লাইডের example:

$$
\langle \{A,B,C,D\}, \{(A,B),(B,A),(C,B),(A,C)\}\rangle
$$

এটি represent করে:

- $A \to B$
- $B \to A$
- $C \to B$
- $A \to C$
- $D$ এখনও isolated।

---

## 1.3 Weighted graphs এবং adjacency matrices

### Key concept: weighted graph

**Intuition:**  
Weighted graph edges-এর সঙ্গে costs যুক্ত করে। Graph যদি movement model করে, তাহলে weight হলো ঐ edge ধরে move করার cost।

**Formal definition given:**  
Weighted graph হলো এমন graph যেখানে edges-এর costs একটি **adjacency matrix** দ্বারা defined।

স্লাইডে একই directed graph ব্যবহার করা হয়েছে:

$$
\langle \{A,B,C,D\}, \{(A,B),(B,A),(C,B),(A,C)\}\rangle
$$

edge costs সহ:

- $A \to B = 5$
- $B \to A = 6$
- $C \to B = 1$
- $A \to C = 3$

Adjacency matrix:

$$
\begin{array}{c|cccc}
 & A & B & C & D\\
\hline
A & \infty & 5 & 3 & \infty\\
B & 6 & \infty & \infty & \infty\\
C & \infty & 1 & \infty & \infty\\
D & \infty & \infty & \infty & \infty
\end{array}
$$

লেকচারার ব্যাখ্যা করেন যে $\infty$ মানে ঐ দুই nodes-এর মধ্যে কোনো edge / move নেই। উদাহরণ: $A$ থেকে $A$ হলো $\infty$, কারণ কোনো self-loop দেখানো হয়নি।

---

## 1.4 Paths, trees, এবং rooted trees

### Key concept: path

**Intuition:**  
Path হলো graph-এর মধ্য দিয়ে এমন route যা edges follow করে এবং কোনো vertex repeat করে না।

**Formal definition given:**  
একটি graph:

$$
\langle V,E\rangle
$$

এর জন্য path হলো nodes-এর sequence:

$$
\pi = (v_1,\ldots,v_n)
$$

যেখানে sequence-এর adjacent nodes edge দ্বারা connected:

$$
\forall i,\ \exists e\in E.\ e=(v_i,v_{i+1})
$$

এবং path-এ কোনো vertex একবারের বেশি আসে না।

**[অস্পষ্ট / UNCLEAR]** Slide formula-তে $i$-এর range স্পষ্ট করে বলা হয়নি, কিন্তু intended meaning হলো sequence-এর adjacent positions।

### Key concept: tree

**Intuition:**  
Tree-তে যেকোনো দুই nodes-এর মধ্যে exactly one route থাকে। Branches-এর intuitive idea-র সঙ্গে এটি মেলে: এক point থেকে আরেক point-এ যেতে একটি unique route থাকে।

**Formal definition given:**  
Tree হলো একটি undirected graph যেখানে প্রতিটি pair of nodes exactly one path দ্বারা connected।

### Key concept: rooted tree

**Intuition:**  
Rooted tree হলো tree যেখানে একটি node starting/top node হিসেবে chosen।

**Formal definition given:**  
Rooted tree হলো এমন tree যেখানে একটি vertex-কে root হিসেবে designated করা হয়েছে। লেকচারার বলেন একই tree-তে root হিসেবে ভিন্ন node বেছে নিলে hierarchy কীভাবে ভাবা হয় তা বদলে যায়।

---

# 2. What is an argument?

## 2.1 High-level definition

### Key concept: argument

**Intuition:**  
Argument কোনো claim-এর পক্ষে বা বিপক্ষে reasons দেয় — এমন claim যা সরাসরি settled নয়।

**Definition given:**  
Argument হলো:

> “এমন একটি claim-কে support বা criticise করার জন্য reasons দেওয়া, যা questionable বা open to doubt।”

এটি useful:

- **Multi-agent contexts**-এ, যেখানে agents কী সত্য, কী করা উচিত, অথবা কোনো agent কী করবে — এসব নিয়ে argue করতে পারে।
- **Single-agent contexts**-এ, যেখানে এক agent multiple sources থেকে information নিয়ে তা কী বোঝায় তা assess করতে হয়।

---

## 2.2 Prakken’s framework

Slide-এ এটি **Prakken’s Framework** নামে আছে। Transcript-এ নামটি “Henry Pronk” হিসেবে garbled হয়েছে। Slide wording ব্যবহার করতে হবে।

**[অস্পষ্ট / UNCLEAR]** Auto-transcript-এর “Henry Pronk” transcription error; slide-এ “Prakken’s Framework” লেখা আছে।

### Key concept: argumentation system

**Intuition:**  
Argumentation system logical language, agents যে rules ব্যবহার করতে পারে, contradiction কীভাবে represented হয়, এবং defeasible rules কীভাবে compare করা হবে — এসব define করে।

**Formal definition given:**  
Argumentation system হলো tuple:

$$
(\mathcal L,\ \overline{\cdot},\ \mathcal R_s,\ \mathcal R_d,\ \leq)
$$

যেখানে:

- $\mathcal L$ হলো logical language।
  - লেকচারার বলেন এটি typically first-order logic, কিন্তু temporal logic, modal logic, বা অন্য কোনো logic-ও হতে পারে।
- $\mathcal R_s$ হলো **strict rules**-এর set।
  - Strict rules always apply।
- $\mathcal R_d$ হলো **defeasible rules**-এর set।
  - Defeasible rules generally apply, কিন্তু fail করতে পারে।
- $\leq$ হলো defeasible rules-এর ওপর preference relation।
  - এটি বলে কোন defeasible rules বেশি preferred।
- $\overline{\cdot}$ হলো **contrariness function**:

$$
\overline{\cdot} : \mathcal L \to 2^{\mathcal L}
$$

এটি formulas-এর মধ্যে conflict capture করে। Slide example দেয়:

$$
\neg \phi \in \overline{\phi}
$$

এবং:

$$
\phi \in \overline{\neg \phi}
$$

লেকচারার এটি belief revision week-এর default logic এবং defeasible logic-এর সঙ্গে connect করেন।

---

## 2.3 Knowledge base structure

### Key concept: necessary এবং contestable axioms সহ knowledge base

**Intuition:**  
কিছু information definitely true হিসেবে ধরা হয়, আর কিছু information contested হতে পারে।

**Formal structure given:**  
Knowledge base আরেকটি preference relation-এর সঙ্গে paired:

$$
(\mathcal K,\leq')
$$

Knowledge base আলাদা করা হয়:

- Necessary axioms:

$$
\mathcal K_n
$$

- অন্য axioms যেগুলো contested হতে পারে:

$$
\mathcal K \setminus \mathcal K_n
$$

Relation $\leq'$ হলো knowledge base-এর contestable অংশের ওপর partial order:

$$
\mathcal K \setminus \mathcal K_n
$$

লেকচারার বলেন necessary axioms contested হতে পারে না; অন্য axioms এমন information represent করে যার বিষয়ে uncertainty থাকতে পারে।

---

## 2.4 Arguments-এর formal construction

Arguments-এর থাকে:

- premises,
- conclusion,
- subarguments।

Lecture-এ argument construct করার তিনটি পদ্ধতি দেওয়া হয়েছে।

---

### 2.4.1 Knowledge base থেকে base argument

যদি:

$$
\phi \in \mathcal K
$$

তাহলে $\phi$ একটি argument হতে পারে।

এই argument $A$-এর জন্য:

$$
Prem(A)=\{\phi\}
$$

$$
Concl(A)=\phi
$$

$$
Sub(A)=\{\phi\}
$$

**[অস্পষ্ট / UNCLEAR]** Slide-এ $Sub(A)=\{\phi\}$ লেখা। পরের definitions-এ subarguments-কে arguments হিসেবে treat করা হয়, তাই এই distinction গুরুত্বপূর্ণ হলে textbook/recording দেখে নাও।

---

### 2.4.2 Strict rule ব্যবহার করে argument

যদি $A_1,\ldots,A_n$ arguments হয় এবং $\mathcal R_s$-এ একটি strict rule থাকে:

$$
Concl(A_1),\ldots,Concl(A_n)\to \psi
$$

তাহলে construct করা যায়:

$$
A_1,\ldots,A_n \to \psi
$$

নতুন argument $A$-এর জন্য:

$$
Prem(A)=Prem(A_1)\cup \cdots \cup Prem(A_n)
$$

$$
Concl(A)=\psi
$$

$$
Sub(A)=Sub(A_1)\cup \cdots \cup Sub(A_n)\cup \{A\}
$$

Single arrow $\to$ strict rule ব্যবহারের indication।

---

### 2.4.3 Defeasible rule ব্যবহার করে argument

যদি $A_1,\ldots,A_n$ arguments হয় এবং $\mathcal R_d$-এ একটি defeasible rule থাকে:

$$
Concl(A_1),\ldots,Concl(A_n)\Rightarrow \psi
$$

তাহলে construct করা যায়:

$$
A_1,\ldots,A_n \Rightarrow \psi
$$

নতুন argument $A$-এর জন্য:

$$
Prem(A)=Prem(A_1)\cup \cdots \cup Prem(A_n)
$$

$$
Concl(A)=\psi
$$

$$
Sub(A)=Sub(A_1)\cup \cdots \cup Sub(A_n)\cup \{A\}
$$

Double arrow $\Rightarrow$ defeasible rule ব্যবহারের indication। লেকচারার আরও বলেন $A_1,\ldots,A_n\Rightarrow \psi$-এর মতো expressions-এ commas implicitly conjunctions।

---

## 2.5 Arguments-এর মধ্যে support

### Key concept: support

**Intuition:**  
একটি argument আরেকটি বড় argument-কে support করে যদি সেটি বড় argument তৈরির reasoning-এর অংশ হয়।

**Formal definition given:**  
একটি argument আরেকটি argument-কে support করে যদি সেটি ওই argument-এর subargument হয়।

নিচের worked construction থেকে example:

- $A_1$ supports $A_5$, কারণ $A_5$ তৈরি হয়েছে $A_1$ ব্যবহার করে।
- $A_5$ supports $A_7$, কারণ $A_7$ তৈরি হয়েছে $A_5$ ব্যবহার করে।
- $A_5$ indirectly $A_8$-কেও support করে, কারণ $A_8$ uses $A_7$, এবং $A_7$ uses $A_5$।

---

## 2.6 Arguments-এর মধ্যে attack

Argument $A$, argument $B$-কে তিনভাবে attack করতে পারে: **undercutting**, **rebutting**, এবং **undermining**।

---

### 2.6.1 Undercutting

**Intuition:**  
Undercutting defeasible rule ব্যবহারের ওপরই attack করে।

**Formal definition from slide:**  
Argument $A$, argument $B$-কে undercutting দ্বারা attack করে যদি থাকে:

$$
B' \in Sub(B)
$$

যেখানে $B'$-এর form:

$$
B_1,\ldots,B_n \Rightarrow \psi
$$

এবং:

$$
Concl(A)\in \overline{B'}
$$

**[অস্পষ্ট / UNCLEAR]** Contrariness function formulas-এর ওপর introduced হয়েছে, কিন্তু slide-এ $\overline{B'}$ লেখা, যেখানে $B'$ একটি subargument/rule application। Exact undercut notation গুরুত্বপূর্ণ হলে textbook দেখো।

---

### 2.6.2 Rebutting

**Intuition:**  
Rebutting কোনো defeasible subargument-এর conclusion attack করে।

**Formal definition from slide:**  
Argument $A$, argument $B$-কে rebutting দ্বারা attack করে যদি থাকে:

$$
B' \in Sub(B)
$$

যেখানে $B'$-এর form:

$$
B_1,\ldots,B_n \Rightarrow \psi
$$

এবং:

$$
Concl(A)\in \overline{\psi}
$$

অর্থাৎ $A$-এর conclusion, $B$-এর defeasible subargument-এর conclusion $\psi$-এর contrary।

---

### 2.6.3 Undermining

**Intuition:**  
Undermining কোনো argument-এর contestable premise attack করে।

**Formal definition from slide:**  
Argument $A$, argument $B$-কে undermining দ্বারা attack করে যদি থাকে:

$$
\phi \in Prem(B)\setminus \mathcal K_n
$$

যেখানে:

$$
Concl(A)\in \overline{\phi}
$$

অর্থাৎ $A$-এর conclusion, $B$-এর ব্যবহৃত non-necessary premise contradict করে। $\mathcal K_n$-এর necessary premises এই definition অনুযায়ী undermined হয় না।

---

## 2.7 Defeat

### Key concept: defeat

**Intuition:**  
Attack automatically defeat নয়। একটি attacking argument অন্য argument-কে defeat করে তখনই, যখন preference relations অনুযায়ী সেটি যথেষ্ট strong।

**Formal definition given:**  
Argument $A$, argument $B$-কে defeat করে যদি:

1. $A$ attacks $B$, এবং
2. $A$ is preferred to $B$ based on $\leq$ and $\leq'$।

লেকচারার বলেন arguments-এর মধ্যে preference কীভাবে calculate করা হয় তার details এই lecture-এ covered নয়, কিন্তু defeasible rules এবং non-necessary facts-এর ওপর preference relations ব্যবহার করা হয়।

---

# 3. Worked example: structured arguments construct করা

Lecture-এ একটি knowledge base এবং rule set দেওয়া হয়, তারপর $A_1$ থেকে $A_8$ arguments তৈরি করা হয়।

## 3.1 Given knowledge base and rules

Knowledge base:

$$
\mathcal K=\{p,q,u,r\}
$$

Necessary axioms:

$$
\mathcal K_n=\{p\}
$$

তাই:

- $p$ necessary / contest করা যাবে না।
- $q,u,r$ contestable।

Strict rules:

$$
\mathcal R_s=\{p,q\to s;\ u,v\to w\}
$$

Defeasible rules:

$$
\mathcal R_d=\{p\Rightarrow t;\ s,r,t\Rightarrow v\}
$$

---

## 3.2 Base arguments

$\mathcal K$-এর প্রতিটি formula একটি argument দেয়:

$$
A_1:p
$$

$$
A_2:q
$$

$$
A_3:r
$$

$$
A_4:u
$$

এগুলো knowledge base থেকে direct arguments।

---

## 3.3 $A_5$ derive করা

ব্যবহৃত rule:

$$
p\Rightarrow t
$$

Existing argument:

$$
A_1:p
$$

যেহেতু $Concl(A_1)=p$, defeasible rule apply করা যায়:

$$
A_5:A_1\Rightarrow t
$$

তাই:

$$
Concl(A_5)=t
$$

এটি defeasible, কারণ rule $p\Rightarrow t$ হলো $\mathcal R_d$-এর element।

---

## 3.4 $A_6$ derive করা

ব্যবহৃত rule:

$$
p,q\to s
$$

Existing arguments:

$$
A_1:p,\quad A_2:q
$$

যেহেতু $Concl(A_1)=p$ এবং $Concl(A_2)=q$, strict rule apply করা যায়:

$$
A_6:A_1,A_2\to s
$$

তাই:

$$
Concl(A_6)=s
$$

এটি strict, কারণ rule $p,q\to s$ হলো $\mathcal R_s$-এর element।

---

## 3.5 $A_7$ derive করা

ব্যবহৃত rule:

$$
s,r,t\Rightarrow v
$$

Existing arguments:

$$
A_3:r,\quad A_5:t,\quad A_6:s
$$

যেহেতু $A_3$ concludes $r$, $A_5$ concludes $t$, এবং $A_6$ concludes $s$, defeasible rule apply করা যায়:

$$
A_7:A_3,A_5,A_6\Rightarrow v
$$

তাই:

$$
Concl(A_7)=v
$$

এটি defeasible, কারণ rule $s,r,t\Rightarrow v$ হলো $\mathcal R_d$-এর element।

---

## 3.6 $A_8$ derive করা

ব্যবহৃত rule:

$$
u,v\to w
$$

Existing arguments:

$$
A_4:u,\quad A_7:v
$$

যেহেতু $A_4$ concludes $u$ এবং $A_7$ concludes $v$, strict rule apply করা যায়:

$$
A_8:A_4,A_7\to w
$$

তাই:

$$
Concl(A_8)=w
$$

এটি strict, কারণ rule $u,v\to w$ হলো $\mathcal R_s$-এর element।

---

## 3.7 Example-এ support structure

Construction একটি support chain তৈরি করে:

$$
A_1 \Rightarrow A_5
$$

$$
A_1,A_2 \Rightarrow A_6
$$

$$
A_3,A_5,A_6 \Rightarrow A_7
$$

$$
A_4,A_7 \Rightarrow A_8
$$

তাই:

- $A_1$ supports $A_5,A_6,A_7,A_8$।
- $A_2$ supports $A_6,A_7,A_8$।
- $A_3$ supports $A_7,A_8$।
- $A_4$ supports $A_8$।
- $A_5$ supports $A_7,A_8$।
- $A_6$ supports $A_7,A_8$।
- $A_7$ supports $A_8$।

লেকচারারের point হলো knowledge representation-এর ordinary inference-কে arguments হিসেবে abstract করা যায়, যারা একে অন্যকে support করে।

---

# 4. Worked examples: structured argument system-এ attacks

## 4.1 Rule $p\Rightarrow t$-এর ওপর attack

Slide-এ একটি additional argument দেওয়া হয়েছে:

$$
A_9:A_1\to \neg(p\Rightarrow t)
$$

Slide বলে এটি rebut করবে:

$$
A_5,\ A_7,\ A_8
$$

কারণ $A_5$ defeasible rule $p\Rightarrow t$ ব্যবহার করে, $A_7$-এর subargument হিসেবে $A_5$ আছে, এবং $A_8$-এর subargument হিসেবে $A_7$ আছে।

**[অস্পষ্ট / UNCLEAR]** Slide/example এটিকে rebuttal বলে, কিন্তু earlier formal attack definitions অনুযায়ী এটি defeasible rule-টিকেই attack করছে বলে মনে হয়, যা undercutting-এর সঙ্গে মেলে। Intended label-এর জন্য textbook বা recording check করো।

---

## 4.2 $t$ rebut করা

Slide দেয়:

$$
A_9:A_1\to \neg t
$$

এটি rebut করবে:

$$
A_5,\ A_7,\ A_8
$$

কারণ:

- $A_5$ concludes $t$।
- $\neg t$ contradicts $t$, তাই $A_9$ rebuts $A_5$।
- $A_7$ contains $A_5$ as a subargument।
- $A_8$ contains $A_7$, এবং তাই indirectly $A_5$, as a subargument।
- তাই attack subargument structure ধরে propagate করে।

---

## 4.3 $q$ undermine করা

Slide দেয়:

$$
A_9:A_1\to \neg q
$$

এটি undermine করবে:

$$
A_6,\ A_7,\ A_8
$$

কারণ:

- $A_6$ relies on $A_2:q$।
- $q$ necessary axioms-এ নেই:

$$
q\notin \mathcal K_n
$$

- তাই $q$ contestable।
- $\neg q$ ঐ contestable premise-কে contradict করে।
- অতএব $A_9$ undermines $A_6$।
- যেহেতু $A_7$ depends on $A_6$, এবং $A_8$ depends on $A_7$, attack $A_7$ এবং $A_8$-তেও পৌঁছায়।

---

# 5. Abstract arguments এবং argumentation frameworks

## 5.1 Abstraction-এর motivation

আগের structured-argument lecture-এ arguments-এর internal structure ছিল: premises, conclusions, strict rules, defeasible rules, attacks, এবং preferences।

Abstract argument lecture বলে, এই internal structure ignore করে situation-কে শুধুই graph হিসেবে দেখা যায়:

- arguments are nodes,
- defeats are directed edges।

লেকচারার জোর দেন যে এই abstraction বলে না arguments text, logical formulae, বা অন্য কিছু কি না। এটি শুধু record করে কোন arguments কোন arguments-কে defeat করে।

Slide-এর example graph:

- $A_2$ defeats $A_1$
- $A_4$ defeats $A_1$
- $A_3$ defeats $A_2$
- $A_5$ defeats $A_4$

Intuitive issue:

- $A_1$ is defeated by $A_2$ and $A_4$।
- কিন্তু $A_2$ defeated by $A_3$, এবং $A_4$ defeated by $A_5$।
- তাই $A_1$ ultimately accepted হওয়া উচিত কি না তা decide করার পদ্ধতি দরকার।

---

## 5.2 Formal definition: argumentation framework

### Key concept: argumentation framework

**Intuition:**  
Argumentation framework হলো arguments এবং defeats-এর directed graph।

**Formal definition given:**  
Argumentation framework হলো pair:

$$
AF=\langle \mathcal A,\rightharpoonup\rangle
$$

যেখানে:

- $\mathcal A$ হলো finite set of arguments।
- $\rightharpoonup \subseteq \mathcal A\times \mathcal A$ হলো defeat relation।

আমরা বলি argument $\alpha$ defeats argument $\beta$ যদি:

$$
(\alpha,\beta)\in \rightharpoonup
$$

প্রায়ই লেখা হয়:

$$
\alpha \rightharpoonup \beta
$$

Relation graph nodes-এর মধ্যে arrows হয়ে যায়।

---

## 5.3 $S^+$: একটি set দ্বারা attacked arguments

### Key concept: $S^+$

**Intuition:**  
Arguments-এর set $S$ দিলে, $S^+$ হলো এমন সব arguments যা $S$-এর অন্তত একটি argument দ্বারা attacked।

**Formal definition given:**  
যদি:

$$
S\subseteq \mathcal A
$$

তাহলে define:

$$
S^+=\{\beta\in \mathcal A\mid \alpha\rightharpoonup \beta\ \text{for some}\ \alpha\in S\}
$$

অর্থাৎ $\alpha\in S$ এবং $\alpha$ defeats $\beta$ হলে $\beta\in S^+$।

---

## 5.4 $\alpha^-$: একটি argument-এর attackers

### Key concept: $\alpha^-$

**Intuition:**  
একটি argument $\alpha$-এর জন্য, $\alpha^-$ হলো তাকে attack করা arguments-এর set।

**Formal definition given:**

$$
\alpha^-=\{\beta\in \mathcal A\mid \beta\rightharpoonup \alpha\}
$$

অর্থাৎ $\beta\in \alpha^-$ exactly when $\beta$ defeats $\alpha$।

---

## 5.5 Conflict-free sets

### Key concept: conflict-free

**Intuition:**  
একটি set conflict-free যদি তার members একে অন্যকে defeat না করে।

**Formal definition given:**  
যদি:

$$
S\subseteq \mathcal A
$$

তাহলে $S$ conflict-free যদি:

$$
S\cap S^+=\varnothing
$$

অর্থাৎ $S$-এর কোনো argument $S$-এর আরেক argument-কে attack করে না।

---

## 5.6 Defence

### Key concept: defence

**Intuition:**  
Set $S$ argument $\alpha$-কে defend করে যদি $S$, $\alpha$-এর সব attackers-কে attack করে।

**Formal definition given:**  
$S$ defends $\alpha$ যদি:

$$
\alpha^- \subseteq S^+
$$

অর্থাৎ $\alpha$-কে attack করা প্রতিটি argument নিজেই $S$-এর কোনো argument দ্বারা attacked।

---

## 5.7 Characteristic function

### Key concept: characteristic function

**Intuition:**  
Characteristic function একটি set দ্বারা defended arguments return করে।

**Formal definition given:**

$$
\mathcal F:2^{\mathcal A}\to 2^{\mathcal A}
$$

যদি:

$$
S\subseteq \mathcal A
$$

তাহলে:

$$
\mathcal F(S)=\{\alpha\in \mathcal A\mid S\ \text{defends}\ \alpha\}
$$

তাই $\mathcal F(S)$ হলো এমন সব arguments-এর set যাদের attackers $S$ দ্বারা defeated।

---

## 5.8 Admissible sets

### Key concept: admissible set

**Intuition:**  
Admissible set internally consistent এবং নিজেকে defend করতে সক্ষম।

**Formal definition given:**  
Set $S\subseteq \mathcal A$ admissible যদি:

1. $S$ conflict-free, এবং
2. $S$ defends every element in $S$।

Equivalently:

$$
S\subseteq \mathcal F(S)
$$

লেকচারার এটিকে বলেন conflict-free set of arguments যা framework-এর অন্য arguments-এর বিরুদ্ধে নিজেকে defend করে।

---

## 5.9 Complete extensions

### Key concept: complete extension

**Intuition:**  
Complete extension exactly সেই arguments contain করে যেগুলো সেটি defend করে।

**Formal definition given:**  
Set $S\subseteq \mathcal A$ complete extension যদি:

1. $S$ conflict-free, এবং
2. $S=\mathcal F(S)$।

অর্থাৎ $S$ শুধু self-defending নয়; এটি যেসব arguments defend করে সেগুলোও include করে।

---

# 6. Worked example: admissible এবং complete extension

Graph:

$$
A_3 \rightharpoonup A_2 \rightharpoonup A_1
$$

$$
A_5 \rightharpoonup A_4 \rightharpoonup A_1
$$

ধরা যাক:

$$
S=\{A_1,A_3,A_5\}
$$

## 6.1 $S^+$ compute করা

$S$-এর members দ্বারা attacked arguments:

- $A_1$ attacks nothing।
- $A_3$ attacks $A_2$।
- $A_5$ attacks $A_4$।

তাই:

$$
S^+=\{A_2,A_4\}
$$

---

## 6.2 Conflict-freeness check করা

$$
S=\{A_1,A_3,A_5\}
$$

$$
S^+=\{A_2,A_4\}
$$

$$
S\cap S^+=\varnothing
$$

অতএব $S$ conflict-free।

---

## 6.3 $A_1$-এর defence check করা

$A_1$-এর attackers:

$$
A_1^-=\{A_2,A_4\}
$$

কিন্তু:

$$
S^+=\{A_2,A_4\}
$$

তাই:

$$
A_1^-\subseteq S^+
$$

অতএব $S$ defends $A_1$।

---

## 6.4 $A_3$ এবং $A_5$-এর defence check করা

কিছুই $A_3$ বা $A_5$ attack করে না, তাই:

$$
A_3^-=\varnothing
$$

$$
A_5^-=\varnothing
$$

Empty set সব set-এর subset, তাই:

$$
A_3^-\subseteq S^+
$$

$$
A_5^-\subseteq S^+
$$

অতএব $S$ also defends $A_3$ and $A_5$। লেকচারার বলেন এটি counterintuitive মনে হতে পারে, কিন্তু definition থেকে follow করে।

---

## 6.5 Characteristic function apply করা

যেহেতু $S$ defends $A_1,A_3,A_5$:

$$
\mathcal F(S)=\{A_1,A_3,A_5\}
$$

অতএব:

$$
\mathcal F(S)=S
$$

তাই $S$:

- admissible, কারণ $S\subseteq \mathcal F(S)$,
- complete extension, কারণ $S=\mathcal F(S)$।

---

# 7. Evaluating arguments

## 7.1 Arguments evaluate করার goal

Evaluation lecture জিজ্ঞেস করে argument accepted হওয়া মানে কী। লেকচারার logic-এর semantics-এর সঙ্গে compare করেন, যেখানে আমরা জিজ্ঞেস করি formula সত্য, correct, বা derivable কি না। কিন্তু argumentation আলাদা, কারণ arguments একে অন্যকে attack করতে পারে। Central question হয়:

- কোন argument wins?
- Finally কোন conclusion draw করা হবে?
- কোন argument accept করে further reasoning বা action-এ use করা যাবে?

---

## 7.2 Grounded extensions

### Key concept: grounded extension

**Intuition:**  
Grounded extension হলো smallest complete extension। এটি conservative: শুধু এমন arguments accept করে যেগুলো unattacked arguments থেকে build up করা যায়, তারপর তাদের দ্বারা defended arguments, এবং এভাবে চলতে থাকে।

**Formal definition given:**  
Recall, argument framework:

$$
AF=\langle \mathcal A,\rightharpoonup\rangle
$$

এর complete extension হলো conflict-free set:

$$
S\subseteq \mathcal A
$$

যেখানে:

$$
\mathcal F(S)=S
$$

$S$ grounded extension যদি এটি minimal হয়, অর্থাৎ $S$-এর এমন কোনো subset নেই যা নিজেও complete extension।

### কীভাবে পাওয়া যায়

Lecture states:

- Grounded extension always exists।
- Empty set-এ বারবার $\mathcal F$ apply করে fixed point পাওয়া পর্যন্ত এগোলে এটি পাওয়া যায়:

$$
\varnothing,\quad \mathcal F(\varnothing),\quad \mathcal F(\mathcal F(\varnothing)),\quad \ldots
$$

---

## 7.3 Worked example: grounded extension

একই graph:

$$
A_3 \rightharpoonup A_2 \rightharpoonup A_1
$$

$$
A_5 \rightharpoonup A_4 \rightharpoonup A_1
$$

### Step 1: empty set-এ $\mathcal F$ apply করা

$$
\mathcal F(\varnothing)
$$

Empty set কোনো attacker-কে attack করে কিছু defend করতে পারে না। তাই $\mathcal F(\varnothing)$ দেয় সেই arguments, যাদের attackers নেই এবং তাই defence দরকার নেই।

Graph-এ:

- কিছুই $A_3$ attack করে না,
- কিছুই $A_5$ attack করে না।

তাই:

$$
\mathcal F(\varnothing)=\{A_3,A_5\}
$$

### Step 2: আবার $\mathcal F$ apply করা

$$
\mathcal F(\mathcal F(\varnothing))=\mathcal F(\{A_3,A_5\})
$$

এখন:

- $A_3$ attacks $A_2$,
- $A_2$ attacks $A_1$,
- $A_5$ attacks $A_4$,
- $A_4$ attacks $A_1$।

তাই $\{A_3,A_5\}$ defends $A_1$, কারণ এটি $A_1$-এর উভয় attackers-কে attack করে।

অতএব:

$$
\mathcal F(\{A_3,A_5\})=\{A_1,A_3,A_5\}
$$

Slide লিখেছে:

$$
\mathcal F(\mathcal F(\varnothing))=\{A_1,A_3,A_5\}
$$

### Step 3: fixed point

আবার $\mathcal F$ apply করলে একই set পাওয়া যায়:

$$
\mathcal F(\{A_1,A_3,A_5\})=\{A_1,A_3,A_5\}
$$

তাই:

$$
\{A_1,A_3,A_5\}
$$

এই graph-এর complete extension এবং grounded extension।

---

## 7.4 Preferred extensions

### Key concept: preferred extension

**Intuition:**  
Preferred extension হলো এমন complete extension যা যত বড় হওয়া সম্ভব, required properties না হারিয়ে।

**Formal definition given:**  
$S$ preferred extension যদি এটি maximal হয়। Transcript clarify করে যে এটি maximal complete extension বোঝায়: আর কোনো argument add করলে সেটি complete extension থাকা বন্ধ করে, যেমন conflict তৈরি হয় বা defence হারায়।

---

## 7.5 Worked example: preferred extensions

Graph:

$$
A_1 \leftrightarrow A_2
$$

এবং $A_3$ isolated।

তাই:

- $A_1$ attacks $A_2$,
- $A_2$ attacks $A_1$,
- $A_3$ attacks nobody and is attacked by nobody।

Complete extensions:

$$
\{A_3\}
$$

$$
\{A_1,A_3\}
$$

$$
\{A_2,A_3\}
$$

কেন:

- $\{A_3\}$ complete কারণ $A_3$ unattacked এবং conflict-free।
- $\{A_1,A_3\}$ complete কারণ $A_1$ নিজেকে $A_2$-এর against defend করে, এবং $A_3$ unattacked।
- $\{A_2,A_3\}$ symmetric reason-এ complete।

Preferred extensions হলো maximal ones:

$$
\{A_1,A_3\}
$$

$$
\{A_2,A_3\}
$$

$\{A_3\}$ preferred নয়, কারণ এটি larger complete extensions-এর subset। এই example দেখায় যে একাধিক preferred extension থাকতে পারে।

---

## 7.6 Stable extensions

### Key concept: stable extension

**Intuition:**  
Stable extension কিছু arguments contain করে, এবং set-এর বাইরে থাকা প্রতিটি argument set দ্বারা attacked। কিছুই “unaccounted for” থাকে না।

**Formal definition given:**  
$S$ stable extension যদি:

$$
S^+=\mathcal A\setminus S
$$

Transcript এটিকে ব্যাখ্যা করে: সব arguments হয় $S$-এ আছে, নয়তো $S$ দ্বারা attacked।

### Worked example

Graph:

$$
A_3 \rightharpoonup A_2 \rightharpoonup A_1
$$

$$
A_5 \rightharpoonup A_4 \rightharpoonup A_1
$$

এর জন্য set:

$$
S=\{A_1,A_3,A_5\}
$$

যেখানে:

$$
S^+=\{A_2,A_4\}
$$

এবং:

$$
\mathcal A\setminus S=\{A_2,A_4\}
$$

অতএব:

$$
S^+=\mathcal A\setminus S
$$

তাই:

$$
\{A_1,A_3,A_5\}
$$

একটি stable extension।

---

## 7.7 Semi-stable extensions

### Key concept: semi-stable extension

**Intuition:**  
Stable extensions always exist করে না। Semi-stable extension একটি weaker notion: এটি complete extension, এবং এটি নিজের contained arguments plus attacked arguments maximal করে।

**Formal definition given:**  
$S$ semi-stable extension যদি:

1. $S$ complete extension, এবং
2. $S\cup S^+$ maximal।

---

## 7.8 Worked example: semi-stable but not stable

Slide-এ $A_1,A_2,A_3$-এর মধ্যে cycle, এবং $A_4$ attacking $A_2$ দেখানো হয়েছে। Given conclusion:

$$
\{A_4\}
$$

grounded, preferred, এবং semi-stable; কিন্তু stable নয়।

Lecture-এর reasoning:

- $A_1,A_2,A_3$ একটি awkward cycle তৈরি করে।
- ঐ cycle-এর arguments-এর defences এমন arguments-এর ওপর rely করে যাদের সঙ্গে তারা conflict করে।
- তাই কোনো admissible set $A_1$ contain করতে পারে না, একইভাবে $A_2$ ও $A_3$-এর জন্যও।
- $A_4$ cycle-এর বাইরে এবং $A_2$ attack করে।
- তাই $\{A_4\}$ grounded extension।
- যেহেতু admissibility preserve করে $A_1,A_2,A_3$ add করা যায় না, $\{A_4\}$ preferred-ও।
- এটি semi-stable কারণ $S\cup S^+$ constraints-এর মধ্যে যত বড় হতে পারে তত বড়।
- এটি stable নয় কারণ $A_1,A_2,A_3$ সবাই $S\cup S^+$ দ্বারা covered নয়।

যদি $S=\{A_4\}$:

$$
S^+=\{A_2\}
$$

তাহলে:

$$
S\cup S^+=\{A_4,A_2\}
$$

কিন্তু এটি সব arguments cover করে না:

$$
\mathcal A=\{A_1,A_2,A_3,A_4\}
$$

তাই:

$$
S^+\neq \mathcal A\setminus S
$$

অতএব $S$ stable নয়।

**[অস্পষ্ট / UNCLEAR]** Slide text বলে “Because $A_1$ attacks $A_2$ and is defended by $A_2$ no admissible set can contain $A_1$”; wording garbled। Intended point হলো cycle-এর কারণে $A_1,A_2,A_3$ admissible set-এ include করা যায় না।

---

## 7.9 Acceptance semantics

Final evaluation slide argument accepted হওয়া মানে কী — তার semantics দেয়।

ধরা যাক:

$$
AF=\langle \mathcal A,\rightharpoonup\rangle
$$

এবং framework-এর extensions:

$$
\mathcal E_1,\ldots,\mathcal E_n
$$

ধরা যাক:

$$
\alpha\in \mathcal A
$$

### Skeptical acceptance

**Intuition:**  
Argument skeptically accepted যদি প্রতিটি extension সেটিকে accept করে। এটি high standard।

**Formal definition:**

$$
\alpha\ \text{is skeptically accepted iff}\ \alpha\in \mathcal E_i,\ \forall i=1,\ldots,n
$$

অর্থাৎ সব extensions $\alpha$-এর বিষয়ে agree করে।

---

### Credulous acceptance

**Intuition:**  
Argument credulously accepted যদি অন্তত একটি extension সেটিকে accept করে। এটি weaker standard।

**Formal definition:**

$$
\alpha\ \text{is credulously accepted iff}\ \exists i.\ \alpha\in \mathcal E_i
$$

অর্থাৎ $\alpha$ accept করার অন্তত একটি defensible way আছে।

**[অস্পষ্ট / UNCLEAR]** Transcript বলে “incredulously accepted,” কিন্তু slide বলে “credulously accepted।” “credulously accepted” ব্যবহার করো।

---

### Rejection

**Intuition:**  
Argument rejected যদি কোনো extension সেটিকে conditions satisfy করে include করতে না পারে।

**Formal definition:**

$$
\alpha\ \text{is rejected iff}\ \nexists i.\ \alpha\in \mathcal E_i
$$

অর্থাৎ কোনো extension $\alpha$ contain করে না।

---

# 8. A bluffer’s guide to game theory

## 8.1 এই argumentation material-এ game theory কেন আসে

Game theory খুব সংক্ষেপে introduced। লেকচারার বলেন এটি agent systems-এর বড় subfield, কিন্তু unit-এ depth-এ covered হবে না। এখানে এটি useful কারণ argumentation-এ agents একসঙ্গে বা একে অন্যের against কাজ করে argument build করতে এবং কোন argument accept করা হবে তা decide করতে পারে।

---

## 8.2 Game theory কী study করে

### Key concept: game theory

**Intuition:**  
Game theory strategic interaction study করে: agents অন্যরা কী করতে পারে তা anticipate করে actions choose করে।

**Definition given:**  
Game theory studies interactions between agents।

Lecture আরও বলে:

- এর roots economics এবং human interactions/societies-এর study-তে।
- এটি assumes actors seek to maximise expected utility।
- এটি assumes actors act rationally।
- Games consist of actors taking turns, বা কে next act করবে তা নিয়ে rules follow করে।
- Actors-দের utility maximise করতে অন্য actors কী actions নিতে পারে তা anticipate করতে হয়।

---

## 8.3 Semi-formal definition of a game

### Key concept: game

**Intuition:**  
Game-এ possible states/outcomes, players, এবং rules থাকে যা বলে কে move করতে পারে এবং moves state কীভাবে বদলায়।

**Formal definition given:**  
A game consists of:

- possible states or outcomes:

$$
o_0,\ldots,o_n
$$

- players:

$$
a_1,\ldots,a_m
$$

- rules saying:
  - কোন player কোন state-এ action নিতে পারে,
  - action নেওয়ার পর new state কী হবে।

লেকচারার বলেন এর underneath finite-state transition system-এর মতো কিছু থাকতে পারে।

---

## 8.4 Utility functions

### Key concept: utility function

**Intuition:**  
Utility function কোনো outcome agent-এর জন্য কতটা ভালো তা measure করে।

**Formal definition given:**

$$
u_i(o_j)
$$

হলো outcome $o_j$ থেকে agent $a_i$ যে utility পায়।

প্রতিটি agent game-এর run জুড়ে utility maximise করতে চায়। লেকচারার বলেন অনেক game-এ utility only at the end পাওয়া যায়, যা winning the game represent করে।

---

## 8.5 Strategies

### Key concept: strategy

**Intuition:**  
Strategy হলো plan, যা agent-কে প্রতিটি state-এ কী করতে হবে বলে।

**Formal definition given:**  
Strategy $s$ dictates how the agent should act in any state।

যদি $o_j$ কোনো state/outcome হয়, তাহলে:

$$
s(o_j)
$$

agent-কে state $o_j$-এ কী করতে হবে বলে।

প্রতিটি agent-এর possible strategies-এর set থাকে:

$$
\Sigma_i
$$

লেকচারার বলেন agent যা চায় তা হলো game খেলার জন্য winning strategy।

---

## 8.6 Strategy profiles

### Key concept: strategy profile

**Intuition:**  
Strategy profile সব agents-এর strategies list করে।

**Formal notation given:**

$$
s=(s_1,\ldots,s_m)
$$

যেখানে agent $a_i$ plays strategy $s_i$।

Strategy profile $s$-এর জন্য define:

$$
s_{-i}=(s_1,\ldots,s_{i-1},s_{i+1},\ldots,s_m)
$$

এটি agent $i$ ছাড়া বাকি সবার strategies-এর profile।

তাই:

$$
s=(s_i,s_{-i})
$$

Agent $i$ যখন $s_i$ plays করে এবং অন্য agents $s_{-i}$ play করে, তখন utility লেখা হয়:

$$
u_i(s_i,s_{-i})
$$

Lecture এই notation ব্যবহার করে assumptions about other agents' strategies given utility maximisation নিয়ে কথা বলে।

**[অস্পষ্ট / UNCLEAR]** Slide text-এ $u_i(s,s_{-i})$ লেখা দেখা যায়, কিন্তু explanation অনুযায়ী intended notation হলো $u_i(s_i,s_{-i})$।

---

## 8.7 Nash equilibrium — not examinable

### Key concept: Nash equilibrium

**Exam flag:** Not examinable।

**Intuition:**  
Strategy profile Nash equilibrium যদি অন্য সবাই fixed strategy রাখলে কোনো একক agent strategy বদলে better করতে না পারে।

**Formal definition given:**  
Strategy profile:

$$
s^*=(s_1^*,\ldots,s_n^*)
$$

Nash equilibrium যদি:

$$
\forall i,s',\quad u_i(s_i^*,s_{-i}^*)\geq u_i(s',s_{-i}^*)
$$

Meaning:

- agent $i$-এর equilibrium strategy হলো $s_i^*$,
- অন্য agents-এর equilibrium strategies হলো $s_{-i}^*$,
- যদি agent $i$ একা কোনো alternative $s'$-এ switch করে, তাহলে higher utility পাবে না।

লেকচারার এটিকে “stable” বলেন: সবাই যতটা ভালো করতে পারে করছে, given what everyone else is doing।

---

## 8.8 Dominant strategy — not examinable

### Key concept: dominant strategy

**Exam flag:** Not examinable।

**Intuition:**  
Dominant strategy হলো এমন strategy যা অন্য agents যা-ই করুক best।

**Formal definition given:**  
Strategy $s_i^*$ dominant যদি:

$$
\forall s_{-i},\forall s_i',\quad u_i(s_i^*,s_{-i})\geq u_i(s_i',s_{-i})
$$

Meaning:

- অন্য agents possible যেকোনো strategies play করুক,
- agent $i$-এর যেকোনো alternative strategy $s_i'$ নাও,
- $s_i^*$ utility at least as good as $s_i'$ দেয়।

লেকচারার Nash equilibrium থেকে difference highlight করেন: dominance **all possible strategies of the other agents**-এর ওপর quantify করে, শুধু equilibrium profile নয়।

---

# 9. Arguments and games

## 9.1 Information এবং viewpoints reconcile করার জন্য argumentation

Final lecture game theory-কে argumentation-এ ফিরিয়ে আনে।

Multi-agent system-এ argumentation ব্যবহার করে decide করা যায়:

- কোন information accept করা হবে,
- কোন course of action নেওয়া হবে।

এ ধরনের systems-এ:

- প্রতিটি agent-এর privileged information বা objectives থাকতে পারে,
- কোনো individual agent initially সব possible arguments জানে না,
- final argumentation framework জানা হওয়ার আগে agents-দের communicate করতে হয়,
- agents অন্য arguments-এর ওপর attacks provide করার মাধ্যমে argument graph incrementally build করে।

---

## 9.2 Smart home example

Example-টি slides-এ cited একটি paper থেকে এসেছে, যেখানে “Jiminy Cricket” — stakeholders-এর মধ্যে moral agreements-এর architecture — নিয়ে কথা বলা হয়েছে। Scenario: smart home system house-এর child-কে marijuana smoke করতে observe করেছে।

### Argument 1: Legal agent

Legal agent argues:

> এটি illegal; police-কে alert করা উচিত।

এটি একটি course of action propose করে: police contact করা।

### Argument 2: Social agent

Social agent argues:

> এটি bad behaviour; parents-কে alert করা উচিত, তারপর তারা decide করবে কী করতে হবে।

এটি legal agent-এর argument attack করে, কারণ social agent propose করছে police নয়, parents-কে inform করা উচিত।

### Argument 3: Legal agent repeats

Legal agent repeat করতে পারে:

> এটি illegal; police-কে alert করা উচিত।

এটি social agent-এর proposal attack করে। লেকচারার note করেন এটি first argument-এর repeat। Graph-এ এটি cycle-এর মতো দেখায়; dispute tree-তে এটি infinite branch হিসেবে continue করবে।

### Argument 4: Privacy agent

Privacy agent argues:

> বাধ্য না হলে, request না করা পর্যন্ত police contact করো না।

লেকচারার ব্যাখ্যা করেন smart home-এর এমন heuristic থাকতে পারে:

- কেউ injured বা murdered হলে system police contact করতে obliged হতে পারে;
- অন্যান্য অনেক ক্ষেত্রে system police contact করতে obliged নয়, unless house-এর কেউ request করে।

এই privacy argument police alert করার argument-কে attack করে।

### Likely outcome

লেকচারার বলেন resulting argumentation framework-এর ওপর reasoning করলে সম্ভবত police contact না করার সিদ্ধান্তে পৌঁছানো হবে।

**[অস্পষ্ট / UNCLEAR]** Transcript বলে “not to contact the police, but to contact the police,” যা garbled। পূর্ববর্তী explanation অনুযায়ী intended contrast সম্ভবত police contact করা বনাম parents-কে inform করা / police contact না করা।

---

## 9.3 Interaction-কে game হিসেবে দেখা

Smart home interaction-কে agents-এর মধ্যে game হিসেবে দেখা যায়:

- প্রতিটি agent course of action recommend করে,
- প্রতিটি বলে কেন তার proposed action correct,
- প্রতিটি অন্য arguments attack করে।

Lecture তারপর two-player version of abstract argument game দেয়, যদিও smart home example-এ তিন agents ছিল।

---

## 9.4 Dispute trees

### Key concept: dispute tree

**Intuition:**  
Dispute tree argument graph-কে possible exchanges-এর tree হিসেবে unfold করে। Graph-এর cycles tree-তে infinite branches হতে পারে।

Slide বলে:

- Game শুরু হয় proponent, PRO, একটি argument propose করার মাধ্যমে।
- এই initial argument dispute tree $T$-এর root।
- Dispute হলো dispute tree-এর একটি branch।

**[অস্পষ্ট / UNCLEAR]** Transcript বলে game শুরু করে “opponent” এবং legal agent-কে opponent হিসেবে identify করে। Slide বলে game শুরু করে **proponent: PRO**। Recording clarify না করলে slide definition ব্যবহার করো।

### Graph versus tree

- Abstract argument graph-এ repeated attacks cycle হিসেবে represented হতে পারে।
- Dispute tree-তে একই repeated exchange continuing branch হিসেবে, potentially infinite, দেখা যায়।
- Smart home example-এর legal/social repeated exchange এটি illustrate করে।

---

## 9.5 Abstract argument games-এ winning strategies

### Key concept: winning strategy

**Intuition:**  
Argument $a$-এর winning strategy হলো একটি subtree, যা দেখায় proponent প্রতিটি possible attack-এর জবাব দিতে পারে যাতে প্রতিটি branch-এ proponent final say পায়।

**Formal setup:**  
Given:

$$
AF=\langle \mathcal A,\rightharpoonup\rangle
$$

and a dispute tree $T$ with root $a$, একটি subtree $T'$ হলো $a$-এর winning strategy iff নিচের conditions hold করে।

---

### Condition 1: finite, non-empty set of disputes ending with PRO

ধরা যাক:

$$
D_{T'}
$$

হলো $T'$-এর disputes-এর set।

প্রথম condition:

- $D_{T'}$ non-empty,
- $D_{T'}$ finite,
- প্রতিটি dispute $d\in D_{T'}$ finite,
- প্রতিটি dispute PRO-এর argument দিয়ে terminate করে।

Intuition:

- প্রতিটি branch-এ proponent final say পায়।
- যেহেতু game-এ দুই players turns নেয়, এর মানে proponent ঐ branch ধরে নিজের arguments defend করেছে।

---

### Condition 2: সব possible attacks represented

Lecture দ্বিতীয় condition যোগ করে যেন proponent শুধু opponent give up করায় “win” না করে।

প্রতিটি dispute:

$$
d\in D_{T'}
$$

এবং $d$-এর প্রতিটি subsequence $d'$ যার same starting point আছে এবং যা PRO-এর argument $x$ দিয়ে শেষ হয়:

- যদি কোনো argument $y$, $x$-কে attack করে,
- তাহলে এমন subsequence / extension $d''$ থাকতে হবে যা ঐ attack represent করে।

Slide wording:

- $d'$ হলো $d$-এর subsequence, একই starting point সহ, এবং PRO-এর argument $x$ দিয়ে শেষ,
- যে কোনো $y$ যা $x$ attack করে, তার জন্য $d''$ নামে $d$-এর একটি subsequence আছে যা $d'$-কে $y$ দিয়ে extend করে।

Intuition:

- Opponent সব possible attacks try করেছে।
- Strategy tree proponent-এর arguments attack করার opponent-এর প্রতিটি possible way cover করে।
- Proponent wins কারণ সে সবগুলোর against defend করতে পারে, opponent কোনো available move না করায় নয়।

**[অস্পষ্ট / UNCLEAR]** $d,d',d''$ নিয়ে exact quantification slide text ও transcript থেকে reconstruct করা কঠিন। Key intended meaning clear: PRO move-এর ওপর প্রতিটি possible opponent attack strategy tree-তে represented এবং answerable হতে হবে।

---

## 9.6 কেন এটি strategy

Lecture ব্যাখ্যা করে কোনো point-এ proponent অন্য argument choose করলে হয়তো lose করতে পারত। তাই winning subtree হলো **strategy**: proponent যতক্ষণ subtree specified arguments করে, opponent root argument $a$ defeat করতে পারে না।

এটি game theory lecture-এর সঙ্গে connect করে:

- strategy agent-কে প্রতিটি state-এ কী করতে হবে বলে,
- এখানে dispute tree PRO-কে argumentative exchange-এর প্রতিটি point-এ কীভাবে respond করতে হবে বলে।

---

# 10. Dialogue games

## 10.1 Abstract argument games থেকে dialogue games

Lecture বলে abstract argument games আরও instantiate হয়ে **dialogue games** হতে পারে।

### Key concept: dialogue game

**Intuition:**  
Dialogue game arguments-এর content এবং logical form সম্পর্কে detail যোগ করে। শুধু “argument $A$ attacks argument $B$” বলার বদলে, কী move allowed এবং কখন তা অন্য move attack করে — তা define করে।

Lecture বলে dialogue games include করে:

- arguments-এর content,
- কোন attacks allowed,
- সম্ভবত arguments যে logic express করছে সেটিও।

---

## 10.2 Example dialogue moves

### Move 1: claim $\phi$

Form:

$$
claim\ \phi
$$

এই move state করা যায় only if $\phi$ agent-এর knowledge base থেকে deducible।

### Move 2: why $\phi$

Form:

$$
why\ \phi
$$

এটি attacks:

$$
claim\ \phi
$$

Intuition:

- Agent যদি শুধু $\phi$ claim করে, অন্য agent জিজ্ঞেস করতে পারে কেন $\phi$ case।
- এটি attack হিসেবে count করে কারণ original claim এখনো justified হয়নি।

লেকচারার বলেন কিছু systems-এ agent “why $\phi$?” শুধু তখনই জিজ্ঞেস করতে পারে যদি সে $\phi$ believe না করে; অন্য systems-এ সে believe করলেও জিজ্ঞেস করতে পারে, শুধু অন্য agent-এর reason নিজের reason-এর সঙ্গে মেলে কি না দেখতে।

### Move 3: $\phi$ since $\psi$

Form:

$$
\phi\ \text{since}\ \psi
$$

মানে:

- $\phi$ case because $\psi$ case।

এটি attacks:

$$
why\ \phi
$$

কারণ এটি justification-এর request-এর answer।

এটি $\phi$-এর complement assert করা argument-কেও attack করতে পারে, overline notation দিয়ে লেখা:

$$
\overline{\phi}
$$

Transcript ব্যাখ্যা করে overline symbol formula-র negation বোঝায়, অথবা অন্তত formula-র contradiction বোঝায়।

Slide বলে এই move state করা যায় only if:

$$
\psi \Rightarrow \phi
$$

agent-এর knowledge base-এ থাকে।

**[অস্পষ্ট / UNCLEAR]** “since” attacks-এর slide notation parsed text-এ garbled: মনে হয় $\phi$ since $\psi$ attacks $why\ \phi$ এবং $\overline{\phi}$-এর জন্য competing “since” argument। Transcript এই interpretation support করে, কিন্তু exact formal notation check করা উচিত।

---

# 11. Lectures-এর মধ্যে connections

## 11.1 Graphs → abstract arguments

Graph lecture পরের lectures-এর vocabulary দেয়:

- vertices/nodes become arguments,
- directed edges become defeats,
- paths/trees relevant হয় যখন argument games dispute trees হিসেবে represented হয়।

---

## 11.2 Structured arguments → abstract argumentation frameworks

“What is an Argument?” lecture internal logical structure দেয়:

- premises,
- conclusions,
- strict rules,
- defeasible rules,
- attacks,
- preferences।

“Abstract Arguments” lecture সেই internal structure abstract করে শুধু রাখে:

$$
AF=\langle \mathcal A,\rightharpoonup\rangle
$$

এতে graph level-এ reason করা যায় কোন arguments acceptable।

---

## 11.3 Complete extensions → evaluation semantics

Complete extensions abstract framework lecture-এ introduced, তারপর evaluation lecture-এ ব্যবহার হয় define করতে:

- grounded extensions,
- preferred extensions,
- stable extensions,
- semi-stable extensions,
- skeptical acceptance,
- credulous acceptance,
- rejection।

তাই extension machinery হলো “এখানে attacks-এর graph” থেকে “এগুলো আমরা accept করি” পর্যন্ত bridge।

---

## 11.4 Game theory → argument games

Game theory lecture introduce করে:

- players,
- outcomes,
- utilities,
- strategies,
- strategy profiles।

Argument games lecture এই ideas ব্যবহার করে argumentative exchanges-কে games হিসেবে treat করে:

- players পালাক্রমে attacks এবং defences put forward করে,
- dispute tree possible play represent করে,
- winning strategy হলো subtree যা দেখায় PRO root argument-কে প্রতিটি attack-এর against defend করতে পারে।

---

## 11.5 Multi-agent systems throughout

পুরো material-এর motivating application হলো multi-agent reasoning:

- agents-এর information বা objectives আলাদা হতে পারে,
- তারা আলাদা conclusions বা actions propose করতে পারে,
- argumentation তাদের reasons exchange করতে দেয়,
- abstract argumentation system-কে evaluate করতে দেয় কোন arguments survive করে,
- game/dialogue frameworks interactive process model করে, যেখানে arguments build এবং defend করা হয়।

---

# 12. Consolidated formula sheet

## Structured arguments

Argumentation system:

$$
(\mathcal L,\overline{\cdot},\mathcal R_s,\mathcal R_d,\leq)
$$

Contrariness:

$$
\overline{\cdot}:\mathcal L\to 2^{\mathcal L}
$$

Knowledge base:

$$
(\mathcal K,\leq')
$$

Necessary axioms:

$$
\mathcal K_n
$$

Base argument:

$$
\phi\in \mathcal K
$$

$$
Prem(A)=\{\phi\}
$$

$$
Concl(A)=\phi
$$

Strict-rule argument:

$$
A_1,\ldots,A_n\to \psi
$$

Defeasible-rule argument:

$$
A_1,\ldots,A_n\Rightarrow \psi
$$

Derived argument-এর premises:

$$
Prem(A)=Prem(A_1)\cup\cdots\cup Prem(A_n)
$$

Conclusion:

$$
Concl(A)=\psi
$$

Subarguments:

$$
Sub(A)=Sub(A_1)\cup\cdots\cup Sub(A_n)\cup\{A\}
$$

---

## Abstract argumentation

Argumentation framework:

$$
AF=\langle \mathcal A,\rightharpoonup\rangle
$$

Defeat:

$$
(\alpha,\beta)\in \rightharpoonup
$$

or:

$$
\alpha\rightharpoonup \beta
$$

Set দ্বারা attacked arguments:

$$
S^+=\{\beta\in\mathcal A\mid \alpha\rightharpoonup \beta\ \text{for some}\ \alpha\in S\}
$$

Argument-এর attackers:

$$
\alpha^-=\{\beta\in\mathcal A\mid \beta\rightharpoonup \alpha\}
$$

Conflict-free:

$$
S\cap S^+=\varnothing
$$

Defence:

$$
S\ \text{defends}\ \alpha\quad \text{iff}\quad \alpha^-\subseteq S^+
$$

Characteristic function:

$$
\mathcal F:2^{\mathcal A}\to 2^{\mathcal A}
$$

$$
\mathcal F(S)=\{\alpha\in\mathcal A\mid S\ \text{defends}\ \alpha\}
$$

Admissible:

$$
S\ \text{conflict-free and}\ S\subseteq \mathcal F(S)
$$

Complete extension:

$$
S\ \text{conflict-free and}\ S=\mathcal F(S)
$$

Grounded extension:

$$
S\ \text{is a minimal complete extension}
$$

Preferred extension:

$$
S\ \text{is a maximal complete extension}
$$

Stable extension:

$$
S^+=\mathcal A\setminus S
$$

Semi-stable extension:

$$
S\ \text{complete and}\ S\cup S^+\ \text{maximal}
$$

Skeptical acceptance:

$$
\alpha\in \mathcal E_i,\quad \forall i=1,\ldots,n
$$

Credulous acceptance:

$$
\exists i.\ \alpha\in \mathcal E_i
$$

Rejection:

$$
\nexists i.\ \alpha\in \mathcal E_i
$$

---

## Game theory

Outcomes:

$$
o_0,\ldots,o_n
$$

Players:

$$
a_1,\ldots,a_m
$$

Utility:

$$
u_i(o_j)
$$

Strategy profile:

$$
s=(s_1,\ldots,s_m)
$$

Other players’ strategies:

$$
s_{-i}=(s_1,\ldots,s_{i-1},s_{i+1},\ldots,s_m)
$$

Profile decomposition:

$$
s=(s_i,s_{-i})
$$

Nash equilibrium:

$$
s^*=(s_1^*,\ldots,s_n^*)
$$

$$
\forall i,s',\quad u_i(s_i^*,s_{-i}^*)\geq u_i(s',s_{-i}^*)
$$

Dominant strategy:

$$
\forall s_{-i},\forall s_i',\quad u_i(s_i^*,s_{-i})\geq u_i(s_i',s_{-i})
$$

---

# 13. Recording-এ revisit করার unclear sections

1. **Transcript-এ Prakken নাম:** transcript বলে “Henry Pronk”; slide বলে “Prakken’s Framework।” Slide wording ব্যবহার করো।
2. **Base argument subargument notation:** slide writes $Sub(A)=\{\phi\}$, কিন্তু পরে subarguments arguments হিসেবে treated। এটি $\{A\}$ হওয়া উচিত কি না check করো।
3. **Undercutting notation:** slide writes $Concl(A)\in \overline{B'}$, কিন্তু contrariness formulas-এর ওপর defined। Exact textbook notation check করো।
4. **Attack example $A_9:A_1\to \neg(p\Rightarrow t)$:** slide/transcript এটিকে rebutting বলে, কিন্তু earlier definition suggest করে এটি defeasible rule attack করছে। Intended classification check করো।
5. **Semi-stable example explanation:** $A_1$, $A_2$, এবং defence নিয়ে slide wording garbled; conclusion $\{A_4\}$ grounded/preferred/semi-stable কিন্তু not stable — clear।
6. **Game starter:** slide says PRO/proponent starts; transcript says opponent। Recording clarify না করলে slide wording ব্যবহার করো।
7. **Smart home outcome sentence:** transcript says “not to contact the police, but to contact the police,” যা contradictory। Context indicates “not contact the police” intended।
8. **Winning strategy quantifiers:** $d,d',d''$ নিয়ে formal condition parsed slide/transcript থেকে reconstruct করা কঠিন। Core idea: PRO move-এর ওপর every possible attack represented and answerable হতে হবে।
9. **Dialogue game “since” notation:** parsed slide text garbled। Move $\phi$ since $\psi$-এর exact form এবং এটি কোন exact arguments attack করে, recording থেকে re-listen করো।
