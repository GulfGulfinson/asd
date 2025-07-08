import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Heart, Eye, Share, BookOpen, Loader } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchLessonById } from '../store/slices/lessonsSlice';
import { completeLesson, saveProgress } from '../store/slices/progressSlice';
import SlideViewer from '../components/SlideViewer';
import { parseContentIntoAdvancedSlides } from '../utils/lessonSlidesParser';
import { Theme, Lesson } from '../types/api';

// Mock lesson data for development - this would come from API in production
const mockLessons: Record<string, Lesson> = {
  '1': {
    _id: '1',
    title: 'Introduction to Machine Learning',
    summary: 'Learn the fundamentals of machine learning and its applications in modern technology.',
    content: `
      <h2>Was ist Machine Learning?</h2>
      <p>Machine Learning ist ein Teilbereich der künstlichen Intelligenz, der es Computern ermöglicht, aus Daten zu lernen und Vorhersagen zu treffen, ohne explizit programmiert zu werden.</p>
      
      <h2>Grundlegende Konzepte</h2>
      <p>Machine Learning basiert auf Algorithmen, die Muster in Daten erkennen und diese nutzen, um neue Daten zu klassifizieren oder Vorhersagen zu treffen.</p>
      
      <ul>
        <li><strong>Supervised Learning:</strong> Lernen mit gelabelten Daten</li>
        <li><strong>Unsupervised Learning:</strong> Finden von Mustern in ungelabelten Daten</li>
        <li><strong>Reinforcement Learning:</strong> Lernen durch Belohnung und Bestrafung</li>
      </ul>
      
      <h2>Anwendungen im Alltag</h2>
      <p>Machine Learning begegnet uns täglich in verschiedenen Formen:</p>
      <p>Von Empfehlungssystemen in Online-Shops bis hin zu Spracherkennung in Smartphones - ML revolutioniert unsere digitale Welt.</p>
      
      <h2>Die Zukunft von ML</h2>
      <p>Mit der stetig wachsenden Rechenleistung und verfügbaren Datenmengen wird Machine Learning immer mächtiger und vielseitiger.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
    audioUrl: undefined,
    videoUrl: undefined,
    themeId: { 
      _id: 'tech1',
      name: 'Technology', 
      color: '#3B82F6', 
      slug: 'technology',
      description: 'Technology and Innovation',
      icon: '💻',
      isActive: true,
      lessonsCount: 10,
      subscribersCount: 500,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    difficulty: 'beginner',
    estimatedReadTime: 5,
    tags: ['AI', 'Technology', 'Beginner'],
    isPublished: true,
    publishedAt: new Date('2024-01-15'),
    viewsCount: 1234,
    likesCount: 89,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  '2': {
    _id: '2',
    title: 'The Science of Habit Formation',
    summary: 'Discover how habits are formed and learn practical strategies to build positive habits.',
    content: `
      <h2>Die Psychologie der Gewohnheiten</h2>
      <p>Gewohnheiten sind automatische Verhaltensweisen, die durch Wiederholung entstehen. Sie bilden sich durch einen neurologischen Kreislauf, den Wissenschaftler als "Habit Loop" bezeichnen.</p>
      
      <h2>Der Gewohnheits-Kreislauf</h2>
      <p>Jede Gewohnheit besteht aus drei Komponenten:</p>
      <ul>
        <li><strong>Auslöser (Cue):</strong> Ein Signal, das das Gehirn in den automatischen Modus versetzt</li>
        <li><strong>Routine:</strong> Das Verhalten selbst, das ausgeführt wird</li>
        <li><strong>Belohnung:</strong> Der Nutzen, den wir aus dem Verhalten ziehen</li>
      </ul>
      
      <h2>Neue Gewohnheiten entwickeln</h2>
      <p>Um neue positive Gewohnheiten zu etablieren, ist es wichtig, den Habit Loop bewusst zu gestalten:</p>
      <p>Wählen Sie einen klaren Auslöser, definieren Sie eine einfache Routine und sorgen Sie für eine sofortige Belohnung.</p>
      
      <h2>Schlechte Gewohnheiten durchbrechen</h2>
      <p>Das Durchbrechen schlechter Gewohnheiten erfordert das Bewusstsein für den bestehenden Kreislauf und das bewusste Ersetzen der Routine durch eine positivere Alternative.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800',
    audioUrl: undefined,
    videoUrl: undefined,
    themeId: {
      _id: 'psych1',
      name: 'Psychology',
      color: '#8B5CF6',
      slug: 'psychology',
      description: 'Psychology and Mental Health',
      icon: '🧠',
      isActive: true,
      lessonsCount: 8,
      subscribersCount: 300,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    difficulty: 'intermediate',
    estimatedReadTime: 8,
    tags: ['Psychology', 'Personal Development'],
    isPublished: true,
    publishedAt: new Date('2024-01-14'),
    viewsCount: 2156,
    likesCount: 142,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  '3': {
    _id: '3',
    title: 'Understanding Climate Change',
    summary: 'An overview of climate change causes, effects, and potential solutions.',
    content: `
      <h2>Was ist Klimawandel?</h2>
      <p>Der Klimawandel bezieht sich auf langfristige Veränderungen der globalen Durchschnittstemperaturen und Wettermuster. Während Klimavariationen natürlich auftreten, sind die seit den 1800er Jahren beobachteten Veränderungen hauptsächlich auf menschliche Aktivitäten zurückzuführen.</p>
      
      <h2>Hauptursachen</h2>
      <p>Die Hauptursache des aktuellen Klimawandels ist die Emission von Treibhausgasen:</p>
      <ul>
        <li><strong>Kohlendioxid (CO2):</strong> Hauptsächlich aus der Verbrennung fossiler Brennstoffe</li>
        <li><strong>Methan (CH4):</strong> Aus Landwirtschaft und Mülldeponien</li>
        <li><strong>Lachgas (N2O):</strong> Aus Düngemitteln und industriellen Prozessen</li>
      </ul>
      
      <h2>Auswirkungen auf unseren Planeten</h2>
      <p>Die Folgen des Klimawandels sind bereits heute spürbar und werden sich in Zukunft verstärken:</p>
      <p>Steigende Meeresspiegel, extreme Wetterereignisse und Veränderungen in Ökosystemen bedrohen sowohl die Natur als auch menschliche Gesellschaften.</p>
      
      <h2>Lösungsansätze</h2>
      <p>Es gibt viele Wege, dem Klimawandel zu begegnen - von erneuerbaren Energien über nachhaltige Landwirtschaft bis hin zu individuellen Verhaltensänderungen.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=800',
    audioUrl: undefined,
    videoUrl: undefined,
    themeId: {
      _id: 'sci1',
      name: 'Science',
      color: '#10B981',
      slug: 'science',
      description: 'Science and Environment',
      icon: '🔬',
      isActive: true,
      lessonsCount: 12,
      subscribersCount: 450,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    difficulty: 'intermediate',
    estimatedReadTime: 12,
    tags: ['Climate', 'Environment', 'Science'],
    isPublished: true,
    publishedAt: new Date('2024-01-13'),
    viewsCount: 987,
    likesCount: 76,
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  }
};

const LessonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentLesson, loading, error } = useSelector((state: RootState) => state.lessons);
  const { user } = useSelector((state: RootState) => state.auth);
  const startTimeRef = useRef<Date>(new Date());
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  const [useSlideView, setUseSlideView] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [mockLesson, setMockLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (id) {
      // Try to get lesson from mock data first (for development)
      const lesson = mockLessons[id];
      if (lesson) {
        setMockLesson(lesson);
      } else {
        // Fallback to API call
        dispatch(fetchLessonById(id));
      }
    }
  }, [dispatch, id]);

  useEffect(() => {
    // For development, skip authentication check
    // In production, uncomment the lines below
    // if (!user) {
    //   navigate('/login');
    // }
  }, [user, navigate]);

  const handleSlideChange = (slideIndex: number) => {
    setCurrentSlideIndex(slideIndex);
  };

  const handleLessonComplete = useCallback(async () => {
    // Use the actual lesson data (either mock or from store)
    const lesson = mockLesson || currentLesson;
    if (!lesson || lessonCompleted) return;
    
    // Calculate time spent
    const timeSpent = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
    
    // Mark lesson as completed and track progress
    setLessonCompleted(true);
    
    // Dispatch progress actions
    dispatch(completeLesson({
      lessonId: lesson._id, // Use _id from lesson
      timeSpent: timeSpent
    }));
    
    // Save progress to localStorage
    dispatch(saveProgress());
    
    // Navigate to quiz after a short delay to allow user to see completion
    setTimeout(() => {
      navigate(`/quiz/${lesson._id}`); // Use _id from lesson
    }, 1000);
  }, [mockLesson, currentLesson, navigate, dispatch, lessonCompleted]);

  const handleLikeLesson = () => {
    console.log('Lesson liked!');
    alert('👍 Lektion geliked!\nIn der vollständigen App würde dies im Backend gespeichert.');
  };

  const handleShareLesson = () => {
    const lesson = mockLesson || currentLesson;
    if (navigator.share && lesson) {
      navigator.share({
        title: lesson.title,
        text: lesson.summary,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      if (lesson) {
        navigator.clipboard.writeText(window.location.href);
        alert('🔗 Link kopiert!\nTeile diese Lektion mit anderen.');
      }
    }
  };

  // Helper function to get theme info
  const getThemeInfo = (themeId: Theme | string) => {
    if (typeof themeId === 'string') {
      return { name: 'Theme', color: '#3B82F6' }; // Fallback values
    }
    return { name: themeId.name, color: themeId.color };
  };

  // Use mock lesson if available, otherwise use lesson from store
  const displayLesson = mockLesson || currentLesson;

  if (loading && !mockLesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-20">
          <Loader className="h-8 w-8 animate-spin text-primary-600" />
          <span className="ml-2 text-gray-600">Lektion wird geladen...</span>
        </div>
      </div>
    );
  }

  if ((error || !currentLesson) && !mockLesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lektion nicht gefunden</h2>
          <p className="text-gray-600 mb-6">
            Die angeforderte Lektion konnte nicht geladen werden.
          </p>
          <Link 
            to="/lessons"
            className="btn-primary"
          >
            Zurück zu den Lektionen
          </Link>
        </div>
      </div>
    );
  }

  if (!displayLesson) {
    return null;
  }

  // Parse lesson content into slides
  const slides = parseContentIntoAdvancedSlides(displayLesson.content, displayLesson.title);
  const themeInfo = getThemeInfo(displayLesson.themeId);

  // Slide view
  if (useSlideView) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link and View Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            to="/lessons"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zu den Lektionen
          </Link>
          
          <button
            onClick={() => setUseSlideView(false)}
            className="btn-secondary"
          >
            Zur klassischen Ansicht wechseln
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area - takes up 2 columns */}
          <div className="lg:col-span-2">
            {/* Lesson Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {displayLesson.title}
              </h1>
              <p className="text-gray-600">
                {displayLesson.summary}
              </p>
            </div>

            {/* Slide Viewer */}
            <SlideViewer
              slides={slides}
              lessonTitle={displayLesson.title}
              onSlideChange={handleSlideChange}
              onComplete={handleLessonComplete}
            />

            {/* Lesson Meta Information */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${themeInfo.color}20`,
                      color: themeInfo.color,
                    }}
                  >
                    {themeInfo.name}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">
                    {displayLesson.difficulty}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLikeLesson}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-500"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{displayLesson.likesCount}</span>
                  </button>
                  <button
                    onClick={handleShareLesson}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-500"
                  >
                    <Share className="h-4 w-4" />
                    <span>Teilen</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{displayLesson.estimatedReadTime} Min. Lesezeit</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{displayLesson.viewsCount} Aufrufe</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>Folie {currentSlideIndex + 1} von {slides.length}</span>
                </div>
              </div>

              {/* Tags */}
              {displayLesson.tags && displayLesson.tags.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {displayLesson.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Classic view (fallback)
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link and View Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <Link 
          to="/lessons"
          className="inline-flex items-center text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zu den Lektionen
        </Link>
        
        <button
          onClick={() => setUseSlideView(true)}
          className="btn-secondary"
        >
          Zur Folien-Ansicht wechseln
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${themeInfo.color}20`,
              color: themeInfo.color,
            }}
          >
            {themeInfo.name}
          </span>
          <span className="text-sm text-gray-500 capitalize">
            {displayLesson.difficulty}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {displayLesson.title}
        </h1>

        <p className="text-xl text-gray-600 mb-6">
          {displayLesson.summary}
        </p>

        {/* Meta info */}
        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{displayLesson.estimatedReadTime} Min. Lesezeit</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{displayLesson.viewsCount} Aufrufe</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart className="h-4 w-4" />
            <span>{displayLesson.likesCount} Likes</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={handleLikeLesson}
            className="btn-primary"
          >
            <Heart className="h-4 w-4 mr-2" />
            Like
          </button>
          <button 
            onClick={handleShareLesson}
            className="btn-secondary"
          >
            <Share className="h-4 w-4 mr-2" />
            Teilen
          </button>
        </div>

        {/* Featured Image */}
        {displayLesson.imageUrl && (
          <div className="mb-8">
            <img
              src={displayLesson.imageUrl}
              alt={displayLesson.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: displayLesson.content }} />
      </div>

      {/* Tags */}
      {displayLesson.tags && displayLesson.tags.length > 0 && (
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {displayLesson.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Complete Lesson Button */}
      <div className="text-center">
        <button
          onClick={handleLessonComplete}
          className="btn-primary btn-lg"
          disabled={lessonCompleted}
        >
          {lessonCompleted ? '✅ Lektion abgeschlossen' : 'Lektion abschließen'}
        </button>
      </div>
    </div>
  );
};

export default LessonDetail; 