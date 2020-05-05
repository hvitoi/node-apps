const sgMail = require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        from: process.env.SENDGRID_EMAIL,
        to: email,
        subject: 'Welcome to the App!',
        text: `Welcome to the app, ${name}.`
    })
}

const sendFarewellEmail = (email, name) => {
    sgMail.send({
        from: process.env.SENDGRID_EMAIL,
        to: email,
        subject: 'Your account has been deleted.',
        text: `Sad to see you go, ${name}!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendFarewellEmail
}