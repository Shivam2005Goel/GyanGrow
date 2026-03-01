'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Play, Square, Mic, AlertCircle, Settings, CheckCircle2, ChevronRight, Briefcase, FileText, UserCircle, MessageSquare, Award, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimliClient, generateSimliSessionToken, generateIceServers, LogLevel } from 'simli-client';

// --- TYPES ---
type Phase = 'setup' | 'interview' | 'feedback';

interface Message {
    id: string;
    role: 'interviewer' | 'candidate';
    text: string;
    isFinal: boolean;
}

export default function AiMockInterview() {
    const [phase, setPhase] = useState<Phase>('setup');

    // Keys
    const [vapiPublicKey, setVapiPublicKey] = useState('');
    const [geminiApiKey, setGeminiApiKey] = useState('');
    const [simliApiKey, setSimliApiKey] = useState('');
    const [simliFaceId, setSimliFaceId] = useState('5514e24d-6086-46a3-ace4-6a7264e5cb7c');

    // Interview Config
    const [role, setRole] = useState('Frontend Developer');
    const [company, setCompany] = useState('Google');
    const [experience, setExperience] = useState('Mid-Level (2-4 years)');

    // State
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Vapi State
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [vapiInstance, setVapiInstance] = useState<any>(null);
    const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);

    // Simli State
    const [simliClientInstance, setSimliClientInstance] = useState<SimliClient | null>(null);

    // Video Refs
    const userVideoRef = useRef<HTMLVideoElement>(null);
    const simliVideoRef = useRef<HTMLVideoElement>(null);
    const simliAudioRef = useRef<HTMLAudioElement>(null);

    // Feedback Data
    const [feedbackData, setFeedbackData] = useState<any>(null);

    const vapiRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        // Load saved keys, fallback to env variables if available
        const savedVapi = localStorage.getItem('vapiKey') || process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '';
        const savedGemini = localStorage.getItem('geminiKey') || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
        const savedSimliKey = localStorage.getItem('simliApiKey') || process.env.NEXT_PUBLIC_SIMLI_API_KEY || '';
        const savedSimliFaceId = localStorage.getItem('simliFaceId') || process.env.NEXT_PUBLIC_SIMLI_FACE_ID || '5514e24d-6086-46a3-ace4-6a7264e5cb7c';
        if (savedVapi) setVapiPublicKey(savedVapi);
        if (savedGemini) setGeminiApiKey(savedGemini);
        if (savedSimliKey) setSimliApiKey(savedSimliKey);
        if (savedSimliFaceId) setSimliFaceId(savedSimliFaceId);

        // Dynamically import Vapi to avoid SSR issues
        import('@vapi-ai/web').then(({ default: Vapi }) => {
            setVapiInstance(() => Vapi);
        }).catch(err => console.error('Failed to load Vapi SDK', err));
    }, []);

    // WebCam setup
    useEffect(() => {
        if (phase === 'interview') {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(stream => {
                    if (userVideoRef.current) {
                        userVideoRef.current.srcObject = stream;
                    }
                })
                .catch(err => console.error("Webcam error:", err));
        } else {
            if (userVideoRef.current && userVideoRef.current.srcObject) {
                const stream = userVideoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [phase]);



    const saveKeys = () => {
        if (vapiPublicKey) localStorage.setItem('vapiKey', vapiPublicKey);
        if (geminiApiKey) localStorage.setItem('geminiKey', geminiApiKey);
        if (simliApiKey) localStorage.setItem('simliApiKey', simliApiKey);
        if (simliFaceId) localStorage.setItem('simliFaceId', simliFaceId);
    };

    // --- PHASE 1: START INTERVIEW ---
    const handleStartInterview = async () => {
        setError(null);
        if (!vapiPublicKey || !geminiApiKey) {
            setError("Please provide both Vapi and Gemini keys.");
            return;
        }

        // Prevent lingering connections when retrying/reconnecting
        if (vapiRef.current) {
            try { vapiRef.current.stop(); } catch (e) { }
        }
        if (simliClientInstance) {
            try { (simliClientInstance as any).stop?.(); } catch (e) { }
            try { (simliClientInstance as any).close?.(); } catch (e) { }
            setSimliClientInstance(null);
        }
        if ((window as any).__simliClient) {
            try { (window as any).__simliClient.stop?.(); } catch (e) { }
            try { (window as any).__simliClient.close?.(); } catch (e) { }
            (window as any).__simliClient = null;
        }

        saveKeys();
        setIsLoading(true);

        try {
            // 1. Generate Interviewer System Prompt using Gemini
            const genAI = new GoogleGenerativeAI(geminiApiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const promptInfo = `
        You are configuring the system prompt for an AI Voice Agent that will conduct a live audio interview.
        Role to interview for: ${role}
        Simulated Company: ${company}
        Candidate Experience: ${experience}
        
        Write clear, concise instructions for the AI Voice Agent.
        The AI MUST:
        1. Start by welcoming the candidate to the interview for ${role} at ${company}.
        2. Keep questions concise (1-2 sentences). Voice conversations become tedious if the AI talks too much.
        3. Ask exactly 3-4 impactful technical or behavioral questions relevant to this role sequentially.
        4. Give brief, professional acknowledgment of their answer before moving to the next question.
        5. After all questions, politely conclude the interview and say goodbye.
        
        Return ONLY the raw text for the system prompt. No markdown formatting or extra commentary.
      `;

            const result = await model.generateContent(promptInfo);
            const systemPrompt = result.response.text().trim();

            // 2. Initialize Vapi with the generated prompt
            const vapi = new vapiInstance(vapiPublicKey);
            vapiRef.current = vapi;

            // Clear existing listeners
            vapi.removeAllListeners('message');
            vapi.removeAllListeners('call-start');
            vapi.removeAllListeners('error');

            // Listeners
            vapi.on('message', (msg: any) => {
                if (msg.role === 'assistant' && msg.type === 'speech-update') {
                    setIsAssistantSpeaking(msg.status === 'started');
                }

                if (msg.type === 'transcript') {
                    // Both `user` and `assistant` can send transcripts
                    const mRole = msg.role === 'user' ? 'candidate' : 'interviewer';

                    if (mRole === 'interviewer') {
                        if (msg.transcriptType === 'partial') setIsAssistantSpeaking(true);
                        else if (msg.transcriptType === 'final') setTimeout(() => setIsAssistantSpeaking(false), 500);
                    }

                    setMessages(prev => {
                        const existing = prev.find(p => p.id === `${mRole}-${msg.transcriptType === 'partial' ? 'current' : Date.now()}` || p.text === msg.transcript);

                        if (msg.transcriptType === 'partial') {
                            const filtered = prev.filter(p => p.id !== `${mRole}-current`);
                            return [...filtered, { id: `${mRole}-current`, role: mRole, text: msg.transcript, isFinal: false }];
                        } else if (msg.transcriptType === 'final') {
                            const filtered = prev.filter(p => !p.id.includes('current'));
                            return [...filtered, { id: `${mRole}-${Date.now()}`, role: mRole, text: msg.transcript, isFinal: true }];
                        }
                        return prev;
                    });
                }

                if (msg.type === 'call-end') {
                    setIsSessionActive(false);
                }
            });

            vapi.on('call-start', () => {
                setIsSessionActive(true);
                setIsLoading(false);
                setPhase('interview');

                // Bind the Vapi daily audio track to Simli so it can drive the lips
                // Wait briefly for the track to be completely attached
                setTimeout(() => {
                    const dailyCall = (vapi as any).getDailyCallObject();
                    if (!dailyCall) return;
                    const participants = dailyCall.participants();
                    Object.values(participants).forEach((participant: any) => {
                        const audioTrack = participant.tracks?.audio?.track;
                        if (audioTrack && participant.user_name === "Vapi Speaker") {
                            // Mute Vapi's default DOM audios so we don't hear double audio (Simli plays it directly too)
                            const audioElements = document.getElementsByTagName("audio");
                            for (let i = 0; i < audioElements.length; i++) {
                                if (audioElements[i].id !== "simli_audio" && audioElements[i].className !== "simli-audio-ignore") {
                                    audioElements[i].muted = true;
                                }
                            }

                            // Send to Simli for Real-time LipSync!
                            if (simliClientInstance) {
                                simliClientInstance.listenToMediastreamTrack(audioTrack);
                            } else {
                                // Find client locally since global state might not be fully flushed
                                (window as any).__simliClient?.listenToMediastreamTrack(audioTrack);
                            }
                        }
                    });
                }, 500);
            });

            vapi.on('error', (err: any) => {
                console.error('Vapi Error', err);
                setError("Vapi connection error: " + (err.message || 'Check your Vapi key.'));
                setIsLoading(false);
                setIsSessionActive(false);
            });

            // Start the call
            const assistantConfig = {
                name: `${company} Interviewer`,
                firstMessage: `Hello! Thank you for taking the time to interview for the ${role} position at ${company}. Let me know when you're ready to start.`,
                model: {
                    provider: "openai",
                    model: "gpt-4o", // Good default
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        }
                    ]
                },
                voice: {
                    provider: "11labs",
                    voiceId: "burt" // Professional male voice
                }
            };

            // Standard Vapi start if no Simli key is provided (fallback)
            if (!simliApiKey) {
                await vapi.start(assistantConfig);
                return;
            }

            // ==========================
            // START SIMLI INTEGRATION
            // ==========================
            const simliConfig = {
                faceId: simliFaceId,
                handleSilence: true,
                maxSessionLength: 600,
                maxIdleTime: 600,
            };

            const sessionTokenPayload = await generateSimliSessionToken({
                apiKey: simliApiKey,
                config: simliConfig
            });

            const iceServersPayload = await generateIceServers(simliApiKey);

            const simliClient = new SimliClient(
                sessionTokenPayload.session_token,
                simliVideoRef.current as HTMLVideoElement,
                simliAudioRef.current as HTMLAudioElement,
                iceServersPayload,
                LogLevel.DEBUG,
                "p2p"
            );

            (window as any).__simliClient = simliClient;
            setSimliClientInstance(simliClient);

            simliClient.on("start", () => {
                console.log("Simli connected, starting VAPI logic");
                // Now start Vapi!
                vapi.start(assistantConfig);
            });

            simliClient.on("error", () => {
                setError("Simli WebRTC connection failed");
                vapi.stop();
            });

            await simliClient.start();

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to start interview preparation");
            setIsLoading(false);
        }
    };

    // --- PHASE 2: END INTERVIEW ---
    const handleEndInterview = async () => {
        if (vapiRef.current) {
            vapiRef.current.stop();
            setIsSessionActive(false);
        }
        if (simliClientInstance) {
            try { (simliClientInstance as any).stop?.(); } catch (e) { }
            try { (simliClientInstance as any).close?.(); } catch (e) { }
            setSimliClientInstance(null);
        }
        await generateFeedback();
    };

    // --- PHASE 3: GENERATE FEEDBACK ---
    const generateFeedback = async () => {
        setPhase('feedback');
        setIsGeneratingFeedback(true);

        // Filter to only final valid texts to avoid noise
        const finalMessages = messages.filter(m => m.isFinal && m.text.trim().length > 0);

        if (finalMessages.length === 0) {
            setFeedbackData({ error: "Not enough conversation data to generate feedback." });
            setIsGeneratingFeedback(false);
            return;
        }

        const transcript = finalMessages.map(m => `${m.role}: ${m.text}`).join('\n');

        try {
            const genAI = new GoogleGenerativeAI(geminiApiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

            const feedbackPrompt = `
        You are an expert HR Interview Coach reviewing a transcript of a candidate's technical/behavioral mock interview for a ${role} position at ${company} (${experience}).
        
        TRANSCRIPT:
        ${transcript}
        
        Please provide a structured, constructive evaluation. Return the response strictly in JSON format matching this structure exactly (No markup, no markdown formatting like \`\`\`json, just raw valid JSON):
        {
          "overallScore": 85,
          "summary": "A brief 2-3 sentence overview of their performance.",
          "strengths": ["Strength 1", "Strength 2"],
          "weaknesses": ["Area for improvement 1", "Area for improvement 2"],
          "tips": ["Actionable tip 1", "Actionable tip 2"]
        }
      `;

            const result = await model.generateContent(feedbackPrompt);
            let text = result.response.text().trim();

            // Clean up if the model wrapped it in markdown json block
            if (text.startsWith('\`\`\`json')) text = text.substring(7);
            if (text.startsWith('\`\`\`')) text = text.substring(3);
            if (text.endsWith('\`\`\`')) text = text.slice(0, -3);

            const parsed = JSON.parse(text);
            setFeedbackData(parsed);

        } catch (err: any) {
            console.error("Feedback error", err);
            setFeedbackData({ error: "Failed to generate AI feedback. " + err.message });
        } finally {
            setIsGeneratingFeedback(false);
        }
    };

    const resetInterview = () => {
        setMessages([]);
        setFeedbackData(null);
        setPhase('setup');
        if (vapiRef.current) {
            try { vapiRef.current.stop(); } catch (e) { }
        }
        if (simliClientInstance) {
            try { (simliClientInstance as any).stop?.(); } catch (e) { }
            try { (simliClientInstance as any).close?.(); } catch (e) { }
            setSimliClientInstance(null);
        }
    };

    return (
        <div className="flex flex-col h-[80vh] min-h-[600px] max-h-[900px] w-full bg-[#040812] rounded-3xl overflow-hidden border border-white/10 relative">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-b border-white/10 z-10 shrink-0">
                <div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-cyan-500 flex items-center gap-2">
                        <Briefcase size={20} className="text-violet-400" />
                        AI Interview Simulator
                    </h2>
                    <p className="text-white/50 text-sm mt-0.5">Powered by Vapi & Google Gemini</p>
                </div>

                {phase === 'interview' && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleEndInterview}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors font-medium text-sm"
                        >
                            <Square size={16} fill="currentColor" />
                            End & Get Feedback
                        </button>
                    </div>
                )}

                {phase === 'feedback' && (
                    <button
                        onClick={resetInterview}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10 rounded-xl transition-colors text-sm font-medium"
                    >
                        Start New Interview
                    </button>
                )}
            </div>

            {error && (
                <div className="m-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center justify-between shadow-lg">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                        <p className="text-sm whitespace-pre-wrap">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 ml-4">✕</button>
                </div>
            )}

            {/* --- PHASE 1: SETUP --- */}
            <div className={phase === 'setup' ? "flex-1 overflow-y-auto p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start" : "hidden"}>

                <div className="flex-1 space-y-6 max-w-lg w-full">
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <h3 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
                            <Settings size={18} className="text-white/50" /> Configuration
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-white/50 mb-1">Target Role</label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                                    placeholder="e.g. Frontend Developer"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-white/50 mb-1">Company</label>
                                    <input
                                        type="text"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-white/50 mb-1">Experience</label>
                                    <select
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors appearance-none"
                                    >
                                        <option>Intern / Entry-Level</option>
                                        <option>Mid-Level (2-4 years)</option>
                                        <option>Senior-Level (5+ years)</option>
                                        <option>Manager / Lead</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white/90 mb-4 border-b border-white/5 pb-4">API Keys</h3>
                        <div className="space-y-4 mt-4">
                            <div>
                                <label className="block text-xs font-medium text-white/50 mb-1">Vapi Public Key</label>
                                <input
                                    type="password"
                                    value={vapiPublicKey}
                                    onChange={(e) => setVapiPublicKey(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                                    placeholder="Obtain from Vapi Dashboard"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-white/50 mb-1">Google Gemini API Key</label>
                                <input
                                    type="password"
                                    value={geminiApiKey}
                                    onChange={(e) => setGeminiApiKey(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                                    placeholder="Obtain from Google AI Studio"
                                />
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 space-y-4">
                                <h4 className="text-sm font-medium text-white/70">Optional: Full Real-time Avatar (Simli.com)</h4>
                                <div>
                                    <label className="block text-xs font-medium text-white/50 mb-1">Simli API Key</label>
                                    <input
                                        type="password"
                                        value={simliApiKey}
                                        onChange={(e) => setSimliApiKey(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                                        placeholder="Empty for generic avatar, or provide API Key"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-white/50 mb-1">Simli Face ID</label>
                                    <input
                                        type="text"
                                        value={simliFaceId}
                                        onChange={(e) => setSimliFaceId(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                                        placeholder="5514e24d-..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleStartInterview}
                        disabled={isLoading || !vapiInstance}
                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Generating AI Agent...
                            </div>
                        ) : (
                            <>
                                <Play size={20} fill="currentColor" />
                                Connect & Start Interview
                            </>
                        )}
                    </button>
                </div>

                <div className="flex-1 hidden md:flex flex-col items-center justify-center text-center p-8 border border-white/5 bg-white/[0.01] rounded-3xl h-full min-h-[400px]">
                    <div className="w-24 h-24 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mb-6 border border-white/10 relative">
                        <div className="absolute inset-[-20px] bg-cyan-500/10 rounded-full blur-xl"></div>
                        <Mic size={40} className="text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Voice-Native Mock Interviews</h3>
                    <p className="text-white/50 max-w-sm mb-6">
                        Experience ultra-low latency conversational AI. The interviewer adapts dynamically to your answers, offering realistic pressure and insight.
                    </p>
                    <ul className="text-left text-sm text-white/70 space-y-3">
                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Instant Voice Processing (&lt;0.5s latency)</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Context-aware follow ups</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Comprehensive Post-Interview Feedback</li>
                    </ul>
                </div>
            </div>

            {/* --- PHASE 2: INTERVIEW LIVE --- */}
            <div className={phase === 'interview' ? "flex-1 flex overflow-hidden min-h-0" : "hidden"}>
                {/* Left side: Assistant Video & User Webcam split */}
                <div className="w-1/2 border-r border-white/10 bg-black relative">
                    {/* True AI Lip - Synced Avatar using Simli */}
                    <div className="absolute inset-0 z-0">
                        {/* Simli natively binds its WebRTC tracks to these elements */}
                        <video
                            ref={simliVideoRef}
                            autoPlay
                            playsInline
                            className={`w-full h-full object-cover transition-opacity duration-300 bg-black ${isAssistantSpeaking ? '' : simliApiKey ? 'scale-[1.01] transition-all duration-[3000ms]' : ''}`}
                        />
                        <audio id="simli_audio" ref={simliAudioRef} autoPlay />

                        {/* Fallback video loop (if Simli is excluded) */}
                        {!simliApiKey && (
                            <video
                                src="https://videos.pexels.com/video-files/5668875/5668875-uhd_2160_3840_30fps.mp4"
                                loop
                                playsInline
                                muted
                                autoPlay={isAssistantSpeaking}
                                className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${isAssistantSpeaking ? '' : 'brightness-75'}`}
                            />
                        )}
                    </div>
                    <div className="absolute inset-0 bg-cyan-900/10 mix-blend-overlay pointer-events-none z-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none z-0"></div>

                    {/* Top Area: Interviewer Name */}
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                            <div className={`w-2 h-2 rounded-full ${isAssistantSpeaking ? 'bg-emerald-500 animate-pulse' : 'bg-white/30'}`}></div>
                            <span className="text-xs font-medium text-white/90">
                                {simliApiKey ? 'Simli Live Avatar' : 'AI Interviewer (Audio only)'}
                            </span>
                        </div>
                    </div>

                    {/* Bottom Area: User Webcam */}
                    <div className="relative z-10 flex justify-end pb-8 shadow-[inset_0_-50px_50px_rgba(0,0,0,0.5)] pointer-events-none">
                        <div className="w-48 h-32 bg-gray-900 rounded-xl overflow-hidden border border-white/20 shadow-2xl relative pointer-events-auto">
                            <video
                                ref={userVideoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                                style={{ transform: 'scaleX(-1)' }}
                            />
                            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 bg-black/60 rounded text-[9px] font-bold text-white/80">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                YOU
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side: Transcript */}
                <div className="w-1/2 flex flex-col bg-[#02040a] min-h-0">
                    <div className="p-4 border-b border-white/5 bg-white/[0.01] flex items-center gap-2">
                        <MessageSquare size={16} className="text-white/40" />
                        <h3 className="text-sm font-medium text-white/70">Conversation Transcript</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-white/30 text-sm">
                                Waiting for conversation to begin...
                            </div>
                        ) : (
                            messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: msg.isFinal ? 1 : 0.6, y: 0 }}
                                    key={msg.id}
                                    className={`flex flex-col max-w-[85%] ${msg.role === 'interviewer' ? 'mr-auto items-start' : 'ml-auto items-end'}`}
                                >
                                    <div className="flex items-center gap-2 mb-1.5 px-1 opacity-60">
                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-white">
                                            {msg.role === 'interviewer' ? 'Interviewer' : 'You'}
                                        </span>
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'interviewer'
                                        ? 'bg-violet-500/10 border border-violet-500/20 text-violet-50 rounded-tl-none'
                                        : 'bg-white/10 text-white/90 rounded-tr-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>

            {/* --- PHASE 3: FEEDBACK --- */}
            {phase === 'feedback' && (
                <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
                    <div className="max-w-4xl mx-auto">
                        {isGeneratingFeedback ? (
                            <div className="h-[400px] flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 mb-6">
                                    <svg className="animate-spin text-cyan-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Analyzing Performance...</h3>
                                <p className="text-white/50">Gemini is compiling feedback based on your responses.</p>
                            </div>
                        ) : feedbackData ? (
                            feedbackData.error ? (
                                <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center">
                                    <AlertCircle className="shrink-0 mx-auto text-red-400 mb-4" size={40} />
                                    <h3 className="text-xl font-bold text-red-50 mb-2">Generation Failed</h3>
                                    <p className="text-red-400/80">{feedbackData.error}</p>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                                    {/* Summary Card */}
                                    <div className="bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                                        <div className="shrink-0 text-center">
                                            <div className="w-32 h-32 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-emerald-500/10 mb-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] mx-auto">
                                                <span className="text-5xl font-black text-emerald-400">{feedbackData.overallScore ?? 'N/A'}</span>
                                            </div>
                                            <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Overall Score</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-white mb-3">Interview Evaluation</h3>
                                            <p className="text-white/70 leading-relaxed text-lg">
                                                {feedbackData.summary}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Strengths */}
                                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                                            <h4 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                                                <Award size={20} /> Core Strengths
                                            </h4>
                                            <ul className="space-y-3">
                                                {feedbackData.strengths?.map((item: string, i: number) => (
                                                    <li key={i} className="flex gap-3 text-white/80 text-sm leading-relaxed">
                                                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Weaknesses */}
                                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                                            <h4 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                                                <AlertCircle size={20} /> Areas to Improve
                                            </h4>
                                            <ul className="space-y-3">
                                                {feedbackData.weaknesses?.map((item: string, i: number) => (
                                                    <li key={i} className="flex gap-3 text-white/80 text-sm leading-relaxed">
                                                        <ChevronRight size={18} className="text-amber-500 shrink-0 mt-0.5" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Practical Tips */}
                                    <div className="bg-[#0A0D15] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                            <FileText size={100} />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-6 relative z-10">Actionable Advice</h4>
                                        <div className="grid gap-4 relative z-10">
                                            {feedbackData.tips?.map((tip: string, i: number) => (
                                                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/[0.05]">
                                                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold font-mono text-sm shrink-0">
                                                        {i + 1}
                                                    </div>
                                                    <p className="text-white/80 text-sm leading-relaxed pt-1.5">{tip}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}
