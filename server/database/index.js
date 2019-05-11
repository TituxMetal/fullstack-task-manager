const mongoose = require('mongoose')

const { mongoUri, mongoOptions, isProd } = require('../config')

module.exports = async () => {
  try {
    await mongoose.connect(mongoUri, mongoOptions)
    !isProd && console.log(`Mongodb connected at ${mongoUri}`)
  } catch (err) {
    console.error(err)
  }
}
