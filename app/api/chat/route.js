import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import axios from 'axios';
// import { LangChainAdapter } from 'ai';

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
  // Set up a stream writer for SSE
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  
  // Process the request asynchronously
  (async () => {
    try {
      const { messages } = await req.json();
      const currentMessage = messages[messages.length - 1].content;
      
      // Send initial agent status update
      await writer.write(encoder.encode(`data: ${JSON.stringify({
        type: 'status',
        status: 'Initializing vector search...'
      })}\n\n`));
      
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
      );
      const embedding = await getEmbedding(currentMessage);
      
      await writer.write(encoder.encode(`data: ${JSON.stringify({
        type: 'status',
        status: 'Searching for relevant documents...'
      })}\n\n`));

      const { data: results, error } = await client.rpc('match_documents', {
        query_embedding: embedding,
        match_count: 5,
      });
      if (error) throw error;      const context = results.map(doc =>
        `Source: ${doc.metadata.source}\nContent: ${doc.content}`
      ).join('\n\n');
      
      await writer.write(encoder.encode(`data: ${JSON.stringify({
        type: 'status',
        status: 'Context retrieved. Forming response...'
      })}\n\n`));

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
- If the question is asking about something in brief. Please provide a concise answer.
- Do not return JSON, code blocks, or any structured data. Provide a plain text response in Markdown format.
- Please dont try to give consise answers, just answer the question as best as you can.

Context:
${context}
`
      };      // Generate the normal response
      await writer.write(encoder.encode(`data: ${JSON.stringify({
        type: 'status',
        status: 'Generating initial response...'
      })}\n\n`));
      
      const normalResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [normalSystemMessage, ...messages],
        temperature: 0,
      });

      const normalAnswer = normalResponse.choices[0]?.message?.content || '';
      
      await writer.write(encoder.encode(`data: ${JSON.stringify({
        type: 'status',
        status: 'Initial response generated. Identifying relevant products...'
      })}\n\n`));
      
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
- Return a valid JSON object in the format {"relevantProducts": [1, 2, 3]}.
- Do not include any Markdown, code blocks, or extra formatting.
- Ensure the response is strictly valid JSON.
- If no relevant products are found, return {"relevantProducts": []}.
`
};    const relevantProductsResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [relevantProductsAgent],
      temperature: 0,
    });

    let relevantProducts = [];
    try {
      relevantProducts = JSON.parse(relevantProductsResponse.choices[0]?.message?.content || '{"relevantProducts": []}').relevantProducts;
      
      await writer.write(encoder.encode(`data: ${JSON.stringify({
        type: 'status',
        status: 'Found relevant products: ' + 
          ALL_ITEMS.filter(item => relevantProducts.includes(item.id))
            .map(item => item.title)
            .join(', ')
      })}\n\n`));
      
    } catch (error) {
      console.error('Failed to parse relevant products:', error);
      relevantProducts = []; // Default to an empty array if parsing fails
      
      await writer.write(encoder.encode(`data: ${JSON.stringify({
        type: 'status',
        status: 'No specific products found relevant to your query.'
      })}\n\n`));
    }

    // Check if the normal answer exceeds 3 lines
    const lineCount = normalAnswer.split('\n').length;
    let summary = null;
    let detailedAnswer = null;    if (lineCount > 16) {
      await writer.write(encoder.encode(`data: ${JSON.stringify({
        type: 'status',
        status: 'Response is detailed. Generating summary and detailed explanation...'
      })}\n\n`));
        // Define agents for summary and detailed explanation
      const summaryAgent = {
        role: 'system',
        content: `
You are an assistant specializing in generating summaries.

Guidelines:
- Generate a concise summary of the following text:
${normalAnswer}

- Also mention something in the way of "For more details, please refer to the detailed explanation on the right.". You can change this text to suit your needs.
`
      };

      const detailedAgent = {
        role: 'system',
        content: `
You are a helpful assistant providing detailed explanations.
Do not provide a summary, just a detailed explanation.

Guidelines:
- Provide a detailed Markdown explanation based on the following text:
${normalAnswer}
`
      };

      // Start both tasks in parallel but handle them separately for progressive updates
      await writer.write(encoder.encode(`data: ${JSON.stringify({
        type: 'status',
        status: 'Generating summary and detailed explanation...'
      })}\n\n`));
      
      // Create both promises but don't await them together
      const summaryPromise = openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [summaryAgent],
        temperature: 0,
      });
      
      const detailedPromise = openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [detailedAgent],
        temperature: 0,
      });
      
      // Process the summary as soon as it's available
      const summaryResponse = await summaryPromise;
      summary = summaryResponse.choices[0]?.message?.content || '';
      
      // Send the summary immediately
      await writer.write(encoder.encode(`data: ${JSON.stringify({
        type: 'summary_ready',
        summary,
        relevantProducts,
      })}\n\n`));
      
      await writer.write(encoder.encode(`data: ${JSON.stringify({
        type: 'status',
        status: 'Summary ready! Waiting for detailed explanation...'
      })}\n\n`));
      
      // Now wait for the detailed response
      const detailedResponse = await detailedPromise;
      detailedAnswer = detailedResponse.choices[0]?.message?.content || '';
      
      await writer.write(encoder.encode(`data: ${JSON.stringify({
        type: 'status',
        status: 'Detailed explanation ready!'
      })}\n\n`));    }    // Send final result with all data
    await writer.write(encoder.encode(`data: ${JSON.stringify({
      type: 'result',
      summary,
      normalAnswer,
      relevantProducts,
      answer: detailedAnswer,
    })}\n\n`));
    
    // Close the stream
    await writer.close();
      
    } catch (error) {
      console.error(error);
      // Send error through the stream if possible
      try {
        await writer.write(encoder.encode(`data: ${JSON.stringify({
          type: 'error',
          error: error.message
        })}\n\n`));
        await writer.close();
      } catch (streamError) {
        console.error('Error sending error message to stream:', streamError);
      }
    }
  })();
    // Return stream response immediately
  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}