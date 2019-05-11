const Task = require('../models/Task')

const getAllTasks = async (_req, res) => {
  try {
    const tasks = await Task.find()

    res.json(tasks)
  } catch (e) {
    res.status(400).send(e)
  }
}

const TaskController = {
  getAllTasks
}

module.exports = TaskController
