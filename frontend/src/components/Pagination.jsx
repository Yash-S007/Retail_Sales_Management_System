// import React from 'react';

// function Pagination({ currentPage, totalPages, totalItems, onPageChange }) {
//   if (totalPages <= 1) return null;

//   return (
//     <div className="pagination">
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//       >
//         Previous
//       </button>
      
//       <div className="page-info">
//         Page {currentPage} of {totalPages} | {totalItems} total records
//       </div>
      
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//       >
//         Next
//       </button>
//     </div>
//   );
// }

// export default Pagination;
import React from 'react';

function Pagination({ currentPage, totalPages, totalItems, onPageChange }) {
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7; // Show max 7 page numbers
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      let start = Math.max(2, currentPage - 2);
      let end = Math.min(totalPages - 1, currentPage + 2);
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add pages around current page
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ fontSize: '14px', color: '#64748b' }}>
        Showing page <span style={{ fontWeight: 600, color: '#0f172a' }}>{currentPage}</span> of{' '}
        <span style={{ fontWeight: 600, color: '#0f172a' }}>{totalPages}</span>
        {' '}({totalItems.toLocaleString()} total records)
      </div>
      
      <div style={{ display: 'flex', gap: '6px' }}>
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} style={{
                padding: '8px 12px',
                color: '#94a3b8',
                fontSize: '14px'
              }}>
                ...
              </span>
            );
          }
          
          const isActive = page === currentPage;
          
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={{
                minWidth: '40px',
                height: '40px',
                padding: '0 12px',
                border: isActive ? 'none' : '1px solid #cbd5e1',
                borderRadius: '8px',
                background: isActive ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'white',
                color: isActive ? 'white' : '#475569',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 12px rgba(59,130,246,0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#94a3b8';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }
              }}
            >
              {page}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Pagination;