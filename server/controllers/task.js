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

const updateTask = async ({ params, value }, res) => {
  const { description, completed } = value.body

  try {
    const task = await Task.findOne({ _id: params.id })

    if (!task) {
      const error = JSON.stringify({ errors: 'No task found' })
      throw new Error(error)
    }

    const foundTask = await Task.find({ description }).countDocuments()

    if (foundTask) {
      const error = JSON.stringify({ errors: { description: 'Task already exists' } })
      throw new Error(error)
    }

    task.description = description || task.description
    task.completed = description ? false : completed || !task.completed

    const updatedTask = await task.save()

    res.json(updatedTask)
  } catch (e) {
    res.status(400).send(e.message)
  }
}

const removeTask = async ({ params }, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: params.id })

    res.json(task)
  } catch (e) {
    res.status(400).send(e.message)
  }
}

const TaskController = {
  getAllTasks,
  addTask,
  updateTask,
  removeTask
}

module.exports = TaskController
