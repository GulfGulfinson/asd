import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { completeQuiz, saveProgress } from '../store/slices/progressSlice';
import { Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight, RotateCcw, Trophy, Target, CheckCircle2 } from 'lucide-react';

// Mock quiz data for development - using actual MongoDB ObjectIds from the database
const mockQuizzes: Record<string, any> = {
  '686f77b4f4b5f73585d2b326': {
    _id: 'quiz-686f77b4f4b5f73585d2b326',
    lessonId: '686f77b4f4b5f73585d2b326',
    title: 'Data Science Grundlagen Quiz',
    questions: [
      {
        _id: 'q1',
        question: 'Was ist Data Science?',
        type: 'multiple_choice',
        options: [
          'Eine reine Programmiertechnik',
          'Ein interdisziplinäres Feld zur Extraktion von Erkenntnissen aus Daten',
          'Eine Datenbank-Software',
          'Eine statistische Methode'
        ],
        correctAnswer: '1',
        explanation: 'Data Science ist ein interdisziplinäres Feld, das Statistik, Programmierung und Domänenwissen kombiniert.',
        points: 10
      },
      {
        _id: 'q2',
        question: 'Welche Programmiersprache ist besonders beliebt in Data Science?',
        type: 'multiple_choice',
        options: [
          'JavaScript',
          'Python',
          'C++',
          'HTML'
        ],
        correctAnswer: '1',
        explanation: 'Python ist wegen seiner umfangreichen Bibliotheken wie pandas, numpy und scikit-learn sehr beliebt in Data Science.',
        points: 10
      },
      {
        _id: 'q3',
        question: 'Data Science Projekte beginnen immer mit der Datensammlung.',
        type: 'true_false',
        options: ['Wahr', 'Falsch'],
        correctAnswer: '0',
        explanation: 'Richtig! Datensammlung ist normalerweise der erste Schritt im Data Science Prozess.',
        points: 5
      }
    ],
    passingScore: 70,
    timeLimit: 5, // 5 minutes
    attemptsCount: 0,
    averageScore: 0
  },
  '686f77b4f4b5f73585d2b324': {
    _id: 'quiz-686f77b4f4b5f73585d2b324',
    lessonId: '686f77b4f4b5f73585d2b324',
    title: 'Programmierung Grundlagen Quiz',
    questions: [
      {
        _id: 'q1',
        question: 'Was ist eine Variable in der Programmierung?',
        type: 'multiple_choice',
        options: [
          'Ein mathematischer Operator',
          'Ein benannter Speicherplatz für Daten',
          'Eine Funktion',
          'Ein Kommentar im Code'
        ],
        correctAnswer: '1',
        explanation: 'Eine Variable ist ein benannter Speicherplatz, in dem Daten gespeichert und während der Programmausführung manipuliert werden können.',
        points: 15
      },
      {
        _id: 'q2',
        question: 'Welcher Datentyp speichert Ganzzahlen?',
        type: 'multiple_choice',
        options: [
          'String',
          'Boolean',
          'Integer',
          'Float'
        ],
        correctAnswer: '2',
        explanation: 'Integer ist der Datentyp für Ganzzahlen wie 42, -17, oder 0.',
        points: 10
      }
    ],
    passingScore: 70,
    timeLimit: 3,
    attemptsCount: 0,
    averageScore: 0
  },
  '686f77b4f4b5f73585d2b328': {
    _id: 'quiz-686f77b4f4b5f73585d2b328',
    lessonId: '686f77b4f4b5f73585d2b328',
    title: 'React Development Quiz',
    questions: [
      {
        _id: 'q1',
        question: 'Was ist React?',
        type: 'multiple_choice',
        options: [
          'Eine Datenbank',
          'Eine JavaScript-Bibliothek für Benutzeroberflächen',
          'Ein CSS-Framework',
          'Ein Backend-Framework'
        ],
        correctAnswer: '1',
        explanation: 'React ist eine JavaScript-Bibliothek für den Bau von Benutzeroberflächen, entwickelt von Facebook.',
        points: 10
      },
      {
        _id: 'q2',
        question: 'React verwendet einen Virtual DOM für bessere Performance.',
        type: 'true_false',
        options: ['Wahr', 'Falsch'],
        correctAnswer: '0',
        explanation: 'Richtig! React verwendet einen Virtual DOM um UI-Updates zu optimieren und die Performance zu verbessern.',
        points: 10
      }
    ],
    passingScore: 60,
    timeLimit: 4,
    attemptsCount: 0,
    averageScore: 0
  }
};

interface QuizProps {
  lessonId: string;
  onComplete?: (score: number, passed: boolean) => void;
  onClose?: () => void;
}

const Quiz: React.FC<QuizProps> = ({ lessonId, onComplete, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(new Date());

  // Load quiz data
  useEffect(() => {
    const quiz = mockQuizzes[lessonId];
    if (quiz) {
      setCurrentQuiz(quiz);
      setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds
    }
    setLoading(false);
  }, [lessonId]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (quizStarted && !quizCompleted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizStarted, quizCompleted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
  };

  const handleAnswerSelect = (answerIndex: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;

    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;
    
    const results = currentQuiz.questions.map((question: any, index: number) => {
      const userAnswer = userAnswers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      totalPoints += question.points;
      if (isCorrect) {
        earnedPoints += question.points;
      }

      return {
        questionIndex: index,
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        options: question.options
      };
    });

    const score = Math.round((earnedPoints / totalPoints) * 100);
    const passed = score >= currentQuiz.passingScore;
    
    // Calculate time spent
    const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    
    setQuizResults({
      score,
      passed,
      results,
      totalQuestions: currentQuiz.questions.length,
      correctAnswers: results.filter((r: any) => r.isCorrect).length,
      earnedPoints,
      totalPoints,
      timeSpent
    });
    setQuizCompleted(true);
    
    // Track progress
    dispatch(completeQuiz({
      lessonId,
      score,
      passed,
      timeSpent
    }));
    
    // Save progress
    dispatch(saveProgress());
    
    // Call completion callback
    if (onComplete) {
      onComplete(score, passed);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setQuizResults(null);
    setQuizStarted(false);
    if (currentQuiz) {
      setTimeRemaining(currentQuiz.timeLimit * 60);
    }
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

  if (!currentQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz nicht gefunden</h2>
          <p className="text-gray-600 mb-6">Für diese Lektion ist kein Quiz verfügbar.</p>
          <button onClick={handleBackToLesson} className="btn-primary">
            Zurück zur Lektion
          </button>
        </div>
      </div>
    );
  }

  // Quiz intro screen
  if (!quizStarted && !quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentQuiz.title}</h1>
              <p className="text-gray-600">Testen Sie Ihr Wissen über die Lektion</p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Anzahl Fragen:</span>
                <span className="text-gray-900">{currentQuiz.questions.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Zeitlimit:</span>
                <span className="text-gray-900">{currentQuiz.timeLimit} Minuten</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Bestehensgrenze:</span>
                <span className="text-gray-900">{currentQuiz.passingScore}%</span>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleStartQuiz}
                className="w-full btn-primary py-3"
              >
                Quiz starten
              </button>
              <button
                onClick={handleBackToLesson}
                className="w-full btn-secondary py-3"
              >
                Zurück zur Lektion
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz results screen
  if (quizCompleted && quizResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            {/* Results Header */}
            <div className="text-center mb-8">
              <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                quizResults.passed ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {quizResults.passed ? (
                  <Trophy className="h-10 w-10 text-green-600" />
                ) : (
                  <XCircle className="h-10 w-10 text-red-600" />
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {quizResults.passed ? 'Herzlichen Glückwunsch!' : 'Nicht bestanden'}
              </h1>
              <p className="text-gray-600">
                {quizResults.passed 
                  ? 'Sie haben das Quiz erfolgreich bestanden!'
                  : `Sie benötigen ${currentQuiz.passingScore}% zum Bestehen.`
                }
              </p>
            </div>

            {/* Score Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-primary-600 mb-2">{quizResults.score}%</div>
                <div className="text-gray-600">Ihre Punktzahl</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {quizResults.correctAnswers}/{quizResults.totalQuestions}
                </div>
                <div className="text-gray-600">Richtige Antworten</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {quizResults.earnedPoints}/{quizResults.totalPoints}
                </div>
                <div className="text-gray-600">Punkte</div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-6 mb-8">
              <h3 className="text-xl font-semibold text-gray-900">Detaillierte Ergebnisse</h3>
              {quizResults.results.map((result: any, index: number) => (
                <div key={index} className="border rounded-lg p-6">
                  <div className="flex items-start mb-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      result.isCorrect ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {result.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Frage {index + 1}</h4>
                      <p className="text-gray-700 mb-3">{result.question}</p>
                      
                      {result.options && (
                        <div className="space-y-2 mb-3">
                          {result.options.map((option: string, optIndex: number) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded text-sm ${
                                optIndex.toString() === result.correctAnswer
                                  ? 'bg-green-100 text-green-800 border border-green-300'
                                  : optIndex.toString() === result.userAnswer && !result.isCorrect
                                  ? 'bg-red-100 text-red-800 border border-red-300'
                                  : 'bg-gray-50 text-gray-700'
                              }`}
                            >
                              {option}
                              {optIndex.toString() === result.correctAnswer && ' ✓'}
                              {optIndex.toString() === result.userAnswer && optIndex.toString() !== result.correctAnswer && ' ✗'}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {result.explanation && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <p className="text-sm text-blue-800">
                            <strong>Erklärung:</strong> {result.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetakeQuiz}
                className="btn-secondary flex items-center justify-center"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Quiz wiederholen
              </button>
              <button
                onClick={handleBackToLesson}
                className="btn-primary flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zur Lektion
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz question screen
  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const selectedAnswer = userAnswers[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentQuiz.title}</h1>
              <p className="text-gray-600">Frage {currentQuestionIndex + 1} von {currentQuiz.questions.length}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2" />
                <span className={timeRemaining < 60 ? 'text-red-600 font-semibold' : ''}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Fortschritt</span>
              <span>{Math.round(((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestion.question}</h2>
            
            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options?.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index.toString())}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index.toString()
                      ? 'border-primary-500 bg-primary-50 text-primary-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswer === index.toString()
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === index.toString() && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    {option}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center px-4 py-2 rounded-lg ${
                currentQuestionIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </button>

            <div className="flex space-x-3">
              {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length !== currentQuiz.questions.length}
                  className="btn-primary"
                >
                  Quiz abschließen
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  disabled={!selectedAnswer}
                  className="btn-primary flex items-center"
                >
                  Weiter
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz; 