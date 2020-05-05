const request = require('supertest')
const app = require('../src/app')
const { userOne, setupDatabase, closeConnection } = require('./fixtures/db')
const User = require('../src/mongo/user-model')

// Runs before each test
beforeEach(setupDatabase)

// Runs after all the tests
afterAll(closeConnection)









// SIGN UP
test('Sign up a new user', async () => {
    const res = await request(app)
        .post('/users')
        .send({
            name: 'Henrique',
            email: 'henrique@gmail.com',
            password: 'myawesomepass'
        })
        .expect(201)
        
    // Assertion that the user was saved correctly
    const user = await User.findById(res.body.user._id)
    expect(user).not.toBeNull()

    // Assertion about the response data
    // expect(res.body).toMatchObject({
    //     name: 'Henrique',
    //     email: 'henrique@mail.com'
    // })
    expect(user.passwuord).not.toBe('myawesomepass')
})

test('Sign up an existing user', async () => {
    await request(app)
        .post('/users')
        .send(userOne)
        .expect(400)
})

// LOGIN
test('Login an existing user', async () => {
    const res =await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)
    
    // Check if user exists in the db
    user = await User.findById(res.body.user._id)
    
    // Check if the new token was saved to the db
    expect(user.tokens[1].token).toBe(res.body.token)
})

test('Login an nonexistent user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'nonexistent@mail.com',
            password: 'nonexistent'
        })
        .expect(400)
})


// READ USER PROFILE
test('Read a valid user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Read an unanthenticated user profile', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})


// DELETE USER PROFILE
test('Delete a user profile', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user).toBeNull()

})

test('Delete a user profile without authentication', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})


// UPLOAD IMAGE
test('Upload image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    
    const user = await User.findById(userOne._id)
    //expect({}).toBe({})     // It is a tripe equality ===       Code will fail
    expect(user.avatar).toEqual(expect.any(Buffer))     // If the avatar is any kind of Buffer
})


// USER UPDATE
test('Update user', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Jurema'
        })
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user.name).toBe('Jurema')

})

test('Update invalid field in user ', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            _id: '1'
        })
        .expect(400)
})
