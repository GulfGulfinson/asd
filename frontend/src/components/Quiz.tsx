import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { completeQuiz } from '../store/slices/progressSlice';
import { fetchQuizByLessonId, submitQuizAttempt, resetQuiz, setUserAnswer, nextQuestion, previousQuestion, startQuiz, showQuizResults, decrementTime } from '../store/slices/quizSlice';
import { Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight, RotateCcw, Trophy, Target, CheckCircle2 } from 'lucide-react';

interface QuizProps {
  lessonId: string;
  onComplete?: (score: number, passed: boolean) => void;
  onClose?: () => void;
}

const Quiz: React.FC<QuizProps> = ({ lessonId, onComplete, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const { 
    currentQuiz, 
    currentAttempt, 
    userAnswers, 
    currentQuestionIndex, 
    timeRemaining, 
    loading, 
    error, 
    isSubmitting, 
    showResults 
  } = useSelector((state: RootState) => state.quiz);
  
  // Local state
  const [quizStarted, setQuizStarted] = useState(false);
  const [startTime] = useState(new Date());

  // Load quiz data when component mounts
  useEffect(() => {
    dispatch(resetQuiz());
    dispatch(fetchQuizByLessonId(lessonId));
  }, [dispatch, lessonId]);

  // Start the quiz timer when quiz starts
  useEffect(() => {
    if (quizStarted && currentQuiz) {
      dispatch(startQuiz());
    }
  }, [quizStarted, currentQuiz, dispatch]);

  // Define handleSubmitQuiz with useCallback to use in useEffect dependencies
  const handleSubmitQuiz = useCallback(async () => {
    if (!currentQuiz) return;

    // Calculate time spent
    const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    
    // Prepare answers for submission - backend expects selectedAnswer and timeSpent by index
    const answers = currentQuiz.questions.map((question, index) => ({
      selectedAnswer: userAnswers[index] || '',
      timeSpent: Math.floor(timeSpent / currentQuiz.questions.length) // Average time per question
    }));

    try {
      await dispatch(submitQuizAttempt({ quizId: currentQuiz._id, answers }));
      dispatch(showQuizResults());
      
      // Complete quiz in progress slice
      dispatch(completeQuiz({
        lessonId: lessonId,
        score: currentAttempt?.score || 0,
        passed: currentAttempt?.passed || false,
        timeSpent: timeSpent
      }));
      
      // Save progress
      // dispatch(saveProgress()); // Removed as per edit hint
      
      // Call onComplete callback
      if (onComplete && currentAttempt) {
        onComplete(currentAttempt.score, currentAttempt.passed);
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  }, [currentQuiz, startTime, userAnswers, dispatch, lessonId, currentAttempt, onComplete]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (quizStarted && !showResults && timeRemaining > 0 && currentQuiz?.timeLimit) {
      interval = setInterval(() => {
        dispatch(decrementTime());
        if (timeRemaining <= 1) {
          handleSubmitQuiz();
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizStarted, showResults, timeRemaining, currentQuiz?.timeLimit, handleSubmitQuiz, dispatch]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (answerIndex: string) => {
    dispatch(setUserAnswer({ questionIndex: currentQuestionIndex, answer: answerIndex }));
  };

  const handleNextQuestion = () => {
    dispatch(nextQuestion());
  };

  const handlePreviousQuestion = () => {
    dispatch(previousQuestion());
  };

  const calculateScore = () => {
    if (!currentQuiz) return { score: 0, correctAnswers: 0 };
    
    let correctCount = 0;
    const totalQuestions = currentQuiz.questions.length;
    
    currentQuiz.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      if (userAnswer && userAnswer === question.correctAnswer.toString()) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / totalQuestions) * 100);
    return { score, correctAnswers: correctCount };
  };

  const handleRetakeQuiz = () => {
    dispatch(resetQuiz());
    setQuizStarted(false);
    dispatch(fetchQuizByLessonId(lessonId));
  };

  const handleBackToLesson = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(`/lessons/${lessonId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Quiz wird geladen...</p>
        </div>
      </div>
    );
  }

  if (error || !currentQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz nicht gefunden</h2>
          <p className="text-gray-600 mb-6">
            {error || 'Für diese Lektion ist kein Quiz verfügbar.'}
          </p>
          <button onClick={handleBackToLesson} className="btn-primary">
            Zurück zur Lektion
          </button>
        </div>
      </div>
    );
  }

  // Show results screen
  if (showResults && currentAttempt) {
    const { score } = calculateScore();
    const actualScore = currentAttempt.score || score;
    const actualCorrect = Math.round((actualScore / 100) * currentQuiz.questions.length);
    const passed = actualScore >= currentQuiz.passingScore;

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Results Header */}
            <div className={`px-8 py-12 text-center ${passed ? 'bg-green-50 border-b-4 border-green-500' : 'bg-red-50 border-b-4 border-red-500'}`}>
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${passed ? 'bg-green-500' : 'bg-red-500'}`}>
                {passed ? (
                  <Trophy className="h-12 w-12 text-white" />
                ) : (
                  <Target className="h-12 w-12 text-white" />
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {passed ? 'Gratulation! 🎉' : 'Nicht bestanden'}
              </h1>
              
              <p className="text-lg text-gray-600 mb-6">
                {passed 
                  ? 'Du hast das Quiz erfolgreich bestanden!' 
                  : `Du benötigst ${currentQuiz.passingScore}% zum Bestehen.`
                }
              </p>
              
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {actualScore}%
              </div>
              
              <p className="text-gray-600 mb-6">
                {actualCorrect} von {currentQuiz.questions.length} Fragen richtig
              </p>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{actualScore}%</div>
                  <div className="text-sm text-gray-500">Erreichte Punkte</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">{actualCorrect}</div>
                  <div className="text-sm text-gray-500">Richtige Antworten</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-gray-600">{Math.floor(currentAttempt.timeSpent / 60)}:{String(currentAttempt.timeSpent % 60).padStart(2, '0')}</div>
                  <div className="text-sm text-gray-500">Benötigte Zeit</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">{currentQuiz.passingScore}%</div>
                  <div className="text-sm text-gray-500">Bestehensgrenze</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${passed ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(actualScore, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0%</span>
                  <span className="font-medium">{currentQuiz.passingScore}% (Bestehen)</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="px-8 py-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Deine Antworten im Detail</h3>
              
              <div className="space-y-4">
                {currentQuiz.questions.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer.toString();
                  
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                          {isCorrect ? (
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          ) : (
                            <XCircle className="h-4 w-4 text-white" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">
                            Frage {index + 1}: {question.question}
                          </h4>
                          
                          {question.options && (
                            <div className="space-y-2">
                              {question.options.map((option, optionIndex) => {
                                const isSelected = userAnswer === optionIndex.toString();
                                const isCorrectOption = question.correctAnswer.toString() === optionIndex.toString();
                                
                                return (
                                  <div
                                    key={optionIndex}
                                    className={`p-3 rounded text-sm ${
                                      isCorrectOption
                                        ? 'bg-green-100 text-green-800 border border-green-300'
                                        : isSelected
                                        ? 'bg-red-100 text-red-800 border border-red-300'
                                        : 'bg-gray-50 text-gray-600'
                                    }`}
                                  >
                                    <span className="font-medium">
                                      {String.fromCharCode(65 + optionIndex)}.
                                    </span>{' '}
                                    {option}
                                    {isCorrectOption && ' ✓ (Richtige Antwort)'}
                                    {isSelected && !isCorrectOption && ' ✗ (Deine Antwort)'}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          
                          {question.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>💡 Erklärung:</strong> {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-8 py-6 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-center">
              {!passed && (
                <button
                  onClick={handleRetakeQuiz}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Quiz wiederholen
                </button>
              )}
              
              <button
                onClick={handleBackToLesson}
                className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zur Lektion
              </button>

              {passed && (
                <button
                  onClick={() => {
                    // Navigate to next lesson or dashboard
                    navigate('/lessons');
                  }}
                  className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Weiter zu den Lektionen
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="h-8 w-8 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {currentQuiz.title}
            </h1>
            
            <div className="grid grid-cols-2 gap-4 mb-8 text-left">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Fragen</div>
                <div className="text-xl font-semibold text-gray-900">
                  {currentQuiz.questions.length}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Zeitlimit</div>
                <div className="text-xl font-semibold text-gray-900">
                  {currentQuiz.timeLimit ? `${currentQuiz.timeLimit} Min` : 'Unbegrenzt'}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Bestehensgrenze</div>
                <div className="text-xl font-semibold text-gray-900">
                  {currentQuiz.passingScore}%
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-500 mb-1">Versuche</div>
                <div className="text-xl font-semibold text-gray-900">
                  Unbegrenzt
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleStartQuiz}
                className="w-full btn-primary btn-lg"
              >
                Quiz starten
              </button>
              
              <button
                onClick={handleBackToLesson}
                className="w-full btn-secondary"
              >
                Zurück zur Lektion
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz questions screen
  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
  const allQuestionsAnswered = Object.keys(userAnswers).length === currentQuiz.questions.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Quiz Header */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">{currentQuiz.title}</h1>
              
              <div className="flex items-center space-x-4">
                {currentQuiz.timeLimit && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                )}
                
                <div className="text-sm">
                  Frage {currentQuestionIndex + 1} von {currentQuiz.questions.length}
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="bg-blue-500 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              {currentQuestion.question}
            </h2>
            
            {/* Multiple Choice Options */}
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = userAnswers[currentQuestionIndex] === index.toString();
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index.toString())}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="font-medium">
                        {String.fromCharCode(65 + index)}.
                      </span>{' '}
                      {option}
                    </button>
                  );
                })}
              </div>
            )}
            
            {/* True/False Options */}
            {currentQuestion.type === 'true-false' && (
              <div className="space-y-3">
                {['Wahr', 'Falsch'].map((option, index) => {
                  const isSelected = userAnswers[currentQuestionIndex] === index.toString();
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index.toString())}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="px-8 py-6 bg-gray-50 flex justify-between items-center">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 text-gray-600 disabled:text-gray-400 hover:text-gray-800 transition-colors disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </button>
            
            <div className="flex items-center space-x-2">
              {currentQuiz.questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentQuestionIndex
                      ? 'bg-blue-500'
                      : userAnswers[index] !== undefined
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            {isLastQuestion ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={!allQuestionsAnswered || isSubmitting}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Wird übermittelt...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Quiz abschließen
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === currentQuiz.questions.length - 1}
                className="flex items-center px-4 py-2 text-gray-600 disabled:text-gray-400 hover:text-gray-800 transition-colors disabled:cursor-not-allowed"
              >
                Weiter
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz; 