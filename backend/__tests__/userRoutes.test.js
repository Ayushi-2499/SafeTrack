const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); // Import your main server file.

const User = require('../models/userModel');

let mongoServer;

// Before all tests start, create a new in-memory (mock) database.
// This does not even touch your real Atlas database.
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}, 60000); // 60-second timeout so the setup can complete smoothly.
// After all tests are finished, close and delete this mock database.
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
}, 60000);

// After each test, clear the users inside this mock database.
afterEach(async () => {
  //await User.deleteMany({});
});


// === Test Suite for the User API. ===
describe('User API - /api/users', () => {

  // Test Case 1: Register a new user with valid details.
  it('should register a new user successfully with correct data', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData);

    // Check whether the result is correct or not
    expect(response.statusCode).toBe(201); // Status code 201 (Created) should be returned
    expect(response.body).toHaveProperty('token'); // Response should contain a token
    expect(response.body.name).toBe('Test User');
  });

  // === THIS IS A NEW TEST CASE ===
  // Test Case 2: An error should occur if trying to register again with the same email
  it('should fail to register a user with an existing email', async () => {
    // First create a user
    const initialUserData = {
      name: 'First User',
      email: 'duplicate@example.com',
      password: 'password123',
    };
    await request(app).post('/api/users').send(initialUserData);

    // Now try to register again with the same email
    const duplicateUserData = {
        name: 'Second User',
        email: 'duplicate@example.com',
        password: 'password456',
    };
    const response = await request(app)
      .post('/api/users')
      .send(duplicateUserData);

    // Check whether an error occurred or not
    expect(response.statusCode).toBe(400); // Status code 400 (Bad Request) should be returned
    expect(response.body.message).toBe('User already exists'); // Error message should be correct
  });

  // === THIS IS ALSO A NEW TEST CASE ===
  // Test Case 3: An error should occur if registering without a password
  it('should fail to register a user with missing password', async () => {
    const incompleteUserData = {
      name: 'Incomplete User',
      email: 'incomplete@example.com',
    };

    const response = await request(app)
      .post('/api/users')
      .send(incompleteUserData);

    // Check whether an error occurred or not
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Please include all fields');
  });

});