---
subject: COMP60272
chapter: 2
title: সিকিউর মাল্টি-পার্টি কম্পিউটেশন
language: bn
---

সিকিউর মাল্টি-পার্টি কম্পিউটেশন (SMPC) এমন একটি পদ্ধতি যেখানে কয়েকটি পক্ষ নিজেদের ব্যক্তিগত ইনপুট প্রকাশ না করেই যৌথভাবে একটি ফলাফল গণনা করতে পারে। AI privacy প্রসঙ্গে এটি কাজে লাগে যখন হাসপাতাল, ব্যাংক, বা গবেষণা দল নিজেদের স্থানীয় ডেটা গোপন রেখে একসঙ্গে কোনো মডেল train বা evaluate করতে চায়।

মূল ধারণা হলো কোনো মান সরাসরি দেখার বদলে সেই মানের share নিয়ে কাজ করা। কোনো secret value যদি $x$ হয়, তাহলে প্রতিটি participant এমন একটি share পায় যা একা অর্থহীন, কিন্তু protocol অনুসরণ করে shares মিলিয়ে শুধু নির্ধারিত output পাওয়া যায়।

একটি সরল additive sharing scheme-এ finite field-এর ওপর secret-টি এভাবে লেখা যায়:

$$
x = \sum_{i=1}^{n} s_i \pmod q
$$

এরপর computation shares-এর ওপরই চলে। Addition সস্তা, কারণ প্রতিটি party নিজের share locally যোগ করতে পারে। Multiplication সাধারণত interaction step বা আগে থেকে তৈরি helper value চায়, তাই privacy-preserving machine learning-এর খরচ বুঝতে এই পার্থক্য গুরুত্বপূর্ণ।

```python
def reconstruct(shares, modulus):
    return sum(shares) % modulus

print(reconstruct([12, 7, 31], 37))
```

| Operation | সাধারণ SMPC cost | কেন গুরুত্বপূর্ণ |
| --- | --- | --- |
| Addition | কম | Local share update যথেষ্ট |
| Multiplication | বেশি | Parties-দের সাধারণত interaction দরকার |
| Comparison | অনেক বেশি | সাবধানে না করলে branching information leak করতে পারে |

SMPC computation চলাকালীন data protect করে, কিন্তু এটি সব privacy problem নিজে নিজে সমাধান করে না। Final output থেকেও information reveal হতে পারে, তাই বাস্তব deployment-এ SMPC-এর সঙ্গে careful output design, access control, অথবা differential privacy ব্যবহার করা হয়।
