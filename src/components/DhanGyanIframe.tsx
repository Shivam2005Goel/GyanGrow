import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DhanGyanIframe({ route }: { route: string }) {
    const [isLoading, setIsLoading] = useState(true);

    // Reset loading state if route changes
    useEffect(() => {
        setIsLoading(true);
    }, [route]);

    return (
        <div className="w-full h-full relative overflow-hidden bg-[#040812]">
            {/* Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
                    >
                        <div className="w-16 h-16 relative flex items-center justify-center">
                            <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full" />
                            <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin" />
                        </div>
                        <p className="mt-4 text-purple-400 font-medium tracking-widest uppercase text-xs animate-pulse">
                            Loading Feature
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <iframe
                src={`http://localhost:3001${route}`}
                onLoad={() => setIsLoading(false)}
                className={`w-full h-full block border-none bg-transparent transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                frameBorder="0"
                title="DhanGyan Ecosystem"
                allow="microphone; camera; display-capture; autoplay"
            />
        </div>
    );
}
