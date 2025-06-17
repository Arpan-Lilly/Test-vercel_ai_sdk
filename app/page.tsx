'use client';

import React, { useState, useEffect, useRef } from 'react';
// Remove useChat import to avoid double API calls
import ReactMarkdown from 'react-markdown';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';


const ALL_ITEMS: CatalogItem[] = [
	{ id: 1, image: '/cat1.png', title: 'AI', description: 'AI in TechHQ' },
	{ id: 2, image: '/tech1.png', title: 'Argo', description: 'Details about argo in CATS' },
	{ id: 3, image: '/cat2.png', title: 'CATS', description: 'CATS docs' },
	{ id: 4, image: '/tech2.png', title: 'TechHQ Pro', description: 'Professional TechHQ tool.' },
];

// Define type for catalog item
type CatalogItem = {
    id: number;
    image: string;
    title: string;
    description: string;
}

// Define props for MarketplaceCatalog component
interface MarketplaceCatalogProps {
    items: CatalogItem[];
    onItemClick: (item: CatalogItem) => void;
    isLoading: boolean;
}

// We'll replace the fixed thinking steps with dynamic streaming updates

function MarketplaceCatalog({ items, onItemClick, isLoading }: MarketplaceCatalogProps) {
	// We'll use the isLoading prop to determine if the buttons should be disabled
	const [isClicking, setIsClicking] = useState(false);
	
	// Helper function to handle item clicks with a small debounce
	const handleItemClick = (item: CatalogItem) => {
		// Prevent multiple rapid clicks
		if (isClicking || isLoading) return;
		
		setIsClicking(true);
		onItemClick(item);
		
		// Reset after a short delay
		setTimeout(() => {
			setIsClicking(false);
		}, 1000);
	};
	
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{items.map(item => (
				<div
					key={item.id}
					className="border dark:border-gray-700 rounded-xl p-6 flex flex-col items-center bg-white dark:bg-gray-800 shadow-lg hover:scale-105 transition-transform duration-300"
				>
					{/* Using img tag for simplicity - consider replacing with next/image in production */}
					<img
						src={item.image}
						alt={item.title}
						className="w-32 h-32 object-cover mb-4 rounded-lg shadow-md transition-transform hover:scale-110"
					/>
					<div className="font-bold text-xl mb-2 dark:text-white text-center">{item.title}</div>
					<div className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">{item.description}</div>
					<button
						className={`mt-auto px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-full shadow-md transition ${
							(isLoading || isClicking) ? 'opacity-50 cursor-not-allowed' : ''
						}`}
						onClick={() => handleItemClick(item)}
						disabled={isLoading || isClicking}
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
    const [loadingMessage, setLoadingMessage] = useState("Thinking..."); // Default loading message
    const eventSourceRef = useRef<EventSource | null>(null);

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

    // Custom chat implementation to replace useChat
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
    
    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };
    
    // Append a message to the chat
    const append = (message: {role: 'user' | 'assistant', content: string}) => {
        setMessages(prevMessages => [...prevMessages, message]);
    };

    // Custom submit handler to set up EventSource
    // Helper function to process the stream response
    // Improved processStreamResponse function with proper loading state management
const processStreamResponse = async (response: Response) => {
    // Create a reader from the response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (!reader) {
        setError('ReadableStream not supported by your browser');
        setIsProcessing(false);
        setIsLoading(false);
        return;
    }
    
    let buffer = '';
    let hasReceivedFinalResult = false;
    
    // Read the stream
    try {
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                // If we never received a final result but the stream ended, handle gracefully
                if (!hasReceivedFinalResult) {
                    console.log("Stream ended without final result");
                    // Reset the loading states
                    setIsProcessing(false);
                    setIsLoading(false);
                    // Set a default message if we didn't get a proper conclusion
                    setLoadingMessage("Thinking...");
                }
                break;
            }
            
            // Decode the chunk and add to buffer
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            
            // Process complete events from the buffer
            let eventEnd = buffer.indexOf('\n\n');
            while (eventEnd !== -1) {
                const event = buffer.substring(0, eventEnd);
                buffer = buffer.substring(eventEnd + 2);
                
                // Process the event
                if (event.startsWith('data: ')) {
                    try {
                        const jsonData = event.substring(6); // Remove 'data: ' prefix
                        console.log("Received data:", jsonData); // Debug log
                        const data = JSON.parse(jsonData);
                        
                        if (data.type === 'status') {
                            console.log("Status update:", data.status); // Debug log
                            setLoadingMessage(data.status);
                        }
                        else if (data.type === 'summary_ready') {
                            console.log("Summary ready received"); // Debug log
                            
                            // Show the summary immediately
                            append({
                                role: 'assistant' as const,
                                content: JSON.stringify({
                                    summary: data.summary,
                                    normalAnswer: '', // Will be filled in later
                                    relevantProducts: data.relevantProducts,
                                    answer: null // Detailed answer not available yet
                                })
                            });
                            
                            // Update catalog items based on relevant products
                            if (data.relevantProducts && Array.isArray(data.relevantProducts) && data.relevantProducts.length > 0) {
                                setCatalogItems(ALL_ITEMS.filter(item => data.relevantProducts.includes(item.id)));
                            } else {
                                setCatalogItems(ALL_ITEMS);
                            }
                            
                            // We're still loading because we're waiting for the detailed answer
                            // But we want to indicate that progress has been made
                            setLoadingMessage("Generating detailed explanation...");
                        }
                        else if (data.type === 'result') {
                            console.log("Final result received"); // Debug log
                            hasReceivedFinalResult = true;
                            
                            // Update the existing message with the full data or add a new one if needed
                            setMessages(prevMessages => {
                                // Find the last assistant message
                                const lastAssistantIndex = [...prevMessages].reverse().findIndex(m => m.role === 'assistant');
                                
                                if (lastAssistantIndex !== -1) {
                                    // If we found an assistant message, update it
                                    const actualIndex = prevMessages.length - 1 - lastAssistantIndex;
                                    const newMessages = [...prevMessages];
                                    
                                    newMessages[actualIndex] = {
                                        role: 'assistant',
                                        content: JSON.stringify({
                                            summary: data.summary,
                                            normalAnswer: data.normalAnswer,
                                            relevantProducts: data.relevantProducts,
                                            answer: data.answer
                                        })
                                    };
                                    
                                    return newMessages;
                                } else {
                                    // If no assistant message was found, add a new one
                                    return [...prevMessages, {
                                        role: 'assistant',
                                        content: JSON.stringify({
                                            summary: data.summary,
                                            normalAnswer: data.normalAnswer,
                                            relevantProducts: data.relevantProducts,
                                            answer: data.answer
                                        })
                                    }];
                                }
                            });
                            
                            // Now set the detailed answer
                            setDetailedAnswer(data.answer || null);
                            
                            // Reset all loading states
                            setIsProcessing(false);
                            setIsLoading(false);
                            
                            // Reset loading message for next interaction
                            setLoadingMessage("Thinking...");
                        }
                        else if (data.type === 'error') {
                            console.error("Stream error:", data.error);
                            setError(data.error || 'An error occurred during processing');
                            setIsProcessing(false);
                            setIsLoading(false);
                            // Reset loading message for next interaction
                            setLoadingMessage("Thinking...");
                        }
                    } catch (error) {
                        console.error('Error parsing SSE data:', error, event.substring(6));
                        // If there's an error parsing the data, we still need to continue processing the stream
                    }
                }
                
                // Look for the next event
                eventEnd = buffer.indexOf('\n\n');
            }
        }
    } catch (err) {
        console.error('Error reading stream:', err);
        setError('Error processing response: ' + ((err as Error)?.message || 'Unknown error'));
        setIsProcessing(false);
        setIsLoading(false);
        // Reset loading message for next interaction
        setLoadingMessage("Thinking...");
    }
};

    // Handle form submission
    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        
        // Don't submit if input is empty or we're already processing something
        const userInput = input.trim();
        if (!userInput || isLoading || isProcessing) return;
        
        // Clean up previous EventSource if it exists
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        
        // Mark as processing and set initial loading message
        setIsProcessing(true);
        setIsLoading(true); // Also set isLoading for UI consistency
        setLoadingMessage("Initializing...");
        setError(null); // Clear any previous errors
        
        // Create a copy of the user message to use for both UI and API request
        const userMessage = {
            role: 'user' as const,
            content: userInput,
        };
        
        // Add user message to the chat UI
        append(userMessage);
        
        // Clear the input field
        setInput('');
        
        try {
            // Call the API with fetch to handle the streaming response
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage]
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            // Process the streaming response
            await processStreamResponse(response);
        } catch (error) {
            console.error('Error in handleSubmit:', error);
            setError((error as Error).message || 'Failed to connect to server');
            setIsProcessing(false);
            setIsLoading(false);
            setLoadingMessage("Thinking..."); // Reset loading message
        }
    };

    // Handle catalog item clicks to ask about specific products
    const handleCatalogItemClick = (item: typeof ALL_ITEMS[0]) => {
        const question = `Tell me more about ${item.title}`;
        
        // Don't submit if we're already processing something
        if (isLoading || isProcessing) return;
        
        // Clean up previous EventSource if it exists
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        
        // Mark as processing and set initial loading message
        setIsProcessing(true);
        setIsLoading(true);
        setLoadingMessage("Initializing...");
        setError(null); // Clear any previous errors
        
        // Create user message
        const userMessage = {
            role: 'user' as const,
            content: question,
        };
        
        // Add user message to the chat UI
        append(userMessage);
        
        // Show the question in the input field for context
        setInput('');
        
        try {
            // Call the API with fetch to handle the streaming response
            fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage]
                })
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                return processStreamResponse(response);
            }).catch(error => {
                console.error('Fetch error:', error);
                setError(error.message);
                setIsProcessing(false);
                setIsLoading(false);
            });
            
        } catch (error) {
            console.error('Error setting up stream:', error);
            setError('Failed to set up streaming connection');
            setIsProcessing(false);
            setIsLoading(false);
        }
    };

    const handleSummaryClick = (detailedResponse: string | null) => {
        // Toggle detailedAnswer: if the same summary is clicked, hide the detailed explanation
        setDetailedAnswer(prev => (prev === detailedResponse ? null : detailedResponse));
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 transition-colors">
            {/* Top Banner */}
            <div className="absolute top-0 right-0 md:w-2/3 w-full flex items-center justify-between bg-red-600 text-white py-2 px-6 font-bold text-lg shadow mb-2 z-10 border-black border-t-[2px] border-b-[2px] border-r-[2px] border-l-0 rounded-none" style={{ height: '48px' }}>
                <span className="text-lg md:text-xl">Digital Core Marketplace</span>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-white drop-shadow">Light</span>
                    <button
                        className="w-14 h-7 flex items-center bg-white bg-opacity-60 dark:bg-gray-700 rounded-full p-1 border border-gray-300 dark:border-gray-700 shadow transition"
                        onClick={toggleDark}
                        aria-label="Toggle dark mode"
                    >
                        <div
                            className={`w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-400 dark:border-gray-900 transform transition-transform ${
                                dark ? 'translate-x-7' : ''
                            }`}
                        ></div>
                    </button>
                    <span className="text-sm text-white drop-shadow">Dark</span>
                </div>
            </div>

            {/* Chatbot Section */}
            <div className="w-full md:w-1/3 border-r dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900 shadow-lg pt-0">
                {/* Chatimus Prime Banner */}
                <div className="w-full bg-red-600 text-white text-center py-2 font-bold text-lg shadow mb-2 border-black border-[2px] border-r-0 rounded-none" style={{ height: '48px' }}>Chatimus Prime</div>
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
                                                <div
                                                    className="font-semibold text-gray-700 dark:text-gray-200 mb-3 prose dark:prose-invert max-w-none break-words whitespace-normal overflow-hidden cursor-pointer"
                                                    onClick={() => handleSummaryClick(parsed.answer || null)}
                                                    title="Click to view detailed explanation"
                                                >
                                                    <ReactMarkdown
                                                        components={{
                                                            a: ({ ...props }) => <a {...props} className="text-blue-500 underline" />,
                                                        }}
                                                    >
                                                        {parsed.summary.replace(/https?:\/\/[^\s]+/g, (match: string) => `[Link](${match})`)}
                                                    </ReactMarkdown>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="font-semibold prose dark:prose-invert max-w-none break-words whitespace-normal overflow-hidden">
                                                <ReactMarkdown
                                                    components={{
                                                        a: ({ ...props }) => <a {...props} className="text-blue-500 underline" />,
                                                    }}
                                                >
                                                    {parsed.normalAnswer.replace(/https?:\/\/[^\s]+/g, (match: string) => `[Link](${match})`)}
                                                </ReactMarkdown>
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
                    {(isLoading || isProcessing) && (
                        <div className="p-3 text-gray-500 dark:text-gray-300 animate-pulse">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mr-2 animate-bounce"></div>
                                <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mr-2 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mr-3 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                {loadingMessage}
                            </div>
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
                    <div className="flex space-x-2">
                        {/* Send Button */}
                        <button
                            className="ml-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-lg shadow-md transition flex items-center justify-center"
                            type="submit"
                            disabled={isLoading}
                            aria-label="Send"
                        >
                            <SendIcon />
                        </button>

                        {/* Speakerphone Button */}
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-lg shadow-md transition flex items-center justify-center"
                            type="button"
                            disabled={isLoading}
                            aria-label="Voice Chat"
                        >
                            <MicIcon />
                        </button>
                    </div>
                </form>
            </div>

            {/* Marketplace Section */}
            <div className="w-full md:w-2/3 p-10 overflow-auto bg-gray-50 dark:bg-gray-900 pt-14">
                <MarketplaceCatalog items={catalogItems} onItemClick={handleCatalogItemClick} isLoading={isLoading} />
                {/* Detailed Answer Section */}
                {detailedAnswer && (
                    <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 shadow-md">
                        <div className="prose dark:prose-invert max-w-none break-words whitespace-normal overflow-hidden">
                            <ReactMarkdown
                                components={{
                                    a: ({ ...props }) => <a {...props} className="text-blue-500 underline" />,
                                }}
                            >
                                {detailedAnswer.replace(/https?:\/\/[^\s]+/g, (match: string) => `[Link](${match})`)}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}