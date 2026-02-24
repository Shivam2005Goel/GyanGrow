'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenerativeAI, ChatSession } from '@google/generative-ai';
import { Camera, Mic, Square, Play, RefreshCw, AlertCircle } from 'lucide-react';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';

interface InterviewMessage {
    id: string;
    role: 'interviewer' | 'candidate';
    text: string;
    timestamp: Date;
}

export default function AiMockInterview() {
    const [isActive, setIsActive] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [messages, setMessages] = useState<InterviewMessage[]>([]);
    const [streamReady, setStreamReady] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const trackingCanvasRef = useRef<HTMLCanvasElement>(null);
    const chatSessionRef = useRef<ChatSession | null>(null);
    const recognitionRef = useRef<any>(null);
    const faceDetectorRef = useRef<FaceDetector | null>(null);
    const requestRef = useRef<number>(0);
    const streamRef = useRef<MediaStream | null>(null);

    // Stop camera helper (stable ref)
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setStreamReady(false);
    }, []);

    // Initialize Gemini Chat Session (Using REST Streaming)
    const initInterview = useCallback(async () => {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            setError("Gemini API key is not configured. Camera is still active.");
            return;
        }

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            // Using gemini-2.5-flash-lite — cost-efficient with separate quota
            const model = genAI.getGenerativeModel({
                model: 'gemini-2.5-flash-lite',
                systemInstruction: `You are a highly experienced strict, professional technical interviewer from a top-tier tech company. 
                You are currently conducting a mock software engineering interview with a student candidate via video call.
                
                YOUR BEHAVIOR:
                1. Ask one challenging technical or behavioral question at a time. Wait for their answer before asking the next.
                2. If the user provides an image (camera frame), briefly analyze their body language along with their spoken answer.
                3. Provide concise, constructive feedback after they answer, then immediately ask the next sequential question to keep the interview moving.
                4. NEVER break character. You are the interviewer.
                5. CRITICAL: Keep your spoken responses under 2-3 short sentences. This is a VOICE interview, long monologues will break the experience.
                6. CRITICAL: DO NOT USE MARKDOWN. Speak in plain, conversational English with no bolding, no lists, and no code blocks.
                
                Start the interview immediately by briefly introducing yourself and asking the candidate to introduce themselves.`
            });

            const session = model.startChat({ history: [] });
            chatSessionRef.current = session;

            // Trigger the initial greeting
            const initialResult = await session.sendMessage("START_INTERVIEW");
            const aiText = initialResult.response.text();

            addMessage('interviewer', aiText);
            speakResponse(aiText);

        } catch (e: any) {
            console.error("Failed to initialize interview", e);
            // Show the error but keep camera running — don't kill the session
            setError(e.message || "Failed to initialize the AI Mock Interviewer. Try checking your API key.");
        }
    }, [stopCamera]);

    // Initialize Face Detector
    useEffect(() => {
        const initFaceDetector = async () => {
            try {
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );
                const detector = await FaceDetector.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`,
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO"
                });
                faceDetectorRef.current = detector;
            } catch (e) {
                console.error("Failed to initialize Face Detector", e);
            }
        };
        initFaceDetector();
    }, []);

    // Active Face Tracking Loop
    const renderLoop = useCallback(() => {
        if (isActive && videoRef.current && trackingCanvasRef.current && faceDetectorRef.current) {
            const video = videoRef.current;
            const canvas = trackingCanvasRef.current;

            if (video.videoWidth > 0 && video.readyState >= 2) {
                if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                }

                try {
                    const detections = faceDetectorRef.current.detectForVideo(video, performance.now());
                    const ctx = canvas.getContext('2d');

                    if (ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);

                        if (detections.detections.length > 0) {
                            const box = detections.detections[0].boundingBox;
                            const score = detections.detections[0].categories[0].score;

                            if (box) {
                                // Canvas is also mirrored via CSS scaleX(-1) like the video,
                                // so we use the raw detection coordinates directly
                                const x = box.originX;
                                const y = box.originY;

                                ctx.strokeStyle = '#34d399';
                                ctx.lineWidth = 2;
                                ctx.setLineDash([8, 8]);
                                ctx.strokeRect(x, y, box.width, box.height);

                                const cornerLen = 15;
                                ctx.setLineDash([]);
                                ctx.lineWidth = 3;

                                // Top-left corner
                                ctx.beginPath(); ctx.moveTo(x, y + cornerLen); ctx.lineTo(x, y); ctx.lineTo(x + cornerLen, y); ctx.stroke();
                                // Top-right corner
                                ctx.beginPath(); ctx.moveTo(x + box.width - cornerLen, y); ctx.lineTo(x + box.width, y); ctx.lineTo(x + box.width, y + cornerLen); ctx.stroke();
                                // Bottom-left corner
                                ctx.beginPath(); ctx.moveTo(x, y + box.height - cornerLen); ctx.lineTo(x, y + box.height); ctx.lineTo(x + cornerLen, y + box.height); ctx.stroke();
                                // Bottom-right corner
                                ctx.beginPath(); ctx.moveTo(x + box.width - cornerLen, y + box.height); ctx.lineTo(x + box.width, y + box.height); ctx.lineTo(x + box.width, y + box.height - cornerLen); ctx.stroke();

                                ctx.font = "bold 12px monospace";
                                ctx.fillStyle = "#34d399";
                                ctx.fillText(`[FACE] CONF: ${(score * 100).toFixed(1)}%`, x, Math.max(20, y - 10));

                                // Crosshair at face center
                                const centerX = x + (box.width / 2);
                                const centerY = y + (box.height / 2);
                                ctx.fillStyle = "rgba(52, 211, 153, 0.5)";
                                ctx.fillRect(centerX - 10, centerY - 1, 20, 2);
                                ctx.fillRect(centerX - 1, centerY - 10, 2, 20);
                            }
                        }
                    }
                } catch (e) { /* detection may fail on some frames, skip silently */ }
            }
        }

        if (isActive) {
            requestRef.current = requestAnimationFrame(renderLoop);
        }
    }, [isActive]);

    useEffect(() => {
        if (isActive) {
            requestRef.current = requestAnimationFrame(renderLoop);
        } else {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            const ctx = trackingCanvasRef.current?.getContext('2d');
            if (ctx && trackingCanvasRef.current) ctx.clearRect(0, 0, trackingCanvasRef.current.width, trackingCanvasRef.current.height);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isActive, renderLoop]);

    // Setup Web Speech Recognition (mount-only, no isActive dependency)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = false;
                recognitionRef.current.lang = 'en-US';

                recognitionRef.current.onresult = (event: any) => {
                    const transcript = event.results[event.results.length - 1][0].transcript;
                    if (transcript.trim()) {
                        handleCandidateAnswer(transcript);
                    }
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current.onerror = (event: any) => {
                    if (event.error !== 'no-speech' && event.error !== 'aborted') {
                        console.error("Speech recognition error:", event.error);
                    }
                    setIsListening(false);
                };
            } else {
                setError("Your browser does not support the Web Speech API required for voice interaction.");
            }
        }

        // Cleanup only on unmount — NOT on isActive changes
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            window.speechSynthesis.cancel();
            stopCamera();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Start camera with proper metadata-ready handling
    const startCamera = useCallback(async (): Promise<boolean> => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user'
                },
                audio: true
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                // Wait for the video metadata to load before playing
                await new Promise<void>((resolve, reject) => {
                    const video = videoRef.current!;
                    const onLoaded = () => {
                        video.removeEventListener('loadedmetadata', onLoaded);
                        video.removeEventListener('error', onError);
                        resolve();
                    };
                    const onError = () => {
                        video.removeEventListener('loadedmetadata', onLoaded);
                        video.removeEventListener('error', onError);
                        reject(new Error('Video failed to load metadata'));
                    };

                    // If already loaded (e.g. from cached stream), resolve immediately
                    if (video.readyState >= 1) {
                        resolve();
                    } else {
                        video.addEventListener('loadedmetadata', onLoaded);
                        video.addEventListener('error', onError);
                    }
                });

                await videoRef.current.play();
                setStreamReady(true);
            }
            return true;
        } catch (err: any) {
            console.error("Error accessing camera:", err);
            setError(`Could not access webcam: ${err.message}. Camera permissions are required for the AI to analyze your body language.`);
            stopCamera();
            return false;
        }
    }, [stopCamera]);

    // Start/Stop Interview
    const toggleInterview = async () => {
        if (isActive) {
            setIsActive(false);
            stopCamera();
            if (recognitionRef.current) recognitionRef.current.stop();
            window.speechSynthesis.cancel();
            setMessages([]);
        } else {
            setError(null);
            setMessages([]);
            const cameraStarted = await startCamera();
            if (cameraStarted) {
                setIsActive(true);
                await initInterview();
            }
        }
    };

    const captureFrame = (): string | null => {
        if (!videoRef.current || !canvasRef.current || !isActive) return null;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video.videoWidth === 0 || video.videoHeight === 0) return null;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        return dataUrl.split(',')[1];
    };

    const handleCandidateAnswer = async (transcript: string) => {
        if (!isActive) return;

        addMessage('candidate', transcript);
        setIsProcessing(true);

        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
            setError("Gemini API key is not configured.");
            setIsProcessing(false);
            return;
        }

        if (!chatSessionRef.current) return;

        const base64Frame = captureFrame();

        try {
            let responseText = "";

            if (base64Frame) {
                const parts: any[] = [
                    { text: transcript },
                    {
                        inlineData: {
                            data: base64Frame,
                            mimeType: "image/jpeg"
                        }
                    }
                ];

                const result = await chatSessionRef.current.sendMessage(parts);
                responseText = result.response.text();
            } else {
                const result = await chatSessionRef.current.sendMessage(transcript);
                responseText = result.response.text();
            }

            addMessage('interviewer', responseText);
            speakResponse(responseText);

        } catch (err: any) {
            console.error("AI Generation Error", err);
            const fallbackMsg = "I'm having trouble connecting to my servers right now. Let's try again in a moment.";
            addMessage('interviewer', fallbackMsg);
            speakResponse(fallbackMsg);
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleListening = () => {
        if (!isActive || isSpeaking || isProcessing) return;

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                console.log(e);
            }
        }
    };

    const speakResponse = (text: string) => {
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();
        setIsSpeaking(true);

        const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('en-US') && (v.name.includes('Google') || v.name.includes('Samantha')));
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.rate = 1.0;
        utterance.pitch = 0.95;

        utterance.onend = () => {
            setIsSpeaking(false);
            setTimeout(() => {
                if (recognitionRef.current) {
                    try {
                        recognitionRef.current.start();
                        setIsListening(true);
                    } catch (e) {
                        console.log("Mic already listening", e);
                    }
                }
            }, 300);
        };

        window.speechSynthesis.speak(utterance);
    };

    const addMessage = (role: 'interviewer' | 'candidate', text: string) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role,
            text,
            timestamp: new Date()
        }]);
    };

    return (
        <div className="flex flex-col h-full min-h-[600px] w-full bg-[#040812] rounded-3xl overflow-hidden border border-white/10 relative">
            {/* Hidden canvas for capturing frames */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-b border-white/10 z-10">
                <div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse relative block">
                            <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-50"></span>
                        </span>
                        Live AI Mock Interview
                    </h2>
                    <p className="text-white/50 text-sm mt-0.5">Voice-to-Voice Analysis with Gemini Vision</p>
                </div>

                <div className="flex items-center gap-3">
                    {isActive ? (
                        <button
                            onClick={toggleInterview}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors font-medium text-sm"
                        >
                            <Square size={16} fill="currentColor" />
                            End Interview
                        </button>
                    ) : (
                        <button
                            onClick={toggleInterview}
                            className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-[#040812] hover:bg-emerald-400 rounded-xl transition-colors font-bold shadow-lg shadow-emerald-500/20"
                        >
                            <Play size={16} fill="currentColor" />
                            Start Session
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="m-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-start gap-3 max-h-32 overflow-y-auto">
                    <AlertCircle className="shrink-0 mt-0.5" size={18} />
                    <p className="text-sm whitespace-pre-wrap">{error}</p>
                </div>
            )}

            {/* Main Content - Two Column Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Side: Video Feed & Controls */}
                <div className="w-1/2 p-6 flex flex-col gap-4 border-r border-white/5 bg-black/20">
                    {/* Video Feed */}
                    <div className="relative flex-1 rounded-2xl overflow-hidden bg-[#0A0D15] border border-white/10 shadow-2xl flex items-center justify-center group min-h-[300px]">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`absolute inset-0 w-full h-full object-cover ${!(isActive && streamReady) ? 'opacity-0' : 'opacity-100'} transition-opacity duration-700`}
                            style={{ transform: 'scaleX(-1)' }}
                        />

                        {!(isActive && streamReady) && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30 gap-4 p-8 text-center bg-black/40 backdrop-blur-sm z-10">
                                <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                                    <Camera size={32} />
                                </div>
                                <div>
                                    <p className="text-white/60 font-medium text-lg">{isActive ? 'Starting camera...' : 'Camera is off'}</p>
                                    <p className="text-xs mt-2 max-w-xs mx-auto">{isActive ? 'Please wait while the webcam initializes...' : 'Start the session to enable webcam and microphone for body language and voice analysis.'}</p>
                                </div>
                            </div>
                        )}

                        {isActive && (
                            <>
                                {/* Real Face Tracking Overlay — mirrored to match the video feed */}
                                <canvas
                                    ref={trackingCanvasRef}
                                    className="absolute inset-0 w-full h-full pointer-events-none z-10 block"
                                    style={{ transform: 'scaleX(-1)' }}
                                />

                                {/* Overlay Stats */}
                                <div className="absolute top-4 right-4 flex flex-col items-end gap-1 pointer-events-none z-20">
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[9px] font-mono text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        VISION ACTIVE
                                    </div>
                                    <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[9px] font-mono text-white/50">
                                        MEDIAPIPE TFLITE
                                    </div>
                                </div>

                                {/* Scanning Laser Effect */}
                                <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-40">
                                    <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-scan-fast" />
                                </div>
                            </>
                        )}
                    </div>

                    <p className="text-white/40 text-xs text-center">
                        The AI will analyze your facial expressions and listen to your answers.
                    </p>

                    {/* Microphone Interaction Zone */}
                    <div className="h-36 rounded-2xl bg-white/[0.02] border border-white/10 p-4 flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="relative mb-3">
                                {isListening && (
                                    <div className="absolute inset-[-20px] bg-red-500/20 rounded-full animate-ping pointer-events-none"></div>
                                )}
                                <button
                                    onClick={toggleListening}
                                    disabled={!isActive || isSpeaking || isProcessing}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${!isActive
                                        ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                        : isSpeaking || isProcessing
                                            ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 cursor-wait'
                                            : isListening
                                                ? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.5)] scale-110'
                                                : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105 border border-white/10'
                                        }`}
                                >
                                    {isProcessing ? (
                                        <RefreshCw className="animate-spin" size={28} />
                                    ) : (
                                        <Mic size={isActive ? 28 : 24} />
                                    )}
                                </button>
                            </div>

                            <h3 className={`font-medium mb-1 text-sm transition-colors ${isListening ? 'text-red-400' : isProcessing ? 'text-amber-400' : isSpeaking ? 'text-emerald-400' : 'text-white/90'}`}>
                                {isListening ? 'Listening...' : isProcessing ? 'AI is Thinking...' : isSpeaking ? 'AI is Speaking...' : 'Tap to Answer'}
                            </h3>
                            <p className="text-white/40 text-xs text-center px-4">
                                {isListening ? 'Speak your answer naturally.' : 'Click the microphone when ready.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Interview Transcript */}
                <div className="w-1/2 flex flex-col bg-[#02040a]">
                    <div className="p-4 border-b border-white/5 bg-white/[0.01]">
                        <h3 className="text-sm font-medium text-white/70">Live Transcript</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-white/20 text-sm flex-col gap-3">
                                <RefreshCw size={24} className="opacity-50" />
                                <p>Transcript will appear here once the session begins.</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.role === 'interviewer' ? 'mr-auto items-start' : 'ml-auto items-end'}`}>
                                    <div className="flex items-center gap-2 mb-1.5 px-1 opacity-60">
                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-white">
                                            {msg.role === 'interviewer' ? 'Senior Interviewer (AI)' : 'You'}
                                        </span>
                                        <span className="text-[10px] text-white/50">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'interviewer'
                                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-50 rounded-tl-none'
                                        : 'bg-white/10 text-white/90 rounded-tr-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))
                        )}

                        {(isSpeaking || isProcessing) && (
                            <div className="flex flex-col max-w-[85%] mr-auto items-start">
                                <div className="flex items-center gap-2 mb-1.5 px-1 opacity-60">
                                    <span className="text-[10px] uppercase tracking-wider font-semibold text-white">Senior Interviewer (AI)</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-50 rounded-tl-none flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan-fast {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan-fast {
                    animation: scan-fast 3s linear infinite;
                }
            `}</style>
        </div>
    );
}
