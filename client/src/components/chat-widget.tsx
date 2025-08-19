import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I assist you with your queries today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [position, setPosition] = useState({ x: 24, y: 24 }); // px from bottom/right
  const dragRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragging = useRef(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Thank you for your query! Our team will get back to you soon.' }]);
      setIsTyping(false);
    }, 1200);
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
      className="fixed z-50"
      style={{ right: position.x, bottom: position.y }}
    >
      {open ? (
        <Card className="w-80 shadow-lg">
          <div
            className="flex items-center justify-between p-3 border-b cursor-move select-none"
            onMouseDown={onMouseDown}
            title="Drag to move"
          >
            <span className="font-semibold">Assistance</span>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              <i className="fas fa-times"></i>
            </Button>
          </div>
          <div className="p-3 h-64 overflow-y-auto flex flex-col gap-2 bg-slate-50 dark:bg-slate-900">
            {messages.map((msg, i) => (
              <div key={i} className={`text-sm ${msg.sender === 'bot' ? 'text-left' : 'text-right'}`}> 
                <span className={msg.sender === 'bot' ? 'bg-primary/10 text-primary px-2 py-1 rounded' : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white px-2 py-1 rounded'}>
                  {msg.text}
                </span>
              </div>
            ))}
            {isTyping && <div className="text-xs text-slate-400">Bot is typing...</div>}
          </div>
          <div className="p-3 border-t flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type your query..."
              className="flex-1"
            />
            <Button onClick={sendMessage} size="sm">
              <i className="fas fa-paper-plane"></i>
            </Button>
          </div>
        </Card>
      ) : (
        <Button className="rounded-full w-14 h-14 shadow-lg bg-primary text-white flex items-center justify-center text-2xl" onClick={() => setOpen(true)} aria-label="Open Assistance Chat">
          <i className="fas fa-comments"></i>
        </Button>
      )}
    </div>
  );
}
