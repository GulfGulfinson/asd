const { seedThemes } = require('./src/seeders/themes');
const { seedLessons } = require('./src/seeders/lessons');
const mongoose = require('mongoose');
require('dotenv').config();

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dailylearn');
    console.log('Connected to MongoDB');
    
    const themes = await seedThemes();
    console.log(`✅ Seeded ${themes.length} themes`);
    
    const lessons = await seedLessons(themes);
    console.log(`✅ Seeded ${lessons.length} lessons`);
    
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeed(); 