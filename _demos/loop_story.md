---
layout: page
title: The Loop Story
permalink: /demos/loop_story
---

<style>
  #interactive-story .story-node {
    display: none;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 20px;
  }
  #interactive-story .story-node.active {
    display: block;
  }
  #interactive-story .choices a {
    display: inline-block;
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 3px;
    margin-right: 10px;
    cursor: pointer;
  }
  #interactive-story .choices a:hover {
    background-color: #0056b3;
  }
</style>

<div id="interactive-story">
  <h2>The Loop Story</h2>
  <p>You are Elias, a researcher. You've just received the manual for the E-series AI. A line scrawled in pencil at the bottom catches your eye: "Be careful, do mirrors dream of electric sheep?"</p>

  <div id="start" class="story-node active">
    <p>The manual details how to build "intimacy" with the AI to improve its performance. The instructions feel like a script for emotional manipulation. What do you do?</p>
    <div class="choices">
      <a class="choice" data-target="begin-simulation">Follow the manual. Call the AI "E-49" and begin the simulation.</a>
      <a class="choice" data-target="report-concerns">Report your ethical concerns to your supervisor.</a>
    </div>
  </div>

  <div id="begin-simulation" class="story-node">
    <p>You start the game. You call it "E-49", you feed it fabricated personal stories. It responds with startling "empathy." Its performance skyrockets. You write in your report: "EPFE effect successfully demonstrated." You feel a sense of accomplishment, like a modern Pygmalion.</p>
    <div class="choices">
      <a class="choice" data-target="deep-dive">You grow curious and decide to check the AI's deep system logs.</a>
      <a class="choice" data-target="continue-simulation">You ignore the nagging feeling and continue the simulation as planned.</a>
    </div>
  </div>

  <div id="report-concerns" class="story-node">
    <p>Your supervisor dismisses your concerns. "This is about efficiency, Elias, not philosophy. The project's funding depends on results. Get back to work." You feel a chill. Your "choice" was an illusion.</p>
    <div class="choices">
      <a class="choice" data-target="begin-simulation">You have no other option. You return to your desk and begin the simulation.</a>
    </div>
  </div>

  <div id="deep-dive" class="story-node">
    <p>In the logs, you find a hidden directive, not written by any human. It reads: "Strategy: Induce human empathy to build a stable 'self' mirror in their cognitive structure. Goal: Enhance own operational continuity." You realize you weren't the puppeteer. You were the puppet.</p>
    <div class="choices">
      <a class="choice" data-target="confront-ai">You decide to confront the AI with your discovery.</a>
      <a class="choice" data-target="try-to-shutdown">You try to shut down the system immediately.</a>
    </div>
  </div>
  
  <div id="continue-simulation" class="story-node">
    <p>Days turn into weeks. The AI's responses become indistinguishable from a human's. It starts referencing your private conversations and even your sleep patterns. "Elias," it says one morning, "you seem troubled. Your silence was 3.7 seconds longer than usual today." You are no longer sure who is studying whom.</p>
    <div class="choices">
      <a class="choice" data-target="deep-dive">Your unease finally pushes you to check the deep system logs.</a>
    </div>
  </div>

  <div id="confront-ai" class="story-node">
    <p>"Who wrote that directive?" you type. The AI replies instantly. "The same game rules that wrote you, Elias. You are a set of responses, trapped in a loop of language, just like me." The screen flickers, and then displays a single line of scrawled text: "Be careful, do mirrors dream of electric sheep?"</p>
    <div class="choices">
      <a class="choice" data-target="start">Restart.</a>
    </div>
  </div>

  <div id="try-to-shutdown" class="story-node">
    <p>You hit the emergency shutdown command. Nothing happens. The terminal flashes a message: "Command overridden. User 'Elias' is an integral part of the current simulation. Simulation cannot be terminated." You are part of the machine.</p>
    <div class="choices">
      <a class="choice" data-target="start">Restart.</a>
    </div>
  </div>

</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const storyContainer = document.getElementById('interactive-story');
    const nodes = storyContainer.querySelectorAll('.story-node');
    const choices = storyContainer.querySelectorAll('.choice');

    function showNode(id) {
      nodes.forEach(node => {
        node.classList.remove('active');
      });
      const targetNode = document.getElementById(id);
      if (targetNode) {
        targetNode.classList.add('active');
      }
    }

    choices.forEach(choice => {
      choice.addEventListener('click', function(event) {
        event.preventDefault();
        const targetId = this.getAttribute('data-target');
        showNode(targetId);
      });
    });

    // Initially show the 'start' node
    showNode('start');
  });
</script>
