import { Lesson } from '../models';

const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.split(' ').length;
  return Math.ceil(words / wordsPerMinute);
};

// Realistic image URLs for lessons
const getImageForTheme = (themeSlug: string, index: number = 0): string => {
  const imageMap: Record<string, string[]> = {
    'gesundheit-fitness': [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600'
    ],
    'sprachen-lernen': [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'
    ],
    'psychologie': [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600'
    ],
    'business': [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600'
    ],
    'design-ux': [
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600',
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600'
    ],
    'produktivitaet': [
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600',
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600'
    ],
    'marketing': [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
      'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=600'
    ],
    'persoenlichkeit': [
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600'
    ],
    'technologie': [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600'
    ],
    'wissenschaft': [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600',
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600'
    ],
    'kreativitaet': [
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
    ],
    'umwelt': [
      'https://images.unsplash.com/photo-1569163139394-de4e5f43e4e3?w=600',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'
    ],
    'geschichte': [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600'
    ],
    'finanzen': [
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600',
      'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600'
    ]
  };
  
  const images = imageMap[themeSlug] || ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600'];
  return images[index % images.length];
};

export const seedLessons = async (themes: any[]) => {
  try {
    // Clear existing lessons
    await Lesson.deleteMany({});
    
    const lessons = [];
    
    for (const theme of themes) {
      // Create 3-4 lessons per theme for better content variety
      const lessonsForTheme = await createLessonsForTheme(theme);
      lessons.push(...lessonsForTheme);
    }
    
    const createdLessons = await Lesson.insertMany(lessons);
    console.log(`✅ Created ${createdLessons.length} lessons`);
    return createdLessons;
  } catch (error) {
    console.error('❌ Error seeding lessons:', error);
    throw error;
  }
};

const createLessonsForTheme = async (theme: any) => {
  const lessonTemplates = getLessonTemplatesForTheme(theme.slug);
  
  return lessonTemplates.map((template, index) => ({
    title: template.title,
    content: template.content,
    summary: template.summary,
    imageUrl: getImageForTheme(theme.slug, index),
    themeId: theme._id,
    difficulty: template.difficulty,
    estimatedReadTime: calculateReadTime(template.content),
    tags: template.tags,
    isPublished: true,
    publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    viewsCount: Math.floor(Math.random() * 2000) + 100,
  }));
};

const getLessonTemplatesForTheme = (themeSlug: string) => {
  const templates: Record<string, any[]> = {
    'gesundheit-fitness': [
      {
        title: 'Grundlagen einer gesunden Ernährung',
        summary: 'Lerne die Basics einer ausgewogenen Ernährung für mehr Energie und Wohlbefinden.',
        content: `
# Grundlagen einer gesunden Ernährung

Eine ausgewogene Ernährung ist die Basis für körperliche und mentale Gesundheit.

## Die wichtigsten Nährstoffe

**Makronährstoffe:**
- Kohlenhydrate (45-65% der Kalorien)
- Proteine (10-35% der Kalorien)  
- Fette (20-35% der Kalorien)

**Mikronährstoffe:**
- Vitamine (A, B, C, D, E, K)
- Mineralstoffe (Eisen, Calcium, Magnesium)

## Praktische Tipps

**Teller-Regel:**
- 1/2 Teller: Gemüse und Obst
- 1/4 Teller: Vollkornprodukte
- 1/4 Teller: Proteine

**Hydratation:**
- 2-3 Liter Wasser täglich
- Weniger zuckerhaltige Getränke

Eine gesunde Ernährung muss nicht kompliziert sein!
        `,
        difficulty: 'beginner',
        tags: ['ernährung', 'gesundheit', 'basics', 'nährstoffe']
      },
      {
        title: 'Fitness für Einsteiger: Der richtige Start',
        summary: 'Wie du als Anfänger sicher und effektiv mit dem Training beginnst.',
        content: `
# Fitness für Einsteiger

Der Einstieg ins Training kann überwältigend wirken - hier sind die wichtigsten Grundlagen.

## Trainingsarten

**Ausdauertraining:**
- 3-4x pro Woche, 30-45 Minuten
- Laufen, Radfahren, Schwimmen

**Krafttraining:**
- 2-3x pro Woche
- Alle großen Muskelgruppen
- 8-12 Wiederholungen

## Sicherheit geht vor

**Warm-up:**
- 5-10 Minuten aufwärmen
- Gelenke mobilisieren

**Cool-down:**
- 5-10 Minuten dehnen
- Herzfrequenz senken

**Progression:**
- Langsam steigern
- Pausen einhalten
- Auf den Körper hören

Konsistenz ist wichtiger als Intensität!
        `,
        difficulty: 'beginner',
        tags: ['fitness', 'training', 'anfänger', 'sicherheit']
      }
    ],
    
    'sprachen-lernen': [
      {
        title: 'Effektive Sprachlernmethoden',
        summary: 'Entdecke bewährte Techniken zum schnellen und nachhaltigen Sprachenlernen.',
        content: `
# Effektive Sprachlernmethoden

Das richtige Vorgehen macht den Unterschied beim Sprachenlernen.

## Die 4 Grundfertigkeiten

**Hören:**
- Podcasts und Musik
- Filme mit Untertiteln
- Native Speaker

**Sprechen:**
- Sprachpartner finden
- Laut vorlesen
- Selbstgespräche führen

**Lesen:**
- Einfache Texte beginnen
- Vokabeln im Kontext lernen
- Regelmäßig praktizieren

**Schreiben:**
- Tagebuch führen
- Nachrichten schreiben
- Grammatik anwenden

## Erfolgsstrategien

**Immersion:**
- Sprache in den Alltag integrieren
- Handy auf Zielsprache umstellen

**Wiederholung:**
- Spaced Repetition System
- Tägliche Praxis

Kleine, konstante Schritte führen zum Erfolg!
        `,
        difficulty: 'beginner',
        tags: ['sprachenlernen', 'methoden', 'fertigkeiten', 'strategien']
      },
      {
        title: 'Vokabeln effektiv lernen und behalten',
        summary: 'Bewährte Techniken zum nachhaltigen Vokabellernen.',
        content: `
# Vokabeln effektiv lernen

Das Vokabellernen muss nicht langweilig sein - hier sind moderne Ansätze.

## Lernstrategien

**Spaced Repetition:**
- Wiederholung in Intervallen
- Apps wie Anki oder Memrise
- Langzeitgedächtnis aktivieren

**Kontext-Lernen:**
- Wörter in Sätzen lernen
- Geschichten erfinden
- Bilder verknüpfen

**Aktive Anwendung:**
- Vokabeln sofort verwenden
- Gespräche führen
- Texte schreiben

## Techniken

**Mnemonics:**
- Eselsbrücken bauen
- Visuelle Verknüpfungen
- Emotionen einbeziehen

**Chunking:**
- Wortgruppen lernen
- Phrasen statt Einzelwörter
- Kollokationen beachten

Verstehen ist wichtiger als auswendig lernen!
        `,
        difficulty: 'intermediate',
        tags: ['vokabeln', 'gedächtnis', 'repetition', 'techniken']
      }
    ],
    
    'psychologie': [
      {
        title: 'Grundlagen der menschlichen Psyche',
        summary: 'Verstehe die Basics von Denken, Fühlen und Verhalten.',
        content: `
# Grundlagen der menschlichen Psyche

Die Psychologie hilft uns, uns selbst und andere besser zu verstehen.

## Bereiche der Psyche

**Bewusstsein:**
- Aktuelle Gedanken und Wahrnehmungen
- Aufmerksamkeit und Fokus
- Bewusste Entscheidungen

**Unterbewusstsein:**
- Automatische Prozesse
- Gewohnheiten und Reflexe
- Emotionale Reaktionen

**Unbewusstes:**
- Verdrängte Erinnerungen
- Tiefe Motivationen
- Archetypen und Instinkte

## Grundemotionen

**Die "Big 6":**
- Freude - Belohnung und Bindung
- Angst - Schutz vor Gefahr
- Wut - Grenzen setzen
- Trauer - Verlustverarbeitung
- Überraschung - Lernen und Anpassung
- Ekel - Vermeidung von Schäden

## Kognitive Prozesse

**Wahrnehmung:**
- Selektion von Informationen
- Interpretation basierend auf Erfahrung

**Gedächtnis:**
- Encoding, Storage, Retrieval
- Kurz- und Langzeitgedächtnis

Selbstverständnis ist der erste Schritt zur Veränderung!
        `,
        difficulty: 'beginner',
        tags: ['psychologie', 'bewusstsein', 'emotionen', 'kognition']
      },
      {
        title: 'Stressmanagement und Resilienz',
        summary: 'Lerne, wie du mit Stress umgehst und deine Widerstandskraft stärkst.',
        content: `
# Stressmanagement und Resilienz

Stress ist unvermeidlich - der Umgang damit macht den Unterschied.

## Stress verstehen

**Positiver Stress (Eustress):**
- Motivation und Leistung
- Kurzfristige Herausforderungen
- Wachstum und Entwicklung

**Negativer Stress (Distress):**
- Überforderung und Erschöpfung
- Langfristige Belastung
- Gesundheitliche Probleme

## Stressbewältigung

**Problemorientiert:**
- Ursachen identifizieren
- Lösungen entwickeln
- Aktiv handeln

**Emotionsorientiert:**
- Entspannungstechniken
- Atemübungen
- Meditation und Achtsamkeit

## Resilienz aufbauen

**Die 7 Säulen:**
- Optimismus kultivieren
- Akzeptanz entwickeln
- Lösungsorientierung
- Selbstregulation
- Verantwortung übernehmen
- Beziehungen pflegen
- Zukunft planen

Krisen sind Chancen für Wachstum!
        `,
        difficulty: 'intermediate',
        tags: ['stress', 'resilienz', 'bewältigung', 'achtsamkeit']
      }
    ],
    
    'business': [
      {
        title: 'Startup Grundlagen: Von der Idee zum Unternehmen',
        summary: 'Die wichtigsten Schritte zum Aufbau eines erfolgreichen Startups.',
        content: `
# Startup Grundlagen

Ein Startup zu gründen ist eine spannende Reise mit klaren Erfolgsprinzipien.

## Was ist ein Startup?

**Merkmale:**
- Skalierbares Geschäftsmodell
- Innovative Problemlösung
- Schnelles Wachstum
- Hohe Unsicherheit

## Die ersten Schritte

**1. Problemvalidierung:**
- Echtes Problem identifizieren
- Zielgruppe befragen
- Marktgröße einschätzen

**2. MVP entwickeln:**
- Minimum Viable Product
- Kernfunktion fokussieren
- Schnell testen und lernen

**3. Business Model Canvas:**
- 9 Schlüsselbereiche definieren
- Hypothesen aufstellen
- Iterativ verbessern

## Lean Startup Methodik

**Build-Measure-Learn:**
- Schnell bauen
- Daten sammeln
- Erkenntnisse ableiten
- Anpassen oder weitermachen

Scheitern ist Teil des Lernprozesses!
        `,
        difficulty: 'intermediate',
        tags: ['startup', 'geschäftsmodell', 'mvp', 'lean']
      },
      {
        title: 'Grundlagen des Projektmanagements',
        summary: 'Wie du Projekte erfolgreich planst, durchführst und abschließt.',
        content: `
# Grundlagen des Projektmanagements

Projekte erfolgreich zu leiten ist eine Schlüsselkompetenz in der Geschäftswelt.

## Was ist ein Projekt?

**Eigenschaften:**
- Einmaligkeit
- Definiertes Ziel
- Begrenzter Zeitrahmen
- Bestimmte Ressourcen

## Die 5 Phasen

**1. Initiierung:**
- Projektauftrag definieren
- Stakeholder identifizieren
- Ziele festlegen

**2. Planung:**
- Arbeitspaket erstellen
- Zeitplan entwickeln
- Ressourcen planen

**3. Durchführung:**
- Team koordinieren
- Qualität sichern
- Kommunikation managen

**4. Kontrolle:**
- Fortschritt überwachen
- Abweichungen korrigieren
- Risiken managen

**5. Abschluss:**
- Ergebnisse übergeben
- Lessons Learned dokumentieren

## Erfolgstools

**Gantt-Charts:** Zeitplanung visualisieren
**Kanban-Boards:** Workflow optimieren
**Risk Register:** Risiken verwalten

Gute Planung ist der halbe Erfolg!
        `,
        difficulty: 'beginner',
        tags: ['projektmanagement', 'planung', 'führung', 'organisation']
      }
    ],
    
    'design-ux': [
      {
        title: 'UX Design Grundlagen: Nutzerzentrisches Design',
        summary: 'Die Prinzipien von User Experience Design und nutzerfreundlichen Interfaces.',
        content: `
# UX Design Grundlagen

User Experience Design stellt den Nutzer in den Mittelpunkt aller Entscheidungen.

## Was ist UX Design?

**4 Dimensionen:**
- Usability - Wie einfach zu nutzen?
- Utility - Löst es das Problem?
- Desirability - Wollen Menschen es nutzen?
- Accessibility - Für alle zugänglich?

## Der UX Design Prozess

**1. Research:**
- User Interviews
- Beobachtung
- Datenanalyse

**2. Define:**
- Personas erstellen
- User Journey mapping
- Problem definieren

**3. Ideate:**
- Brainstorming
- Sketching
- Lösungsansätze entwickeln

**4. Prototype:**
- Low-fidelity Wireframes
- Interaktive Prototypen
- Rapid Testing

**5. Test:**
- Usability Tests
- A/B Testing
- Iteration

## Design Prinzipien

**Consistency:** Einheitliche Patterns
**Feedback:** Nutzer informieren
**Affordances:** Intuitiv bedienbar

Gutes Design ist unsichtbar!
        `,
        difficulty: 'intermediate',
        tags: ['ux-design', 'user-research', 'prototyping', 'usability']
      },
      {
        title: 'Farbtheorie und visuelles Design',
        summary: 'Wie Farben wirken und wie du sie effektiv in deinen Designs einsetzt.',
        content: `
# Farbtheorie und visuelles Design

Farben haben eine starke psychologische Wirkung und sind ein mächtiges Design-Tool.

## Grundlagen der Farbtheorie

**Primärfarben:** Rot, Blau, Gelb
**Sekundärfarben:** Grün, Orange, Violett
**Tertiärfarben:** Mischungen aus Primär und Sekundär

## Farbharmonien

**Komplementär:** Gegenüberliegende Farben
**Analog:** Benachbarte Farben
**Triadisch:** Drei gleichmäßig verteilte Farben
**Monochromatisch:** Verschiedene Töne einer Farbe

## Psychologie der Farben

**Rot:** Energie, Leidenschaft, Dringlichkeit
**Blau:** Vertrauen, Ruhe, Professionalität
**Grün:** Natur, Wachstum, Sicherheit
**Gelb:** Optimismus, Kreativität, Aufmerksamkeit
**Schwarz:** Eleganz, Kraft, Autorität
**Weiß:** Reinheit, Einfachheit, Minimalismus

## Praktische Anwendung

**60-30-10 Regel:**
- 60% Hauptfarbe (neutral)
- 30% Sekundärfarbe
- 10% Akzentfarbe

**Kontrast beachten:**
- Lesbarkeit sicherstellen
- Barrierefreiheit bedenken

Farben erzählen Geschichten!
        `,
        difficulty: 'beginner',
        tags: ['farben', 'design', 'psychologie', 'harmonie']
      }
    ],
    
    'produktivitaet': [
      {
        title: 'Zeitmanagement: Die wichtigsten Techniken',
        summary: 'Bewährte Methoden für effektives Zeitmanagement und bessere Produktivität.',
        content: `
# Zeitmanagement Techniken

Zeit ist unsere wertvollste Ressource - hier lernst du sie optimal zu nutzen.

## Die Pomodoro-Technik

**Ablauf:**
- 25 Minuten fokussiert arbeiten
- 5 Minuten Pause
- Nach 4 Zyklen: 30 Minuten Pause

**Vorteile:**
- Verbesserte Konzentration
- Weniger Prokrastination
- Messbare Fortschritte

## Eisenhower-Matrix

**Quadranten:**
- **Wichtig + Dringend:** Sofort erledigen
- **Wichtig + Nicht dringend:** Planen
- **Unwichtig + Dringend:** Delegieren
- **Unwichtig + Nicht dringend:** Eliminieren

## Getting Things Done (GTD)

**5 Schritte:**
1. Erfassen - Alles sammeln
2. Klären - Was bedeutet es?
3. Organisieren - Wo gehört es hin?
4. Reflektieren - Regelmäßig überprüfen
5. Erledigen - Vertrauen und handeln

## Time Blocking

**Prinzip:**
- Kalender für alle Aktivitäten
- Realistische Zeitschätzungen
- Pufferzeiten einplanen

Zeit managen heißt Prioritäten setzen!
        `,
        difficulty: 'beginner',
        tags: ['zeitmanagement', 'produktivität', 'pomodoro', 'prioritäten']
      },
      {
        title: 'Digitale Tools für mehr Effizienz',
        summary: 'Die besten Apps und Tools für Organisation und Produktivität.',
        content: `
# Digitale Produktivitäts-Tools

Die richtigen Tools können deine Effizienz drastisch steigern.

## Task Management

**Todoist:**
- Projektorganisation
- Natural Language Processing
- Karma-System

**Notion:**
- All-in-One Workspace
- Datenbanken und Templates
- Team-Kollaboration

**Trello:**
- Kanban-Boards
- Einfache Bedienung
- Visual Organization

## Zeiterfassung

**RescueTime:**
- Automatisches Tracking
- Detaillierte Reports
- Distraction Blocking

**Toggl:**
- Manuelles Time Tracking
- Projekt-Kategorisierung
- Team-Features

## Notizen und Wissen

**Obsidian:**
- Verknüpfte Notizen
- Graph View
- Lokale Dateien

**Evernote:**
- Web Clipper
- OCR für Bilder
- Cross-Platform

## Automatisierung

**Zapier:**
- App-Integrationen
- Workflow-Automatisierung
- Trigger und Aktionen

**IFTTT:**
- Einfache Automatisierung
- Smart Home Integration

Die besten Tools sind die, die du auch nutzt!
        `,
        difficulty: 'intermediate',
        tags: ['tools', 'apps', 'automatisierung', 'organisation']
      }
    ],
    
    'marketing': [
      {
        title: 'Grundlagen des digitalen Marketings',
        summary: 'Einführung in die wichtigsten Kanäle und Strategien des Online-Marketings.',
        content: `
# Grundlagen des digitalen Marketings

Digitales Marketing ist heute essentiell für jedes Unternehmen.

## Die wichtigsten Kanäle

**Content Marketing:**
- Wertvolle Inhalte erstellen
- SEO-optimiert schreiben
- Zielgruppe informieren

**Social Media Marketing:**
- Community aufbauen
- Engagement fördern
- Brand Awareness steigern

**E-Mail Marketing:**
- Newsletter und Automation
- Personalisierte Nachrichten
- Hoher ROI

**SEO (Search Engine Optimization):**
- Sichtbarkeit in Suchmaschinen
- Organischer Traffic
- Langfristige Strategie

## Customer Journey

**Awareness:** Aufmerksamkeit erzeugen
**Interest:** Interesse wecken
**Consideration:** Optionen bewerten
**Purchase:** Kaufentscheidung
**Retention:** Kundenbindung
**Advocacy:** Weiterempfehlung

## Metriken und KPIs

**Awareness:** Reach, Impressions
**Engagement:** Clicks, Time on Site
**Conversion:** Leads, Sales
**Retention:** Customer Lifetime Value

Messe alles, verbessere kontinuierlich!
        `,
        difficulty: 'beginner',
        tags: ['marketing', 'digital', 'kanäle', 'strategie']
      },
      {
        title: 'Social Media Marketing erfolgreich umsetzen',
        summary: 'Wie du Social Media Kanäle strategisch für dein Business nutzt.',
        content: `
# Social Media Marketing

Social Media ist mehr als nur Posting - es ist strategische Kommunikation.

## Platform-spezifische Strategien

**LinkedIn:**
- B2B Networking
- Thought Leadership
- Professional Content

**Instagram:**
- Visual Storytelling
- Influencer Marketing
- Stories und Reels

**Facebook:**
- Community Building
- Detailed Targeting
- Event Promotion

**TikTok:**
- Trend-basierter Content
- Authentische Videos
- Junge Zielgruppe

## Content-Strategie

**80/20 Regel:**
- 80% wertvoller Content
- 20% Werbung/Sales

**Content-Typen:**
- Educational Posts
- Behind-the-Scenes
- User-Generated Content
- Polls und Q&As

## Community Management

**Engagement:**
- Schnell antworten
- Persönlich kommunizieren
- Wertschätzung zeigen

**Crisis Management:**
- Transparent kommunizieren
- Verantwortung übernehmen
- Lösungen anbieten

## Analytics und Optimierung

**Wichtige Metriken:**
- Reach und Impressions
- Engagement Rate
- Follower Growth
- Click-Through Rate

Social Media ist ein Marathon, kein Sprint!
        `,
        difficulty: 'intermediate',
        tags: ['social-media', 'content', 'engagement', 'analytics']
      }
    ],
    
    'persoenlichkeit': [
      {
        title: 'Kommunikationsfähigkeiten verbessern',
        summary: 'Wie du überzeugend und empathisch kommunizierst.',
        content: `
# Kommunikationsfähigkeiten

Gute Kommunikation ist die Basis für Erfolg in allen Lebensbereichen.

## Grundlagen der Kommunikation

**Das Kommunikationsmodell:**
- Sender - Nachricht - Empfänger
- Feedback-Schleife
- Störungen und Filter

**Verbale Kommunikation:**
- Klare Sprache
- Struktur und Logik
- Ton und Betonung

**Nonverbale Kommunikation:**
- Körpersprache (55%)
- Stimme (38%)
- Worte (7%)

## Aktives Zuhören

**Techniken:**
- Vollständige Aufmerksamkeit
- Paraphrasieren
- Nachfragen stellen
- Gefühle spiegeln

**Empathie zeigen:**
- Perspektive wechseln
- Emotionen anerkennen
- Verständnis ausdrücken

## Schwierige Gespräche führen

**Vorbereitung:**
- Ziele definieren
- Argumente sammeln
- Win-Win Lösungen suchen

**Gesprächsführung:**
- Ruhig bleiben
- Sachlich argumentieren
- Kompromisse finden

Kommunikation ist ein Tanz, nicht ein Kampf!
        `,
        difficulty: 'beginner',
        tags: ['kommunikation', 'zuhören', 'empathie', 'gespräche']
      },
      {
        title: 'Selbstbewusstsein und Charisma entwickeln',
        summary: 'Wie du selbstbewusst auftrittst und charismatisch wirkst.',
        content: `
# Selbstbewusstsein und Charisma

Charisma ist erlernbar und beginnt mit echtem Selbstbewusstsein.

## Selbstbewusstsein aufbauen

**Selbstreflexion:**
- Stärken und Schwächen kennen
- Werte definieren
- Erfolge anerkennen

**Komfortzone erweitern:**
- Neue Herausforderungen
- Kleine Schritte wagen
- Aus Fehlern lernen

**Positive Selbstgespräche:**
- Innere Kritik beobachten
- Affirmationen nutzen
- Erfolge feiern

## Charisma entwickeln

**Authentizität:**
- Zu sich selbst stehen
- Ehrlich kommunizieren
- Masken fallen lassen

**Präsenz:**
- Im Moment sein
- Vollständige Aufmerksamkeit
- Energie ausstrahlen

**Empathie:**
- Andere verstehen
- Mitgefühl zeigen
- Verbindungen schaffen

## Körpersprache und Ausstrahlung

**Power Posing:**
- Aufrechte Haltung
- Offene Gestik
- Blickkontakt halten

**Stimme trainieren:**
- Tief und ruhig sprechen
- Pausen setzen
- Deutlich artikulieren

Wahre Stärke kommt von innen!
        `,
        difficulty: 'intermediate',
        tags: ['selbstbewusstsein', 'charisma', 'authentizität', 'ausstrahlung']
      }
    ],
    
    'technologie': [
      {
        title: 'Einführung in Künstliche Intelligenz',
        summary: 'Verstehe die Grundlagen von KI und ihre Anwendungen im Alltag.',
        content: `
# Künstliche Intelligenz verstehen

KI ist nicht mehr Science Fiction - sie ist bereits überall um uns herum.

## Was ist KI?

**Definition:**
- Maschinen, die intelligent handeln
- Lernen aus Daten
- Probleme selbstständig lösen

**Arten von KI:**
- Schwache KI (spezielle Aufgaben)
- Starke KI (allgemeine Intelligenz)
- Superintelligenz (theoretisch)

## Machine Learning Grundlagen

**Lernarten:**
- Überwachtes Lernen
- Unüberwachtes Lernen
- Verstärkendes Lernen

**Anwendungen:**
- Bilderkennung
- Sprachverarbeitung
- Empfehlungssysteme
- Autonome Fahrzeuge

## KI im Alltag

**Beispiele:**
- Suchmaschinen
- Sprachassistenten
- Social Media Feeds
- Online-Shopping

**Zukunftsperspektiven:**
- Automatisierung
- Personalisierung
- Effizienzsteigerung
- Neue Berufsfelder

KI wird nicht Jobs ersetzen, sondern Menschen, die KI nutzen!
        `,
        difficulty: 'beginner',
        tags: ['ki', 'machine-learning', 'technologie', 'zukunft']
      },
      {
        title: 'Grundlagen der Cybersicherheit',
        summary: 'Wie du dich und deine Daten im Internet schützt.',
        content: `
# Cybersicherheit im digitalen Zeitalter

Online-Sicherheit ist heute essentiell für jeden Internetnutzer.

## Häufige Bedrohungen

**Malware:**
- Viren und Trojaner
- Ransomware
- Spyware
- Adware

**Phishing:**
- Gefälschte E-Mails
- Fake-Websites
- Social Engineering
- Identitätsdiebstahl

## Schutzmaßnahmen

**Passwort-Sicherheit:**
- Komplexe Passwörter
- Einzigartige Passwörter
- Passwort-Manager
- Zwei-Faktor-Authentifizierung

**Software-Updates:**
- Regelmäßige Updates
- Antivirus-Software
- Firewall aktivieren
- Sichere Browser

## Best Practices

**E-Mail-Sicherheit:**
- Absender prüfen
- Links nicht klicken
- Anhänge scannen
- Gesunder Menschenverstand

**Social Media:**
- Privatsphäre-Einstellungen
- Vorsicht bei persönlichen Daten
- Unbekannte nicht akzeptieren

Online-Sicherheit ist wie das Anschnallen im Auto - selbstverständlich!
        `,
        difficulty: 'beginner',
        tags: ['cybersicherheit', 'passwörter', 'phishing', 'malware']
      }
    ],
    
    'wissenschaft': [
      {
        title: 'Klimawandel verstehen: Fakten und Folgen',
        summary: 'Die wissenschaftlichen Grundlagen des Klimawandels und seine Auswirkungen.',
        content: `
# Klimawandel: Die wissenschaftlichen Fakten

Der Klimawandel ist eine der größten Herausforderungen unserer Zeit.

## Die Wissenschaft dahinter

**Treibhauseffekt:**
- Natürlicher Prozess
- Verstärkung durch Menschheit
- CO2 und andere Gase
- Energiebilanz der Erde

**Belege für den Wandel:**
- Temperaturanstieg
- Schmelzende Gletscher
- Meeresspiegel-Anstieg
- Extreme Wetterereignisse

## Ursachen und Verursacher

**Hauptfaktoren:**
- Verbrennung fossiler Brennstoffe
- Entwaldung
- Industrielle Prozesse
- Landwirtschaft

**Messbare Trends:**
- CO2-Konzentration steigt
- Durchschnittstemperatur +1,1°C
- Ozeanversauerung
- Artensterben

## Folgen und Szenarien

**Kurzfristige Auswirkungen:**
- Extremwetter nimmt zu
- Dürren und Überschwemmungen
- Ernteausfälle
- Gesundheitsrisiken

**Langfristige Perspektiven:**
- Meeresspiegel-Anstieg
- Unbewohnbare Regionen
- Klimaflüchtlinge
- Ökosystem-Kollaps

Die Wissenschaft ist eindeutig - jetzt ist Handeln gefragt!
        `,
        difficulty: 'intermediate',
        tags: ['klimawandel', 'wissenschaft', 'umwelt', 'treibhauseffekt']
      },
      {
        title: 'Quantenphysik für Einsteiger',
        summary: 'Die faszinierende Welt der Quanten einfach erklärt.',
        content: `
# Quantenphysik: Die Welt der kleinsten Teilchen

Quantenphysik revolutioniert unser Verständnis der Realität.

## Quantenwelt vs. Alltagswelt

**Klassische Physik:**
- Vorhersagbar
- Deterministisch
- Makroskopische Objekte
- Newton'sche Gesetze

**Quantenphysik:**
- Wahrscheinlichkeiten
- Unschärfeprinzip
- Subatomare Teilchen
- Quantenmechanik

## Grundprinzipien

**Welle-Teilchen-Dualismus:**
- Licht als Welle und Teilchen
- Elektronen verhalten sich ähnlich
- Beobachtereffekt
- Doppelspalt-Experiment

**Quantensuperposition:**
- Teilchen in mehreren Zuständen
- Schrödinger's Katze
- Kollaps der Wellenfunktion

## Praktische Anwendungen

**Moderne Technologien:**
- Laser und LED
- Computerchips
- MRT-Scans
- GPS-Navigation

**Zukunftstechnologien:**
- Quantencomputer
- Quantenkryptografie
- Quantenteleportation
- Neue Materialien

Die Quantenwelt ist bizarr, aber sie funktioniert!
        `,
        difficulty: 'advanced',
        tags: ['quantenphysik', 'wissenschaft', 'technologie', 'theorie']
      }
    ],
    
    'kreativitaet': [
      {
        title: 'Design Thinking: Kreative Problemlösung',
        summary: 'Lerne die Methode des Design Thinking für innovative Lösungen.',
        content: `
# Design Thinking Prozess

Design Thinking ist ein strukturierter Ansatz für kreative Innovation.

## Die 5 Phasen

**1. Verstehen (Empathize):**
- Nutzer beobachten
- Interviews führen
- Bedürfnisse erforschen
- Empathie entwickeln

**2. Definieren (Define):**
- Problem eingrenzen
- Point of View formulieren
- Challenge definieren
- Zielgruppe konkretisieren

**3. Ideenfindung (Ideate):**
- Brainstorming
- Wilde Ideen sammeln
- Quantität vor Qualität
- Bewertung vermeiden

**4. Prototyping:**
- Schnelle Umsetzung
- Testbare Versionen
- Einfache Materialien
- Iterative Entwicklung

**5. Testen:**
- Nutzer-Feedback
- Schwächen identifizieren
- Verbesserungen ableiten
- Erneut iterieren

## Kreativitätstechniken

**Brainstorming-Regeln:**
- Kritik vermeiden
- Auf Ideen anderer aufbauen
- Visualisieren
- Fokus halten

**Andere Methoden:**
- Mind Mapping
- SCAMPER-Technik
- 6-3-5 Methode
- Analogie-Denken

Innovation entsteht durch strukturierte Kreativität!
        `,
        difficulty: 'intermediate',
        tags: ['design-thinking', 'kreativität', 'innovation', 'problemlösung']
      },
      {
        title: 'Kreativität im Alltag steigern',
        summary: 'Praktische Übungen um deine Kreativität zu fördern.',
        content: `
# Kreativität trainieren

Kreativität ist wie ein Muskel - sie muss trainiert werden.

## Was hemmt Kreativität?

**Mentale Blockaden:**
- Perfektionismus
- Angst vor Fehlern
- Zu schnelle Bewertung
- Routinen und Gewohnheiten

**Externe Faktoren:**
- Zeitdruck
- Kritische Umgebung
- Ablenkungen
- Stress

## Kreativitäts-Booster

**Tägliche Übungen:**
- Morgenseiten schreiben
- Neue Wege zur Arbeit
- Andere Hand benutzen
- Farben bewusst wahrnehmen

**Inspiration suchen:**
- Museen besuchen
- Verschiedene Musik hören
- Mit Kindern spielen
- Natur beobachten

## Kreative Gewohnheiten

**Umgebung gestalten:**
- Inspirierenden Arbeitsplatz
- Materialien bereitstellen
- Ablenkungen minimieren
- Komfortzone verlassen

**Regelmäßige Praxis:**
- Tägliche kreative Zeit
- Experimentieren erlauben
- Fehler feiern
- Fortschritte dokumentieren

Kreativität ist nicht Talent, sondern Übung!
        `,
        difficulty: 'beginner',
        tags: ['kreativität', 'übungen', 'alltag', 'inspiration']
      }
    ],
    
    'umwelt': [
      {
        title: 'Nachhaltigkeit im Alltag leben',
        summary: 'Einfache Schritte für einen umweltfreundlicheren Lebensstil.',
        content: `
# Nachhaltig leben im Alltag

Jeder kann einen Beitrag zum Umweltschutz leisten.

## Bereiche des nachhaltigen Lebens

**Energie sparen:**
- LED-Lampen verwenden
- Geräte ausschalten
- Heizung optimieren
- Ökostrom nutzen

**Mobilität:**
- Öffentliche Verkehrsmittel
- Fahrrad fahren
- Zu Fuß gehen
- Carsharing nutzen

**Konsum reduzieren:**
- Bewusst einkaufen
- Reparieren statt wegwerfen
- Second-Hand kaufen
- Minimalismus praktizieren

## Zero Waste Prinzipien

**5 R's:**
- Refuse (Ablehnen)
- Reduce (Reduzieren)
- Reuse (Wiederverwenden)
- Recycle (Recyceln)
- Rot (Kompostieren)

**Praktische Tipps:**
- Mehrwegbeutel nutzen
- Plastikfrei einkaufen
- Selbst kochen
- Wasser sparen

## Ernährung und Umwelt

**Klimafreundliche Ernährung:**
- Weniger Fleisch
- Regional und saisonal
- Bio-Produkte
- Weniger Verpackung

**Urban Gardening:**
- Kräuter anbauen
- Balkon-Garten
- Community Gardens
- Kompostieren

Nachhaltigkeit beginnt mit kleinen Schritten!
        `,
        difficulty: 'beginner',
        tags: ['nachhaltigkeit', 'umweltschutz', 'zero-waste', 'konsum']
      },
      {
        title: 'Erneuerbare Energien verstehen',
        summary: 'Die Zukunft der Energieversorgung: Solar, Wind und mehr.',
        content: `
# Erneuerbare Energien: Die Zukunft ist grün

Der Wandel zu nachhaltiger Energie ist in vollem Gange.

## Arten erneuerbarer Energien

**Solarenergie:**
- Photovoltaik
- Solarthermie
- Wirkungsgrad steigt
- Kosten fallen

**Windenergie:**
- Onshore-Anlagen
- Offshore-Parks
- Effiziente Turbinen
- Speicherlösungen

**Andere Quellen:**
- Wasserkraft
- Biomasse
- Geothermie
- Gezeitenenergie

## Vorteile und Herausforderungen

**Vorteile:**
- CO2-neutral
- Unerschöpflich
- Preisstabil
- Arbeitsplätze

**Herausforderungen:**
- Schwankende Verfügbarkeit
- Speicherung
- Netzausbau
- Anfangsinvestitionen

## Energiewende global

**Deutschland:**
- Erneuerbare-Energien-Gesetz
- Atomausstieg
- Kohleausstieg geplant
- Wasserstoff-Strategie

**Weltweit:**
- Paris-Abkommen
- Kostensenkung
- Technologiefortschritt
- Politische Unterstützung

Die Energiewende ist nicht nur möglich, sondern unvermeidlich!
        `,
        difficulty: 'intermediate',
        tags: ['erneuerbare-energien', 'solar', 'wind', 'energiewende']
      }
    ],
    
    'geschichte': [
      {
        title: 'Die Renaissance: Wiedergeburt der Künste',
        summary: 'Entdecke die Epoche, die Europa veränderte.',
        content: `
# Renaissance: Eine Zeitenwende

Die Renaissance markierte den Übergang vom Mittelalter zur Neuzeit.

## Entstehung und Zentren

**Italien als Ursprung:**
- Florenz als Zentrum
- Reiche Kaufmannsfamilien
- Medici als Mäzene
- Stadtstaaten-System

**Zeitraum:**
- 14. bis 16. Jahrhundert
- Früh-, Hoch- und Spätrenaissance
- Ausbreitung nach Nordeuropa

## Kennzeichen der Renaissance

**Humanismus:**
- Mensch im Mittelpunkt
- Antike als Vorbild
- Bildung und Wissenschaft
- Individualismus

**Kunst und Kultur:**
- Perspektive und Realismus
- Leonardo da Vinci
- Michelangelo
- Raffael

## Wissenschaftliche Revolution

**Entdeckungen:**
- Kopernikus und Heliozentrismus
- Galilei und Teleskop
- Anatomie und Medizin
- Druckerpresse

**Folgen:**
- Reformation
- Entdeckung Amerikas
- Neue Weltanschauung
- Basis der Moderne

Die Renaissance legte den Grundstein für unser heutiges Weltbild!
        `,
        difficulty: 'intermediate',
        tags: ['renaissance', 'humanismus', 'kunst', 'wissenschaft']
      },
      {
        title: 'Industrielle Revolution: Der große Wandel',
        summary: 'Wie die Dampfmaschine die Welt veränderte.',
        content: `
# Industrielle Revolution

Ein Wendepunkt in der Menschheitsgeschichte.

## Beginn in England

**Voraussetzungen:**
- Kohlevorkommen
- Kapital verfügbar
- Kolonien
- Politische Stabilität

**Erfindungen:**
- Dampfmaschine (James Watt)
- Spinnmaschinen
- Webstühle
- Eisenbahn

## Gesellschaftlicher Wandel

**Urbanisierung:**
- Landflucht
- Entstehung von Industriestädten
- Bevölkerungswachstum
- Neue Lebensbedingungen

**Soziale Klassen:**
- Bourgeoisie (Bürgertum)
- Proletariat (Arbeiterklasse)
- Klassenkonflikte
- Soziale Bewegungen

## Auswirkungen

**Positive Folgen:**
- Wohlstandssteigerung
- Technischer Fortschritt
- Bessere Medizin
- Bildung für alle

**Negative Folgen:**
- Ausbeutung der Arbeiter
- Kinderarbeit
- Umweltverschmutzung
- Soziale Ungleichheit

Die Industrialisierung prägt uns bis heute!
        `,
        difficulty: 'intermediate',
        tags: ['industrialisierung', 'dampfmaschine', 'gesellschaft', 'wandel']
      }
    ],
    
    'finanzen': [
      {
        title: 'Grundlagen der persönlichen Finanzen',
        summary: 'Wie du deine Finanzen in den Griff bekommst.',
        content: `
# Persönliche Finanzen meistern

Finanzielle Bildung ist der Schlüssel zur finanziellen Freiheit.

## Budget erstellen

**Einnahmen und Ausgaben:**
- Alle Einkommensquellen
- Fixe und variable Kosten
- Tracking über Apps
- Monatliche Auswertung

**50-30-20 Regel:**
- 50% Grundbedürfnisse
- 30% Wünsche
- 20% Sparen und Investieren

## Notfall-Fonds aufbauen

**Warum wichtig:**
- Unerwartete Ausgaben
- Jobverlust absichern
- Stress reduzieren
- Finanzielle Stabilität

**Wie viel:**
- 3-6 Monatsausgaben
- Auf Tagesgeldkonto
- Leicht verfügbar
- Nicht investieren

## Schulden abbauen

**Schulden-Strategie:**
- Überblick verschaffen
- Höchste Zinsen zuerst
- Konsolidierung prüfen
- Disziplin bewahren

**Vermeidung neuer Schulden:**
- Bar bezahlen
- Kreditkarten kontrollieren
- Impulskäufe vermeiden
- Bewusst konsumieren

Geld regiert die Welt - regiere dein Geld!
        `,
        difficulty: 'beginner',
        tags: ['budget', 'sparen', 'schulden', 'finanzen']
      },
      {
        title: 'Investieren für Anfänger: ETFs und mehr',
        summary: 'Wie du dein Geld langfristig gewinnbringend anlegst.',
        content: `
# Investieren lernen

Investieren ist der Weg zu langfristigem Vermögensaufbau.

## Investment-Grundlagen

**Warum investieren:**
- Inflation schlägt Sparbuch
- Langfristiger Vermögensaufbau
- Compound-Effekt
- Finanzielle Ziele erreichen

**Risiko und Rendite:**
- Höhere Rendite = höheres Risiko
- Diversifikation wichtig
- Langfristig denken
- Emotionen kontrollieren

## ETFs verstehen

**Was sind ETFs:**
- Exchange Traded Funds
- Passiv verwaltete Fonds
- Niedrige Kosten
- Breite Streuung

**Vorteile:**
- Einfach zu verstehen
- Günstig
- Liquide handelbar
- Automatische Diversifikation

## Investment-Strategien

**Buy and Hold:**
- Langfristig investieren
- Nicht auf Markt-Timing setzen
- Regelmäßig sparen
- Geduld haben

**Cost-Average-Effekt:**
- Monatliche Sparraten
- Durchschnittskurs erzielen
- Emotionen ausschalten
- Disziplin wichtig

Zeit im Markt schlägt Market-Timing!
        `,
        difficulty: 'intermediate',
        tags: ['investieren', 'etf', 'vermögensaufbau', 'aktien']
      }
    ]
  };

  return templates[themeSlug] || [];
}; 