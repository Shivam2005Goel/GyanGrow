import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Wallet, TrendingUp, PiggyBank, ArrowRight, Save, RotateCcw } from 'lucide-react';
import { GlassCard, AnimatedButton, SectionTitle, StatCard } from '../ui';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetPlanner = () => {
    const navigate = useNavigate();
    const [income, setIncome] = useState(50000);
    const [needs, setNeeds] = useState(50);
    const [wants, setWants] = useState(30);
    const [savings, setSavings] = useState(20);

    // Auto-balance logic
    const handleSliderChange = (type, value) => {
        if (type === 'needs') {
            setNeeds(value);
            const remaining = 100 - value;
            setWants(remaining * 0.6); // Split remaining roughly 60/40
            setSavings(remaining * 0.4);
        } else if (type === 'wants') {
            setWants(value);
            const remaining = 100 - value - needs;
            if (remaining >= 0) setSavings(remaining);
        }
    };

    const data = {
        labels: ['Needs (Essentials)', 'Wants (Lifestyle)', 'Savings (Future)'],
        datasets: [
            {
                data: [needs, wants, savings],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)', // Red for Needs
                    'rgba(59, 130, 246, 0.8)', // Blue for Wants
                    'rgba(16, 185, 129, 0.8)', // Green for Savings
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: 'white' }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
            <AnimatedButton variant="ghost" onClick={() => navigate('/')} className="mb-6">
                &larr; Back to Home
            </AnimatedButton>

            <SectionTitle title="Interactive Budget Planner" subtitle="Master the 50/30/20 Rule" />

            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="space-y-6">
                    <GlassCard>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Wallet className="text-purple-400" /> Monthly Income
                        </h3>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold">₹</span>
                            <input
                                type="number"
                                value={income}
                                onChange={(e) => setIncome(Number(e.target.value))}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xl font-mono focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h3 className="text-xl font-bold mb-6">Allocation (50/30/20 Rule)</h3>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-red-400 font-medium">Needs ({Number(needs).toFixed(0)}%)</span>
                                    <span>₹{((income * needs) / 100).toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={needs}
                                    onChange={(e) => handleSliderChange('needs', Number(e.target.value))}
                                    className="w-full accent-red-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <p className="text-xs text-gray-400 mt-1">Rent, groceries, utilities</p>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-blue-400 font-medium">Wants ({Number(wants).toFixed(0)}%)</span>
                                    <span>₹{((income * wants) / 100).toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={100 - needs}
                                    value={wants}
                                    onChange={(e) => handleSliderChange('wants', Number(e.target.value))}
                                    className="w-full accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <p className="text-xs text-gray-400 mt-1">Dining out, hobbies, entertainment</p>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-green-400 font-medium">Savings ({Number(savings).toFixed(0)}%)</span>
                                    <span>₹{((income * savings) / 100).toLocaleString()}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-700 rounded-lg overflow-hidden">
                                    <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${savings}%` }} />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Investments, emergency fund</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* Chart & Insights */}
                <div className="space-y-6">
                    <GlassCard className="flex items-center justify-center min-h-[400px]">
                        <div className="w-full max-w-sm">
                            <Pie data={data} options={options} />
                        </div>
                    </GlassCard>

                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            title="Annual Savings"
                            value={`₹${((income * savings * 12) / 100).toLocaleString()}`}
                            icon={PiggyBank}
                            color="green"
                            trend={12}
                        />
                        <StatCard
                            title="Discretionary"
                            value={`₹${((income * wants) / 100).toLocaleString()}`}
                            icon={TrendingUp}
                            color="blue"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetPlanner;
