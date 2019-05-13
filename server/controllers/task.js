const Task = require('../models/Task')

const getAllTasks = async (_req, res) => {
  try {
    const tasks = await Task.find()

    res.json(tasks)
  } catch (e) {
    res.status(400).send(e)
  }
}

const addTask = async ({ value }, res) => {
  try {
    const foundTask = await Task.find({ description: value.body.description }).countDocuments()

    if (foundTask) {
      const error = JSON.stringify({ errors: { description: 'Task already exists' } })
      throw new Error(error)
    }

    const task = new Task({ ...value.body })
    await task.save()

    res.status(201).json(task)
  } catch (e) {
    res.status(400).send(e.message)
  }
}

const TaskController = {
  getAllTasks,
  addTask
}

module.exports = TaskController
