// Modules
const path = require('path')
const express = require('express') // Express exposes just a single function

// Run the application
const app = express()

// Automatically parse incoming json
app.use(express.json())

// Import routers from external files
app.use(require('./routers/users-endpoint'))
app.use(require('./routers/tasks-endpoint'))

module.exports = app