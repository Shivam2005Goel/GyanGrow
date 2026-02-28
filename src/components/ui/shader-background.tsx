'use client';

import { useEffect, useRef } from 'react';

interface ShaderBackgroundProps {
    className?: string;
}

export default function ShaderBackground({ className = '' }: ShaderBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const draw = () => {
            time += 0.005;

            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, `hsl(${260 + Math.sin(time) * 20}, 70%, 8%)`);
            gradient.addColorStop(0.5, `hsl(${220 + Math.cos(time) * 20}, 60%, 5%)`);
            gradient.addColorStop(1, `hsl(${280 + Math.sin(time) * 30}, 65%, 7%)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw subtle grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
            ctx.lineWidth = 1;

            const gridSize = 50;
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Draw animated glow orbs
            for (let i = 0; i < 3; i++) {
                const x = (Math.sin(time * (i + 1) * 0.5) * 0.5 + 0.5) * canvas.width;
                const y = (Math.cos(time * (i + 1) * 0.3) * 0.5 + 0.5) * canvas.height;
                const radius = 100 + Math.sin(time * 2 + i) * 50;

                const orbGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
                orbGradient.addColorStop(0, 'rgba(100, 200, 255, 0.1)');
                orbGradient.addColorStop(0.5, 'rgba(150, 100, 255, 0.05)');
                orbGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = orbGradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            animationId = requestAnimationFrame(draw);
        };

        resize();
        window.addEventListener('resize', resize);
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute inset-0 ${className}`}
            style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0f0f2a 100%)' }}
        />
    );
}
