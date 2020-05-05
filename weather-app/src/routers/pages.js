// Express module
const express = require('express')

// Create route (not yet registered)
const router = new express.Router()


// --------------------
// Setup other routers (First router is the public folder)
router.get('/', (req, res) => {
    res.render('index.hbs', {       // Render the views. res.render(file, properties)
        title: 'Home Page',
        name: 'Henrique Vitoi'
    })          
})

router.get('/about', (req, res) => {
    res.render('about.hbs', {      
        title: 'About Me',
        name: 'Henrique Vitoi'
    })          
})

router.get('/help', (req, res) => {
    res.render('help.hbs', {     
        title: 'Help Page',
        name: 'Henrique Vitoi'
    })          
})

router.get('/weather', (req, res) => {
    res.render('weather.hbs', {
        title: 'Weather App',
        name: 'Henrique Vitoi'
    })        
})

// Route for not matched URLs
router.get('*', (req, res) => {
    res.render('404.hbs', {
        title: '404',
        name: 'Henrique Vitoi'
    })          
})


module.exports = router