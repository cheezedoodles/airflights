const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

// TODO: pagination
const getAllFlights = (request, response) => {
  pool.query(
    'SELECT * FROM flights LIMIT 50',
    (err, results) => {
      if (err) {
        console.err(err)
        throw err
      }

      response.status(200).json(results.rows)
    }
  )
}

module.exports = {
  getAllFlights,
}

