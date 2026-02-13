
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserRole } from '../types';

interface ChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  currentUserRole: UserRole;
  recipientName: string;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ messages, onSendMessage, currentUserRole, recipientName, onBack }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex items-center gap-4 py-3 border-b border-neutral-800 mb-4 px-2">
        <button onClick={onBack} className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 active:scale-90 transition-all">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div>
          <h3 className="font-black text-white leading-tight text-base">{recipientName}</h3>
          <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Active Signal</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-grow overflow-y-auto space-y-4 px-2 pb-24 no-scrollbar">
        {messages.map((msg) => {
          if (msg.senderRole === 'system') {
            return (
              <div key={msg.id} className="flex justify-center my-3">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600 px-3 py-1 rounded-full border border-neutral-800 bg-black/20">
                  {msg.text}
                </span>
              </div>
            );
          }
          const isMe = msg.senderRole === currentUserRole;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-neutral-800 text-neutral-200 rounded-tl-none border border-neutral-700 shadow-sm'}`}>
                {msg.text}
                <div className={`text-[8px] mt-1.5 opacity-50 font-black uppercase tracking-wider ${isMe ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-6 left-0 right-0 px-2 pb-safe">
        <form onSubmit={handleSend} className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 p-2 rounded-2xl shadow-2xl backdrop-blur-md">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow bg-transparent border-none outline-none px-3 py-2 text-white placeholder:text-neutral-700 font-medium text-sm"
          />
          <button type="submit" disabled={!inputText.trim()} className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center active:scale-90 disabled:opacity-30 transition-all">
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
