const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const API_URL = '/api/chat';

// Menambahkan pesan ke tampilan chat
function appendMessage(sender, text) {
  const message = document.createElement('div');
  message.classList.add('message', `${sender}-message`);
  message.innerHTML = text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Efek animasi titik "AI sedang mengetik"
function createTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.classList.add('message', 'bot-message', 'typing');
  typingDiv.innerHTML = `
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  `;
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return typingDiv;
}

// Fungsi efek mengetik interaktif
async function typeMessage(text) {
  const message = document.createElement('div');
  message.classList.add('message', 'bot-message');
  chatBox.appendChild(message);

  for (let i = 0; i < text.length; i++) {
    message.innerHTML = text.slice(0, i + 1).replace(/\n/g, '<br>');
    chatBox.scrollTop = chatBox.scrollHeight;
    await new Promise(r => setTimeout(r, 15)); // kecepatan ngetik
  }
}

// Event saat user kirim pesan
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  const typingIndicator = createTypingIndicator();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', text: userMessage }]
      }),
    });

    const data = await response.json();
    typingIndicator.remove();

    if (data?.result) {
      await typeMessage(data.result);
    } else {
      appendMessage('bot', 'No response received.');
    }

  } catch (err) {
    typingIndicator.remove();
    appendMessage('bot', '⚠️ Failed to reach server.');
  }
});
