import request from 'supertest';
import app, { startServer } from '../server';
import mongoose from 'mongoose';
import { Server } from 'http';

describe('User authentication', () => {
  let server: Server;
  let username: string;
  let password: string;

  beforeAll(async () => {
    server = await startServer();

    // Generate random username and password
    const timestamp = Date.now();
    username = `user${timestamp}`;
    password = `pass${timestamp}`;
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it('should create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'Test User',
      email: `${username}@example.com`,
      username,
      password,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User created' });
  });

  it('should login a user and return a token', async () => {
    const response = await request(app).post('/login').send({
      username,
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should fail login with wrong password', async () => {
    const response = await request(app).post('/login').send({
      username,
      password: 'wrongPassword',
    });

    expect(response.status).toBe(401);
  });
});
