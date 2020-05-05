// Express module
const express = require('express')

// Task model
const Task = require('../mongo/task-model')  

// Connection to DB
require('../mongo/connection')   

// Authentication middleware
const auth = require('../middlewares/auth')   







// Create route (not yet registered)
const router = new express.Router()

// Create task
router.post('/tasks', auth, async (req, res) => {
    const newTask = new Task({
        ...req.body,     // Copy all the properties from req.body over this new object
        owner: req.user._id
    })

    try {
        await newTask.save()
        res.status(201).send(newTask)
    } catch (err) {
        res.status(400).send(err)
    }
})

// List tasks
// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortby=createdAt_desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'    // Saves the boolean 'true' and not string 'true'
    }

    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split('_')

        // Create a property named 'createdAt', for example, with value -1 (desc) or 1 (asc)
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1   // Ternary operator 

    }


    try{
        //const tasksList = await Task.find({ owner: req.user._id })        // Alternative
        //await req.user.populate('tasks').execPopulate() // Populate the 'tasks' virtual property of the user instance
        await req.user.populate({
            path: 'tasks',
            match,       // Set matching values filter
            options: {  
                limit: parseInt(req.query.limit),    // Pagination. Limits the results per page
                skip: parseInt(req.query.skip),       // Skip n pages
                sort   // Ascending: 1     // Descending: -1
            }
        }).execPopulate() // Populate the 'tasks' virtual property of the user instance
        
        res.send(req.user.tasks)
    } catch (err) {
        res.status(500).send()
    }
})

// Find task by ID
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const foundTask = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!foundTask) {
            return res.status(404).send()       // If no ID is found
        }
        res.send(foundTask)
    } catch (err) {
        res.status(500).send()
    }
})

// Update task by ID
router.patch('/tasks/:id', auth, async (req, res) => {
    const updateKeys = Object.keys(req.body)
    const allowedUpdateKeys = ['completed', 'description']
    const isValidUpdate = updateKeys.every((updateKey) => allowedUpdateKeys.includes(updateKey))

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid updates.'})
    }
    
    try {
        const updatedTask = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!updatedTask) {     // If no task id for the user is found
            return res.status(404).send()
        }

        updateKeys.forEach((updateKey) => updatedTask[updateKey] = req.body[updateKey])
        await updatedTask.save()
        res.send(updatedTask)

    } catch (err) {
        res.status(400).send()
    }
})

// Delete task by ID
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const deletedTask = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        
        if (!deletedTask) {     // If no task id for the user is found
            return res.status(404).send()
        }

        // Delete the task
        await deletedTask.remove()
        res.send(deletedTask)

    } catch (err) {
        res.status(500).send()
    }
})

module.exports = router