# Retail Sales Management System

## Overview
A full-stack web application for managing retail sales data with advanced search, filtering, sorting, and pagination capabilities. Built for TruEstate SDE Intern assignment.

## Tech Stack
- **Backend**: FastAPI (Python)
- **Frontend**: React
- **Data Storage**: DB MongoDB
- **API Communication**: RESTful API

## Search Implementation
- Case-insensitive search on Customer Name and Phone Number fields
- Implemented using Python string operations
- Works concurrently with filters and sorting

## Filter Implementation
- Multi-select filters for: Customer Region, Gender, Product Category, Payment Method
- Range filters for: Age, Date
- Tags filter supports comma-separated values
- All filters work independently and in combination

## Sorting Implementation
- Three sort options: Date (newest first), Quantity, Customer Name (A-Z)
- Sorting preserves active search and filter states
- Implemented server-side for efficiency

## Pagination Implementation
- 10 items per page
- Next/Previous navigation
- Maintains all active states (search/filter/sort)
- Shows total records and page count

## Setup Instructions

### Backend Setup
1. Navigate to `backend` folder
2. Create virtual environment: `python -m venv venv`
3. Activate: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Place `sales_data.csv` in backend folder
6. Run: `cd src && python main.py`

### Frontend Setup
1. Navigate to `frontend` folder
2. Install dependencies: `npm install`
3. Run: `npm start`

### Access Application
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Documentation: http://localhost:8000/docs
