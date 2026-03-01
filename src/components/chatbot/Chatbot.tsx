import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
    MessageCircle, X, Send, Bot, User, Scissors,
    Calendar, Loader2, Sparkles
} from 'lucide-react';
import type { RootState } from '../../store';
import api from '../../api/axiosConfig';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!isAuthenticated) {
            setMessages([]);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = isAuthenticated
                ? `Hello ${user?.firstName}, I'm the Cutio assistant! How can I help you? You can ask for a redirection to our booking page or get information about our services.`
                : "Hello! I'm the Cutio assistant. I can give you information about our services and redirect you to the booking page.";

            setMessages([{
                role: 'assistant',
                content: greeting,
                timestamp: new Date()
            }]);
        }
    }, [isOpen, isAuthenticated, user, messages.length]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const historyForAi = messages
                .filter((_, idx) => !(idx === 0 && messages[0].role === 'assistant'))
                .map(m => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                }));

            const response = await api.post('/chat', {
                message: input.trim(),
                history: historyForAi,
                context: {
                    userName: user?.firstName,
                    isAuthenticated,
                }
            });

            const assistantMsg: Message = {
                role: 'assistant',
                content: response.data.reply,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMsg]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I can't connect right now. Please try again later.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessageWithLinks = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={index}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#87CEFA] font-bold underline decoration-[#0a0a0a]/50 hover:decoration-[#0a0a0a] underline-offset-4 transition-all mx-1"
                    >
                        [Go to Booking Page]
                    </a>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-brand-gold text-brand-dark rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] group"
            >
                <div className="absolute inset-0 bg-brand-gold rounded-2xl animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
                <MessageCircle className="w-8 h-8 relative z-10" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-8 right-8 w-[400px] h-[600px] bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-8 fade-in duration-500">

            <div className="bg-gradient-to-r from-brand-gold/20 to-transparent p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-gold rounded-2xl flex items-center justify-center shadow-lg shadow-brand-gold/10">
                        <Scissors className="w-6 h-6 text-brand-dark" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                            Cutio AI Assistant
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Always ready to help</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${msg.role === 'user' ? 'flex-row-reverse text-brand-gold' : 'text-gray-500'}`}>
                                {msg.role === 'user' ? (
                                    <>
                                        <span>YOU</span>
                                        <User className="w-3 h-3" />
                                    </>
                                ) : (
                                    <>
                                        <Bot className="w-3 h-3" />
                                        <span>AI ASSISTANT</span>
                                    </>
                                )}
                            </div>

                            <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed border shadow-xl
                                ${msg.role === 'user'
                                    ? 'bg-brand-gold border-brand-gold text-brand-dark rounded-tr-none'
                                    : 'bg-white/5 border-white/10 text-white rounded-tl-none whitespace-pre-wrap'}`}
                            >
                                {msg.role === 'assistant' ? renderMessageWithLinks(msg.content) : msg.content}
                            </div>

                            <p className="text-[9px] text-gray-700 font-bold uppercase tracking-tighter">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[85%] space-y-2">
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                <Bot className="w-3 h-3" />
                                <span>AI ASSISTANT</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-4 rounded-[1.5rem] rounded-tl-none shadow-xl">
                                <Loader2 className="w-5 h-5 animate-spin text-brand-gold" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t border-white/5 bg-[#0d0d0d]">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm font-bold focus:border-brand-gold/50 focus:bg-white/[0.08] transition-all outline-none placeholder:text-gray-700 text-white"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-brand-gold text-brand-dark rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-center justify-center gap-4 mt-6 opacity-30">
                    <div className="flex items-center gap-1.5 grayscale">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Appointment</span>
                    </div>
                    <div className="flex items-center gap-1.5 grayscale">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase tracking-widest">AI Powered</span>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(212, 175, 55, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(212, 175, 55, 0.3);
                }
            `}</style>
        </div>
    );
};

export default Chatbot;