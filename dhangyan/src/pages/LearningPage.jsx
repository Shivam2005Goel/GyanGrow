import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FinancialLiteracyLearning from '../FinancialLiteracyLearning';

const LearningPage = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </motion.button>
                    <h1 className="text-2xl font-bold">Financial Learning</h1>
                </div>
            </div>

            {/* Learning Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <FinancialLiteracyLearning user={user} />
            </div>
        </div>
    );
};

export default LearningPage;
