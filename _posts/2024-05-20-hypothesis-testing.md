---
layout: post
title:  "统计假设检验入门：Fisher、Neyman-Pearson与贝叶斯方法"
date:   2024-05-20 10:00:00 +0800
categories: 统计学
tags: 假设检验 频率学派 贝叶斯
mathjax: true
---

## 三大假设检验方法

### 1. Fisher显著性检验

零假设下的p值计算：

$$
p = P(T(X) \geq T(x_{obs}) | H_0)
$$

### 2. Neyman-Pearson引理

最优检验的似然比：

$$
\Lambda(x) = \frac{L(\theta_1|x)}{L(\theta_0|x)} \geq k
$$

### 3. 贝叶斯假设检验

后验几率公式：

$$
\frac{P(H_1|x)}{P(H_0|x)} = \frac{P(x|H_1)}{P(x|H_0)} \times \frac{P(H_1)}{P(H_0)}
$$

## 方法比较

| 方法        | 哲学基础       | 决策依据          |
|-----------|------------|---------------|
| Fisher    | 证伪主义      | p值            |
| NP引理     | 频率学派      | 错误率控制         |
| 贝叶斯      | 主观概率      | 后验几率          |
