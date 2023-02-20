const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

const getAllFlights = (request, response) => {
  
  pool.query(
    'SELECT count(*) FROM flights',
    (err, results) => {
      if (err) {
        throw err
      }
  
      let countRows = results.rows[0].count

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

const getFlightInfo = (request, response) => {
  const id = request.params.id
  const query = {
    name: 'fetch-flight-by-id',
    text: `SELECT
      flight_id, 
      flight_no,
      scheduled_departure,
      scheduled_arrival,
      scheduled_duration,
      departure_airport,
      departure_airport_name,
      departure_city,
      arrival_airport,
      arrival_airport_name,
      arrival_city,
      status,
      aircraft_code
    FROM flights_v
    WHERE flight_id = $1;`,
    values: [id],
  }

  pool.query(query, (err, results) => {
    if (err) { throw err }

    const flightInfo = results.rows[0]
    pool.query(
      `SELECT s.seat_no 
      FROM seats s 
      JOIN flights_v f_v 
      ON f_v.aircraft_code = s.aircraft_code 
      WHERE f_v.flight_id = $1;`,
      [id],
      (err, results) => {
        if (err) { throw err }

        const allSeats = results.rows

        pool.query(
          `SELECT b_p.seat_no 
          FROM boarding_passes b_p 
          JOIN flights_v f_v 
          ON f_v.flight_id = b_p.flight_id 
          WHERE f_v.flight_id = $1;`,
          [id],
          (err, results) => {
            if (err) { throw err }

            const takenSeats = results.rows

            response.status(200).json({
              flightInfo,
              allSeats,
              takenSeats,
          })
      })
    })
  })
}

module.exports = {
  getAllFlights,
  getFlightsIds,
  getFlightInfo,
}

