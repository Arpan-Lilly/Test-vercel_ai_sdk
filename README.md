# Knowledge Nexus: RAG Chatbot with Supabase, OpenAI, and Custom Embeddings

This project is a Retrieval-Augmented Generation (RAG) chatbot that combines:
- **Supabase** as a vector database for semantic search,
- **OpenAI GPT-4o** for chat completions,
- **A custom Python embedding service** (using SentenceTransformers),
- **LangChain** for document loading and splitting,
- **Next.js** (with Vercel AI SDK) for the frontend and API routes.

It enables you to index Markdown documentation, generate embeddings, store them in Supabase, and interact with an AI assistant that cites sources from your indexed documents.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Node.js Dependencies](#2-install-nodejs-dependencies)
  - [3. Set Up Python Embedding Service](#3-set-up-python-embedding-service)
  - [4. Configure Environment Variables](#4-configure-environment-variables)
  - [5. Prepare Your Documentation](#5-prepare-your-documentation)
  - [6. Index Documents](#6-index-documents)
  - [7. Run the Development Server](#7-run-the-development-server)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

- **Semantic Search**: Retrieve relevant Markdown documentation using vector embeddings.
- **Streaming Chat UI**: Interact with OpenAI GPT-4o in real-time.
- **Citations**: Every answer includes references to the source documents.
- **Custom Embedding Service**: Generate embeddings locally for privacy and flexibility.
- **Extensibility**: Easily add new sources like Stack Overflow, additional datasets, etc.

---

## Prerequisites

Before starting, ensure you have the following installed:
- **Node.js** (v18+ recommended)
- **Python** (v3.8+)
- **Supabase** project (with a `documents` table and vector extension enabled)
- **OpenAI API key**
- **Git**

---

## Setup

### 1. Clone the Repository
Clone the repository and navigate to the project folder:
```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

---

### 2. Install Node.js Dependencies
Install the required Node.js packages:
```bash
npm install
```

---

### 3. Set Up Python Embedding Service
Create a Python virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Start the embedding service:
```bash
python embedding_service.py
```

The embedding service will run on `http://localhost:5001`.

---

### 4. Configure Environment Variables
Copy the example `.env.local` file and update it with your credentials:
```bash
cp .env.local.example .env.local
```

Update the following variables in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
CUSTOM_ENDPOINT_URL=https://api.openai.com/v1
```

---

### 5. Prepare Your Documentation
Place your Markdown files in the following directories:
```plaintext
./data/cats
./data/techhq
```

---

### 6. Index Documents
Run the indexing script to process and store your documents in Supabase:
```bash
node scripts/indexDocuments.js
```

This script will:
1. Load Markdown files from `./data/cats` and `./data/techhq`.
2. Generate embeddings using the Python embedding service.
3. Store the embeddings and metadata in Supabase.

---

### 7. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```

Open your browser and navigate to:
```plaintext
http://localhost:3000
```

---

## Requirements

### Python Dependencies (`requirements.txt`)
Ensure the following Python packages are listed in your `requirements.txt` file:
```plaintext
flask
flask-cors
sentence-transformers
numpy
```

Install them using:
```bash
pip install -r requirements.txt
```

---

### Node.js Dependencies (`npm install`)
Ensure the following Node.js packages are installed via `npm install`:
- `@supabase/supabase-js`
- `langchain`
- `dotenv`
- `axios`
- `react-markdown`
- `@mui/icons-material`
- `@mui/material`

---

## Usage
1. **Ask Questions**: Type your query in the chat input box.
2. **Receive Answers**: The chatbot will respond with answers and citations from your indexed documents.
3. **Explore Products**: Click on product summaries to view detailed explanations.
4. **Toggle Dark Mode**: Use the light/dark mode toggle in the top-right corner.

---

## Troubleshooting

### Embedding Service Not Found
Ensure the embedding service (`embedding_service.py`) is running on port `5001`. If not, start it:
```bash
python embedding_service.py
```

### Supabase Errors
- Verify your Supabase credentials in `.env.local`.
- Ensure the `documents` table is set up for vector search.

### OpenAI Errors
- Check your OpenAI API key and ensure you have sufficient quota.

### Streaming Errors
- Ensure the backend and frontend stream protocols match. Refer to the comments in the code for configuration details.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---