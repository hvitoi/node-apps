const express = require('express')

const geocode = require('../utils/geocode')
const forecast = require('../utils/forecast')

// Router created, but not yet registered
const router = new express.Router()

// Configuring routes
router.get('/weather-api', (req, res) => {   

    if (!req.query.address) {       // if no address is provided
        return res.send({           // return breaks the function
            error: 'No address provided.'
        })
    }

    geocode(req.query.address, (error, geocodeData) => {
        if (error) {            // If geocode returns error  
            return res.send({
                error: error
            })
        }

        forecast( {latitude: geocodeData.latitude, longitude: geocodeData.longitude}, (error, forecastData) => {
            if (error) {        // If forecast returns error 
                return res.send({
                    error: error
                })
            }
            return res.send({           // IF EVERYTHING SUCCEED...
                location: geocodeData.location,
                temperature: forecastData.temperature,
                feelslike: forecastData.feelslike
            }) 
        })
        
    })

    
})


module.exports = router