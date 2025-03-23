---
layout: page
title: 分类
permalink: /categories/
---

<div class="categories-page">
  {% assign all_categories = '' | split: '' %}
  {% assign all_items = '' | split: '' %}
  
  {% for post in site.posts %}
    {% assign all_items = all_items | push: post %}
    {% if post.categories.size > 0 %}
      {% assign all_categories = all_categories | concat: post.categories %}
    {% endif %}
  {% endfor %}
  
  {% for note in site.notes %}
    {% assign all_items = all_items | push: note %}
    {% if note.categories.size > 0 %}
      {% assign all_categories = all_categories | concat: note.categories %}
    {% endif %}
  {% endfor %}
  
  {% for story in site.stories %}
    {% assign all_items = all_items | push: story %}
    {% if story.categories.size > 0 %}
      {% assign all_categories = all_categories | concat: story.categories %}
    {% endif %}
  {% endfor %}
  
  {% for moment in site.moments %}
    {% assign all_items = all_items | push: moment %}
    {% if moment.categories.size > 0 %}
      {% assign all_categories = all_categories | concat: moment.categories %}
    {% endif %}
  {% endfor %}
  
  {% assign sorted_categories = all_categories | uniq | sort %}
  
  <div class="category-cloud">
    {% for category in sorted_categories %}
      {% assign category_count = 0 %}
      {% for item in all_items %}
        {% if item.categories contains category %}
          {% assign category_count = category_count | plus: 1 %}
        {% endif %}
      {% endfor %}
      <a href="#{{ category | slugify }}" class="category-cloud-item" data-count="{{ category_count }}">{{ category }} <span class="category-count">({{ category_count }})</span></a>
    {% endfor %}
  </div>

  {% for category in sorted_categories %}
    <div class="category-group" id="{{ category | slugify }}">
      <h3 class="category-name">{{ category }} <span class="category-count">{{ category_count }}</span></h3>
      <ul class="post-list">
        {% for item in all_items %}
          {% if item.categories contains category %}
            <li>
              <span class="post-meta">{{ item.date | date: "%Y-%m-%d" }}</span>
              <a class="post-link" href="{{ item.url | relative_url }}">{{ item.title }}</a>
              <span class="post-collection">{{ item.collection | capitalize }}</span>
            </li>
          {% endif %}
        {% endfor %}
      </ul>
    </div>
  {% endfor %}

  {% assign uncategorized_items = all_items | where_exp: "item", "item.categories.size == 0" %}
  {% if uncategorized_items.size > 0 %}
  <div class="category-group uncategorized" id="uncategorized">
    <h3 class="category-name">未分类</h3>
    <ul class="post-list">
      {% for item in uncategorized_items %}
        <li>
          <span class="post-meta">{{ item.date | date: "%Y-%m-%d" }}</span>
          <a class="post-link" href="{{ item.url | relative_url }}">{{ item.title }}</a>
          <span class="post-collection">{{ item.collection | capitalize }}</span>
        </li>
      {% endfor %}
    </ul>
  </div>
  {% endif %}
</div>

<style>
  .category-cloud {
    margin-bottom: 40px;
    text-align: center;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }

  .category-cloud-item {
    display: inline-block;
    margin: 5px;
    padding: 5px 10px;
    background-color: #e9f5ff;
    color: #0366d6;
    border-radius: 20px;
    text-decoration: none;
    font-size: 0.9em;
    transition: all 0.2s ease;
  }

  .category-cloud-item:hover {
    background-color: #0366d6;
    color: white;
  }

  .category-count {
    font-size: 0.8em;
    color: #666;
  }

  .category-group {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
  }

  .category-name {
    padding-bottom: 10px;
    border-bottom: 2px solid #0366d6;
    display: inline-block;
  }

  .category-group.uncategorized {
    background-color: #fff3e0;
    border-radius: 8px;
    padding: 15px;
  }
</style>