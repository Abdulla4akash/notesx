---
subject: COMP64602
chapter: 7
title: "Week 7"
language: en
---

# Study notes — COMP64602: Argumentation, Evaluation, and Games

**Course:** COMP64602  
**Lecture topic:** Argumentation: structured arguments, abstract argumentation frameworks, evaluating arguments, game theory, and argument/dialogue games.  
**Topic and scope:** These lectures build from basic graph terminology to formal argument construction, then abstract argument graphs, extension-based evaluation semantics, and finally the use of game-theoretic ideas to model argumentative interaction between agents. Argumentation is presented as a way for agents to reconcile competing information, viewpoints, and proposed actions.

**Sources used:** slides and transcripts for: Graphs, What is an Argument, Abstract Arguments, Evaluating Arguments, Game Theory, and Arguments and Games.

---

## Exam flags and lecturer emphasis

### Explicitly not examinable

- **Graphs lecture:** The lecturer says graph basics are **not something examined**, but they are needed to understand later uses of graphs in argumentation and planning.
- **Game theory strategy types:** Nash equilibrium and dominant strategies are marked **“Not examinable”** on the slide. The lecturer says these concepts are fundamental to game theory, but they are not used further in the unit.

### Definitions likely provided, but you must understand how to use them

- For **Prakken’s framework / structured arguments**, the lecturer says not to memorise all definitions, but to understand them because you do not want to spend exam time figuring out what the symbols mean. If needed, definitions may be provided.
- For **argumentation frameworks and related definitions**, the lecturer again says not to memorise the formal definition, but that it is a **fundamental concept** and you need to know how to work with it.

### Important conceptual emphasis

- The core question in argumentation is not exactly “what is true?” as in classical logic, but closer to **which argument wins / which argument should be accepted after attacks have been considered**.
- Abstract argumentation strips away internal logical content and focuses on the **graph structure of defeat**: arguments are nodes, defeats are directed edges. This enables reasoning about which arguments survive attacks.
- In multi-agent systems, no single agent may initially know all arguments. The argument graph is built incrementally as agents communicate and attack each other’s arguments.

---

# 1. Graph prerequisites

## 1.1 Why graphs appear here

Graphs are introduced as background terminology. They are not the main topic of argumentation, but later argumentation frameworks are graphs: arguments become nodes, and defeat/attack relations become directed edges. The lecturer also mentions graphs crop up in planning.

### Key concept: graph

**Intuition:**  
A graph is a collection of objects with connections between them.

**Formal definition given:**  
A graph is a set of **vertices** connected by a set of **edges**.

Example from the slide:

$$
\langle \{A,B,C,D\}, \{(A,B),(B,C),(A,C)\}\rangle
$$

- Vertices: $A,B,C,D$
- Edges: $(A,B),(B,C),(A,C)$
- Vertex $D$ is isolated in the diagram.

---

## 1.2 Directed graphs

### Key concept: directed graph

**Intuition:**  
A directed graph has arrows: an edge from $A$ to $B$ is not the same as an edge from $B$ to $A$.

**Formal definition given:**  
A directed graph is one where the edges have directions.

Example from the slide:

$$
\langle \{A,B,C,D\}, \{(A,B),(B,A),(C,B),(A,C)\}\rangle
$$

This represents:

- $A \to B$
- $B \to A$
- $C \to B$
- $A \to C$
- $D$ remains isolated.

---

## 1.3 Weighted graphs and adjacency matrices

### Key concept: weighted graph

**Intuition:**  
A weighted graph attaches costs to edges. If the graph models movement, the weight is the cost of moving along that edge.

**Formal definition given:**  
A weighted graph is one where the edges have costs defined by an **adjacency matrix**.

The slide uses the same directed graph:

$$
\langle \{A,B,C,D\}, \{(A,B),(B,A),(C,B),(A,C)\}\rangle
$$

with edge costs:

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

The lecturer explains that $\infty$ means there is no edge / no move between those two nodes. For example, $A$ to $A$ is $\infty$ because there is no self-loop shown.

---

## 1.4 Paths, trees, and rooted trees

### Key concept: path

**Intuition:**  
A path is a route through a graph that follows edges and does not repeat a vertex.

**Formal definition given:**  
For a graph:

$$
\langle V,E\rangle
$$

A path is a sequence of nodes:

$$
\pi = (v_1,\ldots,v_n)
$$

such that adjacent nodes in the sequence are connected by an edge:

$$
\forall i,\ \exists e\in E.\ e=(v_i,v_{i+1})
$$

and no vertex appears more than once in the path.

**[UNCLEAR]** The slide formula does not explicitly state the range of $i$, but the intended meaning is adjacent positions in the sequence.

### Key concept: tree

**Intuition:**  
A tree has exactly one route between any two nodes. This matches the intuitive idea of branches: to get from one point to another, there is a unique route.

**Formal definition given:**  
A tree is an undirected graph in which every pair of nodes is connected by exactly one path.

### Key concept: rooted tree

**Intuition:**  
A rooted tree is a tree where one node is chosen as the starting/top node.

**Formal definition given:**  
A rooted tree is one where one vertex has been designated a root. The lecturer notes that in the same tree, different choices of root change how you think of the hierarchy.

---

# 2. What is an argument?

## 2.1 High-level definition

### Key concept: argument

**Intuition:**  
An argument gives reasons for or against a claim that is not simply settled.

**Definition given:**  
An argument is:

> “The giving of reasons to support or criticise a claim that is questionable, or open to doubt.”

This is useful in:

- **Multi-agent contexts**, where agents may argue about what is true, what should be done, or what one agent should do.
- **Single-agent contexts**, where one agent draws information from multiple sources and must assess what that information means.

---

## 2.2 Prakken’s framework

The slide labels this **Prakken’s Framework**. The transcript garbles this name as “Henry Pronk.” Use the slide wording.

**[UNCLEAR]** The auto-transcript’s “Henry Pronk” is a transcription error; the slide says “Prakken’s Framework.”

### Key concept: argumentation system

**Intuition:**  
An argumentation system defines the logical language, the rules agents can use, how contradiction is represented, and how to compare defeasible rules.

**Formal definition given:**  
An argumentation system is a tuple:

$$
(\mathcal L,\ \overline{\cdot},\ \mathcal R_s,\ \mathcal R_d,\ \leq)
$$

where:

- $\mathcal L$ is a logical language.
  - The lecturer says this is typically first-order logic, but could be temporal logic, modal logic, or another logic.
- $\mathcal R_s$ is a set of **strict rules**.
  - Strict rules always apply.
- $\mathcal R_d$ is a set of **defeasible rules**.
  - Defeasible rules generally apply, but may fail.
- $\leq$ is a preference relation over the defeasible rules.
  - It tells us which defeasible rules are preferred.
- $\overline{\cdot}$ is a **contrariness function**:

$$
\overline{\cdot} : \mathcal L \to 2^{\mathcal L}
$$

It captures conflict between formulas. The slide gives examples such as:

$$
\neg \phi \in \overline{\phi}
$$

and:

$$
\phi \in \overline{\neg \phi}
$$

The lecturer connects this to earlier material on default logic and defeasible logic from the belief revision week.

---

## 2.3 Knowledge base structure

### Key concept: knowledge base with necessary and contestable axioms

**Intuition:**  
Some information is treated as definitely true, while other information may be contested.

**Formal structure given:**  
A knowledge base is paired with another preference relation:

$$
(\mathcal K,\leq')
$$

The knowledge base is separated into:

- Necessary axioms:

$$
\mathcal K_n
$$

- Other axioms that can be contested:

$$
\mathcal K \setminus \mathcal K_n
$$

The relation $\leq'$ is a partial order over the contestable part of the knowledge base:

$$
\mathcal K \setminus \mathcal K_n
$$

The lecturer says necessary axioms cannot be contested; the other axioms represent information we may have uncertainty about.

---

## 2.4 Formal construction of arguments

Arguments have:

- premises,
- a conclusion,
- subarguments.

The lecture gives three ways to construct an argument.

---

### 2.4.1 Base argument from the knowledge base

If:

$$
\phi \in \mathcal K
$$

then $\phi$ can be an argument.

For this argument $A$:

$$
Prem(A)=\{\phi\}
$$

$$
Concl(A)=\phi
$$

$$
Sub(A)=\{\phi\}
$$

**[UNCLEAR]** The slide writes $Sub(A)=\{\phi\}$. Later definitions treat subarguments as arguments, so check the textbook/recording if this distinction matters.

---

### 2.4.2 Argument using a strict rule

If $A_1,\ldots,A_n$ are arguments and there is a strict rule in $\mathcal R_s$ such that:

$$
Concl(A_1),\ldots,Concl(A_n)\to \psi
$$

then we can construct the argument:

$$
A_1,\ldots,A_n \to \psi
$$

For this new argument $A$:

$$
Prem(A)=Prem(A_1)\cup \cdots \cup Prem(A_n)
$$

$$
Concl(A)=\psi
$$

$$
Sub(A)=Sub(A_1)\cup \cdots \cup Sub(A_n)\cup \{A\}
$$

The single arrow $\to$ indicates use of a strict rule.

---

### 2.4.3 Argument using a defeasible rule

If $A_1,\ldots,A_n$ are arguments and there is a defeasible rule in $\mathcal R_d$ such that:

$$
Concl(A_1),\ldots,Concl(A_n)\Rightarrow \psi
$$

then we can construct the argument:

$$
A_1,\ldots,A_n \Rightarrow \psi
$$

For this new argument $A$:

$$
Prem(A)=Prem(A_1)\cup \cdots \cup Prem(A_n)
$$

$$
Concl(A)=\psi
$$

$$
Sub(A)=Sub(A_1)\cup \cdots \cup Sub(A_n)\cup \{A\}
$$

The double arrow $\Rightarrow$ indicates use of a defeasible rule. The lecturer also says the commas in expressions such as $A_1,\ldots,A_n\Rightarrow \psi$ are implicitly conjunctions.

---

## 2.5 Support between arguments

### Key concept: support

**Intuition:**  
An argument supports a larger argument when it is part of the reasoning used to build that larger argument.

**Formal definition given:**  
An argument supports another if it is a subargument of that argument.

Example from the worked construction below:

- $A_1$ supports $A_5$ because $A_5$ is built using $A_1$.
- $A_5$ supports $A_7$ because $A_7$ is built using $A_5$.
- $A_5$ also supports $A_8$ indirectly because $A_8$ uses $A_7$, and $A_7$ uses $A_5$.

---

## 2.6 Attack between arguments

An argument $A$ can attack an argument $B$ in three ways: **undercutting**, **rebutting**, and **undermining**.

---

### 2.6.1 Undercutting

**Intuition:**  
Undercutting attacks the use of a defeasible rule itself.

**Formal definition from slide:**  
Argument $A$ attacks argument $B$ by undercutting if there exists:

$$
B' \in Sub(B)
$$

where $B'$ has the form:

$$
B_1,\ldots,B_n \Rightarrow \psi
$$

and:

$$
Concl(A)\in \overline{B'}
$$

**[UNCLEAR]** The contrariness function was introduced over formulas, but the slide writes $\overline{B'}$, where $B'$ is a subargument/rule application. Check the textbook if exact undercut notation matters.

---

### 2.6.2 Rebutting

**Intuition:**  
Rebutting attacks the conclusion of a defeasible subargument.

**Formal definition from slide:**  
Argument $A$ attacks $B$ by rebutting if there exists:

$$
B' \in Sub(B)
$$

where $B'$ has the form:

$$
B_1,\ldots,B_n \Rightarrow \psi
$$

and:

$$
Concl(A)\in \overline{\psi}
$$

So $A$’s conclusion contradicts the conclusion $\psi$ of a defeasible subargument of $B$.

---

### 2.6.3 Undermining

**Intuition:**  
Undermining attacks a contestable premise of an argument.

**Formal definition from slide:**  
Argument $A$ attacks $B$ by undermining if there exists:

$$
\phi \in Prem(B)\setminus \mathcal K_n
$$

such that:

$$
Concl(A)\in \overline{\phi}
$$

So $A$’s conclusion contradicts a non-necessary premise used by $B$. Necessary premises in $\mathcal K_n$ are not undermined in this definition.

---

## 2.7 Defeat

### Key concept: defeat

**Intuition:**  
Attack is not automatically defeat. An attacking argument defeats another only if it is strong enough according to the preference relations.

**Formal definition given:**  
An argument $A$ defeats an argument $B$ if:

1. $A$ attacks $B$, and
2. $A$ is preferred to $B$ based on $\leq$ and $\leq'$.

The lecturer says the details of how preference between arguments is calculated are not covered in this lecture, but the preference relations over defeasible rules and non-necessary facts are used.

---

# 3. Worked example: constructing structured arguments

The lecture gives a knowledge base and rule set, then builds arguments $A_1$ to $A_8$.

## 3.1 Given knowledge base and rules

Knowledge base:

$$
\mathcal K=\{p,q,u,r\}
$$

Necessary axioms:

$$
\mathcal K_n=\{p\}
$$

So:

- $p$ is necessary / cannot be contested.
- $q,u,r$ are contestable.

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

Each formula in $\mathcal K$ gives an argument:

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

These are direct arguments from the knowledge base.

---

## 3.3 Deriving $A_5$

Rule used:

$$
p\Rightarrow t
$$

Existing argument:

$$
A_1:p
$$

Since $Concl(A_1)=p$, apply the defeasible rule:

$$
A_5:A_1\Rightarrow t
$$

So:

$$
Concl(A_5)=t
$$

This is defeasible because the rule $p\Rightarrow t$ is in $\mathcal R_d$.

---

## 3.4 Deriving $A_6$

Rule used:

$$
p,q\to s
$$

Existing arguments:

$$
A_1:p,\quad A_2:q
$$

Since $Concl(A_1)=p$ and $Concl(A_2)=q$, apply the strict rule:

$$
A_6:A_1,A_2\to s
$$

So:

$$
Concl(A_6)=s
$$

This is strict because the rule $p,q\to s$ is in $\mathcal R_s$.

---

## 3.5 Deriving $A_7$

Rule used:

$$
s,r,t\Rightarrow v
$$

Existing arguments:

$$
A_3:r,\quad A_5:t,\quad A_6:s
$$

Since $A_3$ concludes $r$, $A_5$ concludes $t$, and $A_6$ concludes $s$, apply the defeasible rule:

$$
A_7:A_3,A_5,A_6\Rightarrow v
$$

So:

$$
Concl(A_7)=v
$$

This is defeasible because the rule $s,r,t\Rightarrow v$ is in $\mathcal R_d$.

---

## 3.6 Deriving $A_8$

Rule used:

$$
u,v\to w
$$

Existing arguments:

$$
A_4:u,\quad A_7:v
$$

Since $A_4$ concludes $u$ and $A_7$ concludes $v$, apply the strict rule:

$$
A_8:A_4,A_7\to w
$$

So:

$$
Concl(A_8)=w
$$

This is strict because the rule $u,v\to w$ is in $\mathcal R_s$.

---

## 3.7 Support structure in the example

The construction creates a chain of support:

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

So:

- $A_1$ supports $A_5,A_6,A_7,A_8$.
- $A_2$ supports $A_6,A_7,A_8$.
- $A_3$ supports $A_7,A_8$.
- $A_4$ supports $A_8$.
- $A_5$ supports $A_7,A_8$.
- $A_6$ supports $A_7,A_8$.
- $A_7$ supports $A_8$.

The lecturer’s point is that ordinary inference in knowledge representation can be abstracted into arguments that support each other.

---

# 4. Worked examples: attacks in the structured argument system

## 4.1 Attack on the rule $p\Rightarrow t$

The slide gives an additional argument:

$$
A_9:A_1\to \neg(p\Rightarrow t)
$$

The slide says this would rebut:

$$
A_5,\ A_7,\ A_8
$$

because $A_5$ uses the defeasible rule $p\Rightarrow t$, $A_7$ has $A_5$ as a subargument, and $A_8$ has $A_7$ as a subargument.

**[UNCLEAR]** The slide/example calls this a rebuttal, but the earlier formal attack definitions make this look like it is attacking the defeasible rule itself, which corresponds to undercutting. Check the textbook or recording for the intended label.

---

## 4.2 Rebutting $t$

The slide gives:

$$
A_9:A_1\to \neg t
$$

This would rebut:

$$
A_5,\ A_7,\ A_8
$$

Reason:

- $A_5$ concludes $t$.
- $\neg t$ contradicts $t$, so $A_9$ rebuts $A_5$.
- $A_7$ contains $A_5$ as a subargument.
- $A_8$ contains $A_7$, and therefore indirectly $A_5$, as a subargument.
- So the attack propagates through the subargument structure.

---

## 4.3 Undermining $q$

The slide gives:

$$
A_9:A_1\to \neg q
$$

This would undermine:

$$
A_6,\ A_7,\ A_8
$$

Reason:

- $A_6$ relies on $A_2:q$.
- $q$ is not in the necessary axioms:

$$
q\notin \mathcal K_n
$$

- So $q$ is contestable.
- $\neg q$ contradicts that contestable premise.
- Therefore $A_9$ undermines $A_6$.
- Since $A_7$ depends on $A_6$, and $A_8$ depends on $A_7$, the attack also reaches $A_7$ and $A_8$.

---

# 5. Abstract arguments and argumentation frameworks

## 5.1 Motivation for abstraction

In the previous structured-argument lecture, arguments had internal structure: premises, conclusions, strict rules, defeasible rules, attacks, and preferences.

The abstract argument lecture says we can ignore that internal structure and view the situation simply as a graph:

- arguments are nodes,
- defeats are directed edges.

The lecturer emphasises that this abstraction does not say whether arguments are text, logical formulae, or anything else. It only records which arguments defeat which others.

Example graph from the slide:

- $A_2$ defeats $A_1$
- $A_4$ defeats $A_1$
- $A_3$ defeats $A_2$
- $A_5$ defeats $A_4$

Intuitive issue:

- $A_1$ is defeated by $A_2$ and $A_4$.
- But $A_2$ is defeated by $A_3$, and $A_4$ is defeated by $A_5$.
- So we need a way to decide whether $A_1$ should ultimately be accepted.

---

## 5.2 Formal definition: argumentation framework

### Key concept: argumentation framework

**Intuition:**  
An argumentation framework is a directed graph of arguments and defeats.

**Formal definition given:**  
An argumentation framework is a pair:

$$
AF=\langle \mathcal A,\rightharpoonup\rangle
$$

where:

- $\mathcal A$ is a finite set of arguments.
- $\rightharpoonup \subseteq \mathcal A\times \mathcal A$ is a defeat relation.

We say argument $\alpha$ defeats argument $\beta$ if:

$$
(\alpha,\beta)\in \rightharpoonup
$$

often written:

$$
\alpha \rightharpoonup \beta
$$

The relation becomes the arrows between graph nodes.

---

## 5.3 $S^+$: arguments attacked by a set

### Key concept: $S^+$

**Intuition:**  
Given a set of arguments $S$, $S^+$ is everything attacked by at least one argument in $S$.

**Formal definition given:**  
For:

$$
S\subseteq \mathcal A
$$

define:

$$
S^+=\{\beta\in \mathcal A\mid \alpha\rightharpoonup \beta\ \text{for some}\ \alpha\in S\}
$$

So if $\alpha\in S$ and $\alpha$ defeats $\beta$, then $\beta\in S^+$.

---

## 5.4 $\alpha^-$: attackers of an argument

### Key concept: $\alpha^-$

**Intuition:**  
For one argument $\alpha$, $\alpha^-$ is the set of arguments that attack it.

**Formal definition given:**

$$
\alpha^-=\{\beta\in \mathcal A\mid \beta\rightharpoonup \alpha\}
$$

So $\beta\in \alpha^-$ exactly when $\beta$ defeats $\alpha$.

---

## 5.5 Conflict-free sets

### Key concept: conflict-free

**Intuition:**  
A set is conflict-free if its members do not defeat each other.

**Formal definition given:**  
For:

$$
S\subseteq \mathcal A
$$

$S$ is conflict-free if:

$$
S\cap S^+=\varnothing
$$

That means no argument in $S$ attacks another argument in $S$.

---

## 5.6 Defence

### Key concept: defence

**Intuition:**  
A set $S$ defends an argument $\alpha$ if $S$ attacks all attackers of $\alpha$.

**Formal definition given:**  
$S$ defends $\alpha$ if:

$$
\alpha^- \subseteq S^+
$$

So every argument that attacks $\alpha$ is itself attacked by something in $S$.

---

## 5.7 Characteristic function

### Key concept: characteristic function

**Intuition:**  
The characteristic function returns the arguments defended by a set.

**Formal definition given:**

$$
\mathcal F:2^{\mathcal A}\to 2^{\mathcal A}
$$

For:

$$
S\subseteq \mathcal A
$$

$$
\mathcal F(S)=\{\alpha\in \mathcal A\mid S\ \text{defends}\ \alpha\}
$$

So $\mathcal F(S)$ is the set of all arguments whose attackers are defeated by $S$.

---

## 5.8 Admissible sets

### Key concept: admissible set

**Intuition:**  
An admissible set is internally consistent and able to defend itself.

**Formal definition given:**  
A set $S\subseteq \mathcal A$ is admissible if:

1. $S$ is conflict-free, and
2. $S$ defends every element in $S$.

Equivalently:

$$
S\subseteq \mathcal F(S)
$$

The lecturer describes this as a conflict-free set of arguments that defends itself against the other arguments in the framework.

---

## 5.9 Complete extensions

### Key concept: complete extension

**Intuition:**  
A complete extension contains exactly the arguments it defends.

**Formal definition given:**  
A set $S\subseteq \mathcal A$ is a complete extension if:

1. $S$ is conflict-free, and
2. $S=\mathcal F(S)$.

So $S$ is not merely self-defending; it also includes all arguments it defends.

---

# 6. Worked example: admissible and complete extension

Use the graph:

$$
A_3 \rightharpoonup A_2 \rightharpoonup A_1
$$

$$
A_5 \rightharpoonup A_4 \rightharpoonup A_1
$$

Let:

$$
S=\{A_1,A_3,A_5\}
$$

## 6.1 Compute $S^+$

Arguments attacked by members of $S$:

- $A_1$ attacks nothing.
- $A_3$ attacks $A_2$.
- $A_5$ attacks $A_4$.

Therefore:

$$
S^+=\{A_2,A_4\}
$$

---

## 6.2 Check conflict-freeness

$$
S=\{A_1,A_3,A_5\}
$$

$$
S^+=\{A_2,A_4\}
$$

$$
S\cap S^+=\varnothing
$$

Therefore $S$ is conflict-free.

---

## 6.3 Check defence of $A_1$

Attackers of $A_1$:

$$
A_1^-=\{A_2,A_4\}
$$

But:

$$
S^+=\{A_2,A_4\}
$$

So:

$$
A_1^-\subseteq S^+
$$

Therefore $S$ defends $A_1$.

---

## 6.4 Check defence of $A_3$ and $A_5$

Nothing attacks $A_3$ or $A_5$, so:

$$
A_3^-=\varnothing
$$

$$
A_5^-=\varnothing
$$

The empty set is a subset of everything, so:

$$
A_3^-\subseteq S^+
$$

$$
A_5^-\subseteq S^+
$$

Therefore $S$ also defends $A_3$ and $A_5$. The lecturer notes this may feel counterintuitive, but it follows from the definition.

---

## 6.5 Apply the characteristic function

Since $S$ defends $A_1,A_3,A_5$:

$$
\mathcal F(S)=\{A_1,A_3,A_5\}
$$

Therefore:

$$
\mathcal F(S)=S
$$

So $S$ is:

- admissible, because $S\subseteq \mathcal F(S)$,
- a complete extension, because $S=\mathcal F(S)$.

---

# 7. Evaluating arguments

## 7.1 Goal of evaluating arguments

The evaluation lecture asks what it means for an argument to be accepted. The lecturer compares this to semantics in logic, where we ask whether a formula is true, correct, or derivable. But argumentation is different because arguments can attack each other. The central question becomes:

- Which argument wins?
- Which conclusion do we finally draw?
- Which argument can we accept and use for further reasoning or action?

---

## 7.2 Grounded extensions

### Key concept: grounded extension

**Intuition:**  
The grounded extension is the smallest complete extension. It is conservative: it accepts only what can be built up from arguments that do not need defence, then arguments defended by them, and so on.

**Formal definition given:**  
Recall that a complete extension of:

$$
AF=\langle \mathcal A,\rightharpoonup\rangle
$$

is a conflict-free set:

$$
S\subseteq \mathcal A
$$

where:

$$
\mathcal F(S)=S
$$

$S$ is a grounded extension if it is minimal, meaning there is no subset of $S$ that is also a complete extension.

### How to find it

The lecture states:

- There is always a grounded extension.
- It can be found by repeatedly applying $\mathcal F$ to the empty set:

$$
\varnothing,\quad \mathcal F(\varnothing),\quad \mathcal F(\mathcal F(\varnothing)),\quad \ldots
$$

until a fixed point is reached.

---

## 7.3 Worked example: grounded extension

Use the same graph:

$$
A_3 \rightharpoonup A_2 \rightharpoonup A_1
$$

$$
A_5 \rightharpoonup A_4 \rightharpoonup A_1
$$

### Step 1: apply $\mathcal F$ to the empty set

$$
\mathcal F(\varnothing)
$$

The empty set cannot defend anything by attacking attackers. So $\mathcal F(\varnothing)$ gives the arguments that have no attackers and therefore do not need defence.

In the graph:

- nothing attacks $A_3$,
- nothing attacks $A_5$.

Therefore:

$$
\mathcal F(\varnothing)=\{A_3,A_5\}
$$

### Step 2: apply $\mathcal F$ again

$$
\mathcal F(\mathcal F(\varnothing))=\mathcal F(\{A_3,A_5\})
$$

Now:

- $A_3$ attacks $A_2$,
- $A_2$ attacks $A_1$,
- $A_5$ attacks $A_4$,
- $A_4$ attacks $A_1$.

So $\{A_3,A_5\}$ defends $A_1$, because it attacks both attackers of $A_1$.

Therefore:

$$
\mathcal F(\{A_3,A_5\})=\{A_1,A_3,A_5\}
$$

The slide writes:

$$
\mathcal F(\mathcal F(\varnothing))=\{A_1,A_3,A_5\}
$$

### Step 3: fixed point

Applying $\mathcal F$ again gives the same set:

$$
\mathcal F(\{A_1,A_3,A_5\})=\{A_1,A_3,A_5\}
$$

So:

$$
\{A_1,A_3,A_5\}
$$

is a complete extension and is the grounded extension for this graph.

---

## 7.4 Preferred extensions

### Key concept: preferred extension

**Intuition:**  
A preferred extension is a complete extension that is as large as possible without losing the required properties.

**Formal definition given:**  
$S$ is a preferred extension if it is maximal. The transcript clarifies that this means a maximal complete extension: adding any further argument stops it being a complete extension, for example by creating conflict or losing defence.

---

## 7.5 Worked example: preferred extensions

Graph:

$$
A_1 \leftrightarrow A_2
$$

and $A_3$ is isolated.

So:

- $A_1$ attacks $A_2$,
- $A_2$ attacks $A_1$,
- $A_3$ attacks nobody and is attacked by nobody.

The complete extensions are:

$$
\{A_3\}
$$

$$
\{A_1,A_3\}
$$

$$
\{A_2,A_3\}
$$

Why:

- $\{A_3\}$ is complete because $A_3$ is unattacked and conflict-free.
- $\{A_1,A_3\}$ is complete because $A_1$ defends itself against $A_2$, and $A_3$ is unattacked.
- $\{A_2,A_3\}$ is complete for the symmetric reason.

Preferred extensions are the maximal ones:

$$
\{A_1,A_3\}
$$

$$
\{A_2,A_3\}
$$

$\{A_3\}$ is not preferred because it is contained in larger complete extensions. This example shows that there can be more than one preferred extension.

---

## 7.6 Stable extensions

### Key concept: stable extension

**Intuition:**  
A stable extension contains some arguments, and every argument outside the set is attacked by the set. Nothing is left “unaccounted for.”

**Formal definition given:**  
$S$ is a stable extension if:

$$
S^+=\mathcal A\setminus S
$$

The transcript explains this as: all arguments are either in $S$ or attacked by $S$.

### Worked example

For the graph:

$$
A_3 \rightharpoonup A_2 \rightharpoonup A_1
$$

$$
A_5 \rightharpoonup A_4 \rightharpoonup A_1
$$

the set:

$$
S=\{A_1,A_3,A_5\}
$$

has:

$$
S^+=\{A_2,A_4\}
$$

and:

$$
\mathcal A\setminus S=\{A_2,A_4\}
$$

Therefore:

$$
S^+=\mathcal A\setminus S
$$

So:

$$
\{A_1,A_3,A_5\}
$$

is a stable extension.

---

## 7.7 Semi-stable extensions

### Key concept: semi-stable extension

**Intuition:**  
Stable extensions do not always exist. A semi-stable extension is a weaker notion: it is a complete extension that maximises the arguments it contains plus the arguments it attacks.

**Formal definition given:**  
$S$ is a semi-stable extension if:

1. $S$ is a complete extension, and
2. $S\cup S^+$ is maximal.

---

## 7.8 Worked example: semi-stable but not stable

The slide shows a cycle among $A_1,A_2,A_3$, plus $A_4$ attacking $A_2$. The conclusion given is:

$$
\{A_4\}
$$

is grounded, preferred, and semi-stable, but not stable.

Reasoning from the lecture:

- $A_1,A_2,A_3$ form an awkward cycle.
- The defences for arguments in that cycle rely on arguments they conflict with.
- Therefore no admissible set can contain $A_1$, and similarly for $A_2$ and $A_3$.
- $A_4$ is outside the cycle and attacks $A_2$.
- Therefore $\{A_4\}$ is the grounded extension.
- Since no $A_1,A_2,A_3$ can be added while preserving admissibility, $\{A_4\}$ is also preferred.
- It is semi-stable because $S\cup S^+$ is as large as it can be under the constraints.
- It is not stable because $A_1,A_2,A_3$ are not all covered by $S\cup S^+$.

For $S=\{A_4\}$:

$$
S^+=\{A_2\}
$$

so:

$$
S\cup S^+=\{A_4,A_2\}
$$

but this does not cover every argument:

$$
\mathcal A=\{A_1,A_2,A_3,A_4\}
$$

Thus:

$$
S^+\neq \mathcal A\setminus S
$$

so $S$ is not stable.

**[UNCLEAR]** The slide text says “Because $A_1$ attacks $A_2$ and is defended by $A_2$ no admissible set can contain $A_1$”; the wording appears garbled. The intended point is that the cycle prevents $A_1,A_2,A_3$ from being included in an admissible set.

---

## 7.9 Acceptance semantics

The final evaluation slide gives semantics for what it means for an argument to be accepted.

Let:

$$
AF=\langle \mathcal A,\rightharpoonup\rangle
$$

and let the extensions of the framework be:

$$
\mathcal E_1,\ldots,\mathcal E_n
$$

Let:

$$
\alpha\in \mathcal A
$$

### Skeptical acceptance

**Intuition:**  
An argument is skeptically accepted if every extension accepts it. This is a high standard.

**Formal definition:**

$$
\alpha\ \text{is skeptically accepted iff}\ \alpha\in \mathcal E_i,\ \forall i=1,\ldots,n
$$

So all extensions agree on $\alpha$.

---

### Credulous acceptance

**Intuition:**  
An argument is credulously accepted if at least one extension accepts it. This is a weaker standard.

**Formal definition:**

$$
\alpha\ \text{is credulously accepted iff}\ \exists i.\ \alpha\in \mathcal E_i
$$

So there is at least one defensible way to accept $\alpha$.

**[UNCLEAR]** The transcript says “incredulously accepted,” but the slide says “credulously accepted.” Use “credulously accepted.”

---

### Rejection

**Intuition:**  
An argument is rejected if no extension can include it while satisfying the extension conditions.

**Formal definition:**

$$
\alpha\ \text{is rejected iff}\ \nexists i.\ \alpha\in \mathcal E_i
$$

So no extension contains $\alpha$.

---

# 8. A bluffer’s guide to game theory

## 8.1 Why game theory appears in this argumentation material

Game theory is introduced only briefly. The lecturer says it is a major subfield of agent systems, but the unit will not cover it in depth. It is useful here because argumentation can involve agents working together or against each other to build an argument and decide which argument to accept.

---

## 8.2 What game theory studies

### Key concept: game theory

**Intuition:**  
Game theory studies strategic interaction: agents choose actions while anticipating what others might do.

**Definition given:**  
Game theory studies interactions between agents.

The lecture adds:

- Its roots are in economics and the study of human interactions and societies.
- It assumes actors seek to maximise expected utility.
- It assumes actors act rationally.
- Games consist of actors taking turns, or following rules about who may act next.
- Actors need to anticipate actions other actors may take in order to maximise utility.

---

## 8.3 Semi-formal definition of a game

### Key concept: game

**Intuition:**  
A game has possible states/outcomes, players, and rules saying who can move and how moves change the state.

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
  - which player may take an action in each state,
  - what the new state will be after an action is taken.

The lecturer describes this as having something like a finite-state transition system underneath.

---

## 8.4 Utility functions

### Key concept: utility function

**Intuition:**  
A utility function measures how good an outcome is for an agent.

**Formal definition given:**

$$
u_i(o_j)
$$

is the utility that agent $a_i$ gets from outcome $o_j$.

Each agent tries to maximise its utility over the run of the game. The lecturer notes that in many games, utility is only received at the end, which represents winning the game.

---

## 8.5 Strategies

### Key concept: strategy

**Intuition:**  
A strategy is a plan telling an agent what to do in every state.

**Formal definition given:**  
A strategy $s$ dictates how the agent should act in any state.

If $o_j$ is a state/outcome, then:

$$
s(o_j)
$$

tells the agent what to do in state $o_j$.

Each agent has a set of possible strategies:

$$
\Sigma_i
$$

The lecturer says that what an agent wants is a winning strategy for playing the game.

---

## 8.6 Strategy profiles

### Key concept: strategy profile

**Intuition:**  
A strategy profile lists the strategies used by all agents.

**Formal notation given:**

$$
s=(s_1,\ldots,s_m)
$$

where agent $a_i$ plays strategy $s_i$.

For a strategy profile $s$, define:

$$
s_{-i}=(s_1,\ldots,s_{i-1},s_{i+1},\ldots,s_m)
$$

This is the profile of everyone’s strategies except agent $i$’s.

So:

$$
s=(s_i,s_{-i})
$$

The utility for agent $i$ when it plays $s_i$ and the other agents play $s_{-i}$ is written:

$$
u_i(s_i,s_{-i})
$$

The lecture uses this notation to talk about maximising utility given assumptions about what strategies other agents are using.

**[UNCLEAR]** The slide text appears to write $u_i(s,s_{-i})$, while the intended notation from the explanation is $u_i(s_i,s_{-i})$.

---

## 8.7 Nash equilibrium — not examinable

### Key concept: Nash equilibrium

**Exam flag:** Not examinable.

**Intuition:**  
A strategy profile is a Nash equilibrium when no single agent can improve by changing strategy alone, assuming all other agents keep their strategies fixed.

**Formal definition given:**  
A strategy profile:

$$
s^*=(s_1^*,\ldots,s_n^*)
$$

is a Nash equilibrium if:

$$
\forall i,s',\quad u_i(s_i^*,s_{-i}^*)\geq u_i(s',s_{-i}^*)
$$

Meaning:

- agent $i$’s equilibrium strategy is $s_i^*$,
- the other agents’ equilibrium strategies are $s_{-i}^*$,
- if agent $i$ alone switched to some alternative $s'$, it would not get higher utility.

The lecturer describes this as “stable”: everyone is doing as well as they can, given what everyone else is doing.

---

## 8.8 Dominant strategy — not examinable

### Key concept: dominant strategy

**Exam flag:** Not examinable.

**Intuition:**  
A dominant strategy is best no matter what the other agents do.

**Formal definition given:**  
A strategy $s_i^*$ is dominant if:

$$
\forall s_{-i},\forall s_i',\quad u_i(s_i^*,s_{-i})\geq u_i(s_i',s_{-i})
$$

Meaning:

- take any possible strategies the other agents might play,
- take any alternative strategy $s_i'$ for agent $i$,
- $s_i^*$ gives utility at least as good as $s_i'$.

The lecturer highlights the difference from Nash equilibrium: dominance quantifies over **all possible strategies of the other agents**, not just the equilibrium profile.

---

# 9. Arguments and games

## 9.1 Argumentation for reconciling information and viewpoints

The final lecture connects game theory back to argumentation.

Argumentation can be used by a multi-agent system to decide:

- what information to accept,
- what course of action to take.

In such systems:

- each agent may have privileged information or objectives,
- no individual agent initially knows all possible arguments,
- agents must communicate before the final argumentation framework is known,
- the argument graph is built incrementally by agents providing attacks on other arguments.

---

## 9.2 Smart home example

The example comes from a paper cited on the slides about building “Jiminy Cricket,” an architecture for moral agreements among stakeholders. The scenario is a smart home system that observes a child in the house smoking marijuana.

### Argument 1: Legal agent

The legal agent argues:

> This is illegal; the police should be alerted.

This proposes a course of action: contact the police.

### Argument 2: Social agent

The social agent argues:

> This is bad behaviour; the parents should be alerted, and then they decide what to do.

This attacks the legal agent’s argument by proposing that the parents, not the police, should be informed.

### Argument 3: Legal agent repeats

The legal agent can repeat:

> This is illegal; the police should be alerted.

This attacks the social agent’s proposal. The lecturer notes that this is just a repeat of the first argument. In a graph, this looks like a cycle; in a dispute tree, it would continue down the tree as an infinite branch.

### Argument 4: Privacy agent

The privacy agent argues:

> Unless obliged to do so, do not contact the police unless requested.

The lecturer explains this as the kind of heuristic a smart home might have:

- if someone has been injured or murdered, the system may be obliged to contact the police;
- for many other things, the system is not obliged to contact the police unless people in the house request it.

This privacy argument attacks the argument that the police should be alerted.

### Likely outcome

The lecturer says reasoning over the resulting argumentation framework would probably lead to deciding not to contact the police.

**[UNCLEAR]** The transcript says “not to contact the police, but to contact the police,” which is garbled. Given the preceding explanation, the intended contrast is likely between contacting the police and informing the parents / not contacting police.

---

## 9.3 Viewing the interaction as a game

The smart home interaction can be viewed as a game between agents:

- each agent recommends a course of action,
- each puts forward arguments for why its proposed action is correct,
- each attacks other arguments.

The lecture then gives a two-player version of an abstract argument game, even though the smart home example had three agents.

---

## 9.4 Dispute trees

### Key concept: dispute tree

**Intuition:**  
A dispute tree unfolds an argument graph into a tree of possible exchanges. Cycles in the graph can become infinite branches in the tree.

The slide says:

- The game is started by the proponent, PRO, proposing an argument.
- This initial argument is the root of the dispute tree $T$.
- A dispute is a branch of the dispute tree.

**[UNCLEAR]** The transcript says the game is started by “the opponent” and identifies the legal agent as opponent. The slide says the game is started by the **proponent: PRO**. Use the slide definition unless the recording clarifies otherwise.

### Graph versus tree

- In the abstract argument graph, repeated attacks may be represented as a cycle.
- In a dispute tree, the same repeated exchange appears as a continuing branch, potentially infinite.
- The legal/social repeated exchange in the smart home example illustrates this.

---

## 9.5 Winning strategies in abstract argument games

### Key concept: winning strategy

**Intuition:**  
A winning strategy for an argument $a$ is a subtree showing how the proponent can respond to every possible attack so that the proponent has the final say on every branch.

**Formal setup:**  
Given:

$$
AF=\langle \mathcal A,\rightharpoonup\rangle
$$

and a dispute tree $T$ with root $a$, a subtree $T'$ is a winning strategy for $a$ iff the conditions below hold.

---

### Condition 1: finite, non-empty set of disputes ending with PRO

Let:

$$
D_{T'}
$$

be the set of disputes in $T'$.

The first condition is:

- $D_{T'}$ is non-empty,
- $D_{T'}$ is finite,
- each dispute $d\in D_{T'}$ is finite,
- each dispute terminates in an argument by PRO.

Intuition:

- On each branch, the proponent has the final say.
- Since the game has two players taking turns, this means the proponent has defended its arguments along that branch.

---

### Condition 2: all possible attacks are represented

The lecture adds a second condition to ensure the proponent has not “won” merely because the opponent gave up.

For every dispute:

$$
d\in D_{T'}
$$

and for every subsequence $d'$ of $d$ with the same starting point, where $d'$ ends in an argument $x$ by PRO:

- for any argument $y$ that attacks $x$,
- there must be a subsequence / extension $d''$ representing that attack.

The slide wording is:

- where $d'$ is a subsequence of $d$ with the same starting point and ending with an argument $x$ by PRO,
- for any $y$ that attacks $x$, there is a subsequence $d''$ of $d$ which extends $d'$ with $y$.

Intuition:

- The opponent has tried all possible attacks.
- The strategy tree covers every possible way the opponent might attack the proponent’s arguments.
- The proponent wins because it can defend against all of them, not because the opponent failed to make an available move.

**[UNCLEAR]** The exact quantification over $d,d',d''$ is difficult to reconstruct from the slide text and transcript. The key intended meaning is clear: every possible opponent attack on a PRO move must be represented and answerable in the strategy tree.

---

## 9.6 Why this is a strategy

The lecture explains that there might be a point where the proponent could choose a different argument and then lose. Therefore, the winning subtree is a **strategy**: as long as the proponent makes the arguments specified by the subtree, the opponent cannot defeat the root argument $a$.

This connects to the game theory lecture:

- a strategy tells an agent what to do in each state,
- here, the dispute tree tells PRO how to respond at each point in the argumentative exchange.

---

# 10. Dialogue games

## 10.1 From abstract argument games to dialogue games

The lecture says abstract argument games can be further instantiated as **dialogue games**.

### Key concept: dialogue game

**Intuition:**  
A dialogue game adds detail about the content and logical form of arguments. Instead of only saying “argument $A$ attacks argument $B$,” it defines what kinds of moves are allowed and when they attack other moves.

The lecture says dialogue games include details about:

- the content of arguments,
- which attacks are allowed,
- possibly the logic the arguments are expressing.

---

## 10.2 Example dialogue moves

### Move 1: claim $\phi$

A move of the form:

$$
claim\ \phi
$$

can only be stated if $\phi$ is deducible from the agent’s knowledge base.

### Move 2: why $\phi$

A move of the form:

$$
why\ \phi
$$

attacks:

$$
claim\ \phi
$$

Intuition:

- If an agent simply claims $\phi$, another agent can ask why $\phi$ is the case.
- This counts as an attack because the original claim has not yet been justified.

The lecturer says that in some systems, an agent can ask “why $\phi$?” only if it does not believe $\phi$; in other systems, it can ask even if it believes $\phi$, simply to see whether the other agent’s reason matches its own.

### Move 3: $\phi$ since $\psi$

A move of the form:

$$
\phi\ \text{since}\ \psi
$$

means:

- $\phi$ is the case because $\psi$ is the case.

It attacks:

$$
why\ \phi
$$

because it answers the request for justification.

It can also attack an argument asserting the complement of $\phi$, written with the overline notation:

$$
\overline{\phi}
$$

The transcript explains that the overline symbol means negation of the formula, or at least something that contradicts the formula.

The slide says this move can only be stated if:

$$
\psi \Rightarrow \phi
$$

is in the agent’s knowledge base.

**[UNCLEAR]** The slide’s compact notation for “since” attacks is garbled in the parsed text: it appears to say that $\phi$ since $\psi$ attacks $why\ \phi$ and a competing “since” argument for $\overline{\phi}$. The transcript supports that interpretation, but the exact formal notation should be checked.

---

# 11. Connections across the lectures

## 11.1 Graphs → abstract arguments

The graph lecture supplies the vocabulary used later:

- vertices/nodes become arguments,
- directed edges become defeats,
- paths/trees become relevant when argument games are represented as dispute trees.

---

## 11.2 Structured arguments → abstract argumentation frameworks

The “What is an Argument?” lecture gives internal logical structure:

- premises,
- conclusions,
- strict rules,
- defeasible rules,
- attacks,
- preferences.

The “Abstract Arguments” lecture abstracts away from that internal structure and keeps only:

$$
AF=\langle \mathcal A,\rightharpoonup\rangle
$$

This lets us reason at the graph level about which arguments are acceptable.

---

## 11.3 Complete extensions → evaluation semantics

Complete extensions are introduced in the abstract framework lecture, then used in the evaluation lecture to define:

- grounded extensions,
- preferred extensions,
- stable extensions,
- semi-stable extensions,
- skeptical acceptance,
- credulous acceptance,
- rejection.

So the extension machinery is the bridge from “here is a graph of attacks” to “here are the arguments we accept.”

---

## 11.4 Game theory → argument games

The game theory lecture introduces:

- players,
- outcomes,
- utilities,
- strategies,
- strategy profiles.

The argument games lecture uses these ideas to treat argumentative exchanges as games:

- players take turns putting forward attacks and defences,
- the dispute tree represents possible play,
- a winning strategy is a subtree showing how PRO can defend the root argument against every attack.

---

## 11.5 Multi-agent systems throughout

The motivating application across the material is multi-agent reasoning:

- agents may have different information or objectives,
- they may propose different conclusions or actions,
- argumentation allows them to exchange reasons,
- abstract argumentation allows the system to evaluate which arguments survive,
- game/dialogue frameworks model the interactive process of building and defending arguments.

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

Premises of derived argument:

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

Arguments attacked by a set:

$$
S^+=\{\beta\in\mathcal A\mid \alpha\rightharpoonup \beta\ \text{for some}\ \alpha\in S\}
$$

Attackers of an argument:

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

# 13. Unclear sections to revisit in the recordings

1. **Prakken name in transcript:** transcript says “Henry Pronk”; slide says “Prakken’s Framework.” Use slide wording.
2. **Base argument subargument notation:** slide writes $Sub(A)=\{\phi\}$, but later subarguments are treated as arguments. Check whether this should be $\{A\}$.
3. **Undercutting notation:** slide writes $Concl(A)\in \overline{B'}$, but contrariness was defined over formulas. Check exact textbook notation.
4. **Attack example $A_9:A_1\to \neg(p\Rightarrow t)$:** slide/transcript call it rebutting, but the earlier definition suggests it attacks a defeasible rule itself. Check intended classification.
5. **Semi-stable example explanation:** slide wording about $A_1$, $A_2$, and defence is garbled; conclusion $\{A_4\}$ grounded/preferred/semi-stable but not stable is clear.
6. **Game starter:** slide says PRO/proponent starts; transcript says opponent. Use slide wording unless recording clarifies otherwise.
7. **Smart home outcome sentence:** transcript says “not to contact the police, but to contact the police,” which is contradictory. Context indicates “not contact the police” is intended.
8. **Winning strategy quantifiers:** the formal condition involving $d,d',d''$ is hard to reconstruct from parsed slide/transcript. Core idea: every possible attack on a PRO move must be represented and answerable.
9. **Dialogue game “since” notation:** parsed slide text is garbled. Re-listen for the exact form of the move $\phi$ since $\psi$ and what exact arguments it attacks.

