const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (req, res) => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  return res.sendStatus(204)
})

module.exports = router
