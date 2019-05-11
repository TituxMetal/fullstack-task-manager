const mongoose = require('mongoose')

const Task = require('../server/models/Task')
const { mongoUri, mongoOptions } = require('../server/config')

const taskOneId = new mongoose.Types.ObjectId()
const taskOne = {
  _id: taskOneId,
  description: 'Task One',
  completed: false
}

const taskTwoId = new mongoose.Types.ObjectId()
const taskTwo = {
  _id: taskTwoId,
  description: 'Task Two',
  completed: false
}

const fakeId = new mongoose.Types.ObjectId()

const setupDatabase = async () => {
  try {
    await mongoose.connect(mongoUri, mongoOptions)
    await Task.deleteMany()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
  } catch (err) {
    console.error(err)
  }
}

const cleanupDatabase = async () => {
  try {
    await mongoose.disconnect()
  } catch (err) {
    console.error(err)
  }
}

module.exports = {
  taskOneId,
  taskTwoId,
  taskOne,
  taskTwo,
  fakeId,
  setupDatabase,
  cleanupDatabase
}
