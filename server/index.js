require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const sequelize = require('./db')
const models = require('./models/models')
const router = require('./routes')
const errorHandler = require('./middleware/ErrorHandllingMiddleware')
const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(fileUpload({}))
app.use(express.static(path.join(__dirname, 'static')))
app.use('/api', router)
app.use(errorHandler)

app.get('/', (req, res) => {
  res.status(200).json({ message: 'WORKING !!!' })
})

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}

start()
