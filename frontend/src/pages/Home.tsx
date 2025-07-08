import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchThemes } from '../store/slices/themesSlice';
import { Theme } from '../types';
import { BookOpen, Target, Users, Award, ArrowRight, Loader } from 'lucide-react';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { themes = [], loading } = useAppSelector(state => state.themes);
  const { isAuthenticated } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchThemes());
  }, [dispatch]);

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