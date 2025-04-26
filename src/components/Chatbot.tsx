import React, { useState, useEffect } from "react";
import { IoChatbubblesSharp } from "react-icons/io5";
import { ChatMessage } from "../types";

const Chatbot: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { text: "Hi! I'm your AI travel assistant. How can I help you plan your perfect trip?", isUser: false },
  ]);
  const [userInput, setUserInput] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChatOpen(true);
    }, 10000); // Auto open after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = () => {
    if (userInput.trim()) {
      const newMessage = { text: userInput, isUser: true };
      setChatMessages([...chatMessages, newMessage]);

      setTimeout(() => {
        let response = "";
        if (userInput.toLowerCase().includes("package") || userInput.toLowerCase().includes("trip")) {
          response = "I can help you find the perfect travel package! Could you tell me your preferred destination?";
        } else if (userInput.toLowerCase().includes("price") || userInput.toLowerCase().includes("cost")) {
          response = "Our packages range from $1,999 to $3,999. What's your budget range?";
        } else if (userInput.toLowerCase().includes("hello") || userInput.toLowerCase().includes("hi")) {
          response = "Hello! I'm here to help you plan your perfect trip. What type of vacation are you interested in?";
        } else {
          response = "I'd love to help you plan your trip. Could you tell me more about what you're looking for?";
        }
        setChatMessages((prev) => [...prev, { text: response, isUser: false }]);
      }, 1000);

      setUserInput("");
    }
  };

  return (
    <>
      <div
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
                {message.text}
              </div>
            </div>
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
            />
            <button
              onClick={handleSendMessage}
              className="rounded-r-full px-6 py-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              Send
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