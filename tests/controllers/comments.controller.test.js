const supertest = require('supertest')
const app = require('../../app')
const request = supertest(app)
const mongoose = require('mongoose')

afterAll(async () => {
  await mongoose.connection.close();
})

beforeAll(async () => {
})
