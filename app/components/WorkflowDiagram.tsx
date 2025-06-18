'use client';

import React, { useEffect, useRef } from 'react';

// We'll use Mermaid.js for rendering the workflow diagram
const WorkflowDiagram: React.FC = () => {
  const diagramRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically import mermaid to avoid SSR issues
    import('mermaid').then((mermaid) => {
      mermaid.default.initialize({ 
        startOnLoad: true,
        theme: 'neutral',
        flowchart: { 
          htmlLabels: true,
          curve: 'basis' 
        },
        securityLevel: 'loose'
      });
      
      if (diagramRef.current) {
        try {
          mermaid.default.render('workflow-diagram', `
            flowchart TD
              classDef userInterface fill:#f9d6ca,stroke:#333,stroke-width:1px
              classDef backend fill:#d1f0ee,stroke:#333,stroke-width:1px
              classDef embedding fill:#d4e5ff,stroke:#333,stroke-width:1px
              classDef database fill:#e2d2ff,stroke:#333,stroke-width:1px
              classDef agents fill:#ffe6cc,stroke:#333,stroke-width:1px
              
              User[User Input] --> Frontend[Next.js Frontend]
              Frontend --> API[API Route]
              API --> Embedding[Embedding Service]
              Embedding --> Supabase[(Supabase Vector Store)]
              Supabase --> API
              API --> NormalAgent[Normal Response Agent]
              API --> ProductAgent[Product Recommendation Agent]
              
              subgraph "Frontend Processing"
                Frontend --> StreamProcessing[Stream Processing]
                StreamProcessing --> UI[UI Updates]
              end
              
              subgraph "Agent Processing"
                NormalAgent --> LongResponse{Long Response?}
                LongResponse -->|Yes| SummaryAgent[Summary Agent]
                LongResponse -->|Yes| DetailedAgent[Detailed Agent]
                LongResponse -->|No| FinalResult[Final Result]
                SummaryAgent --> FinalResult
                DetailedAgent --> FinalResult
                ProductAgent --> FinalResult
              end
              
              FinalResult --> StreamProcessing
              
              User:::userInterface
              Frontend:::userInterface
              UI:::userInterface
              StreamProcessing:::userInterface
              
              API:::backend
              
              Embedding:::embedding
              
              Supabase:::database
              
              NormalAgent:::agents
              ProductAgent:::agents
              SummaryAgent:::agents
              DetailedAgent:::agents
              FinalResult:::agents
          `, (svgCode) => {
            if (diagramRef.current) {
              diagramRef.current.innerHTML = svgCode;
            }
          });
        } catch (error) {
          console.error('Failed to render diagram:', error);
          if (diagramRef.current) {
            diagramRef.current.innerHTML = '<p>Error rendering workflow diagram</p>';
          }
        }
      }
    }).catch(error => {
      console.error('Failed to load mermaid:', error);
    });
  }, []);

  return (
    <div className="my-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">System Workflow Diagram</h2>
      <div 
        ref={diagramRef} 
        className="overflow-auto max-w-full"
        style={{ minHeight: "400px" }}
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse flex space-x-2">
            <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
            <span className="text-gray-500 dark:text-gray-400">Loading diagram...</span>
          </div>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p><strong>Diagram Legend:</strong></p>
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
    </div>
  );
};

export default WorkflowDiagram;
