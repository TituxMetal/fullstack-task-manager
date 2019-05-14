const request = require('supertest')

const server = require('../server/app')
const Task = require('../server/models/Task')
const {
  taskOne,
  taskOneId,
  taskTwo,
  taskTwoId,
  fakeId,
  setupDatabase,
  cleanupDatabase
} = require('./setup')

describe('Tasks Routes', () => {
  const testTask = { description: 'Testing', completed: false }

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

  describe('POST /api/tasks => Create task', () => {
    it('should create and return a new task', async () => {
      const { body } = await request(server)
        .post('/api/tasks')
        .send(testTask)
        .expect(201)

      expect(body._id).toBeDefined()

      const { description, completed } = testTask
      expect(body).toMatchObject({ description, completed })
    })

    it('should not create task if the same task description already exists', async () => {
      const { description, completed } = taskOne
      const { error } = await request(server)
        .post('/api/tasks')
        .send({ description, completed })
        .expect(400)

      expect(await Task.find().countDocuments()).toBe(2)
      expect(JSON.parse(error.text).errors.description).toBeDefined()
    })

    it('should not create task if invalid data given', async () => {
      const { error } = await request(server)
        .post('/api/tasks')
        .send({ description: '   abc   ', completed: 'falsy' })
        .expect(400)

      expect(await Task.find().countDocuments()).toBe(2)
      expect(JSON.parse(error.text).errors.description).toBeDefined()
      expect(JSON.parse(error.text).errors.completed).toBeDefined()
    })
  })

  describe('DELETE /api/tasks/:id => Delete task', () => {
    it('should delete a task', async () => {
      const { body } = await request(server)
        .delete(`/api/tasks/${taskOneId}`)
        .expect(200)

      expect(await Task.find().countDocuments()).toBe(1)
      expect(await Task.findOne({ _id: taskOneId })).toBe(null)
      expect(body._id).toBe(taskOneId.toString())
    })

    it('should return an empty object if no task found', async () => {
      const { body } = request(server)
        .delete(`/api/tasks/${fakeId}`)
        .expect(200)

      expect(await Task.find().countDocuments()).toBe(2)
      expect(await Task.findOne({ _id: fakeId })).toBe(null)
    })
  })
})
