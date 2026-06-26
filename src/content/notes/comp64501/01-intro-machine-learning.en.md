---
subject: COMP64501
chapter: 1
title: "Introduction to Machine Learning"
language: en
---

# Introduction to Machine Learning — Structured Study Notes

**Course:** Topics in Machine Learning, The University of Manchester  
**Lecturer:** Mauricio A. Álvarez  
**Lecture topic:** Introduction to Machine Learning  
**Source used:** Uploaded slide deck, *Intro_to_MachineLearning.pdf*  
**Transcript status:** [UNCLEAR] No transcript text was provided in the chat, so these notes are grounded in the slides only. Spoken explanations, spoken exam flags, and transcript-specific corrections still need to be added once the transcript is supplied.

**Topic and scope:**  
This lecture introduces machine learning/statistical learning as the design of algorithms that learn predictive models from data. It sets up core vocabulary — features, labels, training sets, generalisation, supervised vs unsupervised learning — and works through a simple linear least-squares predictive model using Olympic 100m race data.

---

## 1. Lecture orientation and recommended textbooks

The opening slides list textbooks for the course and background reading.

### 1.1 General machine learning and probabilistic ML texts

Recommended books shown in the slides:

- Rogers and Girolami, *A First Course in Machine Learning*, Chapman and Hall/CRC Press, 2nd edition, 2016. *(Slide 2)*
- Bishop, *Pattern Recognition and Machine Learning*, Springer-Verlag, 2006. *(Slide 2)*
- Murphy, *Machine Learning: A Probabilistic Perspective*, MIT Press, 2012. *(Slide 3)*
- Géron, *Hands-On Machine Learning with Scikit-Learn, Keras and TensorFlow*, O'Reilly, 3rd edition, 2022. *(Slide 3)*
- Murphy, *Probabilistic Machine Learning: An Introduction*, MIT Press, 2022. *(Slide 4)*
- Murphy, *Probabilistic Machine Learning: Advanced Topics*, MIT Press, 2023. *(Slide 4)*

### 1.2 Foundations and deep learning texts

Additional texts listed:

- Hardt and Recht, *Patterns, Predictions, and Actions: Foundations of Machine Learning*, Princeton University Press, 2022. *(Slide 5)*
- Zhang et al., *Dive into Deep Learning*, Cambridge University Press, 2023. *(Slide 5)*
- Prince, *Understanding Deep Learning*, MIT Press, 2023. *(Slide 6)*
- Bishop and Bishop, *Deep Learning: Foundations and Concepts*, Springer, 2023. *(Slide 6)*

**Connection:** These references connect the introductory lecture to broader machine learning, probabilistic modelling, foundations of ML, and deep learning.

---

## 2. Lecture structure

The lecture is organised around three main parts:

1. Machine learning
2. Definitions
3. An example of a predictive model

This contents slide appears before the major sections, marking the lecture's structure. *(Slides 7, 17, 21)*

---

## 3. Machine learning / statistical learning

### 3.1 Core idea

The slides define machine learning, also called statistical learning, around prediction problems.

#### Intuition

Machine learning is about designing algorithms that use data to solve prediction problems. The algorithm is not only a set of hand-coded rules; it is designed around:

- a mathematical model or function;
- a dataset;
- a process for extracting knowledge from the data.

#### Slide definition

The slide states that:

- we want to design an algorithm that helps solve different prediction problems;
- the algorithm is designed based on a mathematical model or function and a dataset;
- the goal is to extract knowledge from data. *(Slide 8)*

### 3.2 Major components introduced

The slides implicitly set up the standard machine learning pipeline:

1. Choose or define a model/function.
2. Use a dataset.
3. Fit the model to the data.
4. Use the model to make predictions.
5. Evaluate whether the model generalises to new examples.

[UNCLEAR] The transcript is needed to know whether the lecturer gave a more precise spoken definition of “statistical learning,” “knowledge,” or “prediction problem.”

---

## 4. Examples of machine learning problems

The slides present several examples to show the range of machine learning applications.

### 4.1 Handwritten digit recognition

The first example is handwritten digit recognition. The slide shows multiple handwritten examples of digits 0–9. *(Slide 9)*

#### Intuition

The same digit can be written in different ways by different people, so the machine learning system must deal with variability. The task is to recognise which digit an image represents.

#### Connection to later definitions

This example is reused in the “Basic definitions” section to introduce:

- feature extraction;
- feature vector $x$;
- label $y$;
- training instances $(x, y)$;
- predictive function $f(x, w)$. *(Slide 18)*

### 4.2 Face detection and face recognition

The slides include face detection and face recognition as machine learning problems. A visual example from Murphy (2012) shows a group photograph and a processed version where faces are marked with bounding boxes. *(Slide 10)*

#### Distinction

- **Face detection:** finding where faces are in an image.
- **Face recognition:** identifying or distinguishing faces once detected.

[UNCLEAR] The slides name both tasks but do not give formal definitions or algorithms. The transcript is needed for any spoken distinction between detection and recognition.

### 4.3 Predicting the age of a YouTube viewer

Another example is predicting the age of a person looking at a particular YouTube video. *(Slide 11)*

#### Intuition

This is a prediction problem where the input would be information related to a viewer/video interaction, and the output is the person's age.

[UNCLEAR] The slides do not specify the input features, whether age is treated as continuous regression or binned classification, or what data is used.

### 4.4 Stock market

The slides include the stock market as a machine learning problem. *(Slide 12)*

#### Intuition

The stock market example signals time-varying prediction, where past or current data may be used to predict some future market-related quantity.

[UNCLEAR] The slides do not specify whether the task is price prediction, trend prediction, risk modelling, or trading decision support.

### 4.5 Clustering: customer segmentation in e-commerce

The slides list clustering as a problem: segmenting customers in e-commerce. *(Slide 13)*

#### Intuition

Customer segmentation means grouping customers into similar groups based on data.

#### Connection

This connects directly to the later definition of unsupervised learning, where clustering is described as finding similar groups using only the inputs $x_1, \ldots, x_N$. *(Slide 20)*

### 4.6 Recommendation systems

The slides include recommendation systems as machine learning problems and show examples associated with online platforms such as Amazon-style recommendations, Facebook, and Netflix. *(Slide 14)*

#### Intuition

Recommendation systems predict what a user may want to buy, watch, read, or interact with.

[UNCLEAR] The slides do not specify collaborative filtering, content-based recommendation, ranking, or matrix factorisation.

---

## 5. Machine learning contributions to AI

The slides state that machine learning has contributed to advances in AI and show three examples:

- AlphaGo;
- autonomous driving;
- AlphaFold. *(Slide 15)*

### 5.1 AlphaGo

AlphaGo is presented as an example of machine learning contributing to AI.

#### Connection

This connects machine learning to game-playing AI.

[UNCLEAR] The slides do not explain the learning setup, model class, or training method behind AlphaGo.

### 5.2 Autonomous driving

Autonomous driving is presented as another AI advance involving machine learning.

#### Connection

This connects machine learning to robotics, perception, and decision-making in real-world systems.

[UNCLEAR] The slides do not distinguish perception, planning, control, or reinforcement learning aspects.

### 5.3 AlphaFold

AlphaFold is presented as a third example of machine learning contributing to AI.

#### Connection

This connects machine learning to scientific applications, especially biological or protein-related prediction.

[UNCLEAR] The slides do not explain the biological task or the model.

---

## 6. Generative AI

The slides include a separate “Generative AI” slide with:

- DALL-E;
- ChatGPT;
- GitHub Copilot. *(Slide 16)*

### 6.1 Intuition

Generative AI is introduced through examples of systems that generate content:

- **DALL-E:** image generation;
- **ChatGPT:** text/dialogue generation;
- **GitHub Copilot:** code generation assistance.

[UNCLEAR] The slides do not provide a formal definition of generative AI, nor do they explain generative models, language models, diffusion models, or code completion.

---

## 7. Basic definitions

The lecture then moves into formal terminology using handwritten digit recognition as the running example.

### 7.1 Variability

The slides highlight “variability” in handwritten digit recognition. *(Slide 18)*

#### Intuition

Different images of the same digit can look different. A model must handle this variability rather than memorising one exact appearance per digit.

[UNCLEAR] The slide names variability but does not formally define it.

### 7.2 Feature extraction and feature vector $x$

#### Slide definition

Each image can be transformed into a vector $x$. This process is called **feature extraction**. *(Slide 18)*

#### Intuition

The image is converted into a numerical representation that a model can use. Instead of working directly with a raw image as a visual object, the algorithm receives a vector $x$.

#### Formal notation


$$

x = \text{feature vector extracted from an image}

$$


The slide does not specify the dimension of $x$, the exact feature extraction method, or whether $x$ contains raw pixels or engineered features.

[UNCLEAR] Transcript needed to know whether the lecturer explained what the entries of $x$ represent.

### 7.3 Label $y$

#### Slide definition

An instance is made of the pair $(x, y)$, where $y$ is the label of the image. *(Slide 18)*

#### Intuition

For handwritten digits, $y$ is the correct digit class associated with the image.

#### Formal notation


$$

(x, y)

$$


where:

- $x$: feature vector;
- $y$: label.

### 7.4 Instance

#### Slide definition

An instance is the pair:


$$

(x, y)

$$


where $x$ is the transformed image/vector and $y$ is the image label. *(Slide 18)*

#### Intuition

One instance is one labelled example in the dataset.

### 7.5 Predictive function $f(x, w)$

#### Slide definition

The objective is to find a function:


$$

f(x, w)

$$


where $x$ is the input and $w$ denotes the model parameters. *(Slide 18)*

#### Intuition

The function takes the input representation $x$ and uses learned parameters $w$ to make a prediction.

[UNCLEAR] The slides do not define the output of $f(x,w)$ in the digit recognition example explicitly, though it is implied to relate to predicting the label.

---

## 8. Training set, training phase, and generalisation

### 8.1 Training set

#### Slide definition

A training set is a set of $N$ images and their labels:


$$

(x_1, y_1), \ldots, (x_N, y_N)

$$


used to fit the predictive model. *(Slide 19)*

#### Intuition

The training set is the collection of examples the model learns from.

### 8.2 Estimation / training phase

#### Slide definition

The estimation or training phase is the process of getting the values of $w$ in the function $f(x, w)$ that best fit the data. *(Slide 19)*

#### Intuition

Training means choosing parameter values so that the model matches the observed training examples as well as possible.

#### Formal object being estimated


$$

w

$$


where $w$ represents the parameters of the predictive function:


$$

f(x, w)

$$


### 8.3 Generalisation

#### Slide definition

Generalisation is the ability to correctly predict the label of new images:


$$

x^*

$$


where $x^*$ denotes a new input image/vector. *(Slide 19)*

#### Intuition

A model should not only work on the examples it has already seen. It should also make correct predictions on new images.

#### Key distinction

- **Training performance:** how well the model fits known examples.
- **Generalisation:** how well the model predicts unseen examples.

The slides explicitly define generalisation as prediction on new images $x^*$, not merely good fit to the training data. *(Slide 19)*

---

## 9. Supervised and unsupervised learning

### 9.1 Supervised learning

#### Slide definition

In supervised learning, the data includes labels $y$. The slides distinguish two cases:

- if $y$ is discrete: classification;
- if $y$ is continuous: regression. *(Slide 20)*

#### Intuition

Supervised learning uses examples where the desired answer is available during training.

### 9.2 Classification

#### Formal condition from slides


$$

y \text{ is discrete} \Rightarrow \text{classification}

$$


*(Slide 20)*

#### Intuition

The output belongs to one of a set of categories/classes.

#### Example connection

Handwritten digit recognition fits naturally with classification because the label is one of the digit classes.

[UNCLEAR] The slides do not explicitly state that digit recognition is classification, though the connection follows from the definitions given.

### 9.3 Regression

#### Formal condition from slides


$$

y \text{ is continuous} \Rightarrow \text{regression}

$$


*(Slide 20)*

#### Intuition

The output is a numerical quantity on a continuous scale.

#### Example connection

The Olympic 100m example later predicts time in seconds, so it fits the regression setting.

### 9.4 Unsupervised learning

#### Slide definition

In unsupervised learning, from a set:


$$

(x_1, y_1), \ldots, (x_N, y_N)

$$


we only have access to:


$$

x_1, \ldots, x_N

$$


That is, the labels $y_i$ are not available. *(Slide 20)*

#### Intuition

The model must find structure in the inputs without being given target labels.

### 9.5 Main unsupervised learning tasks listed

#### 9.5.1 Clustering

Goal:


$$

\text{Find similar groups}

$$


This is clustering. *(Slide 20)*

**Connection:** The earlier e-commerce customer segmentation example is a clustering example. *(Slide 13)*

#### 9.5.2 Density estimation

Goal:


$$

\text{Find a probability function for } x

$$


This is density estimation. *(Slide 20)*

#### 9.5.3 Dimensionality reduction and visualisation

Goal:


$$

\text{Find a lower-dimensional representation for } x

$$


This is dimensionality reduction and visualisation. *(Slide 20)*

### 9.6 Other types of learning

The slides also list:

- reinforcement learning;
- semi-supervised learning;
- active learning;
- multi-task learning. *(Slide 20)*

[UNCLEAR] The slides only list these types and do not define them.

---

## 10. Worked example: Olympic 100m data

The final major section develops an example of a predictive model using Olympic 100m data.

### 10.1 Dataset

The slides introduce Olympic 100m data with an image of a sprint race. *(Slide 22)*

The dataset plot shows:

- horizontal axis: Year;
- vertical axis: Seconds;
- title: Male 100 mts;
- points from roughly 1900 to after 2000;
- a general downward trend in race times over time. *(Slide 23)*

[UNCLEAR] The exact numerical dataset is not tabulated in the slides; only the scatter plot is shown.

### 10.2 Predictive modelling setup

The slides define a linear model:


$$

f(x, w)

$$


where:

- $y$ is the time in seconds;
- $x$ is the year of the competition. *(Slide 24)*

#### Formal model


$$

y = w_1x + w_0

$$


where:

- $w_0$ is the intercept;
- $w_1$ is the slope;
- $w$ is used to refer to both $w_0$ and $w_1$. *(Slide 24)*

#### Intuition

The model assumes that the predicted 100m time changes linearly with the year.

Because $w_1$ is later estimated as negative, the fitted line decreases as year increases.

### 10.3 Objective function

The slides state that an objective function is used to estimate the parameters $w_0$ and $w_1$ that best fit the data. *(Slide 25)*

#### Least-squares objective

The objective function used in the example is least squares:


$$

E(w_0, w_1)
=
\sum_{\forall i}
\left(y_i - f(x_i)\right)^2

$$


Substituting the linear model:


$$

E(w_0, w_1)
=
\sum_{\forall i}
\left[y_i - (w_1x_i + w_0)\right]^2

$$


*(Slide 25)*

#### Derivation steps shown/implied by the slides

The slides move through these steps:

1. Start with observed data points $(x_i, y_i)$.
2. Define the prediction from the model:

   
$$

   f(x_i) = w_1x_i + w_0
   
$$


3. Compute the prediction error/residual for each point:

   
$$

   y_i - f(x_i)
   
$$


4. Square each residual:

   
$$

   \left(y_i - f(x_i)\right)^2
   
$$


5. Sum squared residuals over all data points:

   
$$

   \sum_{\forall i}
   \left(y_i - f(x_i)\right)^2
   
$$


6. Minimise the total error with respect to the parameters $w$.

The slide does not show calculus or a closed-form solution derivation; it gives the objective and then states the result.

### 10.4 Fitted parameter values

By minimising the error with respect to $w$, the slides give:


$$

w_0 = 36.4

$$



$$

w_1 = -1.34 \times 10^{-2}

$$


*(Slide 25)*

#### Interpretation

- $w_0 = 36.4$ is the intercept.
- $w_1 = -1.34 \times 10^{-2}$ is the slope.
- The negative slope means the model predicts smaller 100m times in later years.

### 10.5 Data and model plot

The “Data and model” slide overlays the fitted linear model on the scatter plot of Olympic 100m times. The plotted line slopes downward from left to right, matching the decreasing trend in the data. *(Slide 26)*

---

## 11. Worked prediction: 2012 Olympic 100m time

The slides use the fitted model to predict the 100m time for 2012. *(Slide 27)*

### 11.1 Prediction question

The slide asks:

> What does the model predict for 2012?

### 11.2 Input value

Set:


$$

x = 2012

$$


### 11.3 Use the fitted linear model


$$

y = f(x, w)

$$



$$

y = f(x = 2012, w)

$$



$$

y = w_1x + w_0

$$


Substitute the values from the fitted model:


$$

y =
(-1.34 \times 10^{-2}) \times 2012 + 36.4

$$


The slide gives the result:


$$

y = 9.59

$$


*(Slide 27)*

### 11.4 Actual value

The actual value was:


$$

9.63

$$


*(Slide 27)*

### 11.5 Comparison

The model prediction is:


$$

9.59

$$


The actual value is:


$$

9.63

$$


Difference:


$$

9.63 - 9.59 = 0.04

$$


So the model prediction is $0.04$ seconds lower than the actual value.

### 11.6 [UNCLEAR] Rounding discrepancy

Using the rounded parameters exactly as written on the slides,


$$

(-1.34 \times 10^{-2}) \times 2012 + 36.4

$$


does not exactly reproduce $9.59$ under straightforward arithmetic. This is likely due to rounding of $w_0$, $w_1$, or both in the displayed slide values, but the transcript is needed to check whether the lecturer mentioned this.

For exam revision, preserve the slide's stated prediction:


$$

\boxed{9.59}

$$


and actual value:


$$

\boxed{9.63}

$$


---

## 12. Main challenges of machine learning

The final slide lists six main challenges of machine learning. *(Slide 28)*

### 12.1 Insufficient quantity of training data

The model may not have enough examples to learn a good predictive pattern.

[UNCLEAR] The slide lists this challenge but does not elaborate.

### 12.2 Nonrepresentative training data

The training data may not represent the data the model will face later.

[UNCLEAR] The slide lists this challenge but does not give an example.

### 12.3 Poor-quality data

The data may contain problems that make learning harder.

[UNCLEAR] The slide does not specify types of poor-quality data, such as errors, missing values, or noise.

### 12.4 Irrelevant features

The input representation may include features that are not useful for the prediction task.

[UNCLEAR] The slide lists this challenge but does not define “irrelevant features.”

### 12.5 Overfitting the training data

The model may fit the training data too closely.

[UNCLEAR] The slide lists overfitting but does not define it formally or visually.

### 12.6 Underfitting the training data

The model may fail to fit the training data sufficiently well.

[UNCLEAR] The slide lists underfitting but does not define it formally or visually.

---

## 13. Key concepts summary

### Machine learning / statistical learning

**Intuition:** Designing algorithms that learn from data to solve prediction problems.  
**Slide definition:** An algorithm based on a mathematical model/function and a dataset, used to extract knowledge from data. *(Slide 8)*

### Feature vector $x$

**Intuition:** A numerical representation of an input, such as an image.  
**Formal slide definition:** Each image can be transformed into a vector $x$, called feature extraction. *(Slide 18)*

### Label $y$

**Intuition:** The target or correct answer for an input.  
**Formal slide definition:** In an instance $(x, y)$, $y$ is the label of the image. *(Slide 18)*

### Instance

**Intuition:** One labelled example.  
**Formal slide definition:**


$$

(x, y)

$$


where $x$ is the input vector and $y$ is the label. *(Slide 18)*

### Predictive function $f(x,w)$

**Intuition:** A model that maps an input $x$, using parameters $w$, to a prediction.  
**Formal slide notation:**


$$

f(x, w)

$$


Objective: find this function. *(Slide 18)*

### Training set

**Intuition:** The labelled data used to fit the model.  
**Formal slide definition:**


$$

(x_1, y_1), \ldots, (x_N, y_N)

$$


a set of $N$ images and labels used to fit the predictive model. *(Slide 19)*

### Estimation / training phase

**Intuition:** Learning the parameter values.  
**Formal slide definition:** The process of getting the values of $w$ in $f(x,w)$ that best fit the data. *(Slide 19)*

### Generalisation

**Intuition:** The model works on new examples, not only the training examples.  
**Formal slide definition:** Ability to correctly predict the label of new images $x^*$. *(Slide 19)*

### Supervised learning

**Intuition:** Learning from labelled data.  
**Formal slide classification:**


$$

y \text{ discrete} \Rightarrow \text{classification}

$$



$$

y \text{ continuous} \Rightarrow \text{regression}

$$


*(Slide 20)*

### Unsupervised learning

**Intuition:** Learning structure from inputs without labels.  
**Formal slide definition:** From the set


$$

(x_1, y_1), \ldots, (x_N, y_N)

$$


we only have access to


$$

x_1, \ldots, x_N

$$


*(Slide 20)*

### Linear model

**Intuition:** Prediction changes linearly with the input.  
**Formal slide definition:**


$$

y = w_1x + w_0

$$


where $w_0$ is the intercept and $w_1$ is the slope. *(Slide 24)*

### Least-squares objective

**Intuition:** Choose parameters that minimise the total squared prediction error.  
**Formal slide definition:**


$$

E(w_0, w_1)
=
\sum_{\forall i}
(y_i - f(x_i))^2
=
\sum_{\forall i}
[y_i - (w_1x_i + w_0)]^2

$$


*(Slide 25)*

---

## 14. Exam flags

No explicit exam flags appear in the uploaded slides: there is no visible “this is on the exam,” “you should know this,” “common mistake,” or similar wording in the slide text.

### High-value material likely from slide emphasis

- Definitions of $x$, $y$, instance $(x,y)$, training set, training phase, and generalisation.
- Difference between supervised and unsupervised learning.
- Classification vs regression distinction based on whether $y$ is discrete or continuous.
- Linear model:

  
$$

  y = w_1x + w_0
  
$$


- Least-squares objective:

  
$$

  E(w_0, w_1)
  =
  \sum_{\forall i}
  [y_i - (w_1x_i + w_0)]^2
  
$$


- Olympic 100m prediction example:

  
$$

  w_0 = 36.4,\quad
  w_1 = -1.34 \times 10^{-2},\quad
  \hat{y}_{2012} = 9.59,\quad
  y_{\text{actual}} = 9.63
  
$$


Transcript needed to capture spoken exam flags.

---

## 15. Unclear sections to revisit with transcript/audio

- [UNCLEAR] The transcript was not provided, so spoken explanations, exam hints, and corrections to slide shorthand are missing.
- [UNCLEAR] The exact Olympic 100m dataset values are not tabulated in the slides; only the scatter plot is visible.
- [UNCLEAR] The 2012 prediction arithmetic does not exactly match the rounded displayed values $w_0 = 36.4$ and $w_1 = -1.34 \times 10^{-2}$; check whether the lecturer mentioned rounding.
- [UNCLEAR] The slides list overfitting and underfitting but do not define or illustrate them.
- [UNCLEAR] The slides list reinforcement learning, semi-supervised learning, active learning, and multi-task learning but do not define them.
- [UNCLEAR] Several application examples — stock market, recommendation systems, generative AI, AlphaGo, autonomous driving, AlphaFold — are shown as examples only, without technical details in the slides.

---

## 16. Clean formula sheet

### Predictive function


$$

f(x,w)

$$


### Instance


$$

(x,y)

$$


### Training set


$$

(x_1,y_1), \ldots, (x_N,y_N)

$$


### Linear model for Olympic 100m data


$$

y = w_1x + w_0

$$


where:

- $y$: time in seconds;
- $x$: year of the competition;
- $w_0$: intercept;
- $w_1$: slope.

### Least-squares objective


$$

E(w_0, w_1)
=
\sum_{\forall i}
(y_i - f(x_i))^2

$$


Substitute $f(x_i) = w_1x_i + w_0$:


$$

E(w_0, w_1)
=
\sum_{\forall i}
[y_i - (w_1x_i + w_0)]^2

$$


### Fitted parameters


$$

w_0 = 36.4

$$



$$

w_1 = -1.34 \times 10^{-2}

$$


### Prediction for 2012


$$

\hat{y}_{2012}
= f(2012,w)
= (-1.34 \times 10^{-2}) \times 2012 + 36.4
= 9.59

$$


### Actual 2012 value


$$

y_{2012} = 9.63

$$


### Prediction error using slide values


$$

y_{2012} - \hat{y}_{2012}
= 9.63 - 9.59
= 0.04

$$

