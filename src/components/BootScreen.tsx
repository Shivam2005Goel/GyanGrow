'use client';

import { useState, useEffect } from 'react';

interface BootScreenProps {
    onComplete: () => void;
}

const bootStages = [
    { text: "Initializing Neural Architecture...", duration: 600 },
    { text: "Connecting to VitGroww Mesh...", duration: 700 },
    { text: "Loading Oracle Search Engine...", duration: 600 },
    { text: "Calibrating Engagement Sensors...", duration: 500 },
    { text: "Syncing Process Orchestrator...", duration: 600 },
    { text: "Activating VitGroww Intelligence...", duration: 500 },
    { text: "VITGROWW ONLINE \u2713", duration: 800 },
];

export default function BootScreen({ onComplete }: BootScreenProps) {
    const [currentStage, setCurrentStage] = useState(0);
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (currentStage < bootStages.length) {
            timeout = setTimeout(() => {
                setCurrentStage((prev) => prev + 1);
                setProgress(((currentStage + 1) / bootStages.length) * 100);
            }, bootStages[currentStage].duration);
        } else {
            timeout = setTimeout(() => {
                setFadeOut(true);
                setTimeout(onComplete, 600);
            }, 400);
        }

        return () => clearTimeout(timeout);
    }, [currentStage, onComplete]);

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#040812] transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'
                }`}
        >
            {/* Animated grid background */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Glow orbs */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px] animate-pulse" />
            <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-violet-500/5 blur-[100px] animate-pulse" style={{ animationDelay: '0.5s' }} />

            {/* Logo */}
            <div className="relative mb-12">
                <div className="absolute inset-0 blur-2xl bg-cyan-500/20 rounded-full scale-150 animate-pulse" />
                <div className="relative">
                    <h1 className="text-6xl md:text-7xl font-black tracking-widest bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                        VITGROWW
                    </h1>
                    <p className="text-center text-cyan-500/60 text-sm tracking-[0.5em] mt-2 font-light">
                        LEARN & GROW OS
                    </p>
                </div>
            </div>

            {/* Heartbeat line */}
            <div className="w-80 h-16 mb-8 relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 320 64">
                    <path
                        d="M0,32 L80,32 L100,8 L120,56 L140,16 L160,48 L180,32 L320,32"
                        fill="none"
                        stroke="url(#heartbeatGrad)"
                        strokeWidth="2"
                        className="animate-[dash_2s_ease-in-out_infinite]"
                        strokeDasharray="400"
                        strokeDashoffset="400"
                        style={{
                            animation: 'dash 2s ease-in-out infinite',
                        }}
                    />
                    <defs>
                        <linearGradient id="heartbeatGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                            <stop offset="30%" stopColor="#06b6d4" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="70%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Stage text */}
            <div className="h-8 mb-6 flex items-center">
                <p className="text-cyan-400/80 text-sm font-mono tracking-wider animate-pulse">
                    {currentStage < bootStages.length
                        ? bootStages[currentStage].text
                        : bootStages[bootStages.length - 1].text}
                </p>
            </div>

            {/* Progress bar */}
            <div className="w-72 h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #06b6d4, #8b5cf6, #10b981)',
                    }}
                />
            </div>

            {/* Progress percentage */}
            <p className="mt-3 text-xs text-white/20 font-mono">
                {Math.round(progress)}%
            </p>

            <style jsx>{`
        @keyframes dash {
          0% { stroke-dashoffset: 400; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -400; }
        }
      `}</style>
        </div>
    );
}
