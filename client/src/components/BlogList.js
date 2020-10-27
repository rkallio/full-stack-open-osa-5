// -*- mode: rjsx -*-

import React from 'react'
import Blog from './Blog'

const BlogList = ({ blogs, likeAction, deleteAction }) => {
  return (
    <>
      <h2>Blogs</h2>
      { blogs.map(blog =>
        <Blog
          key={ blog.id }
          blog={ blog }
          likeAction={ likeAction }
          deleteAction={ deleteAction }
        />) }
    </>
  )
}

export default BlogList
