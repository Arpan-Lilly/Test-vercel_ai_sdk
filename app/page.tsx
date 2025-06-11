'use client';

import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import React from 'react';

const ALL_ITEMS = [
  { id: 1, image: '/cat1.png', title: 'AI', description: 'AI in techhq' },
  { id: 2, image: '/tech1.png', title: 'Argo', description: 'Details about argo in cats' },
  { id: 3, image: '/cat2.png', title: 'CATS', description: 'CATS docs' },
  { id: 4, image: '/tech2.png', title: 'TechHQ Pro', description: 'Professional TechHQ tool.' },
];

function MarketplaceCatalog({ items, onItemClick, isLoading }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map(item => (
        <div
          key={item.id}
          className="border dark:border-gray-700 rounded-xl p-6 flex flex-col items-center bg-white dark:bg-gray-800 shadow-lg hover:scale-105 transition-transform duration-300"
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-32 h-32 object-cover mb-4 rounded-lg shadow-md transition-transform hover:scale-110"
          />
          <div className="font-bold text-xl mb-2 dark:text-white text-center">{item.title}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">{item.description}</div>
          <button
            className={`mt-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-full shadow-md transition ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => onItemClick(item)}
            disabled={isLoading}
          >
            Learn More
          </button>
        </div>
      ))}
    </div>
  );
}

function parseAssistantMessage(content: string) {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export default function ChatMarketplace() {
  const [error, setError] = useState<string | null>(null);
  const [catalogItems, setCatalogItems] = useState(ALL_ITEMS);
  const [dark, setDark] = useState(false);
  const [detailedAnswer, setDetailedAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  const toggleDark = () => {
    setDark(!dark);
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/chat',
    streamProtocol: 'text',
    onError: (error) => setError(error.message),
    onFinish: (message) => {
      const parsed = parseAssistantMessage(message.content);
      if (parsed && Array.isArray(parsed.relevantProducts) && parsed.relevantProducts.length > 0) {
        setCatalogItems(ALL_ITEMS.filter(item => parsed.relevantProducts.includes(item.id)));
      } else {
        setCatalogItems(ALL_ITEMS);
      }
      setDetailedAnswer(parsed?.answer || null);
    },
  });

  const handleCatalogItemClick = (item) => {
    const question = `Tell me more about ${item.title}`;
    append({
      id: `${Date.now()}`,
      role: 'user',
      content: question,
    });
    handleSubmit(undefined, {
      body: { input: question },
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Dark mode toggle */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        <span className="text-sm text-gray-800 dark:text-gray-200">Light</span>
        <button
          className="w-14 h-7 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition"
          onClick={toggleDark}
          aria-label="Toggle dark mode"
        >
          <div
            className={`w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-md transform transition-transform ${
              dark ? 'translate-x-7' : ''
            }`}
          ></div>
        </button>
        <span className="text-sm text-gray-800 dark:text-gray-200">Dark</span>
      </div>
      {/* Chatbot Section */}
      <div className="w-full md:w-1/2 border-r dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900 shadow-lg">
        <div className="flex-grow overflow-auto p-6 space-y-6">
          {messages.map((m, idx) => {
            if (m.role === 'assistant') {
              const parsed = parseAssistantMessage(m.content);
              if (parsed) {
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-xl bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 shadow-md"
                  >
                    {parsed.summary ? (
                      <>
                        <div className="font-semibold text-gray-700 dark:text-gray-200 mb-3">{parsed.summary}</div>
                      </>
                    ) : (
                      <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{parsed.normalAnswer}</ReactMarkdown>
                      </div>
                    )}
                    {parsed.relevantProducts && parsed.relevantProducts.length > 0 && (
                      <div className="mt-3 text-sm text-green-700 dark:text-green-300">
                        <b>Recommended products:</b>{' '}
                        {ALL_ITEMS.filter(item => parsed.relevantProducts.includes(item.id))
                          .map(item => item.title)
                          .join(', ')}
                      </div>
                    )}
                  </div>
                );
              }
            }
            return (
              <div
                key={idx}
                className={`p-6 rounded-xl ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900'
                    : 'bg-gray-50 dark:bg-gray-800'
                } shadow-md`}
              >
                <b
                  className={`block mb-2 ${
                    m.role === 'user' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-200'
                  }`}
                >
                  {m.role === 'user' ? 'You' : 'Assistant'}:
                </b>
                {m.content}
              </div>
            );
          })}
          {isLoading && (
            <div className="p-3 text-gray-500 dark:text-gray-300">
              Grabbing up info for you.....
            </div>
          )}
          {error && <div className="p-3 text-red-500">{error}</div>}
        </div>
        <form onSubmit={handleSubmit} className="flex p-6 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <input
            className="flex-grow p-4 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700 shadow-sm"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about CATS, TechHQ, or products..."
            disabled={isLoading}
          />
          <button
            className="ml-3 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-lg shadow-md transition"
            type="submit"
            disabled={isLoading}
          >
            <span className="material-icons">send</span>
          </button>
        </form>
      </div>
      {/* Marketplace Section */}
      <div className="w-full md:w-1/2 p-10 overflow-auto bg-gray-50 dark:bg-gray-900">
        <h2 className="text-4xl font-extrabold mb-8 text-gray-800 dark:text-white">Digital Marketplace</h2>
        <MarketplaceCatalog items={catalogItems} onItemClick={handleCatalogItemClick} isLoading={isLoading} />
        {/* Detailed Answer Section */}
        {detailedAnswer && (
          <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 shadow-md">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{detailedAnswer}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}