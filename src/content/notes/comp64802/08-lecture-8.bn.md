---
subject: COMP64802
chapter: 8
title: "Lecture 8"
language: bn
---

# COMP 64802 — লেকচার ৮ স্টাডি নোটস

**কোর্স:** COMP 64802 — Advanced Topics in Machine Learning  
**লেকচারার:** Dr Omar Rivasplata, University of Manchester  
**লেকচার:** Lecture 8 — Wed 22/4/2026  
**লেকচারের বিষয়:** Data clustering, K-means clustering, এবং spectral clustering  
**ব্যবহৃত উৎস:** আপলোড করা স্লাইড ডেক। **এই চ্যাটে ট্রান্সক্রিপ্ট দেওয়া হয়নি**, তাই ট্রান্সক্রিপ্ট-নির্ভর ব্যাখ্যা, spoken emphasis, derivation, বা exam hint যেখানে দরকার সেখানে **[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** হিসেবে চিহ্নিত করা হয়েছে।

---

## বিষয় ও পরিসর

এই লেকচারটি **data clustering** নিয়ে: clustering-কে একটি unsupervised learning সমস্যা হিসেবে দেখা, clustering কেন দরকার তা বোঝা, এরপর **K-means clustering**-এর algorithm, objective function, শক্তি ও সীমাবদ্ধতা আলোচনা করা, এবং শেষে **spectral clustering**-এর motivation ও theory দেখা—বিশেষ করে similarity graph, graph Laplacian, এবং eigenvector ব্যবহার করে কীভাবে clustering করা যায়।

বৃহত্তর advanced machine learning প্রসঙ্গে এটি একটি **unsupervised learning / representation learning** topic। লক্ষ্য হলো unlabelled data-তে structure আবিষ্কার করা, এবং data points-কে cluster assignments অথবা low-dimensional spectral embeddings-এর মাধ্যমে represent করা।

---

# 1. লেকচারের roadmap এবং intended learning outcomes

## 1.1 আজকের covered topics

লেকচারে তিনটি প্রধান topic আছে:

1. **Data clustering**
2. **K-means clustering algorithm সম্পর্কে কিছু**
3. **Spectral clustering সম্পর্কে আরও কিছু**

_উৎস: স্লাইড পৃ. ২–৩।_

## 1.2 Intended Learning Outcomes বা ILOs

লেকচার শেষে শিক্ষার্থীদের নিচের learning outcomes অর্জনের কথা।

### ILO 1 — clustering problem বোঝা

**Data clustering problem** সম্পর্কে যথেষ্ট ধারণা অর্জন করা, বিশেষ করে কেন clustering methods এবং algorithms দরকার তা বোঝা।

### ILO 2 — K-means-এর সীমাবদ্ধতা বোঝা

**K-means clustering**-এর limitations / disadvantages সম্পর্কে যথেষ্ট familiarity অর্জন করা। এগুলোই spectral clustering-এর motivation তৈরি করে।

### ILO 3 — spectral clustering-এর graph theory notions

Spectral clustering-এর underlying graph theory notions বোঝা, যার মধ্যে **similarity matrix** আছে।

### ILO 4 — spectral clustering-এর linear algebra notions

Spectral clustering-এর underlying linear algebra notions নিয়ে working familiarity অর্জন করা, বিশেষ করে **graph Laplacian**।

### ILO 5 — spectral clustering theory

Spectral clustering theory নিয়ে working familiarity অর্জন করা, বিশেষ করে **clusters** এবং **Laplacian**-এর সম্পর্ক।

_উৎস: স্লাইড পৃ. ৩।_

---

# 2. Clustering: introduction এবং motivation

স্লাইডে বলা হয়েছে clustering intro এবং motivation অংশের জন্য প্রায় **২৫ মিনিট** রাখা হয়েছিল।

_উৎস: স্লাইড পৃ. ৪।_

**[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** এই অংশে spoken lecture-এ সম্ভবত স্লাইডের চেয়ে বেশি motivation, intuition, এবং example ছিল।

---

## 2.1 Data clustering: visual intuition

**“Data clustering — in a picture”** স্লাইডে দুটি scatter plot দেখানো হয়েছে:

- বামদিকে “original unclustered data”: সব data point একটি unlabelled cloud হিসেবে দেখা যাচ্ছে।
- ডানদিকে “clustered data”: একই data points-কে তিনটি দৃশ্যমান group-এ আলাদা রঙে দেখানো হয়েছে।

এই visual-এর মূল point হলো clustering এমন data-তে group structure assign করে যার শুরুতে কোনো labels নেই।

_উৎস: স্লাইড পৃ. ৫।_

### সহজ ধারণা

Clustering চেষ্টা করে data-র মধ্যে natural grouping বের করতে। একই group-এর points একে অপরের সাথে similar হবে, আর ভিন্ন group-এর points dissimilar হবে।

---

## 2.2 Clustering-এর informal definition

### স্লাইডের informal definition

Clustering হলো data points-কে clusters-এ group করা, যাতে থাকে:

- **High intra-cluster similarity**: একই cluster-এর points পরস্পরের সাথে similar।
- **Low inter-cluster similarity**: ভিন্ন cluster-এর points পরস্পরের সাথে dissimilar।

_উৎস: স্লাইড পৃ. ৬।_

### সহজ ধারণা

ভালো clustering algorithm “similar জিনিসগুলো একসাথে” রাখে এবং “different জিনিসগুলো আলাদা” রাখে।

### Formalism

এই পর্যায়ে general clustering-এর জন্য কোনো একক formal optimisation problem দেওয়া হয়নি। পরে K-means-এর formal objective function দেওয়া হয়েছে।

---

## 2.3 Clustering কী ধরনের learning?

স্লাইডে clustering-কে দুইভাবে characterise করা হয়েছে।

### Representation learning-এর একটি ধরন

Clustering data-তে structure assign করে। শুধু raw points রাখার বদলে data points-কে group membership দিয়ে represent করা যায়।

### Unsupervised learning

Clustering unsupervised learning, কারণ এখানে **labels নেই**। Algorithm-কে data থেকেই groups infer করতে হয়।

_উৎস: স্লাইড পৃ. ৬।_

---

## 2.4 Clustering-এর ব্যবহার

স্লাইডে clustering-এর কয়েকটি use listed আছে।

### Data visualisation

Clustering data বুঝতে সহজ করে। Points-কে colour বা group করে দেখালে visual interpretation সহজ হয়।

### Finding structure in data

Clustering এমন hidden structure বের করতে সাহায্য করে যা label হিসেবে explicitly দেওয়া নেই।

### Discovering underlying patterns

Clustering এমন underlying patterns খুঁজে পেতে পারে যা meaningful categories, behaviours, বা regimes-এর সাথে সম্পর্কিত হতে পারে।

_উৎস: স্লাইড পৃ. ৬।_

**[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** স্লাইডে এই uses-এর বাইরে specific application examples দেওয়া নেই।

---

# 3. একটি clustering algorithm-এর desirable properties

স্লাইডে একটি ভালো clustering algorithm-এর কয়েকটি desirable property দেওয়া হয়েছে।

_উৎস: স্লাইড পৃ. ৭।_

## 3.1 Different data types সামলানোর ক্ষমতা

একটি ভালো clustering algorithm বিভিন্ন ধরনের data নিয়ে কাজ করতে পারা উচিত।

### K-means-এর সাথে connection

এটি পরে K-means-এর সীমাবদ্ধতার সাথে সম্পর্কিত হয়, কারণ K-means কেবল সেই data-তে naturally apply হয় যেখানে mean define করা যায়। Categorical data-র ক্ষেত্রে mean স্বাভাবিকভাবে defined নয়।

_উৎস: স্লাইড পৃ. ৭ এবং পৃ. ১৩।_

---

## 3.2 Scalability

Clustering algorithm-এর scalable হওয়া দরকার:

- **Data size**-এর দিক থেকে
- **Dimension**-এর দিক থেকে

_উৎস: স্লাইড পৃ. ৭।_

### সহজ ধারণা

Data points অনেক বেশি হলে বা feature dimension বেশি হলে algorithm ব্যবহারযোগ্য থাকা উচিত।

---

## 3.3 Input parameters নির্ধারণে কম domain knowledge দরকার হওয়া

একটি desirable clustering method-এর input parameters ঠিক করতে খুব বেশি domain knowledge দরকার হওয়া উচিত নয়।

_উৎস: স্লাইড পৃ. ৭।_

### K-means-এর সাথে connection

K-means এখানে কিছুটা দুর্বল, কারণ K-means চালানোর আগে user-কে cluster সংখ্যা \(K\) specify করতে হয়।

_উৎস: স্লাইড পৃ. ১৩।_

---

## 3.4 Robustness, interpretability, usability

Algorithm ideally হওয়া উচিত:

- Robust
- Interpretable
- Usable
- Easy to implement

_উৎস: স্লাইড পৃ. ৭।_

---

## 3.5 Theory guarantees

ভালো clustering method-এর theory guarantees থাকা desirable, যেমন:

- Convergence proof
- Scalability guarantee
- অন্যান্য relevant property

_উৎস: স্লাইড পৃ. ৭।_

### K-means-এর সাথে connection

K-means সম্পর্কে পরে বলা হয়েছে যে এটি finite number of iterations-এ converge করার guarantee রাখে।

_উৎস: স্লাইড পৃ. ১০ এবং পৃ. ১৩।_

---

## 3.6 Optional user-specified constraints

স্লাইডে user-specified constraints অন্তর্ভুক্ত করার optional property-র কথাও বলা হয়েছে।

_উৎস: স্লাইড পৃ. ৭।_

**[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** কী ধরনের constraints বোঝানো হয়েছে তা স্লাইডে বিস্তারিত নেই।

---

# 4. K-means clustering

## 4.1 Basic setup

Data points বা objects দেওয়া আছে:

\[
x_1, \ldots, x_N.
\]

K-means-এর লক্ষ্য হলো এই points-গুলোকে \(K\) টি clusters-এ partition করা।

_উৎস: স্লাইড পৃ. ৮।_

---

## 4.2 K-means algorithm

### Inputs

- Data points \(x_1, \ldots, x_N\)
- নির্বাচিত cluster সংখ্যা \(K\)

### স্লাইডের algorithm

1. \(K\)-এর একটি value choose করো, যেখানে \(K\) হলো clusters-এর সংখ্যা।
2. \(K\) টি cluster centers initialize করো; দরকার হলে randomly।
3. প্রতিটি \(N\) object-কে nearest cluster center-এ assign করে class membership নির্ধারণ করো।
4. উপরোক্ত membership-গুলো correct ধরে \(K\) টি cluster centers re-estimate করো।
5. শেষ iteration-এ কোনো object membership change না করা পর্যন্ত step 3 এবং 4 repeat করো।

_উৎস: স্লাইড পৃ. ৮।_

### সহজ ধারণা

K-means বারবার দুটি কাজ করে:

1. **Assignment step:** প্রতিটি point-কে সবচেয়ে কাছের centre-এ পাঠায়।
2. **Update step:** নতুন assigned members ধরে প্রতিটি cluster centre update করে।

এই alternating process চলতে থাকে যতক্ষণ না cluster membership আর বদলায় না।

---

## 4.3 Key concept: cluster centre

### সহজ ধারণা

Cluster centre হলো cluster-এর “middle” বা representative point।

### স্লাইডে পাওয়া formalism

Slides পরে K-means objective-এ \(\mu_k\)-কে cluster \(C_k\)-এর centre হিসেবে ব্যবহার করেছে।

_উৎস: স্লাইড পৃ. ১০।_

**[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** Spoken lecture-এ হয়তো explicitly বলা হয়েছে যে \(\mu_k\) assigned points-এর mean, কিন্তু স্লাইডে এই formula আলাদা করে লেখা নেই।

---

## 4.4 K-means animation

একটি স্লাইডে K-means clustering animation-এর link আছে।

_উৎস: স্লাইড পৃ. ৯।_

**[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** Animation content parsed slide text-এ নেই, তাই animation-এ দেখানো exact example reconstruct করা যায়নি।

---

# 5. K-means theory

## 5.1 K-means objective function

K-means data points থেকে তাদের cluster centres পর্যন্ত total squared distance optimise করে:

\[
\sum_{k=1}^{K} \sum_{x \in C_k} \|x - \mu_k\|^2.
\]

এখানে:

- \(K\): clusters-এর সংখ্যা।
- \(C_k\): cluster \(k\)।
- \(x\): cluster \(C_k\)-তে assigned data point।
- \(\mu_k\): cluster \(C_k\)-এর centre।
- \(\|x - \mu_k\|^2\): point এবং তার cluster centre-এর মধ্যে squared Euclidean distance।

_উৎস: স্লাইড পৃ. ১০।_

---

## 5.2 Objective-এর intuition

K-means **intra-cluster similarity** optimise করে, কারণ এটি একই cluster-এর members থেকে average distance কমায়।

_উৎস: স্লাইড পৃ. ১০।_

Idea:

\[
\text{cluster centre থেকে ছোট distance}
\quad \Rightarrow \quad
\text{cluster-এর ভেতরে বেশি similarity}.
\]

---

## 5.3 Variance interpretation

Slides অনুযায়ী K-means:

- total intra-cluster variance minimise করে;
- total inter-cluster variance maximise করে।

_উৎস: স্লাইড পৃ. ১০।_

### সহজ ধারণা

ভালো K-means clustering প্রতিটি cluster-কে internally tight করে এবং আলাদা clusters-কে পরস্পর থেকে separated রাখে।

### Derivation

**[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** Slides statement দিয়েছে, কিন্তু intra-cluster variance minimisation এবং inter-cluster variance maximisation-এর derivation দেখায়নি।

---

## 5.4 Convergence guarantee

K-means finite number of iterations-এ converge করার guarantee রাখে।

_উৎস: স্লাইড পৃ. ১০।_

### গুরুত্বপূর্ণ distinction

Convergence মানে এই নয় যে algorithm সবসময় globally best clustering খুঁজে পায়। পরে summary slide-এ বলা হয়েছে K-means প্রায়ই **local optimum**-এ terminate করে এবং initialization important।

_উৎস: স্লাইড পৃ. ১৩।_

---

# 6. K-means failure cases

## 6.1 Failure case: concentric / non-convex structure

স্লাইড পৃ. ১১-তে একটি dataset দেখানো হয়েছে যেখানে:

- একটি inner central cluster আছে;
- একটি outer ring cluster আছে।

Ground truth-এ centre blob এবং surrounding ring আলাদা cluster। কিন্তু K-means output structure-টি ভুলভাবে কাটে: ring এবং centre-এর অংশগুলো centroid-based split অনুযায়ী incorrectly assign হয়।

_উৎস: স্লাইড পৃ. ১১।_

### Key lesson

K-means non-convex shapes-এর clusters-এর জন্য suitable নয়। Summary slide-এ এটি explicitly বলা হয়েছে।

_উৎস: স্লাইড পৃ. ১৩।_

### সহজ ধারণা

K-means cluster centre থেকে distance-এর উপর নির্ভর করে। Ring-shaped cluster-এর centroid মাঝখানে থাকতে পারে, যা অন্য cluster-এর কাছাকাছি বা তার ভেতরে পড়তে পারে। তাই ring-এর geometry centroid-based separation দিয়ে ভালোভাবে ধরা যায় না।

**[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** এই failure case-এর কোনো step-by-step numerical worked example স্লাইডে নেই।

---

## 6.2 Failure case: curved clusters / two moons style structure

স্লাইড পৃ. ১২-তে আরেকটি non-convex clustering problem দেখানো হয়েছে। Ground truth-এ দুটি curved arc-shaped cluster আছে। K-means centroid proximity অনুযায়ী clusters কাটে, ফলে curved structure অনুসরণ করে না।

_উৎস: স্লাইড পৃ. ১২।_

### Key lesson

Clusters roughly convex বা centroid-separable না হলে K-means struggle করে।

**[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** Slides-এ exact data-generation process বা numerical assignments দেওয়া নেই।

---

# 7. K-means summary

## 7.1 K-means-এর strengths

### Simple, easy to implement and debug

K-means algorithmically straightforward: nearest centre-এ assign করো, centres update করো, repeat করো।

### Intuitive objective function

Objective Euclidean distance ব্যবহার করে:

- high intra-cluster similarity promote করতে;
- low inter-cluster similarity promote করতে।

### Guaranteed convergence

K-means convergence guarantee রাখে।

_উৎস: স্লাইড পৃ. ১৩।_

---

## 7.2 K-means-এর weaknesses

### \(K\) আগেই specify করতে হয়

K-means চালানোর আগে clusters-এর সংখ্যা \(K\) দিতে হয়।

### Mean defined থাকতে হয়

K-means cluster centres / means-এর উপর নির্ভর করে। তাই categorical data-র মতো data type-এ সমস্যা হয়, যেখানে mean naturally defined নয়।

### Local optimum-এ terminate করতে পারে

Initialization important, কারণ K-means global optimum না পেয়ে local optimum-এ converge করতে পারে।

### Non-convex clusters-এর জন্য suitable নয়

Failure case slides ring-shaped এবং curved clusters দিয়ে এটি দেখিয়েছে।

### Noisy data এবং outliers handle করতে পারে না

স্লাইডে বলা হয়েছে K-means noisy data এবং outliers ভালোভাবে handle করতে পারে না।

_উৎস: স্লাইড পৃ. ১৩।_

---

# 8. Similarity বিষয়ে comments

## 8.1 K-means-এ similarity

K-means similarity মাপে **small Euclidean distance** হিসেবে।

_উৎস: স্লাইড পৃ. ১৪।_

### সহজ ধারণা

দুটি point Euclidean space-এ কাছাকাছি হলে তাদের similar ধরা হয়।

---

## 8.2 কিছু shape-এর জন্য Euclidean distance-এর limitation

স্লাইডে বলা হয়েছে Euclidean distance দিয়ে similarity মাপা কিছু shape detect করার জন্য suited নয়।

_উৎস: স্লাইড পৃ. ১৪।_

### Failure cases-এর সাথে connection

Concentric ring এবং curved-cluster examples দেখায় যে simple distance-to-centroid reasoning fail করতে পারে।

---

## 8.3 Other distance measures

Principle হিসেবে অন্য distance measures ব্যবহার করা যায়। সেক্ষেত্রেও similarity interpret হবে **small distance** হিসেবে।

_উৎস: স্লাইড পৃ. ১৪।_

---

## 8.4 Distance-based clustering methods

Distance-based methods points-কে clusters-এ assign করার জন্য cluster centroids-এর প্রতি spatial proximity-এর উপর নির্ভর করে। তারা directly একটি distance notion ব্যবহার করে।

_উৎস: স্লাইড পৃ. ১৪।_

### সহজ ধারণা

Algorithm প্রশ্ন করে: “এই point কোন centre-এর সবচেয়ে কাছে?”

---

## 8.5 Model-based clustering methods

Model-based clustering methods distance directly ব্যবহার না করে probability density estimation-এর উপর নির্ভর করে points-কে clusters-এ assign করে।

_উৎস: স্লাইড পৃ. ১৪।_

**[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** এই লেকচারে slides model-based clustering আর develop করেনি।

---

# 9. Spectral clustering

Slides অনুযায়ী spectral clustering অংশের জন্য প্রায় **৩৫ মিনিট** রাখা হয়েছিল।

_উৎস: স্লাইড পৃ. ১৫।_

## 9.1 Motivation

Spectral clustering পরিচয় করানো হয়েছে K-means-এর limitations দেখানোর পরে। Connection হলো spectral clustering hard non-convex clustering problems-এ K-means-এর চেয়ে ভালোভাবে কাজ করতে পারে।

_উৎস: স্লাইড পৃ. ২৫।_

### Core idea

Spectral clustering data থেকে derived matrices-এর eigenvectors ব্যবহার করে data points cluster করে।

_উৎস: স্লাইড পৃ. ২৫।_

---

# 10. Similarity matrix এবং graph

## 10.1 Data points এবং similarity weights

Data points দেওয়া আছে:

\[
x_1, \ldots, x_N.
\]

Similarity weights define করা হয়:

\[
w_{i,j} = s(x_i, x_j),
\]

যেখানে \(s\) হলো chosen similarity function।

_উৎস: স্লাইড পৃ. ১৬।_

### সহজ ধারণা

Original coordinates-এর উপর সরাসরি clustering করার বদলে spectral clustering প্রথমে প্রতিটি pair of points-এর মধ্যে similarity relationship তৈরি করে।

---

## 10.2 Weighted graph

Data-কে weighted graph হিসেবে represent করা হয়:

\[
G = (V, E, W).
\]

Components:

- \(V\): vertices, যা data points-এর সাথে correspond করে।
- \(E\): edges, যেখানে \(w_{i,j} > 0\) হলে edge থাকে।
- \(W\): edges-এর উপর weights।

_উৎস: স্লাইড পৃ. ১৬।_

### Slide p. 16-এর visual

স্লাইড পৃ. ১৬-এর diagram-এ transformation দেখানো হয়েছে:

\[
\text{data points}
\quad \rightarrow \quad
\text{similarity matrix}
\quad \rightarrow \quad
\text{similarity graph}.
\]

প্রথমে coloured groups হিসেবে points দেখানো হয়েছে, এরপর similarity matrix হিসেবে encode করা হয়েছে, এবং শেষে weighted connections সহ graph হিসেবে represent করা হয়েছে।

_উৎস: স্লাইড পৃ. ১৬।_

---

# 11. Gaussian kernel দিয়ে similarity

## 11.1 Formula

Gaussian kernel similarity:

\[
w_{i,j}
=
\exp\left(
-\frac{\|x_i - x_j\|^2}{2\sigma^2}
\right).
\]

_উৎস: স্লাইড পৃ. ১৭।_

---

## 11.2 Value range

Gaussian kernel values থাকে:

\[
(0,1]
\]

range-এ। Interpretation:

- \(w_{i,j}\) যত \(1\)-এর কাছে, \(x_i\) এবং \(x_j\) তত similar।
- \(w_{i,j} = 1\) যখন \(x_i = x_j\)।
- \(w_{i,j}\) যত \(0\)-এর কাছে, points তত less similar।
- \(\|x_i - x_j\| \to \infty\) হলে \(w_{i,j} \to 0\)।

_উৎস: স্লাইড পৃ. ১৭।_

---

## 11.3 সহজ ধারণা

Gaussian kernel distance-কে similarity-তে convert করে:

\[
\text{small distance}
\Rightarrow
\text{similarity near }1,
\]

\[
\text{large distance}
\Rightarrow
\text{similarity near }0.
\]

Parameter \(\sigma\) distance scaling control করে।

**[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** Slides-এ \(\sigma\) কীভাবে choose করতে হয় তা আলোচনা করা হয়নি।

---

# 12. Similarity matrix

## 12.1 Definition

Similarity weights recall করো:

\[
w_{i,j} = s(x_i, x_j).
\]

Weights matrix:

\[
W =
\begin{pmatrix}
w_{1,1} & w_{1,2} & \cdots & w_{1,N} \\
w_{2,1} & w_{2,2} & \cdots & w_{2,N} \\
\vdots & \vdots & \ddots & \vdots \\
w_{N,1} & w_{N,2} & \cdots & w_{N,N}
\end{pmatrix}.
\]

_উৎস: স্লাইড পৃ. ১৮।_

---

## 12.2 Symmetry

Similarity matrix square এবং symmetric, কারণ:

\[
w_{i,j}
=
s(x_i, x_j)
=
s(x_j, x_i)
=
w_{j,i}.
\]

_উৎস: স্লাইড পৃ. ১৮।_

### সহজ ধারণা

\(x_i\) থেকে \(x_j\)-এর similarity এবং \(x_j\) থেকে \(x_i\)-এর similarity একই, যদি similarity function symmetric হয়।

---

# 13. Nodes-এর degree

## 13.1 Node \(i\)-এর degree

Data point \(x_i\)-এর corresponding node \(i\)-এর degree:

\[
d_i = \sum_j w_{i,j}.
\]

_উৎস: স্লাইড পৃ. ১৯।_

### সহজ ধারণা

Degree হলো node \(i\) থেকে সব অন্য nodes-এর প্রতি total similarity / connection strength।

---

## 13.2 Degree matrix

Degree matrix:

\[
D =
\begin{pmatrix}
d_1 & 0 & \cdots & 0 \\
0 & d_2 & \cdots & 0 \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \cdots & d_N
\end{pmatrix}.
\]

এটি diagonal matrix, যার diagonal-এ node degrees \(d_i\) থাকে।

_উৎস: স্লাইড পৃ. ১৯।_

---

# 14. Graph Laplacian

## 14.1 Definition

Unnormalised graph Laplacian matrix:

\[
L = D - W.
\]

_উৎস: স্লাইড পৃ. ২০।_

যেখানে:

- \(D\): degree matrix।
- \(W\): similarity / weight matrix।

---

## 14.2 সহজ ধারণা

Graph Laplacian একসাথে encode করে:

- প্রতিটি node overall কত strongly connected, \(D\)-এর মাধ্যমে;
- প্রতিটি pair of nodes কত strongly connected, \(W\)-এর মাধ্যমে।

Spectral clustering-এ এটি central object, কারণ এর eigenvectors graph connectivity structure encode করে।

---

# 15. Graph Laplacian-এর properties

Lecture slides unnormalised graph Laplacian \(L\) সম্পর্কে একটি theorem দিয়েছে।

_উৎস: স্লাইড পৃ. ২১।_

## 15.1 Quadratic form identity

প্রতিটি

\[
y \in \mathbb{R}^N
\]

এর জন্য:

\[
y^\top L y
=
\frac{1}{2}
\sum_{i,j}
w_{i,j}(y_i - y_j)^2.
\]

_উৎস: স্লাইড পৃ. ২১।_

### সহজ ধারণা

Connected nodes-এর \(y\)-values similar হলে expression ছোট হয়। যদি \(w_{i,j}\) বড় হয়, তাহলে \(y_i\) এবং \(y_j\)-এর মধ্যে বড় difference থাকলে termটি বেশি penalty দেয়।

---

## 15.2 Symmetry এবং positive semi-definiteness

Laplacian \(L\) symmetric এবং positive semi-definite।

_উৎস: স্লাইড পৃ. ২১।_

### Formal consequence

\(L\) positive semi-definite হওয়ায় এর eigenvalues non-negative।

---

## 15.3 Smallest eigenvalue

\(L\)-এর smallest eigenvalue হলো \(0\)। Graph connected হলে corresponding eigenvector হলো constant one vector:

\[
\mathbf{1}
=
(1,1,\ldots,1)^\top.
\]

_উৎস: স্লাইড পৃ. ২১।_

---

## 15.4 \(L\)-এর eigenvalues

Laplacian-এর \(N\) টি non-negative, real-valued eigenvalues আছে, increasing order-এ:

\[
0 = \lambda_1 \leq \lambda_2 \leq \cdots \leq \lambda_N.
\]

_উৎস: স্লাইড পৃ. ২১।_

---

## 15.5 Proof reference

Slides proof-এর জন্য **Ulrike von Luxburg**-এর tutorial-এর **Proposition 1** refer করেছে।

_উৎস: স্লাইড পৃ. ২১।_

**[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** Slides proof steps অন্তর্ভুক্ত করেনি, এবং spoken derivation এখানে পাওয়া যায়নি।

---

# 16. Graph Laplacian এবং connected components

Lecture slides eigenvalue \(0\) এবং graph connected components-এর মধ্যে একটি theorem দিয়েছে।

_উৎস: স্লাইড পৃ. ২২।_

## 16.1 Theorem setup

\(G\) হলো nonnegative weights-সহ একটি undirected graph।

## 16.2 Eigenvalue \(0\)-এর multiplicity

\(L\)-এর eigenvalue \(0\)-এর algebraic multiplicity \(k\) graph-এর connected components-এর সংখ্যার সমান:

\[
C_1, \ldots, C_k.
\]

_উৎস: স্লাইড পৃ. ২২।_

### সহজ ধারণা

Graph-এর কয়টি independent disconnected piece আছে, তা Laplacian spectrum-এ দেখা যায়।

---

## 16.3 Eigenvalue \(0\)-এর eigenspace

Eigenvalue \(0\)-এর eigenspace connected components-এর indicator vectors দ্বারা spanned:

\[
\mathbf{1}_{C_1}, \ldots, \mathbf{1}_{C_k}.
\]

_উৎস: স্লাইড পৃ. ২২।_

### Indicator-vector intuition

Indicator vector \(\mathbf{1}_{C_i}\) দেখায় কোন nodes component \(C_i\)-তে belong করে।

- \(C_i\)-এর nodes-এর entries হয় \(1\)।
- \(C_i\)-এর বাইরে থাকা nodes-এর entries হয় \(0\)।

**[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** Slides indicator vector notation explicitly define করেনি, তবে পৃ. ২৪-এর visual block-style vectors দেখায়: connected component-এ থাকা rows-এ 1 এবং অন্যত্র 0।

---

## 16.4 Proof reference

Slides proof-এর জন্য **Ulrike von Luxburg**-এর tutorial-এর **Proposition 2** refer করেছে।

_উৎস: স্লাইড পৃ. ২২।_

**[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** Proof slides-এ অন্তর্ভুক্ত নেই।

---

# 17. Spectral clustering algorithm

## 17.1 Inputs

Spectral clustering algorithm নেয়:

\[
W \in \mathbb{R}^{N \times N},
\]

যা হলো similarity weights matrix, এবং positive integer:

\[
k,
\]

যা construct করতে চাওয়া clusters-এর সংখ্যা।

_উৎস: স্লাইড পৃ. ২৩।_

---

## 17.2 Algorithm steps

### Step 1 — Node degrees compute করা

প্রতিটি node \(i\)-এর জন্য:

\[
d_i \leftarrow \sum_j w_{i,j}.
\]

এগুলো \(W\)-এর row sums।

_উৎস: স্লাইড পৃ. ২৩।_

---

### Step 2 — Degree matrix build করা

Construct করো:

\[
D = \operatorname{diag}(d_1,\ldots,d_N).
\]

_উৎস: স্লাইড পৃ. ২৩।_

---

### Step 3 — Unnormalised Laplacian compute করা

\[
L \leftarrow D - W.
\]

_উৎস: স্লাইড পৃ. ২৩।_

---

### Step 4 — Eigenvectors compute করা

Compute করো:

\[
v_1,\ldots,v_k,
\]

যেগুলো \(L\)-এর first \(k\) eigenvectors।

_উৎস: স্লাইড পৃ. ২৩।_

---

### Step 5 — Matrix \(V\) build করা

Build করো:

\[
V \in \mathbb{R}^{N \times k}
\]

যেখানে

\[
v_1,\ldots,v_k
\]

column vectors হিসেবে থাকবে। অর্থাৎ:

\[
V =
\begin{pmatrix}
| & | & & | \\
v_1 & v_2 & \cdots & v_k \\
| & | & & |
\end{pmatrix}.
\]

_উৎস: স্লাইড পৃ. ২৩।_

---

### Step 6 — Rows-কে projected data points হিসেবে interpret করা

\(V\)-এর rows-কে projected data points হিসেবে নেওয়া হয়:

\[
\mathbb{R}^k.
\]

Slides এটিকে explicitly **dimension reduction** বলে।

_উৎস: স্লাইড পৃ. ২৩।_

---

### Step 7 — Spectral embedding-এ K-means চালানো

\(V\)-এর rows-কে \(\mathbb{R}^k\)-তে K-means দিয়ে cluster করা হয়।

_উৎস: স্লাইড পৃ. ২৩।_

---

### Step 8 — Clusters return করা

Algorithm return করে:

\[
C_1,\ldots,C_k.
\]

_উৎস: স্লাইড পৃ. ২৩।_

---

## 17.3 Key conceptual point

Spectral clustering original data-তে directly K-means চালায় না। এটি প্রথমে graph তৈরি করে, Laplacian compute করে, eigenvectors extract করে, data-কে lower-dimensional spectral space-এ embed করে, তারপর সেই embedded representation-এ K-means চালায়।

_উৎস: স্লাইড পৃ. ২৩।_

---

# 18. Laplacian spectrum বোঝা

## 18.1 Connected graph case

Graph connected হলে \(L\)-এর first eigenvector:

\[
\mathbf{1}
=
(1,1,\ldots,1)^\top.
\]

_উৎস: স্লাইড পৃ. ২৪।_

---

## 18.2 Disconnected graph case

Graph disconnected হলে এবং \(k\) টি connected components থাকলে Laplacian spectrum / eigendecomposition block diagonal। First \(k\) eigenvectors হলো components-এর indicator vectors:

\[
\mathbf{1}_{C_1}, \ldots, \mathbf{1}_{C_k}.
\]

_উৎস: স্লাইড পৃ. ২৪।_

---

## 18.3 Slide p. 24-এর visual

স্লাইড পৃ. ২৪-এর figure-এ three connected components-সহ একটি graph-এর block diagonal Laplacian structure দেখানো হয়েছে। Blocks labelled \(L_1\), \(L_2\), এবং \(L_3\)। পাশে first three eigenvectors দেখানো হয়েছে, যেখানে প্রতিটি vector একটি connected component-এর indicator-এর মতো কাজ করছে।

_উৎস: স্লাইড পৃ. ২৪।_

### Interpretation

Graph যদি perfectly disconnected components-এ split হয়, Laplacian eigenvectors সরাসরি সেই components reveal করে।

এ কারণেই spectral clustering কাজ করতে পারে: Laplacian-এর eigenvectors cluster membership information encode করে।

---

# 19. Spectral clustering summary

Lecture summary অনুযায়ী spectral clustering methods হলো এমন algorithms যা data থেকে derived matrices-এর eigenvectors ব্যবহার করে data points cluster করে।

_উৎস: স্লাইড পৃ. ২৫।_

## 19.1 Spectral clustering-এর strengths

Spectral clustering সম্পর্কে slides বলেছে:

- Basic linear algebra দিয়ে interpret করা সহজ।
- Efficient implementation সম্ভব।
- Hard non-convex clustering problems-এ useful, K-means-এর সীমাবদ্ধতা overcome করতে পারে।
- Data-র explicit low-dimensional representation পাওয়া যায়, যা সহজে cluster করা যায়।
- বিভিন্ন data problems-এ empirically successful।

_উৎস: স্লাইড পৃ. ২৫।_

---

# 20. Key concepts

## 20.1 Clustering

### সহজ ধারণা

Data group করা যাতে similar points একই cluster-এ থাকে এবং dissimilar points আলাদা cluster-এ থাকে।

### Slide definition

Data points-কে clusters-এ group করা, যাতে high intra-cluster similarity এবং low inter-cluster similarity থাকে।

_উৎস: স্লাইড পৃ. ৬।_

---

## 20.2 Intra-cluster similarity

### সহজ ধারণা

একই cluster-এর points-এর মধ্যে similarity।

### K-means formalism

K-means cluster centres থেকে squared distances minimise করে এটি promote করে:

\[
\sum_{k=1}^{K} \sum_{x \in C_k} \|x - \mu_k\|^2.
\]

_উৎস: স্লাইড পৃ. ১০।_

---

## 20.3 Inter-cluster similarity

### সহজ ধারণা

ভিন্ন clusters-এর points-এর মধ্যে similarity। ভালো clustering-এ এটি low হওয়া উচিত।

### Slides-এর formalism

Slides বলেছে K-means total inter-cluster variance maximise করে।

_উৎস: স্লাইড পৃ. ১০।_

---

## 20.4 K-means

### সহজ ধারণা

Centroid-based clustering algorithm যা nearest centre assignment এবং centre update পর্যায়ক্রমে repeat করে।

### Formal objective

\[
\sum_{k=1}^{K} \sum_{x \in C_k} \|x - \mu_k\|^2.
\]

_উৎস: স্লাইড পৃ. ১০।_

---

## 20.5 Similarity weight

### সহজ ধারণা

দুটি data point কতটা similar তার numerical measure।

### Formal definition

\[
w_{i,j} = s(x_i, x_j).
\]

_উৎস: স্লাইড পৃ. ১৬।_

---

## 20.6 Gaussian kernel similarity

### সহজ ধারণা

Distance-based similarity function: কাছের points-এর similarity \(1\)-এর কাছে, দূরের points-এর similarity \(0\)-এর কাছে।

### Formal definition

\[
w_{i,j}
=
\exp\left(
-\frac{\|x_i - x_j\|^2}{2\sigma^2}
\right).
\]

_উৎস: স্লাইড পৃ. ১৭।_

---

## 20.7 Similarity matrix

### সহজ ধারণা

সব data point pair-এর pairwise similarities সংরক্ষণ করা matrix।

### Formal definition

\[
W =
\begin{pmatrix}
w_{1,1} & w_{1,2} & \cdots & w_{1,N} \\
w_{2,1} & w_{2,2} & \cdots & w_{2,N} \\
\vdots & \vdots & \ddots & \vdots \\
w_{N,1} & w_{N,2} & \cdots & w_{N,N}
\end{pmatrix}.
\]

Symmetric হয় যখন:

\[
w_{i,j}=w_{j,i}.
\]

_উৎস: স্লাইড পৃ. ১৮।_

---

## 20.8 Weighted graph

### সহজ ধারণা

Dataset-এর graph representation, যেখানে nodes হলো data points এবং edge weights হলো similarities।

### Formal definition

\[
G=(V,E,W),
\]

যেখানে:

- \(V\): vertices / data points।
- \(E\): edges, যেখানে \(w_{i,j}>0\) হলে edge থাকে।
- \(W\): edges-এর weights।

_উৎস: স্লাইড পৃ. ১৬।_

---

## 20.9 Node degree

### সহজ ধারণা

একটি node-এর সব অন্য nodes-এর সাথে total connection strength।

### Formal definition

\[
d_i = \sum_j w_{i,j}.
\]

_উৎস: স্লাইড পৃ. ১৯।_

---

## 20.10 Degree matrix

### সহজ ধারণা

Node degrees রাখা diagonal matrix।

### Formal definition

\[
D = \operatorname{diag}(d_1,\ldots,d_N).
\]

_উৎস: স্লাইড পৃ. ১৯ এবং পৃ. ২৩।_

---

## 20.11 Graph Laplacian

### সহজ ধারণা

Graph connectivity encode করা matrix, যার eigenvectors থেকে cluster information পাওয়া যায়।

### Formal definition

\[
L = D - W.
\]

_উৎস: স্লাইড পৃ. ২০।_

---

## 20.12 Spectral clustering

### সহজ ধারণা

Graph-based clustering method: data থেকে derived matrix-এর eigenvectors ব্যবহার করে low-dimensional representation তৈরি করা হয়, তারপর সেই representation cluster করা হয়।

### Slide definition / summary

Spectral clustering algorithms data থেকে derived matrices-এর eigenvectors ব্যবহার করে data points cluster করে।

_উৎস: স্লাইড পৃ. ২৫।_

---

# 21. Formulas এবং equations collected

## 21.1 K-means objective

\[
\sum_{k=1}^{K} \sum_{x \in C_k} \|x - \mu_k\|^2.
\]

## 21.2 Similarity weights

\[
w_{i,j}=s(x_i,x_j).
\]

## 21.3 Gaussian kernel similarity

\[
w_{i,j}
=
\exp\left(
-\frac{\|x_i-x_j\|^2}{2\sigma^2}
\right).
\]

## 21.4 Node \(i\)-এর degree

\[
d_i = \sum_j w_{i,j}.
\]

## 21.5 Degree matrix

\[
D = \operatorname{diag}(d_1,\ldots,d_N).
\]

## 21.6 Unnormalised graph Laplacian

\[
L = D - W.
\]

## 21.7 Laplacian quadratic form

\[
y^\top L y
=
\frac{1}{2}
\sum_{i,j}
w_{i,j}(y_i-y_j)^2.
\]

## 21.8 Laplacian eigenvalue ordering

\[
0 = \lambda_1 \leq \lambda_2 \leq \cdots \leq \lambda_N.
\]

## 21.9 Constant one vector

\[
\mathbf{1}=(1,1,\ldots,1)^\top.
\]

## 21.10 Connected components-এর indicator vectors

\[
\mathbf{1}_{C_1},\ldots,\mathbf{1}_{C_k}.
\]

---

# 22. Slides-এর worked examples

## 22.1 Data clustering visual example

স্লাইড পৃ. ৫-এ unclustered data এবং clustered data পাশাপাশি দেখানো হয়েছে। Clustered version-এ points তিনটি group-এ separated। এটি numerical worked example নয়; illustrative visual example।

_উৎস: স্লাইড পৃ. ৫।_

## 22.2 K-means failure example: ring এবং centre

স্লাইড পৃ. ১১-তে central cluster এবং outer ring dataset-এ K-means failure দেখানো হয়েছে। Ground truth centre blob এবং ring আলাদা করে, কিন্তু K-means centroid-based split করে true structure match করে না।

_উৎস: স্লাইড পৃ. ১১।_

## 22.3 K-means failure example: curved clusters

স্লাইড পৃ. ১২-তে two curved / non-convex clusters-এ K-means failure দেখানো হয়েছে। Ground truth arcs follow করে, কিন্তু K-means output structure ভুলভাবে কাটে।

_উৎস: স্লাইড পৃ. ১২।_

## 22.4 Laplacian spectrum visual example

স্লাইড পৃ. ২৪-এ three connected components সহ block diagonal Laplacian দেখানো হয়েছে। First three eigenvectors corresponding components-এর indicator vectors-এর মতো।

_উৎস: স্লাইড পৃ. ২৪।_

**[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** Slides-এ numerical worked examples নেই।

---

# 23. Exam flags

## 23.1 Explicit exam statements

**Slides-এ কোনো explicit exam statement পাওয়া যায়নি।**

**[অস্পষ্ট: ট্রান্সক্রিপ্ট দেওয়া হয়নি]** Spoken lecture-এ “this is important”, “you should know this”, বা “this will be on the exam” ধরনের hints থাকতে পারে, কিন্তু transcript না থাকায় capture করা যায়নি।

---

## 23.2 Slides থেকে high-value exam-revision material

Explicit exam flag না থাকলেও নিচের items লেকচারের learning outcomes-এর কারণে central।

### K-means algorithm জানতে হবে

বিশেষ করে iterative assignment / update process।

_উৎস: স্লাইড পৃ. ৮।_

### K-means objective জানতে হবে

\[
\sum_{k=1}^{K} \sum_{x \in C_k} \|x-\mu_k\|^2.
\]

_উৎস: স্লাইড পৃ. ১০।_

### K-means weaknesses জানতে হবে

বিশেষ করে:

- \(K\) আগে থেকে choose করতে হয়।
- Local optima এবং initialization dependence।
- Non-convex shapes-এর জন্য suitable নয়।
- Noise / outliers handle করতে সমস্যা।
- Mean defined থাকা দরকার।

_উৎস: স্লাইড পৃ. ১৩।_

### Spectral clustering কীভাবে graph construct করে জানতে হবে

Data points vertices হয়; similarities edge weights হয়।

_উৎস: স্লাইড পৃ. ১৬।_

### Gaussian kernel similarity formula জানতে হবে

\[
w_{i,j}
=
\exp\left(
-\frac{\|x_i-x_j\|^2}{2\sigma^2}
\right).
\]

_উৎস: স্লাইড পৃ. ১৭।_

### Degree matrix এবং graph Laplacian জানতে হবে

\[
d_i=\sum_j w_{i,j},
\qquad
D=\operatorname{diag}(d_1,\ldots,d_N),
\qquad
L=D-W.
\]

_উৎস: স্লাইড পৃ. ১৯–২০।_

### Connected components এবং eigenvalue \(0\)-এর connection জানতে হবে

Connected components-এর সংখ্যা eigenvalue \(0\)-এর multiplicity-এর সমান, এবং eigenspace components-এর indicator vectors দ্বারা spanned।

_উৎস: স্লাইড পৃ. ২২।_

### Spectral clustering algorithm জানতে হবে

\(W\) construct, \(D\) compute, \(L\) compute, first \(k\) eigenvectors find, \(V\) build, \(V\)-এর rows-কে \(\mathbb{R}^k\)-এ projected points হিসেবে নেওয়া, তারপর K-means চালানো।

_উৎস: স্লাইড পৃ. ২৩।_

---

# 24. Connections

## 24.1 K-means spectral clustering-কে motivate করে

Lecture K-means থেকে spectral clustering-এ যায় K-means-এর non-convex clusters নিয়ে limitations দেখিয়ে। Spectral clustering hard non-convex clustering problems-এ useful হিসেবে presented, যা K-means-এর limitation overcome করে।

_উৎস: স্লাইড পৃ. ১১–১৩ এবং পৃ. ২৫।_

---

## 24.2 Clustering representation learning-এর সাথে যুক্ত

Clustering-কে representation learning-এর একটি ধরন বলা হয়েছে। Spectral clustering এই idea আরও explicit করে, কারণ \(V \in \mathbb{R}^{N \times k}\)-এর rows ব্যবহার করে low-dimensional representation তৈরি হয়।

_উৎস: স্লাইড পৃ. ৬ এবং পৃ. ২৩।_

---

## 24.3 Spectral clustering graph theory এবং linear algebra যুক্ত করে

Method-টি graph-theoretic objects ব্যবহার করে:

- vertices,
- edges,
- weights,
- connected components,

এবং linear algebraic objects ব্যবহার করে:

- matrices,
- eigenvalues,
- eigenvectors,
- graph Laplacian।

_উৎস: স্লাইড পৃ. ৩, ১৬, ২০–২৪।_

---

## 24.4 Slides-এ external references

Slides-এ Laplacian properties এবং connected component theorem-এর proof-এর জন্য Ulrike von Luxburg-এর tutorial refer করা হয়েছে।

_উৎস: স্লাইড পৃ. ২১–২২।_

Figures credited to:

- Jonathon Byrd-এর blog: data clustering picture।
- Sandipan Dey-এর blog: K-means failure cases।
- Aarti Singh, CMU slides: similarity graph এবং Laplacian spectrum figures।

_উৎস: স্লাইড পৃ. ৫, ১১–১২, ১৬, ২৪।_

---

# 25. Recording-এ revisit করার unclear sections

Transcript না থাকায় নিচের sections recording-এ শুনে দেখা সবচেয়ে useful হবে।

1. **২৫ মিনিটের clustering motivation অংশ**  
   Slides শুধু brief bullets দেয়; lecturer সম্ভবত examples এবং extra explanation দিয়েছেন।  
   _উৎস: স্লাইড পৃ. ৪–৭।_

2. **K-means animation**  
   Slide animation link দেয়, কিন্তু animation content parsed slides-এ নেই।  
   _উৎস: স্লাইড পৃ. ৯।_

3. **K-means objective derivation**  
   Objective stated হয়েছে, কিন্তু derivation steps slides-এ নেই।  
   _উৎস: স্লাইড পৃ. ১০।_

4. **K-means কেন inter-cluster variance maximise করে**  
   Statement আছে, derivation নেই।  
   _উৎস: স্লাইড পৃ. ১০।_

5. **Failure case explanations**  
   Visuals আছে, কিন্তু lecturer হয়তো exactly কেন assignments ভুল হয় তা ব্যাখ্যা করেছেন।  
   _উৎস: স্লাইড পৃ. ১১–১২।_

6. **Similarity function এবং Gaussian kernel parameter \(\sigma\) choice**  
   Formula আছে, parameter selection discussion slides-এ নেই।  
   _উৎস: স্লাইড পৃ. ১৭।_

7. **Laplacian properties-এর proof**  
   Slides von Luxburg tutorial refer করেছে, proof দেখায়নি।  
   _উৎস: স্লাইড পৃ. ২১।_

8. **Connected components theorem-এর proof**  
   Proof referenced, included নয়।  
   _উৎস: স্লাইড পৃ. ২২।_

9. **First \(k\) eigenvectors কেন useful embedding দেয়**  
   Algorithm step এবং connected-component theorem motivation দেয়, কিন্তু full explanation হয়তো verbally দেওয়া হয়েছে।  
   _উৎস: স্লাইড পৃ. ২২–২৪।_

10. **Spoken exam hints**  
    Slides-এ explicit exam hints নেই; transcript / recording দরকার।

---

# 26. Quick revision checklist

- [ ] Clustering-এর informal definition বলতে পারি: high intra-cluster similarity, low inter-cluster similarity।
- [ ] Clustering কেন unsupervised learning জানি।
- [ ] K-means algorithm-এর assignment এবং update steps ব্যাখ্যা করতে পারি।
- [ ] K-means objective লিখতে পারি:

\[
\sum_{k=1}^{K} \sum_{x \in C_k} \|x-\mu_k\|^2.
\]

- [ ] K-means-এর strengths এবং weaknesses explain করতে পারি।
- [ ] Non-convex clusters-এ K-means কেন fail করে তা ring এবং curved examples দিয়ে বলতে পারি।
- [ ] Similarity weights \(w_{i,j}=s(x_i,x_j)\) define করতে পারি।
- [ ] Gaussian kernel formula লিখতে পারি।
- [ ] Weighted graph \(G=(V,E,W)\) explain করতে পারি।
- [ ] Degree \(d_i=\sum_j w_{i,j}\), degree matrix \(D\), এবং Laplacian \(L=D-W\) define করতে পারি।
- [ ] Laplacian quadratic form identity লিখতে পারি:

\[
y^\top L y
=
\frac{1}{2}
\sum_{i,j} w_{i,j}(y_i-y_j)^2.
\]

- [ ] Laplacian eigenvalues non-negative এবং smallest eigenvalue \(0\) জানি।
- [ ] Connected components এবং eigenvalue \(0\)-এর multiplicity-এর theorem explain করতে পারি।
- [ ] Spectral clustering algorithm-এর steps বলতে পারি।
- [ ] Spectral clustering কীভাবে K-means-এর non-convex limitation overcome করতে পারে তা explain করতে পারি।
