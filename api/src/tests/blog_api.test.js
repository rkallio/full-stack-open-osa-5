const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

let token

const blogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  }
]

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  for(const blog of blogs) {
    await api.post('/api/blogs').send(blog).set({'Authorization': `Bearer ${token}`}).expect(200)
  }
  const {body} = await api.get('/api/blogs')
  expect(body).toHaveLength(blogs.length)
})

test('specific blog is within returned blogs', async () => {
  for(const blog of blogs) {
    await api.post('/api/blogs').send(blog).set({'Authorization': `Bearer ${token}`}).expect(200)
  }
  const {body} = await api.get('/api/blogs')
  const urls = body.map(blog => blog.url)
  expect(urls).toContain(
    'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html')
})

test('blogs contain id field', async () => {
  const {body} = await api.get('/api/blogs')
  body.map(function expectID(blog) { expect(blog.id).toBeDefined() })
})

test('blog may be added', async () => {
  await api.post('/api/blogs')
    .send(blogs[0])
    .set({'Authorization': `Bearer ${token}`})

  const fetchedBlogs = await Blog.find({})
  expect(fetchedBlogs.length).toBe(1)
})

test('adding a blog without likes field sets likes to 0', async () => {
  const response = await api
        .post('/api/blogs')
        .send({
          title: "Something or other",
          author: "Dumledore",
          url: "www.hogwarts.edu/~ad/something-or-other.html"
        })
        .set({'Authorization': `Bearer ${token}`})
  expect(response.body.likes).toBe(0)
})

test('attempting to add a blog without title returns 400 status', async () => {
  const response = await api
        .post('/api/blogs')
        .send({
          author:"Dumledore",
          url:"www.hogwards.edu/~ad/something-or-other.html"
        })
        .set({'Authorization': `Bearer ${token}`})
        .expect(400)
})

test('attempting to add a blog without url returns 400 status', async () => {
  const response = await api
        .post('/api/blogs')
        .send({
          title:"hello",
          author:"Dumledore",
        })
        .set({'Authorization': `Bearer ${token}`})
        .expect(400)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await api
    .post('/api/users')
    .send({
      username: 'root',
      password: 'root'
    })

  token = (await api
           .post('/api/login')
           .send({
             username: 'root',
             password: 'root'
           })).body.token
})

afterAll(() => mongoose.connection.close())
