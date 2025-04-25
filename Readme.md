
# Company Knowledge Base

A smart solution for employee training and customer service that provides accurate information by combining historical and real-time data through an advanced RAG-enhanced LLM system.

## About the Project

This project creates an intelligent knowledge platform that helps employees across departments access accurate and timely information. By leveraging both historical and real-time data, it streamlines employee training and automates customer query resolution. The system features a self-updating knowledge base where queries are answered by an advanced Large Language Model (LLM) enhanced with Retrieval-Augmented Generation (RAG) technology.

## Features

- **Interactive Chatbot**: A conversational AI interface that understands natural language queries and provides contextually relevant responses
- **Most Frequently Asked Questions Dashboard**: Visual display of common queries to identify information needs across the organization
- **RAG-based LLM System**: Combines the power of language models with document retrieval to provide accurate, sourced answers
- **Question Count Tracker**: Analytics tool that monitors query patterns to continuously improve the knowledge base
- **Self-updating Knowledge Base**: The system learns from interactions and new data sources to stay current

## Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB

### Setup Instructions
1. Clone the repository
```bash
git clone https://github.com/AryanKKate/Org-Genie
cd Org-Genie
```

2. Install backend dependencies
```bash
pip install -r requirements.txt
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your API keys and database configurations
```

5. Initialize the database
```bash
python scripts/init_db.py
```

6. Start the application
```bash
# Start backend
python app.py

# Start frontend (in a new terminal)
cd frontend
npm start
```

## Usage

### Admin Panel
1. Access the admin panel at `http://localhost:5001/admin`
2. Upload knowledge base documents through the interface
3. Monitor analytics and adjust system settings

### Employee Interface
1. Access the chatbot at `http://localhost:5001`
2. Type questions in natural language
3. View suggested related queries and FAQs
4. Rate responses to help improve the system

## Technologies Used

- **Backend**: Python, node.js
- **Frontend**: React.js
- **Database**: MongoDB
- **AI/ML**: Gemini API, HuggingFace Transformers

## Contributors

- Aryan Kate
- Atharva Badhe
- Aditya Mhatre
- Aakash Lodha

## Acknowledgments

- AI-CoLegion and VESIT for hosting the HACK-AI-THON where this project won 2nd runners-up
- All council members who provided guidance during development
