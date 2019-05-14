const router = require('express').Router()

const TaskController = require('../controllers/task')
const { add, edit } = require('../validation')
const validateBody = require('../middlewares/validateBody')

router.get('/', TaskController.getAllTasks)

router.post('/', validateBody(add), TaskController.addTask)

router.patch('/:id', validateBody(edit), TaskController.updateTask)

router.delete('/:id', TaskController.removeTask)

module.exports = router
