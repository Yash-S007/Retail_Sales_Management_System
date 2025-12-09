import uvicorn

if __name__ == "__main__":
    # This will run your FastAPI app from src/main.py
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)