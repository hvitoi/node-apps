const generateTextMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username, url) => {
    return {
        username,
        locationUrl: url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateTextMessage,
    generateLocationMessage
}