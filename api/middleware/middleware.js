const Users = require('../users/users-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(req.method, req.url, new Date())
  next()
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  const id = req.params.id
  Users.getById(id)
    .then(user => {
      if (user) {
        req.user = user
        next()
      } else {
        res.status(404).json({ message: "user not found" })
      }
    })
    .catch(err => next({ message: "Something went very wrong trying to validate User Id" }))
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { name } = req.body
  if (!name) {
    res.status(400).json({ message: "missing required name field" })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const { text } = req.body
  if (!text) {
    res.status(400).json({ message: "missing required text field" })
  } else {
    next()
  }
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}
