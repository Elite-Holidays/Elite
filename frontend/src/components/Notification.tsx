import React, { useEffect, useState } from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  visible: boolean;
  onClose?: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  visible,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
    
    if (visible) {
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!isVisible) return null;

  const bgColor = 
    type === "success" ? "bg-green-500" :
    type === "error" ? "bg-red-500" :
    "bg-blue-500";
    
  return (
    <div className={`fixed top-24 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center`}>
      <span className="mr-2">
        {type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"}
      </span>
      <p>{message}</p>
      <button 
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
        className="ml-4 text-white hover:text-gray-200"
      >
        ✕
      </button>
    </div>
  );
};

export default Notification; 