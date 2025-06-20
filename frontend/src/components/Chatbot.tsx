import React, { useState, useEffect, useRef } from "react";
import { IoChatbubblesSharp } from "react-icons/io5";
import { ChatMessage } from "../types";
import { getApiUrl } from "../utils/apiConfig";

// Helper function to format text with line breaks, indentation, and clickable links
const formatChatText = (text: string) => {
  // URL regex pattern
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  
  return text.split('\n').map((line, i) => {
    // Check if line starts with a number followed by a period (like "1.")
    const isListItem = /^\d+\./.test(line.trim());
    // Check if line starts with spaces/tabs followed by text (indented)
    const isIndented = /^\s+\w+/.test(line);
    
    // Apply different styling based on line type
    const className = isListItem 
      ? "font-semibold mt-2" 
      : isIndented 
        ? "ml-4" 
        : "";
    
    // Make URLs clickable
    const parts = line.split(urlPattern);
    const formattedLine = parts.map((part, j) => {
      if (part.match(urlPattern)) {
        return (
          <a 
            key={j} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-600 underline hover:text-blue-800"
          >
            {part}
          </a>
        );
      }
      return part;
    });
        
    return (
      <React.Fragment key={i}>
        <span className={className}>{formattedLine}</span>
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    );
  });
};

// Helper function to detect if the message is asking about contact or booking
const isContactOrBookingQuery = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return lowerMessage.includes('contact') || 
         lowerMessage.includes('email') || 
         lowerMessage.includes('phone') || 
         lowerMessage.includes('book') || 
         lowerMessage.includes('reserve') ||
         lowerMessage.includes('location') ||
         lowerMessage.includes('address');
};

const Chatbot: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { text: "Hi! I'm your AI travel assistant. How can I help you plan your perfect trip?", isUser: false },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);
  
  // Handle clicks outside of the chatbot
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target as Node) && isChatOpen) {
        setIsChatOpen(false);
      }
    };
    
    // Add event listener when chat is open
    if (isChatOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatOpen]);

  // Add quick response buttons
  const quickResponses = [
    { text: "How to book?", action: () => handleQuickResponse("How can I book a tour?") },
    { text: "Contact info", action: () => handleQuickResponse("What is your contact information?") },
    { text: "Popular packages", action: () => handleQuickResponse("What are your popular tour packages?") }
  ];

  const handleQuickResponse = (text: string) => {
    setUserInput(text);
    handleSendMessage(text);
  };

  const handleSendMessage = async (text?: string) => {
    const messageToSend = text || userInput;
    
    if (messageToSend.trim()) {
      const newMessage = { text: messageToSend, isUser: true };
      setChatMessages([...chatMessages, newMessage]);
      setUserInput("");
      setIsLoading(true);

      try {
        const response = await fetch(getApiUrl('/api/chatbot/response'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: messageToSend }),
        });

        const data = await response.json();
        setChatMessages((prev) => [...prev, { text: data.response, isUser: false }]);
      } catch (error) {
        console.error('Error getting chatbot response:', error);
        setChatMessages((prev) => [
          ...prev,
          { 
            text: 'I apologize, but I\'m having trouble connecting to our servers. Please try again in a moment.',
            isUser: false 
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div
        ref={chatbotRef}
        className={`fixed bottom-14 right-2 w-96 bg-white rounded-xl shadow-2xl transition-all duration-300 transform ${
          isChatOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
        } z-50`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <IoChatbubblesSharp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">Travel Assistant</h3>
                <p className="text-sm text-gray-500">How can I assist you today?</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-gray-400 hover:text-gray-600">
              ✖
            </button>
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4" style={{ scrollBehavior: "smooth" }}>
          {chatMessages.map((message, index) => (
            <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}>
              <div className={`max-w-[80%] p-3 rounded-xl ${message.isUser ? "bg-blue-600 text-white" : "bg-gray-100"}`}>
                {formatChatText(message.text)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="max-w-[80%] p-3 rounded-xl bg-gray-100">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick response buttons */}
        <div className="px-4 py-2 border-t border-gray-200 flex flex-wrap gap-2">
          {quickResponses.map((response, index) => (
            <button
              key={index}
              onClick={response.action}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
            >
              {response.text}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              placeholder="Tell us how we can help..."
              className="flex-1 px-4 py-2 border border-gray-200 rounded-l-full focus:outline-none focus:border-blue-500"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              className={`rounded-r-full px-6 py-2 ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white transition-colors`}
              disabled={isLoading}
            >
              {isLoading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-2 right-2 flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50"
      >
        <IoChatbubblesSharp className="h-6 w-6 mr-2" />
        Ask Questions
      </button>
    </>
  );
};

export default Chatbot;