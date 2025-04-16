import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NoteList from './NoteList.tsx';
import Pagination from './Pagination.tsx';
import './App.css';

interface Author {
  name: string;
  email: string;
}

interface Note {
  id: number;
  title: string;
  author: Author;
  content: string;
}

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const postsPerPage = 10;
  const baseURL = 'http://localhost:3001/notes';

  // Fetch notes for the current page
  useEffect(() => {
    const fetchNotes = async () => {
      const start = (currentPage - 1) * postsPerPage;
      console.log('Start:', start);
      const apiUrl = `${baseURL}?_start=${start}&_limit=${postsPerPage}`;

      setLoading(true);
      setError('');

      try {
        console.log('Fetching notes from:', apiUrl);
        const response = await axios.get<Note[]>(apiUrl);
        setNotes(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error('Error fetching notes:', err.message);
        } else {
          console.error('Unexpected error:', err);
        }
        setError('Failed to load notes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [currentPage, postsPerPage, baseURL]);

  // Fetch total number of notes
  useEffect(() => {
    const fetchTotalNotes = async () => {
      try {
        const response = await axios.get<Note[]>(baseURL);
        setTotalNotes(response.data.length);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error('Error fetching total note count:', err.message);
        } else {
          console.error('Unexpected error:', err);
        }
        setError('Failed to load notes count.');
      }
    };

    fetchTotalNotes();
  }, [baseURL]);

  const totalPages = Math.ceil(totalNotes / postsPerPage);
  console.log('Total Pages:', totalPages);
  console.log('Current Page:', currentPage);

  const getPageNumbers = (): number[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage < 3) {
      return [1, 2, 3, 4, 5];
    }
    if (currentPage > totalPages - 2) {
      return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    }
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
  };

  // Handle loading and error states
  if (loading && notes.length === 0) {
    return <div className="loading">Loading notes...</div>;
  }
  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app">
      <h1>Welcome to My Notes App</h1>
      <NoteList Notes={notes} />
      {notes.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          getPageNumbers={getPageNumbers}
        />
      )}
    </div>
  );
};

export default App;