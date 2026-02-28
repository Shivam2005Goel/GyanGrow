'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Target, Trophy, Coins, Play,
    Sparkles, Gift, Gamepad2, ShoppingBag, Map,
    Globe, Brain, ArrowRight, Heart, GraduationCap,
    Briefcase, Star, CheckCircle, TrendingUp
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Custom Hooks
export const useTypewriter = (words: string[], typingSpeed = 100, pauseDuration = 2000) => {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        if (!words || words.length === 0) return;
        const currentWord = words[wordIndex];
        if (!currentWord) return;

        const timeout = setTimeout(() => {
            if (isDeleting) {
                setText(currentWord.substring(0, text.length - 1));
                if (text === '') {
                    setIsDeleting(false);
                    setWordIndex((prev) => (prev + 1) % words.length);
                }
            } else {
                setText(currentWord.substring(0, text.length + 1));
                if (text === currentWord) {
                    setTimeout(() => setIsDeleting(true), pauseDuration);
                }
            }
        }, isDeleting ? typingSpeed / 2 : typingSpeed);

        return () => clearTimeout(timeout);
    }, [text, isDeleting, wordIndex, words, typingSpeed, pauseDuration]);

    return { text, isDeleting, wordIndex };
};

// UI Components
export const GlassCard = ({
    children,
    className = '',
    hoverScale = 1.02,
    glowColor = 'rgba(147, 51, 234, 0.3)',
    onClick
}: any) => {
    return (
        <motion.div
            className={`
          relative overflow-hidden rounded-2xl p-6
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-xl cursor-pointer
          ${className}
        `}
            whileHover={{
                scale: hoverScale,
                boxShadow: `0 20px 40px ${glowColor}`,
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={onClick}
        >
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
            />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};

export const AnimatedButton = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    icon: Icon,
    loading = false,
    disabled = false
}: any) => {
    const variants: any = {
        primary: 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700',
        secondary: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600',
        outline: 'bg-transparent border-2 border-white/30 text-white hover:bg-white/10',
    };

    const sizes: any = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <motion.button
            className={`
          relative overflow-hidden rounded-full font-semibold
          flex items-center justify-center gap-2
          ${variants[variant] || variants.primary}
          ${sizes[size] || sizes.md}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={onClick}
            disabled={disabled}
        >
            {Icon && <Icon size={20} />}
            {children}
        </motion.button>
    );
};

export const SectionTitle = ({
    title,
    subtitle,
    align = 'center',
    className = ''
}: any) => {
    const alignClass: any = {
        center: 'text-center',
        left: 'text-left',
        right: 'text-right',
    };

    return (
        <motion.div
            className={`mb-8 ${alignClass[align]} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                {title}
            </h2>
            {subtitle && (
                <p className="mt-2 text-gray-300 text-lg">{subtitle}</p>
            )}
        </motion.div>
    );
};

const Shuffle = ({
    text,
    className = '',
    style = {},
    shuffleDirection = 'right',
    duration = 0.35,
    ease = 'power3.out',
    threshold = 0.1,
    tag = 'h1',
    shuffleTimes = 2,
    animationMode = 'evenodd',
    stagger = 0.04,
    triggerOnce = true,
}: any) => {
    const ref = useRef<HTMLElement>(null);
    const [ready, setReady] = useState(false);

    // Very simplified version for Next.js to avoid deep node manipulation issues in React 18
    useEffect(() => {
        setReady(true);
    }, []);

    const Tag: any = tag;
    return (
        <Tag
            ref={ref}
            className={`${ready ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 ${className}`}
            style={{ textAlign: 'center', ...style }}
        >
            {text}
        </Tag>
    );
};

const typewriterWords = [
    "Master Your Finances",
    "Learn Through Play",
    "Build Wealth Wisely",
    "Achieve Financial Freedom",
    "Join 50,000+ Learners",
];

const Hero = ({ onStart }: any) => {
    const { text } = useTypewriter(typewriterWords, 100, 2000);

    return (
        <section className="min-h-screen flex items-center justify-center relative pt-24 px-6 overflow-hidden">
            <div className="absolute inset-0 z-0">
                {/* Background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-black pointer-events-none" />
            </div>

            <div className="text-center w-full max-w-screen-2xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-flex items-center gap-3 px-8 py-4 mb-10 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
                        <Sparkles size={24} className="text-yellow-400" />
                        <span className="text-lg font-semibold text-yellow-100">Gamifying Financial Literacy for Bharat</span>
                    </span>

                    <div className="mb-8 flex justify-center">
                        <Shuffle
                            text="Dhyan Gyan"
                            tag="h1"
                            className="font-black tracking-tight text-yellow-400"
                            style={{ fontSize: 'clamp(5rem, 12vw, 14rem)', lineHeight: 1.1, textShadow: '0 4px 60px rgba(250, 204, 21, 0.5), 0 0 120px rgba(250, 204, 21, 0.2)' }}
                        />
                    </div>

                    <div className="h-24 mb-12 flex items-center justify-center">
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white/90">
                            {text}
                            <span className="animate-pulse text-purple-400">|</span>
                        </h2>
                    </div>

                    <p className="text-2xl md:text-3xl text-gray-300 mb-14 max-w-4xl mx-auto leading-relaxed">
                        Interactive Learning through Play. Master your finances with quests,
                        rewards, and a community of learners across India.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <AnimatedButton variant="primary" size="lg" onClick={onStart} className="shadow-lg shadow-purple-500/20 text-xl px-10 py-5">
                            <Play size={24} /> Start Your Journey
                        </AnimatedButton>
                        <AnimatedButton variant="outline" size="lg" className="backdrop-blur-sm bg-white/5 text-xl px-10 py-5">
                            Watch Demo
                        </AnimatedButton>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-24"
                >
                    {[
                        { value: '50K+', label: 'Players', icon: Users, color: 'text-blue-400' },
                        { value: '100+', label: 'Quests', icon: Target, color: 'text-green-400' },
                        { value: '₹2Cr+', label: 'Virtual Savings', icon: Coins, color: 'text-yellow-400' },
                        { value: '95%', label: 'Success Rate', icon: TrendingUp, color: 'text-pink-400' },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, translateY: -5 }}
                            className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors"
                        >
                            <stat.icon size={40} className={`mx-auto mb-4 ${stat.color}`} />
                            <div className="text-4xl md:text-5xl font-bold">{stat.value}</div>
                            <div className="text-lg text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

const QuickActions = ({ onNavigate }: any) => {
    const actions = [
        { name: 'Daily Rewards', icon: Gift, color: 'from-yellow-400 to-orange-500', href: '#' },
        { name: 'Quests', icon: Target, color: 'from-purple-500 to-pink-500', href: '#' },
        { name: 'Mini Games', icon: Gamepad2, color: 'from-blue-500 to-cyan-500', href: 'dg-games' },
        { name: 'Marketplace', icon: ShoppingBag, color: 'from-green-500 to-emerald-500', href: 'dg-marketplace' },
        { name: 'AI Roadmap', icon: Map, color: 'from-purple-500 to-indigo-500', href: 'dg-roadmap' },
        { name: 'Zonal Learning', icon: Globe, color: 'from-cyan-500 to-blue-500', href: 'dg-zonal' },
        { name: 'Skills', icon: Brain, color: 'from-orange-500 to-red-500', href: 'dg-skills' },
        { name: 'Leaderboard', icon: Trophy, color: 'from-red-500 to-pink-500', href: 'dg-leaderboard' },
    ];

    return (
        <section className="py-20 px-6 relative z-10">
            <div className="max-w-screen-xl mx-auto">
                <SectionTitle title="Quick Actions" subtitle="Jump into the action" />
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
                    {actions.map((action, index) => (
                        <motion.button
                            key={action.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => action.href !== '#' && onNavigate?.(action.href)}
                            className="p-10 rounded-3xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-purple-500/50 transition-all group backdrop-blur-sm"
                        >
                            <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-shadow`}>
                                <action.icon size={40} className="text-white" />
                            </div>
                            <span className="font-bold text-lg">{action.name}</span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    );
};

const WomenEmpowermentSection = () => (
    <section className="py-28 px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 to-purple-900/20 pointer-events-none" />
        <div className="max-w-screen-xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm font-semibold mb-4">
                        <Heart size={14} className="fill-pink-500" /> Women in Fintech
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">Empowering Women to Lead in Finance</h2>
                    <p className="text-gray-300 mb-8 text-xl md:text-2xl leading-relaxed">
                        Bridging the gender gap in financial literacy and technology. We provide dedicated resources, mentorship, and scholarships for women aspiring to build a career in Fintech.
                    </p>
                    <ul className="space-y-4 mb-8">
                        {[
                            "Exclusive 'Women in Tech' Scholarship Programs",
                            "Mentorship from Top Female Industry Leaders",
                            "Safe & Inclusive Community Forums",
                            "Specialized Courses on Investment & Wealth Building"
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center">
                                    <CheckCircle size={14} className="text-pink-400" />
                                </div>
                                <span className="text-gray-200">{item}</span>
                            </li>
                        ))}
                    </ul>
                    <AnimatedButton className="bg-gradient-to-r from-pink-500 to-purple-600 border-none">
                        Join Women's Network
                    </AnimatedButton>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative block bg-white/5">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                            <Users size={120} className="text-white/10" />
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80"
                            alt="Women in Finance"
                            className="object-cover w-full h-full opacity-60 hover:opacity-80 transition-opacity duration-500"
                        />
                        <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-xl font-bold">
                                    IS
                                </div>
                                <div>
                                    <h4 className="font-bold">Isha Sharma</h4>
                                    <p className="text-xs text-gray-300">Senior Fintech Analyst</p>
                                </div>
                            </div>
                            <p className="mt-3 text-sm text-gray-300 italic">"DhyanGyan gave me the confidence to start my investment journey."</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    </section>
);

const StudentHubSection = () => (
    <section className="py-28 px-8">
        <div className="max-w-screen-xl mx-auto">
            <div className="text-center mb-20">
                <span className="text-blue-400 font-bold tracking-wider uppercase text-lg">Future Ready</span>
                <h2 className="text-4xl md:text-6xl font-bold mt-3 mb-6">Student Financial Hub</h2>
                <p className="text-gray-400 max-w-4xl mx-auto text-xl">
                    Start young, retire rich. We equip students with the practical skills needed to navigate the modern financial landscape, from student loans to startup funding.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        icon: GraduationCap,
                        title: "Campus Ambassador",
                        desc: "Lead the change in your college. Earn rewards and certificates.",
                        color: "blue"
                    },
                    {
                        icon: Briefcase,
                        title: "Virtual Internships",
                        desc: "Gain real-world experience with top Fintech partners.",
                        color: "green"
                    },
                    {
                        icon: Trophy,
                        title: "Hackathons",
                        desc: "Build the next big thing in Finance on our platform.",
                        color: "purple"
                    }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -10 }}
                        className="p-10 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative group overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-32 bg-${item.color}-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none`} />
                        <div className={`w-14 h-14 rounded-2xl bg-${item.color}-500/20 flex items-center justify-center mb-6`}>
                            <item.icon size={28} className={`text-${item.color}-400`} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                        <p className="text-gray-400 mb-6">{item.desc}</p>
                        <button className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-4 transition-all">
                            Learn More <ArrowRight size={16} />
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const Testimonials = () => (
    <section className="py-28 px-8 bg-black/20">
        <div className="max-w-screen-xl mx-auto">
            <SectionTitle title="Success Stories" subtitle="Hear from our community" />
            <div className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        name: "Rahul Verma",
                        role: "College Student",
                        text: "The gamified approach made learning about mutual funds actually fun. I'm now managing my own pocket money portfolio!",
                        avatar: "RV"
                    },
                    {
                        name: "Priya Patel",
                        role: "Home Maker",
                        text: "Dhyan Gyan helped me understand simple savings tools that I was too intimidated to try before. Highly recommended!",
                        avatar: "PP"
                    },
                    {
                        name: "Arjun Singh",
                        role: "Young Professional",
                        text: "The roadmap feature is a game changer. It gave me a clear path to follow for my financial goals.",
                        avatar: "AS"
                    }
                ].map((t, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 bg-white/5 border border-white/10 rounded-2xl"
                    >
                        <div className="flex items-center gap-2 mb-4 text-yellow-400">
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                            <Star size={16} fill="currentColor" />
                        </div>
                        <p className="text-gray-300 mb-6 italic">"{t.text}"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-sm">
                                {t.avatar}
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">{t.name}</h4>
                                <p className="text-xs text-gray-500">{t.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const DhanGyanHome = ({ onNavigate }: { onNavigate?: (section: string) => void }) => {
    return (
        <div className="overflow-x-hidden min-h-screen text-white bg-[#0f0f1a]">
            {/* Ambient Background Gradient (replaces CSS particle/orbs for standalone layout) */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] -z-10" />

            <Hero onStart={() => onNavigate?.('dg-learning')} />

            <QuickActions onNavigate={onNavigate} />

            <WomenEmpowermentSection />

            <StudentHubSection />

            <Testimonials />

            {/* Call to Action */}
            <section className="py-28 px-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black pointer-events-none" />
                <div className="max-w-screen-lg mx-auto relative z-10">
                    <h2 className="text-5xl md:text-7xl font-bold mb-10">Ready to Start Your Journey?</h2>
                    <p className="text-2xl md:text-3xl text-gray-300 mb-14">
                        Join thousands of others who are taking control of their financial future today.
                    </p>
                    <AnimatedButton
                        variant="primary"
                        size="lg"
                        onClick={() => onNavigate?.('dg-learning')}
                        className="text-2xl px-14 py-6 shadow-xl shadow-purple-500/30 mx-auto"
                    >
                        Create Free Account
                    </AnimatedButton>
                </div>
            </section>
        </div>
    );
};

export default DhanGyanHome;
