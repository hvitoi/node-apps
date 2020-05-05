const jwt = require('jsonwebtoken')
const User = require('../mongo/user-model')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')       // Returns the 'Authorization' key inside of the header and remove the 'Bearer ' part
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)        // Verify the token with the signature and decode it
        
        // Find user with the ID provided and that has the matching token in its 'tokens'
        const user = await User.findOne({ _id: decodedToken._id, 'tokens.token': token})    
        
        if (!user) {    // If no user with the token is found
            throw new Error()
        }

        // Returns to the handler the token
        req.token = token

        // Returns to the handler the user, so that the handler doesn't need to fetch it again
        req.user = user

        // Exit the middleware and run router handler
        next()

    } catch (err) {     // If not authenticated correctly
        res.status(401).send({ error: 'Authentication failed.'})
    }
    
}

module.exports = auth