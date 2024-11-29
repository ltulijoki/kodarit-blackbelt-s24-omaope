import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import multer from 'multer'
import vision from '@google-cloud/vision'
import fs from 'fs'

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(bodyParser.json())

dotenv.config()

const upload = multer({ dest: 'uploads/' })

const client = new vision.ImageAnnotatorClient({
  keyFilename: 'omaope-vision.json'
})

let koealueTekstina = ''
let context = []

app.post('/chat', async (req, res) => {
  const userMessage = req.body.question;
  console.log("Käyttäjä lähetti chatGPT:lle viestin: " + userMessage)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: userMessage }
        ],
        max_tokens: 150
      })
    })

    const data = await response.json()
    const reply = data.choices[0].message.content
    console.log('API response:', reply)
    res.json({ reply })
  } catch (error) {
    console.error('Virheviesti:', error.message)
  }
})

app.post('/upload-images', upload.array('images', 10), async (req, res) => {
  const files = req.files;
  console.log('Kuvat lähetetty')
  console.log(files)

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'Kuvia ei ole lisätty/löydy' })
  } else {
      const texts = await Promise.all(files.map(async file => {
      const imagePath = file.path
      console.log(imagePath)
      const [result] = await client.textDetection(imagePath)
      const detections = result.textAnnotations
      console.log('OCR Detected Text:', detections)
      fs.unlinkSync(imagePath)
      return detections.length > 0 ? detections[0].description : ''
    }))

    console.log(texts)
    koealueTekstina = texts.join(' ')
    console.log(koealueTekstina)

    context = [{ role: 'user', content: koealueTekstina }]
  }
})

/*
app.post('/ekatesti', (req, res) => {
  const userMessage = req.body.question;
  console.log("Käyttäjä lähetti backendille viestin: " + userMessage)

  if (userMessage) {
    res.json({ question: `Tämä on serverin palauttama viesti frontille: ${userMessage}` })
  } else {
    res.status(400).json({ error: 'Kysymys puuttuu' })
  }
})
*/

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})