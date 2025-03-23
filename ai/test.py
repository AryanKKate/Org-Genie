import pymongo
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    print("   MONGO_URI is not set in .env!")
    exit()

client = pymongo.MongoClient(MONGO_URI)
db = client.get_database("faq_db")  # Replace with your DB name
collection = db.get_collection("Faq")  # Replace with your collection name

# Fetch FAQs
faqs = list(collection.find({}))  # Try without {"_id": 0}
if not faqs:
    print("   No FAQs found in MongoDB!")
else:
    print("  FAQs found:", faqs[:2])  # Print first 2 for verification
