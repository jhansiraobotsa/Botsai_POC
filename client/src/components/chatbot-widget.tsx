import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Chatbot } from "@shared/schema";

interface ChatbotWidgetProps {
  chatbot: Chatbot;
}

export default function ChatbotWidget({ chatbot }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getPositionClasses = () => {
    switch (chatbot.position) {
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      default:
        return "bottom-4 right-4";
    }
  };

  const getSizeClasses = () => {
    switch (chatbot.size) {
      case "compact":
        return "w-72";
      case "large":
        return "w-96";
      default:
        return "w-80";
    }
  };

  return (
    <div className={`absolute ${getPositionClasses()}`}>
      {/* Chat Toggle Button */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:opacity-90 transition-opacity"
        style={{ backgroundColor: chatbot.primaryColor }}
        onClick={() => setIsOpen(!isOpen)}
        data-testid="button-widget-toggle"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-comments'} text-white text-lg`}></i>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card 
          className={`absolute bottom-16 right-0 ${getSizeClasses()} shadow-2xl border-0`}
          data-testid="widget-chat-window"
        >
          {/* Chat Header */}
          <CardHeader 
            className="text-white p-4 rounded-t-lg"
            style={{ backgroundColor: chatbot.primaryColor }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <i className="fas fa-robot mr-2"></i>
                <span className="font-medium">{chatbot.name}</span>
              </div>
              <button 
                className="text-white hover:text-gray-200"
                onClick={() => setIsOpen(false)}
                data-testid="button-widget-close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </CardHeader>

          {/* Chat Messages */}
          <CardContent className="p-4 h-64 overflow-y-auto space-y-3">
            <div className="flex items-start">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                style={{ backgroundColor: chatbot.primaryColor }}
              >
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <div className="bg-slate-100 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-slate-700">{chatbot.welcomeMessage}</p>
              </div>
            </div>
          </CardContent>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Type your message..."
                className="flex-1 text-sm"
                data-testid="input-widget-message"
              />
              <Button
                size="sm"
                style={{ backgroundColor: chatbot.primaryColor }}
                className="hover:opacity-90"
                data-testid="button-widget-send"
              >
                <i className="fas fa-paper-plane text-sm"></i>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
