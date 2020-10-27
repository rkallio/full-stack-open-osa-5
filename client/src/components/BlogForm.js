// -*- mode: RJSX -*-

import React from 'react'

const BlogForm = ({ submitAction }) => {
  const [title, setTitle] = React.useState('')
  const [author, setAuthor] = React.useState('')
  const [url, setUrl] = React.useState('')

  const handleSubmission = (event) => {
    event.preventDefault()
    submitAction(title, author, url)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmission} id="blog-form">
      <div>
        Title
        <input
          id="blog-form-title"
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value) } />
      </div>
      <div>
        Author
        <input
          id="blog-form-author"
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value) } />
      </div>
      <div>
        URL
        <input
          id="blog-form-url"
          type="text"
          value={ url }
          onChange={({ target }) => setUrl(target.value) } />
      </div>
      <div>
        <input type="submit" value="submit blog"/>
      </div>
    </form>
  )
}

export default BlogForm
