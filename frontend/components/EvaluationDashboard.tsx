import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { TrendingUp, TrendingDown, Minus, Award, Target, Lightbulb, RefreshCw } from 'lucide-react';

const API_URL = 'http://localhost:8002';

interface Evaluation {
    score: number;
    accuracy_percentage: number;
    feedback: string;
    key_points_covered: string[];
    missing_concepts: string[];
    strengths: string;
    improvements: string;
    raw_evaluation?: any;
}

interface DashboardData {
    overall_accuracy: number;
    question_scores: number[];
    strengths_summary: string;
    areas_for_improvement: string;
    performance_trend: string;
    recommendations: string[];
}

interface Props {
    evaluations: Evaluation[];
    onRestart: () => void;
}

const EvaluationDashboard: React.FC<Props> = ({ evaluations, onRestart }) => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await axios.post(`${API_URL}/generate-dashboard`, {
                    evaluations: evaluations
                });
                setDashboardData(res.data);
            } catch (error) {
                console.error('Failed to generate dashboard:', error);
                // Fallback to basic calculation
                const scores = evaluations.map(e => e.score);
                setDashboardData({
                    overall_accuracy: scores.reduce((a, b) => a + b, 0) / scores.length,
                    question_scores: scores,
                    strengths_summary: "Completed all questions",
                    areas_for_improvement: "Continue practicing",
                    performance_trend: "Consistent",
                    recommendations: ["Review course materials", "Practice more questions"]
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [evaluations]);

    if (loading || !dashboardData) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Generating your dashboard...</p>
                </div>
            </div>
        );
    }

    const getTrendIcon = () => {
        switch (dashboardData.performance_trend.toLowerCase()) {
            case 'improving':
                return <TrendingUp className="text-emerald-400" size={32} />;
            case 'declining':
                return <TrendingDown className="text-red-400" size={32} />;
            default:
                return <Minus className="text-cyan-400" size={32} />;
        }
    };

    const getGrade = (accuracy: number) => {
        if (accuracy >= 90) return { grade: 'A', color: 'text-emerald-400' };
        if (accuracy >= 80) return { grade: 'B', color: 'text-cyan-400' };
        if (accuracy >= 70) return { grade: 'C', color: 'text-yellow-400' };
        if (accuracy >= 60) return { grade: 'D', color: 'text-orange-400' };
        return { grade: 'F', color: 'text-red-400' };
    };

    const { grade, color } = getGrade(dashboardData.overall_accuracy);

    return (
        <div className="w-full max-w-6xl mx-auto p-4 space-y-4 max-h-[70vh] overflow-y-auto">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-1">
                    Evaluation Complete
                </h2>
                <p className="text-gray-400 text-sm">Here's your comprehensive performance analysis</p>
            </motion.div>


            {/* Overall Score Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass-panel p-6 rounded-2xl text-center relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10"></div>
                <div className="relative z-10">
                    <Award className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                    <h3 className="text-sm text-gray-400 mb-1 uppercase tracking-wider">Overall Accuracy</h3>
                    <div className={`text-5xl font-display font-black ${color} mb-2`}>
                        {Math.round(dashboardData.overall_accuracy)}%
                    </div>
                    <div className={`text-3xl font-bold ${color}`}>Grade: {grade}</div>
                </div>
            </motion.div>

            {/* Question Breakdown */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid md:grid-cols-3 gap-4"
            >
                {dashboardData.question_scores.map((score, i) => (
                    <div key={i} className="glass-panel p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400 font-bold text-sm">Question {i + 1}</span>
                            <Target className="text-cyan-400" size={20} />
                        </div>
                        <div className="text-3xl font-bold text-white mb-2">{score}%</div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000"
                                style={{ width: `${score}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Performance Trend */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-panel p-5 rounded-2xl"
            >
                <div className="flex items-center gap-3 mb-2">
                    {getTrendIcon()}
                    <div>
                        <h3 className="text-xl font-bold text-white">Performance Trend</h3>
                        <p className="text-gray-400 capitalize text-sm">{dashboardData.performance_trend}</p>
                    </div>
                </div>
            </motion.div>

            {/* Strengths & Improvements */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid md:grid-cols-2 gap-4"
            >
                <div className="glass-panel p-5 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <Award className="text-emerald-400" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Strengths</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm">{dashboardData.strengths_summary}</p>
                </div>

                <div className="glass-panel p-5 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                            <Target className="text-orange-400" size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-white">Areas for Improvement</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-sm">{dashboardData.areas_for_improvement}</p>
                </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-panel p-5 rounded-2xl"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="text-yellow-400" size={24} />
                    <h3 className="text-xl font-bold text-white">Personalized Recommendations</h3>
                </div>
                <ul className="space-y-2">
                    {dashboardData.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                            <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-cyan-400 text-xs font-bold">{i + 1}</span>
                            </span>
                            <span>{rec}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col md:flex-row gap-3"
            >
                <button
                    onClick={onRestart}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 text-black rounded-full font-bold text-base hover:bg-cyan-400 transition-colors"
                >
                    <RefreshCw size={20} />
                    <span>Start New Quiz</span>
                </button>
            </motion.div>

        </div>
    );
};

export default EvaluationDashboard;
