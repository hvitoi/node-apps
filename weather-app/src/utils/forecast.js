const request = require('postman-request')


// Get geocode from mapbox API
const forecast = (coordinates, callback) => {   // Using object destructuring to break lat and lon from the geoData object

    const url = `http://api.weatherstack.com/current?access_key=6693daf76bb7789a5f54d89d22326243&query=${coordinates.latitude},${coordinates.longitude}`

    // The big response object is destructued into only the body object
    request({ url: url, json: true}, (error, response) => {
        if (error) {
            callback('Unable to connect to the API', undefined)
        } else if (response.body.error) {   // If there is an error property
            callback('Unable to find location provided', undefined)
        } else {
            // Provide the lon and lat as data
            callback(undefined, {
                temperature: response.body.current.temperature,
                feelslike: response.body.current.feelslike
            })
        }
    })
}

module.exports = forecast