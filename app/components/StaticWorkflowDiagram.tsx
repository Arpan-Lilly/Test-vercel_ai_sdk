'use client';

import React from 'react';

const StaticWorkflowDiagram: React.FC = () => {
  return (
    <div className="my-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">System Architecture (Static View)</h2>
      
      {/* SVG Diagram - Using a static SVG for guaranteed rendering */}
      <div className="overflow-auto max-w-full">
        <svg
          width="800"
          height="500"
          viewBox="0 0 800 500"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto"
        >
          {/* Background colors for different sections */}
          <rect x="0" y="0" width="800" height="500" fill="#f8f9fa" rx="10" ry="10" className="dark:fill-gray-900" />
          
          {/* Frontend Section */}
          <rect x="50" y="50" width="700" height="100" fill="#f9d6ca" rx="8" ry="8" stroke="#333" strokeWidth="1" />
          <text x="400" y="70" textAnchor="middle" fontWeight="bold">Frontend (Next.js)</text>
          <rect x="100" y="90" width="150" height="40" fill="#fff" rx="5" ry="5" stroke="#333" strokeWidth="1" />
          <text x="175" y="115" textAnchor="middle">User Input</text>
          <rect x="325" y="90" width="150" height="40" fill="#fff" rx="5" ry="5" stroke="#333" strokeWidth="1" />
          <text x="400" y="115" textAnchor="middle">Stream Processing</text>
          <rect x="550" y="90" width="150" height="40" fill="#fff" rx="5" ry="5" stroke="#333" strokeWidth="1" />
          <text x="625" y="115" textAnchor="middle">UI Updates</text>
          
          {/* Arrows from Frontend */}
          <line x1="400" y1="150" x2="400" y2="180" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
          
          {/* API Route Section */}
          <rect x="200" y="180" width="400" height="60" fill="#d1f0ee" rx="8" ry="8" stroke="#333" strokeWidth="1" />
          <text x="400" y="215" textAnchor="middle" fontWeight="bold">API Route (Server-Side)</text>
          
          {/* Arrows from API */}
          <line x1="300" y1="240" x2="300" y2="270" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="500" y1="240" x2="500" y2="270" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
          
          {/* Embedding Service */}
          <rect x="150" y="270" width="200" height="60" fill="#d4e5ff" rx="8" ry="8" stroke="#333" strokeWidth="1" />
          <text x="250" y="305" textAnchor="middle" fontWeight="bold">Embedding Service</text>
          
          {/* Vector DB */}
          <rect x="150" y="370" width="200" height="60" fill="#e2d2ff" rx="8" ry="8" stroke="#333" strokeWidth="1" />
          <text x="250" y="405" textAnchor="middle" fontWeight="bold">Supabase Vector Store</text>
          
          {/* Arrows between Embedding and DB */}
          <line x1="250" y1="330" x2="250" y2="370" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <line x1="230" y1="370" x2="230" y2="330" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
          
          {/* Agents */}
          <rect x="450" y="270" width="250" height="160" fill="#ffe6cc" rx="8" ry="8" stroke="#333" strokeWidth="1" />
          <text x="575" y="290" textAnchor="middle" fontWeight="bold">AI Agents</text>
          
          {/* Individual Agents */}
          <rect x="470" y="300" width="100" height="35" fill="#fff" rx="5" ry="5" stroke="#333" strokeWidth="1" />
          <text x="520" y="323" textAnchor="middle" fontSize="12">Normal Response</text>
          
          <rect x="580" y="300" width="100" height="35" fill="#fff" rx="5" ry="5" stroke="#333" strokeWidth="1" />
          <text x="630" y="323" textAnchor="middle" fontSize="12">Product Recs</text>
          
          <rect x="470" y="345" width="100" height="35" fill="#fff" rx="5" ry="5" stroke="#333" strokeWidth="1" />
          <text x="520" y="368" textAnchor="middle" fontSize="12">Summary</text>
          
          <rect x="580" y="345" width="100" height="35" fill="#fff" rx="5" ry="5" stroke="#333" strokeWidth="1" />
          <text x="630" y="368" textAnchor="middle" fontSize="12">Detailed</text>
          
          <rect x="525" y="390" width="100" height="35" fill="#fff" rx="5" ry="5" stroke="#333" strokeWidth="1" />
          <text x="575" y="413" textAnchor="middle" fontSize="12">Result</text>
          
          {/* Arrows for data flow */}
          <path d="M350 300 Q400 300 450 300" fill="none" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <path d="M575 425 Q575 470 400 470 Q225 470 225 430" fill="none" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <path d="M575 300 L575 390" fill="none" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
          <path d="M575 470 Q575 480 400 480 Q400 480 400 240" fill="none" stroke="#333" strokeWidth="2" markerEnd="url(#arrowhead)" />
          
          {/* Arrowhead definition */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
            </marker>
          </defs>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p><strong>Static Diagram Legend:</strong></p>
        <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          <li className="flex items-center">
            <div className="w-4 h-4 bg-[#f9d6ca] border border-gray-400 mr-2"></div>
            <span>User Interface Components</span>
          </li>
          <li className="flex items-center">
            <div className="w-4 h-4 bg-[#d1f0ee] border border-gray-400 mr-2"></div>
            <span>Backend Services</span>
          </li>
          <li className="flex items-center">
            <div className="w-4 h-4 bg-[#d4e5ff] border border-gray-400 mr-2"></div>
            <span>Embedding Service</span>
          </li>
          <li className="flex items-center">
            <div className="w-4 h-4 bg-[#e2d2ff] border border-gray-400 mr-2"></div>
            <span>Database</span>
          </li>
          <li className="flex items-center">
            <div className="w-4 h-4 bg-[#ffe6cc] border border-gray-400 mr-2"></div>
            <span>AI Agents</span>
          </li>
        </ul>
      </div>
      
      {/* System Workflow Description */}
      <div className="mt-6 text-sm text-gray-700 dark:text-gray-300 border-t pt-4 border-gray-200 dark:border-gray-700">
        <h3 className="font-bold mb-2">System Workflow:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>User submits a question through the chat interface.</li>
          <li>The frontend sends the request to the API route.</li>
          <li>API route initializes a Server-Sent Events (SSE) stream for real-time updates.</li>
          <li>The API sends the query to the Embedding Service to convert text to vector embeddings.</li>
          <li>Vector embeddings are used to search the Supabase Vector Store for relevant documents.</li>
          <li>The API uses retrieved context to generate a normal response through OpenAI.</li>
          <li>Another agent identifies relevant products based on the query.</li>
          <li>For longer responses, summary and detailed agents create different views.</li>
          <li>All results are streamed back to the frontend with real-time status updates.</li>
          <li>The UI displays loading indicators, product recommendations, and formatted responses.</li>
        </ol>
      </div>
    </div>
  );
};

export default StaticWorkflowDiagram;
