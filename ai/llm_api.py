import os

import numpy as np
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import faiss
import google.generativeai as genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__)

# Sample Data
faq_data = [
    {"question": "How does IDMS generate audit reports?", "answer": "IDMS generates reports using AI algorithms."},
    {"question": "What is IDMS?", "answer": "IDMS is an Intelligent Data Management System."}
]

questions = [item['question'] for item in faq_data]
answers = [item['answer'] for item in faq_data]

# Create embeddings
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
question_embeddings = embedding_model.encode(questions)

dimension = question_embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(np.array(question_embeddings))

@app.route('/query', methods=['POST'])
def retrieve_and_generate():
    query = request.json.get('query')

    query_embedding = embedding_model.encode([query])
    _, index_result = index.search(np.array(query_embedding), 3)
    matched_index = index_result[0][0]

    retrieved_question = questions[matched_index]
    retrieved_answer = answers[matched_index]

    context = f"Question: {retrieved_question}\nAnswer: {retrieved_answer}"
    prompt = f"User Query: {query}\nFAQ Context: {context}\nProvide a helpful response."

    response = genai.GenerativeModel("gemini-2.0-flash-lite-001").generate_content(prompt)
    
    return jsonify({"response": response.text})

if __name__ == '__main__':
    app.run(port=5001)
