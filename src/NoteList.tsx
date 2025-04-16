import React from 'react';
import './NoteList.css';
import { Note } from './App';

interface NoteListProps {
  Notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ Notes }) => {
  return (
    <div className="Notes-container">
      {Notes.map((Note) => (
        <div
          key={Note.id}
          className="note"
          id={Note.id.toString()}
        >
          <h3>{Note.title}</h3>
          <p className="note-author">
            By {Note.author.name} ({Note.author.email})
          </p>
          <p className="note-content">{Note.content}</p>
        </div>
      ))}
    </div>
  );
};

export default NoteList;