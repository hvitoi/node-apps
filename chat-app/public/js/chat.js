// Establish connection with the server
const socket = io()

// Define variables for HTML elements
const messageForm = document.querySelector('#message-form')
const sendLocation = document.querySelector('#send-location')



// Event listeners
socket.on('welcomeMessage', () => {
    console.log('Wecome to the chat!')
})

socket.on('message', (message) => {
    console.log(message)
})









messageForm.addEventListener('submit', (e) => {    // e stands for 'event'

    // Prevent full page refresh
    e.preventDefault()    

    // Emit an event to the server
    message = e.target.elements.message.value
    socket.emit('sendMessage', message, (ackn) => {     // socket.emit.(name,data,callback())
        console.log(ackn)
    })     

})

sendLocation.addEventListener('click', () => {

    // Check if geolocation is supported
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    // getCurrentPosition() currently does not support Promise api
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (ackn) => {
            console.log(ackn)
        })   
    })
})