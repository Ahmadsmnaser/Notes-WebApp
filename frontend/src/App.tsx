import React from 'react';
import { NotesProvider, useNotes } from './contexts/NotesContext';
import NoteList from './components/NoteList';
import Pagination from './components/Pagination';
import axios from 'axios';
import './App.css';
import { Note } from './contexts/notesReducer';

const AppContent: React.FC = () => {
  const { state, dispatch } = useNotes();
  const { notes, loading, error, currentPage, totalNotes, isAdding, newContent, notification } = state;
  const postsPerPage = 10;
  const totalPages = Math.ceil(totalNotes / postsPerPage);
  const getPageNumbers = (): number[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage < 3) return [1, 2, 3, 4, 5];
    if (currentPage > totalPages - 2) return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  const handleAddClick = () => dispatch({ type: 'TOGGLE_ADD', payload: true });
  const handleCancel = () => dispatch({ type: 'TOGGLE_ADD', payload: false });
  const handleSave = async () => {
    if (!newContent.trim()) return alert('Cannot be empty');

    const newNote = {
      title: `Note ${totalNotes + 1}`,
      author: { name: 'Anonymous', email: 'anon@example.com' },
      content: newContent,
    };

    try {
      await axios.post('http://localhost:3001/notes', newNote);

      const updatedTotal = totalNotes + 1;
      dispatch({ type: 'SET_TOTAL', payload: updatedTotal });

      const resp = await axios.get(`http://localhost:3001/notes?_page=${currentPage}&_per_page=10`);
      const notesWithIds = resp.data.map((note: Note) => ({
        ...note,
        id: note._id?.toString() || note.id?.toString(),
      }));

      dispatch({ type: 'FETCH_SUCCESS', payload: { notes: notesWithIds } });

      dispatch({ type: 'TOGGLE_ADD', payload: false });
      dispatch({ type: 'SET_NEW_CONTENT', payload: '' });
      dispatch({ type: 'SET_NOTIFICATION', payload: 'Added a new note' });

    } catch {
      dispatch({ type: 'FETCH_ERROR', payload: 'Failed to add note.' });
    }
  };


  if (loading && notes.length === 0) return <div>Loading...</div>;
  if (error) return <div className="notification error">{error}</div>;

  return (
    <div className="app">
      <h1>Welcome to My Notes App</h1>   
      <div className="notification">{notification}</div>
      <NoteList />
      {notes.length > 0 && (
        <Pagination
          totalPages={totalPages}
          getPageNumbers={getPageNumbers}
        />
      )}

      {!isAdding ? (
        <button
          name="add_new_note"
          onClick={handleAddClick}
        >
          Add New Note
        </button>
      ) : (
        <div>
          <input
            type="text"
            name="text_input_new_note"
            data-testid="text_input_new_note"
            value={newContent}
            onChange={(e) => dispatch({ type: 'SET_NEW_CONTENT', payload: e.target.value })}
          />
          <button
            name="text_input_save_new_note"
            data-testid="text_input_save_new_note"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            name="text_input_cancel_new_note"
            data-testid="text_input_cancel_new_note"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <NotesProvider>
    <AppContent />
  </NotesProvider>
);

export default App;
