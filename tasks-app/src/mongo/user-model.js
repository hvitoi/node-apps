const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Load Task Model
const Task = require('./task-model')

const userSchema = new mongoose.Schema({      // 'User' is saved as 'users' collection
    name: {
        type: String,
        required: true,
        trim: true          // Remove unnecessary spaces
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        validator(value){        // Validator module
            if(validator.isEmail(value)){
                throw new Error('Email is invalid.')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')){ // Check if the value has 'password' string
                throw new Error("Password cannot inclue 'password'.")
            }
        }
    },
    age:{
        type: Number,
        default: 0,
        validate(value) {       // Native validation of Mongoose
            if (value < 0) {
                throw new Error('Age must be positive number.')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer        // Binary image data
    }
}, {    // Schema options come in this second argument object
    timestamps: true
})

userSchema.virtual('tasks', {       // Setup a virtual property that fetches tasks from 'tasks' that were created by the current user 
    ref: 'Task',
    localField: '_id',      // This equivalent to a JOIN in SQL... INNER JOIN Task ON Task.owner = User._id
    foreignField: 'owner'
})














// Static method (model methods). Accessible on the model
userSchema.statics.findByCredentials = async (email, password) => {

    const loginUser = await User.findOne({ email })
    if (!loginUser) {       // If email returns no user
        throw new Error('Unable to login')
    }

    const isPasswordCorrect = await bcrypt.compare(password, loginUser.password)
    if (!isPasswordCorrect) { 
        throw new Error('Unable to login')
    }

    return loginUser
}


// Methods accessible on the instances (instance methods)
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)       // this reffers to the user instance
    
    this.tokens = this.tokens.concat({ token })
    await this.save()
    
    // Return token to the handler function
    return token
}

// Manipulate the JSON.stringify() so that it returns only the necessary properties
// userSchema.methods.toJSON = function () {
//     const userObject = this.toObject()  // Convert the user from the DB to an copy object

//     delete userObject.password
//     delete userObject.tokens


//     return userObject
//     //return this
// }


// Set user public profile
userSchema.methods.getPublicProfile = function () {
    const userObject = this.toObject()  // Convert the user from the DB to an copy object

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar


    return userObject
}








// Set middleware up to take action before 'save' the user
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8) // Encrypt the password with 8 rounds
    }    
    next()
})


// Set middleware up to take action before 'remove' the user
userSchema.pre('remove', async function (next) {
    await Task.deleteMany({ owner: this._id })
    next()
})





const User = mongoose.model('User', userSchema)

module.exports = User