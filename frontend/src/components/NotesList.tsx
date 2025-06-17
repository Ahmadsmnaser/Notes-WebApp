import axios from 'axios';
import { useNotes, Note } from '../context/NotesContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import './Component.css';
import './NotesList.css';

type Props = { onEdit: (note: Note) => void };

export default function NotesList({ onEdit }: Props) {
  const {
    state: { notes },
    dispatch,
  } = useNotes();
  const { state: auth } = useAuth();
  const { dispatch: notify } = useNotification();

  const handleDelete = async (_id: string) => {
    if (!auth.token) return;
    if (confirm('Delete this note?')) {
      await axios.delete(`http://localhost:3001/notes/${_id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      dispatch({ type: 'DELETE', payload: _id });
      notify({ type: 'SET', payload: 'Note deleted' });
      
    }
  };

  return (
    <div>
      {notes.map((n) => {
        const isOwner = auth.email === n.author.email;

        return (
          <div key={n._id} className="card note" data-testid={n._id}>
            <h2>{n.title}</h2>
            <small>By {n.author.name}</small>
            <p>{n.content}</p>
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
