'use client';

import { useState, useEffect } from 'react';
import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import React from 'react';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import Image from 'next/image';

const ALL_ITEMS = [
	{ id: 1, image: '/cat1.png', title: 'AI', description: 'AI in TechHQ' },
	{ id: 2, image: '/tech1.png', title: 'Argo', description: 'Details about argo in CATS' },
	{ id: 3, image: '/cat2.png', title: 'CATS', description: 'CATS docs' },
	{ id: 4, image: '/tech2.png', title: 'TechHQ Pro', description: 'Professional TechHQ tool.' },
];

interface MarketplaceItem {
	id: number;
	image: string;
	title: string;
	description: string;
}

interface MarketplaceCatalogProps {
	items: MarketplaceItem[];
	onItemClick: (item: MarketplaceItem) => void;
	isLoading: boolean;
}

function MarketplaceCatalog({ items, onItemClick, isLoading }: MarketplaceCatalogProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{items.map((item: MarketplaceItem) => (
				<div
					key={item.id}
					className="border dark:border-gray-700 rounded-xl p-6 flex flex-col items-center bg-white dark:bg-gray-800 shadow-lg hover:scale-105 transition-transform duration-300"
				>
					<Image
						src={item.image}
						alt={item.title}
						width={128}
						height={128}
						className="w-32 h-32 object-cover mb-4 rounded-lg shadow-md transition-transform hover:scale-110"
					/>
					<div className="font-bold text-xl mb-2 dark:text-white text-center">{item.title}</div>
					<div className="text-sm text-gray-600 dark:text-gray-300 mb-4 text-center">{item.description}</div>
					<button
						className={`mt-auto px-6 py-3 text-white rounded-full shadow-md transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
						style={{ backgroundColor: '#003A6C' }}
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

    const handleCatalogItemClick = (item: MarketplaceItem) => {
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

    const handleSummaryClick = (detailedResponse: string | null) => {
    // Toggle detailedAnswer: if the same summary is clicked, hide the detailed explanation
    setDetailedAnswer(prev => (prev === detailedResponse ? null : detailedResponse));
};

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 transition-colors">
            {/* Top Banner */}
            <div className="absolute top-0 right-0 md:w-2/3 w-full flex items-center justify-between border-black border-[3px] rounded-none" style={{ backgroundColor: '#003A6C', height: '48px' }}>
                <span className="text-lg md:text-xl text-white font-bold pl-4">Digital Core Marketplace</span>
                <div className="flex items-center space-x-2 pr-4">
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
                <div className="w-full text-white text-center py-2 font-bold text-lg shadow mb-2 border-black border-[3px] border-r-0 rounded-none" style={{ backgroundColor: '#003A6C', height: '48px' }}>Chatimus Prime</div>
                <div className="flex-grow overflow-auto p-6 space-y-6">
                    {messages.map((m, idx) => {
                        if (m.role === 'assistant') {
                            const parsed = parseAssistantMessage(m.content);
                            if (parsed) {
                                return (
                                    <div key={idx} className="flex items-start">
                                        {/* Assistant Profile Picture */}
                                        <Image
                                            src="/optimusPFP.jpg"
                                            alt="Chatimus Prime"
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 rounded-full mr-3 border-2 border-green-700 shadow-md object-cover"
                                        />
                                        <div
                                            className="p-6 rounded-xl bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 shadow-md max-w-2/3 w-2/3"
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
                                                                a: (props) => <a {...props} className="text-blue-500 underline" />, 
                                                            }}
                                                        >
                                                            {parsed.summary.replace(/https?:\/\/[^"]+/g, (match: string) => `[Link](${match})`)}
                                                        </ReactMarkdown>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="font-semibold prose dark:prose-invert max-w-none break-words whitespace-normal overflow-hidden">
                                                    <ReactMarkdown
                                                        components={{
                                                            a: (props) => <a {...props} className="text-blue-500 underline" />, 
                                                        }}
                                                    >
                                                        {parsed.normalAnswer.replace(/https?:\/\/[^"]+/g, (match: string) => `[Link](${match})`)}
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
                                    </div>
                                );
                            }
                        }
                        return (
                            <div key={idx} className="flex items-start justify-end">
                                {/* User bubble and profile pic */}
                                <div className="flex flex-row-reverse items-start w-full">
                                    <Image
                                        src="/userPFP.jpg"
                                        alt="You"
                                        width={40}
                                        height={40}
										className="w-10 h-10 rounded-full ml-3 border-2 border-blue-600 shadow-md object-cover"
                                    />
                                    <div className="p-6 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 shadow-md max-w-2/3 w-2/3">
                                        <b className="block mb-2 text-blue-700 dark:text-blue-300">You:</b>
                                        {m.content}
                                    </div>
                                </div>
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
                    <div className="flex space-x-2">
                        {/* Send Button */}
                        <button
                            className="ml-1 px-6 py-3 text-white rounded-lg shadow-md transition flex items-center justify-center"
                            style={{ backgroundColor: '#003A6C' }}
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
                                    a: (props) => <a {...props} className="text-blue-500 underline" />,
                                }}
                            >
                                {detailedAnswer.replace(/https?:\/\/[^"]+/g, (match: string) => `[Link](${match})`)}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}