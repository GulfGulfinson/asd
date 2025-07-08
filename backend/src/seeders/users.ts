import bcrypt from 'bcrypt';
import { User } from '../models';

export const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});

    const users = [
      {
        username: 'admin',
        email: 'admin@dailylearn.com',
        password: await bcrypt.hash('admin123', 12),
        firstName: 'Admin',
        lastName: 'User',
        isEmailVerified: true,
        preferences: {
          themes: ['programmierung', 'data-science', 'web-development'],
          notificationsEnabled: true,
          notificationTime: '09:00',
          language: 'de',
          timezone: 'Europe/Berlin',
          difficulty: 'advanced' as const
        },
        subscription: {
          plan: 'premium' as const,
          status: 'active' as const,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2025-01-01')
        },
        learningStats: {
          currentStreak: 15,
          longestStreak: 30,
          totalLessonsCompleted: 45,
          totalQuizzesCompleted: 40,
          averageQuizScore: 85,
          experiencePoints: 2250,
          level: 5,
          lastActivityDate: new Date()
        },
        lastLoginAt: new Date()
      },
      {
        username: 'max_mustermann',
        email: 'max@example.com',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Max',
        lastName: 'Mustermann',
        isEmailVerified: true,
        preferences: {
          themes: ['programmierung', 'web-development'],
          notificationsEnabled: true,
          notificationTime: '08:30',
          language: 'de',
          timezone: 'Europe/Berlin',
          difficulty: 'intermediate' as const
        },
        subscription: {
          plan: 'premium' as const,
          status: 'active' as const,
          startDate: new Date('2024-02-15'),
          endDate: new Date('2025-02-15')
        },
        learningStats: {
          currentStreak: 7,
          longestStreak: 12,
          totalLessonsCompleted: 23,
          totalQuizzesCompleted: 20,
          averageQuizScore: 78,
          experiencePoints: 1150,
          level: 3,
          lastActivityDate: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        username: 'anna_schmidt',
        email: 'anna@example.com',
        password: await bcrypt.hash('secure456', 12),
        firstName: 'Anna',
        lastName: 'Schmidt',
        isEmailVerified: true,
        preferences: {
          themes: ['data-science', 'business'],
          notificationsEnabled: false,
          notificationTime: '19:00',
          language: 'de',
          timezone: 'Europe/Berlin',
          difficulty: 'beginner' as const
        },
        subscription: {
          plan: 'free' as const,
          status: 'active' as const
        },
        learningStats: {
          currentStreak: 3,
          longestStreak: 8,
          totalLessonsCompleted: 12,
          totalQuizzesCompleted: 10,
          averageQuizScore: 72,
          experiencePoints: 600,
          level: 2,
          lastActivityDate: new Date(Date.now() - 48 * 60 * 60 * 1000)
        },
        lastLoginAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        username: 'tom_weber',
        email: 'tom@example.com',
        password: await bcrypt.hash('mypass789', 12),
        firstName: 'Tom',
        lastName: 'Weber',
        isEmailVerified: false,
        preferences: {
          themes: ['design-ux', 'marketing'],
          notificationsEnabled: true,
          notificationTime: '10:00',
          language: 'de',
          timezone: 'Europe/Berlin',
          difficulty: 'intermediate' as const
        },
        subscription: {
          plan: 'free' as const,
          status: 'active' as const
        },
        learningStats: {
          currentStreak: 0,
          longestStreak: 5,
          totalLessonsCompleted: 8,
          totalQuizzesCompleted: 6,
          averageQuizScore: 65,
          experiencePoints: 320,
          level: 1,
          lastActivityDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        lastLoginAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        username: 'lisa_mueller',
        email: 'lisa@example.com',
        password: await bcrypt.hash('lisa2024', 12),
        firstName: 'Lisa',
        lastName: 'Müller',
        isEmailVerified: true,
        preferences: {
          themes: ['productivity', 'business'],
          notificationsEnabled: true,
          notificationTime: '07:30',
          language: 'de',
          timezone: 'Europe/Berlin',
          difficulty: 'advanced' as const
        },
        subscription: {
          plan: 'premium' as const,
          status: 'active' as const,
          startDate: new Date('2024-03-01'),
          endDate: new Date('2025-03-01')
        },
        learningStats: {
          currentStreak: 25,
          longestStreak: 35,
          totalLessonsCompleted: 67,
          totalQuizzesCompleted: 62,
          averageQuizScore: 91,
          experiencePoints: 3350,
          level: 7,
          lastActivityDate: new Date()
        },
        lastLoginAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Log sample credentials for testing
    console.log('\n📋 Sample login credentials:');
    console.log('Admin: admin@dailylearn.com / admin123');
    console.log('User 1: max@example.com / password123');
    console.log('User 2: anna@example.com / secure456');
    
    return createdUsers;
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}; 