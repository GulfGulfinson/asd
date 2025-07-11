import { Lesson } from '../models';

const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.split(' ').length;
  return Math.ceil(words / wordsPerMinute);
};

export const seedLessons = async (themes: any[]) => {
  try {
    // Clear existing lessons
    await Lesson.deleteMany({});
    
    const lessons = [];
    
    for (const theme of themes) {
      // Create 2 lessons per theme
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
  
  return lessonTemplates.map((template) => ({
    title: template.title,
    content: template.content,
    summary: template.summary,
    themeId: theme._id,
    difficulty: template.difficulty,
    estimatedReadTime: calculateReadTime(template.content),
    tags: template.tags,
    isPublished: true,
    publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    viewsCount: Math.floor(Math.random() * 1000) + 50,
    likesCount: Math.floor(Math.random() * 100) + 10
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
    ]
  };

  return templates[themeSlug] || [];
}; 