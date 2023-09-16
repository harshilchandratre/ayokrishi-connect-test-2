const socket = io('http://localhost:8004', { transports: ['websocket', 'polling'] });

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInput');
const conversation = document.querySelector('.conversation');

const getRandomEmoji = () => {
  const emojis = ['🙌', '😃', '👋', '🎉', '💬', '🌟', '🍀', '🙏', '🤪', '🍁', '🥰', '👻', '🤠', '👀', '🫡']; // Add more emojis as needed
  const randomIndex = Math.floor(Math.random() * emojis.length);
  return emojis[randomIndex];
};

const appendMessage = (message, className) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', className);
  messageElement.textContent = message;
  conversation.appendChild(messageElement);
  conversation.scrollTop = conversation.scrollHeight;
  playNotificationSound();
};

const playNotificationSound = () => {
  const audio = new Audio('../media/notification.mp3');
  audio.play();
};

const getNameWithEmoji = () => {
  const name = prompt("Enter your name") || 'Anonymous';
  const randomEmoji = getRandomEmoji();
  return `${name}${randomEmoji}`;
};

const username = getNameWithEmoji();
socket.emit('new-user-joined', username);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (message !== '') {
    socket.emit('send-message', message);
    appendMessage(`You: ${message}`, 'message-right');
    messageInput.value = '';
  }
});

socket.on('receive-message', ({ message, name }) => {
  const formattedMessage = `${name}: ${message}`;
  appendMessage(formattedMessage, 'message-left');
});

socket.on('user-joined', (name) => {
  const message = `${name} joined the chat`;
  appendMessage(message, 'message-left');
});

socket.on('user-left', (name) => {
  const message = `${name} left the chat`;
  appendMessage(message, 'message-left');
});
