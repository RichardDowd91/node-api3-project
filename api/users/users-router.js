const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model')
const Posts = require('../posts/posts-model')
// The middleware functions also need to be required
const { validateUserId, validateUser, validatePost } = require('../middleware/middleware')
const router = express.Router();
router.use(express.json())

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then(users => {
      res.json(users)
    })
    .catch(err => next({}))
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user)
});

router.post('/', validateUser ,(req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(err => next({}))
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const changes = req.body
  const id = req.params.id
  Users.update(id, changes)
    .then(newUser => {
      console.log(newUser)
      res.status(200).json(newUser)
    })
    .catch(err => {
      next({ message: 'something went wrong with the database' })
    })
});

router.delete('/:id', validateUserId, (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const id = req.params.id
  Users.remove(id)
    .then(numOfRecords => {
      console.log(numOfRecords)
      if (numOfRecords === 1) {
        res.status(200).json(req.user)
      }
    })
    .catch(err => next({}))
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const { id } = req.params
  Users.getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => next({}))
});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { text } = req.body
  const { id } = req.params
  const newPostReq = { text, user_id: id }
  Posts.insert(newPostReq)
    .then(newPostRes => {
      res.status(201).json(newPostRes)
    })
    .catch(err => next({}))
});

// do not forget to export the router
module.exports = router