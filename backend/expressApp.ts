import express from 'express';
import cors from 'cors';
import loggerMiddleware from './middlewares/logger';
import notesRoutes from './routes/notesRoutes';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    exposedHeaders: ['X-Total-Count'],
}));

app.use(express.json());
app.use(loggerMiddleware);
app.use(notesRoutes);

app.get('/health', (_req, res) => {
    res.send('OK');
});

export default app;
