import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Upload, FileText, Loader2, Mic, MicOff, CheckCircle, AlertCircle } from 'lucide-react';
import EvaluationDashboard from './EvaluationDashboard';

const API_URL = 'http://localhost:8002';

// Speech recognition setup
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;

if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
}

interface Evaluation {
    score: number;
    accuracy_percentage: number;
    feedback: string;
    key_points_covered: string[];
    missing_concepts: string[];
    strengths: string;
    improvements: string;
}

const ConversationalDashboard: React.FC = () => {
    // State management
    const [step, setStep] = useState(1); // 1: Upload, 2: Select Topic, 3: Q&A Loop, 4: Final Dashboard
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Document data
    const [pdfText, setPdfText] = useState('');
    const [topics, setTopics] = useState<string[]>([]);
    const [summary, setSummary] = useState('');

    // Quiz configuration
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState('Medium');

    // Question-Answer loop
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

    // Speech-to-text
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');

    // Step 1: Upload PDF
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Upload PDF
            const uploadRes = await axios.post(`${API_URL}/upload`, formData);
            const text = uploadRes.data.text;
            setPdfText(text);

            // Analyze document
            const analyzeRes = await axios.post(`${API_URL}/analyze-document`, { text });
            setTopics(analyzeRes.data.topics);
            setSummary(analyzeRes.data.summary);
            setSelectedDifficulty(analyzeRes.data.suggested_difficulty);

            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to process PDF");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Start Quiz
    const startQuiz = async () => {
        if (!selectedTopic) {
            setError("Please select a topic");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await axios.post(`${API_URL}/generate-question`, {
                context: pdfText,
                topic: selectedTopic,
                difficulty: selectedDifficulty,
                question_number: 1
            });

            setCurrentQuestion(res.data.question);
            setCurrentQuestionNumber(1);
            setStep(3);
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to generate question");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Submit Answer
    const submitAnswer = async () => {
        if (!currentAnswer.trim()) {
            setError("Please provide an answer");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await axios.post(`${API_URL}/evaluate`, {
                context: pdfText,
                question: currentQuestion,
                student_answer: currentAnswer
            });

            const evaluation: Evaluation = res.data;
            setEvaluations([...evaluations, evaluation]);

            // Check if we need more questions
            if (currentQuestionNumber < 3) {
                // Generate next question
                const nextRes = await axios.post(`${API_URL}/generate-question`, {
                    context: pdfText,
                    topic: selectedTopic,
                    difficulty: selectedDifficulty,
                    question_number: currentQuestionNumber + 1
                });

                setCurrentQuestion(nextRes.data.question);
                setCurrentQuestionNumber(currentQuestionNumber + 1);
                setCurrentAnswer('');
                setTranscript('');
            } else {
                // All questions done, move to dashboard
                setStep(4);
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || "Failed to evaluate answer");
        } finally {
            setLoading(false);
        }
    };

    // Speech-to-text handlers
    const startRecording = () => {
        if (!recognition) {
            setError("Speech recognition not supported in this browser");
            return;
        }

        setIsRecording(true);
        setTranscript('');

        recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const transcriptText = event.results[current][0].transcript;
            setTranscript(transcriptText);
            setCurrentAnswer(transcriptText);
        };

        recognition.onerror = (event: any) => {
            setError(`Speech recognition error: ${event.error}`);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start();
    };

    const stopRecording = () => {
        if (recognition) {
            recognition.stop();
        }
        setIsRecording(false);
    };

    // Restart quiz
    const handleRestart = () => {
        setStep(1);
        setPdfText('');
        setTopics([]);
        setSummary('');
        setSelectedTopic('');
        setSelectedDifficulty('Medium');
        setCurrentQuestionNumber(1);
        setCurrentQuestion('');
        setCurrentAnswer('');
        setEvaluations([]);
        setError(null);
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-6 z-10 relative">

            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-display font-bold text-white">
                    {step === 1 && "Upload Material"}
                    {step === 2 && "Select Topic"}
                    {step === 3 && `Question ${currentQuestionNumber}/3`}
                    {step === 4 && "Results"}
                </h2>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((s) => (
                        <div
                            key={s}
                            className={`h-2 w-12 rounded-full transition-all duration-500 ${step >= s ? 'bg-cyan-500 shadow-neon' : 'bg-white/10'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Main Card */}
            {step !== 4 && (
                <div className="glass-panel rounded-3xl p-8 md:p-12 min-h-[500px] relative overflow-hidden">
                    <AnimatePresence mode="wait">

                        {/* Step 1: Upload */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="h-full flex flex-col items-center justify-center text-center"
                            >
                                <div className="w-20 h-20 bg-surface border-2 border-cyan-500 rounded-full flex items-center justify-center mb-8 shadow-neon">
                                    <Upload size={40} className="text-cyan-400" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">Upload Course Material</h3>
                                <p className="text-gray-400 mb-10 max-w-md text-lg">
                                    Upload a PDF to begin. The AI will analyze the content and generate questions.
                                </p>
                                <label className="group bg-cyan-500 text-black px-10 py-4 rounded-full font-bold text-lg cursor-pointer hover:bg-cyan-400 transition-colors flex items-center gap-3">
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : <FileText size={24} />}
                                    <span>{loading ? "Processing..." : "Select PDF"}</span>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                        disabled={loading}
                                    />
                                </label>
                                {error && <p className="text-red-400 mt-6 font-bold">{error}</p>}
                            </motion.div>
                        )}

                        {/* Step 2: Topic Selection */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="h-full flex flex-col max-w-2xl mx-auto"
                            >
                                <h3 className="text-2xl font-bold text-white mb-4">Document Analyzed</h3>
                                <p className="text-gray-300 mb-8">{summary}</p>

                                <div className="space-y-6 mb-8">
                                    <div>
                                        <label className="block text-sm text-cyan-400 font-bold uppercase tracking-wider mb-3">Select Topic</label>
                                        <select
                                            value={selectedTopic}
                                            onChange={(e) => setSelectedTopic(e.target.value)}
                                            className="w-full bg-black/50 border-2 border-white/10 rounded-xl p-4 text-white text-lg outline-none focus:border-cyan-500 transition-colors"
                                        >
                                            <option value="">Choose a topic...</option>
                                            {topics.map((topic, i) => (
                                                <option key={i} value={topic}>{topic}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-cyan-400 font-bold uppercase tracking-wider mb-3">Difficulty Level</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {['Easy', 'Medium', 'Hard'].map((diff) => (
                                                <button
                                                    key={diff}
                                                    onClick={() => setSelectedDifficulty(diff)}
                                                    className={`p-4 rounded-xl font-bold transition-all ${selectedDifficulty === diff
                                                        ? 'bg-cyan-500 text-black shadow-neon'
                                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {diff}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={startQuiz}
                                    disabled={loading || !selectedTopic}
                                    className="w-full bg-cyan-500 text-black py-5 rounded-xl font-bold text-xl hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin inline" /> : "Start Quiz"}
                                </button>
                                {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                            </motion.div>
                        )}

                        {/* Step 3: Q&A Loop */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="h-full flex flex-col max-h-[80vh]"
                            >
                                <div className="mb-4 p-6 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 max-h-[30vh] overflow-y-auto">
                                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 block">
                                        Question {currentQuestionNumber}/3 • {selectedDifficulty}
                                    </span>
                                    <p className="text-lg leading-relaxed text-white">{currentQuestion}</p>
                                </div>

                                <div className="flex-1 mb-4 min-h-0">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm text-gray-400 font-bold uppercase">Your Answer</label>
                                        <button
                                            onClick={isRecording ? stopRecording : startRecording}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${isRecording
                                                ? 'bg-red-500 text-white animate-pulse'
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                }`}
                                        >
                                            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                                            {isRecording ? 'Stop Recording' : 'Voice Answer'}
                                        </button>
                                    </div>
                                    <textarea
                                        value={currentAnswer}
                                        onChange={(e) => setCurrentAnswer(e.target.value)}
                                        placeholder="Type your answer or use voice input..."
                                        className="w-full h-full min-h-[200px] max-h-[300px] bg-black/50 border-2 border-white/10 rounded-xl p-6 text-white text-lg outline-none focus:border-cyan-500 resize-none"
                                    />
                                    {transcript && (
                                        <p className="text-sm text-cyan-400 mt-2">Transcribed: {transcript}</p>
                                    )}
                                </div>

                                <button
                                    onClick={submitAnswer}
                                    disabled={loading || !currentAnswer.trim()}
                                    className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 flex-shrink-0"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle size={24} />}
                                    <span>{loading ? "Evaluating..." : "Submit Answer"}</span>
                                </button>

                                {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            )}

            {/* Step 4: Full Dashboard */}
            {step === 4 && (
                <EvaluationDashboard evaluations={evaluations} onRestart={handleRestart} />
            )}
        </div>
    );
};

export default ConversationalDashboard;
