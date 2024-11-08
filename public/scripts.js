document.getElementById('send-button-chatbox').addEventListener('click', sendMessage)

document.getElementById('user-input-chatbox').addEventListener('keypress', e => e.key == 'Enter' && sendMessage())

document.getElementById('send-images-button').addEventListener('click', sendImages);

async function sendMessage() {
  console.log('Viesti lähetetty')
  const input = document.getElementById('user-input-chatbox');
  const userMessage = input.value;
  input.value = '';
  console.log(userMessage)
  addMessageToChat('Sinä: ' + userMessage, 'user-message')

  const response = await fetch('/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ question: userMessage })
  })
    const data = await response.json()
  if (response.status === 200) {
    console.log(data)
    console.log(data.reply)
    addMessageToChat('ChatGPT: ' + data.reply, 'bot-message')
  } else {
    console.log(response)
    addMessageToChat('ChatGPT: Jotain meni pieleen. Yritä myöhemmin uudelleen.', 'bot-message')
  }
}

function addMessageToChat(message, className) {
  const messageElement = document.createElement('div')
  messageElement.classList.add('message', className)
  messageElement.textContent = message
  console.log(messageElement)
  document.getElementById('chatbox').appendChild(messageElement)
}

function sendImages() {
  const imageInput = document.getElementById('image-input')
  const files = imageInput.files
  console.log(files)

  if (files.length === 0) {
    alert('Valitse kuvia ensin.')
    return
  }

  const formData = new FormData()
  console.log(formData)

  for (const file of files) {
    formData.append('images', file)
  }

  console.log(formData.getAll('images'))
}