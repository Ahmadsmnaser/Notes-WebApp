import React, { useState } from 'react';
import { useNotes } from '../contexts/NotesContext';
import './NoteList.css';
import axios from 'axios';

interface Note {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
}

const NoteList: React.FC = () => {
  const { state, dispatch } = useNotes();
  const { notes , totalNotes , currentPage} = state;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const startEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };
  const cancel = () => setEditingId(null);


const save = async (id: string) => {
  // 1. Find the full note object in context state:
  const original = state.notes.find(n => n.id === id);
  if (!original) return;

  // 2. Merge in your edited content (or any other changed fields):
  const updatedNote: Note = {
    ...original,
    content: editContent,
  };

  try {
    // 3. Send the entire note object in the PUT body:
    await axios.put(`http://localhost:3001/notes/${id}`, updatedNote);

    // 4. Dispatch the reducer so local state matches the server:
    dispatch({
      type: 'UPDATE_NOTE_SUCCESS',
      payload: updatedNote

    });
    setEditingId(null);
  } catch (e) {
    console.error('Failed to save note edit:', e);
  }
};


  const del = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/notes/${id}`);

      const updatedTotal = totalNotes - 1;
      const postsPerPage = 10;
      const newTotalPages = Math.ceil(updatedTotal / postsPerPage);
      let pageToLoad = currentPage;

      if (pageToLoad > newTotalPages) {
        pageToLoad = newTotalPages;
        dispatch({ type: 'SET_PAGE', payload: newTotalPages });
      }

      dispatch({ type: 'SET_TOTAL', payload: updatedTotal });

      const resp = await axios.get(`http://localhost:3001/notes?_page=${pageToLoad}&_per_page=${postsPerPage}`);
      const notesWithIds = resp.data.map((note: any) => ({
        ...note,
        id: note._id?.toString() || note.id?.toString()
      }));

      dispatch({ type: 'FETCH_SUCCESS', payload: { notes: notesWithIds } });

      dispatch({ type: 'SET_NOTIFICATION', payload: 'Note deleted successfully' });
    } catch (error) {
      console.error('Failed to delete note:', id);
      dispatch({ type: 'FETCH_ERROR', payload: 'Failed to delete note.' });
    }
  };

  return (
    <div className="Notes-container">
      {notes.map((n) => (
        <div key={n.id} className="note" data-testid={n.id}>
          <h3>{n.title}</h3>
          <p>By {n.author.name} ({n.author.email})</p>
          {editingId === n.id ? (
            <>
              <textarea
                name={`text_input-${n.id}`}
                data-testid={`text_input-${n.id}`}
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
              />
              <button
                name={`text_input_save-${n.id}`}
                data-testid={`text_input_save-${n.id}`}
                onClick={() => save(n.id)}
              >
                Save
              </button>
              <button
                name={`text_input_cancel-${n.id}`}
                data-testid={`text_input_cancel-${n.id}`}
                onClick={cancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p className="note-content">{n.content}</p>
              <button
                name={`edit-${n.id}`}
                data-testid={`edit-${n.id}`}
                onClick={() => startEdit(n.id, n.content)}
              >
                Edit
              </button>
              <button
                name={`delete-${n.id}`}
                data-testid={`delete-${n.id}`}
                onClick={() => del(n.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default NoteList;
