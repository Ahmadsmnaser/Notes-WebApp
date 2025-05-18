import mongoose, { Schema, Document } from 'mongoose';


export interface INote extends Document {
    title: string;
    author: {
        name: string;
        email: string;
    },
    content: string;
}

const noteSchema: Schema = new Schema<INote>({
    title: { type: String, required: true },
    author: {
        name: { type: String },
        email: { type: String }
    },
    content: { type: String, required: true }
});

const NoteModel = mongoose.model<INote>('Note', noteSchema);

export default NoteModel;
