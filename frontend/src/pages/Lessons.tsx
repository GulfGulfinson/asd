import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, Eye } from 'lucide-react';

// Mock data - this would come from API
const mockLessons = [
  {
    _id: '1',
    title: 'Introduction to Machine Learning',
    summary: 'Learn the fundamentals of machine learning and its applications in modern technology.',
    imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
    themeId: { name: 'Technology', color: '#3B82F6', slug: 'technology' },
    difficulty: 'beginner',
    estimatedReadTime: 5,
    tags: ['AI', 'Technology', 'Beginner'],
    viewsCount: 1234,
    likesCount: 89,
    publishedAt: new Date('2024-01-15'),
  },
  {
    _id: '2',
    title: 'The Science of Habit Formation',
    summary: 'Discover how habits are formed and learn practical strategies to build positive habits.',
    imageUrl: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400',
    themeId: { name: 'Psychology', color: '#8B5CF6', slug: 'psychology' },
    difficulty: 'intermediate',
    estimatedReadTime: 8,
    tags: ['Psychology', 'Personal Development'],
    viewsCount: 2156,
    likesCount: 142,
    publishedAt: new Date('2024-01-14'),
  },
  {
    _id: '3',
    title: 'Understanding Climate Change',
    summary: 'An overview of climate change causes, effects, and potential solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=400',
    themeId: { name: 'Science', color: '#10B981', slug: 'science' },
    difficulty: 'intermediate',
    estimatedReadTime: 12,
    tags: ['Climate', 'Environment', 'Science'],
    viewsCount: 987,
    likesCount: 76,
    publishedAt: new Date('2024-01-13'),
  },
];

const Lessons: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Explore Lessons
        </h1>
        <p className="text-gray-600">
          Discover curated content across various topics to expand your knowledge.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <select className="input w-auto">
          <option value="">All Themes</option>
          <option value="technology">Technology</option>
          <option value="psychology">Psychology</option>
          <option value="science">Science</option>
        </select>
        
        <select className="input w-auto">
          <option value="">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <input
          type="text"
          placeholder="Search lessons..."
          className="input flex-1 min-w-64"
        />
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockLessons.map((lesson) => (
          <Link
            key={lesson._id}
            to={`/lessons/${lesson._id}`}
            className="card hover:shadow-lg transition-shadow duration-200"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={lesson.imageUrl}
                alt={lesson.title}
                className="w-full h-48 object-cover"
              />
            </div>
            
            <div className="card-body">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${lesson.themeId.color}20`,
                    color: lesson.themeId.color,
                  }}
                >
                  {lesson.themeId.name}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {lesson.difficulty}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {lesson.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {lesson.summary}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{lesson.estimatedReadTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{lesson.viewsCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{lesson.likesCount}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex flex-wrap gap-1">
                  {lesson.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-12 text-center">
        <button className="btn-outline">
          Load More Lessons
        </button>
      </div>
    </div>
  );
};

export default Lessons; 