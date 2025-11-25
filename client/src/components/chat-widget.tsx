import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Hi! I\'m Vyoma AI Assistant. How can I help you create amazing chatbots today? 🚀',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [position, setPosition] = useState({ x: 24, y: 24 }); // px from bottom/right
  const dragRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragging = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([...messages, { sender: 'user', text: input, timestamp }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(msgs => [...msgs, { 
        sender: 'bot', 
        text: 'Thank you for your question! Our AI is processing your request. You can also reach out to our support team for immediate assistance.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1500);
  };

  // Drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    dragging.current = true;
    const rect = dragRef.current!.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging.current) return;
    setPosition({
      x: Math.max(window.innerWidth - (e.clientX - dragOffset.current.x + dragRef.current!.offsetWidth), 0),
      y: Math.max(window.innerHeight - (e.clientY - dragOffset.current.y + dragRef.current!.offsetHeight), 0),
    });
  };

  const onMouseUp = () => {
    dragging.current = false;
    document.body.style.userSelect = '';
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div
      ref={dragRef}
      className="fixed z-50 transition-all duration-300"
      style={{ right: position.x, bottom: position.y }}
    >
      {open ? (
        <Card className="w-[380px] shadow-2xl border-0 overflow-hidden rounded-2xl animate-in slide-in-from-bottom-5 duration-300">
          {/* Header with Vyoma.ai Branding */}
          <div
            className="relative bg-gradient-to-r from-primary via-primary to-secondary p-4 cursor-move select-none"
            onMouseDown={onMouseDown}
            title="Drag to move"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <i className="fas fa-robot text-primary text-lg"></i>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Vyoma AI</h3>
                  <p className="text-white/80 text-xs">Always here to help</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
                  title="Minimize"
                >
                  <i className="fas fa-minus text-sm"></i>
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setOpen(false)}
                  className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
                  title="Close"
                >
                  <i className="fas fa-times text-sm"></i>
                </Button>
              </div>
            </div>
            {/* Decorative wave */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 40" className="w-full h-3">
                <path 
                  fill="white" 
                  fillOpacity="0.3" 
                  d="M0,20 C240,30 480,10 720,20 C960,30 1200,10 1440,20 L1440,40 L0,40 Z"
                ></path>
              </svg>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="h-[400px] bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-4">
            <div className="flex flex-col gap-4">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-3 duration-300`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <i className="fas fa-robot text-white text-xs"></i>
                    </div>
                  )}
                  <div className={`flex flex-col max-w-[75%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div 
                      className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                        msg.sender === 'bot' 
                          ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none' 
                          : 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                      <i className="fas fa-user text-slate-600 dark:text-slate-300 text-xs"></i>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 animate-in fade-in duration-300">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <i className="fas fa-robot text-white text-xs"></i>
                  </div>
                  <div className="bg-white dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-white dark:bg-slate-800 border-t dark:border-slate-700">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button 
                onClick={() => {
                  setInput("How do I create a chatbot?");
                }}
                className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 whitespace-nowrap transition-colors"
              >
                💡 Create chatbot
              </button>
              <button 
                onClick={() => {
                  setInput("What are pricing plans?");
                }}
                className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 whitespace-nowrap transition-colors"
              >
                💰 Pricing
              </button>
              <button 
                onClick={() => {
                  setInput("Tell me about features");
                }}
                className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 whitespace-nowrap transition-colors"
              >
                ⚡ Features
              </button>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-primary dark:bg-slate-700 dark:text-white rounded-full px-4"
              />
              <Button 
                onClick={sendMessage} 
                size="sm"
                disabled={!input.trim()}
                className="rounded-full w-10 h-10 p-0 bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all disabled:opacity-50"
                title="Send message"
              >
                <i className="fas fa-paper-plane text-sm"></i>
              </Button>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-2">
              Powered by Vyoma.ai | <a href="#" className="hover:text-primary">Privacy Policy</a>
            </p>
          </div>
        </Card>
      ) : (
        <div className="relative group">
          {/* Pulse animation ring - behind button */}
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping pointer-events-none"></div>
          <Button 
            className="relative rounded-full w-16 h-16 shadow-2xl bg-gradient-to-br from-primary via-primary to-secondary hover:shadow-primary/50 text-white flex items-center justify-center text-2xl hover:scale-110 transition-all duration-300 border-4 border-white dark:border-slate-800" 
            onClick={() => setOpen(true)} 
            aria-label="Open Vyoma AI Assistant"
          >
            <i className="fas fa-robot"></i>
          </Button>
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              Need help? Chat with Vyoma AI
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-slate-900 rotate-45"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
