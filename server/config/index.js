module.exports = {
  isProd: process.env.NODE_ENV === 'production' || false,
  port: process.env.PORT || 3000,
  mongoOptions: { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false },
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017'
}
