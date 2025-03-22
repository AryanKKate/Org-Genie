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
if not GEMINI_API_KEY:
    print("❌ GEMINI_API_KEY is missing!")
    exit()
genai.configure(api_key=GEMINI_API_KEY)

# Connect to MongoDB
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    print("❌ MONGO_URI is missing!")
    exit()

client = pymongo.MongoClient(MONGO_URI)
db = client.get_database("faq_db")  # Replace with your database name
collection = db.get_collection("Faq")  # Replace with your collection name

app = Flask(__name__)

# Load Data from MongoDB
def load_data():
    print("🔹 Fetching data from MongoDB...")
    data = list(collection.find({}))  # Fetch all documents
    
    # if not data:
    #     print("❌ No data found in MongoDB!")
    #     raise ValueError("No data found in MongoDB.")

    # print("✅ Successfully loaded FAQ data:", data[:2])  # Print first 2 records for verification
    # return data

try:
    faq_data = load_data()
    questions = [item['question'] for item in faq_data]
    answers = [item['answer'] for item in faq_data]
except ValueError as e:
    print(str(e))
    faq_data, questions, answers = [], [], []

# Create Embeddings and Build FAISS Index
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

if questions:
    question_embeddings = embedding_model.encode(questions)
    dimension = question_embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(question_embeddings))
else:
    print("⚠️ No questions available for indexing.")
    index = None

@app.route('/query', methods=['POST'])
def retrieve_and_generate():
    try:
        query = request.json.get('query')
        if not query:
            return jsonify({"error": "Query is missing"}), 400

        print("🔹 Received Query:", query)

        if not questions:
            return jsonify({"error": "FAQ database is empty"}), 500

        # Generate Query Embedding and Search in FAISS
        query_embedding = embedding_model.encode([query])
        _, index_result = index.search(np.array(query_embedding), 3)

        print("🔹 FAISS Search Results:", index_result)

        if index_result[0][0] == -1:
            return jsonify({"error": "No relevant FAQ found."}), 404

        matched_index = index_result[0][0]
        retrieved_question = questions[matched_index]
        retrieved_answer = answers[matched_index]

        print(f"✅ Matched FAQ: {retrieved_question} → {retrieved_answer}")

        # Prepare prompt for Gemini API
        context = f"Question: {retrieved_question}\nAnswer: {retrieved_answer}"
        prompt = f"""
        You are a helpful assistant providing clear and concise answers using the given FAQ context. 
        Give all info you have about the topic. 
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
        print("❌ Error in retrieve_and_generate:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5001)
