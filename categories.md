---
layout: page
title: 分类
permalink: /categories/
---

<div class="categories-page">
  {% assign sorted_categories = site.categories | sort %}
  {% for category in sorted_categories %}
    <div class="category-group" id="{{ category[0] | slugify }}">
      <h3 class="category-name">{{ category[0] }}</h3>
      <ul class="post-list">
        {% for post in category[1] %}
          <li>
            <span class="post-meta">{{ post.date | date: "%Y-%m-%d" }}</span>
            <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </li>
        {% endfor %}
      </ul>
    </div>
  {% endfor %}
</div>