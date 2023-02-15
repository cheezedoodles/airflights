const express = require('express')
const bodyParser = require('body-parser')
const db = require('./queries')
const app = express()
const port = 3000

app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({greeting: 'Hello world!'})
})

app.get('/flights', db.getAllFlights)

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})