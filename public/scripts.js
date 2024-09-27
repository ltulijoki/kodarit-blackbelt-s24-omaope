document.getElementById('send-button-chatbox').addEventListener('click', sendMessage)

document.getElementById('user-input-chatbox').addEventListener('keypress', e => e.key == 'Enter' && sendMessage())

async function sendMessage() {
  console.log('Viesti lähetetty')
  const input = document.getElementById('user-input-chatbox');
  const userMessage = input.value;
  input.value = '';
  console.log(userMessage)
  addMessageToChat(userMessage)

  const response = await fetch('/ekatesti', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question: userMessage })
  })
}

function addMessageToChat(message) {
  const messageElement = document.createElement('div')
  messageElement.textContent = message
  console.log(messageElement)
  document.getElementById('chatbox').appendChild(messageElement)
}