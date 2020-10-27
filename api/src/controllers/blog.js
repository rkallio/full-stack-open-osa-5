const jwt = require('jsonwebtoken')
const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user')
  return res.json(blogs)
})

router.post('/', async (req, res, next) => {
  const body = req.body
  if(!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if(!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  let savedBlog
  try {
    savedBlog = await blog.save()
  } catch(err) {
    return next(err)
  }

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  return res.json(savedBlog.toJSON())
})

router.delete('/:id', async (req, res, next) => {
  const {id} = req.params
  if(!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if(!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  let blog
  try {
    blog = await Blog.findById(id)
  } catch(err) {
    return next(err)
  }

  console.log(blog.user._id.toString(), user._id.toString())
  if(blog.user._id.toString() !== user._id.toString()) {
    return res.status(401).json({ error: 'Not owner of blog' })
  }

  try {
    blog = await Blog.findByIdAndRemove(id)
  } catch(err) {
    return next(err)
  }

  return res.sendStatus(204)
})

router.put('/:id', async (req, res, next) => {
  const body = req.body
  if(!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }
  const decoded = jwt.verify(req.token, process.env.SECRET)
  if(!decoded.id) {
    return res.status(401).json({ error: 'token invalid' })
  }

  let user
  try {
    user = await User.findById(decoded.id)
  } catch(err) {
    return next(err)
  }

  let blog
  try {
    blog = await Blog.findById(req.params.id)
  } catch(err) {
    return next(err)
  }

  if(blog.user._id.toString() !== user._id.toString()) {
    return res.status(401).json({ error: 'Not owner of blog' })
  }

  let updated
  try {
    updated = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new:  true })
  } catch(err) {
    return next(err)
  }

  return res.json(updated)
})

module.exports = router
