// import React from 'react';

// function SortingDropdown({ value, onChange }) {
//   return (
//     <select 
//       className="sort-select"
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//     >
//       <option value="date">Date (Newest First)</option>
//       <option value="quantity">Quantity (High to Low)</option>
//       <option value="customer_name">Customer Name (A-Z)</option>
//     </select>
//   );
// }

// export default SortingDropdown;
import React from 'react';

function SortingDropdown({ value, onChange }) {
  return (
    <div className="relative">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium text-gray-700 bg-white shadow-sm cursor-pointer hover:border-gray-400 transition-colors"
      >
        <option value="date">Date (Newest First)</option>
        <option value="quantity">Quantity (High to Low)</option>
        <option value="customer_name">Customer Name (A-Z)</option>
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default SortingDropdown;