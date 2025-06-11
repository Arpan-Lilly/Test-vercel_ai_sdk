# Knowledge Nexus: RAG Chatbot with Supabase, OpenAI, and Custom Embeddings

This project is a Retrieval-Augmented Generation (RAG) chatbot that leverages:
- **Supabase** as a vector database,
- **OpenAI GPT-4o** for chat completions,
- **A custom Python embedding service** (using SentenceTransformers),
- **LangChain** for document loading and splitting,
- **Next.js** (with Vercel AI SDK) for the frontend and API routes.

It allows you to index Markdown documentation, generate embeddings, store them in Supabase, and chat with an AI assistant that can cite sources from your docs.

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

- **Semantic search** over your Markdown docs using vector embeddings.
- **Streaming chat UI** with OpenAI GPT-4o.
- **Citations** for every answer.
- **Custom embedding service** for privacy and flexibility.
- **Easy extensibility** (add Stack Overflow, more sources, etc).

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **Python** (v3.8+)
- **Supabase** project (with a `documents` table and vector extension enabled)
- **OpenAI API key**
- **Git**

---

## Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>

npm install

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

python embedding_service.py

cp .env.local.example .env.local

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
CUSTOM_ENDPOINT_URL=https://api.openai.com/v1


Place your Markdown files in:
./data/cats
./data/techhq

node scripts/indexDocuments.js

npm run dev

Open http://localhost:3000 in your browser.

Embedding service not found: Make sure embedding_service.py is running on port 5001.
Supabase errors: Check your credentials and that your documents table is set up for vector search.
OpenAI errors: Ensure your API key is valid and you have quota.
Streaming errors: Make sure your backend and frontend stream protocols match (see code comments).