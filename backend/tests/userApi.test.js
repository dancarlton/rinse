import mongoose from 'mongoose';
import supertest from 'supertest';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import sampleUsers from '../seeds/users.js';
import { User } from '../models/userModel.js';
import { app } from '../server';

const api = supertest(app);

// reset test db before every test
beforeEach(async () => {
  // Delete all existing users and facts
  await User.deleteMany();

  // Insert the sample users into the User collection
  await User.insertMany(sampleUsers);
});

describe('when there are some users in the database already', () => {
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all users are returned', async () => {
    const response = await api.get('/api/users');
    expect(response.body).toHaveLength(sampleUsers.length);
  });

  test('the first initial user is an admin', async () => {
    const response = await api.get('/api/users');
    expect(response.body[0].role).toBe('admin');
  });
});

describe('viewing a specific user', () => {
  test('succeds with a valid id', async () => {
    const user = await User.findOne({ email: 'admin@email.com' });
    const response = await api.get(`/api/users/${user._id}`).expect(200);
    expect(response.body.email).toBe('admin@email.com');
  });
  test('fails with status code 404 if no user found with that id', async () => {
    const id = '652558de66cfab18f5babdc';
    await api.get(`/api/users/${id}`).expect(404);
  });
});

describe('adding a new user', () => {
  test('succeeds with valid data', async () => {
    const newUser = {
      email: 'leodavinci@email.com',
      // password must have one lowercase one uppercase one num and one special symbol 6-30 characters
      password: 'aaaAAA111!!!',
    };

    await api
      .post('/api/users/local')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/users');

    const emails = response.body.map((r) => r.email);

    expect(response.body).toHaveLength(sampleUsers.length + 1);
    expect(emails).toContain('leodavinci@email.com');
  });

  test('fails with proper error message if email exists', async () => {
    const newUser = {
      email: 'admin@email.com',
      password: 'AAAaaa111!!!',
    };
    const response = await api.post('/api/users/local').send(newUser).expect(400);
    expect(response.body.message).toBe('Email already in use.');
  });
  test('fails with proper error message if inputs invalid', async () => {
    const newUser = {
      email: 'admin.com',
      password: '123456',
    };
    const response = await api.post('/api/users/local').send(newUser).expect(400);
    expect(response.body.message).toBe('Invalid inputs.');
  });
});

describe('updating an existing user', () => {
  test('succeeds when user exists and there is valid data', async () => {
    const user = await User.findOne({ email: 'admin@email.com' });
    const body = { email: 'bob@bob.com' };
    await api
      .put(`/api/users/${user._id}`)
      .send(body)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const response = await api.get(`/api/users/${user._id}`);
    expect(response.body.email).toBe('bob@bob.com');
  });
  test('succeeds with status 200, but no info is changed if empty fields provided', async () => {
    const user = await User.findOne({ email: 'admin@email.com' });
    const body = { email: '' };
    await api
      .put(`/api/users/${user._id}`)
      .send(body)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const response = await api.get(`/api/users/${user._id}`);
    expect(response.body.email).toBe('admin@email.com');
  });
  test('fails with status code 404 when user does not exist', async () => {
    const id = '123';
    const body = { email: 'bob@bob.com' };
    await api.put(`/api/users/${id}`).send(body).expect(404);
  });
});

describe('deleting a user', () => {
  test('succeeds with status 200 and returns deleted user with valid id', async () => {
    const user = await User.findOne({ email: 'admin@email.com' });
    const response = await api
      .delete(`/api/users/${user._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(response.body.email).toBe('admin@email.com');
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
