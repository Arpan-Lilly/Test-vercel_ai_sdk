// scripts/indexDocuments.js
import { createClient } from '@supabase/supabase-js';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: '.env.local' });

const EMBEDDING_SERVICE_URL = 'http://localhost:5001/embed';

// Function to get embeddings from the Python service
async function getEmbeddings(texts) {
  try {
    const response = await axios.post(EMBEDDING_SERVICE_URL, {
      text: texts
    });
    return response.data.embeddings;
  } catch (error) {
    console.error("Error calling embedding service:", error.message);
    throw error;
  }
}

async function indexDocuments() {
  console.log("Starting document indexing...");

  // Connect to Supabase
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  console.log("Loading documents from directories...");
  
  // Load documents from directory
  const catsLoader = new DirectoryLoader(
    "./data/cats",
    {
      ".md": (path) => new TextLoader(path)
    }
  );
  
  const techhqLoader = new DirectoryLoader(
    "./data/techhq",
    {
      ".md": (path) => new TextLoader(path)
    }
  );
  
  // Load documents
  const catsDocs = await catsLoader.load();
  console.log(`Loaded ${catsDocs.length} CATS documents`);
  
  const techhqDocs = await techhqLoader.load();
  console.log(`Loaded ${techhqDocs.length} TechHQ documents`);
  
  // Add source metadata
  catsDocs.forEach(doc => {
    doc.metadata.source = `cats/${path.basename(doc.metadata.source)}`;
  });
  
  techhqDocs.forEach(doc => {
    doc.metadata.source = `techhq/${path.basename(doc.metadata.source)}`;
  });
  
  const allDocs = [...catsDocs, ...techhqDocs];
  console.log(`Total documents: ${allDocs.length}`);
  
  // Split documents
  console.log("Splitting documents into chunks...");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200
  });
  
  const splitDocs = await splitter.splitDocuments(allDocs);
  console.log(`Created ${splitDocs.length} document chunks`);

  // Process in batches to avoid memory issues
  const batchSize = 20;
  let processed = 0;
  
  console.log("Generating embeddings and storing in Supabase...");
  
  for (let i = 0; i < splitDocs.length; i += batchSize) {
    const batch = splitDocs.slice(i, i + batchSize);
    const texts = batch.map(doc => doc.pageContent);
    
    try {
      // Get embeddings from Python service
      const embeddings = await getEmbeddings(texts);
      
      // Prepare data for insertion
      const data = batch.map((doc, idx) => ({
        content: doc.pageContent,
        metadata: doc.metadata,
        embedding: embeddings[idx]
      }));
      
      // Insert into Supabase
      const { error } = await client.from('documents').insert(data);
      if (error) {
        console.error("Error inserting data into Supabase:", error);
        throw error;
      }
      
      processed += batch.length;
      console.log(`Progress: ${processed}/${splitDocs.length} chunks processed`);
      
    } catch (error) {
      console.error(`Error processing batch ${i}-${i+batchSize}:`, error);
      throw error;
    }
  }
  
  console.log(`Successfully indexed ${splitDocs.length} document chunks`);
}

indexDocuments().catch(console.error);