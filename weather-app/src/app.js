// Modules
const path = require('path')
const express = require('express') // Express exposes just a single function
const hbs = require('hbs')

// Run the application
const app = express()

// Declare paths
const publicDir= path.join(__dirname, '../public')   // Manipulation of the directory with path module. __dirname and __filename
const viewsDir= path.join(__dirname, '../templates/views')  // Default dir is /views
const partialsDir= path.join(__dirname, '../templates/partials') 

// Setup default paths   
app.set('view engine', 'hbs')       //  app.set(set-name, value)
app.set('views', viewsDir)          // Change views dir location
hbs.registerPartials(partialsDir)   // Setup where partials live

// Setup static directory to serve
app.use(express.static(publicDir)) // The public directory is accessible to the user! If no argument is provided, the page is redirected to index.html

// Automatically parse incoming json
app.use(express.json())

// Import routers from external files
app.use(require('./routers/endpoint'))
app.use(require('./routers/pages'))


// Listen on development port defined
port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
})