import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchThemes } from '../store/slices/themesSlice';
import { Theme } from '../types';
import { BookOpen, Target, Users, Award, ArrowRight, Loader, Clock, ChevronLeft, ChevronRight, Star, TrendingUp } from 'lucide-react';

// Sample popular lessons data for non-authenticated users
const popularLessons = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    summary: 'Learn the fundamentals of machine learning and its applications in modern technology.',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600',
    theme: { name: 'Technology', color: '#3B82F6', icon: '💻' },
    difficulty: 'Beginner',
    readTime: 5,
    rating: 4.8,
    enrolled: '12.5k'
  },
  {
    id: '2',
    title: 'The Science of Habit Formation',
    summary: 'Discover how habits are formed and learn practical strategies to build positive habits.',
    imageUrl: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=600',
    theme: { name: 'Psychology', color: '#8B5CF6', icon: '🧠' },
    difficulty: 'Intermediate',
    readTime: 8,
    rating: 4.9,
    enrolled: '8.2k'
  },
  {
    id: '3',
    title: 'Understanding Climate Change',
    summary: 'An overview of climate change causes, effects, and potential solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=600',
    theme: { name: 'Science', color: '#10B981', icon: '🔬' },
    difficulty: 'Intermediate',
    readTime: 12,
    rating: 4.7,
    enrolled: '6.8k'
  },
  {
    id: '4',
    title: 'Modern Web Development',
    summary: 'Build responsive websites with HTML5, CSS3, and JavaScript fundamentals.',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600',
    theme: { name: 'Web Development', color: '#10B981', icon: '🌐' },
    difficulty: 'Beginner',
    readTime: 10,
    rating: 4.6,
    enrolled: '15.3k'
  },
  {
    id: '5',
    title: 'Business Strategy Fundamentals',
    summary: 'Learn essential business strategies and entrepreneurship principles.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    theme: { name: 'Business', color: '#F59E0B', icon: '💼' },
    difficulty: 'Intermediate',
    readTime: 15,
    rating: 4.5,
    enrolled: '9.1k'
  },
  {
    id: '6',
    title: 'UX Design Principles',
    summary: 'Create user-centered designs that delight and convert customers.',
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600',
    theme: { name: 'Design', color: '#EF4444', icon: '🎨' },
    difficulty: 'Intermediate',
    readTime: 9,
    rating: 4.8,
    enrolled: '7.4k'
  }
];

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { themes = [], loading } = useAppSelector(state => state.themes);
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    dispatch(fetchThemes());
  }, [dispatch]);

  // Auto-slide for popular lessons (only when not authenticated)
  useEffect(() => {
    if (!isAuthenticated) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.max(1, popularLessons.length - 2));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, popularLessons.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, popularLessons.length - 2)) % Math.max(1, popularLessons.length - 2));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn Something New
            <span className="block text-primary-600">Every Day</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover curated lessons designed to expand your knowledge in just a few minutes a day. 
            Build consistency and grow your skills with our daily learning platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-primary text-lg px-8 py-3"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary text-lg px-8 py-3"
                >
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="btn-outline text-lg px-8 py-3"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Popular Lessons Section - Only for non-authenticated users */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-br from-primary-50 to-purple-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingUp className="h-6 w-6 text-primary-600" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Most Popular Lessons
                </h2>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Get a taste of our top-rated content. Join thousands of learners exploring these trending topics.
              </p>
            </div>

            {/* Desktop Carousel */}
            <div className="hidden md:block relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
                >
                  {popularLessons.map((lesson) => (
                    <div key={lesson.id} className="w-1/3 flex-shrink-0 px-3">
                      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                        <div className="relative">
                          <img
                            src={lesson.imageUrl}
                            alt={lesson.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 left-4">
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: lesson.theme.color }}
                            >
                              {lesson.theme.icon} {lesson.theme.name}
                            </span>
                          </div>
                          <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs font-medium">{lesson.rating}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                              {lesson.difficulty}
                            </span>
                            <span className="flex items-center text-gray-500 text-sm">
                              <Clock className="h-3 w-3 mr-1" />
                              {lesson.readTime} min
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {lesson.title}
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {lesson.summary}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{lesson.enrolled} students</span>
                            <Link
                              to="/register"
                              className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center"
                            >
                              Preview
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>

              {/* Slide Indicators */}
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: Math.max(1, popularLessons.length - 2) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Grid */}
            <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-6">
              {popularLessons.slice(0, 4).map((lesson) => (
                <div key={lesson.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={lesson.imageUrl}
                      alt={lesson.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: lesson.theme.color }}
                      >
                        {lesson.theme.icon}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium">{lesson.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                        {lesson.difficulty}
                      </span>
                      <span className="flex items-center text-gray-500 text-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {lesson.readTime} min
                      </span>
                    </div>
                    
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      {lesson.title}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{lesson.enrolled} students</span>
                      <Link
                        to="/register"
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center"
                      >
                        Preview
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-3"
              >
                Join to Access All Lessons
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Learning Themes Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Learning Themes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from a variety of topics designed to expand your knowledge and skills.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="h-8 w-8 animate-spin text-primary-600" />
              <span className="ml-2 text-gray-600">Loading themes...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {themes && themes.length > 0 ? (
                themes.slice(0, 8).map((theme: Theme) => (
                  <div
                    key={theme._id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    style={{ borderTop: `4px solid ${theme.color}` }}
                  >
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"
                        style={{ backgroundColor: `${theme.color}20` }}
                      >
                        {theme.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {theme.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {theme.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        {theme.lessonsCount} Lessons
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No themes available at the moment.</p>
                </div>
              )}
            </div>
          )}

          {!loading && themes && themes.length > 8 && (
            <div className="text-center mt-12">
              <Link
                to={isAuthenticated ? "/lessons" : "/register"}
                className="btn-primary"
              >
                View All Themes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose DailyLearn?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform is designed to make learning a habit, not a chore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Curated Content</h3>
              <p className="text-gray-600">
                Expert-selected lessons across various topics to maximize your learning efficiency.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Goal-Oriented</h3>
              <p className="text-gray-600">
                Set learning goals and track your progress with detailed analytics and insights.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Join thousands of learners and share your journey with like-minded individuals.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Achievements</h3>
              <p className="text-gray-600">
                Earn badges and celebrate milestones as you build your learning streak.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">5+</div>
              <div className="text-primary-200">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">{themes?.length || 0}+</div>
              <div className="text-primary-200">Learning Themes</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <div className="text-primary-200">Completion Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-white py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our community of learners who are already growing their knowledge daily.
            </p>
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-3"
            >
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 