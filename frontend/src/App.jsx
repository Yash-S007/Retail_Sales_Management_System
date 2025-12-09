// import React, { useState, useEffect } from 'react';
// import SalesTable from './components/SalesTable';

// function App() {
//   const API_BASE_URL = 'http://localhost:8001';
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     // Auto-load data on page load
//     fetch(`${API_BASE_URL}/api/sales?page=1&page_size=10`)
//       .then(r => r.json())
//       .then(d => {
//         console.log('Sales data loaded:', d);
//         setData(d.data);
//         setLoading(false);
//       })
//       .catch(e => {
//         console.error('Error loading data:', e);
//         setLoading(false);
//       });
//   }, []);
  
//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Sales Dashboard</h1>
//       <p>Total records: 1,000,000 | Showing: {data.length}</p>
      
//       {loading ? (
//         <p>Loading sales data...</p>
//       ) : data.length === 0 ? (
//         <p>No data found</p>
//       ) : (
//         <SalesTable data={data} />
//       )}
//     </div>
//   );
// }
// export default App;




// running perefctly below this code



import React, { useState, useEffect } from 'react';
import SalesTable from './components/SalesTable';
import Pagination from './components/Pagination';
import './styles/App.css';

function App() {
  const API_BASE_URL = 'http://localhost:8000';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  
  // Dropdown open states
  const [regionOpen, setRegionOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  
  const [filterOptions, setFilterOptions] = useState({
    customer_regions: [],
    genders: [],
    product_categories: [],
    payment_methods: []
  });
  
  const [stats, setStats] = useState({
    totalUnits: 10,
    totalAmount: 89000,
    totalDiscount: 15000
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/filter-options`)
      .then(r => r.json())
      .then(d => setFilterOptions(d))
      .catch(e => console.error('Error:', e));
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.filter-dropdown')) {
        setRegionOpen(false);
        setGenderOpen(false);
        setCategoryOpen(false);
        setPaymentOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery, sortBy, selectedRegions, selectedGenders, selectedCategories, selectedPayments, ageMin, ageMax, dateStart, dateEnd]);

  const fetchData = () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: currentPage,
      page_size: 10,
      sort_by: sortBy
    });

    if (searchQuery) params.append('search_text', searchQuery);
    if (selectedRegions.length) params.append('customer_region', selectedRegions.join(','));
    if (selectedGenders.length) params.append('gender', selectedGenders.join(','));
    if (selectedCategories.length) params.append('product_category', selectedCategories.join(','));
    if (selectedPayments.length) params.append('payment_method', selectedPayments.join(','));
    if (ageMin) params.append('age_min', ageMin);
    if (ageMax) params.append('age_max', ageMax);
    if (dateStart) params.append('date_start', dateStart);
    if (dateEnd) params.append('date_end', dateEnd);

    fetch(`${API_BASE_URL}/api/sales/search?${params}`)
      .then(r => r.json())
      .then(d => {
        setData(d.data || []);
        setTotalPages(d.total_pages || 1);
        setTotalItems(d.total || 0);
        setLoading(false);
      })
      .catch(e => {
        console.error('Error:', e);
        setLoading(false);
      });
  };

  const clearAllFilters = () => {
    setSelectedRegions([]);
    setSelectedGenders([]);
    setSelectedCategories([]);
    setSelectedPayments([]);
    setAgeMin('');
    setAgeMax('');
    setDateStart('');
    setDateEnd('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const toggleFilter = (array, setArray, value) => {
    if (array.includes(value)) {
      setArray(array.filter(v => v !== value));
    } else {
      setArray([...array, value]);
    }
    setCurrentPage(1);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">V</div>
          <div className="sidebar-user">
            <h3>Vault</h3>
            <p>Anurag Yadav</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-item active">
            <span className="nav-item-icon">📊</span>
            <span>Dashboard</span>
          </div>
          <div className="nav-item">
            <span className="nav-item-icon">🔗</span>
            <span>Nexus</span>
          </div>
          <div className="nav-item">
            <span className="nav-item-icon">📥</span>
            <span>Intake</span>
          </div>
          <div className="nav-item">
            <span className="nav-item-icon">⚙️</span>
            <span>Services</span>
          </div>
          <div className="nav-item">
            <span className="nav-item-icon">📄</span>
            <span>Invoices</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <div className="top-header">
          <h1>Sales Management System</h1>
          <div className="header-right">
            <div className="avatar avatar-1">D</div>
            <div className="avatar avatar-2"></div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search name, phone..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="filter-input"
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
              >
                ✕
              </button>
            )}
          </div>

          <div className={`filter-dropdown ${regionOpen ? 'open' : ''}`}>
            <button 
              className="filter-dropdown-btn"
              onClick={() => setRegionOpen(!regionOpen)}
            >
              Region {selectedRegions.length > 0 && `(${selectedRegions.length})`} ▼
            </button>
            <div className="filter-dropdown-content">
              {filterOptions.customer_regions?.map(r => (
                <label key={r} className="filter-checkbox-label">
                  <input type="checkbox" checked={selectedRegions.includes(r)} onChange={() => toggleFilter(selectedRegions, setSelectedRegions, r)} />
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={`filter-dropdown ${genderOpen ? 'open' : ''}`}>
            <button 
              className="filter-dropdown-btn"
              onClick={() => setGenderOpen(!genderOpen)}
            >
              Gender {selectedGenders.length > 0 && `(${selectedGenders.length})`} ▼
            </button>
            <div className="filter-dropdown-content">
              {filterOptions.genders?.map(g => (
                <label key={g} className="filter-checkbox-label">
                  <input type="checkbox" checked={selectedGenders.includes(g)} onChange={() => toggleFilter(selectedGenders, setSelectedGenders, g)} />
                  <span>{g}</span>
                </label>
              ))}
            </div>
          </div>

          <input type="number" placeholder="Min Age" value={ageMin} onChange={(e) => { setAgeMin(e.target.value); setCurrentPage(1); }} className="filter-input age-input" />
          <input type="number" placeholder="Max Age" value={ageMax} onChange={(e) => { setAgeMax(e.target.value); setCurrentPage(1); }} className="filter-input age-input" />

          <div className={`filter-dropdown ${categoryOpen ? 'open' : ''}`}>
            <button 
              className="filter-dropdown-btn"
              onClick={() => setCategoryOpen(!categoryOpen)}
            >
              Category {selectedCategories.length > 0 && `(${selectedCategories.length})`} ▼
            </button>
            <div className="filter-dropdown-content">
              {filterOptions.product_categories?.map(c => (
                <label key={c} className="filter-checkbox-label">
                  <input type="checkbox" checked={selectedCategories.includes(c)} onChange={() => toggleFilter(selectedCategories, setSelectedCategories, c)} />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={`filter-dropdown ${paymentOpen ? 'open' : ''}`}>
            <button 
              className="filter-dropdown-btn"
              onClick={() => setPaymentOpen(!paymentOpen)}
            >
              Payment {selectedPayments.length > 0 && `(${selectedPayments.length})`} ▼
            </button>
            <div className="filter-dropdown-content">
              {filterOptions.payment_methods?.map(p => (
                <label key={p} className="filter-checkbox-label">
                  <input type="checkbox" checked={selectedPayments.includes(p)} onChange={() => toggleFilter(selectedPayments, setSelectedPayments, p)} />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </div>

          <input type="date" value={dateStart} onChange={(e) => { setDateStart(e.target.value); setCurrentPage(1); }} className="date-input" />
          <input type="date" value={dateEnd} onChange={(e) => { setDateEnd(e.target.value); setCurrentPage(1); }} className="date-input" />

          <button onClick={clearAllFilters} className="clear-btn">Clear All</button>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-input">
            <option value="date">Sort: Date</option>
            <option value="customer_name">Sort: Name</option>
            <option value="quantity">Sort: Quantity</option>
          </select>
        </div>

        {/* Stats */}
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-label">Total Units Sold</div>
              <div className="stat-value">{stats.totalUnits}</div>
            </div>
            <div className="stat-card green">
              <div className="stat-label">Total Amount</div>
              <div className="stat-value">₹{stats.totalAmount.toLocaleString()}</div>
            </div>
            <div className="stat-card purple">
              <div className="stat-label">Total Discount</div>
              <div className="stat-value">₹{stats.totalDiscount.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : (
            <SalesTable data={data} />
          )}
        </div>

        {/* Pagination */}
        <div className="pagination-container">
          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={totalItems} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}

export default App;