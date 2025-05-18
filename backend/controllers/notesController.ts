import { Request, Response } from 'express';
import { getNotes, getNoteId,  createNote, updateNote , deleteNote , deleteNoteIndex , updateNoteIndex , getNoteIndex } from '../services/notesService';

export const getNotesController = async (req: Request, res: Response) => {
    const page = parseInt(req.query._page as string) || 1;
    const perPage = parseInt(req.query._per_page as string) || 10;

    const { notes, count } = await getNotes(page, perPage);

    res.set('X-Total-Count', count.toString());
    res.status(200).json(notes);
};

export const getNoteIdController = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const note = await getNoteId(id);

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json(note);
    } catch (error) {
        console.error('Error getting note by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getNoteIndexController = async (req: Request , res: Response)=>{
    try{
        const index = parseInt(req.params.index, 10);
    if (isNaN(index) || index < 0) {
        return res.status(400).json({ error: 'Invalid index' });
    }
    const note = await getNoteIndex(index);

    if (!note) {
        return res.status(404).json({ error: 'Note not found at this index' });
    }
    res.status(200).json(note);
    } catch (error) {
        console.error('Error getting note by index:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createNoteController = async (req: Request, res: Response) => {
    try {
        const noteData = req.body;

        if (!noteData.title || !noteData.content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const newNote = await createNote(noteData);
        res.status(201).json(newNote);
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  };

export const updateNoteController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;

    try {
        const updatedNote = await updateNote(id, data);

        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json(updatedNote);
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  };

export const updateNoteIndexController = async (req: Request, res: Response)=>{
    try{
        const index = parseInt(req.params.index, 10);
        if (isNaN(index) || index < 0) {
            return res.status(400).json({ error: 'Invalid index' });
        }
        const note = await updateNoteIndex(index,req.body);

        if (!note) {
            return res.status(404).json({ error: 'Note not found at this index' });
        }
        res.status(200).json(note);
    }
    catch (error) {
        console.error('Error updating note by index:', error);
        res.status(500).json({ error: 'Internal server error' });
}
};

export const deleteNoteController = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedNote = await deleteNote(id);

        if (!deletedNote) {
            return res.status(404).json({ error: 'Note not found' });
        }

        res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  };

export const deleteNoteIndexController = async (req: Request, res: Response) => {
    try{
        const index = parseInt(req.params.index, 10);
        if (isNaN(index) || index < 0) {
            return res.status(400).json({ error: 'Invalid index' });
        }
        const note = await deleteNoteIndex(index);

        if (!note) {
            return res.status(404).json({ error: 'Note not found at this index' });
        }
        res.status(200).json(note);
    }
    catch (error) {
        console.error('Error deleting note by index:', error);
        res.status(500).json({ error: 'Internal server error' });

    }
};