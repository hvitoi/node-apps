const multer = require('multer')

const uploadAvatar = multer({     // This is the multer middleware
    //dest: 'avatars',    // Destination folder. If property is removed, multer passes to data to the next function through 'req.file.buffer'
    limits: {
        fileSize: 1000000
    },
    fileFilter (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { 
            return cb(new Error('Please upload a valid image'))
        }
        cb(undefined, true) 
    }

})

module.exports = uploadAvatar