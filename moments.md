---
layout: page
title: 碎碎念
permalink: /moments/
---

<div class="moments-page">
  <p class="moments-intro">这里记录了我的日常碎碎念，分享生活中的小感悟和想法。</p>
  
  {% assign sorted_moments = site.moments | sort: "date" | reverse %}
  
  <div class="moments-timeline">
    {% for moment in sorted_moments %}
      <div class="moment-item">
        <div class="moment-date">
          <span class="date-day">{{ moment.date | date: "%d" }}</span>
          <span class="date-month">{{ moment.date | date: "%b" }}</span>
          <span class="date-year">{{ moment.date | date: "%Y" }}</span>
        </div>
        <div class="moment-content">
          <h3 class="moment-title">
            <a href="{{ moment.url | relative_url }}">{{ moment.title }}</a>
          </h3>
          <div class="moment-excerpt">
            {{ moment.content | strip_html | truncatewords: 30 }}
          </div>
          {% if moment.tags.size > 0 %}
            <div class="moment-tags">
              {% for tag in moment.tags %}
                <span class="moment-tag">{{ tag }}</span>
              {% endfor %}
            </div>
          {% endif %}
          <a href="{{ moment.url | relative_url }}" class="read-more">阅读全文</a>
        </div>
      </div>
    {% endfor %}
  </div>
</div>

<style>
  .moments-intro {
    margin-bottom: 30px;
    font-size: 1.1em;
  }
  
  .moments-timeline {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .moments-timeline::before {
    content: '';
    position: absolute;
    left: 80px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e1e4e8;
  }
  
  .moment-item {
    position: relative;
    display: flex;
    margin-bottom: 40px;
  }
  
  .moment-date {
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
  
  .moment-content {
    position: relative;
    background: #f6f8fa;
    border-radius: 6px;
    padding: 15px 20px;
    margin-left: 40px;
    flex-grow: 1;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .moment-content:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  
  .moment-content::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 15px;
    width: 20px;
    height: 20px;
    background: #0366d6;
    border-radius: 50%;
    border: 4px solid #fff;
    box-shadow: 0 0 0 1px #e1e4e8;
  }
  
  .moment-title {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 1.3em;
  }
  
  .moment-excerpt {
    color: #444;
    margin-bottom: 15px;
  }
  
  .moment-tags {
    margin-bottom: 10px;
  }
  
  .moment-tag {
    display: inline-block;
    padding: 2px 8px;
    font-size: 0.8em;
    background-color: #f1f8ff;
    color: #0366d6;
    border-radius: 3px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
  
  .read-more {
    display: inline-block;
    font-size: 0.9em;
    color: #0366d6;
    text-decoration: none;
  }
  
  .read-more:hover {
    text-decoration: underline;
  }
</style>