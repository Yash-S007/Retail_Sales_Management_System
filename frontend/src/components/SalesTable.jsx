// // import React, { useState } from 'react';

// // function SearchBar({ onSearch, value }) {
// //   const [inputValue, setInputValue] = useState(value);

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     onSearch(inputValue);
// //   };

// //   const handleClear = () => {
// //     setInputValue('');
// //     onSearch('');
// //   };

// //   return (
// //     <form onSubmit={handleSubmit} style={{position: 'relative'}}>
// //       <input
// //         type="text"
// //         className="search-input"
// //         placeholder="Search by customer name or phone number..."
// //         value={inputValue}
// //         onChange={(e) => setInputValue(e.target.value)}
// //       />
// //       {inputValue && (
// //         <button 
// //           type="button"
// //           onClick={handleClear}
// //           style={{
// //             position: 'absolute',
// //             right: '10px',
// //             top: '50%',
// //             transform: 'translateY(-50%)',
// //             background: 'none',
// //             border: 'none',
// //             color: '#666',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           ✕
// //         </button>
// //       )}
// //     </form>
// //   );
// // }

// // export default SearchBar;

// import React from 'react';

// function SalesTable({ data }) {
//   if (data.length === 0) {
//     return null;
//   }

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN');
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     if (!amount) return '₹0';
//     return `₹${parseFloat(amount).toLocaleString('en-IN', {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2
//     })}`;
//   };

//   return (
//     <table className="sales-table">
//       <thead>
//         <tr>
//           <th>Date</th>
//           <th>Customer Name</th>
//           <th>Phone</th>
//           <th>Region</th>
//           <th>Product</th>
//           <th>Category</th>
//           <th>Quantity</th>
//           <th>Total Amount</th>
//           <th>Payment Method</th>
//           <th>Status</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((sale, index) => (
//           <tr key={index}>
//             <td>{formatDate(sale.date)}</td>
//             <td>{sale.customer_name || 'N/A'}</td>
//             <td>{sale.phone_number || 'N/A'}</td>
//             <td>{sale.customer_region || 'N/A'}</td>
//             <td>{sale.product_name || 'N/A'}</td>
//             <td>{sale.product_category || 'N/A'}</td>
//             <td>{sale.quantity || '0'}</td>
//             <td>{formatCurrency(sale.final_amount)}</td>
//             <td>{sale.payment_method || 'N/A'}</td>
//             <td>
//               <span style={{
//                 padding: '4px 8px',
//                 borderRadius: '4px',
//                 fontSize: '12px',
//                 backgroundColor: sale.order_status === 'Delivered' ? '#d4edda' : '#fff3cd',
//                 color: sale.order_status === 'Delivered' ? '#155724' : '#856404'
//               }}>
//                 {sale.order_status || 'Pending'}
//               </span>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// export default SalesTable;

import React from 'react';

function SalesTable({ data }) {
  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
        No data found
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return `₹${parseFloat(amount).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <div style={{ 
      overflow: 'auto', 
      background: 'white', 
      borderRadius: '12px', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        fontSize: '14px'
      }}>
        <thead>
          <tr style={{ 
            background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
            borderBottom: '2px solid #e2e8f0'
          }}>
            <th style={headerStyle}>Transaction ID</th>
            <th style={headerStyle}>Date</th>
            <th style={headerStyle}>Customer Name</th>
            <th style={headerStyle}>Phone</th>
            <th style={headerStyle}>Region</th>
            <th style={headerStyle}>Product</th>
            <th style={headerStyle}>Category</th>
            <th style={headerStyle}>Quantity</th>
            <th style={headerStyle}>Total Amount</th>
            <th style={headerStyle}>Payment Method</th>
            <th style={headerStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sale, index) => (
            <tr key={index} style={{ 
              borderBottom: '1px solid #f1f5f9',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <td style={cellStyle}>{sale.transaction_id || 'N/A'}</td>
              <td style={cellStyle}>{formatDate(sale.date)}</td>
              <td style={{...cellStyle, fontWeight: 500, color: '#0f172a'}}>{sale.customer_name || 'N/A'}</td>
              <td style={cellStyle}>{sale.phone_number || 'N/A'}</td>
              <td style={cellStyle}>{sale.customer_region || 'N/A'}</td>
              <td style={cellStyle}>{sale.product_name || 'N/A'}</td>
              <td style={cellStyle}>{sale.product_category || 'N/A'}</td>
              <td style={{...cellStyle, fontWeight: 600}}>{sale.quantity || '0'}</td>
              <td style={{...cellStyle, fontWeight: 600, color: '#0f172a'}}>{formatCurrency(sale.final_amount)}</td>
              <td style={cellStyle}>{sale.payment_method || 'N/A'}</td>
              <td style={cellStyle}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: sale.order_status === 'Delivered' ? '#dcfce7' : 
                             sale.order_status === 'Completed' ? '#dbeafe' :
                             sale.order_status === 'Pending' ? '#fef3c7' :
                             sale.order_status === 'Cancelled' ? '#fee2e2' :
                             sale.order_status === 'Returned' ? '#f3e8ff' : '#f1f5f9',
                  color: sale.order_status === 'Delivered' ? '#166534' : 
                         sale.order_status === 'Completed' ? '#1e40af' :
                         sale.order_status === 'Pending' ? '#92400e' :
                         sale.order_status === 'Cancelled' ? '#991b1b' :
                         sale.order_status === 'Returned' ? '#6b21a8' : '#475569'
                }}>
                  {sale.order_status || 'Pending'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const headerStyle = {
  padding: '16px 20px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: 600,
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  whiteSpace: 'nowrap'
};

const cellStyle = {
  padding: '16px 20px',
  color: '#64748b',
  whiteSpace: 'nowrap'
};

export default SalesTable;