from pymongo import MongoClient
from typing import Optional, List, Dict, Any
import traceback

class MongoSalesManager:
    """Sales data manager using MongoDB"""
    
    def __init__(self, connection_string='mongodb://localhost:27017/'):
        self.client = MongoClient(connection_string)
        self.db = self.client['retail_sales_db']
        self.collection = self.db['sales']
        self.total_records = 0
        self.unique_values = {}
        self._load_metadata()
    
    def _load_metadata(self):
        """Load metadata and unique values"""
        try:
            # Get total count
            self.total_records = self.collection.count_documents({})
            print(f"✓ Total records in MongoDB: {self.total_records:,}")
            
            # Get unique values for filters
            self.unique_values = {
                'customer_regions': sorted([x for x in self.collection.distinct('customer_region') if x]),
                'genders': sorted([x for x in self.collection.distinct('gender') if x]),
                'product_categories': sorted([x for x in self.collection.distinct('product_category') if x]),
                'payment_methods': sorted([x for x in self.collection.distinct('payment_method') if x]),
                'tags': []
            }
            
            print(f"✓ Loaded filter options from MongoDB")
            
        except Exception as e:
            print(f"✗ Error loading metadata: {str(e)}")
            traceback.print_exc()
    
    def search_and_filter(self, filters=None, search_text="", page=1, page_size=50, sort_by="date"):
        """Search and filter data from MongoDB"""
        try:
            filters = filters or {}
            
            # Build MongoDB query
            query = {}
            
            # Search filter
            if search_text:
                query['$or'] = [
                    {'customer_name': {'$regex': search_text, '$options': 'i'}},
                    {'phone_number': {'$regex': search_text, '$options': 'i'}}
                ]
            
            # Multi-select filters
            for field in ['customer_region', 'gender', 'product_category', 'payment_method']:
                if field in filters and filters[field]:
                    query[field] = {'$in': filters[field]}
            
            # Age range
            if 'age_min' in filters and filters['age_min'] is not None:
                query['age'] = query.get('age', {})
                query['age']['$gte'] = filters['age_min']
            
            if 'age_max' in filters and filters['age_max'] is not None:
                query['age'] = query.get('age', {})
                query['age']['$lte'] = filters['age_max']
            
            # Date range
            if 'date_start' in filters and filters['date_start']:
                query['date'] = query.get('date', {})
                query['date']['$gte'] = filters['date_start']
            
            if 'date_end' in filters and filters['date_end']:
                query['date'] = query.get('date', {})
                query['date']['$lte'] = filters['date_end']
            
            # Get total count for filtered results
            total_items = self.collection.count_documents(query)
            
            # Calculate pagination
            total_pages = (total_items + page_size - 1) // page_size if total_items > 0 else 0
            skip = (page - 1) * page_size
            
            # Apply sorting
            sort_field = 'date'
            sort_direction = -1  # descending
            
            if sort_by == 'quantity':
                sort_field = 'quantity'
                sort_direction = -1
            elif sort_by == 'customer_name':
                sort_field = 'customer_name'
                sort_direction = 1  # ascending for names
            
            # Query MongoDB with pagination and sorting
            cursor = self.collection.find(query, {'_id': 0}).sort(sort_field, sort_direction).skip(skip).limit(page_size)
            
            # Convert to list
            data = list(cursor)
            
            return {
                'data': data,
                'total': total_items,
                'page': page,
                'page_size': page_size,
                'total_pages': total_pages,
                'filters': filters,
                'search': search_text,
                'sort_by': sort_by
            }
            
        except Exception as e:
            print(f"✗ Error in search_and_filter: {str(e)}")
            traceback.print_exc()
            return {
                'data': [],
                'total': 0,
                'page': page,
                'page_size': page_size,
                'total_pages': 0,
                'error': str(e)
            }
    
    def get_stats(self, filters=None, search_text=""):
        """Get aggregated stats using MongoDB aggregation pipeline"""
        try:
            filters = filters or {}
            
            # Build MongoDB query (same as search_and_filter)
            query = {}
            
            # Search filter
            if search_text:
                query['$or'] = [
                    {'customer_name': {'$regex': search_text, '$options': 'i'}},
                    {'phone_number': {'$regex': search_text, '$options': 'i'}}
                ]
            
            # Multi-select filters
            for field in ['customer_region', 'gender', 'product_category', 'payment_method']:
                if field in filters and filters[field]:
                    query[field] = {'$in': filters[field]}
            
            # Age range
            if 'age_min' in filters and filters['age_min'] is not None:
                query['age'] = query.get('age', {})
                query['age']['$gte'] = filters['age_min']
            
            if 'age_max' in filters and filters['age_max'] is not None:
                query['age'] = query.get('age', {})
                query['age']['$lte'] = filters['age_max']
            
            # Date range
            if 'date_start' in filters and filters['date_start']:
                query['date'] = query.get('date', {})
                query['date']['$gte'] = filters['date_start']
            
            if 'date_end' in filters and filters['date_end']:
                query['date'] = query.get('date', {})
                query['date']['$lte'] = filters['date_end']
            
            # Use MongoDB aggregation pipeline for stats
            pipeline = [
                {'$match': query},
                {
                    '$group': {
                        '_id': None,
                        'total_units': {'$sum': '$quantity'},
                        'total_amount': {'$sum': '$final_amount'},
                        'total_discount': {
                            '$sum': {
                                '$subtract': ['$total_amount', '$final_amount']
                            }
                        }
                    }
                }
            ]
            
            result = list(self.collection.aggregate(pipeline))
            
            if result:
                stats = result[0]
                return {
                    'total_units': int(stats.get('total_units', 0)),
                    'total_amount': round(float(stats.get('total_amount', 0)), 2),
                    'total_discount': round(float(stats.get('total_discount', 0)), 2)
                }
            else:
                return {
                    'total_units': 0,
                    'total_amount': 0,
                    'total_discount': 0
                }
            
        except Exception as e:
            print(f"✗ Error calculating stats: {str(e)}")
            traceback.print_exc()
            return {
                'total_units': 0,
                'total_amount': 0,
                'total_discount': 0,
                'error': str(e)
            }


# Global instance
sales_manager = None

def get_sales_manager():
    """Get or create the global sales manager instance"""
    global sales_manager
    if sales_manager is None:
        sales_manager = MongoSalesManager()
    return sales_manager