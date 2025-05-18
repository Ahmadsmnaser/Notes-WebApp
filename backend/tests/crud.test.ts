import request from 'supertest';
import app from '../expressApp';
import mongoose from 'mongoose';
describe('Notes API', () => {
    let createdNoteId: string;

    it('should create a note', async () => {
        const res = await request(app).post('/notes').send({
            title: 'Test Note',
            author: { name: 'Test', email: 'test@example.com' },
            content: 'This is a test note',
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe('Test Note');
        createdNoteId = res.body._id;
    });

    it('should get all notes', async () => {
        const res = await request(app).get('/notes');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should update the created note', async () => {
        const res = await request(app).put(`/notes/${createdNoteId}`).send({
            title: 'Updated Note',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe('Updated Note');
    });

    it('should delete the created note', async () => {
        const res = await request(app).delete(`/notes/${createdNoteId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Note deleted successfully');
    });
});
afterAll(async () => {
    await mongoose.connection.close();
});