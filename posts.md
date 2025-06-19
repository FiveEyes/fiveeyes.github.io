---
layout: page
title: 全部文章
permalink: /posts/
---

<div class="posts-page">
  <p class="posts-intro">这里收录了我的所有文章，包括技术分享、思考随笔和其他主题的写作。</p>
  
  <div class="post-categories">
    <h2>分类浏览</h2>
    {% assign post_categories = site.posts | map: "categories" | join: "," | split: "," | compact | uniq | sort %}
    {% assign single_categories = site.posts | map: "category" | compact | uniq | sort %}
    {% assign all_categories = post_categories | concat: single_categories | uniq | sort %}
    
    <div class="category-buttons">
      {% for category in all_categories %}
        {% if category %}
          <a href="#{{ category | slugify }}" class="category-button">{{ category }}</a>
        {% endif %}
      {% endfor %}
      <!-- 检查是否有未分类文章，如果有则显示按钮 -->
      {% assign has_uncategorized = false %}
      {% for post in site.posts %}
        {% assign post_has_category = false %}
        {% if post.categories.size > 0 %}
          {% assign post_has_category = true %}
        {% endif %}
        {% if post.category and post.category != "" %}
          {% assign post_has_category = true %}
        {% endif %}
        {% unless post_has_category %}
          {% assign has_uncategorized = true %}
          {% break %}
        {% endunless %}
      {% endfor %}
      {% if has_uncategorized %}
        <a href="#uncategorized" class="category-button">其他文章</a>
      {% endif %}
    </div>
  </div>
  
  {% assign sorted_posts = site.posts | sort: "date" | reverse %}
  
  {% for category in all_categories %}
    {% if category %}
      <div class="post-category" id="{{ category | slugify }}">
        <h2 class="category-name">{{ category }}</h2>
        <div class="post-list">
          {% for post in sorted_posts %}
            {% assign post_has_category = false %}
            {% if post.categories contains category or post.category == category %}
              {% assign post_has_category = true %}
            {% endif %}
            
            {% if post_has_category %}
              <div class="post-item">
                <h3 class="post-title">
                  <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
                </h3>
                <div class="post-meta">
                  <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
                  {% if post.author %}
                    <span class="post-author">作者: {{ post.author }}</span>
                  {% endif %}
                </div>
                {% if post.excerpt %}
                  <div class="post-excerpt">
                    {{ post.excerpt | strip_html | truncatewords: 30 }}
                  </div>
                {% endif %}
                {% if post.tags %}
                  <div class="post-tags">
                    {% for tag in post.tags %}
                      {% if tag %}
                        <span class="post-tag">{{ tag }}</span>
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
  
  <!-- 显示没有分类的文章 -->
  {% assign uncategorized_posts = "" | split: "," %}
  {% for post in sorted_posts %}
    {% assign has_category = false %}
    {% if post.categories.size > 0 %}
      {% assign has_category = true %}
    {% endif %}
    {% if post.category and post.category != "" %}
      {% assign has_category = true %}
    {% endif %}
    {% unless has_category %}
      {% assign uncategorized_posts = uncategorized_posts | push: post %}
    {% endunless %}
  {% endfor %}
  
  {% if uncategorized_posts.size > 0 %}
    <div class="post-category" id="uncategorized">
      <h2 class="category-name">其他文章</h2>
      <div class="post-list">
        {% for post in uncategorized_posts %}
          <div class="post-item">
            <h3 class="post-title">
              <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            </h3>
            <div class="post-meta">
              <span class="post-date">{{ post.date | date: "%Y-%m-%d" }}</span>
              {% if post.author %}
                <span class="post-author">作者: {{ post.author }}</span>
              {% endif %}
            </div>
            {% if post.excerpt %}
              <div class="post-excerpt">
                {{ post.excerpt | strip_html | truncatewords: 30 }}
              </div>
            {% endif %}
            {% if post.tags %}
              <div class="post-tags">
                {% for tag in post.tags %}
                  {% if tag %}
                    <span class="post-tag">{{ tag }}</span>
                  {% endif %}
                {% endfor %}
              </div>
            {% endif %}
          </div>
        {% endfor %}
      </div>
    </div>
  {% endif %}
</div>

<style>
  .posts-intro {
    margin-bottom: 30px;
    font-size: 1.1em;
    color: #586069;
  }
  
  .post-categories {
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
    padding: 8px 16px;
    background-color: #f1f8ff;
    color: #0366d6;
    border-radius: 20px;
    text-decoration: none;
    transition: background-color 0.2s;
    font-size: 0.9em;
  }
  
  .category-button:hover {
    background-color: #dbeeff;
    text-decoration: none;
  }
  
  .post-category {
    margin-bottom: 40px;
  }
  
  .category-name {
    padding-bottom: 10px;
    margin-bottom: 20px;
    color: #24292e;
  }
  
  .post-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    .post-list {
      grid-template-columns: 1fr;
    }
    
    .post-title {
      font-size: 1.3em;
    }
    
    .post-meta {
      font-size: 0.9em;
    }
  }
  
  .post-item {
    padding: 20px;
    border: 1px solid #e1e4e8;
    border-radius: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
    background-color: #fff;
  }
  
  .post-item:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  }
  
  .post-title {
    margin-top: 0;
    margin-bottom: 12px;
    font-size: 1.25em;
    line-height: 1.3;
  }
  
  .post-title a {
    color: #24292e;
    text-decoration: none;
    font-weight: 600;
  }
  
  .post-title a:hover {
    color: #0366d6;
  }
  
  .post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 12px;
    font-size: 0.85em;
    color: #586069;
  }
  
  .post-excerpt {
    margin-bottom: 15px;
    color: #586069;
    line-height: 1.5;
  }
  
  .post-tags {
    margin-top: 15px;
  }
  
  .post-tag {
    display: inline-block;
    padding: 3px 10px;
    font-size: 0.75em;
    background-color: #f1f8ff;
    color: #0366d6;
    border-radius: 12px;
    margin-right: 6px;
    margin-bottom: 6px;
    text-decoration: none;
  }
</style>