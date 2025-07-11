import { User } from '../models';
import bcrypt from 'bcryptjs';

export const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    const userData = [
      {
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', 12),
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        isEmailVerified: true,
        preferences: {
          themes: ['business', 'produktivitaet', 'gesundheit-fitness'],
          notificationsEnabled: true,
          notificationTime: '09:00',
          language: 'de',
          timezone: 'Europe/Berlin',
          difficulty: 'intermediate' as const
        },
        subscription: {
          plan: 'premium' as const,
          status: 'active' as const,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31')
        },
        learningStats: {
          currentStreak: 15,
          longestStreak: 25,
          totalLessonsCompleted: 45,
          totalQuizzesCompleted: 42,
          averageQuizScore: 85,
          experiencePoints: 2250,
          level: 3,
          lastActivityDate: new Date()
        }
      },
      {
        email: 'jane.smith@example.com',
        password: await bcrypt.hash('password123', 12),
        username: 'janesmith',
        firstName: 'Jane',
        lastName: 'Smith',
        isEmailVerified: true,
        preferences: {
          themes: ['design-ux', 'marketing', 'sprachen-lernen'],
          notificationsEnabled: true,
          notificationTime: '08:30',
          language: 'de',
          timezone: 'Europe/Berlin',
          difficulty: 'beginner' as const
        },
        subscription: {
          plan: 'free' as const,
          status: 'active' as const,
          startDate: new Date('2024-06-01')
        },
        learningStats: {
          currentStreak: 8,
          longestStreak: 12,
          totalLessonsCompleted: 22,
          totalQuizzesCompleted: 18,
          averageQuizScore: 78,
          experiencePoints: 1100,
          level: 2,
          lastActivityDate: new Date()
        }
      },
      {
        email: 'alex.johnson@example.com',
        password: await bcrypt.hash('password123', 12),
        username: 'alexjohnson',
        firstName: 'Alex',
        lastName: 'Johnson',
        isEmailVerified: true,
        preferences: {
          themes: ['psychologie', 'persoenlichkeit', 'gesundheit-fitness'],
          notificationsEnabled: true,
          notificationTime: '07:00',
          language: 'de',
          timezone: 'Europe/Berlin',
          difficulty: 'advanced' as const
        },
        subscription: {
          plan: 'premium' as const,
          status: 'active' as const,
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-12-31')
        },
        learningStats: {
          currentStreak: 32,
          longestStreak: 45,
          totalLessonsCompleted: 78,
          totalQuizzesCompleted: 75,
          averageQuizScore: 92,
          experiencePoints: 3900,
          level: 4,
          lastActivityDate: new Date()
        }
      },
      {
        email: 'sarah.wilson@example.com',
        password: await bcrypt.hash('password123', 12),
        username: 'sarahwilson',
        firstName: 'Sarah',
        lastName: 'Wilson',
        isEmailVerified: false,
        preferences: {
          themes: ['business', 'marketing', 'produktivitaet'],
          notificationsEnabled: false,
          notificationTime: '18:00',
          language: 'de',
          timezone: 'Europe/Berlin',
          difficulty: 'intermediate' as const
        },
        subscription: {
          plan: 'free' as const,
          status: 'active' as const,
          startDate: new Date('2024-08-01')
        },
        learningStats: {
          currentStreak: 3,
          longestStreak: 7,
          totalLessonsCompleted: 12,
          totalQuizzesCompleted: 10,
          averageQuizScore: 72,
          experiencePoints: 600,
          level: 1,
          lastActivityDate: new Date()
        }
      },
      {
        email: 'mike.brown@example.com',
        password: await bcrypt.hash('password123', 12),
        username: 'mikebrown',
        firstName: 'Mike',
        lastName: 'Brown',
        isEmailVerified: true,
        preferences: {
          themes: ['sprachen-lernen', 'psychologie', 'design-ux'],
          notificationsEnabled: true,
          notificationTime: '10:00',
          language: 'de',
          timezone: 'Europe/Berlin',
          difficulty: 'beginner' as const
        },
        subscription: {
          plan: 'premium' as const,
          status: 'active' as const,
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-12-31')
        },
        learningStats: {
          currentStreak: 21,
          longestStreak: 28,
          totalLessonsCompleted: 56,
          totalQuizzesCompleted: 52,
          averageQuizScore: 88,
          experiencePoints: 2800,
          level: 3,
          lastActivityDate: new Date()
        }
      },
      {
        email: 'emma.davis@example.com',
        password: await bcrypt.hash('password123', 12),
        username: 'emmadavis',
        firstName: 'Emma',
        lastName: 'Davis',
        isEmailVerified: true,
        preferences: {
          themes: ['gesundheit-fitness', 'persoenlichkeit', 'produktivitaet'],
          notificationsEnabled: true,
          notificationTime: '06:30',
          language: 'de',
          timezone: 'Europe/Berlin',
          difficulty: 'intermediate' as const
        },
        subscription: {
          plan: 'free' as const,
          status: 'active' as const,
          startDate: new Date('2024-07-01')
        },
        learningStats: {
          currentStreak: 11,
          longestStreak: 15,
          totalLessonsCompleted: 28,
          totalQuizzesCompleted: 24,
          averageQuizScore: 81,
          experiencePoints: 1400,
          level: 2,
          lastActivityDate: new Date()
        }
      }
    ];

    const createdUsers = await User.insertMany(userData);
    
    console.log(`✅ Created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}; 