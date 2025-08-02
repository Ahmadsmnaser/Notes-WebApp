import axios from 'axios';
import { useNotes, Note } from '../contexts/NotesContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { sanitizeHtml } from './sanitizeHtml'; // adjust path if needed
import './PostList.css';
import React, { useEffect } from 'react';

type Props = { onEdit: (note: Note) => void };

function Notes({ notes, auth, onEdit, handleDelete, sanitizerOn }: any) {
  return (
    <div>
      {notes.map((n: Note) => {
        const isOwner = auth.email === n.author.email;

        return (
          <div key={n._id} className="card note" data-testid={n._id}>
            <h2>{n.title}</h2>
            <small>By {n.author.name}</small>
            <p
              dangerouslySetInnerHTML={{
                __html: sanitizerOn ? sanitizeHtml(n.content) : n.content,
              }}
            />
            {isOwner && (
              <>
                <button data-testid={`edit-${n._id}`} onClick={() => onEdit(n)}>
                  Edit
                </button>
                <button data-testid={`delete-${n._id}`} onClick={() => handleDelete(n._id)}>
                  Delete
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}


export default function PostList({ onEdit }: Props) {
  const {
    state: { notes },
    dispatch,
  } = useNotes();
  const { state: auth } = useAuth();
  const { dispatch: notify } = useNotification();

  const handleDelete = async (_id: string) => {
    if (!auth.token) return;
      await axios.delete(`http://localhost:3001/notes/${_id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      dispatch({ type: 'DELETE', payload: _id });
      notify({ type: 'SET', payload: 'Note deleted' });
    
  };

  const [sanitizerOn, setSanitizerOn] = React.useState(true);

// 🔽 Add this:
useEffect(() => {
  if (typeof window !== 'undefined') {
    (window as any).sanitizerOn = sanitizerOn;
  }
}, [sanitizerOn]);

  // key changes with sanitizerOn to force React remount entire subtree
  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type="radio"
            checked={sanitizerOn}
            onChange={() => setSanitizerOn(true)}
          />
          Sanitizer ON
        </label>
        <label style={{ marginLeft: '1rem' }}>
          <input
            type="radio"
            checked={!sanitizerOn}
            onChange={() => setSanitizerOn(false)}
          />
          Sanitizer OFF
        </label>
      </div>

      <div key={`notes-${sanitizerOn ? 'sanitized' : 'raw'}`}>
        <Notes
          notes={notes}
          auth={auth}
          onEdit={onEdit}
          handleDelete={handleDelete}
          sanitizerOn={sanitizerOn}
        />
      </div>
    </>
  );
}