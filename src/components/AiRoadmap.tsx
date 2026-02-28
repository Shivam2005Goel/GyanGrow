'use client';

import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Sparkles, Map as MapIcon, Target, Clock, ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, BookOpen, Layers, AlertCircle, Play, Save, Share2 } from 'lucide-react';
import { searchYouTubeVideos } from '@/lib/youtubeApi';
import { YouTubeVideo } from '@/types/learning';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface RoadmapStep {
    id: string;
    title: string;
    description: string;
    duration: string;
    resources: string[];
    isCompleted?: boolean;
}

interface RoadmapData {
    topic: string;
    overview: string;
    estimatedTotalTime: string;
    difficulty: string;
    steps: RoadmapStep[];
}

const GlassCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 ${className}`}>
        {children}
    </div>
);

const AnimatedButton = ({ children, onClick, disabled, loading, className = '', variant = 'primary', type = 'button' }: any) => {
    const baseStyle = "px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]",
        outline: "border border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
    };

    return (
        <motion.button
            type={type}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}
        >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : children}
        </motion.button>
    );
};

export default function AiRoadmap() {
    const router = useRouter();
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
    const [stepVideos, setStepVideos] = useState<Record<string, YouTubeVideo[]>>({});
    const [error, setError] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState('');
    const [showKeyInput, setShowKeyInput] = useState(false);

    const fetchVideosForRoadmap = async (data: RoadmapData) => {
        const newVideos: Record<string, YouTubeVideo[]> = {};
        await Promise.all(data.steps.map(async (step) => {
            try {
                const query = `${data.topic} ${step.title}`;
                const videos = await searchYouTubeVideos(query, 2);
                newVideos[step.id] = videos;
            } catch (e) {
                console.error("Failed to fetch related videos for step", step.id, e);
            }
        }));
        setStepVideos(newVideos);
    };

    const generateRoadmap = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!topic.trim()) return;

        const effectiveApiKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!effectiveApiKey) {
            setError("API Key is missing. Please provide a Custom API Key or check your environment configuration.");
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const genAI = new GoogleGenerativeAI(effectiveApiKey);
            const model = genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                generationConfig: {
                    responseMimeType: "application/json",
                }
            });

            const prompt = `You are an expert educational planner and curriculum designer. 
            The user wants to learn exactly this topic: "${topic}".
            
            Generate a highly detailed, chronological, and practical learning roadmap for them.
            It must be properly plannable and working.
            
            Respond STRICTLY in the following JSON format:
            {
                "topic": "The standardized name of the topic",
                "overview": "A 2-3 sentence engaging overview of what they will achieve",
                "estimatedTotalTime": "e.g., '3 Months', '4 Weeks', '100 Hours'",
                "difficulty": "Beginner, Intermediate, or Advanced",
                "steps": [
                    {
                        "id": "step1",
                        "title": "Clear, actionable title for the phase",
                        "description": "2-3 sentences explaining exactly what to study and build.",
                        "duration": "e.g., 'Week 1', '10 Hours'",
                        "resources": ["Specific Book Name", "Specific YouTube Channel or Course concept"]
                    }
                ]
            }
            Ensure the steps array has at least 4-6 highly detailed, sequential steps.`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            const cleanJson = responseText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
            const parsedData = JSON.parse(cleanJson) as RoadmapData;

            parsedData.steps = parsedData.steps.map(step => ({ ...step, isCompleted: false }));

            setRoadmap(parsedData);

            // fetch videos asynchronously
            fetchVideosForRoadmap(parsedData);

        } catch (err: any) {
            console.error(err);
            setError("Failed to generate the roadmap. Please try again or rephrase the topic.");
        } finally {
            setIsGenerating(false);
        }
    };

    const toggleStepCompletion = (stepId: string) => {
        if (!roadmap) return;
        setRoadmap({
            ...roadmap,
            steps: roadmap.steps.map(step =>
                step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step
            )
        });
    };

    const calculateProgress = () => {
        if (!roadmap || roadmap.steps.length === 0) return 0;
        const completed = roadmap.steps.filter(s => s.isCompleted).length;
        return Math.round((completed / roadmap.steps.length) * 100);
    };

    return (
        <div className="min-h-screen text-white relative flex flex-col items-center pt-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #2a1538 0%, #461b69 40%, #201a42 100%)' }}>
            <div className="w-full max-w-7xl mx-auto px-6 relative z-10 flex-col flex h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4d3a68]/60 hover:bg-[#4d3a68] transition-colors font-medium border border-white/5 shadow-sm"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-[14px]">Back</span>
                    </button>

                    <button
                        onClick={() => setShowKeyInput(!showKeyInput)}
                        className="text-[12px] text-purple-200 hover:text-white underline tracking-wide cursor-pointer decoration-white/40 underline-offset-4"
                    >
                        {showKeyInput ? 'Hide API Key' : 'Use Custom API Key'}
                    </button>
                </div>

                {/* API Key Input */}
                <AnimatePresence>
                    {showKeyInput && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mb-6 overflow-hidden w-full flex justify-end"
                        >
                            <div className="bg-[#3d2260] border border-purple-500/30 rounded-xl p-4 shadow-xl max-w-sm w-full">
                                <label className="block text-xs text-purple-200 mb-2 uppercase tracking-widest font-bold">Gemini API Key</label>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Paste key..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400 transition-colors"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!roadmap ? (
                    <div className="w-full flex-1 flex flex-col items-center mt-6">
                        {/* Powered by Pill */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5b2b8e]/40 border border-[#8b5cf6]/40 text-[#d8b4fe] mb-6 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                            <Sparkles size={14} className="text-[#d8b4fe]" />
                            <span className="text-[13px] font-medium tracking-wide">Powered by Gemini 2.5 Flash</span>
                        </div>

                        {/* Title Section */}
                        <div className="text-center mb-10 w-full">
                            <h1 className="text-[34px] md:text-[42px] font-bold mb-3 tracking-tight text-[#f3d9fa]">
                                AI Roadmap Generator
                            </h1>
                            <p className="text-[#cebee0] text-[15px] md:text-[17px] tracking-wide">
                                Turn your financial goals into a personalized step-by-step learning path.
                            </p>
                        </div>

                        {/* Generator Form */}
                        <div className="w-full max-w-3xl px-4 md:px-0">
                            <div className="bg-[#4a2e72] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl">
                                <div className="flex flex-col gap-6">
                                    <div className="w-[180px] h-[45px] bg-[#6b45b2] rounded-xl flex items-center px-4">
                                        <Target className="text-[#dfbdf4]" size={20} />
                                    </div>

                                    <div className="w-full">
                                        <input
                                            type="text"
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder="What do you want to learn?"
                                            className="w-full bg-transparent border-none text-[22px] text-white placeholder-[#518b5c] focus:outline-none font-medium mt-1"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    generateRoadmap();
                                                }
                                            }}
                                            disabled={isGenerating}
                                        />
                                    </div>

                                    <div className="mt-1">
                                        <button
                                            onClick={(e: any) => generateRoadmap(e)}
                                            disabled={isGenerating || !topic.trim()}
                                            className="transition-all px-6 py-2.5 rounded-full font-bold text-[15px] bg-[#5851d8] hover:bg-[#4842b8] text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px] w-max"
                                        >
                                            {isGenerating ? (
                                                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                'Generate Plan'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3 text-sm">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Roadmap Display */
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{roadmap.topic}</h2>
                                    <p className="text-gray-400 max-w-2xl">{roadmap.overview}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-300 border border-white/10">
                                        <Share2 size={20} />
                                    </button>
                                    <button className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-300 border border-white/10">
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
                                            key={step.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative pl-24"
                                        >
                                            {/* Timeline Node */}
                                            <button
                                                onClick={() => toggleStepCompletion(step.id)}
                                                className={`absolute left-0 w-16 h-16 rounded-2xl flex items-center justify-center border-2 z-10 transition-all bg-gray-900 
                                            ${step.isCompleted
                                                        ? 'border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                                        : index === 0
                                                            ? 'border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                                                            : index === roadmap.steps.length - 1
                                                                ? 'border-blue-500 text-blue-400'
                                                                : 'border-gray-700 text-gray-500'}`}
                                            >
                                                {step.isCompleted ? <CheckCircle2 size={28} /> : <span className="text-xl font-bold">{index + 1}</span>}
                                            </button>

                                            <GlassCard className={`hover:border-purple-500/30 transition-all group ${step.isCompleted ? 'opacity-60' : ''}`}>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className={`text-xl font-bold transition-colors ${step.isCompleted ? 'text-gray-400 line-through' : 'text-white group-hover:text-purple-300'}`}>
                                                        {step.title}
                                                    </h3>
                                                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${index === 0 ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                                        }`}>
                                                        {step.duration}
                                                    </div>
                                                </div>
                                                <p className="text-gray-400 leading-relaxed mb-4">
                                                    {step.description}
                                                </p>

                                                <div className="space-y-4 pt-4 border-t border-white/10">
                                                    <div className="flex flex-wrap gap-2">
                                                        {step.resources.map((res, i) => (
                                                            <span key={i} className="px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-xs text-white/70">
                                                                {res}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* YouTube Videos Integration */}
                                                    {stepVideos[step.id] && stepVideos[step.id].length > 0 && (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                                            {stepVideos[step.id].map(video => (
                                                                <a
                                                                    key={video.id}
                                                                    href={`https://www.youtube.com/watch?v=${video.id}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-purple-500/30 transition-all group/vid"
                                                                >
                                                                    <div className="relative w-24 aspect-video rounded-lg overflow-hidden shrink-0">
                                                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                                                        <div className="absolute inset-0 bg-black/40 group-hover/vid:bg-transparent transition-colors flex items-center justify-center">
                                                                            <Play size={14} className="text-white drop-shadow-md" fill="white" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="min-w-0 flex-1">
                                                                        <h6 className="text-xs font-medium text-white/90 line-clamp-2 group-hover/vid:text-purple-400 transition-colors leading-snug">{video.title}</h6>
                                                                    </div>
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </GlassCard>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-12 text-center pb-12">
                                <AnimatedButton variant="outline" onClick={() => { setRoadmap(null); setTopic(''); }} className="mx-auto">
                                    Create Another Roadmap
                                </AnimatedButton>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
