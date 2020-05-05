const app = require('./app')

// Listen on development port defined
app.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}.`);
})