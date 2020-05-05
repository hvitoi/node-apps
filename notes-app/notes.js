const fs = require('fs')
const chalk = require('chalk')

const loadNotes = () => {
    try{        // Error handling in case notes.json doesn't exist
        const dataBuffer = fs.readFileSync('notes.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)     // The parsed data is an array of objects!
    } catch (e) {
        return []   // Returns an empty array in case the file doesn't exist
    }
}

const addNote = (title, body) => {
    // Load the existing notes in the file
    const notes = loadNotes()

    // Search duplicate title in notes
    const duplicateNote = notes.find((note) => note.title === title)    // Returns the searched array

    if (!duplicateNote) {
        // Pushes a new object item to the array
        notes.push({            
            title: title,
            body: body
        })

        // Save
        saveNotes(notes)

        // Message to user
        console.log(chalk.green.inverse('Note added'))
        
    } else {
        console.log(chalk.red.inverse('Duplicate title'))
    }

}

const saveNotes = (notes) => {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('notes.json', dataJSON)
}

const removeNote = (title) => {
    const notes = loadNotes()

    // Check which title matches
    const notesToKeep = notes.filter((note) => note.title !== title)
    
    if(notes.length > notesToKeep.length) {
        // Save the filtered array
        saveNotes(notesToKeep)

        // Message to user
        console.log(chalk.green.inverse('Note removed.'));
    } else {
        // Message to user
        console.log(chalk.red.inverse('No note found.'));
    }

}

const listNotes = () => {
    const notes = loadNotes()

    console.log(chalk.inverse(`Your notes`));
    

    notes.forEach( (note) => {
        console.log(`Note "${note.title}"`)
        console.log(`Body: ${note.body}`)
        console.log(``);
    })
    

}

const readNote = (title) => {
    const notes = loadNotes()

    // Find the note
    const note = notes.find((note) => note.title === title)

    if (note) {
        console.log(chalk.inverse(`Note "${note.title}"`))
        console.log(`Body: ${note.body}`)
    } else {
        console.log(chalk.red.inverse(`Note not found`));
    }
}













// Export a single function
//module.exports = getNotes

// Export multiple functions
module.exports = {
    readNote: readNote,       //Property and value(function)
    addNote: addNote,
    removeNote: removeNote,
    listNotes: listNotes
}