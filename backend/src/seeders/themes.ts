import { Theme } from '../models';

const themeData = [
  {
    name: 'Gesundheit & Fitness',
    description: 'Lerne alles über körperliche und mentale Gesundheit, Ernährung und Fitness',
    slug: 'gesundheit-fitness',
    color: '#10B981',
    icon: '💪',
    isActive: true
  },
  {
    name: 'Sprachen lernen',
    description: 'Entdecke effektive Methoden zum Erlernen neuer Sprachen und Kulturen',
    slug: 'sprachen-lernen',
    color: '#8B5CF6',
    icon: '🌍',
    isActive: true
  },
  {
    name: 'Psychologie',
    description: 'Verstehe menschliches Verhalten, Emotionen und mentale Prozesse',
    slug: 'psychologie',
    color: '#3B82F6',
    icon: '🧠',
    isActive: true
  },
  {
    name: 'Business & Entrepreneurship',
    description: 'Geschäftsstrategien, Startup-Wissen und Unternehmensführung',
    slug: 'business',
    color: '#F59E0B',
    icon: '💼',
    isActive: true
  },
  {
    name: 'Design & UX',
    description: 'User Experience Design, UI Patterns und Design Thinking',
    slug: 'design-ux',
    color: '#EF4444',
    icon: '🎨',
    isActive: true
  },
  {
    name: 'Produktivität',
    description: 'Zeitmanagement, Arbeitsorganisation und persönliche Effizienz',
    slug: 'produktivitaet',
    color: '#06B6D4',
    icon: '⚡',
    isActive: true
  },
  {
    name: 'Marketing & Sales',
    description: 'Digitales Marketing, Verkaufsstrategien und Kundengewinnung',
    slug: 'marketing',
    color: '#84CC16',
    icon: '📈',
    isActive: true
  },
  {
    name: 'Persönlichkeitsentwicklung',
    description: 'Soft Skills, Kommunikation und persönliches Wachstum',
    slug: 'persoenlichkeit',
    color: '#EC4899',
    icon: '🌱',
    isActive: true
  }
];

export const seedThemes = async () => {
  try {
    // Clear existing themes
    await Theme.deleteMany({});
    
    // Create themes
    const themes = await Theme.insertMany(themeData);
    
    console.log(`✅ Created ${themes.length} themes`);
    return themes;
  } catch (error) {
    console.error('❌ Error seeding themes:', error);
    throw error;
  }
}; 