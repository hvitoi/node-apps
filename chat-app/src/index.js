import http from 'http'
import express from 'express'
import socketio from 'socket.io'
import Filter from 'bad-words'


// Setup application
const app = express()
const server = http.createServer(app)   // Create server        // Normally this function is called automatically by express on app.listen()
const io = socketio(server)             // Create websockets    // Upon calling socketio() the client has access to the /socket.io/socket.io.js file

// Setup static directory to listen
app.use(express.static('public'))









// io connections are established upon calling io() on the client-side
io.on('connection', (socket) => {       // socket object contains information about the client
    console.log('New web socket connection.')
    socket.emit('welcomeMessage')

    // Emit event to everybody but the socket
    socket.broadcast.emit('message', 'A new user has joined.')



    // Event listeners
    socket.on('sendMessage', (message, callback) => {

        // Check message profanity
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity not allowed.')
        } else {
            io.emit('message', message)
            return callback('Message delivered.')
        }
    })

    

    socket.on('sendLocation', (coords, callback) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback('Location shared.')
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left.')
    })




})













// Listen port
server.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}.`)
})