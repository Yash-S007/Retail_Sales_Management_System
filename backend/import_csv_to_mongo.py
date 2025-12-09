import pandas as pd
from pymongo import MongoClient
from datetime import datetime
import os

def import_csv_to_mongodb():
    """Import CSV data into MongoDB"""
    
    # MongoDB connection
    client = MongoClient('mongodb://localhost:27017/')
    db = client['retail_sales_db']
    collection = db['sales']
    
    print("🔗 Connected to MongoDB")
    
    # Find CSV file
    possible_paths = [
        'sales_data.csv',
        os.path.join('src', 'sales_data.csv'),
        os.path.join('backend', 'sales_data.csv'),
        os.path.join('backend', 'src', 'sales_data.csv')
    ]
    
    csv_path = None
    for path in possible_paths:
        if os.path.exists(path):
            csv_path = path
            break
    
    if not csv_path:
        print("❌ CSV file not found!")
        print("Searched in:")
        for path in possible_paths:
            print(f"  - {os.path.abspath(path)}")
        return
    
    print(f"✅ Found CSV at: {os.path.abspath(csv_path)}")
    
    # Clear existing data
    collection.delete_many({})
    print("🗑️  Cleared existing data")
    
    # Read CSV in chunks for efficiency
    chunk_size = 10000
    total_imported = 0
    
    print("📥 Starting import...")
    
    for chunk_num, chunk in enumerate(pd.read_csv(csv_path, chunksize=chunk_size)):
        # Clean column names
        chunk.columns = chunk.columns.str.strip().str.lower().str.replace(' ', '_')
        
        # Convert date column
        if 'date' in chunk.columns:
            chunk['date'] = pd.to_datetime(chunk['date'], format='%d-%m-%Y', errors='coerce')
            chunk['date'] = chunk['date'].dt.strftime('%Y-%m-%d')
        
        # Convert numeric columns
        numeric_columns = ['age', 'quantity', 'price_per_unit', 'discount_percentage', 'total_amount', 'final_amount']
        for col in numeric_columns:
            if col in chunk.columns:
                chunk[col] = pd.to_numeric(chunk[col], errors='coerce')
        
        # Convert to dict and insert
        records = chunk.to_dict('records')
        
        # Remove NaN values (convert to None for MongoDB)
        for record in records:
            for key, value in list(record.items()):
                if pd.isna(value):
                    record[key] = None
        
        collection.insert_many(records)
        total_imported += len(records)
        
        print(f"✅ Imported chunk {chunk_num + 1}: {total_imported:,} records so far...")
    
    print(f"\n🎉 Import complete! Total records: {total_imported:,}")
    
    # Create indexes for better performance
    print("\n📊 Creating indexes for faster queries...")
    collection.create_index('date')
    collection.create_index('customer_name')
    collection.create_index('customer_region')
    collection.create_index('gender')
    collection.create_index('product_category')
    collection.create_index('payment_method')
    collection.create_index('phone_number')
    collection.create_index('transaction_id')
    
    print("✅ Indexes created")
    
    # Show sample data
    print("\n📋 Sample record:")
    sample = collection.find_one()
    if sample:
        for key, value in list(sample.items())[:10]:  # Show first 10 fields
            print(f"  {key}: {value}")
    
    print("\n✨ All done! You can now:")
    print("   1. Open MongoDB Compass")
    print("   2. Connect to: mongodb://localhost:27017/")
    print("   3. View database: retail_sales_db")
    print("   4. View collection: sales")
    print("\n🚀 Now run the new backend with: python main.py")

if __name__ == "__main__":
    import_csv_to_mongodb()