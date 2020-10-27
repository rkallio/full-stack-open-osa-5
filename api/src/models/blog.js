const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: String,
  url: {type: String, required: true},
  likes: {type: Number, default: 0},
  user: {
    type: mongoose.Schema.Types.ObjectID,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returned) => {
    returned.id = returned._id.toString()
    delete returned._id
    delete returned.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
