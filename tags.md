---
layout: page
title: 标签
permalink: /tags/
---

<div class="tags-page">
  {% comment %} 收集所有集合的标签 {% endcomment %}
  {% assign all_tags = '' | split: '' %}
  {% assign all_items = '' | split: '' %}
  
  {% comment %} 收集博客文章的标签 {% endcomment %}
  {% for post in site.posts %}
    {% assign all_items = all_items | push: post %}
    {% if post.tags.size > 0 %}
      {% if post.tags.first %}
        {% comment %} 如果标签是数组 {% endcomment %}
        {% for tag in post.tags %}
          {% assign tag_downcase = tag | downcase %}
          {% assign all_tags = all_tags | push: tag_downcase %}
        {% endfor %}
      {% else %}
        {% comment %} 如果标签是空格分隔的字符串 {% endcomment %}
        {% assign post_tags = post.tags | split: ' ' %}
        {% for tag in post_tags %}
          {% assign tag_downcase = tag | downcase %}
          {% assign all_tags = all_tags | push: tag_downcase %}
        {% endfor %}
      {% endif %}
    {% endif %}
  {% endfor %}
  
  {% comment %} 收集笔记的标签 {% endcomment %}
  {% for note in site.notes %}
    {% assign all_items = all_items | push: note %}
    {% if note.tags.size > 0 %}
      {% if note.tags.first %}
        {% for tag in note.tags %}
          {% assign tag_downcase = tag | downcase %}
          {% assign all_tags = all_tags | push: tag_downcase %}
        {% endfor %}
      {% else %}
        {% assign note_tags = note.tags | split: ' ' %}
        {% for tag in note_tags %}
          {% assign tag_downcase = tag | downcase %}
          {% assign all_tags = all_tags | push: tag_downcase %}
        {% endfor %}
      {% endif %}
    {% endif %}
  {% endfor %}
  
  {% comment %} 收集故事的标签 {% endcomment %}
  {% for story in site.stories %}
    {% assign all_items = all_items | push: story %}
    {% if story.tags.size > 0 %}
      {% if story.tags.first %}
        {% for tag in story.tags %}
          {% assign tag_downcase = tag | downcase %}
          {% assign all_tags = all_tags | push: tag_downcase %}
        {% endfor %}
      {% else %}
        {% assign story_tags = story.tags | split: ' ' %}
        {% for tag in story_tags %}
          {% assign tag_downcase = tag | downcase %}
          {% assign all_tags = all_tags | push: tag_downcase %}
        {% endfor %}
      {% endif %}
    {% endif %}
  {% endfor %}
  
  {% comment %} 收集碎碎念的标签 {% endcomment %}
  {% for moment in site.moments %}
    {% assign all_items = all_items | push: moment %}
    {% if moment.tags.size > 0 %}
      {% if moment.tags.first %}
        {% for tag in moment.tags %}
          {% assign tag_downcase = tag | downcase %}
          {% assign all_tags = all_tags | push: tag_downcase %}
        {% endfor %}
      {% else %}
        {% assign moment_tags = moment.tags | split: ' ' %}
        {% for tag in moment_tags %}
          {% assign tag_downcase = tag | downcase %}
          {% assign all_tags = all_tags | push: tag_downcase %}
        {% endfor %}
      {% endif %}
    {% endif %}
  {% endfor %}
  
  {% comment %} 对标签去重并排序 {% endcomment %}
  {% assign unique_tags = all_tags | uniq | sort %}
  
  {% comment %} 显示标签云 {% endcomment %}
  <div class="tag-cloud">
    {% for tag in unique_tags %}
      {% assign tag_count = 0 %}
      {% for item in all_items %}
        {% if item.tags.size > 0 %}
          {% if item.tags.first %}
            {% comment %} 如果标签是数组 {% endcomment %}
            {% for item_tag in item.tags %}
              {% assign item_tag_downcase = item_tag | downcase %}
              {% if item_tag_downcase == tag %}
                {% assign tag_count = tag_count | plus: 1 %}
                {% break %}
              {% endif %}
            {% endfor %}
          {% else %}
            {% comment %} 如果标签是空格分隔的字符串 {% endcomment %}
            {% assign item_tags = item.tags | split: ' ' %}
            {% for item_tag in item_tags %}
              {% assign item_tag_downcase = item_tag | downcase %}
              {% if item_tag_downcase == tag %}
                {% assign tag_count = tag_count | plus: 1 %}
                {% break %}
              {% endif %}
            {% endfor %}
          {% endif %}
        {% endif %}
      {% endfor %}
      <a href="#{{ tag | slugify }}" class="tag-cloud-item" data-count="{{ tag_count }}">{{ tag }} <span class="tag-count">({{ tag_count }})</span></a>
    {% endfor %}
  </div>
  
  {% comment %} 显示标签组 {% endcomment %}
  {% for tag in unique_tags %}
    <div class="tag-group" id="{{ tag | slugify }}">
      <h3 class="tag-name">{{ tag }} <span class="tag-count">{{ tag_count }}</span></h3>
      <ul class="post-list">
        {% for item in all_items %}
          {% if item.tags.size > 0 %}
            {% assign has_tag = false %}
            {% if item.tags.first %}
              {% comment %} 如果标签是数组 {% endcomment %}
              {% for item_tag in item.tags %}
                {% assign item_tag_downcase = item_tag | downcase %}
                {% if item_tag_downcase == tag %}
                  {% assign has_tag = true %}
                  {% break %}
                {% endif %}
              {% endfor %}
            {% else %}
              {% comment %} 如果标签是空格分隔的字符串 {% endcomment %}
              {% assign item_tags = item.tags | split: ' ' %}
              {% for item_tag in item_tags %}
                {% assign item_tag_downcase = item_tag | downcase %}
                {% if item_tag_downcase == tag %}
                  {% assign has_tag = true %}
                  {% break %}
                {% endif %}
              {% endfor %}
            {% endif %}
            
            {% if has_tag %}
              <li>
                <span class="post-meta">{{ item.date | date: "%Y-%m-%d" }}</span>
                <a class="post-link" href="{{ item.url | relative_url }}">{{ item.title }}</a>
                <span class="post-collection">{{ item.collection | capitalize }}</span>
              </li>
            {% endif %}
          {% endif %}
        {% endfor %}
      </ul>
    </div>
  {% endfor %}
</div>

<style>
  .tags-page {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .tag-cloud {
    margin-bottom: 40px;
    text-align: center;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }
  
  .tag-cloud-item {
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
  
  .tag-cloud-item:hover {
    background-color: #0366d6;
    color: white;
  }
  
  .tag-count {
    font-size: 0.8em;
    color: #666;
  }
  
  .tag-group {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
  }
  
  .tag-name {
    padding-bottom: 10px;
    border-bottom: 2px solid #0366d6;
    display: inline-block;
  }
  
  .post-list {
    list-style: none;
    padding-left: 0;
  }
  
  .post-list li {
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 5px;
    transition: background-color 0.2s;
  }
  
  .post-list li:hover {
    background-color: #f0f0f0;
  }
  
  .post-meta {
    color: #666;
    font-size: 0.9em;
    margin-right: 10px;
  }
  
  .post-link {
    font-weight: 500;
    color: #333;
    text-decoration: none;
  }
  
  .post-link:hover {
    color: #0366d6;
  }
  
  .post-collection {
    font-size: 0.8em;
    color: #888;
    background-color: #eee;
    padding: 2px 6px;
    border-radius: 3px;
    margin-left: 10px;
  }
</style>