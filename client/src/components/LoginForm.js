// -*- mode: RJSX -*-

import React from 'react'

const LoginForm = ({ submitAction }) => {
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')

  const submitActionHandler = event => {
    event.preventDefault()
    submitAction(username, password)
    setUsername('')
    setPassword('')
  }

  return (
    <form id="login-form" onSubmit={ submitActionHandler }>
      <div>
        username
        <input
          id="login-form-username"
          type="text"
          value={ username }
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="login-form-password"
          type="password"
          value={ password }
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <input id="login-form-submit" type="submit" value="Login" />
    </form>
  )
}

export default LoginForm
