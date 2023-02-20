const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

let countRows
pool.query(
  'SELECT count(*) FROM flights',
  (err, results) => {
    if (err) {
      throw err
    }

    countRows = results.rows[0].count
  })


const getAllFlights = (request, response) => {
  
  const limit = 25;
  const pageCount = Math.ceil(countRows / limit)

  let page = parseInt(request.query.page) > 1 
    ? parseInt(request.query.page) 
    : 1
  if (page > pageCount) page = pageCount

  let offset = limit * (page - 1)

  const query = {
    name: 'fetch-flights',
    text: 'SELECT * FROM flights LIMIT $1 OFFSET $2',
    values: [limit, offset],
  }
 
  pool.query(query, (err, results) => {
    if (err) {
      throw err
    }

    response.status(200).json({
      flights: results.rows,
      page,
      pageCount,
      lastPage: page === pageCount,
    })
  })
}

const getFlightsIds = (request, response) => {
  pool.query('SELECT flight_id FROM flights', (err, results) => {
    if (err) {
      throw err
    }

    response.status(200).json(
      results.rows
    )
  })
}

module.exports = {
  getAllFlights,
  getFlightsIds
}

