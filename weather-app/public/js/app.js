// CLIENT-SIDE JAVASCRIPT


// Associate variables with screen objects
const weatherForm = document.querySelector('form')  // The "form" to be associated is the first form created in the html file
const message1 = document.querySelector('#message1')        // .class or #id
const message2 = document.querySelector('#message2')        // # to search by id

// Add a event listener for the form
weatherForm.addEventListener('submit', (e) => {   // e stands for event
          
    // Prevents the broser to default refresh after button click
    e.preventDefault(); 

    // Message of Loading
    message1.textContent = 'Loading...'
    message2.textContent = ''  

    // Fetch input data
    const address = document.querySelector('input').value

    // Make url query
    url = `/weather-api?address=${address}`

    // Similar to request/curl
    // fetch(url).then(fn)
    fetch(url).then((response) => {
        response.json().then((data) => {       // data has the parsed data
            if (data.error) {   //if there is error
                message1.textContent = data.error  
                message2.textContent = ''               
            } else {
                message1.textContent = `Location: ${data.location}.`
                message2.textContent = `Temperature: ${data.temperature}\u2103 (apparent temperature of ${data.feelslike}\u2103).`
                
            }

        })
    })
    
})







