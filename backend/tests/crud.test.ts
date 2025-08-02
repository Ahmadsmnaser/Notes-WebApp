import request from 'supertest';
import app, { startServer } from '../server';
import mongoose from 'mongoose';
import { IncomingMessage, Server, ServerResponse } from 'http';

describe('CRUD operations with authentication', () => {
  let server: Server;
  let token: any;
  let noteId: any;

  beforeAll(async () => {
    server = await startServer();

  
    // Generate unique username and password using the current timestamp
    const timestamp = Date.now();
    const username = `user_${timestamp}`;
    const password = `pass_${timestamp}`;

    // Create a new user
    await request(app).post('/users').send({
      name: 'Note Tester',
      email: `note_${timestamp}@test.com`,
      username,
      password,
    });

    // Log in with the created user to get the token
    const loginRes = await request(app).post('/login').send({
      username,
      password,
    });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  it('should create a new note', async () => {
    const response = await request(app)
      .post('/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Note',
        content: 'This is a test note.',
        author: { name: 'Note Tester', email: 'note@test.com' },
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    noteId = response.body._id;
  });

  it('should read notes', async () => {
    const response = await request(app).get('/notes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should update a note', async () => {
    const response = await request(app)
      .put(`/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Title');
  });

  it('should delete a note', async () => {
    const response = await request(app)
      .delete(`/notes/${noteId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(204);
  });

  it('should return 400 when required fields are missing', async () => {
    const response = await request(app)
      .post('/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Missing content and author' });
    expect(response.status).toBe(400);
  });

  it('should retrieve a specific note by ID', async () => {
    const create = await request(app)
      .post('/notes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Get by ID',
        content: 'Content',
        author: { name: 'Author', email: 'a@example.com' },
      });
    const id = create.body._id;

    const response = await request(app).get(`/notes/${id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', id);
  });

  it('should return 404 when updating a nonexistent note', async () => {
    const response = await request(app)
      .put('/notes/000000000000000000000000')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Nonexistent' });
    expect(response.status).toBe(404);
  });

  it('should return 404 when deleting a nonexistent note', async () => {
    const response = await request(app)
      .delete('/notes/000000000000000000000000')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });

  it('should return paginated results', async () => {
    const response = await request(app).get('/notes?_page=1&_per_page=5');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeLessThanOrEqual(5);
  });
});
