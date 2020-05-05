const mongoose = require('mongoose')

// Connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,    // Create index to datas
    useUnifiedTopology: true,
    useFindAndModify: false
})