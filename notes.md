---
layout: page
title: 暮色留声机
permalink: /notes/
---

<div class="notes-page">
  <p class="books-intro">这里收录了我的读书笔记，包括小说、技术书籍和学术论文的阅读心得。</p>
  
  <div class="book-categories">
    <h2>分类浏览</h2>
    {% assign book_categories = site.notes | map: "category" | compact | uniq | sort %}
    <div class="category-buttons">
      {% for category in book_categories %}
        {% if category %}
          <a href="#{{ category | slugify }}" class="category-button">{{ category }}</a>
        {% endif %}
      {% endfor %}
    </div>
  </div>
  
  {% assign sorted_books = site.notes | sort: "date" | reverse %}
  
  {% for category in book_categories %}
    {% if category %}
      <div class="book-category" id="{{ category | slugify }}">
        <h2 class="category-name">{{ category }}</h2>
        <div class="book-list">
          {% for book in sorted_books %}
            {% if book.category == category %}
              <div class="book-item">
                <h3 class="book-title">
                  <a href="{{ book.url | relative_url }}">{{ book.title }}</a>
                </h3>
                <div class="book-meta">
                  <span class="book-date">{{ book.date | date: "%Y-%m-%d" }}</span>
                  {% if book.author %}
                    <span class="book-author">作者: {{ book.author }}</span>
                  {% endif %}
                  {% if book.rating %}
                    <span class="book-rating">
                      评分: 
                      {% assign rating_value = book.rating | strip %}
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
                {% if book.tags %}
                  <div class="book-tags">
                    {% assign tags = book.tags %}
                    {% for tag in tags %}
                      {% if tag %}
                        <span class="book-tag">{{ tag }}</span>
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
  
  .book-categories {
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
  
  .book-category {
    margin-bottom: 40px;
  }
  
  .category-name {
    border-bottom: 2px solid #eaecef;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  
  .book-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
  
  .book-item {
    padding: 15px;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .book-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  
  .book-title {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.2em;
  }
  
  .book-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 10px;
    font-size: 0.9em;
    color: #586069;
  }
  
  .book-tags {
    margin-top: 10px;
  }
  
  .book-tag {
    display: inline-block;
    padding: 2px 8px;
    font-size: 0.8em;
    background-color: #f1f8ff;
    color: #0366d6;
    border-radius: 3px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
  
  .book-rating {
    color: #f8b400;
  }
</style>