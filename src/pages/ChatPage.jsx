import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import {
  ArrowUpIcon, Paperclip, Code2, Rocket, Layers, Palette, CircleUserRound, MonitorIcon, FileUp, ImageIcon
} from "lucide-react";

// Auto-resize hook for the input box
function useAutoResizeTextarea({ minHeight, maxHeight }) {
  const textareaRef = useRef(null);

  const adjustHeight = useCallback((reset) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    if (reset) {
      textarea.style.height = `${minHeight}px`;
      return;
    }
    textarea.style.height = `${minHeight}px`;
    const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight || Infinity));
    textarea.style.height = `${newHeight}px`;
  }, [minHeight, maxHeight]);

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

// Text formatter for AI responses
const formatMessage = (text) => {
  return text.split('\n').map((line, i) => (
    <span key={i} style={{ display: 'block', marginBottom: line.trim() === '' ? '0' : '8px' }}>
      {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-white">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </span>
  ));
};

function QuickAction({ icon, label, onClick }) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border-neutral-700 bg-black/50 text-neutral-300 hover:text-white hover:bg-neutral-700"
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Button>
  );
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 48,
    maxHeight: 150,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const handleSend = async (e, overrideText = null) => {
    if (e) e.preventDefault();
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInput('');
    adjustHeight(true);
    setIsTyping(true);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'arth', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'arth', text: `System Error: ${data.message || 'Unknown issue'}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'arth', text: "Connection error. Is the backend running?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center flex flex-col items-center overflow-hidden font-sans"
      style={{
        backgroundImage: "url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen_moon_2.png')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Top Navigation */}
      <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <button onClick={() => navigate('/roadmap')} className="text-neutral-400 hover:text-white transition-colors text-sm font-medium">
          ← Back to Roadmap
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-emerald-500 font-medium tracking-wide uppercase">Online</span>
        </div>
      </nav>

      {/* Messages Area */}
      <div className="flex-1 w-full max-w-3xl overflow-y-auto px-4 pt-24 pb-8 flex flex-col gap-6 hide-scrollbar z-10">
        
        {/* Empty State Hero */}
        {messages.length === 0 && (
          <div className="flex-1 w-full flex flex-col items-center justify-center mt-[10vh]">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-semibold text-white drop-shadow-sm mb-3">
                ARTH AI
              </h1>
              <p className="text-neutral-300 text-sm max-w-md mx-auto">
                I've analyzed your Financial DNA. What's on your mind today?
              </p>
            </div>

            {/* Quick Actions (Only show when empty) */}
            <div className="flex items-center justify-center flex-wrap gap-3">
              <QuickAction onClick={() => handleSend(null, "How do I clear my debt faster?")} icon={<Layers className="w-4 h-4" />} label="Clear Debt" />
              <QuickAction onClick={() => handleSend(null, "What is a good SIP to start with?")} icon={<Rocket className="w-4 h-4" />} label="Start Investing" />
              <QuickAction onClick={() => handleSend(null, "How much emergency fund do I need?")} icon={<MonitorIcon className="w-4 h-4" />} label="Safety Net" />
              <QuickAction onClick={() => handleSend(null, "Explain tax saving under 80C")} icon={<Code2 className="w-4 h-4" />} label="Tax Optimization" />
            </div>
          </div>
        )}

        {/* Chat Bubbles */}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={cn(
              "max-w-[85%] px-5 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm backdrop-blur-md",
              msg.role === 'user' 
                ? "bg-white text-black rounded-br-sm" 
                : "bg-black/60 border border-neutral-800 text-neutral-200 rounded-bl-sm"
            )}>
              {formatMessage(msg.text)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="px-5 py-4 rounded-2xl bg-black/60 border border-neutral-800 text-neutral-400 text-sm rounded-bl-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Section */}
      <div className="w-full max-w-3xl px-4 pb-8 z-10">
        <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl border border-neutral-700 shadow-2xl transition-all focus-within:border-neutral-500 focus-within:bg-black/80">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask ARTH about your financial roadmap..."
            className={cn(
              "w-full px-4 py-4 resize-none border-none",
              "bg-transparent text-white text-[15px]",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-neutral-500 min-h-[48px]"
            )}
            style={{ overflow: "hidden" }}
          />

          {/* Footer Buttons */}
          <div className="flex items-center justify-between p-3 pt-0">
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-all",
                input.trim() && !isTyping 
                  ? "bg-white text-black hover:bg-neutral-200" 
                  : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              )}
            >
              <ArrowUpIcon className="w-4 h-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
        <p className="text-center text-xs text-neutral-500 mt-4">
          ARTH can make mistakes. Consider verifying important financial decisions.
        </p>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}