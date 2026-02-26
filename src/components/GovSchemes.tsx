'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2, Search, Filter, ShieldCheck, FileText,
    ExternalLink, ChevronDown, CheckCircle2, IndianRupee,
    Users, Briefcase, GraduationCap, Leaf, Landmark
} from 'lucide-react';

const SCHEMES_DATA = [
    {
        id: 'pm-mudra',
        title: 'Pradhan Mantri Mudra Yojana (PMMY)',
        category: 'Business & Startup',
        icon: Briefcase,
        color: 'from-blue-500 to-cyan-500',
        description: 'Provides loans up to 10 lakhs to non-corporate, non-farm small/micro enterprises.',
        benefits: [
            'Loans up to ₹10 Lakhs',
            'No collateral required',
            'Flexible repayment options'
        ],
        eligibility: 'Any Indian citizen who has a business plan for a non-farm sector income generating activity.',
        link: 'https://www.mudra.org.in/',
        tags: ['Loans', 'MSME', 'Startup']
    },
    {
        id: 'pm-kisan',
        title: 'PM Kisan Samman Nidhi',
        category: 'Agriculture',
        icon: Leaf,
        color: 'from-green-500 to-emerald-500',
        description: 'Financial benefit of ₹6,000 per year given to all landholding farmer families.',
        benefits: [
            '₹6,000 per year',
            'Direct Benefit Transfer (DBT)',
            'Paid in 3 equal installments'
        ],
        eligibility: 'All landholding farmers families, subject to certain exclusion criteria.',
        link: 'https://pmkisan.gov.in/',
        tags: ['Farmers', 'Financial Aid']
    },
    {
        id: 'startup-india',
        title: 'Startup India Seed Fund',
        category: 'Business & Startup',
        icon: Briefcase,
        color: 'from-purple-500 to-pink-500',
        description: 'Financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization.',
        benefits: [
            'Up to ₹20 Lakhs for validation',
            'Up to ₹50 Lakhs for market entry',
            'Mentorship support'
        ],
        eligibility: 'Recognized startups incorporating not more than 2 years ago.',
        link: 'https://seedfund.startupindia.gov.in/',
        tags: ['Startup', 'Funding', 'Innovation']
    },
    {
        id: 'pm-vidya',
        title: 'PM e-VIDYA',
        category: 'Education',
        icon: GraduationCap,
        color: 'from-yellow-500 to-orange-500',
        description: 'Unifies all efforts related to digital/online/on-air education to enable multi-mode access to education.',
        benefits: [
            'Access to DIKSHA platform',
            'TV channels for classes 1 to 12',
            'Extensive use of Radio/Community Radio'
        ],
        eligibility: 'All students across India from schools and higher education systems.',
        link: 'https://pmevidya.education.gov.in/',
        tags: ['Digital Learning', 'Students', 'Free']
    },
    {
        id: 'sukanya',
        title: 'Sukanya Samriddhi Yojana',
        category: 'Women Empowerment',
        icon: Users,
        color: 'from-pink-500 to-rose-500',
        description: 'A small deposit scheme for the girl child launched as a part of the Beti Bachao Beti Padhao campaign.',
        benefits: [
            'High interest rate (tax free)',
            'Tax deduction under 80C',
            'Maturity after 21 years'
        ],
        eligibility: 'Parents/guardians of a girl child below 10 years of age.',
        link: 'https://www.indiapost.gov.in/',
        tags: ['Girl Child', 'Saving', 'Tax Benefit']
    },
    {
        id: 'standup-india',
        title: 'Stand-Up India',
        category: 'Business & Startup',
        icon: Landmark,
        color: 'from-indigo-500 to-purple-500',
        description: 'Facilitates bank loans between 10 lakh and 1 Crore for setting up a greenfield enterprise.',
        benefits: [
            'Loans from ₹10 Lakh to ₹1 Crore',
            'Rupay debit card for working capital',
            'Comprehensive support'
        ],
        eligibility: 'SC/ST and/or women entrepreneurs, above 18 years of age.',
        link: 'https://www.standupmitra.in/',
        tags: ['SC/ST', 'Women', 'Enterprise']
    }
];

const CATEGORIES = ['All', 'Business & Startup', 'Agriculture', 'Education', 'Women Empowerment'];

export default function GovSchemes() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [expandedScheme, setExpandedScheme] = useState<string | null>(null);

    const filteredSchemes = SCHEMES_DATA.filter(scheme => {
        const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="w-full flex flex-col h-full inset-0 absolute overflow-y-auto bg-[#040812] text-white">
            {/* Header Banner */}
            <div className="relative pt-10 pb-16 px-6 lg:px-12 bg-gradient-to-b from-blue-900/30 to-transparent border-b border-white/[0.05]">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Building2 size={28} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                Government Schemes
                            </h1>
                            <p className="text-blue-200/60 mt-1">Discover & apply for Central and State financial initiatives.</p>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4 mt-8">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-400 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search schemes, benefits, or keywords..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all shadow-inner"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            {CATEGORIES.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-5 py-3 rounded-2xl whitespace-nowrap font-medium transition-all ${selectedCategory === category
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                        : 'bg-white/[0.03] text-white/60 border border-white/10 hover:bg-white/[0.08] hover:text-white'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto w-full px-6 lg:px-12 py-10 pb-24">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <ShieldCheck size={20} className="text-blue-400" />
                        Active Schemes <span className="text-white/40 text-sm font-normal">({filteredSchemes.length} found)</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredSchemes.map((scheme, i) => {
                            const Icon = scheme.icon;
                            const isExpanded = expandedScheme === scheme.id;

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    key={scheme.id}
                                    className={`bg-white/[0.03] border border-white/[0.05] rounded-3xl overflow-hidden transition-all hover:border-white/10 flex flex-col h-full ${isExpanded ? 'shadow-[0_0_30px_rgba(59,130,246,0.1)]' : ''
                                        }`}
                                >
                                    {/* Card Header (Always visible) */}
                                    <div
                                        onClick={() => setExpandedScheme(isExpanded ? null : scheme.id)}
                                        className="p-6 cursor-pointer flex flex-col flex-1 relative overflow-hidden group"
                                    >
                                        <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${scheme.color}`} />

                                        <div className="flex justify-between items-start gap-4 mb-4 pl-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${scheme.color} flex items-center justify-center bg-opacity-10 backdrop-blur-md`}>
                                                    <Icon size={24} className="text-white drop-shadow-md" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-semibold text-white/50 mb-1 uppercase tracking-wider">{scheme.category}</div>
                                                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors leading-tight">
                                                        {scheme.title}
                                                    </h3>
                                                </div>
                                            </div>
                                            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:text-white/80 transition-colors flex-shrink-0">
                                                <ChevronDown size={18} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>

                                        <p className="text-white/60 text-sm pl-3 mb-4 leading-relaxed line-clamp-2">
                                            {scheme.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 pl-3 mt-auto">
                                            {scheme.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-white/[0.05] border border-white/[0.05] rounded-lg text-xs font-medium text-white/70">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="border-t border-white/[0.05] bg-black/20"
                                            >
                                                <div className="p-6 pl-9 space-y-6">
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-white/80 flex items-center gap-2 mb-3">
                                                            <CheckCircle2 size={16} className="text-green-400" />
                                                            Key Benefits
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {scheme.benefits.map((benefit, idx) => (
                                                                <li key={idx} className="flex items-start gap-2 text-sm text-white/60">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                                                    <span className="leading-relaxed">{benefit}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-sm font-semibold text-white/80 flex items-center gap-2 mb-2">
                                                            <FileText size={16} className="text-yellow-400" />
                                                            Eligibility
                                                        </h4>
                                                        <p className="text-sm text-white/60 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                                                            {scheme.eligibility}
                                                        </p>
                                                    </div>

                                                    <div className="pt-2">
                                                        <a
                                                            href={scheme.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                                        >
                                                            Apply Now <ExternalLink size={16} />
                                                        </a>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {filteredSchemes.length === 0 && (
                    <div className="w-full py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <Search size={32} className="text-white/20" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No Schemes Found</h3>
                        <p className="text-white/40 max-w-sm">We couldn't find any government schemes matching your current filters. Try adjusting your search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
