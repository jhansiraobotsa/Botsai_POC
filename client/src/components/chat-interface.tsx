import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  chatbotId: string;
}

export default function ChatInterface({ chatbotId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const { toast } = useToast();

  const sessionId = `test-session-${chatbotId}`;

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", `/api/chatbots/${chatbotId}/chat`, {
        message,
        sessionId,
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: variables,
        timestamp: new Date().toISOString(),
      };

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, userMessage, botMessage]);
      setInputMessage("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessageMutation.mutate(inputMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Your Chatbot</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64 p-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-robot text-4xl text-slate-400 mb-4"></i>
              <p className="text-slate-600 text-sm">Start a conversation to test your chatbot</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2">
                      <i className="fas fa-robot text-white text-sm"></i>
                    </div>
                  )}
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                    data-testid={`message-${message.type}-${message.id}`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 text-sm"
              data-testid="input-test-message"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sendMessageMutation.isPending}
              size="sm"
              data-testid="button-send-test-message"
            >
              {sendMessageMutation.isPending ? (
                <i className="fas fa-spinner fa-spin text-sm"></i>
              ) : (
                <i className="fas fa-paper-plane text-sm"></i>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
