const supertest = require('supertest')
const app = require('../../app')
const request = supertest(app)
const mongoose = require('mongoose')
const eventsData = require('../../data/events.json')
const Event = require('../../models/event.model')

afterAll(async () => {
  await mongoose.connection.close();
})

beforeAll(async () => {
  await Event.create(eventsData)
})

it('get all events', async () => {
  const res = await request.get('/api/events')

  expect(res.status).toBe(200);
  expect(res.body.length).toBe(4);
})

it('create new event', async () => {
  const body = {
    tags: ["ironhacker"],
    title: "event happy case",
    description: "description test",
    capacity: 500,
    start: '2021-07-21T10:00:00.000Z',
    end: '2021-07-21T12:00:00.000Z',
    image: 'https://image.com/image.jpg',
    location: [100, 90],
  }

  const res = await request.post('/api/events').send(body)

  expect(res.status).toBe(201);

  const { id } = res.body

  const res2 = await request.get(`/api/events/${id}`)

  expect(res2.status).toBe(200);
  expect(res2.body.title).toBe('event happy case')
})

it('create new event without title', async () => {
  const body = {
    tags: ["ironhacker"],
    description: "description test",
    capacity: 500,
    start: '2021-07-21T10:00:00.000Z',
    end: '2021-07-21T12:00:00.000Z',
    image: 'https://image.com/image.jpg',
    location: [100, 90],
  }

  const res = await request.post('/api/events').send(body)

  expect(res.status).toBe(400);
})
