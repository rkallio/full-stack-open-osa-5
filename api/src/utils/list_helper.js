const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = blogs => {
  if(blogs.length === 0) {
    return 0
  }
  return blogs
    .map(blog => blog.likes)
    .reduce((acc, val) => acc + val)
}

const favoriteBlog = blogs => {
  const max = Math.max(...blogs.map(blog => blog.likes))
  return blogs.find(blog => blog.likes === max)
}

const mostBlogs = blogs => {
  if(blogs.length === 0) {
    return undefined
  }

  return(
  _.reduce(
    _.map(
      _.countBy(blogs, blog => blog.author),
      (blogs, author) => ({author, blogs})),
    (acc, curr) => curr.blogs > acc.blogs ? curr : acc))
}

const mostLikes = blogs => {
  return(
    _.reduce(
      _.map(
        _.mapValues(
          _.groupBy(blogs, function getAuthor({author}) {return author}),
          function countLikes(blogs) {
            return(
              _.reduce(
                _.map(blogs, function getLikes({likes}) {return likes}),
                function plus(a, b) {return a + b}))
          }),
        function createAuthorObject(likes, author) {return {author, likes}}),
      function maxLikes(max, current) {
        return max.likes < current.likes
          ? current
          : max
      }))
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}
