import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Theme, Lesson, Quiz } from '../models';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dailylearn';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedThemes = async () => {
  const themes = [
    {
      name: 'Technology',
      description: 'Learn about the latest in technology, AI, programming, and digital innovation.',
      slug: 'technology',
      color: '#3B82F6',
      icon: 'monitor',
      isActive: true
    },
    {
      name: 'Science',
      description: 'Discover fascinating scientific concepts, discoveries, and natural phenomena.',
      slug: 'science',
      color: '#10B981',
      icon: 'atom',
      isActive: true
    },
    {
      name: 'Psychology',
      description: 'Understand human behavior, mental processes, and psychological principles.',
      slug: 'psychology',
      color: '#8B5CF6',
      icon: 'brain',
      isActive: true
    },
    {
      name: 'Business',
      description: 'Learn about entrepreneurship, management, finance, and business strategy.',
      slug: 'business',
      color: '#F59E0B',
      icon: 'briefcase',
      isActive: true
    },
    {
      name: 'Health & Wellness',
      description: 'Explore topics about physical health, mental wellness, and lifestyle optimization.',
      slug: 'health-wellness',
      color: '#EF4444',
      icon: 'heart',
      isActive: true
    }
  ];

  for (const themeData of themes) {
    await Theme.findOneAndUpdate(
      { slug: themeData.slug },
      themeData,
      { upsert: true, new: true }
    );
  }

  console.log('✅ Themes seeded successfully');
  return await Theme.find();
};

const seedLessons = async (themes: any[]) => {
  const lessons = [
    {
      title: 'Introduction to Machine Learning',
      content: `
        <h2>What is Machine Learning?</h2>
        <p>Machine Learning (ML) is a subset of artificial intelligence (AI) that provides systems the ability to automatically learn and improve from experience without being explicitly programmed.</p>
        
        <h3>Key Concepts</h3>
        <p>Machine learning algorithms build a model based on sample data, known as "training data," in order to make predictions or decisions without being explicitly programmed to do so.</p>
        
        <h3>Types of Machine Learning</h3>
        <ul>
          <li><strong>Supervised Learning:</strong> Uses labeled training data to learn a mapping function</li>
          <li><strong>Unsupervised Learning:</strong> Finds hidden patterns in data without labeled examples</li>
          <li><strong>Reinforcement Learning:</strong> Learns through interaction with an environment</li>
        </ul>
        
        <h3>Applications</h3>
        <p>Machine learning is used in email spam filtering, recommendation systems, image recognition, medical diagnosis, and financial fraud detection.</p>
      `,
      summary: 'Learn the fundamentals of machine learning and its applications in modern technology.',
      imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800',
      themeId: themes.find(t => t.slug === 'technology')?._id,
      difficulty: 'beginner',
      tags: ['AI', 'Technology', 'Beginner'],
      isPublished: true,
      publishedAt: new Date('2024-01-15')
    },
    {
      title: 'The Science of Habit Formation',
      content: `
        <h2>Understanding Habits</h2>
        <p>Habits are automatic behaviors triggered by contextual cues. They form through a neurological loop consisting of a cue, routine, and reward.</p>
        
        <h3>The Habit Loop</h3>
        <p>Every habit consists of three components:</p>
        <ul>
          <li><strong>Cue:</strong> The trigger that initiates the behavior</li>
          <li><strong>Routine:</strong> The behavior itself</li>
          <li><strong>Reward:</strong> The benefit you gain from doing the behavior</li>
        </ul>
        
        <h3>Building Good Habits</h3>
        <p>Start small, be consistent, and focus on identity-based changes rather than outcome-based goals.</p>
      `,
      summary: 'Discover how habits are formed and learn practical strategies to build positive habits.',
      imageUrl: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=800',
      themeId: themes.find(t => t.slug === 'psychology')?._id,
      difficulty: 'intermediate',
      tags: ['Psychology', 'Personal Development'],
      isPublished: true,
      publishedAt: new Date('2024-01-14')
    },
    {
      title: 'Understanding Climate Change',
      content: `
        <h2>Climate Change Basics</h2>
        <p>Climate change refers to long-term shifts in global or regional climate patterns, largely attributed to increased greenhouse gas concentrations in the atmosphere.</p>
        
        <h3>Greenhouse Effect</h3>
        <p>The greenhouse effect is a natural process that warms Earth's surface. When the Sun's energy reaches Earth, some is reflected back to space and the rest is absorbed and re-radiated as heat.</p>
        
        <h3>Human Impact</h3>
        <p>Human activities, particularly the burning of fossil fuels, have increased atmospheric CO2 levels by over 40% since pre-industrial times.</p>
        
        <h3>Solutions</h3>
        <p>Mitigation strategies include renewable energy adoption, energy efficiency improvements, and carbon capture technologies.</p>
      `,
      summary: 'An overview of climate change causes, effects, and potential solutions.',
      imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=800',
      themeId: themes.find(t => t.slug === 'science')?._id,
      difficulty: 'intermediate',
      tags: ['Climate', 'Environment', 'Science'],
      isPublished: true,
      publishedAt: new Date('2024-01-13')
    }
  ];

  const createdLessons = [];
  for (const lessonData of lessons) {
    const lesson = await Lesson.findOneAndUpdate(
      { title: lessonData.title },
      lessonData,
      { upsert: true, new: true }
    );
    createdLessons.push(lesson);
  }

  console.log('✅ Lessons seeded successfully');
  return createdLessons;
};

const seedQuizzes = async (lessons: any[]) => {
  const quizzes = [
    {
      lessonId: lessons.find(l => l.title === 'Introduction to Machine Learning')?._id,
      title: 'Machine Learning Basics Quiz',
      questions: [
        {
          question: 'What is Machine Learning?',
          type: 'multiple_choice',
          options: [
            'A type of computer hardware',
            'A subset of artificial intelligence',
            'A programming language',
            'A database technology'
          ],
          correctAnswer: 1,
          explanation: 'Machine Learning is indeed a subset of artificial intelligence that enables systems to learn from data.'
        },
        {
          question: 'Which type of machine learning uses labeled training data?',
          type: 'multiple_choice',
          options: [
            'Unsupervised Learning',
            'Reinforcement Learning',
            'Supervised Learning',
            'Deep Learning'
          ],
          correctAnswer: 2,
          explanation: 'Supervised learning uses labeled training data to learn a mapping function from inputs to outputs.'
        }
      ],
      passingScore: 70,
      timeLimit: 300
    },
    {
      lessonId: lessons.find(l => l.title === 'The Science of Habit Formation')?._id,
      title: 'Habit Formation Quiz',
      questions: [
        {
          question: 'What are the three components of the habit loop?',
          type: 'multiple_choice',
          options: [
            'Think, Act, Reward',
            'Cue, Routine, Reward',
            'Start, Continue, Finish',
            'Plan, Execute, Review'
          ],
          correctAnswer: 1,
          explanation: 'The habit loop consists of a cue (trigger), routine (behavior), and reward (benefit).'
        }
      ],
      passingScore: 70,
      timeLimit: 180
    }
  ];

  for (const quizData of quizzes) {
    await Quiz.findOneAndUpdate(
      { lessonId: quizData.lessonId },
      quizData,
      { upsert: true, new: true }
    );
  }

  console.log('✅ Quizzes seeded successfully');
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data (optional - remove in production)
    // await Theme.deleteMany({});
    // await Lesson.deleteMany({});
    // await Quiz.deleteMany({});
    
    const themes = await seedThemes();
    const lessons = await seedLessons(themes);
    await seedQuizzes(lessons);
    
    console.log('🎉 Database seeding completed successfully!');
    
    // Update lesson counts for themes
    for (const theme of themes) {
      const count = await Lesson.countDocuments({ themeId: theme._id, isPublished: true });
      await Theme.findByIdAndUpdate(theme._id, { lessonsCount: count });
    }
    
    console.log('✅ Theme lesson counts updated');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase; 