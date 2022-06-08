const express = require('express');

const server = express();

const usersRouter = require('./users/users-router')
const { logger } = require('./middleware/middleware')

// remember express by default cannot parse JSON in request bodies
server.use(express.json())
// global middlewares and the user's router need to be connected here

server.use('/api/users', logger, usersRouter)

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Error retrieving data. Sorry!',
  })
})

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
