---
subject: COMP64501
chapter: 12
title: "Intro to ML — Flashcards"
language: en
---

# Intro to ML — Flashcards

42 flashcards. Click each question to reveal the answer.

<details>
<summary><strong>Q1.</strong> Given a new problem description, how do you set up the ML/statistical-learning pipeline?</summary>

Steps:
1) State the prediction target.
2) Choose/identify the dataset.
3) Represent each input as a feature vector x.
4) Choose a model/function f(x,w).
5) Fit w from training data.
6) Predict for new x*.
7) Check whether predictions generalise.
Reference: machine/statistical learning designs an algorithm based on a mathematical model/function and a dataset to extract knowledge from data for prediction problems.

</details>

<details>
<summary><strong>Q2.</strong> Discriminator: is this ML/statistical learning or just fixed hand-coded rules?</summary>

Ask: are parameters/model behaviour learned from data?
Yes → ML/statistical learning.
No → just fixed rules in the sense of this sheet.
Reference: the algorithm is designed around a mathematical model/function plus a dataset, with the goal of extracting knowledge from data.

</details>

<details>
<summary><strong>Q3.</strong> How do you map an application example into ML notation without inventing details?</summary>

Method:
1) Identify the input object.
2) Convert/represent it as x.
3) Identify y only if a target label is given.
4) Form (x,y) for labelled cases.
5) Choose f(x,w) as the predictive model.
6) Leave unspecified features/algorithms unspecified.
Reference: the sheet’s application slides illustrate prediction/learning setups but often do not specify features, model classes, or algorithms.

</details>

<details>
<summary><strong>Q4.</strong> How do you recognise variability in an input domain?</summary>

Look for multiple inputs that should receive the same answer but differ in appearance/values. The model must learn a pattern robust to those differences, not memorise one exact form.
Reference: variability means examples of the same underlying target can appear in different forms; the sheet names this before introducing x and y.

</details>

<details>
<summary><strong>Q5.</strong> How do you create and use a feature vector x?</summary>

Steps:
1) Start with a raw input object A.
2) Apply feature extraction.
3) Output a numerical vector x.
4) Feed x into the predictive model.
Reference: feature extraction transforms an input into a vector x; x = feature vector extracted from the input.

</details>

<details>
<summary><strong>Q6.</strong> How do you identify the label y?</summary>

Ask: what correct answer/target is attached to x during training? That target is y. If no such target is available, do not call it labelled supervised data.
Reference: in an instance (x,y), y is the label.

</details>

<details>
<summary><strong>Q7.</strong> How do you form one training instance?</summary>

Steps:
1) Feature-extract the input to get x.
2) Attach its target label y.
3) Store the pair (x,y).
Reference: an instance is the pair (x,y), where x is the input vector and y is the label.

</details>

<details>
<summary><strong>Q8.</strong> Discriminator: x, y, or w?</summary>

Ask what role the quantity plays:
x → observed input representation.
y → target/correct answer.
w → learned model parameter(s).
Reference: f(x,w) uses input x and parameters w; an instance is (x,y).

</details>

<details>
<summary><strong>Q9.</strong> How do you read f(x,w) in a model question?</summary>

Use it as a prediction rule:
1) x is the current input vector.
2) w is the set of model parameters.
3) f combines x and w to produce a prediction.
4) After training, plug in fitted w.
Reference: the objective is to find a function f(x,w), where x is the input and w denotes model parameters.

</details>

<details>
<summary><strong>Q10.</strong> Discriminator: model/function or dataset?</summary>

Ask what changes and what is stored:
Model/function → maps x to a prediction using w.
Dataset → collection of examples used to estimate w.
Reference: ML uses both a mathematical model/function and a dataset.

</details>

<details>
<summary><strong>Q11.</strong> How do you form a training set of N labelled examples?</summary>

Steps:
1) Build N instances.
2) Index them as (x_1,y_1), ..., (x_N,y_N).
3) Use this collection to fit the predictive model.
Reference: training set = (x_1,y_1), ..., (x_N,y_N), a set of N inputs and labels used to fit the predictive model.

</details>

<details>
<summary><strong>Q12.</strong> What is the training/estimation phase procedure?</summary>

Steps:
1) Choose f(x,w).
2) Choose a fit criterion/objective.
3) Search for values of w that best fit the training data.
4) Keep the fitted w for prediction.
Reference: estimation/training is the process of getting the values of w in f(x,w) that best fit the data.

</details>

<details>
<summary><strong>Q13.</strong> Discriminator: training performance or generalisation?</summary>

Ask: is the model being judged on examples it already trained on or on new x*?
Seen training examples → training performance.
New x* → generalisation.
Reference: generalisation is the ability to correctly predict labels for new inputs x*, not merely to fit the training set.

</details>

<details>
<summary><strong>Q14.</strong> How do you make a prediction for a new input x*?</summary>

Steps:
1) Represent the new input as x*.
2) Use the fitted parameters w_hat.
3) Compute y_hat = f(x*,w_hat).
4) If the true y* is later known, compare y_hat with y*.
Reference: generalisation concerns correct prediction on new inputs x*.

</details>

<details>
<summary><strong>Q15.</strong> Discriminator: supervised or unsupervised learning?</summary>

Ask: are labels y_i available during training?
Yes → supervised learning.
No, only x_i are available → unsupervised learning.
Reference: supervised data include labels y; unsupervised learning has access to x_1, ..., x_N but not y_i.

</details>

<details>
<summary><strong>Q16.</strong> Discriminator: classification or regression?</summary>

Ask one question: what kind of target is y?
Discrete/category-valued y → classification.
Continuous numeric y → regression.
Reference: y discrete ⇒ classification; y continuous ⇒ regression.

</details>

<details>
<summary><strong>Q17.</strong> How do you recognise a classification task from notation?</summary>

Find the target y. If y takes class/category values rather than arbitrary real-valued measurements, use classification.
Reference: y is discrete ⇒ classification.

</details>

<details>
<summary><strong>Q18.</strong> How do you recognise a regression task from notation?</summary>

Find the target y. If y is a continuous numerical quantity, use regression.
Reference: y is continuous ⇒ regression.

</details>

<details>
<summary><strong>Q19.</strong> How do you write the unsupervised-learning data restriction?</summary>

Start from the labelled pattern (x_1,y_1), ..., (x_N,y_N), then remove labels: the learner receives only x_1, ..., x_N.
Reference: in unsupervised learning, labels y_i are not available; only inputs x_i are available.

</details>

<details>
<summary><strong>Q20.</strong> Discriminator: clustering, density estimation, or dimensionality reduction?</summary>

Ask what the unsupervised output should be:
Similar groups → clustering.
Probability function for x → density estimation.
Lower-dimensional representation/visualisation → dimensionality reduction.
Reference: the sheet lists these as the main unsupervised tasks.

</details>

<details>
<summary><strong>Q21.</strong> How do you apply clustering procedurally?</summary>

Steps:
1) Take unlabelled inputs x_1, ..., x_N.
2) Choose/assume a notion of similarity.
3) Group inputs that are similar.
4) Do not require labels y_i.
Reference: clustering goal = find similar groups.

</details>

<details>
<summary><strong>Q22.</strong> How do you apply density estimation procedurally?</summary>

Steps:
1) Take inputs x_1, ..., x_N.
2) Fit/estimate a probability function over x.
3) Use it to describe how likely or typical inputs are.
Reference: density-estimation goal = find a probability function for x.

</details>

<details>
<summary><strong>Q23.</strong> How do you apply dimensionality reduction or visualisation procedurally?</summary>

Steps:
1) Start with input vectors x.
2) Map each x to a lower-dimensional representation z.
3) Use z to visualise or inspect structure.
Reference: dimensionality-reduction/visualisation goal = find a lower-dimensional representation for x.

</details>

<details>
<summary><strong>Q24.</strong> What should you do with learning types that are only listed, not defined?</summary>

Revision rule: recognise the names but do not invent definitions from this sheet. The listed names are reinforcement learning, semi-supervised learning, active learning, and multi-task learning.
Reference: the sheet lists these other learning types but gives no definitions.

</details>

<details>
<summary><strong>Q25.</strong> Discriminator: face detection or face recognition?</summary>

Ask what answer is required:
Where is a face/object? → detection.
Which identity/person is it? → recognition.
Reference: face detection finds where faces are in an image; face recognition identifies or distinguishes faces once detected.

</details>

<details>
<summary><strong>Q26.</strong> How do you treat the generative-AI slide for revision?</summary>

Use it as a recognition card only: generative AI is introduced through systems that generate content such as images, text/dialogue, or code. Do not add model details not present in the sheet.
Reference: the sheet gives examples of content-generating systems but no formal definition or algorithm.

</details>

<details>
<summary><strong>Q27.</strong> How do you treat ML-to-AI showcase slides for revision?</summary>

Use them as application links: ML contributes to AI in domains such as game-playing, autonomous systems, and scientific prediction. Do not infer training algorithms or model classes.
Reference: the sheet presents these as examples of ML contributions to AI, without technical details.

</details>

<details>
<summary><strong>Q28.</strong> How do you set up a scalar linear predictive model from paired data?</summary>

Steps:
1) Identify scalar input x and scalar target y.
2) Assume prediction changes linearly with x.
3) Write y = w_1 x + w_0.
4) Estimate w_0 and w_1 from data.
5) Use the fitted line for prediction.
Reference: linear model y = w_1 x + w_0, where w_0 is intercept and w_1 is slope.

</details>

<details>
<summary><strong>Q29.</strong> How do you interpret w_0 and w_1 in y = w_1 x + w_0?</summary>

Use roles:
w_0 → intercept/baseline prediction when the input term contributes zero.
w_1 → slope/change in predicted y per unit increase in x.
Reference: in the linear model, w_0 is the intercept and w_1 is the slope.

</details>

<details>
<summary><strong>Q30.</strong> Discriminator: what does the sign of w_1 say?</summary>

Ask how y changes as x increases:
w_1 < 0 → predicted y decreases.
w_1 > 0 → predicted y increases.
w_1 = 0 → predicted y stays constant with x.
Reference: w_1 is the slope in y = w_1 x + w_0.

</details>

<details>
<summary><strong>Q31.</strong> How do you build the least-squares objective for any fitted model f?</summary>

Steps:
1) For each training point (x_i,y_i), compute prediction f(x_i).
2) Compute residual r_i = y_i - f(x_i).
3) Square it: r_i^2.
4) Sum over all i.
5) Minimise the sum over the model parameters.
Reference: E(w) = sum_i (y_i - f(x_i))^2.

</details>

<details>
<summary><strong>Q32.</strong> How do you substitute a linear model into least squares?</summary>

Steps:
1) Start with E(w_0,w_1) = sum_i (y_i - f(x_i))^2.
2) Use f(x_i) = w_1 x_i + w_0.
3) Substitute to get E(w_0,w_1) = sum_i [y_i - (w_1 x_i + w_0)]^2.
4) Minimise over w_0 and w_1.
Reference: linear least-squares objective = sum_i [y_i - (w_1 x_i + w_0)]^2.

</details>

<details>
<summary><strong>Q33.</strong> What is the residual/error for one training point?</summary>

Compute residual r_i = y_i - f(x_i). The sign says whether the observed target is above or below the prediction; least squares then uses r_i^2.
Reference: the sheet’s least-squares derivation uses y_i - f(x_i), then (y_i - f(x_i))^2.

</details>

<details>
<summary><strong>Q34.</strong> How do you estimate the parameters in the sheet’s linear-model procedure?</summary>

Steps:
1) Write y = w_1 x + w_0.
2) Build E(w_0,w_1) = sum_i [y_i - (w_1 x_i + w_0)]^2.
3) Choose w_0 and w_1 that minimise E.
4) Treat the minimisers as fitted parameters.
Reference: the sheet gives the least-squares objective and states the fitted parameters, without deriving a closed-form solution.

</details>

<details>
<summary><strong>Q35.</strong> How do you use fitted parameter values after training?</summary>

Steps:
1) Replace w by fitted w_hat.
2) For a new input x*, compute y_hat = f(x*,w_hat).
3) Do not refit using the new example when testing generalisation.
Reference: training estimates w; prediction uses f(x*,w_hat) on new inputs.

</details>

<details>
<summary><strong>Q36.</strong> How do you compare a prediction with an actual value?</summary>

Steps:
1) Compute y_hat = f(x*,w_hat).
2) Observe actual target y*.
3) Compute signed error y* - y_hat.
4) Positive error means actual is above prediction; negative means actual is below prediction.
Reference: the sheet compares model prediction with actual value by subtracting predicted from actual.

</details>

<details>
<summary><strong>Q37.</strong> How do you read a data-and-model plot?</summary>

Steps:
1) Identify x-axis and y-axis variables.
2) Treat points as observed pairs (x_i,y_i).
3) Treat the line/curve as fitted f(x,w_hat).
4) Compare slope/trend and point-to-model gaps.
Reference: the sheet overlays a fitted linear model on a scatter plot of data.

</details>

<details>
<summary><strong>Q38.</strong> Discriminator: insufficient training data or nonrepresentative training data?</summary>

Ask what is wrong with the training set:
Too few examples → insufficient quantity of training data.
Examples do not match future/test cases → nonrepresentative training data.
Reference: both are listed as main ML challenges.

</details>

<details>
<summary><strong>Q39.</strong> Discriminator: poor-quality data or irrelevant features?</summary>

Ask where the problem sits:
Bad/problematic records or values → poor-quality data.
Inputs included but not useful for prediction → irrelevant features.
Reference: both are listed as main ML challenges.

</details>

<details>
<summary><strong>Q40.</strong> Discriminator: overfitting or underfitting?</summary>

Ask how the model fits training data:
Fits training data too closely → overfitting.
Fails to fit training data sufficiently well → underfitting.
Reference: the sheet lists overfitting as fitting training data too closely and underfitting as failing to fit it sufficiently well.

</details>

<details>
<summary><strong>Q41.</strong> How do you use the six-challenge checklist before trusting a model?</summary>

Checklist:
1) Is there enough training data?
2) Is it representative?
3) Is data quality adequate?
4) Are features relevant?
5) Is the model overfitting?
6) Is the model underfitting?
Reference: the sheet’s six main challenges are insufficient quantity, nonrepresentative data, poor-quality data, irrelevant features, overfitting, and underfitting.

</details>

<details>
<summary><strong>Q42.</strong> What formula material should you not expand beyond the sheet?</summary>

Revision rule: know f(x,w), (x,y), the training set notation, y = w_1 x + w_0, least-squares residual sums, and prediction/error substitution. Do not add closed-form least-squares derivations unless another sheet supplies them.
Reference: the clean formula sheet gives these formulas only; no theorem or closed-form derivation is presented.

</details>
