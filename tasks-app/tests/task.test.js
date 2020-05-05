const request = require('supertest')
const app = require('../src/app')
const { userOne, userTwo, taskOne, taskTwo, taskThree, setupDatabase, closeConnection } = require('./fixtures/db')
const Task = require('../src/mongo/task-model')

// Runs before each test
beforeEach(setupDatabase)

// Runs after all the tests
afterAll(closeConnection)





// Create task
test('Create task', async () => {
    const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Wipe the floor'
        })
        .expect(201)
    
    const task = await Task.findById(res.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)

})

// List all tasks
test('List tasks', async () => {
    const res = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    expect(res.body.length).toEqual(2)      // UserOne has 2 tasks

})

// Block deleting users tasks
test('Block deleting other users tasks', async () => {
    const res = await request(app)
        .delete(`/tasks/${taskThree._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(404)

    task = Task.findById(taskThree._id)
    expect(task).not.toBeNull()      // UserOne has 2 tasks

})