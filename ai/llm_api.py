import os
import numpy as np
import traceback
import threading
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import faiss
import pymongo
from bson.objectid import ObjectId  
import google.generativeai as genai

# Load Environment Variables
load_dotenv()

# Initialize Embedding Model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = pymongo.MongoClient(MONGO_URI)
db = client.get_database("faq_db")
collection = db.get_collection("Faq")

# FAISS Index File Path (Not required to delete manually)
FAISS_INDEX_PATH = "faiss_index.bin"

app = Flask(__name__)

# Thread lock for FAISS updates
faiss_lock = threading.Lock()

def load_data():
    """Load all FAQs from MongoDB."""
    return list(collection.find({}))

def rebuild_faiss():
    """Rebuild FAISS index with latest MongoDB data."""
    global index, questions, answers, categories, hits, ids

    with faiss_lock:  # Ensure thread safety
        try:
            print("🔄 Refreshing FAISS index...")

            faq_data = load_data()
            if not faq_data:
                raise ValueError("No data found in MongoDB.")

            questions = [item['question'] for item in faq_data]
            answers = [item['answer'] for item in faq_data]
            categories = [item['category'] for item in faq_data]
            hits = [item.get('hit', 0) for item in faq_data]  
            ids = [str(item['_id']) for item in faq_data]

            # Encode new questions
            question_embeddings = embedding_model.encode(questions)
            dimension = question_embeddings.shape[1]

            # Create and populate FAISS index
            index = faiss.IndexFlatL2(dimension)
            index.add(np.array(question_embeddings))  

            print("✅ FAISS index refreshed successfully.")

        except Exception as e:
            print(f" FAISS Refresh Error: {str(e)}")
            print(traceback.format_exc())

# Initial FAISS build
rebuild_faiss()

@app.route('/update_index', methods=['POST'])
def update_faiss_index():
    """Rebuild FAISS index with the latest data from MongoDB."""
    try:
        print(" Updating FAISS index...")
        rebuild_faiss()
        return jsonify({"message": "FAISS index updated successfully"}), 200
    except Exception as e:
        print(f" FAISS Update Error: {str(e)}")
        return jsonify({"error": str(e)}), 500



@app.route('/query', methods=['POST'])
def retrieve_and_generate():
    """Handle user queries using FAISS and Gemini API."""
    try:
        if index is None:
            return jsonify({"error": "FAISS index not initialized"}), 500

        query = request.json.get('query')
        if not query:
            return jsonify({"error": "Query is missing"}), 400

        # Search in FAISS
        query_embedding = embedding_model.encode([query])
        _, index_result = index.search(np.array(query_embedding), 3)

        if len(index_result[0]) == 0 or index_result[0][0] == -1:
            return jsonify({"response": "I'm sorry, I couldn't find the answer in the FAQ."})

        matched_index = index_result[0][0]

        # Retrieve matched data
        retrieved_question = questions[matched_index]
        retrieved_answer = answers[matched_index]
        retrieved_category = categories[matched_index]
        matched_id = ids[matched_index]  

        # Update hit count
        collection.update_one({"_id": ObjectId(matched_id)}, {"$inc": {"hit": 1}})

        context = f"Question: {retrieved_question}\nAnswer: {retrieved_answer}\nCategory: {retrieved_category}"

        prompt = f"""
You are a helpful assistant providing clear and concise answers using the given FAQ context.
If the FAQ context is sufficient to answer the user's query, respond directly.
If the context is irrelevant, say 'I'm sorry, I couldn't find the answer in the FAQ.'
Do not speculate beyond the context.

User Query: {query}
FAQ Context: {context}
Provide a concise and direct response based on the FAQ.
"""

        # Generate response using Gemini API
        model = genai.GenerativeModel("gemini-2.0-flash-lite-001")
        response = model.generate_content(prompt)

        return jsonify({
            "response": response.text,
            "category": retrieved_category
        })

    except Exception as e:
        print(f"🚨 Query error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check API."""
    return jsonify({"status": "ok"})

# Run Flask App
if __name__ == '__main__':
    app.run(port=5001, debug=True)
