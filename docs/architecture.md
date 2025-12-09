# Architecture Documentation

## System Overview
Retail Sales Management System with:
- Backend: FastAPI (Python) for data processing
- Frontend: React for user interface
- Data: CSV file as data source

## Backend Architecture
### Technologies
- FastAPI: Web framework
- Pandas: Data manipulation
- Uvicorn: ASGI server

### Key Components
1. **main.py**: Entry point, defines API endpoints
2. **data_loader.py**: Loads and preprocesses CSV data
3. **sales_service.py**: Core business logic for filtering/sorting/pagination

### API Endpoints
- `GET /api/sales`: Get filtered/sorted/paginated sales data
- `GET /api/filter-options`: Get unique values for filters

## Frontend Architecture
### Technologies
- React: UI library
- Axios: HTTP client
- CSS: Custom styles

### Component Structure
1. **App.jsx**: Main container, manages state
2. **SearchBar.jsx**: Search input component
3. **FilterPanel.jsx**: All filter controls
4. **SalesTable.jsx**: Displays sales data
5. **Pagination.jsx**: Page navigation
6. **SortingDropdown.jsx**: Sort options

## Data Flow
1. Frontend sends HTTP request with query parameters
2. Backend processes request (filter → search → sort → paginate)
3. Backend returns JSON response
4. Frontend updates UI with received data

## State Management
- Search text, filters, sort option, page number stored in React state
- URL query parameters reflect current state
- State preserved during navigation