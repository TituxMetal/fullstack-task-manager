const express = require('express')

const server = express()

server.use(express.json())

server.use('/api', require('./routes/welcome'))
server.use('/api/tasks', require('./routes/task'))

server.use((err, _req, res, _next) => {
  const { status = 500, message } = err
  res.status(status).json(message)
})

module.exports = server
