import os
import numpy as np
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import faiss
import pymongo
from bson.objectid import ObjectId  # Correct import for ObjectId
import google.generativeai as genai
import traceback

# Load Environment Variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = pymongo.MongoClient(MONGO_URI)
db = client.get_database("faq_db")
collection = db.get_collection("Faq")

app = Flask(__name__)

# Load Data from MongoDB
def load_data():
    data = list(collection.find({}))  # Keep the ObjectIds
    if not data:
        raise ValueError("No data found in MongoDB.")
    return data

# Initialize with data
try:
    faq_data = load_data()
    questions = [item['question'] for item in faq_data]
    answers = [item['answer'] for item in faq_data]
    categories = [item['category'] for item in faq_data]
    hits = [item['hit'] for item in faq_data]
    ids = [str(item['_id']) for item in faq_data]  # Convert ObjectId to string for later use

    # Create Embeddings and Build FAISS Index
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    question_embeddings = embedding_model.encode(questions)

    dimension = question_embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(question_embeddings))
except Exception as e:
    print(f"Initialization error: {str(e)}")
    print(traceback.format_exc())

@app.route('/query', methods=['POST'])
def retrieve_and_generate():
    try:
        query = request.json.get('query')
        if not query:
            return jsonify({"error": "Query is missing"}), 400

        # Generate Query Embedding and Search in FAISS
        query_embedding = embedding_model.encode([query])
        _, index_result = index.search(np.array(query_embedding), 3)
        matched_index = index_result[0][0]

        # Retrieve Context
        retrieved_question = questions[matched_index]
        retrieved_answer = answers[matched_index]
        retrieved_category = categories[matched_index]
        retrieved_hit = hits[matched_index]
        matched_id = ids[matched_index]  # This is now a string representation of ObjectId
        
        # Update hit count
        collection.update_one(
            {"_id": ObjectId(matched_id)},  # Use the correct ObjectId class
            {"$inc": {"hit": 1}}
        )

        context = f"Question: {retrieved_question}\nAnswer: {retrieved_answer}\nCategory: {retrieved_category}"

        prompt = f"""
You are a helpful assistant providing clear and concise answers using the given FAQ context. Give all info what you have about the topic.
If the FAQ context is sufficient to answer the user's query, respond directly.
If the context is irrelevant, say 'I'm sorry, I couldn't find the answer in the FAQ.'
Do not speculate beyond the context.

User Query: {query}
FAQ Context: {context}
Provide a concise and direct response based on the FAQ.
"""

        # Generate Response Using Gemini API
        model = genai.GenerativeModel("gemini-2.0-flash-lite-001")
        response = model.generate_content(prompt)
        
        # Return response with category
        return jsonify({
            "response": response.text,
            "category": retrieved_category
        })
    except Exception as e:
        print(f"Query error: {str(e)}")
        print(traceback.format_exc())  # Print full stack trace for debugging
        return jsonify({"error": str(e)}), 500

# Add a simple health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(port=5001, debug=True)  # Enable debug mode for better error reporting