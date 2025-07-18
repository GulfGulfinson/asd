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
  },
  {
    name: 'Technologie & Programmierung',
    description: 'Software-Entwicklung, neue Technologien und IT-Trends',
    slug: 'technologie',
    color: '#6366F1',
    icon: '💻',
    isActive: true
  },
  {
    name: 'Wissenschaft & Forschung',
    description: 'Aktuelle Forschung, wissenschaftliche Methoden und Entdeckungen',
    slug: 'wissenschaft',
    color: '#14B8A6',
    icon: '🔬',
    isActive: true
  },
  {
    name: 'Kreativität & Kunst',
    description: 'Kreative Techniken, Kunstgeschichte und künstlerische Prozesse',
    slug: 'kreativitaet',
    color: '#F97316',
    icon: '🎭',
    isActive: true
  },
  {
    name: 'Umwelt & Nachhaltigkeit',
    description: 'Umweltschutz, nachhaltige Entwicklung und grüne Technologien',
    slug: 'umwelt',
    color: '#22C55E',
    icon: '🌱',
    isActive: true
  },
  {
    name: 'Geschichte & Kultur',
    description: 'Historische Ereignisse, kulturelle Entwicklungen und Traditionen',
    slug: 'geschichte',
    color: '#A855F7',
    icon: '📚',
    isActive: true
  },
  {
    name: 'Finanzen & Investment',
    description: 'Persönliche Finanzen, Investmentstrategien und Vermögensaufbau',
    slug: 'finanzen',
    color: '#059669',
    icon: '💰',
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