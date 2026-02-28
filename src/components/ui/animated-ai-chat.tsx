'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Copy, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const quickPrompts = [
    "Explain machine learning",
    "Write a Python function",
    "Help with calculus",
    "Career advice for CS students"
];

export function AnimatedAIChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm your AI learning assistant. I can help you with:\n\n• **Programming** - Code explanations, debugging, best practices\n• **Mathematics** - Calculus, linear algebra, statistics\n• **Career** - Job prep, portfolio reviews, interview tips\n• **General** - Any questions about your studies\n\nHow can I help you today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = generateResponse(userMessage.content);
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const generateResponse = (query: string): string => {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('machine learning') || lowerQuery.includes('ml')) {
            return "## Machine Learning Overview\n\nMachine Learning is a subset of AI that enables systems to learn from data. Here are the main types:\n\n### 1. **Supervised Learning**\n- Uses labeled datasets\n- Examples: Classification, Regression\n- Algorithms: Linear Regression, Decision Trees, Neural Networks\n\n### 2. **Unsupervised Learning**\n- Finds patterns in unlabeled data\n- Examples: Clustering, Dimensionality Reduction\n- Algorithms: K-Means, PCA, Autoencoders\n\n### 3. **Reinforcement Learning**\n- Learns through rewards/penalties\n- Used in game AI, robotics\n- Algorithms: Q-Learning, Deep Q-Networks\n\nWould you like me to dive deeper into any specific area?";
        }

        if (lowerQuery.includes('python') || lowerQuery.includes('code') || lowerQuery.includes('function')) {
            return "## Code Example\n\nHere's a helpful Python function:\n\n```python\ndef binary_search(arr, target):\n    \"\"\"Binary search implementation\"\"\"\n    left, right = 0, len(arr) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        \n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    \n    return -1  # Element not found\n\n# Usage\narr = [1, 3, 5, 7, 9, 11, 13]\nresult = binary_search(arr, 7)\nprint(f\"Element found at index: {result}\")\n```\n\n**Time Complexity:** O(log n)\n**Space Complexity:** O(1)\n\nWould you like more examples?";
        }

        if (lowerQuery.includes('calculus') || lowerQuery.includes('derivative') || lowerQuery.includes('integral')) {
            return "## Calculus Fundamentals\n\n### Derivatives\nThe derivative represents the rate of change of a function:\n\n$$\\frac{d}{dx}[x^n] = nx^{n-1}$$\n\n**Key Rules:**\n- **Product Rule:** (fg)' = f'g + fg'\n- **Chain Rule:** (f∘g)' = f'(g) · g'\n- **Quotient Rule:** (f/g)' = (f'g - fg')/g²\n\n### Integrals\nThe integral represents the area under a curve:\n\n$$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$$\n\n**Common Integrals:**\n- $\\int e^x dx = e^x + C$\n- $\\int \\frac{1}{x} dx = \\ln|x| + C$\n\nWould you like to see step-by-step examples?";
        }

        if (lowerQuery.includes('career') || lowerQuery.includes('job') || lowerQuery.includes('interview')) {
            return "## Career Guidance for CS Students\n\n### Preparation Roadmap\n\n**1. Technical Skills (Priority Order)**\n- Data Structures & Algorithms\n- One programming language (Python/Java/C++)\n- SQL & Databases\n- Web fundamentals (HTML/CSS/JS)\n- Git & Version Control\n\n**2. Projects Portfolio**\n- Build 3-4 substantial projects\n- Deploy them live\n- Write clear README docs\n- Include in your resume\n\n**3. Interview Prep**\n- LeetCode: 100+ problems (Easy/Medium)\n- System Design basics\n- Behavioral questions\n\n**4. Resources**\n- LeetCode, HackerRank\n- freeCodeCamp\n- CS50 (for fundamentals)\n\nWhat specific area would you like to focus on?";
        }

        return "I understand you're asking about: **\"${query}\"**\n\nHere's what I can help you with:\n\n1. **Technical Concepts** - Explain programming, algorithms, data structures\n2. **Mathematics** - Calculus, linear algebra, statistics\n3. **Study Tips** - Effective learning strategies\n4. **Career Guidance** - Job prep, portfolio building\n\nCould you provide more details about what you'd like to learn?";
    };

    const handleQuickPrompt = (prompt: string) => {
        setInput(prompt);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="h-full flex flex-col glass-enhanced rounded-2xl overflow-hidden perspective-3d" style={{ transformStyle: 'preserve-3d' }}>
            {/* Animated glow background */}
            <div className="absolute inset-0 holographic opacity-30 pointer-events-none" />

            {/* Header */}
            <motion.div
                className="relative flex items-center gap-3 px-6 py-4 border-b border-white/[0.06]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30 neumorphic-button"
                    animate={{
                        rotateY: [0, 360],
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <Bot className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                    <h2 className="text-lg font-bold text-white/90">AI Learning Assistant</h2>
                    <p className="text-xs text-white/40 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Online • Ready to help
                    </p>
                </div>
                <div className="ml-auto flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors neumorphic-button"
                    >
                        <RefreshCw size={18} />
                    </motion.button>
                </div>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'bg-violet-500/20 text-violet-400'
                                }`}>
                                {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                                <div className={`inline-block p-4 rounded-2xl ${message.role === 'user'
                                    ? 'bg-cyan-500/20 text-cyan-100 rounded-br-md'
                                    : 'bg-white/[0.05] text-white/80 rounded-bl-md'
                                    }`}>
                                    <div className="prose prose-invert prose-sm max-w-none">
                                        {message.content.split('\n').map((line, i) => (
                                            <p key={i} className="mb-1 last:mb-0">{line}</p>
                                        ))}
                                    </div>
                                </div>
                                {message.role === 'assistant' && (
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => copyToClipboard(message.content)}
                                            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
                                            title="Copy"
                                        >
                                            <Copy size={14} />
                                        </button>
                                        <button
                                            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
                                            title="Helpful"
                                        >
                                            <ThumbsUp size={14} />
                                        </button>
                                        <button
                                            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
                                            title="Not helpful"
                                        >
                                            <ThumbsDown size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                            <Bot size={16} className="text-violet-400" />
                        </div>
                        <div className="bg-white/[0.05] rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                    {quickPrompts.map((prompt, i) => (
                        <button
                            key={i}
                            onClick={() => handleQuickPrompt(prompt)}
                            className="px-3 py-1.5 text-xs text-white/60 bg-white/[0.05] hover:bg-white/[0.1] rounded-full border border-white/[0.06] transition-colors flex items-center gap-1"
                        >
                            <Sparkles size={12} className="text-violet-400" />
                            {prompt}
                        </button>
                    ))}
                </div>
            )}

            {/* Input */}
            <div className="relative p-4 border-t border-white/[0.06]">
                {/* Input glow effect */}
                <div className="absolute inset-x-4 bottom-4 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

                <div className="flex gap-3">
                    <motion.input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me anything..."
                        className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white/80 placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all neumorphic-inset"
                        disabled={isTyping}
                        whileFocus={{ scale: 1.01 }}
                    />
                    <motion.button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/30 neumorphic-button"
                    >
                        <Send size={18} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
