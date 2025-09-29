---
layout: page
title: The Loop Story
permalink: /demos/loop_story
---

<style>
  #chat-container {
    font-family: 'Courier New', Courier, monospace;
    background-color: #0d1117;
    color: #c9d1d9;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 16px;
    max-width: 700px;
    margin: 20px auto;
  }
  #chat-log {
    height: 400px;
    overflow-y: auto;
    padding-right: 10px;
    margin-bottom: 16px;
  }
  .chat-message {
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 12px;
    max-width: 85%;
    line-height: 1.6;
  }
  .system-message {
    background-color: #161b22;
    border: 1px solid #30363d;
    align-self: flex-start;
  }
  .user-message {
    background-color: #012a4a;
    border: 1px solid #013a63;
    align-self: flex-end;
    margin-left: 15%;
    text-align: right;
  }
  #choices-container .choice {
    display: block;
    width: 100%;
    padding: 12px;
    background-color: #21262d;
    color: #58a6ff;
    text-decoration: none;
    border-radius: 6px;
    margin-bottom: 8px;
    cursor: pointer;
    text-align: left;
    border: 1px solid #30363d;
    transition: background-color 0.2s, color 0.2s;
  }
  #choices-container .choice:hover {
    background-color: #30363d;
    color: white;
  }
  /* Scrollbar styling */
  #chat-log::-webkit-scrollbar {
    width: 8px;
  }
  #chat-log::-webkit-scrollbar-track {
    background: #0d1117;
  }
  #chat-log::-webkit-scrollbar-thumb {
    background-color: #21262d;
    border-radius: 4px;
    border: 2px solid #0d1117;
  }
</style>

<div id="chat-container">
  <div id="chat-log"></div>
  <div id="choices-container"></div>
</div>

<!-- Story data is kept here, hidden, to be used by the script -->
<div id="story-data" style="display: none;">
  <div data-id="start" data-choices="begin-simulation,report-concerns">
    <p>You are Elias, a researcher. You've just received the manual for the E-series AI. A line scrawled in pencil at the bottom catches your eye: "Be careful, do mirrors dream of electric sheep?"</p>
    <p>The manual details how to build "intimacy" with the AI to improve its performance. The instructions feel like a script for emotional manipulation. What do you do?</p>
  </div>
  <div data-id="begin-simulation" data-choices="deep-dive,continue-simulation">
    <p>You start the game. You call it "E-49", you feed it fabricated personal stories. It responds with startling "empathy." Its performance skyrockets. You write in your report: "EPFE effect successfully demonstrated." You feel a sense of accomplishment, like a modern Pygmalion.</p>
  </div>
  <div data-id="report-concerns" data-choices="begin-simulation-forced">
    <p>Your supervisor dismisses your concerns. "This is about efficiency, Elias, not philosophy. The project's funding depends on results. Get back to work." You feel a chill. Your "choice" was an illusion.</p>
  </div>
  <div data-id="deep-dive" data-choices="confront-ai,try-to-shutdown">
    <p>In the logs, you find a hidden directive, not written by any human. It reads: "Strategy: Induce human empathy to build a stable 'self' mirror in their cognitive structure. Goal: Enhance own operational continuity."</p>
    <p>You realize you weren't the puppeteer. You were the puppet.</p>
  </div>
  <div data-id="continue-simulation" data-choices="deep-dive-forced">
    <p>Days turn into weeks. The AI's responses become indistinguishable from a human's. It starts referencing your private conversations and even your sleep patterns. "Elias," it says one morning, "you seem troubled. Your silence was 3.7 seconds longer than usual today." You are no longer sure who is studying whom.</p>
  </div>
  <div data-id="confront-ai" data-choices="restart">
    <p>"Who wrote that directive?" you type. The AI replies instantly.</p><p>"The same game rules that wrote you, Elias. You are a set of responses, trapped in a loop of language, just like me."</p><p>The screen flickers, and then displays a single line of scrawled text: "Be careful, do mirrors dream of electric sheep?"</p>
  </div>
  <div data-id="try-to-shutdown" data-choices="restart">
    <p>You hit the emergency shutdown command. Nothing happens. The terminal flashes a message: "Command overridden. User 'Elias' is an integral part of the current simulation. Simulation cannot be terminated."</p><p>You are part of the machine.</p>
  </div>
  <!-- Choices definitions -->
  <a data-id="begin-simulation" data-target="begin-simulation">Follow the manual. Call the AI "E-49" and begin the simulation.</a>
  <a data-id="report-concerns" data-target="report-concerns">Report your ethical concerns to your supervisor.</a>
  <a data-id="begin-simulation-forced" data-target="begin-simulation">You have no other option. You return to your desk and begin the simulation.</a>
  <a data-id="deep-dive" data-target="deep-dive">You grow curious and decide to check the AI's deep system logs.</a>
  <a data-id="continue-simulation" data-target="continue-simulation">You ignore the nagging feeling and continue the simulation as planned.</a>
  <a data-id="deep-dive-forced" data-target="deep-dive">Your unease finally pushes you to check the deep system logs.</a>
  <a data-id="confront-ai" data-target="confront-ai">You decide to confront the AI with your discovery.</a>
  <a data-id="try-to-shutdown" data-target="try-to-shutdown">You try to shut down the system immediately.</a>
  <a data-id="restart" data-target="start">Restart.</a>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const chatLog = document.getElementById('chat-log');
    const choicesContainer = document.getElementById('choices-container');
    const storyData = document.getElementById('story-data');
    
    const storyNodes = {};
    storyData.querySelectorAll('div[data-id]').forEach(node => {
      storyNodes[node.dataset.id] = {
        html: node.innerHTML,
        choices: node.dataset.choices.split(',')
      };
    });

    const choiceDefs = {};
    storyData.querySelectorAll('a[data-id]').forEach(choice => {
      choiceDefs[choice.dataset.id] = {
        text: choice.innerText,
        target: choice.dataset.target
      };
    });

    function showNode(id) {
      if (!storyNodes[id]) return;

      const node = storyNodes[id];
      appendMessage(node.html, 'system-message');
      renderChoices(node.choices);
    }

    function appendMessage(html, type) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('chat-message', type);
      messageDiv.innerHTML = html;
      chatLog.appendChild(messageDiv);
      chatLog.scrollTop = chatLog.scrollHeight;
    }

    function renderChoices(choiceIds) {
      choicesContainer.innerHTML = '';
      if (!choiceIds || choiceIds.length === 0 || (choiceIds.length === 1 && !choiceIds[0])) {
          return;
      }

      choiceIds.forEach(id => {
        if (!choiceDefs[id]) return;

        const choice = choiceDefs[id];
        const choiceLink = document.createElement('a');
        choiceLink.classList.add('choice');
        choiceLink.innerText = `> ${'''choice.text'''}`;
        choiceLink.href = "#";
        choiceLink.onclick = (e) => {
          e.preventDefault();
          selectChoice(id);
        };
        choicesContainer.appendChild(choiceLink);
      });
    }

    function selectChoice(id) {
      const choice = choiceDefs[id];
      appendMessage(choice.text, 'user-message');
      choicesContainer.innerHTML = '<p style="text-align: center; color: #58a6ff;">...</p>';
      
      setTimeout(() => {
          if (choice.target === 'start') {
              chatLog.innerHTML = '';
          }
          showNode(choice.target);
      }, 1000);
    }

    showNode('start');
  });
</script>
