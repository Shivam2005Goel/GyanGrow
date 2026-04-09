'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, LineChart, Line, Cell, ComposedChart, Area
} from 'recharts';
import {
    Zap, Award, AlertCircle, Globe, Brain,
    Library, Activity, Binary, GitBranch, BarChart3, HelpCircle
} from 'lucide-react';
import {
    traditionalMLData,
    multiDatasetData,
    deepLearningStandard,
    deepLearningGloVe,
    bertResults,
    slmFineTuning,
    keyFindings
} from '@/data/athenaData';

const SectionTitle = ({ title, icon: Icon }: { title: string, icon: any }) => (
    <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <Icon size={20} className="text-cyan-400" />
        </div>
        <h2 className="text-xl font-bold text-white/90">{title}</h2>
    </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 ${className}`}>
        {children}
    </div>
);

export default function AthenaResults() {
    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-cyan-900/40 to-violet-900/40 border border-white/10">
                <div className="relative z-10">
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400"
                    >
                        Athena Project
                    </motion.h1>
                    <p className="text-white/60 mt-2 max-w-2xl">
                        Comprehensive summary of machine learning benchmarks, deep learning evaluations, and fine-tuning results across multiple educational datasets.
                    </p>
                </div>
                <div className="absolute top-0 right-0 p-8 flex gap-4 opacity-10">
                    <Binary size={120} />
                </div>
            </div>

            {/* Key Findings */}
            <div>
                <SectionTitle title="Key Findings" icon={BarChart3} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {keyFindings.map((finding, idx) => {
                        const Icon = finding.icon === 'Zap' ? Zap :
                                     finding.icon === 'CheckCircle' ? Award :
                                     finding.icon === 'AlertTriangle' ? AlertCircle :
                                     finding.icon === 'Globe' ? Globe : Brain;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="h-full hover:border-cyan-500/30 transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
                                            <Icon className="text-cyan-400" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white/80 group-hover:text-cyan-400 transition-colors">{finding.title}</h3>
                                            <p className="text-sm text-white/40 mt-1 leading-relaxed">{finding.detail}</p>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Traditional ML Section */}
                <div>
                    <SectionTitle title="Traditional ML Performance" icon={GitBranch} />
                    <Card className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={traditionalMLData}>
                                <PolarGrid stroke="#ffffff20" />
                                <PolarAngleAxis dataKey="model" tick={{ fill: '#ffffff60', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 0.3]} tick={{ fill: '#ffffff40' }} />
                                <Radar name="Accuracy" dataKey="accuracy" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.6} />
                                <Radar name="F1-Score" dataKey="f1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" />
                            </RadarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Multi-Dataset Efficiency */}
                <div>
                    <SectionTitle title="Execution Across Datasets" icon={Library} />
                    <Card className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={multiDatasetData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                                <XAxis type="number" domain={[0, 1]} tick={{ fill: '#ffffff40' }} />
                                <YAxis dataKey="dataset" type="category" width={150} tick={{ fill: '#ffffff60', fontSize: 10 }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                />
                                <Legend />
                                <Bar dataKey="XGBoost" fill="#22d3ee" radius={[0, 4, 4, 0]} />
                                <Bar dataKey="RF" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                                <Bar dataKey="LR" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>

            {/* Deep Learning Insights */}
            <div>
                <SectionTitle title="Deep Learning Benchmark (LSTM vs GRU)" icon={Activity} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {deepLearningStandard.map((res, idx) => (
                        <Card key={idx} className="flex flex-col items-center text-center p-4">
                            <h4 className="text-[10px] uppercase tracking-widest text-white/30 mb-2 truncate w-full">{res.dataset}</h4>
                            <div className={`text-2xl font-bold ${res.status === 'Perfect' || res.status === 'Near-Perfect' ? 'text-cyan-400' : res.status === 'Failure' ? 'text-red-400' : 'text-violet-400'}`}>
                                {(res.accuracy * 100).toFixed(1)}%
                            </div>
                            <div className="text-[10px] text-white/20 mt-1">Best: <span className="text-white/60">{res.bestModel}</span></div>
                            <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${res.accuracy * 100}%` }}
                                    className={`h-full ${res.status === 'Failure' ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-violet-500'}`}
                                />
                            </div>
                            <span className="text-[10px] font-semibold mt-2 text-white/40 uppercase">{res.status}</span>
                        </Card>
                    ))}
                </div>
            </div>

            {/* GloVe Impact Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SectionTitle title="GloVe Embedding Impact Analysis" icon={Globe} />
                    <Card className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={deepLearningGloVe}>
                                <CartesianGrid vertical={false} stroke="#ffffff05" />
                                <XAxis dataKey="dataset" tick={false} stroke="#ffffff20" />
                                <YAxis tick={{ fill: '#ffffff40' }} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                />
                                <Legend />
                                <Area type="monotone" dataKey="LSTM" fill="#22d3ee20" stroke="#22d3ee" />
                                <Area type="monotone" dataKey="GRU" fill="#8b5cf620" stroke="#8b5cf6" />
                                <Bar dataKey="impact" name="Impact Delta">
                                    {deepLearningGloVe.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.impact > 0 ? '#10b981' : '#f43f5e'} />
                                    ))}
                                </Bar>
                            </ComposedChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* SLM Fine-Tuning Stats */}
                <div>
                    <SectionTitle title="SLM Fine-Tuning (Qwen)" icon={Brain} />
                    <Card className="h-[350px] flex flex-col justify-between border-violet-500/20 bg-violet-500/5">
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Model</p>
                                    <h3 className="text-xl font-bold text-white">{slmFineTuning.model}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Quantization</p>
                                    <h3 className="text-sm font-bold text-violet-400">{slmFineTuning.quantization}</h3>
                                </div>
                            </div>
                            
                            <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Tuned Params</span>
                                    <span className="text-white/80">{slmFineTuning.parametersTuned}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Traing Corpus</span>
                                    <span className="text-white/80">{slmFineTuning.trainingCorpus}</span>
                                </div>
                            </div>

                        <div className="relative h-24 flex items-end gap-2 px-2">
                                <div className="flex-1 flex flex-col items-center">
                                    <div className="w-full bg-white/10 rounded-t-lg" style={{ height: '100%' }}></div>
                                    <span className="text-[10px] text-white/20 mt-1">{slmFineTuning.initialLoss} Loss</span>
                                </div>
                                <div className="flex items-center justify-center p-2 mb-8">
                                    <BarChart3 className="text-emerald-400" size={16} />
                                </div>
                                <div className="flex-1 flex flex-col items-center">
                                    <div className="w-full bg-gradient-to-t from-emerald-500 to-cyan-500 rounded-t-lg" style={{ height: '41%' }}></div>
                                    <span className="text-[10px] text-emerald-400 mt-1 font-bold">{slmFineTuning.finalLoss} Loss</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4 text-[10px] text-white/30 bg-white/5 p-2 rounded-lg">
                            <HelpCircle size={12} />
                            Deploy Format: <span className="text-white/60">{slmFineTuning.deployment}</span>
                        </div>
                    </Card>
                </div>
            </div>

            {/* BERT Fine-Tuning results */}
            <div>
                <SectionTitle title="BERT Fine-Tuning Benchmarks" icon={Binary} />
                <div className="overflow-x-auto rounded-2xl border border-white/10">
                    <table className="w-full text-left bg-white/[0.02]">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.03]">
                                <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">Dataset</th>
                                <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">Target Var</th>
                                <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">Classes</th>
                                <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">Accuracy</th>
                                <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">Loss</th>
                                <th className="p-4 text-xs font-bold text-white/40 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bertResults.map((row, idx) => (
                                <tr key={idx} className="border-b border-white/[0.05] hover:bg-white/[0.03] transition-colors">
                                    <td className="p-4 text-sm font-bold text-white/80">{row.dataset}</td>
                                    <td className="p-4 text-sm text-white/50">{row.target}</td>
                                    <td className="p-4 text-sm text-cyan-400">{row.classes}</td>
                                    <td className="p-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-cyan-400" style={{ width: `${row.accuracy * 100}%` }}></div>
                                            </div>
                                            <span className="text-white/80 font-mono">{(row.accuracy * 100).toFixed(1)}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-white/40">{row.loss}</td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                                            row.status === 'Excellent' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' :
                                            row.status === 'High' ? 'border-cyan-500/20 text-cyan-400 bg-cyan-500/10' :
                                            row.status === 'Moderate' ? 'border-yellow-500/20 text-yellow-400 bg-yellow-500/10' :
                                            row.status === 'Low' ? 'border-orange-500/20 text-orange-400 bg-orange-500/10' :
                                            'border-red-500/20 text-red-400 bg-red-500/10'
                                        }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
