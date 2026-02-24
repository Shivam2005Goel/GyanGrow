'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Sparkles, Users, Code, Dumbbell, MessageCircle,
    Clock, MapPin, Filter, RefreshCw, GraduationCap,
    Handshake, Lightbulb, Zap, UsersRound, ChevronDown,
    Star, Award, Briefcase, TrendingUp, Target,
    BookOpen
} from 'lucide-react';

type PartnerType = 'study' | 'hackathon' | 'sports' | 'project' | 'roommate';

interface PartnerProfile {
    id: string;
    name: string;
    age: number;
    year: string;
    major: string;
    avatar: string;
    photo: string;
    bio: string;
    interests: string[];
    skills: string[];
    partnerType: PartnerType;
    location: string;
    availability: string;
    compatibility: number;
}

const partnerTypeConfig = {
    study: {
        label: 'Study',
        icon: GraduationCap,
        color: 'cyan',
        gradient: 'from-cyan-500 to-blue-600',
        bgGradient: 'from-cyan-500/20 to-blue-500/10',
        borderColor: 'border-cyan-500/30',
        textColor: 'text-cyan-400',
        bgColor: 'bg-cyan-500',
        glow: 'shadow-cyan-500/20',
        accent: 'cyan',
        description: 'Find partners for acing your subjects',
        skillIcon: BookOpen
    },
    hackathon: {
        label: 'Hack',
        icon: Code,
        color: 'violet',
        gradient: 'from-violet-500 to-fuchsia-600',
        bgGradient: 'from-violet-500/20 to-fuchsia-500/10',
        borderColor: 'border-violet-500/30',
        textColor: 'text-violet-400',
        bgColor: 'bg-violet-500',
        glow: 'shadow-violet-500/20',
        accent: 'violet',
        description: 'Team up for hackathons',
        skillIcon: Lightbulb
    },
    sports: {
        label: 'Sports',
        icon: Dumbbell,
        color: 'emerald',
        gradient: 'from-emerald-500 to-teal-600',
        bgGradient: 'from-emerald-500/20 to-teal-500/10',
        borderColor: 'border-emerald-500/30',
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500',
        glow: 'shadow-emerald-500/20',
        accent: 'emerald',
        description: 'Find teammates for sports',
        skillIcon: TrendingUp
    },
    project: {
        label: 'Project',
        icon: Lightbulb,
        color: 'amber',
        gradient: 'from-amber-500 to-orange-600',
        bgGradient: 'from-amber-500/20 to-orange-500/10',
        borderColor: 'border-amber-500/30',
        textColor: 'text-amber-400',
        bgColor: 'bg-amber-500',
        glow: 'shadow-amber-500/20',
        accent: 'amber',
        description: 'Collaborate on projects',
        skillIcon: Briefcase
    },
    roommate: {
        label: 'Room',
        icon: UsersRound,
        color: 'blue',
        gradient: 'from-blue-500 to-sky-600',
        bgGradient: 'from-blue-500/20 to-sky-500/10',
        borderColor: 'border-blue-500/30',
        textColor: 'text-blue-400',
        bgColor: 'bg-blue-500',
        glow: 'shadow-blue-500/20',
        accent: 'blue',
        description: 'Find compatible roommates',
        skillIcon: Target
    }
};

// Curated portrait photos
const mockPartners: PartnerProfile[] = [
    {
        id: '1',
        name: 'Priya Sharma',
        age: 20,
        year: '3rd Year',
        major: 'Computer Science',
        avatar: 'PS',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
        bio: 'Passionate about AI/ML and looking for study partners. Love to collaborate on hackathons!',
        interests: ['AI/ML', 'Algorithms', 'Hackathons', 'Badminton', 'Photography'],
        skills: ['Python', 'Machine Learning', 'Data Structures'],
        partnerType: 'study',
        location: 'Hostel A',
        availability: 'Weekday evenings',
        compatibility: 92
    },
    {
        id: '2',
        name: 'Arjun Mehta',
        age: 21,
        year: '3rd Year',
        major: 'Data Science',
        avatar: 'AM',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        bio: 'Looking for hackathon teammates. Full stack dev passionate about building cool projects!',
        interests: ['Full Stack', 'Data Science', 'Hackathons', 'Cricket', 'Gaming'],
        skills: ['React', 'Node.js', 'Python'],
        partnerType: 'hackathon',
        location: 'Hostel B',
        availability: 'Weekends',
        compatibility: 88
    },
    {
        id: '3',
        name: 'Sneha Reddy',
        age: 19,
        year: '2nd Year',
        major: 'Electronics',
        avatar: 'SR',
        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        bio: 'Sports enthusiast! Looking for partners to play tennis and badminton. Also need help with DA!',
        interests: ['Tennis', 'Badminton', 'Digital Electronics', 'Music', 'Travel'],
        skills: ['Circuit Design', 'C++', 'MATLAB'],
        partnerType: 'sports',
        location: 'Hostel C',
        availability: 'Mornings',
        compatibility: 85
    },
    {
        id: '4',
        name: 'Karthik Nair',
        age: 20,
        year: '3rd Year',
        major: 'CSE',
        avatar: 'KN',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
        bio: 'Looking for project partners to build a startup. Interested in SaaS products!',
        interests: ['Startups', 'SaaS', 'Products', 'Business', 'Tech'],
        skills: ['Product Design', 'Marketing', 'React'],
        partnerType: 'project',
        location: 'Hostel D',
        availability: 'Flexible',
        compatibility: 78
    },
    {
        id: '5',
        name: 'Ananya Gupta',
        age: 20,
        year: '3rd Year',
        major: 'BTech',
        avatar: 'AG',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
        bio: 'Looking for serious study partners for placement prep. Also into competitive programming!',
        interests: ['CP', 'Placement Prep', 'Dancing', 'Art', 'Coffee'],
        skills: ['C++', 'DSA', 'System Design'],
        partnerType: 'study',
        location: 'Hostel A',
        availability: 'Evenings',
        compatibility: 90
    },
    {
        id: '6',
        name: 'Rohan Singh',
        age: 21,
        year: '4th Year',
        major: 'Information Technology',
        avatar: 'RS',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        bio: 'Final year student seeking hackathon partners for SIH. Experienced full stack dev!',
        interests: ['SIH', 'Web Dev', 'IoT', 'Football', 'Music'],
        skills: ['MERN Stack', 'IoT', 'Cloud'],
        partnerType: 'hackathon',
        location: 'Hostel E',
        availability: 'Anytime',
        compatibility: 94
    },
    {
        id: '7',
        name: 'Meera Patel',
        age: 19,
        year: '2nd Year',
        major: 'Mechanical',
        avatar: 'MP',
        photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
        bio: 'Looking for badminton partners and study partners. Fun-loving and energetic!',
        interests: ['Badminton', 'Engineering', 'Sketching', 'Anime', 'Cooking'],
        skills: ['AutoCAD', 'SolidWorks', 'Physics'],
        partnerType: 'sports',
        location: 'Hostel B',
        availability: 'Weekends',
        compatibility: 82
    },
    {
        id: '8',
        name: 'Aditya Kumar',
        age: 20,
        year: '3rd Year',
        major: 'CSE',
        avatar: 'AK',
        photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face',
        bio: 'Need a roommate for next semester. Developer who loves gaming and anime!',
        interests: ['Gaming', 'Anime', 'Coding', 'Pizza', 'Marvel'],
        skills: ['Java', 'Flutter', 'Gaming'],
        partnerType: 'roommate',
        location: 'Hostel C',
        availability: 'Nights',
        compatibility: 71
    },
    {
        id: '9',
        name: 'Divya Iyer',
        age: 20,
        year: '3rd Year',
        major: 'CSE',
        avatar: 'DI',
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
        bio: 'ML enthusiast seeking study partners for ML lab and project collaborators!',
        interests: ['Machine Learning', 'Python', 'Hackathons', 'Yoga', 'Blogging'],
        skills: ['TensorFlow', 'Python', 'NLP'],
        partnerType: 'study',
        location: 'Hostel D',
        availability: 'After 5 PM',
        compatibility: 89
    },
    {
        id: '10',
        name: 'Vikram Joshi',
        age: 21,
        year: '4th Year',
        major: 'Electronics',
        avatar: 'VJ',
        photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face',
        bio: 'Looking for serious hackathon partners. Have won 2 hackathons!',
        interests: ['Embedded', 'Robotics', 'Hackathons', 'Basketball', 'Guitar'],
        skills: ['Arduino', 'PCB Design', 'C'],
        partnerType: 'hackathon',
        location: 'Hostel A',
        availability: 'Flexible',
        compatibility: 86
    },
    {
        id: '11',
        name: 'Sarah Chen',
        age: 20,
        year: '3rd Year',
        major: 'CSE',
        avatar: 'SC',
        photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face',
        bio: 'Building a portfolio project and need creative partners. Love UI/UX and web tech!',
        interests: ['UI/UX', 'Web Dev', 'Design', 'Figma', 'React'],
        skills: ['Figma', 'React', 'CSS'],
        partnerType: 'project',
        location: 'Hostel F',
        availability: 'Weekends',
        compatibility: 91
    },
    {
        id: '12',
        name: 'Raj Malhotra',
        age: 21,
        year: '2nd Year',
        major: 'CSE',
        avatar: 'RM',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
        bio: 'Looking for a quiet and clean roommate. Focus on studies. Non-smoker.',
        interests: ['Studies', 'Reading', 'Chess', 'Meditation', 'Cooking'],
        skills: ['Java', 'Web Dev', 'Math'],
        partnerType: 'roommate',
        location: 'Hostel A',
        availability: 'Flexible',
        compatibility: 76
    }
];

// Swipe Card Component
function SwipeCard({ profile, config, onSwipe }: {
    profile: PartnerProfile;
    config: typeof partnerTypeConfig.study;
    onSwipe: (dir: 'left' | 'right') => void;
}) {
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleDragStart = (e: any) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    };

    const handleDrag = (e: any) => {
        if (!isDragging) return;
        setDragOffset({
            x: e.clientX - dragStart.x,
            y: (e.clientY - dragStart.y) * 0.3
        });
    };

    const handleDragEnd = (e: any) => {
        if (!isDragging) return;
        setIsDragging(false);
        const diff = e.clientX - dragStart.x;

        if (Math.abs(diff) > 100) {
            onSwipe(diff > 0 ? 'right' : 'left');
        }
        setDragOffset({ x: 0, y: 0 });
    };

    const rotation = dragOffset.x * 0.05;

    return (
        <motion.div
            className="absolute inset-x-3 cursor-grab active:cursor-grabbing"
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            animate={{
                x: dragOffset.x,
                y: dragOffset.y,
                rotate: rotation,
                scale: 1
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <motion.div
                className="w-full h-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#151520] to-[#0a0a12] border border-white/[0.08] shadow-2xl"
                whileHover={{ scale: 1.02 }}
            >
                {/* Photo Section */}
                <div className="relative h-52 overflow-hidden">
                    <img
                        src={profile.photo}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-transparent to-transparent" />

                    {/* Compatibility Badge */}
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                        <Zap size={12} className={config.textColor} />
                        <span className="text-white font-bold text-sm">{profile.compatibility}%</span>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-4 left-4">
                        <div className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${config.gradient} shadow-lg`}>
                            <span className="text-white text-xs font-bold flex items-center gap-1">
                                {config.label}
                            </span>
                        </div>
                    </div>

                    {/* Name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h2 className="text-2xl font-bold text-white mb-1">{profile.name}</h2>
                        <p className="text-white/60 text-sm">{profile.major} • {profile.year}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Quick Info */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-white/50 text-xs">
                            <MapPin size={12} className={config.textColor} />
                            {profile.location}
                        </div>
                        <div className="flex items-center gap-1.5 text-white/50 text-xs">
                            <Clock size={12} className={config.textColor} />
                            {profile.availability}
                        </div>
                        <div className="flex items-center gap-1.5 text-white/50 text-xs">
                            <Users size={12} className={config.textColor} />
                            {profile.age}y
                        </div>
                    </div>

                    {/* Bio */}
                    <p className="text-white/70 text-sm leading-relaxed line-clamp-2">{profile.bio}</p>

                    {/* Interests */}
                    <div>
                        <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Interests</p>
                        <div className="flex flex-wrap gap-1.5">
                            {profile.interests.map((interest, i) => (
                                <span key={i} className="px-2.5 py-1 bg-white/[0.05] border border-white/[0.08] rounded-full text-white/70 text-xs">
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                            {profile.skills.map((skill, i) => (
                                <span key={i} className={`px-2.5 py-1 ${config.bgGradient} border ${config.borderColor} rounded-full ${config.textColor} text-xs font-medium`}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Swipe hint */}
                    <div className="flex justify-center gap-8 pt-2">
                        <div className="flex items-center gap-2 text-white/30 text-xs">
                            <X size={14} className="text-rose-400" />
                            <span>Skip</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/30 text-xs">
                            <span>Connect</span>
                            <Handshake size={14} className={config.textColor} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function PartnerMatch() {
    const [activeTab, setActiveTab] = useState<PartnerType>('study');
    const [profiles, setProfiles] = useState<PartnerProfile[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [connections, setConnections] = useState<PartnerProfile[]>([]);
    const [showConnections, setShowConnections] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ year: '', major: '', location: '' });
    const [showMatch, setShowMatch] = useState(false);
    const [stats, setStats] = useState({ swiped: 0, connected: 0, skipped: 0 });

    useEffect(() => {
        let filtered = mockPartners.filter(p => p.partnerType === activeTab);
        if (filters.year) filtered = filtered.filter(p => p.year.includes(filters.year));
        if (filters.major) filtered = filtered.filter(p => p.major.toLowerCase().includes(filters.major.toLowerCase()));
        if (filters.location) filtered = filtered.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
        setProfiles(filtered);
        setCurrentIndex(0);
    }, [activeTab, filters]);

    const currentProfile = profiles[currentIndex];
    const nextProfile = profiles[currentIndex + 1];

    const advanceCard = (direction: 'left' | 'right') => {
        if (!currentProfile) return;
        setStats(s => ({ ...s, swiped: s.swiped + 1 }));

        if (direction === 'right') {
            setConnections(prev => [...prev, currentProfile]);
            setShowMatch(true);
            setStats(s => ({ ...s, connected: s.connected + 1 }));
            setTimeout(() => setShowMatch(false), 1500);
        } else {
            setStats(s => ({ ...s, skipped: s.skipped + 1 }));
        }

        setTimeout(() => {
            if (currentIndex < profiles.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setCurrentIndex(profiles.length);
            }
        }, 300);
    };

    const resetProfiles = () => {
        const filtered = mockPartners.filter(p => p.partnerType === activeTab);
        setProfiles([...filtered].sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
        setStats({ swiped: 0, connected: 0, skipped: 0 });
    };

    const config = partnerTypeConfig[activeTab];
    const ConfigIcon = config.icon;

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] overflow-hidden gap-3">
            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 3 }}
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg ${config.glow}`}
                    >
                        <ConfigIcon size={20} className="text-white" />
                    </motion.div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Partner Match</h2>
                        <p className="text-white/40 text-xs">{config.description}</p>
                    </div>
                </div>

                {/* Stats Pills */}
                <div className="hidden md:flex items-center gap-2">
                    <div className={`px-2.5 py-1 rounded-lg ${config.bgGradient} border ${config.borderColor}`}>
                        <span className={`text-xs font-bold ${config.textColor}`}>{stats.connected}</span>
                        <span className="text-white/30 text-[10px] ml-1">connected</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.06]">
                        <span className="text-xs font-bold text-white/60">{stats.swiped}</span>
                        <span className="text-white/30 text-[10px] ml-1">swiped</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2 rounded-lg transition-all border ${showFilters ? `bg-white/10 ${config.borderColor} ${config.textColor}` : 'bg-white/[0.05] border-white/[0.06] text-white/50 hover:text-white'}`}
                    >
                        <Filter size={15} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowConnections(true)}
                        className="relative p-2 bg-white/[0.05] rounded-lg hover:bg-white/[0.08] border border-white/[0.06]"
                    >
                        <Users size={15} className="text-white/50" />
                        {connections.length > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`absolute -top-1 -right-1 w-4 h-4 ${config.bgColor} rounded-full text-[8px] font-bold flex items-center justify-center text-white`}
                            >
                                {connections.length}
                            </motion.span>
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Filters */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex-shrink-0 overflow-hidden"
                    >
                        <div className="p-2.5 bg-white/[0.02] backdrop-blur-md rounded-xl border border-white/[0.05] flex flex-wrap gap-2">
                            {[
                                { label: 'Year', key: 'year' as const, options: ['1st', '2nd', '3rd', '4th'] },
                                { label: 'Major', key: 'major' as const, options: ['CSE', 'IT', 'ECE', 'Mechanical'] },
                                { label: 'Hostel', key: 'location' as const, options: ['Hostel A', 'Hostel B', 'Hostel C', 'Hostel D'] },
                            ].map(f => (
                                <div key={f.key} className="relative">
                                    <select
                                        value={filters[f.key]}
                                        onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
                                        className="appearance-none pl-2.5 pr-6 py-1.5 bg-black/40 border border-white/[0.06] rounded-lg text-white/80 text-xs outline-none cursor-pointer"
                                    >
                                        <option value="">{f.label}</option>
                                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                    <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                                </div>
                            ))}
                            {(filters.year || filters.major || filters.location) && (
                                <button onClick={() => setFilters({ year: '', major: '', location: '' })} className="px-2 py-1 text-white/40 text-xs hover:text-white">
                                    Clear
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Type Tabs */}
            <div className="flex gap-1 p-1 bg-white/[0.02] rounded-lg w-fit flex-shrink-0 border border-white/[0.04]">
                {(Object.keys(partnerTypeConfig) as PartnerType[]).map(type => {
                    const c = partnerTypeConfig[type];
                    const Icon = c.icon;
                    return (
                        <button
                            key={type}
                            onClick={() => setActiveTab(type)}
                            className={`relative px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors flex items-center gap-1.5 ${activeTab === type ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                        >
                            {activeTab === type && (
                                <motion.div
                                    layoutId="partnerTab"
                                    className={`absolute inset-0 bg-gradient-to-r ${c.gradient} rounded-md opacity-20`}
                                />
                            )}
                            <Icon size={11} />
                            <span className="relative z-10">{c.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Main Card Area */}
            <div className="flex-1 flex items-center justify-center relative min-h-0">
                {/* Match Toast */}
                <AnimatePresence>
                    {showMatch && currentProfile && (
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute top-0 z-50"
                        >
                            <div className={`px-5 py-3 rounded-2xl bg-gradient-to-r ${config.gradient} shadow-2xl ${config.glow} flex items-center gap-3`}>
                                <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: 2, duration: 0.3 }}>
                                    <Handshake size={18} className="text-white" />
                                </motion.div>
                                <span className="text-white font-bold">Connected with {currentProfile.name.split(' ')[0]}!</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {profiles.length === 0 || currentIndex >= profiles.length ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center px-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mx-auto mb-3">
                            <Sparkles size={28} className="text-white/20" />
                        </div>
                        <h3 className="text-base font-bold text-white/60 mb-1">All done!</h3>
                        <p className="text-white/30 text-xs mb-4">No more {config.label.toLowerCase()} partners to show</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resetProfiles}
                            className={`px-4 py-2 bg-gradient-to-r ${config.gradient} text-white rounded-lg text-xs font-medium shadow-lg ${config.glow}`}
                        >
                            <RefreshCw size={12} className="inline mr-1" /> Browse Again
                        </motion.button>
                    </motion.div>
                ) : (
                    <div className="relative w-full max-w-[340px] mx-auto h-full flex items-center justify-center">
                        {/* Background Card */}
                        {nextProfile && (
                            <div className="absolute inset-x-2 top-10 h-[420px] rounded-3xl bg-white/[0.01] border border-white/[0.03]" />
                        )}

                        {/* Current Card */}
                        {currentProfile && (
                            <SwipeCard
                                key={currentProfile.id}
                                profile={currentProfile}
                                config={config}
                                onSwipe={advanceCard}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-5 flex-shrink-0 pb-2">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => advanceCard('left')}
                    disabled={!currentProfile}
                    className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-rose-500/15 hover:border-rose-500/25 transition-all disabled:opacity-30"
                >
                    <X size={22} className="text-rose-400" />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => advanceCard('right')}
                    disabled={!currentProfile}
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${config.gradient} shadow-xl ${config.glow} flex items-center justify-center transition-all disabled:opacity-30`}
                >
                    <Handshake size={28} className="text-white" />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetProfiles}
                    className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/10 transition-all"
                >
                    <RefreshCw size={18} className="text-white/50" />
                </motion.button>
            </div>

            {/* Connections Modal */}
            <AnimatePresence>
                {showConnections && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setShowConnections(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#0a0a14]/95 border border-white/[0.08] rounded-2xl w-full max-w-sm max-h-[75vh] overflow-hidden"
                        >
                            <div className="p-3 border-b border-white/[0.05] flex items-center justify-between">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <Users size={14} className={config.textColor} />
                                    Connections ({connections.length})
                                </h3>
                                <button onClick={() => setShowConnections(false)} className="p-1 hover:bg-white/[0.05] rounded">
                                    <X size={14} className="text-white/40" />
                                </button>
                            </div>
                            <div className="p-3 overflow-y-auto max-h-[60vh]">
                                {connections.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Users size={32} className="text-white/10 mx-auto mb-2" />
                                        <p className="text-white/30 text-xs">No connections yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {connections.map(conn => (
                                            <div key={conn.id} className="flex items-center gap-3 p-2.5 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                                                <img src={conn.photo} alt={conn.name} className="w-10 h-10 rounded-full object-cover" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-sm font-medium truncate">{conn.name}</p>
                                                    <p className="text-white/40 text-[10px]">{conn.major}</p>
                                                </div>
                                                <button className={`p-2 ${config.bgGradient} ${config.textColor} rounded-lg`}>
                                                    <MessageCircle size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
