// -*- mode: RJSX -*-

import React from 'react'

const BlogHeader = ({ blog, toggleState, stateText }) => {
  return (
    <div>
      { blog.title } — { blog.author }
      <button onClick={ toggleState }>
        { stateText() }
      </button>
    </div>
  )
}

const BlogBody = ({ show, blog, handleLike, handleDelete }) => {
  if(show) {
    return (
      <>
        <div>{ blog.url }</div>
        <div>
          likes: { blog.likes }
          <button onClick={ handleLike }>Add like</button>
        </div>
        <div>{ blog.user.name }</div>
        <div>
          <button onClick={ handleDelete }>remove</button>
        </div>
      </>
    )
  } else {
    return <></>
  }
}

const Blog = ({ blog, likeAction, deleteAction }) => {
  const [expanded, setExpanded] = React.useState(false)
  const toggleState = () => setExpanded(!expanded)
  const stateText = () => expanded ? 'hide' : 'show'

  const handleLike = () => {
    likeAction(blog)
  }

  const handleDelete = () => {
    deleteAction(blog)
  }

  return (
    <>
      <BlogHeader
        blog={ blog }
        toggleState={ toggleState }
        stateText={ stateText }
      />
      <BlogBody
        show={ expanded }
        blog={ blog }
        handleLike={ handleLike }
        handleDelete={ handleDelete }
      />
    </>
  )
}

export default Blog
