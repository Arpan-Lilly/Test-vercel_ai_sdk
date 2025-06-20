import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const EMBEDDING_SERVICE_URL = 'http://localhost:5001/embed';
const ALL_ITEMS = [
  { id: 1, image: '/cat1.png', title: 'AI', description: 'AI in techhq' },
  { id: 2, image: '/tech1.png', title: 'Argo', description: 'Details about argo in cats' },
  { id: 3, image: '/cat2.png', title: 'CATS', description: 'CATS docs' },
  { id: 4, image: '/tech2.png', title: 'TechHQ Pro', description: 'Professional TechHQ tool.' },
];

async function getEmbedding(text) {
  const response = await axios.post(EMBEDDING_SERVICE_URL, { text });
  return response.data.embeddings;
}

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const currentMessage = messages[messages.length - 1].content;

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    const embedding = await getEmbedding(currentMessage);

    const { data: results, error } = await client.rpc('match_documents', {
      query_embedding: embedding,
      match_count: 10,
    });
    if (error) throw error;

    const context = results.map(doc =>
      `Source: ${doc.metadata.source}\nContent: ${doc.content}`
    ).join('\n\n');

    // Agent 1: Summary and Relevant Products
    const summaryAgent = {
      role: 'system',
      content: `
You are an assistant specializing in generating summaries and identifying relevant products.

Guidelines:
- Generate a concise summary of the user's query.
- Identify relevant products from the catalog based on the query.

Product Catalog:
${ALL_ITEMS.map(item => `ID: ${item.id}, Title: ${item.title}, Description: ${item.description}`).join('\n')}
`
    };

    // Agent 2: Detailed Answer
    const detailedAgent = {
      role: 'system',
      content: `
You are a helpful assistant with access to both CATS and TechHQ Markdown documentation.

Guidelines:
- Provide a detailed Markdown explanation based on the user's query and the context.
- Use the context generated from the database results.

Context:
${context}
`
    };

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.CUSTOM_ENDPOINT_URL,
    });

    const chatMessages = [summaryAgent, detailedAgent, ...messages];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: chatMessages,
      stream: true,
      temperature: 0,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content;
          if (typeof content === 'string' && content.length > 0) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}