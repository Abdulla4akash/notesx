---
subject: COMP64802
chapter: 9
title: "Lecture 9: Boltzmann Machines"
language: bn
---

# COMP 64802 লেকচার ৯ স্টাডি নোট: Boltzmann Machines এবং Restricted Boltzmann Machines

**কোর্স:** COMP 64802 — Advanced Topics in Machine Learning  
**লেকচারার:** Dr Omar Rivasplata, University of Manchester  
**লেকচার:** Lecture 9 — Wed 29/4/2026  
**উৎসের অবস্থা:** স্লাইড দেওয়া হয়েছিল। কোনো ট্রান্সক্রিপ্ট দেওয়া হয়নি, তাই এই নোটগুলো স্লাইডের ভিত্তিতে তৈরি। যেখানে অনুপস্থিত ট্রান্সক্রিপ্ট থেকে আরও বিস্তারিত তথ্য পাওয়া যেতে পারে, সেখানে **[অস্পষ্ট]** দিয়ে চিহ্নিত করা হয়েছে।

---

## বিষয় ও পরিসর

এই লেকচারে **Boltzmann Machines** এবং **Restricted Boltzmann Machines** পরিচয় করানো হয়েছে। এগুলো stochastic, undirected, energy-based generative neural network model।

বৃহত্তর কোর্সের মধ্যে এই লেকচারটি **energy-based probabilistic models**-এর একটি ভূমিকা হিসেবে কাজ করে। এতে probability distributions, partition functions, training intuition, limitations, এবং RBM-এর conditional probability calculations আলোচনা করা হয়েছে।

---

# 1. লেকচার রোডম্যাপ এবং Intended Learning Outcomes

## 1.1 আলোচিত বিষয়গুলো

লেকচারে আলোচনা করা হয়েছে:

1. **Boltzmann Machines**
2. **Energy-based models সম্পর্কে কিছু পটভূমি**
3. **Restricted Boltzmann Machines**

স্লাইড ডেক অনুযায়ী লেকচারের আনুমানিক বিভাজন:

- **২৫ মিনিট** Boltzmann Machines নিয়ে
- **৩৫ মিনিট** Restricted Boltzmann Machines নিয়ে

## 1.2 Intended Learning Outcomes

লেকচার শেষে শিক্ষার্থীদের প্রত্যাশিত দক্ষতা:

1. **Boltzmann Machines** নামে energy-based models-এর উচ্চ-স্তরের বর্ণনা যথেষ্টভাবে বোঝা।
2. Boltzmann Machines-এর probability model-এর formulation details সম্পর্কে যথেষ্ট পরিচিতি অর্জন করা।
3. Boltzmann Machines-এর limitations/disadvantages সম্পর্কে কিছুটা ধারণা পাওয়া, যা Restricted Boltzmann Machines-কে motivate করে।
4. Restricted Boltzmann Machines-এর probability model-এর formulation details সম্পর্কে working familiarity অর্জন করা।
5. Restricted Boltzmann Machines-এর কিছু probability calculations, বিশেষ করে conditional probabilities, সম্পর্কে working familiarity অর্জন করা।

**[পরীক্ষা-সংকেত]** শেষ ILO-তে RBM-এর probability calculations এবং conditional probabilities স্পষ্টভাবে উল্লেখ করা হয়েছে। শেষের pen-and-paper exercise-এ শিক্ষার্থীদের derive করতে বলা হয়েছে:

\[
p(h_i = 1 \mid v)
=
\sigma\left(b_i + \sum_j v_j W_{ji}\right).
\]

এটি revision-এর জন্য খুবই গুরুত্বপূর্ণ হওয়ার সম্ভাবনা বেশি।

---

# 2. Boltzmann Machines

## 2.1 Formal-ish description

একটি **Boltzmann Machine**-কে বর্ণনা করা হয়েছে এভাবে:

> Symmetrically connected, neuron-like units-এর একটি network, যেগুলো on বা off হবে কি না সে বিষয়ে stochastic decisions নেয়।

স্লাইডে আরও বলা হয়েছে যে Boltzmann Machines-এর একটি simple learning algorithm আছে, যা **binary vectors** দিয়ে গঠিত datasets-এ interesting features আবিষ্কার করতে সাহায্য করে।

## 2.2 Intuition

একটি Boltzmann Machine এমন একটি neural network model যেখানে:

- units binary, সাধারণত মান নেয় \(0\) বা \(1\);
- প্রতিটি unit-কে “off” বা “on” হিসেবে ব্যাখ্যা করা যায়;
- network-এ symmetric connections থাকে;
- units-এর প্রতিটি সম্ভাব্য configuration-কে একটি **energy** assigned করা হয়;
- lower-energy configurations বেশি probable;
- higher-energy configurations কম probable;
- learning parameters adjust করে যাতে training-data configurations low-energy states হয়ে যায়।

লেকচারে Boltzmann Machines-কে বলা হয়েছে:

\[
\textbf{stochastic, undirected, energy-based, generative neural networks.}
\]

## 2.3 Key properties

### Stochastic

Neurons-এর random states থাকে।

প্রতিটি unit হতে পারে:

\[
0 \quad \text{or} \quad 1.
\]

এগুলো সাধারণত বোঝায়:

\[
\text{off} \quad \text{or} \quad \text{on}.
\]

### Undirected

Connections symmetric, তাই graph representation undirected।

এখানে directional arrows নেই; দুইটি unit-এর মধ্যে connection মানে mutual interaction।

### Energy-based

Model states-এর ওপর probabilities define করতে একটি **energy function** ব্যবহার করে।

নিয়মটি হলো:

- low energy মানে high probability;
- high energy মানে low probability।

### Generative

Model তার শেখা probability distribution থেকে sample করে নতুন data generate করতে পারে।

---

# 3. Hopfield Networks-এর সঙ্গে সংযোগ

স্লাইডে বলা হয়েছে:

- **Hopfield Networks** একটি precursor model;
- Boltzmann Machines-কে Hopfield Networks-এর generalisations হিসেবে বিবেচনা করা যায়।

## 3.1 Connection

Hopfield Networks এবং Boltzmann Machines—দুটিই energy-based neural models।

Boltzmann Machines এই ধারণাকে generalise করে **stochastic binary units** ব্যবহার করে। Hopfield Networks-কে এখানে precursor model হিসেবে উপস্থাপন করা হয়েছে।

**[সংযোগ]** এই লেকচার Boltzmann Machines-কে আগের neural network energy models, বিশেষ করে Hopfield Networks-এর সঙ্গে যুক্ত করেছে।

---

# 4. Boltzmann Machine architecture

## 4.1 Visible এবং hidden variables

স্লাইডের উদাহরণে দুই ধরনের node আছে।

### Visible variables

\[
v = (v_1, v_2, v_3, v_4).
\]

Visible units data-এর observed part represent করে।

### Hidden variables

\[
h = (h_1, h_2, h_3).
\]

Hidden units হলো latent variables, যা data-র structure model করতে সাহায্য করে।

স্লাইডে বলা হয়েছে:

\[
h_i \text{ and } v_j \text{ are binary, typically taking values } 0/1.
\]

**[পরীক্ষা-সংকেত]** স্লাইডে স্পষ্টভাবে বলা হয়েছে যে \(h_i\) এবং \(v_j\) binary, সাধারণত possible values \(0/1\)। পরে conditional probability derivation-এ এটি সরাসরি গুরুত্বপূর্ণ, কারণ সেখানে \(h_i\)-কে শুধু দুইটি possible value-এর ওপর normalise করা হয়।

## 4.2 Graph structure

Boltzmann Machine example diagram-এ দেখা যায়:

- visible nodes \(v_1, v_2, v_3, v_4\);
- hidden nodes \(h_1, h_2, h_3\);
- nodes-গুলোর মধ্যে অনেক undirected connections।

Restricted Boltzmann Machines-এর বিপরীতে, সাধারণ Boltzmann Machines-এ আরও general connectivity থাকতে পারে।

---

# 5. Boltzmann Machine probability model

## 5.1 Visible এবং hidden variables-এর joint probability

Boltzmann Machine probability model হলো:

\[
p(v,h)
=
\frac{1}{Z}
\exp\left(-\frac{E(v,h)}{T}\right).
\]

যেখানে:

- \(v\) হলো visible vector;
- \(h\) হলো hidden vector;
- \(E(v,h)\) হলো state \((v,h)\)-এর energy;
- \(T\) হলো temperature parameter;
- \(Z\) হলো partition function, যাকে normalising constant-ও বলা হয়।

## 5.2 Interpretation

প্রতিটি possible state হলো একটি possible setting:

\[
(v,h).
\]

স্লাইডে জোর দেওয়া হয়েছে যে সব possible state-এর positive probability আছে:

\[
p(v,h) > 0.
\]

Exponential form থেকে এটি আসে, কারণ exponentials positive, এবং \(Z\) distribution-কে normalise করে।

## 5.3 Energy-probability relationship

State-এর energy বাড়লে তার probability কমে।

High energy:

\[
E(v,h) \text{ high}
\quad \Rightarrow \quad
p(v,h) \text{ low}.
\]

Low energy:

\[
E(v,h) \text{ low}
\quad \Rightarrow \quad
p(v,h) \text{ high}.
\]

স্লাইডে বলা হয়েছে, এই probability model পরিচিত:

\[
\textbf{Boltzmann distribution}
\]

অথবা

\[
\textbf{Gibbs distribution}.
\]

---

# 6. Statistical mechanics background

লেকচারে statistical mechanics থেকে সংক্ষিপ্ত background দেওয়া হয়েছে।

## 6.1 অনেক possible states-সহ physical system

একটি physical system বিবেচনা করি যার অনেক possible states আছে:

\[
s_1, s_2, s_3, \dots
\]

System-টির অনেক degrees of freedom থাকতে পারে।

State \(s_i\)-এর probability হলো:

\[
p(s_i)
=
\frac{1}{Z}
\exp\left(-\frac{E(s_i)}{\kappa_B T}\right).
\]

যেখানে:

- \(E(s_i)\) হলো state \(s_i\)-এর energy;
- \(T\) হলো temperature parameter;
- \(\kappa_B\) হলো Boltzmann constant;
- \(Z\) হলো normalising factor, যাকে partition function-ও বলা হয়।

স্লাইডে দেওয়া হয়েছে:

\[
\kappa_B = 1.38 \times 10^{-23} \text{ J/K}.
\]

## 6.2 Probability constraints

Probabilities অবশ্যই satisfy করবে:

\[
p(s_i) \geq 0
\]

and

\[
\sum_i p(s_i) = 1.
\]

## 6.3 Statistical mechanics-এ partition function

Partition function হলো:

\[
Z
=
\sum_i
\exp\left(-\frac{E(s_i)}{\kappa_B T}\right).
\]

এর ভূমিকা হলো probabilities normalise করা, যাতে সেগুলোর যোগফল \(1\) হয়।

## 6.4 Tractability issue

স্লাইডে একটি বড় প্রশ্ন highlight করা হয়েছে:

\[
\text{tractability / complexity of computing } Z.
\]

এটি গুরুত্বপূর্ণ, কারণ partition functions অনেক সময় possible configurations-এর অত্যন্ত বড় সংখ্যার ওপর summation করতে বাধ্য করে।

**[সংযোগ]** Boltzmann Machine probability model statistical mechanics থেকে form ধার করে। Physical states \(s_i\)-এর জায়গায় এখানে machine configurations যেমন \((v,h)\) ব্যবহৃত হয়।

---

# 7. Boltzmann Machines training

## 7.1 Training objective

Training চলাকালে model তার parameters, বিশেষ করে weights, adjust করে:

\[
\text{input data-এর probability maximise করতে।}
\]

Equivalentভাবে, parameters adjust করা হয়:

\[
\text{input data-এর energy minimise করতে।}
\]

## 7.2 Energy landscape intuition

Training slide-এ একটি energy landscape দেখানো হয়েছে যেখানে:

- vertical axis-এ energy;
- horizontal axis-এ state;
- target patterns নিচের দিকে push করা হচ্ছে lower energy-তে;
- other patterns উপরের দিকে push করা হচ্ছে higher energy-তে।

Visual labels-এ লেখা আছে:

- “Minimize energy of target patterns”
- “Maximize energy of all other patterns”

তাই training intuition হলো:

- data patterns low-energy states হওয়া উচিত;
- non-data patterns, অথবা less likely patterns, high-energy states হওয়া উচিত।

## 7.3 Clamping

Training চলাকালে visible neurons **clamped** থাকে।

Clamping মানে:

\[
\text{visible units-এর states নির্দিষ্ট input data-তে fixed থাকে।}
\]

Hidden neurons clamped নয়। তারা freely operate করে।

## 7.4 Hidden units-এর ভূমিকা

Hidden units input data-র distributed representations খুঁজে পেতে এবং শিখতে সাহায্য করে।

স্লাইডে বলা হয়েছে, hidden units clamping vectors-এর মধ্যে higher-order correlations capture করে input data-র underlying constraints explain করে।

## 7.5 Type of learning

Boltzmann Machine training-কে বলা হয়েছে:

\[
\textbf{unsupervised learning.}
\]

লক্ষ্য হলো visible এবং hidden units-এর মধ্যে একটি joint distribution model করা:

\[
p(v,h).
\]

---

# 8. Boltzmann Machines দিয়ে কী করা যায়

লেকচারে কয়েকটি ব্যবহার উল্লেখ করা হয়েছে।

## 8.1 Sampling

Training চলাকালে শেখা patterns-এর ভিত্তিতে Boltzmann Machines নতুন data generate করতে পারে।

দেওয়া উদাহরণ:

- নতুন images generate করা;
- sound generate করা।

## 8.2 Feature learning

Boltzmann Machines high-dimensional data, যেমন images বা text, কে lower-dimensional representations-এ reduce করতে পারে।

এই representations analyse করা সহজ এবং downstream tasks-এর preprocessing step হিসেবে ব্যবহার করা যায়।

## 8.3 Anomaly detection

Model normal data points-এর energy বা probability শেখে।

তারপর:

- normal data-র relatively low energy থাকা উচিত;
- rare বা unexpected patterns-এর high energy থাকা উচিত।

সুতরাং high energy-যুক্ত data points anomalies হিসেবে flag করা যায়।

## 8.4 Pattern completion

যদি information-এর অংশবিশেষ ধারণকারী একটি vector visible units-এর subset-এ clamped করা হয়, তাহলে network remaining visible units-এ pattern completion করে।

## 8.5 Image reconstruction

Image reconstruction-কে pattern completion-এর মতো বলা হয়েছে।

---

# 9. Standard Boltzmann Machines-এর limitations

লেকচারে কয়েকটি major disadvantages তালিকাভুক্ত করা হয়েছে।

## 9.1 Extreme computational cost

Standard Boltzmann Machines-কে equilibrium-এ পৌঁছাতে sampling করতে হয়।

স্লাইডে বলা হয়েছে, এতে thousands of iterations লাগতে পারে।

## 9.2 Slow training

Training-এর জন্য required time exponentially grow করে:

- network size-এর সঙ্গে;
- connections-এর strength-এর সঙ্গে।

এটি standard Boltzmann Machines-কে large-scale datasets-এর জন্য impractical করে তোলে।

## 9.3 Intractable inference

Boltzmann Machines-এ exact inference notoriously intractable হিসেবে বর্ণনা করা হয়েছে।

স্লাইডে উদাহরণ হিসেবে বলা হয়েছে, learning-এর জন্য প্রয়োজনীয় gradients compute করা কঠিন।

## 9.4 Scaling up-এর difficulty

Boltzmann Machines ছোট, trivial problems-এর জন্য কাজ করতে পারে, কিন্তু slides অনুযায়ী complex real-world tasks-এ scale করলে এগুলো effectively learning বন্ধ করে দেয়।

## 9.5 Hyperparameters-এর প্রতি sensitivity

Performance খুব sensitive:

- learning rate;
- weight initialisation;
- hidden units-এর number।

## 9.6 Restricted Boltzmann Machines-এর motivation

এই limitations থেকেই **Restricted Boltzmann Machines** ব্যবহারের motivation আসে। RBM architectural restrictions impose করে, যার ফলে কিছু probability calculations সহজ হয়।

---

# 10. Restricted Boltzmann Machines

## 10.1 Formal-ish description

একটি **Restricted Boltzmann Machine**-কে বর্ণনা করা হয়েছে এভাবে:

> Stochastic units-এর একটি network, যেখানে visible এবং hidden units-এর pairs-এর মধ্যে undirected interactions থাকে।

এই model deep learning architectures-এর building block হিসেবে popularised হয়েছিল এবং applied ও theoretical machine learning-এ এখনও গুরুত্বপূর্ণ ভূমিকা রাখে।

## 10.2 Another description

স্লাইডে RBM-কে আরও বর্ণনা করা হয়েছে:

- stochastic;
- generative;
- unsupervised;
- neural network;
- inputs-এর ওপর probability distributions শেখে এমন model;
- hidden data structures uncover করে এমন model।

RBM গঠিত:

- একটি visible layer;
- একটি hidden layer;
- একই layer-এর মধ্যে no connections।

Within-layer connections না থাকার কারণে training আরও efficient হয়, including contrastive divergence।

**[অস্পষ্ট]** স্লাইডে contrastive divergence উল্লেখ করা হয়েছে, কিন্তু সেটি define বা derive করা হয়নি। Lecture recording/transcript পাওয়া গেলে তা দেখে নেওয়া উচিত।

## 10.3 Applications listed

স্লাইডে বলা হয়েছে RBMs heavily used হয়:

- collaborative filtering;
- dimensionality reduction;
- feature learning।

---

# 11. RBM architecture

## 11.1 Visible এবং hidden variables

RBM example-এ visible variables হলো:

\[
v = (v_1, v_2, v_3).
\]

Hidden variables হলো:

\[
h = (h_1, h_2, h_3, h_4).
\]

## 11.2 Weights

Weights denoted:

\[
w_{j,i} = w(v_j,h_i).
\]

এটি visible unit \(v_j\) এবং hidden unit \(h_i\)-এর connecting weight।

## 11.3 Restricted connectivity

Defining architectural restriction হলো:

- প্রতিটি hidden node \(h_i\), প্রতিটি visible node \(v_j\)-এর সঙ্গে connected;
- hidden nodes-এর মধ্যে কোনো connections নেই;
- visible nodes-এর মধ্যে কোনো connections নেই।

Formally, visible-hidden connections exist:

\[
h_i \leftrightarrow v_j.
\]

কিন্তু hidden-hidden connections exist করে না:

\[
h_i \not\leftrightarrow h_k.
\]

এবং visible-visible connections exist করে না:

\[
v_j \not\leftrightarrow v_\ell.
\]

**[পরীক্ষা-সংকেত]** স্লাইডে এটিকে স্পষ্টভাবে **Important** হিসেবে চিহ্নিত করা হয়েছে:

- every hidden node is connected to every visible node;
- no hidden-hidden connections;
- no visible-visible connections।

এটাই general Boltzmann Machine এবং Restricted Boltzmann Machine-এর key structural difference।

---

# 12. RBM probability model

## 12.1 Joint probability model

RBM একই Boltzmann/Gibbs-style probability form ব্যবহার করে:

\[
p(v,h)
=
\frac{1}{Z}
\exp\left(-\frac{E(v,h)}{T}\right).
\]

## 12.2 Energy function

RBM-এর energy function হলো:

\[
E(v,h)
=
-a^\top v
-
b^\top h
-
v^\top W h.
\]

যেখানে:

- \(v = (v_1,\dots,v_N)\) হলো visible vector;
- \(h = (h_1,\dots,h_M)\) হলো hidden vector;
- \(W = (w_{j,i}) \in \mathbb{R}^{N \times M}\) হলো weight matrix;
- \(a = (a_1,\dots,a_N) \in \mathbb{R}^N\) হলো visible-unit coefficients;
- \(b = (b_1,\dots,b_M) \in \mathbb{R}^M\) হলো hidden-unit coefficients।

## 12.3 Expanded energy function

Expanded form হলো:

\[
E(v,h)
=
-
\sum_{j=1}^{N} a_j v_j
-
\sum_{i=1}^{M} b_i h_i
-
\sum_{i=1}^{M}
\sum_{j=1}^{N}
v_j w_{j,i} h_i.
\]

এতে তিনটি অংশ আছে।

### Visible coefficient contribution

\[
-
\sum_{j=1}^{N} a_j v_j.
\]

### Hidden coefficient contribution

\[
-
\sum_{i=1}^{M} b_i h_i.
\]

### Visible-hidden interaction contribution

\[
-
\sum_{i=1}^{M}
\sum_{j=1}^{N}
v_j w_{j,i} h_i.
\]

---

# 13. RBM partition function

## 13.1 General form

Probability model হলো:

\[
p(v,h)
=
\frac{1}{Z}
\exp\left(-\frac{E(v,h)}{T}\right).
\]

Partition function সব possible configurations-এর ওপর normalise করে।

স্লাইডে লেখা আছে:

\[
Z =
\sum_{i,j}
\exp\left(-\frac{E(v,h)}{T}\right).
\]

## 13.2 More precise interpretation

কারণ \(v\) এবং \(h\) binary-valued vectors, summation হলো visible এবং hidden units-এর সব possible configurations-এর ওপর।

আরও explicitly:

\[
Z
=
\sum_v
\sum_h
\exp\left(-\frac{E(v,h)}{T}\right).
\]

যদি থাকে:

- \(N\) visible units;
- \(M\) hidden units;
- সব units binary;

তাহলে possible configurations-এর সংখ্যা:

\[
2^{N+M}
\]

অতএব \(Z\)-এর direct computation করতে হয়:

\[
2^{N+M}
\]

terms-এর ওপর summation।

## 13.3 First-degree terms ignore করা

স্লাইডে interaction-only অংশ দেওয়া হয়েছে:

\[
\sum_{i,j}
\exp
\left(
-
\frac{1}{T}
\sum_{i=1}^{M}
\sum_{j=1}^{N}
v_j w_{j,i} h_i
\right).
\]

এটিকে right-hand side “ignoring 1st degree terms” হিসেবে label করা হয়েছে।

Omitted first-degree terms হলো coefficient terms:

\[
-a^\top v
\]

and

\[
-b^\top h.
\]

**[অস্পষ্ট]** Partition function-এর জন্য স্লাইডের notation \(\sum_{i,j}\) potentially confusing, কারণ \(i,j\) hidden/visible indices হিসেবেও ব্যবহৃত হয়েছে। Intended meaning হলো \(v\) এবং \(h\)-এর সব possible configurations-এর ওপর summation, শুধু এক pair of indices-এর ওপর নয়।

---

# 14. RBM conditional probabilities

RBM-এর একটি major advantage হলো restricted graph structure-এর কারণে conditional distributions factorised হয়।

## 14.1 Visible variables given থাকলে hidden variables

স্লাইডে বলা হয়েছে:

\[
p(h \mid v)
=
\prod_i p(h_i \mid v).
\]

এর মানে, visible vector \(v\) conditional হিসেবে given থাকলে hidden units independent।

স্লাইডে বলা হয়েছে, এটি graph separation properties থেকে আসে।

**[অস্পষ্ট]** স্লাইডে full graph-separation argument দেখানো হয়নি। Recording/transcript পাওয়া গেলে দেখে নিতে হবে।

## 14.2 Single hidden variable conditional

একটি hidden variable-এর জন্য:

\[
p(h_i = 1 \mid v)
=
\frac{1}
{
1 +
\exp
\left(
-b_i
-
\sum_j v_j W_{ji}
\right)
}.
\]

Equivalentভাবে, sigmoid function ব্যবহার করলে:

\[
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_j W_{ji}
\right).
\]

## 14.3 Hidden variables given থাকলে visible variables

Similarly, visible variables-এর জন্য:

\[
p(v \mid h)
=
\prod_j p(v_j \mid h).
\]

এর মানে, hidden vector \(h\) conditional হিসেবে given থাকলে visible units independent।

আবারও, স্লাইডে বলা হয়েছে এটি graph separation properties থেকে আসে।

## 14.4 Single visible variable conditional

একটি visible variable-এর জন্য:

\[
p(v_j = 1 \mid h)
=
\frac{1}
{
1 +
\exp
\left(
-a_j
-
\sum_i W_{ji}h_i
\right)
}.
\]

Equivalentভাবে:

\[
p(v_j = 1 \mid h)
=
\sigma
\left(
a_j
+
\sum_i W_{ji} h_i
\right).
\]

**[পরীক্ষা-সংকেত]** এই conditional probability formulas stated ILO-র RBM probability calculations অংশের কেন্দ্রীয় বিষয়।

---

# 15. Sigmoid / logistic function

## 15.1 Definition

Function:

\[
x
\mapsto
\frac{1}{1+\exp(-x)}
\]

কে **logistic function** বলা হয়।

এটি একটি sigmoid function এবং প্রায়ই denoted:

\[
\sigma(x).
\]

অতএব:

\[
\sigma(x)
=
\frac{1}{1+\exp(-x)}.
\]

## 15.2 Sigmoid notation ব্যবহার করে RBM conditionals

এই function ব্যবহার করে:

\[
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_j W_{ji}
\right)
\]

and

\[
p(v_j = 1 \mid h)
=
\sigma
\left(
a_j
+
\sum_i W_{ji} h_i
\right).
\]

---

# 16. Pen-and-paper exercise

## 16.1 Exercise statement

প্রতিটি \(i\)-এর জন্য দেখাও:

\[
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_j W_{ji}
\right).
\]

## 16.2 Slide-এর hint

Compute করতে হলে:

\[
p(h_i \mid v),
\]

যে quantity \(h_i\)-এর ওপর depend করে না, সেটিকে normalisation constant-এর অংশ হিসেবে ধরা যায়।

General strategy:

1. Normalisation constant পর্যন্ত \(p(h_i \mid v)\) work out করো।
2. যে terms \(h_i\)-এর ওপর depend করে না, সেগুলো drop করো।
3. এরপর normalise করো।
4. যেহেতু \(h_i\) binary, normalise করতে হবে:

\[
h_i = 0
\quad \text{and} \quad
h_i = 1.
\]

**[পরীক্ষা-সংকেত]** এই derivation pen-and-paper exercise হিসেবে solution সহ দেওয়া হয়েছে। Revision-এর জন্য এটি high-value।

---

# 17. Pen-and-paper exercise solution

## 17.1 Temperature parameter absorb করা

স্লাইডে বলা হয়েছে, যদি temperature parameter \(T\)-কে \(a,b,W\)-এর মধ্যে absorb করা হয়, তাহলে essentially:

\[
p(h \mid v)
=
\frac{p(h,v)}{p(v)}
\propto
p(h,v).
\]

যেহেতু:

\[
p(h,v)
\propto
\exp
\left(
a^\top v
+
b^\top h
+
v^\top W h
\right),
\]

তাই:

\[
p(h \mid v)
\propto
\exp
\left(
a^\top v
+
b^\top h
+
v^\top W h
\right).
\]

## 17.2 Expanded exponent

Exponent expand করলে:

\[
p(h \mid v)
\propto
\exp
\left(
\sum_j a_j v_j
+
\sum_i b_i h_i
+
\sum_i
\sum_j
v_j W_{ji} h_i
\right).
\]

## 17.3 একটি hidden variable-এ focus করা

আমরা interested:

\[
p(h_i \mid v)
\]

fixed \(i\)-এর জন্য।

যেসব terms \(h_i\)-এর ওপর depend করে না, সেগুলো proportionality constant-এ absorb করা যায়।

Remaining terms:

\[
b_i h_i
+
\sum_j v_j W_{ji} h_i.
\]

অতএব:

\[
p(h_i \mid v)
\propto
\exp
\left(
b_i h_i
+
\sum_j v_j W_{ji} h_i
\right).
\]

\(h_i\) factor out করলে:

\[
p(h_i \mid v)
\propto
\exp
\left(
h_i
\left[
b_i
+
\sum_j v_j W_{ji}
\right]
\right).
\]

ধরি:

\[
x
=
b_i
+
\sum_j v_j W_{ji}.
\]

তাহলে:

\[
p(h_i \mid v)
\propto
\exp(h_i x).
\]

## 17.4 \(h_i\)-এর binary values ব্যবহার করা

কারণ:

\[
h_i \in \{0,1\},
\]

মাত্র দুইটি case আছে।

### Case 1: \(h_i = 0\)

\[
\exp(h_i x)
=
\exp(0 \cdot x)
=
\exp(0)
=
1.
\]

### Case 2: \(h_i = 1\)

\[
\exp(h_i x)
=
\exp(1 \cdot x)
=
\exp(x).
\]

## 17.5 Normalise করা

Total unnormalised mass:

\[
1 + \exp(x).
\]

তাই:

\[
p(h_i = 1 \mid v)
=
\frac{\exp(x)}{1+\exp(x)}.
\]

এখন rewrite করি:

\[
\frac{\exp(x)}{1+\exp(x)}
=
\frac{1}{1+\exp(-x)}.
\]

সুতরাং:

\[
p(h_i = 1 \mid v)
=
\frac{1}{1+\exp(-x)}.
\]

আবার substitute করি:

\[
x
=
b_i
+
\sum_j v_j W_{ji}.
\]

অতএব:

\[
p(h_i = 1 \mid v)
=
\frac{1}
{
1+
\exp
\left(
-b_i
-
\sum_j v_j W_{ji}
\right)
}.
\]

Sigmoid notation ব্যবহার করে:

\[
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_j W_{ji}
\right).
\]

এটাই required result।

---

# 18. Key concepts

## 18.1 Boltzmann Machine

### Intuition

Boltzmann Machine হলো একটি stochastic neural network, যা visible এবং hidden units-এর binary configurations-কে energies assign করে। এটি data configurations-কে low-energy এবং therefore high-probability করে শেখে।

### Formal description from the slides

Boltzmann Machine হলো symmetrically connected, neuron-like units-এর একটি network, যেগুলো on বা off হবে কি না সে বিষয়ে stochastic decisions নেয়।

এর probability model হলো:

\[
p(v,h)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(v,h)}{T}
\right).
\]

## 18.2 Energy-based model

### Intuition

Energy-based model একটি energy function ব্যবহার করে probabilities define করে। Low-energy states likely; high-energy states unlikely।

### Formalism from the slides

Boltzmann Machines-এর জন্য:

\[
p(v,h)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(v,h)}{T}
\right).
\]

একই general structure statistical mechanics-এ দেখা যায়:

\[
p(s_i)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(s_i)}{\kappa_B T}
\right).
\]

## 18.3 Partition function

### Intuition

Partition function হলো normalising constant, যা সব probabilities-এর sum \(1\) করে।

### Formal definition

Statistical mechanics system-এর জন্য:

\[
Z
=
\sum_i
\exp
\left(
-\frac{E(s_i)}{\kappa_B T}
\right).
\]

RBM-এর জন্য:

\[
Z
=
\sum_v
\sum_h
\exp
\left(
-\frac{E(v,h)}{T}
\right).
\]

\(N\) visible এবং \(M\) hidden binary units থাকলে, এতে involve করে:

\[
2^{N+M}
\]

configurations।

## 18.4 Visible units

### Intuition

Visible units observed data represent করে।

### Formal notation

\[
v = (v_1,\dots,v_N).
\]

Units binary:

\[
v_j \in \{0,1\}.
\]

## 18.5 Hidden units

### Intuition

Hidden units হলো latent variables, যা model-কে data-র structure, constraints, এবং higher-order correlations capture করতে সাহায্য করে।

### Formal notation

\[
h = (h_1,\dots,h_M).
\]

Units binary:

\[
h_i \in \{0,1\}.
\]

## 18.6 Clamping

### Intuition

Clamping মানে training-এর সময় visible units-কে observed data-তে fix করা।

### Description from the slides

Training চলাকালে visible neurons clamped থাকে, অর্থাৎ তাদের states specific input data-তে fixed থাকে। Hidden neurons freely operate করে।

## 18.7 Restricted Boltzmann Machine

### Intuition

RBM হলো restricted bipartite structure-যুক্ত Boltzmann Machine: visible units hidden units-এর সঙ্গে connect করে, কিন্তু একই layer-এর units নিজেদের মধ্যে connect করে না।

### Formal description from the slides

RBM হলো stochastic units-এর একটি network, যেখানে visible এবং hidden units-এর pairs-এর মধ্যে undirected interactions থাকে।

Probability model:

\[
p(v,h)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(v,h)}{T}
\right),
\]

with energy:

\[
E(v,h)
=
-a^\top v
-
b^\top h
-
v^\top W h.
\]

## 18.8 Logistic / sigmoid function

### Intuition

Sigmoid function ব্যবহার করা হয় একটি binary unit on হওয়ার probability প্রকাশ করতে।

### Formal definition

\[
\sigma(x)
=
\frac{1}{1+\exp(-x)}.
\]

RBM-এ ব্যবহৃত হয়:

\[
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_j W_{ji}
\right)
\]

and

\[
p(v_j = 1 \mid h)
=
\sigma
\left(
a_j
+
\sum_i W_{ji}h_i
\right).
\]

---

# 19. Formula sheet

## 19.1 Boltzmann / Gibbs distribution for Boltzmann Machines

\[
p(v,h)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(v,h)}{T}
\right).
\]

## 19.2 Statistical mechanics distribution

\[
p(s_i)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(s_i)}{\kappa_B T}
\right).
\]

## 19.3 Statistical mechanics partition function

\[
Z
=
\sum_i
\exp
\left(
-\frac{E(s_i)}{\kappa_B T}
\right).
\]

## 19.4 RBM energy function

\[
E(v,h)
=
-a^\top v
-
b^\top h
-
v^\top W h.
\]

## 19.5 RBM energy function expanded

\[
E(v,h)
=
-
\sum_{j=1}^{N} a_j v_j
-
\sum_{i=1}^{M} b_i h_i
-
\sum_{i=1}^{M}
\sum_{j=1}^{N}
v_j w_{j,i} h_i.
\]

## 19.6 RBM conditional independence: hidden given visible

\[
p(h \mid v)
=
\prod_i p(h_i \mid v).
\]

## 19.7 RBM conditional: one hidden unit

\[
p(h_i = 1 \mid v)
=
\frac{1}
{
1+
\exp
\left(
-b_i
-
\sum_j v_j W_{ji}
\right)
}.
\]

Equivalent sigmoid form:

\[
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_j W_{ji}
\right).
\]

## 19.8 RBM conditional independence: visible given hidden

\[
p(v \mid h)
=
\prod_j p(v_j \mid h).
\]

## 19.9 RBM conditional: one visible unit

\[
p(v_j = 1 \mid h)
=
\frac{1}
{
1+
\exp
\left(
-a_j
-
\sum_i W_{ji}h_i
\right)
}.
\]

Equivalent sigmoid form:

\[
p(v_j = 1 \mid h)
=
\sigma
\left(
a_j
+
\sum_i W_{ji}h_i
\right).
\]

## 19.10 Logistic function

\[
\sigma(x)
=
\frac{1}
{1+\exp(-x)}.
\]

---

# 20. Worked examples from the slides

## 20.1 Example 1: Boltzmann Machine architecture

Boltzmann Machine slide example-এ আছে:

\[
v = (v_1,v_2,v_3,v_4)
\]

and

\[
h = (h_1,h_2,h_3).
\]

Probability model:

\[
p(v,h)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(v,h)}{T}
\right).
\]

Units binary:

\[
v_j,h_i \in \{0,1\}.
\]

## 20.2 Example 2: RBM architecture

RBM slide example-এ আছে:

\[
v = (v_1,v_2,v_3)
\]

and

\[
h = (h_1,h_2,h_3,h_4).
\]

Weights:

\[
w_{j,i} = w(v_j,h_i).
\]

Key structural restrictions:

\[
\text{hidden-visible connections exist}
\]

but:

\[
\text{hidden-hidden connections do not exist}
\]

and:

\[
\text{visible-visible connections do not exist}.
\]

## 20.3 Example 3: Derivation of \(p(h_i=1\mid v)\)

Goal:

\[
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_j W_{ji}
\right).
\]

Start with:

\[
p(h \mid v)
\propto
\exp
\left(
a^\top v
+
b^\top h
+
v^\top W h
\right).
\]

Expand:

\[
p(h \mid v)
\propto
\exp
\left(
\sum_j a_jv_j
+
\sum_i b_ih_i
+
\sum_i
\sum_j
v_jW_{ji}h_i
\right).
\]

Fixed \(i\)-এর জন্য \(h_i\)-এর ওপর depend না করা terms drop করলে:

\[
p(h_i \mid v)
\propto
\exp
\left(
b_ih_i
+
\sum_j v_jW_{ji}h_i
\right).
\]

ধরি:

\[
x
=
b_i
+
\sum_j v_jW_{ji}.
\]

তাহলে:

\[
p(h_i \mid v)
\propto
\exp(h_ix).
\]

যেহেতু \(h_i \in \{0,1\}\):

\[
p(h_i=0\mid v)
\propto
1
\]

and

\[
p(h_i=1\mid v)
\propto
\exp(x).
\]

Normalise করলে:

\[
p(h_i=1\mid v)
=
\frac{\exp(x)}
{1+\exp(x)}.
\]

Rewrite:

\[
\frac{\exp(x)}
{1+\exp(x)}
=
\frac{1}
{1+\exp(-x)}.
\]

Therefore:

\[
p(h_i = 1 \mid v)
=
\frac{1}
{
1+
\exp
\left(
-b_i
-
\sum_j v_jW_{ji}
\right)
}
\]

and hence:

\[
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_jW_{ji}
\right).
\]

---

# 21. Exam flags and revision priorities

## 21.1 Explicit slide flags

### [পরীক্ষা-সংকেত] Binary units

স্লাইডে স্পষ্টভাবে বলা হয়েছে যে visible এবং hidden units সাধারণত binary, values \(0/1\)। Conditional probability derivation-এর জন্য এটি essential।

### [পরীক্ষা-সংকেত] RBM connectivity

স্লাইডে RBM architecture স্পষ্টভাবে important হিসেবে চিহ্নিত করা হয়েছে:

- every hidden node is connected to every visible node;
- no hidden-hidden connections;
- no visible-visible connections।

### [পরীক্ষা-সংকেত] Conditional probability calculations

ILOs-এ RBM-এর probability calculations এবং conditional probabilities স্পষ্টভাবে উল্লেখ আছে।

### [পরীক্ষা-সংকেত] Pen-and-paper derivation

Final exercise-এ students-দের দেখাতে বলা হয়েছে:

\[
p(h_i = 1 \mid v)
=
\sigma
\left(
b_i
+
\sum_j v_jW_{ji}
\right).
\]

এই derivation practice করা উচিত।

## 21.2 Likely high-value revision targets

Notes ছাড়া explain করতে পারা উচিত:

1. কী কারণে Boltzmann Machine stochastic, undirected, energy-based, এবং generative;
2. কেন lower energy মানে higher probability;
3. partition function কী করে;
4. কেন \(Z\) compute করা expensive হতে পারে;
5. clamping কী;
6. standard Boltzmann Machines train করা কেন কঠিন;
7. কোন restriction একটি RBM define করে;
8. কেন RBM conditionals factorise করে;
9. proportionality এবং normalisation ব্যবহার করে কীভাবে \(p(h_i=1\mid v)\) derive করতে হয়;
10. RBM conditionals-এর sigmoid forms কীভাবে লিখতে হয়।

---

# 22. আগের material এবং applications-এর সঙ্গে connections

## 22.1 Earlier models-এর সঙ্গে connections

স্লাইডে Boltzmann Machines-কে স্পষ্টভাবে connect করা হয়েছে:

\[
\textbf{Hopfield Networks.}
\]

Hopfield Networks-কে precursor model বলা হয়েছে।

## 22.2 Statistical mechanics-এর সঙ্গে connections

লেকচারে probability model-কে statistical mechanics-এর সঙ্গে connect করা হয়েছে:

\[
p(s_i)
=
\frac{1}{Z}
\exp
\left(
-\frac{E(s_i)}{\kappa_B T}
\right).
\]

Machine learning version একই energy-based probability idea ব্যবহার করে।

## 22.3 Applications-এর সঙ্গে connections

Mentioned applications:

- sampling;
- image generation;
- sound generation;
- feature learning;
- dimensionality reduction;
- downstream tasks-এর preprocessing;
- anomaly detection;
- pattern completion;
- image reconstruction;
- collaborative filtering।

---

# 23. Unclear sections / transcript বা recording-এ check করার বিষয়

## 23.1 Transcript missing

**[অস্পষ্ট]** কোনো lecture transcript দেওয়া হয়নি, তাই এই notes-এ slides-এর বাইরে lecturer-এর spoken explanations, extra examples, verbal emphasis, exam hints, বা corrections অন্তর্ভুক্ত করা যায়নি।

## 23.2 Partition function notation

**[অস্পষ্ট]** Slide 20-এ RBM partition function notation এভাবে লেখা আছে:

\[
\sum_{i,j}.
\]

Intended meaning প্রায় নিশ্চিতভাবে \(v\) এবং \(h\)-এর সব configurations-এর ওপর summation, কিন্তু notation confusing, কারণ \(i\) এবং \(j\) hidden ও visible unit indices হিসেবেও ব্যবহৃত।

## 23.3 “Ignoring 1st degree terms”

**[অস্পষ্ট]** Slide 20-এ first-degree terms ignore করে partition function expression দেখানো হয়েছে। First-degree terms হলো energy function-এর \(a^\top v\) এবং \(b^\top h\) অংশ, কিন্তু spoken explanation হয়তো কেন এগুলো ওই display-তে ignore করা হয়েছে তা clarify করেছে।

## 23.4 Contrastive divergence

**[অস্পষ্ট]** Slide 17-এ contrastive divergence-এর মাধ্যমে efficient training উল্লেখ করা হয়েছে, কিন্তু slides-এ contrastive divergence define বা derive করা হয়নি। Recording/transcript available থাকলে check করতে হবে।

## 23.5 Exact training algorithm

**[অস্পষ্ট]** Slides training-কে conceptually input data-এর energy lowering এবং other patterns-এর energy raising হিসেবে describe করেছে, কিন্তু full learning algorithm বা update rule দেয়নি। Transcript-এ হয়তো আরও detail আছে।

## 23.6 Conditional independence explanation

**[অস্পষ্ট]** Slides 21 এবং 22-এ বলা হয়েছে factorisations graph separation properties থেকে follow করে, কিন্তু graph-separation argument detail-এ দেখানো হয়নি। Recording/transcript available থাকলে check করতে হবে।

---

# 24. Quick revision checklist

Exam-এর আগে notes ছাড়া নিচের কাজগুলো করতে পারা উচিত:

- Boltzmann Machine define করা।
- কেন এটি stochastic, undirected, energy-based, এবং generative—তা explain করা।
- Boltzmann/Gibbs probability model লেখা।
- Energy function-এর role explain করা।
- Partition function-এর role explain করা।
- কেন \(Z\) compute করা expensive হতে পারে—তা বলা।
- Clamping explain করা।
- Standard Boltzmann Machines-এর main limitations list করা।
- Restricted Boltzmann Machine define করা।
- RBM architecture restrictions state করা।
- RBM energy function vector এবং expanded form-এ লেখা।
- Conditional independence factorisations state করা:

\[
p(h\mid v)=\prod_i p(h_i\mid v),
\qquad
p(v\mid h)=\prod_j p(v_j\mid h).
\]

- Derive করা:

\[
p(h_i = 1 \mid v)
=
\sigma\left(b_i + \sum_j v_j W_{ji}\right).
\]

- লেখা:

\[
p(v_j = 1 \mid h)
=
\sigma\left(a_j + \sum_i W_{ji}h_i\right).
\]
