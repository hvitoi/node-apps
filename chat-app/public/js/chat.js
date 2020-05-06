// Establish connection with the server
const socket = io()

// Define variables for HTML elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')       // Messages div
const $sidebar = document.querySelector('#sidebar')     // Sidebar div


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML   // Text inside of the tag
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true})   // location.search contains the query string

// Autoscrolling
const autoscroll = () => {

    // New message element
    const $newMessage = $messages.lastElementChild
  
    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)  // Get CSS information about the element
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height of messages (div)
    const visibleHeight = $messages.offsetHeight    // Height of the messages div that the user can see. It's unchangeable

    // Height the container of messages (div)
    const containerHeight = $messages.scrollHeight      // The whole height user is able to scroll through

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight       // How far user has scrolled from the top

    if (containerHeight - newMessageHeight <= scrollOffset) {   // The reason newMessageHeight is subtrated is because the code is run after the new message is received, therefore user would never be at the 'bottom'
        $messages.scrollTop = $messages.scrollHeight    // This would be the only necessary line if we didn't want to not scroll on new message when user is not at the bottom
    }

   

}






// Emite 'join' event
socket.emit('join', { username, room }, (ackn) => {
  
    
    if(ackn) {      // if there is response with error
        alert(ackn)
        location.href = '/'     // location.href redirects user to the home page
    }
})




socket.on('textMessage', (message) => {
    const html = Mustache.render(messageTemplate, {     // Render new template with the new message
        text: message.text,
        username: message.username,
        createdAt: moment(message.createdAt).format('hh:mm:ss a')     // Format the date
    })   
    $messages.insertAdjacentHTML('beforeend', html) // Display template inside of div element
    autoscroll()
})

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationTemplate, {    // Render new template with the new message
        locationUrl: message.locationUrl,
        username: message.username,
        createdAt: moment(message.createdAt).format('hh:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend', html) // Display template inside of div element
    autoscroll()
})

socket.on('roomData', (roomData) => {
    const html = Mustache.render(sidebarTemplate, {
        room: roomData.room,
        users: roomData.users
    })

    // Update the whole sidebar content
    $sidebar.innerHTML = html
    
})







// Element events

$messageForm.addEventListener('submit', (e) => {    // e stands for 'event'

    // Prevent full page refresh
    e.preventDefault()    
    
    // Grab the message form input
    const msg = e.target.elements.msg.value   //msg = $messageFormInput.value

    // Disable form button
    $messageFormButton.setAttribute('disabled', 'disabled') // setAtribute(name, value)

    // Clear the input
    $messageFormInput.value = ''

    // Focus the input element
    $messageFormInput.focus()

    // Emit an event to the server
    socket.emit('sendTextMessage', msg, (ackn) => {     // socket.emit.(name,data,callback())
        $messageFormButton.removeAttribute('disabled')  // Reenable the button after the ackn is received
        //console.log(ackn)    // Print on console if message was successfully sent
    })     

})

$sendLocationButton.addEventListener('click', () => {

    // Check if geolocation is supported
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    // Disable the button
    $sendLocationButton.setAttribute('disabled', 'disabled')

    // getCurrentPosition() currently does not support Promise api
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (ackn) => {
            $sendLocationButton.removeAttribute('disabled') // Reenable the button
            //console.log(ackn)     // Print on console if location was successfully shared
        })   
    })
})


