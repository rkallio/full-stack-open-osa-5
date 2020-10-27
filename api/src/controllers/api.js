const router = require('express').Router()
const blogs = require('./blog')
const users = require('./user')
const login = require('./login')
const middleware = require ('../utils/middleware')

router.use(middleware.requestLogger)
router.use(middleware.tokenExtractor)
router.use('/blogs', blogs)
router.use('/users', users)
router.use('/login', login)
if(process.env.NODE_ENV === 'test') {
  const testing = require('./testing')
  router.use('/testing', testing)
}
router.use(middleware.unknownEndpoint)
router.use(middleware.errorHandler)

module.exports = router
