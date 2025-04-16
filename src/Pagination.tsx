import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  getPageNumbers: () => number[];
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
  getPageNumbers
}) => {
  return (
    <div className='pagination'>
      <button
        name="first"
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        aria-label="Go to first page"
      >
        First
      </button>
      <button
        name="previous"
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        Previous
      </button>

      {getPageNumbers().map((pageNumber) => (
        <button
          key={pageNumber}
          name={`page-${pageNumber}`}
          onClick={() => setCurrentPage(pageNumber)}
          className={currentPage === pageNumber ? 'active' : ''}
          aria-label={`Go to page ${pageNumber}`}
          aria-current={currentPage === pageNumber ? 'page' : undefined}
        >
          {pageNumber}
        </button>
      ))}

      <button
        name="next"
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        Next
      </button>
      <button
        name="last"
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Go to last page"
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;