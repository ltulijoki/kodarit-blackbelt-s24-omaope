import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = 3000

app.use(express.static('public'))
app.use(bodyParser.json())

app.post('/ekatesti', (req, res) => {
  const userMessage = req.body.question;
  console.log("Käyttäjä lähetti backendille viestin: " + userMessage)
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})