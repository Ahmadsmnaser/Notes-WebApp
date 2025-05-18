import NoteModel from '../models/noteModel';
import { INote } from '../models/noteModel';

export const getNotes = async (page: number, perPage: number) => {
    const mustskip = (page - 1) * perPage;

    const [notes, count] = await Promise.all([
        NoteModel.find().sort({ _id: -1 }).skip(mustskip).limit(perPage),
        NoteModel.countDocuments()
    ]);

    return { notes, count };
};

export const getNoteId = async (id: string) => {
    const note = await NoteModel.findById(id);
    if (!note) {
        throw new Error('Note not found');
    }
    return note;
};

export const getNoteIndex = async (index: number) => {

    const note = await NoteModel.find().skip(index).limit(1);

    if (note.length === 0) {
        throw new Error('Note not found at the given index');
    }
    const noteToGet = note[0];
    return await NoteModel.findById(noteToGet._id);
};

export const createNote = async (noteData: Partial<INote>) => {
    const newNote = new NoteModel(noteData);
    return await newNote.save();
};

export const updateNote = async (id: string, data: Partial<INote>) => {
    return await NoteModel.findByIdAndUpdate(id, data, { new: true });
};

export const updateNoteIndex = async (index: number, data: Partial<INote>) => {
    const note = await NoteModel.find().skip(index).limit(1);

    if (note.length === 0) {
        throw new Error('Note not found at the given index');
    }
    const noteToUpdate = note[0];
    return await NoteModel.findByIdAndUpdate(noteToUpdate._id, data, { new: true });
};

export const deleteNote = async (id: string) => {
    return await NoteModel.findByIdAndDelete(id);
};

export const deleteNoteIndex = async (index: number) => {
    const note = await NoteModel.find().skip(index).limit(1);

    if (note.length === 0) {
        throw new Error('Note not found at the given index');
    }

    const noteToDelete = note[0];
    return await NoteModel.findByIdAndDelete(noteToDelete._id);
};