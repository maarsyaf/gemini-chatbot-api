const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const API_URL = '/api/chat';

function appendMessage(sender, text) {
  const message = document.createElement('div');
  message.classList.add('message', `${sender}-message`);
  message.textContent = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  const thinkingMsg = document.createElement('div');
  thinkingMsg.classList.add('message', 'bot-message');
  thinkingMsg.textContent = 'Thinking...';
  chatBox.appendChild(thinkingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ role: 'user', text: userMessage }]),
    });

  if (!response.ok) {
    thinkingMsg.textContent = 'Server error 😞';
    return;
  }

  const data = await response.json();
  thinkingMsg.textContent = data?.result || 'No response received.';
  } catch (err) {
    console.error(err);
    thinkingMsg.textContent = 'Failed to reach server.';
  }
  })