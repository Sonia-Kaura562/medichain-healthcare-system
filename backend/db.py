from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

db = client["medichain"]

users_collection = db["users"]

doctors_collection = db["doctors"]

hospitals_collection = db["hospitals"]

records_collection = db["records"]

summary_collection = db["summary"]

audit_collection = db["audit_logs"]

access_collection = db["access_control"]

sessions_collection = db["sessions"]