import mongoose from 'mongoose';
import config from '../config';
import { seedThemes } from './themes';
import { seedLessons } from './lessons';
import { seedQuizzes } from './quizzes';
import { seedUsers } from './users';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('🔗 Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Seeding is disabled in production environment');
      return;
    }
    
    // Seed data in order (dependencies matter)
    console.log('1️⃣ Seeding users...');
    const users = await seedUsers();
    
    console.log('\n2️⃣ Seeding themes...');
    const themes = await seedThemes();
    
    console.log('\n3️⃣ Seeding lessons...');
    const lessons = await seedLessons(themes);
    
    console.log('\n4️⃣ Seeding quizzes...');
    const quizzes = await seedQuizzes(lessons);
    
    // Log summary
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   🎯 Themes: ${themes.length}`);
    console.log(`   📚 Lessons: ${lessons.length}`);
    console.log(`   ❓ Quizzes: ${quizzes.length}`);
    
    console.log('\n🔑 Login credentials:');
    console.log('   Admin: admin@dailylearn.com / admin123');
    console.log('   Test Users: max@example.com / password123');
    console.log('                anna@example.com / password123');
    
    console.log('\n🚀 You can now start the server and test the API!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

const main = async () => {
  try {
    await connectDB();
    await seedDatabase();
  } catch (error) {
    console.error('❌ Seeding process failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seeder if this file is executed directly
if (require.main === module) {
  main();
}

export { seedDatabase, connectDB }; 