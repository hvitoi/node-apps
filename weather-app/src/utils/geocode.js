const request = require('postman-request')


// Get geocode from mapbox API
const geocode = (address, callback) => {
    // encodeURIComponent() transforms the string to HTML compatible (%20 for space)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiaGVucmkyMiIsImEiOiJjazlkam5hcDQwNGV5M2VtbDg3ZzY0aWg5In0.1GN1GJ0CYSqD9TDo7qginA&limit=1`
    
    // API: request({url: url}, callback(error, response))
    // json=true automatically parse the json file
    // The big response object is destructued into only the body object
    request({ url: url, json: true}, (error, response) => {   
        if (error) {    // if there is an error
            callback('Unable to connect to the API', undefined) // undefined for the data part
        } else if (response.body.features.length === 0) {   // If the features property is empty. That means no results found
            callback('Unable to find location provided', undefined)
        } else {
            // Provide the lon and lat as data
            callback(undefined, {
                latitude: response.body.features[0].center[1],
                longitude: response.body.features[0].center[0],
                location: response.body.features[0].place_name
            })
        }
    })
}

module.exports = geocode