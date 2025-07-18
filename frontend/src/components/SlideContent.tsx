import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, Target, Zap, Brain, Users, Award, Clock, Play } from 'lucide-react';

interface SlideContentProps {
  content: any;
  isFirstSlide?: boolean;
  lessonTheme?: {
    name: string;
    color: string;
    icon: string;
    slug: string;
  };
  lessonTitle?: string;
  lessonDifficulty?: string;
  estimatedReadTime?: number;
  onStartLearning?: () => void;
}

interface InlineElement {
  type: 'bold' | 'italic' | 'link';
  content: string;
  url?: string;
}

const renderInlineContent = (content: any): React.ReactNode => {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content.map((item, index) => {
      if (typeof item === 'string') {
        return <span key={index}>{item}</span>;
      }

      const element = item as InlineElement;
      switch (element.type) {
        case 'bold':
          return (
            <strong key={index} className="font-semibold text-gray-900">
              {element.content}
            </strong>
          );
        case 'italic':
          return (
            <em key={index} className="italic text-gray-700">
              {element.content}
            </em>
          );
        case 'link':
          return (
            <a
              key={index}
              href={element.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline transition-colors"
            >
              {element.content}
            </a>
          );
        default:
          return <span key={index}>{element.content}</span>;
      }
    });
  }

  return content;
};

// Animated First Slide Elements Component
const FirstSlideAnimatedElements: React.FC<{
  lessonTheme: {
    name: string;
    color: string;
    icon: string;
    slug: string;
  };
  lessonTitle: string;
  lessonDifficulty: string;
  estimatedReadTime: number;
  onStartLearning?: () => void;
}> = ({ lessonTheme, lessonTitle, lessonDifficulty, estimatedReadTime, onStartLearning }) => {
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return <Target className="h-4 w-4" />;
      case 'intermediate': return <Zap className="h-4 w-4" />;
      case 'advanced': return <Brain className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getThemeFeatures = (slug: string) => {
    const features: Record<string, string[]> = {
      'psychology': ['Verhalten verstehen', 'Praktische Tipps', 'Wissenschaftlich fundiert'],
      'business': ['Strategie', 'Leadership', 'Wachstum'],
      'health-wellness': ['Gesundheit', 'Wohlbefinden', 'Lifestyle'],
      'science': ['Fakten', 'Entdeckungen', 'Verstehen'],
      'persoenlichkeit': ['Selbstentwicklung', 'Kommunikation', 'Führung']
    };
    return features[slug] || ['Interaktive Inhalte', 'Expertenwissen', 'Praktische Fähigkeiten'];
  };

  const handleStartLearning = () => {
    onStartLearning?.();
  };

  return (
    <div className="relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-10 right-10 w-20 h-20 opacity-10"
          style={{ color: lessonTheme.color }}
        >
          <div className="w-full h-full border-2 border-current rounded-lg transform rotate-45" />
        </motion.div>
        
        <motion.div
          animate={{ 
            rotate: -360,
            y: [0, -20, 0],
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-20 left-10 w-16 h-16 opacity-5"
          style={{ backgroundColor: lessonTheme.color }}
        >
          <div className="w-full h-full rounded-full" />
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative">
        {/* Theme badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div 
            className="inline-flex items-center px-6 py-3 rounded-full text-white font-medium shadow-lg"
            style={{ backgroundColor: lessonTheme.color }}
          >
            <span className="text-xl mr-3">{lessonTheme.icon}</span>
            <span className="text-lg">{lessonTheme.name}</span>
          </div>
        </motion.div>

        {/* Lesson title with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {lessonTitle}
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-4 h-1 rounded-full origin-left"
            style={{ backgroundColor: lessonTheme.color }}
          />
        </motion.div>

        {/* Lesson meta information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getDifficultyColor(lessonDifficulty)}`}>
            {getDifficultyIcon(lessonDifficulty)}
            <span className="ml-2">{lessonDifficulty}</span>
          </div>
          
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="h-4 w-4 mr-2" />
            <span>{estimatedReadTime} min read</span>
          </div>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {getThemeFeatures(lessonTheme.slug).map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${lessonTheme.color}20` }}
                >
                  <Star 
                    className="h-5 w-5" 
                    style={{ color: lessonTheme.color }} 
                  />
                </div>
                <span className="font-medium text-gray-900">{feature}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call-to-Action Button with proper functionality */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartLearning}
            className="px-8 py-4 text-white font-semibold rounded-xl shadow-lg transition-all duration-300"
            style={{ 
              background: `linear-gradient(135deg, ${lessonTheme.color}, ${lessonTheme.color}dd)`,
              boxShadow: `0 10px 25px ${lessonTheme.color}30`
            }}
          >
            <span className="flex items-center">
              <Play className="h-5 w-5 mr-2" />
              Start Learning
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

const ListItem: React.FC<{ children: React.ReactNode; index: number }> = ({
  children,
  index
}) => {
  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="text-gray-700 leading-relaxed mb-2"
    >
      {renderInlineContent(children)}
    </motion.li>
  );
};

// Helper component for dynamic headers
const DynamicHeader: React.FC<{ level: number; content: string; className: string }> = ({ 
  level, 
  content, 
  className 
}) => {
  const props = { className };
  
  switch (level) {
    case 1:
      return <h1 {...props}>{content}</h1>;
    case 2:
      return <h2 {...props}>{content}</h2>;
    case 3:
      return <h3 {...props}>{content}</h3>;
    case 4:
      return <h4 {...props}>{content}</h4>;
    case 5:
      return <h5 {...props}>{content}</h5>;
    case 6:
      return <h6 {...props}>{content}</h6>;
    default:
      return <h2 {...props}>{content}</h2>;
  }
};

const MarkdownSlideContent: React.FC<{ elements: any[]; themeColor?: string }> = ({ elements, themeColor }) => {
  return (
    <div className="space-y-6">
      {elements.map((element, index) => {
        // Create a more stable but unique key based on content and position
        const contentHash = element.content ? 
          element.content.toString().substring(0, 20).replace(/\s/g, '') : 
          element.type;
        const key = element.key || `element-${index}-${element.type}-${contentHash}`;

        switch (element.type) {
          case 'header':
            const headerLevel = Math.min(element.level + 1, 6);
            const headerClasses = {
              1: 'text-3xl font-bold text-gray-900 mb-4',
              2: 'text-2xl font-bold text-gray-900 mb-4',
              3: 'text-xl font-semibold text-gray-800 mb-3',
              4: 'text-lg font-medium text-gray-800 mb-3',
              5: 'text-base font-medium text-gray-700 mb-2',
              6: 'text-sm font-medium text-gray-700 mb-2'
            };

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <DynamicHeader 
                  level={headerLevel}
                  content={element.content}
                  className={headerClasses[headerLevel as keyof typeof headerClasses] || headerClasses[4]}
                />
              </motion.div>
            );

          case 'paragraph':
            return (
              <motion.p
                key={key}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-gray-700 leading-relaxed mb-4 text-lg"
              >
                {renderInlineContent(element.content)}
              </motion.p>
            );

          case 'unordered_list':
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-6"
              >
                <ul className="space-y-2 pl-6">
                  {element.items.map((item: any, itemIndex: number) => (
                    <ListItem key={`${key}-item-${itemIndex}`} index={itemIndex}>
                      <span className="inline-flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="flex-1">{renderInlineContent(item)}</span>
                      </span>
                    </ListItem>
                  ))}
                </ul>
              </motion.div>
            );

          case 'ordered_list':
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="mb-6"
              >
                <ol className="space-y-2 pl-6">
                  {element.items.map((item: any, itemIndex: number) => (
                    <ListItem key={`${key}-item-${itemIndex}`} index={itemIndex}>
                      <span className="inline-flex items-start">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full text-sm font-medium flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                          {itemIndex + 1}
                        </span>
                        <span className="flex-1">{renderInlineContent(item)}</span>
                      </span>
                    </ListItem>
                  ))}
                </ol>
              </motion.div>
            );

          case 'blockquote':
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg mb-6"
              >
                <div className="text-blue-800 italic leading-relaxed">
                  {renderInlineContent(element.content)}
                </div>
              </motion.div>
            );

          default:
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-gray-700 mb-4"
              >
                {renderInlineContent(element.content)}
              </motion.div>
            );
        }
      })}
    </div>
  );
};

const IntroSlideContent: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle
}) => {
  return (
    <div className="text-center max-w-4xl mx-auto">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-gradient-to-br from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-green-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl mb-6"
          >
            🚀
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {title}
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl text-gray-600 mb-12 leading-relaxed"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { icon: BookOpen, title: "Learn", description: "Comprehensive content" },
            { icon: Users, title: "Practice", description: "Hands-on examples" },
            { icon: Award, title: "Master", description: "Real-world skills" }
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const ConclusionSlideContent: React.FC<{ title: string; message: string }> = ({
  title,
  message
}) => {
  return (
    <div className="text-center max-w-4xl mx-auto">
      {/* Success animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="mb-8"
      >
        <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <Award className="h-16 w-16 text-white" />
          </motion.div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
      >
        {title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="text-xl text-gray-600 mb-12"
      >
        {message}
      </motion.p>

      {/* Progress indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {[
          { value: "100%", label: "Lesson Complete" },
          { value: "🏆", label: "Achievement Unlocked" },
          { value: "⭐", label: "Knowledge Gained" }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg"
          >
            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const SlideContent: React.FC<SlideContentProps> = ({ 
  content, 
  isFirstSlide = false, 
  lessonTheme,
  lessonTitle,
  lessonDifficulty = 'beginner',
  estimatedReadTime = 5,
  onStartLearning
}) => {
  // Handle first slide with enhanced animated elements
  if (isFirstSlide && lessonTheme && lessonTitle) {
    return (
      <FirstSlideAnimatedElements
        lessonTheme={lessonTheme}
        lessonTitle={lessonTitle}
        lessonDifficulty={lessonDifficulty}
        estimatedReadTime={estimatedReadTime}
        onStartLearning={onStartLearning}
      />
    );
  }

  // Handle legacy HTML content
  if (typeof content === 'string') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Handle structured content
  if (content && typeof content === 'object') {
    switch (content.type) {
      case 'intro-slide':
        // This is our dedicated animated intro slide
        if (lessonTheme && lessonTitle) {
          return (
            <FirstSlideAnimatedElements
              lessonTheme={lessonTheme}
              lessonTitle={lessonTitle}
              lessonDifficulty={lessonDifficulty}
              estimatedReadTime={estimatedReadTime}
              onStartLearning={onStartLearning}
            />
          );
        }
        return (
          <IntroSlideContent 
            title={content.title} 
            subtitle="Willkommen zu dieser Lektion" 
          />
        );

      case 'intro':
        return (
          <IntroSlideContent 
            title={content.title} 
            subtitle={content.subtitle} 
          />
        );

      case 'conclusion':
        return (
          <ConclusionSlideContent 
            title={content.title} 
            message={content.message} 
          />
        );

      case 'markdown':
        return (
          <MarkdownSlideContent 
            elements={content.elements} 
            themeColor={lessonTheme?.color}
          />
        );

      case 'error':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {content.title || 'Fehler beim Laden'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
                {content.message || 'Der Inhalt konnte nicht geladen werden. Bitte versuchen Sie es später erneut.'}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Seite neu laden
            </button>
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-700"
          >
            Content type not supported
          </motion.div>
        );
    }
  }

  return null;
};

export default SlideContent; 