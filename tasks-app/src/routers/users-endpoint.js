// Packages
const express = require('express')
const sharp = require('sharp')

// Models
const User = require('../mongo/user-model')  

// DB connections
require('../mongo/connection')   

// Middlewares
const auth = require('../middlewares/auth')      
const uploadAvatar = require('../middlewares/upload')   
const { sendWelcomeEmail, sendFarewellEmail } = require('../emails/account') 






// Create route (not yet registered)
const router = new express.Router()

// Sign up user
router.post('/users', async (req, res) => {  // async instead of returning a value, will return a promise. But this function doesn't return anything at all 
    // const user = new User(req.body)
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((err) => {
    //     res.status(400).send()
    // })

    // Create new instance of "User" model
    const newUser = new User(req.body)
    
    try {
        // Save instance as a document in the DB
        await newUser.save()

        // Email user on account creation
        //sendWelcomeEmail(newUser.email, newUser.name)

        // Generate a token for the new user
        const token = await newUser.generateAuthToken()

        // Send back the user created and the token
        res.status(201).send({ user: newUser.getPublicProfile(), token: token})
    } catch (err) {
        res.status(400).send(err)
    }
})

// Login user 
router.post('/users/login', async (req, res) =>{
    try {
        // Find the login user
        const loginUser = await User.findByCredentials(req.body.email, req.body.password)
        
        // Generate the token for the login user
        const token = await loginUser.generateAuthToken()

        res.send({user: loginUser.getPublicProfile(), token: token})

    } catch (err) {
        res.status(400).send()
    }
})

// Logout user (current session)
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {   // Deletes the values returning TRUE
            return token.token !== req.token       // token.token is the token in the DB. user.token is the current token used
        })

        // Save the user with the deleted current token
        await req.user.save()

        res.send()

    } catch (err) {
        res.status(500).send()
    }
})

// Logout user (all sessions)
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        // Delete all tokens in the current user
        req.user.tokens = []       

        // Save the user with the deleted current token
        await req.user.save()

        res.send()

    } catch (err) {
        res.status(500).send()
    }
})












// Access one's profile
router.get('/users/me', auth, async (req, res) => {       // auth is called as middleware in the second parameter
    res.send(req.user.getPublicProfile())
})


// Update one's profile
router.patch('/users/me', auth, async (req, res) => {
    // Transforms object into an array of it's properties
    const updateKeys = Object.keys(req.body)
    const allowedUpdateKeys = ['name', 'email', 'password', 'age']
    const isValidUpdate = updateKeys.every((updateKey) => allowedUpdateKeys.includes(updateKey)) // every(callback(each)) tests whether all elements in the array pass the test implemented by the provided function.

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid updates.'})   // Normally invalid update keys would just be ignored by the database
    }
    
    try {
        const updatedUser = req.user
        updateKeys.forEach((updateKey) => updatedUser[updateKey] = req.body[updateKey])    // updatedUser.name = x, updatedUser.age = x ...
        await updatedUser.save()    // save method must be called in order to execute the middleware
        // const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true}) // findByIdAndUpdate(id,updates,options) // FindByIdAndUpdate bypasses all the middlewares in the user model
        res.send(updatedUser.getPublicProfile())
    } catch (err) {
        res.status(400).send()
    }
})

// Delete one's profile
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const deletedUser = await User.findByIdAndDelete(req.user._id)       // Alternative removal
        const deletedUser = req.user
        await deletedUser.remove()

        // Email user on account removal
        //sendFarewellEmail(deletedUser.email, deletedUser.name)

        res.send(deletedUser.getPublicProfile())
    } catch (err) {
        res.status(500).send()
    }
})









// Upload profile picture
router.post('/users/me/avatar', auth, uploadAvatar.single('avatar'), async (req, res) => {
    
    const imageBuffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()   // Convert the image apropriately

    req.user.avatar = imageBuffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// Remove profile picture
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined     // Remove the avatar field
    await req.user.save()
    res.send()
})

// Fetch profile picture
router.get('/users/me/avatar', auth, async (req,res) => {
    try {
        if (!req.user.avatar) {
            throw new Error()
        }

        // Set a response pattern. By default: res.set('Content-Type','application/json')
        res.set('Content-Type','image/png')
        res.send(req.user.avatar)

    } catch (err) {
        res.status(404).send()
    }
})





module.exports = router