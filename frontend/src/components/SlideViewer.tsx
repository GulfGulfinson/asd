import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Check, BookOpen, Clock } from 'lucide-react';

export interface Slide {
  id: string;
  type: 'intro' | 'content' | 'conclusion' | 'video' | 'image';
  title: string;
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  duration?: number; // estimated time in seconds
  notes?: string;
}

interface SlideViewerProps {
  slides: Slide[];
  lessonTitle: string;
  onSlideChange?: (slideIndex: number) => void;
  onComplete?: () => void;
  autoPlay?: boolean;
  showProgress?: boolean;
}

export interface SlideViewerRef {
  resetPresentation: () => void;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
}

const SlideViewer = forwardRef<SlideViewerRef, SlideViewerProps>(({
  slides,
  lessonTitle,
  onSlideChange,
  onComplete,
  autoPlay = false,
  showProgress = true,
}, ref) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [slideStartTime, setSlideStartTime] = useState(Date.now());

  // Calculate total estimated time
  const totalDuration = slides.reduce((total, slide) => total + (slide.duration || 30), 0);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
      setProgress(0);
      setSlideStartTime(Date.now());
      onSlideChange?.(index);
    }
  }, [slides.length, onSlideChange]);

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      goToSlide(currentSlide + 1);
    } else {
      // Reached the end
      onComplete?.();
    }
  }, [currentSlide, slides.length, goToSlide, onComplete]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }, [currentSlide, goToSlide]);

  const resetPresentation = useCallback(() => {
    goToSlide(0);
    setIsPlaying(false);
  }, [goToSlide]);

  const togglePlayback = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    resetPresentation,
    goToSlide,
    nextSlide,
    prevSlide,
  }), [resetPresentation, goToSlide, nextSlide, prevSlide]);

  // Auto-advance slides when playing
  useEffect(() => {
    if (!isPlaying) return;

    const currentSlideData = slides[currentSlide];
    const duration = (currentSlideData?.duration || 30) * 1000; // Convert to milliseconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - slideStartTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        nextSlide();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide, slideStartTime, slides, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          prevSlide();
          break;
        case 'Home':
          event.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          event.preventDefault();
          goToSlide(slides.length - 1);
          break;
        case 'r':
        case 'R':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            resetPresentation();
          }
          break;
        case 'p':
        case 'P':
          event.preventDefault();
          togglePlayback();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide, goToSlide, slides.length, resetPresentation, togglePlayback]);

  if (!slides || slides.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Keine Folien verfügbar</p>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{lessonTitle}</h3>
            <p className="text-sm text-gray-500">
              Folie {currentSlide + 1} von {slides.length}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{Math.ceil(totalDuration / 60)} Min.</span>
            </div>
            
            <button
              onClick={togglePlayback}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            
            <button
              onClick={resetPresentation}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded"
              title="Restart"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        {showProgress && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Fortschritt</span>
              <span>{Math.round(((currentSlide + progress / 100) / slides.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentSlide + progress / 100) / slides.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Slide Content */}
      <div className="relative">
        {/* Slide Display */}
        <div className="min-h-[500px] flex flex-col justify-center p-8">
          {currentSlideData.type === 'intro' && (
            <div className="text-center">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  Einführung
                </span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {currentSlideData.title}
              </h1>
              <div 
                className="text-xl text-gray-600 max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{ __html: currentSlideData.content }}
              />
            </div>
          )}

          {currentSlideData.type === 'content' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {currentSlideData.title}
              </h2>
              
              {currentSlideData.imageUrl && (
                <div className="mb-6">
                  <img
                    src={currentSlideData.imageUrl}
                    alt={currentSlideData.title}
                    className="w-full max-w-2xl mx-auto rounded-lg shadow-sm"
                  />
                </div>
              )}
              
              <div 
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: currentSlideData.content }}
              />
              
              {currentSlideData.notes && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Hinweis</h4>
                  <p className="text-blue-800 text-sm">{currentSlideData.notes}</p>
                </div>
              )}
            </div>
          )}

          {currentSlideData.type === 'conclusion' && (
            <div className="text-center">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Zusammenfassung
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {currentSlideData.title}
              </h2>
              <div 
                className="text-lg text-gray-600 max-w-3xl mx-auto"
                dangerouslySetInnerHTML={{ __html: currentSlideData.content }}
              />
              
              <div className="mt-8">
                <button
                  onClick={onComplete}
                  className="btn-primary inline-flex items-center"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Lektion abschließen
                </button>
              </div>
            </div>
          )}

          {currentSlideData.type === 'video' && currentSlideData.videoUrl && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {currentSlideData.title}
              </h2>
              <div className="mb-6">
                <video
                  src={currentSlideData.videoUrl}
                  controls
                  className="w-full max-w-4xl mx-auto rounded-lg shadow-sm"
                >
                  Ihr Browser unterstützt kein Video-Element.
                </video>
              </div>
              <div 
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: currentSlideData.content }}
              />
            </div>
          )}

          {currentSlideData.type === 'image' && currentSlideData.imageUrl && (
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {currentSlideData.title}
              </h2>
              <div className="mb-6">
                <img
                  src={currentSlideData.imageUrl}
                  alt={currentSlideData.title}
                  className="w-full max-w-4xl mx-auto rounded-lg shadow-sm"
                />
              </div>
              <div 
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: currentSlideData.content }}
              />
            </div>
          )}
        </div>

        {/* Auto-progress indicator */}
        {isPlaying && showProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full bg-primary-600 transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Zurück
          </button>

          {/* Slide Indicators */}
          <div className="flex items-center space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-primary-600'
                    : index < currentSlide
                    ? 'bg-green-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                title={`Folie ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
          >
            {isLastSlide ? 'Abschließen' : 'Weiter'}
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="bg-gray-100 px-6 py-2 text-xs text-gray-500">
        <span className="font-medium">Tastaturkürzel:</span>
        <span className="ml-2">← → Navigation</span>
        <span className="ml-2">Leertaste: Weiter</span>
        <span className="ml-2">P: Play/Pause</span>
        <span className="ml-2">R: Neustart</span>
      </div>
    </div>
  );
});

export default SlideViewer; 