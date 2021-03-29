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
  expect(res.body.length).toBe(4)
})

it('create new event', async () => {
  const body = {

  }

  const res = await request.post('/api/events').send(body)

  expect(res.status).toBe(202);
})
