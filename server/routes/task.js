const router = require('express').Router()

const TaskController = require('../controllers/task')
const { add } = require('../validation')
const validateBody = require('../middlewares/validateBody')

router.get('/', TaskController.getAllTasks)

router.post('/', validateBody(add), TaskController.addTask)

router.delete('/:id', TaskController.removeTask)

module.exports = router
