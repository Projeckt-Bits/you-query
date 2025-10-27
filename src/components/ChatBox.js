'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatBox() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm YouQuery AI. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

try {
const response = await fetch("/api/auth/getGeminiResponse", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: inputMessage }),
});
const data = await response.json();

const botMessage = {
  id: Date.now() + 1,
  text: data.reply || "Sorry, I didn't understand that.",
  sender: "bot",
  timestamp: new Date(),
};

  setMessages((prev) => [...prev, botMessage]);
} catch (error) {
  console.error("Error sending message:", error);
  const errorMessage = {
    id: Date.now() + 1,
    text: "Sorry, I encountered an error. Please try again later.",
    sender: "bot",
    timestamp: new Date(),
  };
  setMessages((prev) => [...prev, errorMessage]);
} finally {
  setIsLoading(false);
  inputRef.current?.focus();
}

  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white px-4 sm:px-6 py-4 sm:py-5 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">YouQuery AI</h2>
            <p className="text-xs sm:text-sm text-indigo-100 mt-0.5">Ask me anything!</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm text-indigo-100 hidden sm:inline">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            } animate-slideIn`}
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-md transition-all duration-300 hover:shadow-lg ${
                message.sender === 'user'
                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
              }`}
            >
              {/* Message Text */}
              <p className="text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
                {message.text}
              </p>
              
              {/* Timestamp */}
              <p
                className={`text-xs mt-1.5 ${
                  message.sender === 'user'
                    ? 'text-indigo-200'
                    : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-white text-gray-800 shadow-md border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-gray-600">AI is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows="1"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400 text-sm sm:text-base transition-all duration-200"
              disabled={isLoading}
              style={{
                minHeight: '44px',
                maxHeight: '120px',
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 h-[44px] w-[44px] sm:h-[52px] sm:w-[52px] flex items-center justify-center"
            aria-label="Send message"
          >
            {isLoading ? (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 hidden sm:block">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
