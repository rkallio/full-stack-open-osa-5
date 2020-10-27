// -*- mode: RJSX -*-

import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

test('renders title', () => {
  const blog = {
    title: 'generics considered harmful'
  }

  const component = render(
    <Blog blog={ blog } />)

  expect(component.container).toHaveTextContent(
    'generics considered harmful')
})

test('renders author', () => {
  const blog = {
    author: 'Dumledore'
  }

  const component = render(
    <Blog blog={ blog } />)

  expect(component.container).toHaveTextContent('Dumledore')
})

test('doesn\'t render url  by default', () => {
  const blog = { url: 'localhost' }

  const component = render(
    <Blog blog={ blog } />)

  expect(() => component.getByText('localhost')).toThrow()
})

test('doesn\'t render likes by default', () => {
  const blog = { likes: 1 }
  const component = render(
    <Blog blog={ blog } />)
  expect(() => component.getByText('likes')).toThrow()
})

test('renders url when activated', () => {
  const blog = { url: 'localhost', user: { name: 'root' }}

  const component = render(
    <Blog blog={ blog } />)

  const button = component.getByText('show')

  fireEvent.click(button)
  expect(component.container).toHaveTextContent('localhost')
})

test('renders likes when activated', () => {
  const blog = { likes: 2^32, user: { name: 'root' }}

  const component = render(
    <Blog blog={ blog } />)

  const button = component.getByText('show')
  fireEvent.click(button)
  expect(component.container).toHaveTextContent((2^32).toString())
})

test('like button fires supplied event', () => {
  const blog = { user: { name: 'root' }}
  const mock = jest.fn()
  const component = render(
    <Blog blog={ blog } likeAction={ mock } />)

  const showButton = component.getByText('show')
  fireEvent.click(showButton)

  const addLikeButton = component.getByText('Add like')
  fireEvent.click(addLikeButton)
  fireEvent.click(addLikeButton)
  expect(mock.mock.calls).toHaveLength(2)
})
