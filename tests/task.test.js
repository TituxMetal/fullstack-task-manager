const request = require('supertest')

const server = require('../server/app')
const Task = require('../server/models/Task')
const {
  taskOne,
  taskOneId,
  taskTwo,
  taskTwoId,
  setupDatabase,
  cleanupDatabase
} = require('./setup')

describe('Tasks Routes', () => {
  beforeEach(async () => {
    await setupDatabase()
    expect(await Task.find().countDocuments()).toBe(2)
  })

  afterEach(async () => await cleanupDatabase())

  describe('GET /api/tasks => get all tasks', () => {
    it('should get all tasks', async () => {
      const { body } = await request(server)
        .get('/api/tasks')
        .expect(200)

      expect(body[0].description).toBe(taskOne.description)
      expect(body[1].description).toBe(taskTwo.description)
      expect(body[0]._id).toEqual(taskOneId.toString())
      expect(body[1]._id).toEqual(taskTwoId.toString())
    })

    it('should return an empty array if no tasks found', async () => {
      await Task.deleteMany()
      const { body } = await request(server)
        .get('/api/tasks')
        .expect(200)

      expect(body).toEqual([])
    })
  })
})
