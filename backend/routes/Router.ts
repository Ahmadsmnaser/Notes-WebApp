// import express from 'express';
// import {
//   getNotes,
//   getNoteById,
//   createNote,
//   updateNote,
//   deleteNote,
//   getNoteByIndex,
//   updateNoteByIndex,
//   deleteNoteByIndex,
//   getNoteCountOnly
// } from '../controllers/notesController';
// import Note from '../models/noteModel';
// import { authMiddleware } from '../middlewares/authMiddleware';

// const router = express.Router();


// // By MongoDB _id
// router.get('/count', getNoteCountOnly);
// router.get('/', getNotes); // ?_page=&_per_page=
// router.get('/:id', getNoteById);
// router.post('/', authMiddleware, createNote);
// router.put('/:id', authMiddleware, updateNote);
// router.delete('/:id', authMiddleware, deleteNote);

// // By array index
// router.get('/by-index/:i', getNoteByIndex);
// router.put('/by-index/:i', authMiddleware, updateNoteByIndex);
// router.delete('/by-index/:i', authMiddleware, deleteNoteByIndex);



// export default router;
import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNoteByIndex,
  updateNoteByIndex,
  deleteNoteByIndex,
  getNoteCountOnly,
} from '../controllers/notesController';
import { registerUser, loginUser } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Notes Routes
router.get('/notes/count', getNoteCountOnly);
router.get('/notes', getNotes);
router.get('/notes/:id', getNoteById);
router.post('/notes', authMiddleware, createNote);
router.put('/notes/:id', authMiddleware, updateNote);
router.delete('/notes/:id', authMiddleware, deleteNote);
router.get('/notes/by-index/:i', getNoteByIndex);
router.put('/notes/by-index/:i', authMiddleware, updateNoteByIndex);
router.delete('/notes/by-index/:i', authMiddleware, deleteNoteByIndex);

// Authentication Routes
router.post('/users', registerUser);
router.post('/login', loginUser);

export default router;
