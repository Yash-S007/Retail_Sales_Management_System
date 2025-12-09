from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from datetime import datetime
import sys
import traceback

# Import MongoDB manager
from mongo_data_manager import get_sales_manager

app = FastAPI(title="Retail Sales Management API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global manager instance
sales_manager = None

def log_checkpoint(checkpoint_name, status, details=""):
    """Log checkpoint with timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    symbol = "✅" if status == "success" else "❌" if status == "error" else "⏳"
    print(f"[{timestamp}] {symbol} CHECKPOINT: {checkpoint_name} - {details}")
    sys.stdout.flush()

def initialize_manager():
    """Initialize the sales data manager"""
    global sales_manager
    
    log_checkpoint("INITIALIZE", "info", "Initializing MongoSalesManager...")
    
    try:
        sales_manager = get_sales_manager()
        
        if sales_manager.total_records == 0:
            log_checkpoint("INITIALIZE", "error", "No records found in MongoDB!")
            log_checkpoint("INITIALIZE", "info", "Run: python import_csv_to_mongo.py first!")
            return False
        
        log_checkpoint("INITIALIZE", "success", 
                      f"✅ Manager initialized. Total records: {sales_manager.total_records:,}")
        
        return True
    except Exception as e:
        log_checkpoint("INITIALIZE", "error", f"Error initializing manager: {str(e)}")
        traceback.print_exc()
        return False

# Initialize on startup
@app.on_event("startup")
async def startup_event():
    log_checkpoint("STARTUP", "info", "FastAPI startup triggered")
    success = initialize_manager()
    if success:
        log_checkpoint("STARTUP", "success", "🚀 Server is ready to accept requests!")
    else:
        log_checkpoint("STARTUP", "error", "⚠️ Server started but initialization failed")

@app.get("/")
def root():
    """Root endpoint with comprehensive status"""
    log_checkpoint("ROOT", "info", "Root endpoint accessed")
    
    try:
        if not sales_manager:
            return {
                "message": "Retail Sales Management API",
                "status": "error",
                "error": "Manager not initialized. Run import_csv_to_mongo.py first!"
            }
        
        return {
            "message": "Retail Sales Management API",
            "status": "running",
            "manager_initialized": True,
            "total_records": sales_manager.total_records,
            "unique_values_summary": {
                k: len(v) for k, v in sales_manager.unique_values.items()
            },
            "available_endpoints": {
                "sales_data": "/api/sales",
                "search_data": "/api/sales/search",
                "stats": "/api/sales/stats",
                "filter_options": "/api/filter-options",
                "health_check": "/api/health"
            }
        }
        
    except Exception as e:
        log_checkpoint("ROOT", "error", f"Error: {str(e)}")
        return {
            "message": "Retail Sales Management API",
            "status": "error",
            "error": str(e)
        }

@app.get("/api/sales")
def get_sales(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    sort_by: str = Query("date", description="Sort by field: date, quantity, or customer_name")
):
    """Get paginated sales data"""
    log_checkpoint("SALES", "info", f"Sales endpoint: page={page}, size={page_size}, sort={sort_by}")
    
    try:
        if not sales_manager:
            return {
                "error": "Sales manager not initialized",
                "data": [],
                "total": 0
            }
        
        # Use MongoDB search with no filters
        result = sales_manager.search_and_filter(
            filters={},
            search_text="",
            page=page,
            page_size=page_size,
            sort_by=sort_by
        )
        
        log_checkpoint("SALES", "success", f"Returning {len(result['data'])} records")
        return result
        
    except Exception as e:
        log_checkpoint("SALES", "error", f"Error: {str(e)}")
        traceback.print_exc()
        return {
            "error": str(e),
            "data": [],
            "total": 0
        }

@app.get("/api/sales/search")
def search_sales(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    sort_by: str = Query("date", description="Sort by field: date, quantity, or customer_name"),
    search_text: str = Query("", description="Search in customer name and phone"),
    customer_region: Optional[str] = Query(None, description="Comma-separated regions"),
    gender: Optional[str] = Query(None, description="Comma-separated genders"),
    product_category: Optional[str] = Query(None, description="Comma-separated categories"),
    payment_method: Optional[str] = Query(None, description="Comma-separated payment methods"),
    tags: Optional[str] = Query(None, description="Comma-separated tags"),
    age_min: Optional[int] = Query(None, ge=0, le=120),
    age_max: Optional[int] = Query(None, ge=0, le=120),
    date_start: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    date_end: Optional[str] = Query(None, description="End date (YYYY-MM-DD)")
):
    """Search and filter sales data with all filters"""
    log_checkpoint("SEARCH", "info", f"Search endpoint: page={page}, search='{search_text}'")
    
    try:
        if not sales_manager:
            return {
                "error": "Sales manager not initialized",
                "data": [],
                "total": 0
            }
        
        # Build filters dictionary
        filters = {}
        
        # Handle multi-select filters (comma-separated strings)
        if customer_region:
            filters['customer_region'] = [r.strip() for r in customer_region.split(',')]
        if gender:
            filters['gender'] = [g.strip() for g in gender.split(',')]
        if product_category:
            filters['product_category'] = [c.strip() for c in product_category.split(',')]
        if payment_method:
            filters['payment_method'] = [p.strip() for p in payment_method.split(',')]
        if tags:
            filters['tags'] = [t.strip() for t in tags.split(',')]
        
        # Handle range filters
        if age_min is not None:
            filters['age_min'] = age_min
        if age_max is not None:
            filters['age_max'] = age_max
        if date_start:
            filters['date_start'] = date_start
        if date_end:
            filters['date_end'] = date_end
        
        # Use the manager's search_and_filter method
        result = sales_manager.search_and_filter(
            filters=filters,
            search_text=search_text,
            page=page,
            page_size=page_size,
            sort_by=sort_by
        )
        
        log_checkpoint("SEARCH", "success", 
                      f"Found {result['total']} matches, returning {len(result['data'])}")
        
        return result
        
    except Exception as e:
        log_checkpoint("SEARCH", "error", f"Error: {str(e)}")
        traceback.print_exc()
        return {
            "error": str(e),
            "data": [],
            "total": 0
        }

@app.get("/api/filter-options")
def get_filter_options():
    """Get unique values for filters"""
    log_checkpoint("FILTER_OPTIONS", "info", "Filter options endpoint accessed")
    
    if not sales_manager:
        return {"error": "Sales manager not initialized"}
    
    return {
        "customer_regions": sales_manager.unique_values.get('customer_regions', []),
        "genders": sales_manager.unique_values.get('genders', []),
        "product_categories": sales_manager.unique_values.get('product_categories', []),
        "payment_methods": sales_manager.unique_values.get('payment_methods', []),
        "tags": sales_manager.unique_values.get('tags', [])
    }

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    log_checkpoint("HEALTH", "info", "Health check endpoint accessed")
    
    try:
        if not sales_manager:
            return {
                "status": "unhealthy",
                "manager_initialized": False,
                "error": "Sales manager not initialized"
            }
        
        return {
            "status": "healthy",
            "manager_initialized": True,
            "total_records": sales_manager.total_records,
            "database": "MongoDB",
            "db_name": "retail_sales_db",
            "collection": "sales"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

@app.get("/api/sales/stats")
def get_sales_stats(
    search_text: str = Query("", description="Search in customer name and phone"),
    customer_region: Optional[str] = Query(None),
    gender: Optional[str] = Query(None),
    product_category: Optional[str] = Query(None),
    payment_method: Optional[str] = Query(None),
    tags: Optional[str] = Query(None),
    age_min: Optional[int] = Query(None, ge=0, le=120),
    age_max: Optional[int] = Query(None, ge=0, le=120),
    date_start: Optional[str] = Query(None),
    date_end: Optional[str] = Query(None)
):
    """Get aggregated stats for filtered data"""
    log_checkpoint("STATS", "info", "Stats endpoint accessed")
    
    try:
        if not sales_manager:
            return {
                "error": "Sales manager not initialized",
                "total_units": 0,
                "total_amount": 0,
                "total_discount": 0
            }
        
        # Build filters
        filters = {}
        if customer_region:
            filters['customer_region'] = [r.strip() for r in customer_region.split(',')]
        if gender:
            filters['gender'] = [g.strip() for g in gender.split(',')]
        if product_category:
            filters['product_category'] = [c.strip() for c in product_category.split(',')]
        if payment_method:
            filters['payment_method'] = [p.strip() for p in payment_method.split(',')]
        if tags:
            filters['tags'] = [t.strip() for t in tags.split(',')]
        if age_min is not None:
            filters['age_min'] = age_min
        if age_max is not None:
            filters['age_max'] = age_max
        if date_start:
            filters['date_start'] = date_start
        if date_end:
            filters['date_end'] = date_end
        
        # Use MongoDB aggregation for super fast stats
        result = sales_manager.get_stats(filters=filters, search_text=search_text)
        
        log_checkpoint("STATS", "success", f"Stats calculated: {result}")
        return result
        
    except Exception as e:
        log_checkpoint("STATS", "error", f"Error: {str(e)}")
        traceback.print_exc()
        return {
            "error": str(e),
            "total_units": 0,
            "total_amount": 0,
            "total_discount": 0
        }

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("🚀 Starting Retail Sales Management API")
    print("="*60)
    print("📊 Using MongoDB for data storage")
    print("🌐 API will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)