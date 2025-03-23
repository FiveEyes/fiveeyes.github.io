---
layout: page
title: 标签
permalink: /tags/
---

<div class="tags-page">
  {% assign sorted_tags = site.tags | sort %}
  {% for tag in sorted_tags %}
    <div class="tag-group" id="{{ tag[0] | slugify }}">
      <h3 class="tag-name">{{ tag[0] }}</h3>
      <ul class="post-list">
        {% for post in tag[1] %}
          <li>
            <span class="post-meta">{{ post.date | date: "%Y-%m-%d" }}</span>
            <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title }}</a>
          </li>
        {% endfor %}
      </ul>
    </div>
  {% endfor %}
</div>