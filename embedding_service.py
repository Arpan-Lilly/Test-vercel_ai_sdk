# embedding_service.py
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import numpy as np
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

print("Loading SentenceTransformer model...")
model = SentenceTransformer("all-mpnet-base-v2")
print("Model loaded successfully!")

@app.route('/embed', methods=['POST'])
def embed():
    start_time = time.time()
    data = request.json
    if not data or 'text' not in data:
        return jsonify({'error': 'Missing text field'}), 400
    
    text = data.get('text', '')
    
    # Handle both single text and batch processing
    is_batch = isinstance(text, list)
    texts = text if is_batch else [text]
    
    # Generate embeddings
    embeddings = model.encode(texts).tolist()
    
    response = {
        'embeddings': embeddings if is_batch else embeddings[0],
        'dimensions': len(embeddings[0]),
        'processing_time': time.time() - start_time
    }
    
    return jsonify(response)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'model': 'all-mpnet-base-v2'})

if __name__ == '__main__':
    print("Starting embedding service on port 5001...")
    app.run(host='127.0.0.1', port=5001, debug=False)