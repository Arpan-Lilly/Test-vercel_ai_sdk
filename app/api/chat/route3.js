import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import axios from 'axios';


const EMBEDDING_SERVICE_URL = 'http://localhost:5001/embed';

async function getEmbedding(text) {
  const response = await axios.post(EMBEDDING_SERVICE_URL, { text });
  return response.data.embeddings;
}
const ALL_ITEMS = [
  { id: 1, image: '/cat1.png', title: 'AI', description: 'AI in techhq' },
  { id: 2, image: '/tech1.png', title: 'Argo', description: 'Details about argo in cats' },
  { id: 3, image: '/cat2.png', title: 'CATS', description: 'CATS docs' },
  { id: 4, image: '/tech2.png', title: 'TechHQ Pro', description: 'Professional TechHQ tool.' },
];

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
      match_count: 5,
    });
    if (error) throw error;

    const context = results.map(doc =>
      `Source: ${doc.metadata.source}\nContent: ${doc.content}`
    ).join('\n\n');

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.CUSTOM_ENDPOINT_URL,
    });

    // System prompt for normal response
    const normalSystemMessage = {
      role: 'system',
      content: `
You are a helpful assistant with access to both CATS and TechHQ Markdown documentation and the following product catalog:

${ALL_ITEMS.map(item => `ID: ${item.id}, Title: ${item.title}, Description: ${item.description}`).join('\n')}

Guidelines:
- When the user asks a question, answer as helpfully as possible using the provided context, even if the question is about only CATS, only TechHQ, or both.
- If the question is about both, compare or relate them as needed.
- If you don't find relevant information in the context, say so, but still try to provide a general helpful answer based on what you know.

Context:
${context}
`
    };

    // Generate the normal response
    const normalResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [normalSystemMessage, ...messages],
      temperature: 0,
    });

    const normalAnswer = normalResponse.choices[0]?.message?.content || '';
    console.log('Normal Answer:', normalAnswer);

    // Use a single relevant product agent
    const relevantProductsAgent = {
      role: 'system',
      content: `
You are a helpful assistant tasked with identifying relevant product IDs from the catalog based on the following response:

Response:
${normalAnswer}

Catalog:
${ALL_ITEMS.map(item => `ID: ${item.id}, Title: ${item.title}, Description: ${item.description}`).join('\n')}

Guidelines:
- Return a list of relevant product IDs in the format [1, 2, 3].
- If no relevant products are found, return an empty list [].
`
    };

    const relevantProductsResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [relevantProductsAgent],
      temperature: 0,
    });

    const relevantProducts = relevantProductsResponse.choices[0]?.message?.content || '[]';

    // Append relevant products to the normal answer
    const normalAnswerWithProducts = `${normalAnswer}\n\nRelevant Products: ${relevantProducts}`;

    // Check if the normal answer exceeds 3 lines
    const lineCount = normalAnswer.split('\n').length;
    if (lineCount > 10) {
      // Generate summary
      const summaryAgent = {
        role: 'system',
        content: `
You are an assistant specializing in generating summaries.

Guidelines:
- Generate a concise summary of the following text:
${normalAnswer}
`
      };

      const summaryResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [summaryAgent],
        temperature: 0,
      });

      const summary = summaryResponse.choices[0]?.message?.content || '';

      // Append relevant products to the summary
      const summaryWithProducts = `${summary}\n\nRelevant Products: ${relevantProducts}`;

      // Generate detailed explanation
      const detailedAgent = {
        role: 'system',
        content: `
You are a helpful assistant providing detailed explanations.

Guidelines:
- Provide a detailed Markdown explanation based on the following text:
${normalAnswer}
`
      };

      const detailedResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [detailedAgent],
        temperature: 0,
      });

      const detailedAnswer = detailedResponse.choices[0]?.message?.content || '';

      // Combine summary and detailed answer
      const finalResponse = `Summary:\n${summaryWithProducts}\n\nDetailed Answer:\n${detailedAnswer}`;
      return new Response(finalResponse, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    }

    // Return normal answer with relevant products if it doesn't exceed 3 lines
    return new Response(normalAnswerWithProducts, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
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