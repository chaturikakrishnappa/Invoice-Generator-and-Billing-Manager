from pymongo import MongoClient
import os

mongo_client = None
db = None

def init_db(app):
    global mongo_client, db
    
    # Use environment variable directly, fallback to None so it fails properly if missing
    uri = os.getenv("MONGO_URI")
    
    if not uri:
        print("ERROR: MONGO_URI environment variable is not set. Please check your .env file.")
        return
    
    try:
        mongo_client = MongoClient(uri)
        # Check connection
        mongo_client.admin.command('ping')
        print("Connected to MongoDB successfully!")
        
        # Determine db name from URI or default to 'invoicepro'
        db_name = uri.split("/")[-1].split("?")[0]
        if not db_name:
            db_name = 'invoicepro'
            
        db = mongo_client[db_name]
    except Exception as e:
        print("Failed to connect to MongoDB! Error:")
        print(f"--> {e}")
        # Do not crash the app, let it run, just print the error

def get_db():
    if db is None:
        raise Exception("Database not initialized or failed to connect.")
    return db
