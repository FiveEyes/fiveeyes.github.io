---
layout: page
title: 小故事
permalink: /stories/
---

<div class="stories-page">
  <p class="stories-intro">这里收录了我创作的小故事，包括短篇故事、随笔和创意写作等内容。</p>
  
  {% assign sorted_stories = site.stories | sort: "date" | reverse %}
  
  <div class="stories-timeline">
    {% for story in sorted_stories %}
      <div class="story-item">
        <div class="story-date">
          <span class="date-day">{{ story.date | date: "%d" }}</span>
          <span class="date-month">{{ story.date | date: "%b" }}</span>
          <span class="date-year">{{ story.date | date: "%Y" }}</span>
        </div>
        <div class="story-content">
          <h3 class="story-title">
            <a href="{{ story.url | relative_url }}">{{ story.title }}</a>
          </h3>
          <div class="story-excerpt">
            {{ story.content | strip_html | truncatewords: 50 }}
          </div>
          {% if story.tags.size > 0 %}
            <div class="story-tags">
              {% for tag in story.tags %}
                <span class="story-tag">{{ tag }}</span>
              {% endfor %}
            </div>
          {% endif %}
          <a href="{{ story.url | relative_url }}" class="read-more">阅读全文</a>
        </div>
      </div>
    {% endfor %}
  </div>
</div>

<style>
  .stories-intro {
    margin-bottom: 30px;
    font-size: 1.1em;
  }
  
  .stories-timeline {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .stories-timeline::before {
    content: '';
    position: absolute;
    left: 80px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e1e4e8;
  }
  
  .story-item {
    position: relative;
    display: flex;
    margin-bottom: 40px;
  }
  
  .story-date {
    width: 60px;
    padding-right: 20px;
    text-align: right;
    flex-shrink: 0;
  }
  
  .date-day {
    display: block;
    font-size: 1.5em;
    font-weight: bold;
    line-height: 1;
  }
  
  .date-month, .date-year {
    display: block;
    font-size: 0.9em;
    color: #586069;
  }
  
  .story-content {
    position: relative;
    background: #f6f8fa;
    border-radius: 6px;
    padding: 15px 20px;
    margin-left: 40px;
    flex-grow: 1;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .story-content:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  .story-title {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.4em;
  }
  
  .story-title a {
    color: #24292e;
    text-decoration: none;
  }
  
  .story-title a:hover {
    color: #0366d6;
  }
  
  .story-excerpt {
    color: #444d56;
    margin-bottom: 15px;
    line-height: 1.6;
  }
  
  .story-tags {
    margin-bottom: 10px;
  }
  
  .story-tag {
    display: inline-block;
    padding: 2px 8px;
    font-size: 0.8em;
    background-color: #f5f5f5;
    color: #555;
    border-radius: 3px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
  
  .read-more {
    display: inline-block;
    color: #0366d6;
    text-decoration: none;
    font-weight: 500;
  }
  
  .read-more:hover {
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    .stories-timeline::before {
      left: 30px;
    }
    
    .story-date {
      width: 40px;
      padding-right: 10px;
    }
    
    .story-content {
      margin-left: 20px;
    }
  }
</style>