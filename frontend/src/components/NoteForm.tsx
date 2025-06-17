import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotes, Note } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import './NoteForm.css';

type Props = { editingNote?: Note; onClose?: () => void };

export default function NoteForm({ editingNote, onClose }: Props) {
  const { state: auth } = useAuth();
  const { dispatch } = useNotes();
  const { dispatch: notify } = useNotification();
  const isEdit = Boolean(editingNote);

  const [title, setTitle] = useState(editingNote?.title || '');
  const [content, setContent] = useState(editingNote?.content || '');

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editingNote]);

  if (!auth.token) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      content,
      author: {
        name: auth.name,
        email: auth.email,
      },
    };

    try {
      if (isEdit && editingNote) {
        const res = await axios.put<Note>(
          `http://localhost:3001/notes/${editingNote._id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        dispatch({ type: 'UPDATE', payload: res.data });
        notify({ type: 'SET', payload: 'Note updated' });
        onClose?.();
      } else {
        const res = await axios.post<Note>(
          'http://localhost:3001/notes',
          payload,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        dispatch({ type: 'CREATE', payload: res.data });
        notify({ type: 'SET', payload: 'Added a new note' });
        setTitle('');
        setContent('');
      }

      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="card form-card">
      <form onSubmit={handleSubmit}>
        <h3>{isEdit ? 'Edit Note' : 'New Note'}</h3>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
        <button type="submit">{isEdit ? 'Save' : 'Create'}</button>
        {isEdit && <button onClick={onClose}>Cancel</button>}
      </form>
    </div>
  );
}
