import React, { createContext, useReducer, useContext, useEffect } from 'react';
import axios from 'axios';
import { notesReducer, initialState, Note, NotesState, NotesAction } from './notesReducer';

const NotesContext = createContext<{
  state: NotesState;
  dispatch: React.Dispatch<NotesAction>;
}>({ state: initialState, dispatch: () => null });

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const postsPerPage = 10;
  const baseURL = 'http://localhost:3001/notes';

  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get<Note[]>(`${baseURL}?_page=1&_per_page=${postsPerPage}`);
        const totalCount = parseInt(resp.headers['x-total-count'] || '0');
        dispatch({ type: 'SET_TOTAL', payload: totalCount });
      } catch {
        dispatch({ type: 'FETCH_ERROR', payload: 'Failed to load total notes.' });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      dispatch({ type: 'FETCH_START' });

      const url = `${baseURL}?_page=${state.currentPage}&_per_page=${postsPerPage}`;

      try {
        const resp = await axios.get<Note[]>(url);

        const notesWithIds = resp.data.map((note) => ({
          ...note,
          id: note._id?.toString() || note.id?.toString() || Date.now().toString()
        }));

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: { notes: notesWithIds }
        });
      } catch {
        dispatch({ type: 'FETCH_ERROR', payload: 'Failed to load notes.' });
      }
    })();
  }, [state.currentPage]);

  return (
    <NotesContext.Provider value={{ state, dispatch }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);
