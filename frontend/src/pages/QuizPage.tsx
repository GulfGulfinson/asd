import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Quiz from '../components/Quiz';

const QuizPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const handleQuizComplete = (score: number, passed: boolean) => {
    // Handle quiz completion - just log it, let Quiz component show its own results
    console.log(`Quiz completed with score: ${score}%, passed: ${passed}`);
    
    // The Quiz component will handle showing the results screen with proper UI
    // No need for alerts here
  };

  const handleQuizClose = () => {
    navigate(`/lessons/${lessonId}`);
  };

  if (!lessonId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ungültige Lektion</h2>
          <p className="text-gray-600 mb-6">Die Lektions-ID ist ungültig.</p>
          <button onClick={() => navigate('/lessons')} className="btn-primary">
            Zurück zu den Lektionen
          </button>
        </div>
      </div>
    );
  }

  return (
    <Quiz
      lessonId={lessonId}
      onComplete={handleQuizComplete}
      onClose={handleQuizClose}
    />
  );
};

export default QuizPage; 