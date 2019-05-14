const Joi = require('@hapi/joi')

const description = Joi.string()
  .min(4)
  .label('Description field')
  .trim()
const completed = Joi.boolean()

const taskSchema = {
  add: Joi.object().keys({ description: description.required(), completed }),
  edit: Joi.object().keys({ description, completed })
}

module.exports = taskSchema
