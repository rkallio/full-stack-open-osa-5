// -*- mode: rjsx -*-

import React from 'react'

const error = {
  background: 'red'
}

const success = {
  background: 'green'
}

const Notification = React.forwardRef((props, ref) => {
  const [message, setMessage] = React.useState(null)
  const [status, setStatus] = React.useState(null)
  const [showNotification, setShowNotification] = React.useState(false)

  const notification = status => message => {
    setStatus(status)
    setMessage(message)
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const successNotification = notification(success)
  const errorNotification = notification(error)

  React.useImperativeHandle(ref, () => ({
    successNotification, errorNotification
  }))

  if(showNotification) {
    return <div style={status}>{ message }</div>
  } else {
    return <></>
  }
})

Notification.displayName = 'Notification'

export default Notification
