import pandas as pd 
def filter_sales_data(data, filters, search_text="", sort_by="date", page=1, page_size=10):
    """
    Filter, search, sort and paginate sales data
    
    Args:
        data: List of sales records
        filters: Dictionary of filters
        search_text: Text to search in customer name and phone
        sort_by: Field to sort by ('date', 'quantity', 'customer_name')
        page: Page number
        page_size: Items per page
    
    Returns:
        Filtered, sorted and paginated data with metadata
    """
    filtered_data = data.copy()
    
    # 1. Apply text search (case-insensitive)
    if search_text:
        search_text = search_text.lower()
        filtered_data = [
            record for record in filtered_data 
            if (search_text in str(record.get('customer_name', '')).lower() or
                search_text in str(record.get('phone_number', '')).lower())
        ]
    
    # 2. Apply filters
    # Multi-select filters
    for filter_field in ['customer_region', 'gender', 'product_category', 'payment_method']:
        if filter_field in filters and filters[filter_field]:
            filtered_data = [
                record for record in filtered_data 
                if str(record.get(filter_field, '')).strip() in filters[filter_field]
            ]
    
    # Tags filter (special case - comma separated)
    if 'tags' in filters and filters['tags']:
        filtered_data = [
            record for record in filtered_data 
            if any(tag in str(record.get('tags', '')).split(',') 
                   for tag in filters['tags'])
        ]
    
    # Age range filter
    if 'age_min' in filters and filters['age_min'] is not None:
        filtered_data = [
            record for record in filtered_data 
            if record.get('age', 0) >= filters['age_min']
        ]
    
    if 'age_max' in filters and filters['age_max'] is not None:
        filtered_data = [
            record for record in filtered_data 
            if record.get('age', 100) <= filters['age_max']
        ]
    
    # Date range filter
    if 'date_start' in filters and filters['date_start']:
        filtered_data = [
            record for record in filtered_data 
            if pd.to_datetime(record.get('date', '')) >= pd.to_datetime(filters['date_start'])
        ]
    
    if 'date_end' in filters and filters['date_end']:
        filtered_data = [
            record for record in filtered_data 
            if pd.to_datetime(record.get('date', '')) <= pd.to_datetime(filters['date_end'])
        ]
    
    # 3. Apply sorting
    if sort_by == 'date':
        filtered_data.sort(key=lambda x: x.get('date', ''), reverse=True)
    elif sort_by == 'quantity':
        filtered_data.sort(key=lambda x: x.get('quantity', 0), reverse=True)
    elif sort_by == 'customer_name':
        filtered_data.sort(key=lambda x: str(x.get('customer_name', '')).lower())
    
    # 4. Apply pagination
    total_items = len(filtered_data)
    total_pages = (total_items + page_size - 1) // page_size
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    
    paginated_data = filtered_data[start_idx:end_idx]
    
    return {
        'data': paginated_data,
        'total': total_items,
        'page': page,
        'page_size': page_size,
        'total_pages': total_pages,
        'filters': filters,
        'search': search_text,
        'sort_by': sort_by
    }