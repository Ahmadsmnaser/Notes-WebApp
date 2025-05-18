import express from 'express';
import { Request, Response } from 'express';
import { getNotesController, getNoteIdController, createNoteController, updateNoteController, deleteNoteController, getNoteIndexController, updateNoteIndexController, deleteNoteIndexController } from '../controllers/notesController';

const router = express.Router();

router.get('/notes', getNotesController);
router.get('/notes/index/:index', async (req: Request, res: Response) => {
    try {
        await getNoteIndexController(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error, get by index' });
    }
});
router.get('/notes/:id', async (req: Request, res: Response) => {
    try {
        await getNoteIdController(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error, get by id' });
    }
});
router.post('/notes', async (req: Request, res: Response) => {
    try {
        await createNoteController(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error, create' });
    }
});
router.put('/notes/:id', async (req: Request, res: Response) => {
    try {
        await updateNoteController(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error, edit' });
    }
});
router.put('/notes/index/:index', async (req: Request, res: Response) => {
    try {
        await updateNoteIndexController(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error, edit by index' });
    }
});
router.delete('/notes/:id', async (req: Request, res: Response) => {
    try {
        await deleteNoteController(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error, delete' });
    }
});
router.delete('/notes/index/:index', async (req: Request, res: Response) => {
    try {
        await deleteNoteIndexController(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error, delete by index' });
    }
});
export default router;