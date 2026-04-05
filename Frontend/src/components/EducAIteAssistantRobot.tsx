import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // <-- Added AnimatePresence
import AImpatin from '../assets/robot.svg'; 

interface ChatMessage {
    text: string;
    isAi: boolean;
}

const EducAIteAssistantRobot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]); 
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessages = [...messages, { text: inputText, isAi: false }];
        setMessages(newMessages);
        setInputText('');

        setTimeout(() => {
            setMessages(prev => [...prev, { 
                text: "I am your AI study buddy! I'm still learning, but I'll be able to help you with your academics soon.", 
                isAi: true 
            }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            
            {/* --- ANIMATED CHAT WINDOW --- */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className="mb-4 w-[340px] md:w-[380px] bg-black border border-white/20 rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
                    >
                        
                        {/* Header */}
                        <div className="flex items-center gap-4 p-4 border-b border-white/20 bg-black z-10 shadow-sm">
                            <div className="w-12 h-12 rounded-full border border-white/20 bg-black flex items-center justify-center overflow-hidden shrink-0">
                                <img src={AImpatin} alt="educAIte Assistant" className="w-8 h-8 object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-white font-bold text-lg leading-tight tracking-wide">
                                    educ<span className="text-[#00CEC8]">AI</span>te
                                </h3>
                                <p className="text-white/60 text-xs font-medium">
                                    Your study buddy on academics
                                </p>
                            </div>
                        </div>

                        {/* Chat Messages Area */}
                        <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 h-[350px] max-h-[350px] bg-black [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            
                            {messages.length === 0 && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex-1 flex items-center justify-center text-white/30 text-sm italic"
                                >
                                    Type a message to start chatting...
                                </motion.div>
                            )}

                            {messages.map((msg, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, x: msg.isAi ? -10 : 10, y: 10 }}
                                    animate={{ opacity: 1, x: 0, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`${msg.isAi ? 'self-start' : 'self-end'} max-w-[85%] flex items-end gap-2.5`}
                                >
                                    {msg.isAi && (
                                        <div className="w-8 h-8 rounded-full border border-white/20 bg-black flex items-center justify-center overflow-hidden shrink-0">
                                            <img src={AImpatin} alt="AI Avatar" className="w-5 h-5 object-contain" />
                                        </div>
                                    )}
                                    <div className={`p-3.5 text-sm shadow-md ${
                                        msg.isAi 
                                        ? 'bg-[#D9D9D9] text-black rounded-t-2xl rounded-br-2xl rounded-bl-sm' 
                                        : 'bg-[#00CEC8]/20 border border-[#00CEC8]/30 text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 flex items-center gap-3 bg-black mt-auto border-t border-white/10">
                            <button className="w-10 h-10 rounded-full bg-white shrink-0 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shadow-md" />
                            
                            <div className="flex-1 h-11 bg-[#737373] rounded-full overflow-hidden focus-within:ring-2 ring-white/30 transition-all">
                                <input 
                                    type="text" 
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Message educAIte..."
                                    className="w-full h-full bg-transparent px-5 text-white outline-none placeholder:text-white/60 text-sm font-medium"
                                />
                            </div>
                            
                            <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleSend}
                                disabled={!inputText.trim()}
                                className="w-11 h-11 rounded-full bg-black border-[1.5px] border-white/20 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:border-[#00CEC8]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[#00CEC8]"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"/>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                </svg>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- TOGGLE BUTTON ANIMATION --- */}
            <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full border border-white/20 flex items-center justify-center overflow-hidden cursor-pointer transition-all shadow-xl
                    ${isOpen ? 'bg-white/10 border-[#00CEC8]/50' : 'bg-black'}
                `}
            >
                <img src={AImpatin} alt="Toggle Assistant" className="w-10 h-10 object-contain" />
            </motion.div>

        </div>
    );
};

export default EducAIteAssistantRobot;