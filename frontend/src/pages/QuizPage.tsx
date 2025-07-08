import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Quiz from '../components/Quiz';

const QuizPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();

  const handleQuizComplete = (score: number, passed: boolean) => {
    // Handle quiz completion
    console.log(`Quiz completed with score: ${score}%, passed: ${passed}`);
    
    // Show completion message
    if (passed) {
      alert(`🎉 Herzlichen Glückwunsch!\n\nSie haben das Quiz mit ${score}% bestanden!\n\nIn der vollständigen App würde hier:\n• Der Fortschritt gespeichert\n• Badges vergeben\n• Zum nächsten Thema navigiert`);
    } else {
      alert(`📚 Nicht bestanden\n\nSie haben ${score}% erreicht.\n\nTipp: Wiederholen Sie die Lektion und versuchen Sie es erneut!`);
    }
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