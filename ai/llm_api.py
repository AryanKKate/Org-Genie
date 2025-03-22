import os
import numpy as np
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import faiss
import pymongo
import google.generativeai as genai

# Load Environment Variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI")
client = pymongo.MongoClient(MONGO_URI)
db = client.get_database("faq_db")  # Replace with your database name
collection = db.get_collection("Faq")  # Replace with your collection name

app = Flask(__name__)

# Load Data from MongoDB
def load_data():
    data = list(collection.find({}, {"_id": 0}))  # Exclude ObjectId
    if not data:
        raise ValueError("No data found in MongoDB.")
    return data

faq_data = load_data()
questions = [item['question'] for item in faq_data]
answers = [item['answer'] for item in faq_data]

# Create Embeddings and Build FAISS Index
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
question_embeddings = embedding_model.encode(questions)

dimension = question_embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(question_embeddings))

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

        context = f"Question: {retrieved_question}\nAnswer: {retrieved_answer}"
     
        prompt = f"""
You are a helpful assistant providing clear and concise answers using the given FAQ context. 
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

        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
