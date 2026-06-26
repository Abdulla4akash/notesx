---
subject: COMP64501
chapter: 2
title: "End-to-End ML Projects — Exercise Solutions"
language: en
---

# End-to-End ML Project — Structured Study Notes

**Topic and scope:** End-to-end ML project exercise sheet covering classifier evaluation, feature scaling, test-time preprocessing, outlier detection, binning, correlation/covariance, independence, and uncorrelated random variables.  
**Broader fit:** This sits at the intersection of introductory machine learning workflow/data preprocessing and probability/statistics foundations for ML.

**Course:** [not provided]  
**Lecture topic:** End-to-end ML project / ML preprocessing and probability review.  
**Source note:** Only one uploaded source was available: `ExerciseSheet_End_to_End_ML_projects_solutions (2).pdf`. No separate lecture transcript or slide deck was available in the chat, so transcript/slide-dependent gaps are marked as **[MISSING TRANSCRIPT/SLIDES]**.

---

## 1. Exercise sheet structure and difficulty levels

The exercise sheet labels exercises by difficulty:

- `(*)`: simple exercise, requiring less time.
- `(**)`: more complex.
- `(***)`: most complex.

The sheet contains 9 exercises:

1. Confusion matrix metrics: precision, recall, accuracy.
2. Normalisation and standardisation of exam scores.
3. Test-time normalisation before using a learned predictive model.
4. Outlier detection using the $\mu \pm 3\sigma$ rule.
5. Equal-width binning.
6. Correlation using socioeconomic data.
7. Independence vs uncorrelated random variables.
8. Proof that independence implies uncorrelatedness.
9. Covariance and correlation for $Y = aX + b$.

**Connection to earlier lecture:** Exercise 1 explicitly says “Following Lecture 2” when defining TP, TN, FP, and FN. Exercise 3 says the normalisation formula is “based on the lecture.”

---

## 2. Classifier evaluation from a confusion matrix

### 2.1 Problem setup

A machine learning classifier detects whether tissue in an image is **cancerous** or **healthy**.

The **positive class** is defined as:

$$
\text{positive class} = \text{cancerous}
$$

The validation-set confusion matrix is:

| Actual / Predicted | Cancerous predicted | Healthy predicted |
|---|---:|---:|
| Cancerous actual | 30 | 5 |
| Healthy actual | 15 | 100 |

### 2.2 Key concepts

#### True positive, false positive, true negative, false negative

**Intuition:**

- A **true positive** is a cancerous example correctly predicted as cancerous.
- A **false negative** is a cancerous example incorrectly predicted as healthy.
- A **false positive** is a healthy example incorrectly predicted as cancerous.
- A **true negative** is a healthy example correctly predicted as healthy.

**Formal mapping from the confusion matrix:**

$$
TP = 30
$$

$$
FN = 5
$$

$$
FP = 15
$$

$$
TN = 100
$$

This mapping follows from treating “cancerous” as the positive class.

---

### 2.3 Precision

#### Definition

**Intuition:** Precision measures how many predicted positives were actually positive.

**Formal definition:**

$$
\text{Precision} = \frac{TP}{TP + FP}
$$

#### Worked example

$$
\text{Precision}
=
\frac{30}{30 + 15}
=
\frac{30}{45}
=
\frac{2}{3}
$$

So:

$$
\boxed{\text{Precision} = \frac{2}{3} \approx 0.667}
$$

---

### 2.4 Recall

#### Definition

**Intuition:** Recall measures how many actual positives were correctly found.

**Formal definition:**

$$
\text{Recall} = \frac{TP}{TP + FN}
$$

#### Worked example

$$
\text{Recall}
=
\frac{30}{30 + 5}
=
\frac{30}{35}
=
\frac{6}{7}
$$

So:

$$
\boxed{\text{Recall} = \frac{6}{7} \approx 0.857}
$$

---

### 2.5 Accuracy

#### Definition

**Intuition:** Accuracy measures the fraction of all classified examples that were classified correctly.

**Formal definition:**

$$
\text{Accuracy}
=
\frac{TP + TN}{TP + TN + FP + FN}
$$

#### Worked example

$$
\text{Accuracy}
=
\frac{30 + 100}{30 + 100 + 15 + 5}
=
\frac{130}{150}
=
\frac{13}{15}
$$

So:

$$
\boxed{\text{Accuracy} = \frac{13}{15} \approx 0.867}
$$

---

### 2.6 Exam flags

No explicit exam flag such as “this will be on the exam” appears in the available PDF.

**Revision caution, not an explicit exam flag:** The positive class is cancerous. The values of TP, FP, TN, FN depend on this choice.

---

## 3. Feature scaling: normalisation and standardisation

The dataset contains scores for 20 students:

| ID | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Score | 42 | 47 | 59 | 27 | 84 | 49 | 72 | 43 | 73 | 59 | 58 | 82 | 50 | 79 | 89 | 75 | 70 | 59 | 67 | 35 |

For this feature:

$$
\min(s) = 27
$$

$$
\max(s) = 89
$$

$$
\mu = 60.95
$$

$$
\sigma = 17.2519
$$

The sheet uses these values to perform normalisation and standardisation.

---

### 3.1 Range normalisation to $[0,1]$

#### Key concept

**Intuition:** Range normalisation rescales values so that the minimum becomes the lower end of the target range and the maximum becomes the upper end.

For the target range $[0,1]$:

- The original minimum $27$ maps to $0$.
- The original maximum $89$ maps to $1$.

#### Formal definition

The general range-normalisation formula given is:

$$
s_i'
=
\frac{s_i - \min(s)}{\max(s) - \min(s)}
\times
(\text{high} - \text{low})
+
\text{low}
$$

where:

- $s$ is the Score feature.
- $s_i$ is the $i$-th score.
- $s_i'$ is the $i$-th normalised score.
- $\text{low}$ and $\text{high}$ are the bounds of the target range.

For $[0,1]$:

$$
\text{low} = 0, \qquad \text{high} = 1
$$

So:

$$
s_i'
=
\frac{s_i - 27}{89 - 27}
$$

---

### 3.2 Worked example: score $42$ normalised to $[0,1]$

For the first score:

$$
s_1 = 42
$$

$$
s_1'
=
\frac{42 - 27}{89 - 27}
\times
(1 - 0)
+
0
$$

$$
=
\frac{15}{62}
$$

$$
=
0.2419
$$

Rounded to two decimals:

$$
\boxed{s_1' = 0.24}
$$

---

### 3.3 Full $[0,1]$ normalised dataset

| ID | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Score | 0.24 | 0.32 | 0.52 | 0.00 | 0.92 | 0.35 | 0.73 | 0.26 | 0.74 | 0.52 |

| ID | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Score | 0.50 | 0.89 | 0.37 | 0.84 | 1.00 | 0.77 | 0.69 | 0.52 | 0.65 | 0.13 |

---

### 3.4 Range normalisation to $[-1,1]$

#### Key concept

The same range-normalisation formula is used, but the target bounds change:

$$
\text{low} = -1, \qquad \text{high} = 1
$$

So:

$$
s_i'
=
\frac{s_i - 27}{89 - 27}
\times
(1 - (-1))
+
(-1)
$$

$$
=
\frac{s_i - 27}{62}
\times
2
-
1
$$

---

### 3.5 Worked example: score $42$ normalised to $[-1,1]$

$$
s_1'
=
\frac{42 - 27}{89 - 27}
\times
(1 - (-1))
+
(-1)
$$

$$
=
\frac{15}{62}
\times
2
-
1
$$

$$
=
-0.5161
$$

Rounded to two decimals:

$$
\boxed{s_1' = -0.52}
$$

---

### 3.6 Full $[-1,1]$ normalised dataset

| ID | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Score | -0.52 | -0.35 | 0.03 | -1.00 | 0.84 | -0.29 | 0.45 | -0.48 | 0.48 | 0.03 |

| ID | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Score | 0.00 | 0.77 | -0.26 | 0.68 | 1.00 | 0.55 | 0.39 | 0.03 | 0.29 | -0.74 |

---

### 3.7 Standardisation

#### Key concept

**Intuition:** Standardisation converts each value into the number of standard deviations it lies above or below the mean.

Values below the mean become negative. Values above the mean become positive.

#### Formal definition

The formula used is:

$$
x_i'
=
\frac{s_i - \mu}{\sigma}
$$

where:

- $s_i$ is the $i$-th score.
- $x_i'$ is the $i$-th standardised score.
- $\mu$ is the mean of the Score feature.
- $\sigma$ is the standard deviation of the Score feature.

The sheet gives:

$$
\mu = 60.95
$$

$$
\sigma = 17.2519
$$

---

### 3.8 Worked example: standardising score $42$

$$
x_1'
=
\frac{42 - 60.95}{17.2519}
$$

$$
=
-1.0984
$$

Rounded to two decimals:

$$
\boxed{x_1' = -1.10}
$$

---

### 3.9 Full standardised dataset

| ID | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Score | -1.10 | -0.81 | -0.11 | -1.97 | 1.34 | -0.69 | 0.64 | -1.04 | 0.70 | -0.11 |

| ID | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Score | -0.17 | 1.22 | -0.63 | 1.05 | 1.63 | 0.81 | 0.52 | -0.11 | 0.35 | -1.50 |

---

### 3.10 Unclear section

**[UNCLEAR]** The standard deviation value $17.2519$ corresponds to using the sample standard deviation with denominator $N-1$ for the listed scores, but the exercise does not explicitly state the denominator used in Exercise 2. Later, Exercise 6 defines covariance and standard deviation using $1/N$, so keep an eye on which convention is expected.

---

## 4. Test-time normalisation before prediction

### 4.1 Problem setup

A model predicts the number of bike rentals $y$ from two attributes:

- $x_1$: temperature
- $x_2$: humidity

The model is:

$$
y = 500x_1 + 300x_2
$$

The model was trained using **normalised data**.

Training-set feature ranges:

$$
\min x_1 = -10, \qquad \max x_1 = 39
$$

$$
\min x_2 = 20, \qquad \max x_2 = 100
$$

At test time, the input vector is:

$$
x^* =
\begin{bmatrix}
25 \\
70
\end{bmatrix}
$$

The goal is to compute the prediction $y$.

---

### 4.2 Key concept

**Intuition:** Because the model was trained on normalised data, the test input must also be normalised before being passed into the model.

The model should not be applied directly to:

$$
\begin{bmatrix}
25 \\
70
\end{bmatrix}
$$

Instead, the test vector must be converted into the same normalised scale used during training.

---

### 4.3 Formal normalisation formula

The lecture-based normalisation formula used is:

$$
\bar{x}_j
=
\frac{x_j - \min x_j}{\max x_j - \min x_j}
$$

where:

- $\min x_j$ and $\max x_j$ are the minimum and maximum values of feature $x_j$ in the training set.
- $\bar{x}_j$ is the normalised value.
- This is normalisation to the range $[0,1]$.

---

### 4.4 Normalising $x_1^* = 25$

$$
\bar{x}_1^*
=
\frac{x_1^* - \min x_1}{\max x_1 - \min x_1}
$$

$$
=
\frac{25 - (-10)}{39 - (-10)}
$$

$$
=
\frac{35}{49}
$$

$$
=
\frac{5}{7}
$$

So:

$$
\boxed{\bar{x}_1^* = \frac{5}{7}}
$$

---

### 4.5 Normalising $x_2^* = 70$

$$
\bar{x}_2^*
=
\frac{x_2^* - \min x_2}{\max x_2 - \min x_2}
$$

$$
=
\frac{70 - 20}{100 - 20}
$$

$$
=
\frac{50}{80}
$$

$$
=
\frac{5}{8}
$$

So:

$$
\boxed{\bar{x}_2^* = \frac{5}{8}}
$$

---

### 4.6 Normalised test vector

$$
\bar{x}^*
=
\begin{bmatrix}
5/7 \\
5/8
\end{bmatrix}
$$

---

### 4.7 Prediction

Substitute the normalised vector into the model:

$$
y(\bar{x}^*)
=
500 \times \frac{5}{7}
+
300 \times \frac{5}{8}
$$

$$
=
\frac{2500}{7}
+
\frac{1500}{8}
$$

$$
=
\frac{2500}{7}
+
\frac{375}{2}
$$

Common denominator $14$:

$$
\frac{2500}{7}
=
\frac{5000}{14}
$$

$$
\frac{375}{2}
=
\frac{2625}{14}
$$

$$
y(\bar{x}^*)
=
\frac{5000}{14}
+
\frac{2625}{14}
$$

$$
=
\frac{7625}{14}
$$

$$
\approx 544.64
$$

Rounded as in the sheet:

$$
\boxed{y \approx 545}
$$

---

### 4.8 Exam flags

No explicit exam flag appears in the available PDF.

**Revision caution, not an explicit exam flag:** The central step is to normalise the test vector using the training-set min/max values before applying the learned model.

---

## 5. Outlier detection using the $3\sigma$ rule

### 5.1 Key concept

A simple criterion for removing outliers is based on the mean and standard deviation of the variable of interest.

Values outside the interval

$$
(\mu - 3\sigma, \mu + 3\sigma)
$$

are considered outliers.

### 5.2 Formal rule

A value $x$ is treated as an outlier if:

$$
x < \mu - 3\sigma
$$

or

$$
x > \mu + 3\sigma
$$

For the score dataset from Exercise 2:

$$
\mu = 60.95
$$

$$
\sigma = 17.2519
$$

The sheet rounds $\sigma$ to $17.25$ in the calculation.

---

### 5.3 Worked example

$$
(\mu - 3\sigma, \mu + 3\sigma)
=
(60.95 - 3 \times 17.25,\; 60.95 + 3 \times 17.25)
$$

$$
=
(60.95 - 51.75,\; 60.95 + 51.75)
$$

$$
=
(9.19,\; 112.70)
$$

The score values all lie within this interval.

Therefore:

$$
\boxed{\text{There are no outliers in the Score feature using this rule.}}
$$

---

## 6. Equal-width binning

### 6.1 Problem setup

The dataset contains IQ values for 20 people who applied to take part in a television general-knowledge quiz.

| ID | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| IQ | 92 | 107 | 83 | 101 | 107 | 92 | 99 | 119 | 93 | 106 | 105 | 88 | 106 | 90 | 97 | 118 | 120 | 72 | 100 | 102 |

The task is to generate an equal-width binning using 5 bins.

---

### 6.2 Key concept

**Intuition:** Equal-width binning divides the numerical range of a feature into bins of the same width.

#### Step 1: Find minimum and maximum

$$
\min = 72
$$

$$
\max = 120
$$

#### Step 2: Compute total range

$$
120 - 72 = 48
$$

#### Step 3: Divide by number of bins

Number of bins:

$$
5
$$

Bin width:

$$
\frac{48}{5} = 9.6
$$

So each bin has width:

$$
\boxed{9.6}
$$

---

### 6.3 Bins given in the sheet

The sheet gives the five bin intervals as:

| Bin number | Range of bin | ID instances in bin |
|---:|---|---|
| 1 | $[72, 81.6)$ | 18 |
| 2 | $[81.6, 91.2)$ | 3, 12, 14, 15 |
| 3 | $[91.2, 100.8)$ | 1, 6, 7, 9, 19 |
| 4 | $[100.8, 110.4)$ | 2, 4, 5, 10, 11, 13, 20 |
| 5 | $[110.4, 120]$ | 8, 16, 17 |

---

### 6.4 Unclear / likely source error

**[UNCLEAR / LIKELY SOURCE ERROR]** The table in the PDF places **ID 15** in bin 2. But the IQ table gives:

$$
\text{ID 15 IQ} = 97
$$

Since:

$$
97 \in [91.2, 100.8)
$$

ID 15 belongs in **bin 3**, not bin 2.

A corrected bin assignment based strictly on the IQ values shown would be:

| Bin number | Range of bin | ID instances in bin |
|---:|---|---|
| 1 | $[72, 81.6)$ | 18 |
| 2 | $[81.6, 91.2)$ | 3, 12, 14 |
| 3 | $[91.2, 100.8)$ | 1, 6, 7, 9, 15, 19 |
| 4 | $[100.8, 110.4)$ | 2, 4, 5, 10, 11, 13, 20 |
| 5 | $[110.4, 120]$ | 8, 16, 17 |

---

## 7. Correlation, covariance, and socioeconomic data

### 7.1 Problem setup

The sheet shows socioeconomic data for a selection of countries in 2009.

The features are:

- `COUNTRY`: country name.
- `LIFEEXPECTANCY`: average life expectancy in years.
- `INFANTMORTALITY`: infant mortality rate per 1,000 live births.
- `EDUCATION`: spending per primary student as a percentage of GDP.
- `HEALTH`: health spending as a percentage of GDP.
- `HEALTHUSD`: health spending per person converted into US dollars.

The visible table on page 5 lists countries including Argentina, Cameroon, Chile, Colombia, Cuba, Ghana, Guyana, Latvia, Malaysia, Mali, Mongolia, Morocco, Senegal, Serbia, and Thailand.

---

### 7.2 Key concept: sample correlation

#### Intuition

Correlation measures how two variables vary together after normalising by their standard deviations.

In this exercise:

- A large negative correlation means one variable tends to decrease as the other increases.
- A positive correlation means the variables tend to increase together.

#### Formal definition

The sheet defines the sample correlation between two variables $X$ and $Y$ as:

$$
\operatorname{corr}(X,Y)
=
\frac{\operatorname{cov}(X,Y)}
{\operatorname{std}(X)\operatorname{std}(Y)}
$$

**[UNCLEAR]** The parsed formula shows a comma between $\operatorname{std}(X)$ and $\operatorname{std}(Y)$, but the code and standard formula use multiplication in the denominator.

---

### 7.3 Sample covariance

#### Formal definition

$$
\operatorname{cov}(X,Y)
=
\frac{1}{N}
\sum_{n=1}^{N}
(x_n - \bar{x})(y_n - \bar{y})
$$

where:

- $N$ is the number of observations.
- $x_n$ is the $n$-th value of $X$.
- $y_n$ is the $n$-th value of $Y$.
- $\bar{x}$ is the sample mean of $X$.
- $\bar{y}$ is the sample mean of $Y$.

---

### 7.4 Standard deviation

#### Formal definition

$$
\operatorname{std}(X)
=
\sqrt{
\frac{1}{N}
\sum_{n=1}^{N}
(x_n - \bar{x})^2
}
$$

The sample mean is:

$$
\bar{x}
=
\frac{1}{N}
\sum_{n=1}^{N}
x_n
$$

---

### 7.5 Required correlations

The exercise asks for:

$$
\operatorname{corr}(\text{LIFEEXPECTANCY}, \text{INFANTMORTALITY})
$$

and

$$
\operatorname{corr}(\text{LIFEEXPECTANCY}, \text{EDUCATION})
$$

---

### 7.6 Algorithm used in the sheet

The sheet uses Python/NumPy arrays for:

- `life_expectancy`
- `infant_mortality`
- `education`

Then it defines:

```python
def compute_std(x):
    mean_x = np.sum(x) / np.size(x, 0)
    std_x = np.sqrt(np.sum((x - mean_x) ** 2) / np.size(x, 0))
    return std_x
```

and:

```python
def compute_cov(x, y):
    mean_x = np.sum(x) / np.size(x, 0)
    mean_y = np.sum(y) / np.size(y, 0)
    cov_xy = np.sum((x - mean_x) * (y - mean_y)) / np.size(x, 0)
    return cov_xy
```

Then:

$$
\operatorname{corr}(\text{life}, \text{infant})
=
\frac{
\operatorname{cov}(\text{life}, \text{infant})
}{
\operatorname{std}(\text{life})\operatorname{std}(\text{infant})
}
$$

and:

$$
\operatorname{corr}(\text{life}, \text{education})
=
\frac{
\operatorname{cov}(\text{life}, \text{education})
}{
\operatorname{std}(\text{life})\operatorname{std}(\text{education})
}
$$

---

### 7.7 Results

The sheet reports:

$$
\boxed{
\operatorname{corr}(\text{LIFEEXPECTANCY}, \text{INFANTMORTALITY})
=
-0.96
}
$$

$$
\boxed{
\operatorname{corr}(\text{LIFEEXPECTANCY}, \text{EDUCATION})
=
0.47
}
$$

Interpretation directly from the values:

- Life expectancy and infant mortality have a strong negative correlation in this dataset.
- Life expectancy and education spending have a positive correlation in this dataset.

---

## 8. Independence vs uncorrelated random variables

### 8.1 Problem setup

Two random variables $X$ and $Y$ have the joint probability mass function:

$$
P(X = x_i, Y = y_j)
=
\begin{cases}
\frac{1}{3}, & \text{for } (x_1 = 0, y_1 = 1), (x_2 = 1, y_2 = 0), (x_3 = 2, y_1 = 1), \\
0, & \text{otherwise.}
\end{cases}
$$

Equivalently, the nonzero probabilities are:

$$
P(X=0, Y=1) = \frac{1}{3}
$$

$$
P(X=1, Y=0) = \frac{1}{3}
$$

$$
P(X=2, Y=1) = \frac{1}{3}
$$

The exercise asks:

1. Are $X$ and $Y$ independent?
2. Are $X$ and $Y$ uncorrelated?

---

### 8.2 Key concept: independence

#### Intuition

Two random variables are independent if knowing the value of one gives no change to the probability distribution of the other.

#### Formal definition used

If $X$ and $Y$ are independent, then the joint distribution factorises:

$$
P(X=x, Y=y)
=
P(X=x)P(Y=y)
$$

So to test independence, check whether:

$$
P(X=x,Y=y)
=
P(X=x)P(Y=y)
$$

for the relevant values.

---

### 8.3 Marginal distribution of $X$

$$
P(X=0)
=
P(X=0,Y=1)
=
\frac{1}{3}
$$

$$
P(X=1)
=
P(X=1,Y=0)
=
\frac{1}{3}
$$

$$
P(X=2)
=
P(X=2,Y=1)
=
\frac{1}{3}
$$

So:

$$
\boxed{
P(X=0)=P(X=1)=P(X=2)=\frac{1}{3}
}
$$

---

### 8.4 Marginal distribution of $Y$

$$
P(Y=0)
=
P(X=1,Y=0)
=
\frac{1}{3}
$$

$$
P(Y=1)
=
P(X=0,Y=1)
+
P(X=2,Y=1)
$$

$$
=
\frac{1}{3}
+
\frac{1}{3}
$$

$$
=
\frac{2}{3}
$$

So:

$$
\boxed{
P(Y=0)=\frac{1}{3}, \qquad P(Y=1)=\frac{2}{3}
}
$$

---

### 8.5 Independence check

Use the pair:

$$
X = 0, \qquad Y = 1
$$

The joint probability is:

$$
P(X=0,Y=1)=\frac{1}{3}
$$

The product of marginals is:

$$
P(X=0)P(Y=1)
=
\frac{1}{3}
\times
\frac{2}{3}
=
\frac{2}{9}
$$

Since:

$$
\frac{1}{3}
\neq
\frac{2}{9}
$$

we have:

$$
P(X=0,Y=1)
\neq
P(X=0)P(Y=1)
$$

Therefore:

$$
\boxed{X \text{ and } Y \text{ are not independent.}}
$$

---

### 8.6 Key concept: uncorrelated random variables

#### Intuition

Two random variables are uncorrelated when their covariance is zero.

#### Formal definition

The sheet defines $X$ and $Y$ as uncorrelated if:

$$
\sigma_{X,Y} = 0
$$

where:

$$
\sigma_{X,Y}
=
E\{XY\}
-
E\{X\}E\{Y\}
$$

So the task is to check whether:

$$
E\{XY\}
-
E\{X\}E\{Y\}
=
0
$$

---

### 8.7 Compute $E\{X\}$

$$
E\{X\}
=
\sum_{x_i}
x_iP(X=x_i)
$$

$$
=
0 \times P(X=0)
+
1 \times P(X=1)
+
2 \times P(X=2)
$$

$$
=
0 \times \frac{1}{3}
+
1 \times \frac{1}{3}
+
2 \times \frac{1}{3}
$$

$$
=
0
+
\frac{1}{3}
+
\frac{2}{3}
$$

$$
=
1
$$

So:

$$
\boxed{E\{X\}=1}
$$

---

### 8.8 Compute $E\{Y\}$

$$
E\{Y\}
=
\sum_{y_j}
y_jP(Y=y_j)
$$

$$
=
0 \times P(Y=0)
+
1 \times P(Y=1)
$$

$$
=
0 \times \frac{1}{3}
+
1 \times \frac{2}{3}
$$

$$
=
\frac{2}{3}
$$

So:

$$
\boxed{E\{Y\}=\frac{2}{3}}
$$

---

### 8.9 Compute $E\{XY\}$

$$
E\{XY\}
=
\sum_{y_j}
\sum_{x_i}
x_iy_jP(X=x_i,Y=y_j)
$$

Use the nonzero joint probabilities:

$$
E\{XY\}
=
0 \times 1 \times P(X=0,Y=1)
+
1 \times 0 \times P(X=1,Y=0)
+
2 \times 1 \times P(X=2,Y=1)
$$

$$
=
0 \times 1 \times \frac{1}{3}
+
1 \times 0 \times \frac{1}{3}
+
2 \times 1 \times \frac{1}{3}
$$

$$
=
0
+
0
+
\frac{2}{3}
$$

$$
=
\frac{2}{3}
$$

So:

$$
\boxed{E\{XY\}=\frac{2}{3}}
$$

---

### 8.10 Compute covariance

$$
\sigma_{X,Y}
=
E\{XY\}
-
E\{X\}E\{Y\}
$$

$$
=
\frac{2}{3}
-
1 \times \frac{2}{3}
$$

$$
=
\frac{2}{3}
-
\frac{2}{3}
$$

$$
=
0
$$

Therefore:

$$
\boxed{X \text{ and } Y \text{ are uncorrelated.}}
$$

---

### 8.11 Important conceptual conclusion

This example shows:

$$
\boxed{
\text{Uncorrelated does not necessarily imply independent.}
}
$$

Here:

$$
X \text{ and } Y \text{ are not independent}
$$

but:

$$
X \text{ and } Y \text{ are uncorrelated.}
$$

---

## 9. Independent random variables are uncorrelated

### 9.1 Statement to prove

Two random variables $X$ and $Y$ are uncorrelated if:

$$
\sigma_{X,Y}=0
$$

Since:

$$
\sigma_{X,Y}
=
E\{XY\}
-
E\{X\}E\{Y\}
$$

then $X$ and $Y$ are uncorrelated if:

$$
E\{XY\}
=
E\{X\}E\{Y\}
$$

The exercise asks to show that if $X$ and $Y$ are independent, then they are also uncorrelated.

---

### 9.2 Discrete case

#### Given definition

For discrete random variables:

$$
E\{XY\}
=
\sum_{\forall x_i}
\sum_{\forall y_j}
x_iy_jP(x_i,y_j)
$$

If $X$ and $Y$ are independent, then:

$$
P(x_i,y_j)
=
P(x_i)P(y_j)
$$

#### Derivation

Start with:

$$
E\{XY\}
=
\sum_{y_j}
\sum_{x_i}
x_iy_jP(x_i,y_j)
$$

Use independence:

$$
=
\sum_{y_j}
\sum_{x_i}
x_iy_jP(x_i)P(y_j)
$$

Separate the terms involving $x_i$ and $y_j$:

$$
=
\left[
\sum_{x_i}
x_iP(x_i)
\right]
\left[
\sum_{y_j}
y_jP(y_j)
\right]
$$

Recognise each bracket as an expectation:

$$
=
E\{X\}E\{Y\}
$$

Therefore:

$$
E\{XY\}
=
E\{X\}E\{Y\}
$$

So:

$$
\sigma_{X,Y}
=
E\{XY\}
-
E\{X\}E\{Y\}
=
0
$$

Thus, in the discrete case:

$$
\boxed{
X \text{ and } Y \text{ independent}
\Rightarrow
X \text{ and } Y \text{ uncorrelated.}
}
$$

---

### 9.3 Continuous case

If $X$ and $Y$ are continuous and independent, then their joint density factorises:

$$
p(x,y)
=
p(x)p(y)
$$

Start with:

$$
E\{XY\}
=
\int_{-\infty}^{\infty}
\int_{-\infty}^{\infty}
xy\,p(x,y)\,dx\,dy
$$

Use independence:

$$
=
\int_{-\infty}^{\infty}
\int_{-\infty}^{\infty}
xy\,p(x)p(y)\,dx\,dy
$$

Factor the integral:

$$
=
\left(
\int_{-\infty}^{\infty}
x p(x)\,dx
\right)
\left(
\int_{-\infty}^{\infty}
y p(y)\,dy
\right)
$$

Recognise each term as an expectation:

$$
=
E\{X\}E\{Y\}
$$

Therefore:

$$
E\{XY\}
=
E\{X\}E\{Y\}
$$

and so:

$$
\sigma_{X,Y}=0
$$

Thus, in the continuous case:

$$
\boxed{
X \text{ and } Y \text{ independent}
\Rightarrow
X \text{ and } Y \text{ uncorrelated.}
}
$$

---

### 9.4 Connection to previous exercise

Exercise 7 shows:

$$
\text{uncorrelated} \not\Rightarrow \text{independent}
$$

Exercise 8 shows:

$$
\text{independent} \Rightarrow \text{uncorrelated}
$$

Together:

$$
\boxed{
\text{Independence is stronger than uncorrelatedness.}
}
$$

---

## 10. Covariance and correlation for $Y = aX + b$

### 10.1 Problem setup

Let:

$$
Y = aX + b
$$

where:

- $X$ and $Y$ are random variables.
- $a$ and $b$ are constants.

The exercise asks:

1. Find the covariance of $X$ and $Y$.
2. Find the correlation coefficient of $X$ and $Y$.

---

### 10.2 Covariance of $X$ and $Y$

#### Formal definition

$$
\operatorname{cov}(X,Y)
=
E[(X-E[X])(Y-E[Y])]
$$

Assume:

$$
\operatorname{Var}(X) = \sigma_X^2
$$

$$
\operatorname{Var}(Y) = \sigma_Y^2
$$

---

### 10.3 Derivation of covariance

Start with:

$$
\operatorname{cov}(X,Y)
=
E[(X-E[X])(Y-E[Y])]
$$

Substitute:

$$
Y = aX + b
$$

$$
=
E[(X-E[X])(aX+b-E[aX+b])]
$$

Use linearity of expectation:

$$
E[aX+b]
=
aE[X]+b
$$

So:

$$
=
E[(X-E[X])(aX+b-(aE[X]+b))]
$$

Cancel $b$:

$$
=
E[(X-E[X])(aX-aE[X])]
$$

Factor out $a$:

$$
=
aE[(X-E[X])(X-E[X])]
$$

$$
=
aE[(X-E[X])^2]
$$

Recognise variance:

$$
E[(X-E[X])^2]
=
\sigma_X^2
$$

Therefore:

$$
\boxed{
\operatorname{cov}(X,Y)
=
a\sigma_X^2
}
$$

---

### 10.4 Key intuition

The constant $b$ disappears from the covariance because adding a constant shifts $Y$ but does not change how $Y$ varies with $X$.

The coefficient $a$ remains because it scales the variation.

---

### 10.5 Correlation coefficient

#### Formal definition

$$
\rho_{XY}
=
\frac{\operatorname{cov}(X,Y)}
{\sigma_X\sigma_Y}
$$

Using the covariance result:

$$
\rho_{XY}
=
\frac{a\sigma_X^2}
{\sigma_X\sigma_Y}
$$

To finish, compute $\sigma_Y$.

---

### 10.6 Variance of $Y$

Start with:

$$
\sigma_Y^2
=
E[Y^2]
-
(E[Y])^2
$$

Substitute:

$$
Y = aX+b
$$

$$
=
E[(aX+b)^2]
-
(aE[X]+b)^2
$$

Expand the square:

$$
(aX+b)^2
=
a^2X^2 + 2abX + b^2
$$

So:

$$
=
E[a^2X^2 + 2abX + b^2]
-
(a^2E[X]^2 + 2abE[X] + b^2)
$$

Apply expectation:

$$
=
a^2E[X^2]
+
2abE[X]
+
b^2
-
a^2E[X]^2
-
2abE[X]
-
b^2
$$

Cancel terms:

$$
=
a^2E[X^2]
-
a^2E[X]^2
$$

Factor:

$$
=
a^2(E[X^2]-E[X]^2)
$$

Recognise variance of $X$:

$$
E[X^2]-E[X]^2
=
\sigma_X^2
$$

Therefore:

$$
\sigma_Y^2
=
a^2\sigma_X^2
$$

So:

$$
\sigma_Y
=
\sqrt{a^2\sigma_X^2}
$$

$$
=
|a|\sigma_X
$$

---

### 10.7 Correlation coefficient derivation

Return to:

$$
\rho_{XY}
=
\frac{a\sigma_X^2}
{\sigma_X\sigma_Y}
$$

Substitute:

$$
\sigma_Y = |a|\sigma_X
$$

$$
\rho_{XY}
=
\frac{a\sigma_X^2}
{\sigma_X |a| \sigma_X}
$$

$$
=
\frac{a\sigma_X^2}
{|a|\sigma_X^2}
$$

$$
=
\frac{a}{|a|}
$$

Therefore:

$$
\boxed{
\rho_{XY}
=
\begin{cases}
1, & a > 0, \\
-1, & a < 0.
\end{cases}
}
$$

---

### 10.8 Interpretation

If $a>0$, then $Y$ is an increasing linear function of $X$, so the correlation is:

$$
\rho_{XY}=1
$$

If $a<0$, then $Y$ is a decreasing linear function of $X$, so the correlation is:

$$
\rho_{XY}=-1
$$

The constant $b$ does not affect the correlation result.

---

### 10.9 Unclear / omitted edge case

**[UNCLEAR / OMITTED CASE]** The sheet gives the answer only for $a>0$ and $a<0$. It does not discuss $a=0$. When $a=0$, $Y=b$ is constant, so $\sigma_Y=0$, and the correlation coefficient formula divides by zero.

---

## 11. Exam flags

The available PDF does **not** contain explicit statements such as:

- “This will be on the exam.”
- “You should know this.”
- “This is important.”
- “Common mistake.”

So there are no true exam flags to mark from the available source.

The sheet does use difficulty labels:

- Exercises 1–6 are `(*)`.
- Exercises 7–8 are `(**)`.
- Exercise 9 is `(***)`.

That indicates relative complexity in the exercise sheet, not an explicit exam warning.

---

## 12. Connections across the material

### 12.1 Lecture 2 connection

Exercise 1 explicitly connects TP, TN, FP, and FN to **Lecture 2**.

### 12.2 Normalisation connection

Exercise 3 explicitly says the normalisation formula is based on the lecture.

### 12.3 ML workflow connection

Exercises 1–5 form an ML workflow block:

1. Evaluate a trained classifier.
2. Scale data.
3. Apply the same scaling at test time.
4. Detect outliers.
5. Discretise/bin a feature.

### 12.4 Probability/statistics connection

Exercises 6–9 form a probability/statistics block:

1. Correlation from covariance and standard deviation.
2. Independence vs uncorrelatedness.
3. Proof that independence implies uncorrelatedness.
4. Linear transformations and perfect correlation.

### 12.5 Conceptual bridge

The sheet moves from practical ML preprocessing into statistical dependence:

$$
\text{data preprocessing}
\rightarrow
\text{correlation/covariance}
\rightarrow
\text{independence and random variables}
$$

---

## 13. Unclear sections to revisit

### 13.1 Missing sources

**[MISSING TRANSCRIPT/SLIDES]** No lecture transcript was included in the chat, and the uploaded PDF appears to be an exercise sheet with solutions rather than lecture slides. Any lecturer-specific phrasing, emphasis, exam hints, or spoken derivations are therefore unavailable.

### 13.2 Standard deviation convention in Exercise 2

**[UNCLEAR]** The standardisation exercise uses:

$$
\sigma = 17.2519
$$

for the score data. That value corresponds to the sample standard deviation using $N-1$, but the exercise does not explicitly state the denominator.

### 13.3 Correlation denominator formatting

**[UNCLEAR]** The printed/parsed formula for correlation shows the denominator as something like:

$$
\operatorname{std}(X),\operatorname{std}(Y)
$$

but the code uses multiplication:

$$
\operatorname{std}(X)\operatorname{std}(Y)
$$

### 13.4 Infant mortality formatting

**[UNCLEAR]** The feature description says infant mortality is per `1;000` live births. This is almost certainly a formatting/OCR issue for `1,000`, but the source text is garbled.

### 13.5 Equal-width binning ID 15

**[UNCLEAR / LIKELY SOURCE ERROR]** The PDF’s binning table places ID 15 in bin 2, but the IQ table gives ID 15 as 97, which falls in bin 3.

### 13.6 Random-variable summation notation

**[UNCLEAR]** In Exercise 7, some summation notation appears garbled, such as summing over $x_1$ where the intended notation is likely summing over $x_i$. The mathematical steps are still recoverable from the displayed probabilities.

### 13.7 Linear-correlation edge case

**[UNCLEAR / OMITTED CASE]** Exercise 9 does not handle $a=0$. The stated result covers only $a>0$ and $a<0$.
