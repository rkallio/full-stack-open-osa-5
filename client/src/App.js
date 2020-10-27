// -*- mode: rjsx -*-

import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import _ from 'lodash'

const sortByLikes = _.partialRight(_.orderBy, _.partialRight(_.get, 'likes'), 'desc')

const App = () => {
  const notificationRef = React.useRef()

  const [user, setUser] = useState(null)
  useEffect(() => {
    const userToken = window.localStorage.getItem('User')
    if(userToken) {
      setUser(JSON.parse(userToken))
    }
  }, [])

  const [blogs, setBlogs] = useState([])
  useEffect(() => {
    blogService.getAll()
      .then(blogs => {
        setBlogs(sortByLikes(blogs))
      })
      .then(() => notificationRef.current.successNotification('Blogs loaded'))
      .catch(() => notificationRef.current.errorNotification('Blogs failed to load'))
  }, [])

  const handleLogin = async (username, password) => {
    let user
    try {
      user = await loginService.login({
        username, password
      })
    } catch(err) {
      notificationRef.current.errorNotification('Failed login')
      return
    }
    setUser(user)
    window.localStorage.setItem('User', JSON.stringify(user))
    notificationRef.current.successNotification(`Logged in as ${user.username}`)
  }

  const logout = async event => {
    event.preventDefault()
    window.localStorage.removeItem('User')
    setUser(null)
    notificationRef.current.successNotification('Logged out')
  }

  const blogFormRef = React.useRef()

  const handleBlogPost = async (title, author, url) => {
    blogFormRef.current.toggleVisibility()
    const { token } = user

    let blog
    try {
      blog = await blogService.create({ title, author, url }, token)
    } catch(err) {
      notificationRef.current.errorNotification('Failed to create blog')
      return
    }
    setBlogs(sortByLikes([...blogs, blog]))
    notificationRef.current.successNotification(
      `blog ${ blog.title } by ${ blog.author } created`)
  }

  const handleLike = async blog => {
    const userData = _.get(blog, 'user')

    const request = _.omit(blog, 'user')
    request.likes = request.likes + 1

    const promise = blogService.update(request.id, request, user.token)
    let result
    try {
      result = await promise
    } catch(err) {
      notificationRef.current.errorNotification('Couldn\'t add a like')
    }

    result.user = userData
    const rest = blogs.filter(b => b.id !== result.id)
    setBlogs(sortByLikes([...rest, result]))
    notificationRef.current.successNotification(
      `Added like to ${ result.author }, ${ result.title }`)
  }

  const handleDelete = async blog => {
    const confirm = window.confirm(`Delete ${ blog.title } by ${ blog.author }?`)
    if(!confirm) {
      return
    }
    const promise = blogService.delete(blog.id, user.token)
    try {
      await promise
    } catch(err) {
      notificationRef.current.errorNotification('Couldn\'t delete blog')
    }

    const rest = blogs.filter(b => b.id !== blog.id)
    setBlogs(rest)
    notificationRef.current.successNotification(
      `Deleted blog ${ blog.author }, ${ blog.title }`)
  }

  if(user) {
    return (
      <>
        <p>{ user.username } logged in</p>
        <button onClick={ logout }>Log out</button>
        <Togglable buttonLabel='New blog' ref={ blogFormRef }>
          <BlogForm submitAction={ handleBlogPost } />
        </Togglable>
        <Notification ref={ notificationRef } />
        <BlogList
          blogs={ blogs }
          likeAction={ handleLike }
          deleteAction={ handleDelete }
        />
      </>
    )
  } else {
    return (
      <>
        <LoginForm submitAction ={ handleLogin } />
        <Notification ref={ notificationRef } />
      </>
    )
  }
}

export default App
