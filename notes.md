---
layout: note
title: 暮色留声机
permalink: /notes/
---

<div class="notes-page">
  <p class="notes-intro">这里收录了我的读书笔记，包括小说、技术书籍和学术论文的阅读心得。</p>
  
  <div class="note-categories">
    <h2>分类浏览</h2>
    {% assign note_categories = site.notes | map: "category" | compact | uniq | sort %}
    <div class="category-buttons">
      {% for category in note_categories %}
        {% if category %}
          <a href="#{{ category | slugify }}" class="category-button">{{ category }}</a>
        {% endif %}
      {% endfor %}
    </div>
  </div>
  
  {% assign sorted_notes = site.notes | sort: "date" | reverse %}
  
  {% for category in note_categories %}
    {% if category %}
      <div class="note-category" id="{{ category | slugify }}">
        <h2 class="category-name">{{ category }}</h2>
        <div class="note-list">
          {% for note in sorted_notes %}
            {% if note.category == category %}
              <div class="note-item">
                <h3 class="note-title">
                  <a href="{{ note.url | relative_url }}">{{ note.title }}</a>
                </h3>
                <div class="note-meta">
                  <span class="note-date">{{ note.date | date: "%Y-%m-%d" }}</span>
                  {% if note.author %}
                    <span class="note-author">作者: {{ note.author }}</span>
                  {% endif %}
                  {% if note.rating %}
                    <span class="note-rating">
                      评分: 
                      {% assign rating_value = note.rating | strip %}
                      {% assign rating_parts = rating_value | split: "/" | first | split: "." %}
                      {% assign rating_int = rating_parts[0] | to_integer %}
                      {% for i in (1..rating_int) %}
                        ⭐
                      {% endfor %}
                      {% if rating_parts[1] and rating_parts[1] != "0" %}
                        ⭐️
                      {% endif %}
                      ({{ rating_value }})
                    </span>
                  {% endif %}
                </div>
                {% if note.tags %}
                  <div class="note-tags">
                    {% assign tags = note.tags %}
                    {% for tag in tags %}
                      {% if tag %}
                        <span class="note-tag">{{ tag }}</span>
                      {% endif %}
                    {% endfor %}
                  </div>
                {% endif %}
              </div>
            {% endif %}
          {% endfor %}
        </div>
      </div>
    {% endif %}
  {% endfor %}
</div>

<style>
  .notes-intro {
    margin-bottom: 30px;
    font-size: 1.1em;
  }
  
  .note-categories {
    margin-bottom: 40px;
  }
  
  .category-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 15px;
  }
  
  .category-button {
    display: inline-block;
    padding: 5px 15px;
    background-color: #f1f8ff;
    color: #0366d6;
    border-radius: 20px;
    text-decoration: none;
    transition: background-color 0.2s;
  }
  
  .category-button:hover {
    background-color: #dbeeff;
    text-decoration: none;
  }
  
  .note-category {
    margin-bottom: 40px;
  }
  
  .category-name {
    border-bottom: 2px solid #eaecef;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  
  .note-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .note-item {
    padding: 15px;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .note-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  
  .note-title {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.2em;
  }
  
  .note-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 10px;
    font-size: 0.9em;
    color: #586069;
  }
  
  .note-tags {
    margin-top: 10px;
  }
  
  .note-tag {
    display: inline-block;
    padding: 2px 8px;
    font-size: 0.8em;
    background-color: #f1f8ff;
    color: #0366d6;
    border-radius: 3px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
  
  .note-rating {
    color: #f8b400;
  }
</style>