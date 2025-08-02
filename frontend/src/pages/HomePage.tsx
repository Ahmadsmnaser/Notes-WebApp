// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useNotes,
  Note,
  fetchNotesWithSlidingCache,
} from '../contexts/NotesContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import PostList from '../components/PostList';
import Pagination from '../components/Pagination';
import Post from '../components/Post';

const POSTS_PER_PAGE = 10;

const NotificationBar = ({ message }: { message: string }) => (
  <div className="notification">{message}</div>
);

const AuthButtons = ({
  auth,
  authDispatch,
  navigate,
}: {
  auth: any;
  authDispatch: any;
  navigate: any;
}) => {
  return (
    <div style={{ margin: '1rem' }}>
      {!auth.token ? (
        <>
          <button onClick={() => navigate('/login')} data-testid="go_to_login_button">
            Go to Login
          </button>
          <button onClick={() => navigate('/create-user')} data-testid="go_to_create_user_button">
            Create New User
          </button>
        </>
      ) : (
        <button onClick={() => authDispatch({ type: 'LOGOUT' })} data-testid="logout">
          Logout
        </button>
      )}
    </div>
  );
};

const NotesLayout = ({
  page,
  totalPages,
  setPage,
  editingNote,
  setEditingNote,
}: {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  editingNote: Note | null;
  setEditingNote: (note: Note | null) => void;
}) => (
  <div className="app-container">
    <div className="sidebar">
      <div className="card form-card">
        <Post
          editingNote={editingNote || undefined}
          onClose={() => setEditingNote(null)}
        />
      </div>
    </div>
    <div className="content">
      <PostList onEdit={setEditingNote} />
      <Pagination currentPage={page} totalPages={totalPages} setPage={setPage} />
    </div>
  </div>
);

export default function HomePage() {
  const {
    state: { page, totalCount },
    dispatch,
    state,
  } = useNotes();

  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const { state: auth, dispatch: authDispatch } = useAuth();
  const { message } = useNotification();
  const navigate = useNavigate();

  const [cacheInitialized, setCacheInitialized] = useState(false);

  useEffect(() => {
    const initCache = async () => {
      try {
        await fetchNotesWithSlidingCache(page, state, dispatch);
        setCacheInitialized(true);
      } catch (error) {
        console.error(error);
      }
    };

    if (!cacheInitialized) {
      initCache();
    } else {
      fetchNotesWithSlidingCache(page, state, dispatch).catch(console.error);
    }
  }, [page, cacheInitialized]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <div>
      <NotificationBar message={message} />
      <AuthButtons auth={auth} authDispatch={authDispatch} navigate={navigate} />
      <NotesLayout
        page={page}
        totalPages={totalPages}
        setPage={(p: number) => dispatch({ type: 'SET_PAGE', payload: p })}
        editingNote={editingNote}
        setEditingNote={setEditingNote}
      />
    </div>
  );
}
