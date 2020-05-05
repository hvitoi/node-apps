const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/mongo/user-model')
const Task = require('../../src/mongo/task-model')

// Setup init users
userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Henrique',
    email: 'henrique@mail.com',
    password:'myawesomepass',
    tokens: [{
        token: jwt.sign({ _id:userOneId }, process.env.JWT_SECRET)
    }]
}

userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Jurema',
    email: 'jurema@mail.com',
    password:'myawesomepass',
    tokens: [{
        token: jwt.sign({ _id:userTwoId }, process.env.JWT_SECRET)
    }]
}


// Setup init tasks
const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    owner: userOne._id
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOne._id
}
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    owner: userTwo._id
}










const setupDatabase = async () => {
    await User.deleteMany()             // Wipe all the 'users' collection
    await Task.deleteMany()

    await new User(userOne).save()      // Create use one for testing purposes
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

const closeConnection = async () => {
    await mongoose.connection.close()
}

module.exports = {
    userOne,
    userOne,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase,
    closeConnection
}