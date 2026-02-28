import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Map, Target, CheckCircle, Smartphone, Globe, Lock, Code, Cpu, Database, Save, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnimatedButton, GlassCard, Badge, SectionTitle } from '../components/ui';

// Initialize Gemini API
// Note: In a real production app, you should use an environment variable or a secure backend proxy
// const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

const RoadmapPage = () => {
    const navigate = useNavigate();
    const [goal, setGoal] = useState('');
    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState(null);
    const [apiKey, setApiKey] = useState(''); // Temporary for demo
    const [showKeyInput, setShowKeyInput] = useState(false);

    const generateRoadmap = async () => {
        if (!goal.trim()) return;

        // For demo purposes, if no API key is provided, we use a mock response
        if (!apiKey) {
            setLoading(true);
            setTimeout(() => {
                const mockRoadmap = {
                    title: `Roadmap to Learn ${goal}`,
                    steps: [
                        { title: 'Foundations', description: 'Understand the basic concepts and terminology.', duration: '1-2 weeks', status: 'completed' },
                        { title: 'Core Skills', description: 'Learn the essential tools and techniques.', duration: '3-4 weeks', status: 'in-progress' },
                        { title: 'Practical Application', description: 'Build small projects to apply your knowledge.', duration: '4-6 weeks', status: 'pending' },
                        { title: 'Advanced Concepts', description: 'Dive deeper into complex topics and optimizations.', duration: '2-3 months', status: 'pending' },
                        { title: 'Mastery', description: 'Contribute to open source or build a major project.', duration: 'Ongoing', status: 'pending' }
                    ]
                };
                setRoadmap(mockRoadmap);
                setLoading(false);
            }, 2000);
            return;
        }

        // Check if API key is present
        if (!apiKey) {
            console.warn("No API Key provided. Using mock data.");
            // Logic to use mock data is already above, but we need to ensure we don't proceed to API call
            return;
        }

        setLoading(true);
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Changed to 1.5-flash as 2.5 might not be available yet publicly or requires specific beta access

            const prompt = `Create a detailed step-by-step learning roadmap for: "${goal}".  
      Return the response in strictly JSON format with the following structure:
      {
        "title": "Roadmap Title",
        "steps": [
          { "title": "Step Title", "description": "Brief description", "duration": "Estimated time", "status": "pending" }
        ]
      }`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Basic JSON cleanup if needed (Gemini usually returns clean JSON if asked)
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            setRoadmap(JSON.parse(cleanedText));
        } catch (error) {
            console.error("Error generating roadmap:", error);
            let errorMessage = "Failed to generate roadmap. Please check your API key.";
            if (error.message.includes('400')) errorMessage = "Invalid API Key or Bad Request (400). Please check your key.";
            if (error.message.includes('403')) errorMessage = "Access Denied (403). Your API key might not have permission for this model.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"
                    >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </motion.button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowKeyInput(!showKeyInput)}
                            className="text-xs text-purple-300 hover:text-white underline"
                        >
                            {showKeyInput ? 'Hide API Key' : 'Use Custom API Key'}
                        </button>
                    </div>
                </div>

                {/* API Key Input (Optional) */}
                <AnimatePresence>
                    {showKeyInput && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mb-6 overflow-hidden"
                        >
                            <GlassCard className="max-w-md mx-auto">
                                <label className="block text-sm text-gray-400 mb-2">Enter Gemini API Key</label>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Paste your API key here..."
                                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Leave empty to use the demo mock generator.
                                </p>
                            </GlassCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hero Section */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 mb-4"
                    >
                        <Sparkles size={16} />
                        <span className="text-sm font-medium">Powered by Gemini 2.5 Flash</span>
                    </motion.div>

                    <SectionTitle
                        title="AI Roadmap Generator"
                        subtitle="Turn your financial goals into a personalized step-by-step learning path."
                    />
                </div>

                {/* Generator Input */}
                <div className="max-w-2xl mx-auto mb-16">
                    <GlassCard className="p-2 flex items-center gap-2">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <Target className="text-purple-400" size={24} />
                        </div>
                        <input
                            type="text"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="What do you want to learn? (e.g., 'Stock Market Basics')"
                            className="flex-1 bg-transparent border-none text-lg text-white placeholder-gray-500 focus:outline-none px-2"
                            onKeyDown={(e) => e.key === 'Enter' && generateRoadmap()}
                        />
                        <AnimatedButton
                            onClick={generateRoadmap}
                            disabled={loading || !goal.trim()}
                            loading={loading}
                            className="min-w-[140px]"
                        >
                            {loading ? 'Generating...' : 'Generate Plan'}
                        </AnimatedButton>
                    </GlassCard>
                </div>

                {/* Roadmap Display */}
                <AnimatePresence mode="wait">
                    {roadmap && (
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{roadmap.title}</h2>
                                    <p className="text-gray-400">Your personalized learning journey</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-300">
                                        <Share2 size={20} />
                                    </button>
                                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-300">
                                        <Save size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                {/* Timeline Line */}
                                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-blue-500 to-transparent opacity-30" />

                                <div className="space-y-8">
                                    {roadmap.steps.map((step, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative pl-24"
                                        >
                                            {/* Timeline Node */}
                                            <div className={`
                        absolute left-0 w-16 h-16 rounded-2xl flex items-center justify-center border-2 z-10 bg-gray-900
                        ${index === 0 ? 'border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]' :
                                                    index === roadmap.steps.length - 1 ? 'border-blue-500 text-blue-400' : 'border-gray-700 text-gray-500'}
                      `}>
                                                <span className="text-xl font-bold">{index + 1}</span>
                                            </div>

                                            <GlassCard className="hover:border-purple-500/30 transition-colors group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                                        {step.title}
                                                    </h3>
                                                    <Badge color={index === 0 ? 'green' : 'blue'}>
                                                        {step.duration}
                                                    </Badge>
                                                </div>
                                                <p className="text-gray-400 leading-relaxed">
                                                    {step.description}
                                                </p>
                                            </GlassCard>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 text-center">
                                <AnimatedButton variant="outline" onClick={() => { setRoadmap(null); setGoal(''); }}>
                                    Create Another Roadmap
                                </AnimatedButton>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default RoadmapPage;
