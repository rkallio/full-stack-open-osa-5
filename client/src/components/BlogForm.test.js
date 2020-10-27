// -*- mode: RJSX -*-

import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

const prepareForm = () => {
  const submit = jest.fn()
  const component = render(
    <BlogForm submitAction={ submit } />)
  const form = component.container.querySelector('form')
  return { action: submit, component, form }
}

const setInput = (component, querySelector, targetValue) => {
  fireEvent.change(
    component.container.querySelector(querySelector),
    {
      target: { value: targetValue }
    })
}

test('submit action called with title from input', () => {
  const { action, component, form } = prepareForm()
  setInput(component, '#blog-form-title', 'my title')
  fireEvent.submit(form)
  expect(action.mock.calls[0][0]).toBe('my title')
})

test('submit action called with author from input', () => {
  const { action, component, form } = prepareForm()
  setInput(component, '#blog-form-author', 'my author')
  fireEvent.submit(form)
  expect(action.mock.calls[0][1]).toBe('my author')
})

test('submit action called with url from input', () => {
  const { action, component, form } = prepareForm()
  setInput(component, '#blog-form-url', 'my url')
  fireEvent.submit(form)
  expect(action.mock.calls[0][2]).toBe('my url')
})
