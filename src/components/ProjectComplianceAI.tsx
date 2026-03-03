'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import {
    Upload, FileText, CheckCircle, AlertTriangle, BarChart3,
    Download, TrendingUp, TrendingDown, Shield, Activity,
    Calendar, PieChart, Target, Award, Building2, GraduationCap,
    Users, BookOpen, Wifi, Printer, RefreshCw, Eye, ChevronRight,
    FileSpreadsheet, Database, Server, CloudUpload, Filter,
    Plus, X, Check, AlertCircle, ArrowUpRight, ArrowDownRight,
    Clock, Brain, Lightbulb, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Types
interface ComplianceData {
    id: string;
    category: string;
    parameter: string;
    value: number;
    target: number;
    weight: number;
    status: 'compliant' | 'partial' | 'non-compliant';
    lastUpdated: string;
}

interface UploadedFile {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadDate: string;
    status: 'processing' | 'analyzed' | 'error';
    records?: number;
}

interface QualityGap {
    id: string;
    area: string;
    currentScore: number;
    targetScore: number;
    gap: number;
    priority: 'high' | 'medium' | 'low';
    recommendations: string[];
}

interface Report {
    id: string;
    title: string;
    date: string;
    type: 'compliance' | 'quality' | 'gap' | 'comprehensive';
    status: 'draft' | 'ready' | 'sent';
}

// Glass Card Component
function GlassCard({ children, className = '', gradient = false, delay = 0 }: {
    children: React.ReactNode;
    className?: string;
    gradient?: boolean;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, type: 'spring' }}
            className={`relative overflow-hidden rounded-2xl backdrop-blur-xl border border-white/[0.06] ${gradient
                ? 'bg-gradient-to-br from-white/[0.08] to-white/[0.02]'
                : 'bg-white/[0.03]'
                } ${className}`}
        >
            {children}
        </motion.div>
    );
}

// Animated Counter
function AnimatedCounter({ value, suffix = '', prefix = '', duration = 1.5 }: {
    value: number;
    suffix?: string;
    prefix?: string;
    duration?: number;
}) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const animate = () => {
            const progress = Math.min((Date.now() - startTime) / (duration * 1000), 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(animate);
        };
        animate();
    }, [value, duration]);

    return <span>{prefix}{count}{suffix}</span>;
}

// Status Badge
function StatusBadge({ status }: { status: string }) {
    const styles = {
        compliant: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        partial: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        'non-compliant': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        processing: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        analyzed: 'bg-violet-500/20 text-violet-400 border-violet/30',
        error: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        draft: 'bg-white/10 text-white/60 border-white/20',
        ready: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        sent: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        high: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    };

    return (
        <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-full border ${styles[status as keyof typeof styles] || styles.draft}`}>
            {status.replace('-', ' ').toUpperCase()}
        </span>
    );
}

// Data Upload Module
function DataUploadModule({ onUpload }: { onUpload: (files: UploadedFile[]) => void }) {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        processFiles(droppedFiles);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            processFiles(selectedFiles);
        }
    };

    const processFiles = async (fileList: File[]) => {
        setUploading(true);
        const newFiles: UploadedFile[] = fileList.map((file, index) => ({
            id: `file-${Date.now()}-${index}`,
            name: file.name,
            type: file.type,
            size: file.size,
            uploadDate: new Date().toISOString(),
            status: 'processing',
            records: Math.floor(Math.random() * 5000) + 1000
        }));

        // Simulate processing
        setTimeout(() => {
            setFiles(prev => [...prev, ...newFiles.map(f => ({ ...f, status: 'analyzed' as const }))]);
            setUploading(false);
            onUpload(newFiles);
        }, 2000);
    };

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <GlassCard className="p-6" gradient>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Upload size={20} className="text-cyan-400" />
                        Data Upload Module
                    </h3>
                    <p className="text-xs text-white/40 mt-1">Upload institutional data for compliance analysis</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 text-xs rounded-lg transition-colors flex items-center gap-1.5">
                        <Database size={14} />
                        Import from DB
                    </button>
                    <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 text-xs rounded-lg transition-colors flex items-center gap-1.5">
                        <CloudUpload size={14} />
                        Cloud Sync
                    </button>
                </div>
            </div>

            {/* Drop Zone */}
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragActive
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-white/10 hover:border-white/20'
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    multiple
                    accept=".csv,.xlsx,.xls,.json,.pdf"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dragActive ? 'from-cyan-500 to-violet-500' : 'from-white/10 to-white/5'} flex items-center justify-center mb-4 transition-all`}>
                        {uploading ? (
                            <RefreshCw size={28} className="text-cyan-400 animate-spin" />
                        ) : (
                            <FileSpreadsheet size={28} className={dragActive ? 'text-white' : 'text-white/50'} />
                        )}
                    </div>
                    <p className="text-white/80 font-medium mb-1">
                        {uploading ? 'Processing files...' : 'Drag & drop files here'}
                    </p>
                    <p className="text-white/40 text-xs">
                        Supports CSV, Excel, JSON, PDF (Max 50MB)
                    </p>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="mt-6 space-y-3">
                    <h4 className="text-sm font-medium text-white/60 mb-3">Uploaded Files</h4>
                    {files.map((file, index) => (
                        <motion.div
                            key={file.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                    <FileSpreadsheet size={18} className="text-cyan-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-white/80 font-medium">{file.name}</p>
                                    <p className="text-xs text-white/40">{formatFileSize(file.size)} • {file.records?.toLocaleString()} records</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <StatusBadge status={file.status} />
                                <button
                                    onClick={() => removeFile(file.id)}
                                    className="text-white/30 hover:text-rose-400 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Data Categories */}
            <div className="mt-6 grid grid-cols-4 gap-3">
                {[
                    { icon: Building2, label: 'Infrastructure', count: 12, color: 'from-blue-500 to-cyan-500' },
                    { icon: GraduationCap, label: 'Academic', count: 28, color: 'from-violet-500 to-purple-500' },
                    { icon: Users, label: 'Faculty', count: 8, color: 'from-emerald-500 to-teal-500' },
                    { icon: BookOpen, label: 'Student Data', count: 15, color: 'from-amber-500 to-orange-500' }
                ].map((category, index) => (
                    <motion.button
                        key={category.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/[0.06] text-left transition-all group"
                    >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-2`}>
                            <category.icon size={14} className="text-white" />
                        </div>
                        <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">{category.label}</p>
                        <p className="text-lg font-bold text-white">{category.count}</p>
                    </motion.button>
                ))}
            </div>
        </GlassCard>
    );
}

// Compliance Scoring Component
function ComplianceScoring({ data }: { data: ComplianceData[] }) {
    const overallScore = useMemo(() => {
        if (data.length === 0) return 0;
        const weightedSum = data.reduce((acc, item) => {
            const score = (item.value / item.target) * 100;
            return acc + (score * item.weight);
        }, 0);
        const totalWeight = data.reduce((acc, item) => acc + item.weight, 0);
        return Math.round(weightedSum / totalWeight);
    }, [data]);

    const categoryScores = useMemo(() => {
        const categories = [...new Set(data.map(d => d.category))];
        return categories.map(cat => {
            const catData = data.filter(d => d.category === cat);
            const avg = catData.reduce((acc, d) => acc + (d.value / d.target) * 100, 0) / catData.length;
            return { category: cat, score: Math.round(avg) };
        });
    }, [data]);

    const radarData = useMemo(() => ({
        labels: categoryScores.map(c => c.category),
        datasets: [{
            label: 'Compliance Score',
            data: categoryScores.map(c => c.score),
            backgroundColor: 'rgba(6, 182, 212, 0.2)',
            borderColor: '#06b6d4',
            borderWidth: 2,
            pointBackgroundColor: '#06b6d4',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
        }]
    }), [categoryScores]);

    const complianceStats = useMemo(() => ({
        compliant: data.filter(d => d.status === 'compliant').length,
        partial: data.filter(d => d.status === 'partial').length,
        nonCompliant: data.filter(d => d.status === 'non-compliant').length,
    }), [data]);

    return (
        <GlassCard className="p-6" gradient>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Shield size={20} className="text-emerald-400" />
                        Compliance Scoring
                    </h3>
                    <p className="text-xs text-white/40 mt-1">BIS-aligned quality compliance evaluation</p>
                </div>
                <button className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs rounded-lg transition-colors flex items-center gap-1.5">
                    <RefreshCw size={14} />
                    Recalculate
                </button>
            </div>

            {/* Overall Score */}
            <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="8"
                            fill="none"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke={overallScore >= 80 ? '#10b981' : overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${(overallScore / 100) * 352} 352`}
                            className="transition-all duration-1000"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-black text-white">{overallScore}%</span>
                        <span className="text-xs text-white/40">Overall</span>
                    </div>
                </div>

                <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-emerald-400" />
                            <span className="text-sm text-white/80">Compliant</span>
                        </div>
                        <span className="text-lg font-bold text-emerald-400">{complianceStats.compliant}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={16} className="text-amber-400" />
                            <span className="text-sm text-white/80">Partial</span>
                        </div>
                        <span className="text-lg font-bold text-amber-400">{complianceStats.partial}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={16} className="text-rose-400" />
                            <span className="text-sm text-white/80">Non-Compliant</span>
                        </div>
                        <span className="text-lg font-bold text-rose-400">{complianceStats.nonCompliant}</span>
                    </div>
                </div>
            </div>

            {/* Radar Chart */}
            <div className="h-48">
                <Radar
                    data={radarData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                beginAtZero: true,
                                max: 100,
                                ticks: { display: false },
                                grid: { color: 'rgba(255,255,255,0.1)' },
                                angleLines: { color: 'rgba(255,255,255,0.1)' },
                                pointLabels: { color: 'rgba(255,255,255,0.6)', font: { size: 10 } }
                            }
                        },
                        plugins: {
                            legend: { display: false }
                        }
                    }}
                />
            </div>

            {/* Parameter List */}
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                {data.slice(0, 6).map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-2 hover:bg-white/[0.02] rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                            <StatusBadge status={item.status} />
                            <span className="text-xs text-white/60">{item.parameter}</span>
                        </div>
                        <span className="text-xs font-medium text-white/80">{item.value}/{item.target}</span>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}

// Quality Gap Analysis Component
function QualityGapAnalysis({ gaps }: { gaps: QualityGap[] }) {
    const gapChartData = useMemo(() => ({
        labels: gaps.map(g => g.area),
        datasets: [{
            label: 'Current Score',
            data: gaps.map(g => g.currentScore),
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
            borderColor: '#ef4444',
            borderWidth: 1,
            borderRadius: 6,
        }, {
            label: 'Target Score',
            data: gaps.map(g => g.targetScore),
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: '#10b981',
            borderWidth: 1,
            borderRadius: 6,
        }]
    }), [gaps]);

    const highPriorityGaps = gaps.filter(g => g.priority === 'high');
    const totalGap = gaps.reduce((acc, g) => acc + g.gap, 0);

    return (
        <GlassCard className="p-6" gradient>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Target size={20} className="text-amber-400" />
                        Quality Gap Analysis
                    </h3>
                    <p className="text-xs text-white/40 mt-1">Identify areas requiring immediate attention</p>
                </div>
                <button className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs rounded-lg transition-colors flex items-center gap-1.5">
                    <Lightbulb size={14} />
                    AI Insights
                </button>
            </div>

            {/* Gap Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.06] text-center">
                    <p className="text-2xl font-black text-white">{gaps.length}</p>
                    <p className="text-xs text-white/40">Total Gaps</p>
                </div>
                <div className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/20 text-center">
                    <p className="text-2xl font-black text-rose-400">{highPriorityGaps.length}</p>
                    <p className="text-xs text-rose-400/60">High Priority</p>
                </div>
                <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20 text-center">
                    <p className="text-2xl font-black text-amber-400">-{totalGap}%</p>
                    <p className="text-xs text-amber-400/60">Total Gap</p>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="h-48">
                <Bar
                    data={gapChartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        scales: {
                            x: {
                                beginAtZero: true,
                                max: 100,
                                grid: { color: 'rgba(255,255,255,0.05)' },
                                ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } }
                            },
                            y: {
                                grid: { display: false },
                                ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 10 } }
                            }
                        },
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: { color: 'rgba(255,255,255,0.6)', font: { size: 10 }, boxWidth: 12 }
                            }
                        }
                    }}
                />
            </div>

            {/* Gap Details */}
            <div className="mt-4 space-y-2">
                {gaps.map((gap) => (
                    <motion.div
                        key={gap.id}
                        whileHover={{ scale: 1.01 }}
                        className="p-3 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl border border-white/[0.04] transition-all cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <StatusBadge status={gap.priority} />
                                <span className="text-sm text-white/80 font-medium">{gap.area}</span>
                            </div>
                            <span className={`text-xs font-bold flex items-center gap-1 ${gap.gap > 20 ? 'text-rose-400' : gap.gap > 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {gap.gap > 0 ? <ArrowDownRight size={12} /> : <ArrowUpRight size={12} />}
                                {Math.abs(gap.gap)}%
                            </span>
                        </div>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full" style={{ width: `${gap.currentScore}%` }} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </GlassCard>
    );
}

// Automated Reports Component
function AutomatedReports({ reports }: { reports: Report[] }) {
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    const reportTypes = [
        { type: 'compliance', label: 'Compliance Reports', icon: Shield, color: 'from-emerald-500 to-teal-500' },
        { type: 'quality', label: 'Quality Reports', icon: Award, color: 'from-violet-500 to-purple-500' },
        { type: 'gap', label: 'Gap Analysis', icon: TrendingDown, color: 'from-amber-500 to-orange-500' },
        { type: 'comprehensive', label: 'Comprehensive', icon: FileText, color: 'from-cyan-500 to-blue-500' },
    ];

    return (
        <GlassCard className="p-6" gradient>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <FileText size={20} className="text-violet-400" />
                        Automated Reports
                    </h3>
                    <p className="text-xs text-white/40 mt-1">Generate and download compliance reports</p>
                </div>
                <button className="px-3 py-1.5 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 text-xs rounded-lg transition-colors flex items-center gap-1.5">
                    <Plus size={14} />
                    New Report
                </button>
            </div>

            {/* Report Type Buttons */}
            <div className="grid grid-cols-4 gap-3 mb-6">
                {reportTypes.map((rt) => (
                    <motion.button
                        key={rt.type}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="p-3 bg-white/[0.03] hover:bg-white/[0.06] rounded-xl border border-white/[0.06] text-center transition-all group"
                    >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rt.color} flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                            <rt.icon size={18} className="text-white" />
                        </div>
                        <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">{rt.label}</p>
                    </motion.button>
                ))}
            </div>

            {/* Report List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
                {reports.map((report, index) => (
                    <motion.div
                        key={report.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedReport(report)}
                        className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl border border-white/[0.04] cursor-pointer transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                                <FileText size={18} className="text-violet-400" />
                            </div>
                            <div>
                                <p className="text-sm text-white/80 font-medium">{report.title}</p>
                                <p className="text-xs text-white/40 flex items-center gap-2">
                                    <Calendar size={10} />
                                    {report.date}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <StatusBadge status={report.status} />
                            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
                                <Eye size={14} className="text-white/40 group-hover:text-white/70" />
                            </button>
                            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
                                <Download size={14} className="text-white/40 group-hover:text-white/70" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-white/40">
                    <Printer size={12} />
                    <span>Auto-schedule reports</span>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs rounded-lg transition-colors">
                        Weekly
                    </button>
                    <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs rounded-lg transition-colors">
                        Monthly
                    </button>
                </div>
            </div>
        </GlassCard>
    );
}

// AI Insights Panel
function AIInsightsPanel() {
    const insights = [
        { type: 'positive', text: 'Infrastructure compliance improved by 12% this quarter', icon: TrendingUp },
        { type: 'warning', text: 'Faculty-student ratio below BIS standards (1:20 vs 1:15)', icon: AlertTriangle },
        { type: 'action', text: 'Library resources need immediate upgrade - 40% gap identified', icon: Lightbulb },
        { type: 'success', text: 'Academic performance metrics exceed target by 8%', icon: CheckCircle },
    ];

    return (
        <GlassCard className="p-6" gradient>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Brain size={20} className="text-cyan-400" />
                        AI Compliance Insights
                    </h3>
                    <p className="text-xs text-white/40 mt-1">Intelligent analysis & recommendations</p>
                </div>
                <div className="px-3 py-1 bg-cyan-500/20 rounded-full flex items-center gap-1.5">
                    <Zap size={12} className="text-cyan-400" />
                    <span className="text-xs text-cyan-400 font-medium">Live</span>
                </div>
            </div>

            <div className="space-y-3">
                {insights.map((insight, index) => {
                    const bgClass = insight.type === 'positive' ? 'bg-emerald-500/10 border-emerald-500/20' :
                        insight.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20' :
                            insight.type === 'success' ? 'bg-cyan-500/10 border-cyan-500/20' :
                                'bg-violet-500/10 border-violet-500/20';
                    const iconBgClass = insight.type === 'positive' ? 'bg-emerald-500/20' :
                        insight.type === 'warning' ? 'bg-amber-500/20' :
                            insight.type === 'success' ? 'bg-cyan-500/20' :
                                'bg-violet-500/20';
                    const iconColorClass = insight.type === 'positive' ? 'text-emerald-400' :
                        insight.type === 'warning' ? 'text-amber-400' :
                            insight.type === 'success' ? 'text-cyan-400' :
                                'text-violet-400';

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className={`p-4 rounded-xl border ${bgClass}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBgClass}`}>
                                    <insight.icon size={14} className={iconColorClass} />
                                </div>
                                <p className="text-sm text-white/80 flex-1">{insight.text}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <button className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <Brain size={16} />
                Generate Full Analysis
            </button>
        </GlassCard>
    );
}

// Main Component
export default function ProjectComplianceAI() {
    // Mock Data
    const [complianceData] = useState<ComplianceData[]>([
        { id: '1', category: 'Infrastructure', parameter: 'Library Area (sq ft per student)', value: 85, target: 100, weight: 0.15, status: 'partial', lastUpdated: '2024-01-15' },
        { id: '2', category: 'Infrastructure', parameter: 'Laboratory Equipment', value: 95, target: 100, weight: 0.15, status: 'compliant', lastUpdated: '2024-01-15' },
        { id: '3', category: 'Academic', parameter: 'Faculty Qualification (PhD %)', value: 75, target: 80, weight: 0.2, status: 'partial', lastUpdated: '2024-01-14' },
        { id: '4', category: 'Academic', parameter: 'Student-Teacher Ratio', value: 18, target: 15, weight: 0.2, status: 'non-compliant', lastUpdated: '2024-01-14' },
        { id: '5', category: 'Administration', parameter: 'Administrative Staff Ratio', value: 92, target: 100, weight: 0.1, status: 'compliant', lastUpdated: '2024-01-13' },
        { id: '6', category: 'Facilities', parameter: 'Sports Infrastructure', value: 70, target: 100, weight: 0.1, status: 'partial', lastUpdated: '2024-01-13' },
        { id: '7', category: 'Facilities', parameter: 'IT Infrastructure', value: 88, target: 100, weight: 0.1, status: 'compliant', lastUpdated: '2024-01-12' },
    ]);

    const [qualityGaps] = useState<QualityGap[]>([
        { id: '1', area: 'Faculty-Student Ratio', currentScore: 65, targetScore: 85, gap: 20, priority: 'high', recommendations: ['Hire additional faculty', 'Reduce batch sizes'] },
        { id: '2', area: 'Library Resources', currentScore: 55, targetScore: 90, gap: 35, priority: 'high', recommendations: ['Increase book inventory', 'Subscribe to digital libraries'] },
        { id: '3', area: 'Sports Facilities', currentScore: 70, targetScore: 85, gap: 15, priority: 'medium', recommendations: ['Upgrade sports equipment', 'Expand indoor area'] },
        { id: '4', area: 'Research Output', currentScore: 75, targetScore: 90, gap: 15, priority: 'medium', recommendations: ['Increase research funding', 'Encourage publications'] },
        { id: '5', area: 'Digital Learning', currentScore: 88, targetScore: 95, gap: 7, priority: 'low', recommendations: ['Upgrade LMS', 'Add more online courses'] },
    ]);

    const [reports] = useState<Report[]>([
        { id: '1', title: 'Q4 2023 Compliance Report', date: '2024-01-10', type: 'compliance', status: 'ready' },
        { id: '2', title: 'Annual Quality Assessment', date: '2024-01-08', type: 'quality', status: 'ready' },
        { id: '3', title: 'Infrastructure Gap Analysis', date: '2024-01-05', type: 'gap', status: 'ready' },
        { id: '4', title: 'Comprehensive BIS Audit', date: '2023-12-20', type: 'comprehensive', status: 'sent' },
        { id: '5', title: 'Monthly Compliance Check', date: '2023-12-15', type: 'compliance', status: 'draft' },
    ]);

    const handleUpload = (files: UploadedFile[]) => {
        console.log('Files uploaded:', files);
    };

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                            <Shield size={20} className="text-white" />
                        </div>
                        Project Compliance-AI
                    </h1>
                    <p className="text-white/40 mt-1">BIS-Aligned Institutional Quality & Compliance Monitoring</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                        <Calendar size={14} className="text-white/40" />
                        <span className="text-sm text-white/60">Last Updated: Jan 15, 2024</span>
                    </div>
                    <button className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 text-sm rounded-xl transition-colors flex items-center gap-2">
                        <RefreshCw size={14} />
                        Sync Data
                    </button>
                </div>
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Overall Compliance', value: 78, suffix: '%', icon: Shield, color: 'from-emerald-500 to-teal-500', change: '+5%' },
                    { label: 'Parameters Analyzed', value: 47, icon: BarChart3, color: 'from-cyan-500 to-blue-500', change: '+12' },
                    { label: 'Quality Score', value: 72, suffix: '%', icon: Award, color: 'from-violet-500 to-purple-500', change: '+8%' },
                    { label: 'Reports Generated', value: 23, icon: FileText, color: 'from-amber-500 to-orange-500', change: '+4' },
                ].map((stat, index) => (
                    <GlassCard key={stat.label} delay={index * 0.1} className="p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                <stat.icon size={18} className="text-white" />
                            </div>
                            <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-2xl font-black text-white">{stat.value}{stat.suffix || ''}</p>
                        <p className="text-xs text-white/40 mt-1">{stat.label}</p>
                    </GlassCard>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-2 gap-6">
                <DataUploadModule onUpload={handleUpload} />
                <AIInsightsPanel />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <ComplianceScoring data={complianceData} />
                <QualityGapAnalysis gaps={qualityGaps} />
            </div>

            <AutomatedReports reports={reports} />
        </div>
    );
}
