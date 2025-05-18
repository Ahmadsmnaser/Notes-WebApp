import React from 'react';
import './Pagination.css';
import { useNotes } from '../contexts/NotesContext';

interface Props {
  totalPages: number;
  getPageNumbers: () => number[];
}

const Pagination: React.FC<Props> = ({ totalPages, getPageNumbers }) => {
  const { state, dispatch } = useNotes();
  const { currentPage } = state;

  return (
    <div className="pagination">
      <button onClick={() => dispatch({ type: 'SET_PAGE', payload: 1 })} disabled={currentPage === 1}>First</button>
      <button onClick={() => dispatch({ type: 'SET_PAGE', payload: Math.max(currentPage-1,1) })} disabled={currentPage===1}>Previous</button>
      {getPageNumbers().map(num => (
        <button key={num} onClick={() => dispatch({ type: 'SET_PAGE', payload: num })} className={currentPage===num ? 'active' : ''}>{num}</button>
      ))}
      <button onClick={() => dispatch({ type: 'SET_PAGE', payload: Math.min(currentPage+1, totalPages)})} disabled={currentPage===totalPages}>Next</button>
      <button name="last" onClick={() => dispatch({ type: 'SET_PAGE', payload: totalPages })} disabled={currentPage===totalPages} >Last</button>
    </div>
  );
};

export default Pagination;
