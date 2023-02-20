const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');

const db = require('./queries')

const app = express()
const port = 3001

app.use(cors())

app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/api', (request, response) => {
  response.json({greeting: 'Hello world!'})
})

app.get('/api/flights/ids', db.getFlightsIds)

app.get('/api/flights', db.getAllFlights)


// app.get('/api/flights/:id', db.getFlightInfo)

app.listen(port, () => {
  console.log(`App running on port ${port}`)
})
