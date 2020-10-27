const bcrypt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user')

router.post('/', async (req, res) => {
  const body = req.body
  if(body.password.length < 3) {
    return res.status(400).json({
        error: 'password should be at least 3 characters long'
    })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)
  const user = new User({
    name: body.name,
    username: body.username,
    passwordHash,
  })

  const savedUser = await user.save()
  return res.json(savedUser)
})

router.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs')
  return res.json(users.map(user => user.toJSON()))
})

module.exports = router
