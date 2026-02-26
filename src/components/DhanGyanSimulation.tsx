'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Bot,
    TrendingUp,
    ShieldAlert,
    Award,
    Zap,
    Target,
    PiggyBank,
    Send,
    Loader2
} from 'lucide-react';

export default function DhanGyanSimulation() {
    const [activeTab, setActiveTab] = useState<'assistant' | 'simulation' | 'quests'>('simulation');

    // Assistant State
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: "Namaste! I am your Gyan Assistant. I can help you understand personal finance, manage your placement salary, or avoid BNPL (Buy Now Pay Later) traps. What would you like to learn today?" }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Simulation State
    const [simulationStep, setSimulationStep] = useState(0);
    const [financialIq, setFinancialIq] = useState(120);
    const [balance, setBalance] = useState(50000);

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: inputMessage }]);
        setInputMessage('');
        setIsTyping(true);

        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "That's a great question! Based on the 50/30/20 rule, you should put 50% towards needs, 30% towards wants, and 20% towards savings. Avoiding BNPL for impulse purchases is key to financial freedom!"
            }]);
            setIsTyping(false);
        }, 1500);
    };

    const simulationScenarios = [
        {
            title: "The BNPL Trap",
            description: "You see a new pair of sneakers for ₹10,000. You only have ₹5,000 in your bank account, but an app offers 3 months 'No Cost EMI'. What do you do?",
            options: [
                { text: "Take the EMI, it's free money!", iqChange: -10, balChange: -10000, nextState: 1 },
                { text: "Save up for 2 more months and buy it then.", iqChange: +15, balChange: 0, nextState: 2 }
            ]
        },
        {
            title: "Missed Payment",
            description: "You took the EMI, but forgot the due date because of your FAT exams. The bank hit you with a ₹500 late fee and a 36% penalty interest rate!",
            options: [
                { text: "Ask parents for money to clear the debt immediately.", iqChange: +5, balChange: -10500, nextState: 3 },
                { text: "Ignore it, I'll pay next month.", iqChange: -25, balChange: -15000, nextState: 3 }
            ]
        },
        {
            title: "Delayed Gratification",
            description: "You waited 2 months and saved ₹10,000! Plus, the sneakers are now on a 20% discount. You buy them for ₹8,000.",
            options: [
                { text: "Invest the remaining ₹2,000 in an index fund.", iqChange: +20, balChange: -8000, nextState: 3 },
                { text: "Spend the ₹2,000 on a celebration dinner.", iqChange: +5, balChange: -10000, nextState: 3 }
            ]
        },
        {
            title: "Simulation Complete",
            description: "You've completed the Student Finance simulation! Your decisions under pressure determine your Financial IQ.",
            options: [
                { text: "Play Again", iqChange: 0, balChange: 0, nextState: 0 }
            ]
        }
    ];

    const handleDecision = (option: any) => {
        setFinancialIq(prev => prev + option.iqChange);
        setBalance(prev => prev + option.balChange);
        setSimulationStep(option.nextState);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF6B00] to-[#FFB800] bg-clip-text text-transparent flex items-center gap-2">
                        DhanGyan Intelligence
                    </h1>
                    <p className="text-white/50 text-sm mt-1">India's First AI-Powered Financial Empowerment Engine, right in your Campus OS.</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center min-w-[100px]">
                        <p className="text-xs text-white/40 uppercase font-semibold">Financial IQ</p>
                        <p className="text-xl font-bold text-[#FFB800]">{financialIq}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-center min-w-[100px]">
                        <p className="text-xs text-white/40 uppercase font-semibold">Net Worth</p>
                        <p className="text-xl font-bold text-[#00C896]">₹{balance.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 bg-white/[0.03] p-1.5 rounded-xl w-fit border border-white/[0.06]">
                {[
                    { id: 'simulation', icon: Target, label: 'Live Simulation' },
                    { id: 'assistant', icon: Bot, label: 'Gyan AI Chat' },
                    { id: 'quests', icon: Zap, label: 'Daily Quests' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-[#FF6B00]/20 to-[#FFB800]/20 text-[#FFB800] border border-[#FF6B00]/30 glow'
                                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left/Main Panel */}
                <div className="md:col-span-2">
                    {activeTab === 'simulation' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 min-h-[400px] flex flex-col justify-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-1 bg-gradient-to-b from-[#FF6B00] to-[#FFB800] h-full" />

                            <div className="max-w-xl mx-auto w-full space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-[#FF6B00]/10 text-[#FFB800] border border-[#FF6B00]/20 rounded-xl">
                                            <ShieldAlert size={24} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white/90">{simulationScenarios[simulationStep].title}</h2>
                                    </div>
                                    <p className="text-white/70 text-lg leading-relaxed">
                                        {simulationScenarios[simulationStep].description}
                                    </p>
                                </div>

                                <div className="space-y-3 pt-4">
                                    {simulationScenarios[simulationStep].options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleDecision(option)}
                                            className="w-full relative group"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00] to-[#FFB800] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                                            <div className="relative p-4 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-between group-hover:border-transparent transition-all">
                                                <span className="text-white/80 font-medium">{option.text}</span>
                                                <TrendingUp size={18} className="text-white/30 group-hover:text-white transform group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'assistant' && (
                        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl flex flex-col h-[500px]">
                            <div className="p-4 border-b border-white/[0.06] flex flex-row items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#ec4899] flex items-center justify-center shadow-lg shadow-[#FF6B00]/20">
                                    <Bot className="text-white w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Gyan AI Assistant</h3>
                                    <p className="text-xs text-green-400">Online • Fluent in campus finance</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user'
                                                ? 'bg-cyan-500/20 border border-cyan-500/30 text-white'
                                                : 'bg-white/5 border border-white/10 text-white/90'
                                            }`}>
                                            <p className="text-sm leading-relaxed">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-1">
                                            <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce cursor-wait" />
                                            <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce delay-75 cursor-wait" />
                                            <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce delay-150 cursor-wait" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-white/[0.06]">
                                <div className="relative flex items-center">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Ask about SIPs, credit cards, or budget planning..."
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00]/50"
                                    />
                                    <button onClick={handleSendMessage} className="absolute right-2 p-2 text-[#FFB800] hover:bg-[#FFB800]/10 rounded-lg transition-colors">
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'quests' && (
                        <div className="space-y-4">
                            {[
                                { title: "First Step to Wealth", desc: "Complete 1 simulated life scenario", xp: "+50 XP", done: simulationStep > 0 },
                                { title: "Curious Learner", desc: "Ask Gyan AI 3 questions", xp: "+30 XP", done: messages.length > 2 },
                                { title: "Budget Master", desc: "Set up a monthly budget constraint", xp: "+100 XP", done: false },
                            ].map((quest, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                    className={`p-4 rounded-xl border flex items-center justify-between ${quest.done ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${quest.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'}`}>
                                            {quest.done ? <Target size={20} /> : <PiggyBank size={20} />}
                                        </div>
                                        <div>
                                            <h4 className={`font-medium ${quest.done ? 'text-emerald-400' : 'text-white/80'}`}>{quest.title}</h4>
                                            <p className="text-sm text-white/40">{quest.desc}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${quest.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/50'}`}>
                                        {quest.xp}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Panel / Stats */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-xl">
                        <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-white">Learning Streak</h3>
                            <Zap size={20} className="text-yellow-400" />
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-4xl font-black text-white">4</span>
                            <span className="text-white/50">Days</span>
                        </div>
                        <p className="text-sm text-white/50">Next milestone: 7 Days (+250 XP)</p>

                        <div className="flex gap-2 mt-4">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                                <div key={i} className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-medium ${i < 4 ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/30'
                                    }`}>
                                    {d}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Award size={100} />
                        </div>
                        <h3 className="font-bold text-white mb-4 relative z-10">Financial Health</h3>
                        <div className="space-y-4 relative z-10">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-white/60">Risk Tolerance</span>
                                    <span className="text-cyan-400">Moderate</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2">
                                    <div className="bg-cyan-500 h-2 rounded-full w-[60%] shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-white/60">Debt-to-Income</span>
                                    <span className="text-emerald-400">Healthy</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2">
                                    <div className="bg-emerald-500 h-2 rounded-full w-[85%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-white/60">Savings Rate</span>
                                    <span className="text-yellow-400">Needs Work</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full w-[40%] shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
