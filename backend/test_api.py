import requests
import json

print("="*60)
print("🔍 API Diagnostic Tool")
print("="*60)

BASE_URL = "http://localhost:8000"

def test_endpoint(name, url):
    """Test an API endpoint"""
    print(f"\n📡 Testing: {name}")
    print(f"   URL: {url}")
    try:
        response = requests.get(url, timeout=5)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success!")
            
            # Show relevant info based on endpoint
            if "total" in data:
                print(f"   📊 Total Records: {data.get('total', 0)}")
            if "data" in data:
                print(f"   📋 Data Length: {len(data.get('data', []))}")
                if len(data.get('data', [])) > 0:
                    print(f"   📝 First Record Keys: {list(data['data'][0].keys())[:5]}...")
            
            # Print a preview of the response
            print(f"\n   Response Preview:")
            print(f"   {json.dumps(data, indent=2)[:500]}...")
            
        else:
            print(f"   ❌ Failed!")
            print(f"   Response: {response.text[:200]}")
            
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Connection Error - Is the server running?")
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")

# Run tests
print("\n" + "="*60)
print("Starting Tests...")
print("="*60)

test_endpoint("Root Endpoint", f"{BASE_URL}/")
test_endpoint("Health Check", f"{BASE_URL}/api/health")
test_endpoint("Filter Options", f"{BASE_URL}/api/filter-options")
test_endpoint("Sales Data (Page 1)", f"{BASE_URL}/api/sales?page=1&page_size=5")
test_endpoint("Search Endpoint", f"{BASE_URL}/api/sales/search?page=1&page_size=5")
test_endpoint("Stats Endpoint", f"{BASE_URL}/api/sales/stats")

print("\n" + "="*60)
print("✅ Diagnostic Complete!")
print("="*60)
print("\nIf all tests passed, the API is working correctly.")
print("Check your frontend configuration if data still not showing.")