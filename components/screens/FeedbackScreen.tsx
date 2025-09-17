import React, { useState } from 'react';
// FIX: Import 'Screen' enum to use for type-safe navigation.
import { Screen, ScreenProps, FeedbackItem, TranscriptItem, InterviewHistoryItem } from '../../types';
import { GLOWS_DATA, GROWS_DATA, ANSWER_TRANSCRIPTS, INTERVIEW_HISTORY_DATA } from '../../constants';
import CompetencyChart from '../charts/CompetencyChart';
import FeedbackDoughnutChart from '../charts/FeedbackDoughnutChart';
import FeedbackModal from '../ui/FeedbackModal';
import ScoreChart from '../charts/ScoreChart';

const FeedbackCard: React.FC<{ item: FeedbackItem, color: string, trackColor: string, onReview: (reviewId: number) => void }> = ({ item, color, trackColor, onReview }) => (
    <div className="glass-card shadow-glass-glow p-4 flex items-center gap-4">
        <div className="w-24 h-24 flex-shrink-0">
            <FeedbackDoughnutChart score={item.score} color={color} trackColor={trackColor} />
        </div>
        <div className="flex-1">
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-sm text-slate-700 dark:text-slate-400 mb-2">{item.description}</p>
            <button onClick={() => onReview(item.reviewId)} className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300">
                Review Answer &rarr;
            </button>
        </div>
    </div>
);


const FeedbackScreen: React.FC<ScreenProps> = ({ navigate, theme, interviewData }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTranscript, setSelectedTranscript] = useState<TranscriptItem | null>(null);

    // Use passed data, or fallback to the latest interview if not provided (e.g., direct navigation)
    const interview = interviewData || INTERVIEW_HISTORY_DATA[0];

    const handleReview = (reviewId: number) => {
        const transcriptItem = ANSWER_TRANSCRIPTS[reviewId];
        if (transcriptItem) {
            setSelectedTranscript(transcriptItem);
            setIsModalVisible(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedTranscript(null);
    };

    const green = '#22c55e'; // green-500
    const yellow = '#eab308'; // yellow-500
    // FIX: Replaced invalid CSS variable with a working theme-aware color.
    const trackColor = theme === 'dark' ? 'hsla(0,0%,100%,0.1)' : 'hsla(0,0%,0%,0.05)';

    return (
        <>
            <FeedbackModal 
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                transcript={selectedTranscript?.transcript || ''}
                timestamp={selectedTranscript?.timestamp || ''}
            />
            <div className="p-4 md:p-8 h-full overflow-y-auto">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Feedback Report</h1>
                        <p className="text-slate-700 dark:text-slate-400">Session from {interview.date} - {interview.role}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        <div className="md:col-span-3 space-y-8">
                            <div>
                                <h2 className="text-xl font-bold mb-4">What Went Well (Glows)</h2>
                                <div className="space-y-4">
                                    {GLOWS_DATA.map(item => (
                                        <FeedbackCard key={item.reviewId} item={item} color={green} trackColor={trackColor} onReview={handleReview} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold mb-4">Areas for Improvement (Grows)</h2>
                                <div className="space-y-4">
                                    {GROWS_DATA.map(item => (
                                        <FeedbackCard key={item.reviewId} item={item} color={yellow} trackColor={trackColor} onReview={handleReview} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                             <div className="glass-card shadow-glass-glow p-6 sticky top-8">
                                <h2 className="text-xl font-bold mb-4 text-center">Overall Score</h2>
                                <div className="w-full h-64">
                                    <ScoreChart theme={theme!} score={interview.score} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="glass-card shadow-glass-glow p-6">
                        <h2 className="text-xl font-bold mb-4">Overall Competency Breakdown</h2>
                        <div className="w-full h-80">
                            <CompetencyChart theme={theme!} />
                        </div>
                    </div>

                    <div className="text-center pt-4">
                        {/* FIX: Changed string literal to Screen enum for type safety. */}
                        <button onClick={() => navigate(Screen.PracticeCenter)} className="btn-primary text-lg">
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FeedbackScreen;