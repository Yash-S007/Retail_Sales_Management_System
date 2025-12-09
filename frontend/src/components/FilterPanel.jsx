// import React from 'react';

// function FilterPanel({ filters, filterOptions, onFilterChange, onClear }) {
//   const handleMultiSelect = (filterName, value, checked) => {
//     const currentValues = filters[filterName] || [];
//     let newValues;
    
//     if (checked) {
//       newValues = [...currentValues, value];
//     } else {
//       newValues = currentValues.filter(v => v !== value);
//     }
    
//     onFilterChange(filterName, newValues);
//   };

//   const handleRangeChange = (filterName, value) => {
//     const numValue = value === '' ? null : parseInt(value, 10);
//     onFilterChange(filterName, numValue);
//   };

//   const handleDateChange = (filterName, value) => {
//     onFilterChange(filterName, value);
//   };

//   return (
//     <div>
//       {/* Customer Region Filter */}
//       <div className="filter-group">
//         <h4>Customer Region</h4>
//         <div className="multi-select">
//           {filterOptions.customer_regions?.map(region => (
//             <label key={region} className="checkbox-label">
//               <input
//                 type="checkbox"
//                 checked={filters.customer_region?.includes(region)}
//                 onChange={(e) => handleMultiSelect('customer_region', region, e.target.checked)}
//               />
//               {region}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Gender Filter */}
//       <div className="filter-group">
//         <h4>Gender</h4>
//         <div className="multi-select">
//           {filterOptions.genders?.map(gender => (
//             <label key={gender} className="checkbox-label">
//               <input
//                 type="checkbox"
//                 checked={filters.gender?.includes(gender)}
//                 onChange={(e) => handleMultiSelect('gender', gender, e.target.checked)}
//               />
//               {gender}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Age Range Filter */}
//       <div className="filter-group">
//         <h4>Age Range</h4>
//         <div className="range-inputs">
//           <input
//             type="number"
//             className="range-input"
//             placeholder="Min Age"
//             min="0"
//             max="100"
//             value={filters.age_min || ''}
//             onChange={(e) => handleRangeChange('age_min', e.target.value)}
//           />
//           <span>to</span>
//           <input
//             type="number"
//             className="range-input"
//             placeholder="Max Age"
//             min="0"
//             max="100"
//             value={filters.age_max || ''}
//             onChange={(e) => handleRangeChange('age_max', e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Product Category Filter */}
//       <div className="filter-group">
//         <h4>Product Category</h4>
//         <div className="multi-select">
//           {filterOptions.product_categories?.map(category => (
//             <label key={category} className="checkbox-label">
//               <input
//                 type="checkbox"
//                 checked={filters.product_category?.includes(category)}
//                 onChange={(e) => handleMultiSelect('product_category', category, e.target.checked)}
//               />
//               {category}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Payment Method Filter */}
//       <div className="filter-group">
//         <h4>Payment Method</h4>
//         <div className="multi-select">
//           {filterOptions.payment_methods?.map(method => (
//             <label key={method} className="checkbox-label">
//               <input
//                 type="checkbox"
//                 checked={filters.payment_method?.includes(method)}
//                 onChange={(e) => handleMultiSelect('payment_method', method, e.target.checked)}
//               />
//               {method}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Date Range Filter */}
//       <div className="filter-group">
//         <h4>Date Range</h4>
//         <div className="date-inputs">
//           <input
//             type="date"
//             className="date-input"
//             value={filters.date_start}
//             onChange={(e) => handleDateChange('date_start', e.target.value)}
//           />
//           <input
//             type="date"
//             className="date-input"
//             value={filters.date_end}
//             onChange={(e) => handleDateChange('date_end', e.target.value)}
//           />
//         </div>
//       </div>

//       <button 
//         onClick={onClear}
//         style={{
//           width: '100%',
//           padding: '10px',
//           background: '#6c757d',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer',
//           marginTop: '20px'
//         }}
//       >
//         Clear All Filters
//       </button>
//     </div>
//   );
// }

// export default FilterPanel;
import React from 'react';

function FilterPanel({ filters, filterOptions, onFilterChange, onClear }) {
  const handleMultiSelect = (filterName, value, checked) => {
    const currentValues = filters[filterName] || [];
    let newValues;
    
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    
    onFilterChange(filterName, newValues);
  };

  const handleRangeChange = (filterName, value) => {
    const numValue = value === '' ? null : parseInt(value, 10);
    onFilterChange(filterName, numValue);
  };

  const handleDateChange = (filterName, value) => {
    onFilterChange(filterName, value);
  };

  return (
    <div className="space-y-6">
      {/* Customer Region Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Customer Region</h4>
        <div className="space-y-2">
          {filterOptions.customer_regions?.map(region => (
            <label key={region} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.customer_region?.includes(region)}
                onChange={(e) => handleMultiSelect('customer_region', region, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{region}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Gender</h4>
        <div className="space-y-2">
          {filterOptions.genders?.map(gender => (
            <label key={gender} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.gender?.includes(gender)}
                onChange={(e) => handleMultiSelect('gender', gender, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{gender}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Age Range Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Age Range</h4>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            min="0"
            max="100"
            value={filters.age_min || ''}
            onChange={(e) => handleRangeChange('age_min', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <span className="text-gray-500 text-sm font-medium">to</span>
          <input
            type="number"
            placeholder="Max"
            min="0"
            max="100"
            value={filters.age_max || ''}
            onChange={(e) => handleRangeChange('age_max', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Product Category Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Product Category</h4>
        <div className="space-y-2">
          {filterOptions.product_categories?.map(category => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.product_category?.includes(category)}
                onChange={(e) => handleMultiSelect('product_category', category, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Method Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Payment Method</h4>
        <div className="space-y-2">
          {filterOptions.payment_methods?.map(method => (
            <label key={method} className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.payment_method?.includes(method)}
                onChange={(e) => handleMultiSelect('payment_method', method, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Date Range</h4>
        <div className="space-y-2">
          <input
            type="date"
            value={filters.date_start}
            onChange={(e) => handleDateChange('date_start', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <input
            type="date"
            value={filters.date_end}
            onChange={(e) => handleDateChange('date_end', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <button 
        onClick={onClear}
        className="w-full py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        Clear All Filters
      </button>
    </div>
  );
}

export default FilterPanel;
