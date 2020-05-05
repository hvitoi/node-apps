const geocode = require('./geocode')
const forecast = require('./forecast')
const process = require ('process')

// --------------------

const city = process.argv[2]
// Calls geocode function
if (city) {
    // the callback function has destructured the geoData into: lat, lon, loc
    // the "= {}" expression is the default value in case {lat, lon, loc} is not provided (undefined).
    // TypeError: Cannot destructure property 'latitude' of 'undefined' as it is undefined.
    geocode(city, (error, {latitude, longitude, location} = {}) => {  // Takes the city from the argv
        if (error) {
            return console.log(error);  // Code below the return statement is not executed
        }

        // Calls forecast function
        // Also destruct the forecastData object into two variables (temperature and feelslike)
        forecast(latitude, longitude, (error, {temperature, feelslike}) => {  // takes the lat and lon from the geocode fn
            
            if (error) {
                return console.log(error)
            }
            console.log(`Localization: ${location}`);
            console.log(`Temperature: ${temperature}. Sensation: ${feelslike}`)
        })
        
    })
} else {
    console.log('Please provide a city as argument.');
}