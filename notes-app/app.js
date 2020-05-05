// Import external modules
const chalk = require('chalk')
const yargs = require ('yargs')

// Import external objects with functions
const notes = require('./notes.js')     // Import an object

// --------------------

// ARGUMENT VECTOR (ARGV)
//const process = require ('process')
//console.log(process.argv)

// ARGV with Yargs

// Change the version of the project
yargs.version('2.1.0')

// --------------------

// ADD command
yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,          // The title argument has to be provided
            type: 'string'              // Always expect a string
        },
        body: {
            describe: 'Note body',
            demandOption: true,          // The title argument has to be provided
            type: 'string'              // Always expect a string
        }
    },
    handler (argv) {
        notes.addNote(argv.title, argv.body)
    }
})

// REMOVE command
yargs.command({
    command: 'remove',
    describe: 'Remove a note',
    builder: {
        title: {
            describe: 'Title of note to be removed',
            demandOption: true,    
            type: 'string'             
        }
    },
    handler (argv) {
        notes.removeNote(argv.title)
    }
        
})

// READ command
yargs.command({
    command: 'read',
    describe: 'Read the note',
    builder: {
        title: {
            describe: 'Title of the note to be read',
            demandOption: true,
            type: 'string'
        }
    },
    handler (argv) {
        notes.readNote(argv.title)
    }
})

// LIST command
yargs.command({
    command: 'list',
    describe: 'List out all notes',
    handler () {
        notes.listNotes()
    }
})


// Parse the argv
yargs.parse()