const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateTextMessage, generateLocationMessage } = require('./utils/messages.js')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users.js')


// Setup application
const app = express()
const server = http.createServer(app)   // Create server        // Normally this function is called automatically by express on app.listen()
const io = socketio(server)             // Create websockets    // Upon calling socketio() the client has access to the /socket.io/socket.io.js file

// Setup static directory to listen
app.use(express.static('public'))













// io connections are established upon calling io() on the client-side
io.on('connection', (socket) => {       // socket object contains information about the client


    socket.on('join', (options, callback) => { 

        const { error, user } = addUser({ // Either 'error' or 'user' variable will be provided
            id: socket.id, // socket.io is the unique identifier for the connection
            ...options
        }) 
        
        if (error) {
            return callback(error)  // Callback with error if there is any on creating user
        }

        socket.join(user.room)       // The join() function is only available on the server side. It creates an instance (room) for the socket to join
        socket.emit('textMessage', generateTextMessage('Admin', 'Welcome to the chat!')) // Welcoming message
        socket.broadcast.to(user.room).emit('textMessage', generateTextMessage('Admin', `${user.username} has joined the room.`))  // Message to everybody but the socket
        
        // Send updated list of users
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        // Log in the server console
        console.log(`User '${user.username}' has joined the room '${user.room}'.`)
    
        callback()  // Callback with no error
    })

    socket.on('sendTextMessage', (message, callback) => {
        const user = getUser(socket.id)

        // Check message profanity
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity not allowed.')
        }

        // Emit message to all in the room
        io.to(user.room).emit('textMessage', generateTextMessage(user.username, message))
        callback('Message delivered.')

    })


    socket.on('sendLocationMessage', (coords, callback) => {
        const user = getUser(socket.id)
        const url = `https://google.com/maps?q=${coords.latitude},${coords.longitude}`

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, url))
        callback('Location shared.')
    })



    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) { // Only if there was a user to be disconnected (user was in a room)
            io.to(user.room).emit('textMessage', generateTextMessage('Admin',`${user.username} has left.`))
        
            // Send updated list of users
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

        
    })


})













// Listen port
const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})



// socket.emit(name, message, ack)                          Message to the socket
// socket.broadcast.emit(name, message, ack)                Message to everybody but the socket
// socket.broadcast.to(room).emit(name, message, ack)       Message to everybody in a room but the socket
// socket.join(room)                                        Socket joins a room

// io.emit(name, message, ack)                              Message to everybody
// io.to(room).emit(name, message, ack)                     Message to everybody in a room
