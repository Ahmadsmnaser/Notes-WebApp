// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import notesRouter from './routes/notesRouter';
// import { errorHandler } from './middlewares/errorHandler';
// import { logger } from './middlewares/logger';
// import authRoutes from './routes/authRoutes';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001;
// const MONGO_URI = process.env.MONGO_URI!;

// app.use(express.json());
// app.use(logger);
// app.use(cors({ exposedHeaders: ['X-Total-Count'] }));

// // 🔀 Mount routers BEFORE 404 handler
// app.use('/notes', notesRouter);
// app.use(authRoutes); // <-- move this above the 404 handler

// // ❌ Catch-all 404 handler
// app.use((_req, res) => {
//   res.status(404).json({ error: 'Not Found' });
// });

// // 🧯 General error handler
// app.use(errorHandler);

// // Export the app for tests
// export default app;

// export async function startServer() {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log('Connected to MongoDB');
//     return app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error('MongoDB connection error:', err);
//     process.exit(1);
//   }
// }

// if (require.main === module) {
//   startServer();
// }


import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import combinedRouter from './routes/Router';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './middlewares/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI!;

app.use(express.json());
app.use(logger);
app.use(cors({ exposedHeaders: ['X-Total-Count'] }));

app.use('/', combinedRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

export default app;

export async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    return app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

