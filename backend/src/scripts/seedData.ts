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

const clearDatabase = async () => {
  try {
    await Theme.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    console.log('🗑️ Database cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
};

const seedThemes = async () => {
  const themes = [
    {
      name: 'Psychology',
      description: 'Verstehe menschliches Verhalten, mentale Prozesse und psychologische Prinzipien.',
      slug: 'psychology',
      color: '#8B5CF6',
      icon: '🧠',
      isActive: true
    },
    {
      name: 'Health & Wellness',
      description: 'Entdecke Themen über körperliche Gesundheit, mentales Wohlbefinden und Lifestyle.',
      slug: 'health-wellness',
      color: '#EF4444',
      icon: '❤️',
      isActive: true
    },
    {
      name: 'Business',
      description: 'Lerne über Entrepreneurship, Management, Finanzen und Geschäftsstrategie.',
      slug: 'business',
      color: '#F59E0B',
      icon: '💼',
      isActive: true
    },
    {
      name: 'Science',
      description: 'Entdecke faszinierende wissenschaftliche Konzepte, Entdeckungen und Naturphänomene.',
      slug: 'science',
      color: '#10B981',
      icon: '🔬',
      isActive: true
    },
    {
      name: 'Personal Development',
      description: 'Entwickle persönliche Fähigkeiten, Kommunikation und Führungsqualitäten.',
      slug: 'personal-development',
      color: '#3B82F6',
      icon: '🌟',
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
      title: 'Die Macht der Gewohnheiten verstehen',
      content: `
# Die Psychologie der Gewohnheiten

Gewohnheiten bestimmen 40% unseres täglichen Verhaltens. Verstehe, wie sie funktionieren!

---

## Was sind Gewohnheiten?

Gewohnheiten sind automatische Verhaltensweisen, die durch Wiederholung entstehen. Sie helfen unserem Gehirn, Energie zu sparen.

**Der Gewohnheits-Loop besteht aus drei Teilen:**
- **Auslöser** - Ein Signal, das die Gewohnheit startet
- **Routine** - Das Verhalten selbst
- **Belohnung** - Der Nutzen, den wir daraus ziehen

---

## Wie entstehen neue Gewohnheiten?

**Die 21-Tage-Regel ist ein Mythos!** Forschungen zeigen, dass es 18-254 Tage dauert, bis eine neue Gewohnheit automatisch wird.

**Faktoren, die die Gewohnheitsbildung beeinflussen:**
- Komplexität der Handlung
- Persönlichkeit
- Umstände
- Motivation

> "Wir sind das, was wir wiederholt tun. Vorzüglichkeit ist also keine Handlung, sondern eine Gewohnheit." - Aristoteles

---

## Die 1% Regel

Kleine tägliche Verbesserungen führen zu enormen Veränderungen:

**Mathematik der Gewohnheiten:**
- 1% besser jeden Tag = 37x besser nach einem Jahr
- 1% schlechter jeden Tag = fast null nach einem Jahr

**Praktische Beispiele:**
- 5 Minuten täglich lesen = 30+ Bücher pro Jahr
- 10 Minuten Sport = 60+ Stunden Training pro Jahr
- 1 gesunde Mahlzeit täglich = 365 bessere Entscheidungen

---

## Gewohnheiten erfolgreich ändern

**Die 4 Gesetze des Verhaltensänderung:**

1. **Mach es offensichtlich** - Sichtbare Erinnerungen schaffen
2. **Mach es attraktiv** - Verlockungen hinzufügen
3. **Mach es einfach** - Hürden reduzieren
4. **Mach es befriedigend** - Sofortige Belohnungen einbauen

**Umgebung optimieren:**
- Gesunde Snacks sichtbar platzieren
- Sportkleidung bereitlegen
- Handy beim Lernen wegpacken

---

## Praxis: Dein Gewohnheiten-Plan

**Schritt 1: Gewohnheit wählen**
Beginne mit einer Mini-Gewohnheit (2-Minuten-Regel)

**Schritt 2: Auslöser festlegen**
"Nach [bestehende Gewohnheit] werde ich [neue Gewohnheit] machen"

**Schritt 3: Belohnung planen**
Feiere kleine Erfolge sofort

**Beispiel:**
- Nach dem Zähneputzen (Auslöser)
- Mache ich 5 Liegestütze (Routine)
- Und sage "Gut gemacht!" (Belohnung)
      `,
      summary: 'Verstehe die Wissenschaft hinter Gewohnheiten und lerne praktische Strategien für positive Veränderungen.',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
      themeId: themes.find(t => t.slug === 'psychology')?._id,
      difficulty: 'beginner',
      estimatedReadTime: 8,
      tags: ['Psychology', 'Habits', 'Behavior Change', 'Self-Improvement'],
      isPublished: true,
      publishedAt: new Date('2024-01-15')
    },
    {
      title: 'Stressmanagement: Von Panik zu innerer Ruhe',
      content: `
# Stress verstehen und bewältigen

Stress ist nicht dein Feind - lerne, wie du ihn als Verbündeten nutzen kannst.

---

## Was ist Stress wirklich?

Stress ist eine natürliche Reaktion deines Körpers auf Herausforderungen. Ohne Stress gäbe es keine Entwicklung!

**Zwei Arten von Stress:**
- **Eustress** - Positiver, motivierender Stress
- **Distress** - Negativer, überwältigender Stress

**Körperliche Stressreaktion:**
- Adrenalin und Cortisol werden ausgeschüttet
- Herzschlag beschleunigt sich
- Aufmerksamkeit steigt
- Muskeln spannen sich an

---

## Die moderne Stressfalle

**Evolutionärer Konflikt:**
Unser Gehirn ist für kurzfristige Gefahren programmiert, aber wir leben in einer Welt chronischer Stressoren.

**Häufige Stressauslöser heute:**
- Informationsüberflutung
- Sozialer Druck
- Finanzielle Sorgen
- Zeitdruck
- Perfektionismus

> "Es sind nicht die Dinge selbst, die uns beunruhigen, sondern unsere Meinungen über diese Dinge." - Epiktet

---

## Sofort-Strategien gegen Stress

**Die 4-7-8 Atemtechnik:**
1. 4 Sekunden einatmen
2. 7 Sekunden Atem anhalten
3. 8 Sekunden ausatmen
4. 3-4 mal wiederholen

**5-4-3-2-1 Erdungstechnik:**
- 5 Dinge, die du siehst
- 4 Dinge, die du fühlst
- 3 Dinge, die du hörst
- 2 Dinge, die du riechst
- 1 Ding, das du schmeckst

**Progressive Muskelentspannung:**
Spanne nacheinander verschiedene Muskelgruppen an und entspanne sie bewusst.

---

## Langfristige Stressresilienz

**Die 4 Säulen der Stressresilienz:**

1. **Körperliche Gesundheit**
   - Regelmäßiger Schlaf (7-9 Stunden)
   - Ausgewogene Ernährung
   - Bewegung (150 Min/Woche)

2. **Mentale Flexibilität**
   - Meditation und Achtsamkeit
   - Positive Selbstgespräche
   - Realistische Erwartungen

3. **Soziale Verbindungen**
   - Starkes Support-Netzwerk
   - Offene Kommunikation
   - Grenzen setzen

4. **Sinnhaftigkeit**
   - Klare Werte und Ziele
   - Engagement für etwas Größeres
   - Dankbarkeit praktizieren

---

## Dein persönlicher Stressplan

**Stress-Tagebuch führen:**
- Wann tritt Stress auf?
- Was sind die Auslöser?
- Wie reagiere ich?
- Was hilft mir?

**Notfall-Toolkit erstellen:**
1. Atemübung für akuten Stress
2. 5-Minuten-Meditation
3. Kurzer Spaziergang
4. Musik oder Podcast
5. Kontakt zu Vertrauensperson

**Prävention im Alltag:**
- Feste Routinen entwickeln
- Regelmäßige Pausen einbauen
- "Nein" sagen lernen
- Perfektionismus loslassen
      `,
      summary: 'Lerne effektive Strategien zur Stressbewältigung und baue langfristige Resilienz auf.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      themeId: themes.find(t => t.slug === 'health-wellness')?._id,
      difficulty: 'beginner',
      estimatedReadTime: 9,
      tags: ['Stress Management', 'Mental Health', 'Wellness', 'Mindfulness'],
      isPublished: true,
      publishedAt: new Date('2024-01-18')
    },
    {
      title: 'Erfolgreiche Kommunikation: Die Kunst des Zuhörens',
      content: `
# Kommunikation meistern

Gute Kommunikation ist der Schlüssel zu erfolgreichen Beziehungen - privat und beruflich.

---

## Das Kommunikations-Paradox

**55% Körpersprache + 38% Tonfall + 7% Worte = 100% Botschaft**

Wir konzentrieren uns meist nur auf die Worte, aber das ist nur ein kleiner Teil der Kommunikation!

**Häufige Kommunikationsfehler:**
- Unterbrechen beim Sprechen
- Urteilen statt verstehen
- Lösungen anbieten statt zuhören
- Multitasking während Gesprächen
- Eigene Agenda verfolgen

---

## Die 5 Ebenen des Zuhörens

**Level 1: Ignorieren**
Gar nicht zuhören, abgelenkt sein

**Level 2: Vortäuschen**
So tun, als würde man zuhören

**Level 3: Selektives Hören**
Nur Teile wahrnehmen, die interessant sind

**Level 4: Aufmerksames Hören**
Aktiv zuhören und verstehen wollen

**Level 5: Empathisches Hören**
Mit dem Herzen hören, Gefühle verstehen

> "Wir haben zwei Ohren und einen Mund, damit wir doppelt so viel hören wie sprechen." - Epiktet

---

## Aktives Zuhören in der Praxis

**Die SOLER-Technik:**
- **S**itzen oder stehen - offene Körperhaltung
- **O**ffener Blickkontakt
- **L**ehne dich vor - zeige Interesse
- **E**ntspannt bleiben
- **R**eagiere angemessen

**Paraphrasieren:**
"Wenn ich dich richtig verstehe, sagst du..."
"Das bedeutet für dich..."
"Du fühlst dich also..."

**Nachfragen stellen:**
- "Kannst du das näher erklären?"
- "Wie fühlst du dich dabei?"
- "Was ist das Wichtigste für dich?"

---

## Schwierige Gespräche meistern

**Das DESC-Modell:**

**D**escribe - Situation beschreiben
"Mir ist aufgefallen, dass..."

**E**xpress - Gefühle ausdrücken
"Ich fühle mich..."

**S**pecify - Wünsche konkretisieren
"Ich würde mir wünschen..."

**C**onsequences - Konsequenzen aufzeigen
"Das würde bedeuten..."

**Bei Konflikten:**
1. Ruhig bleiben und durchatmen
2. Gemeinsamkeiten finden
3. Ich-Botschaften verwenden
4. Lösungen gemeinsam entwickeln
5. Win-Win anstreben

---

## Nonverbale Kommunikation

**Körpersprache bewusst einsetzen:**

**Offene Signale:**
- Entspannte Schultern
- Offene Handflächen
- Zugewandter Körper
- Angemessener Abstand

**Geschlossene Signale vermeiden:**
- Verschränkte Arme
- Weggewandter Körper
- Finger zeigen
- Zu nahes Herantreten

**Stimme und Tonfall:**
- Ruhiges, gleichmäßiges Tempo
- Angemessene Lautstärke
- Pausen setzen
- Betonung nutzen

---

## Deine Kommunikations-Challenge

**Täglich üben:**
1. Ein Gespräch pro Tag bewusst führen
2. Handy weglegen beim Sprechen
3. Mehr Fragen stellen als Aussagen treffen
4. Gefühle benennen
5. Zusammenfassen, was gehört wurde

**Reflexion am Abend:**
- Wie gut habe ich heute zugehört?
- Wo habe ich unterbrochen?
- Welche Gefühle habe ich wahrgenommen?
- Was kann ich morgen besser machen?

**Langfristiges Ziel:**
Werde zum Menschen, mit dem andere gerne sprechen, weil sie sich verstanden fühlen.
      `,
      summary: 'Entwickle deine Kommunikationsfähigkeiten und lerne die Kunst des empathischen Zuhörens.',
      imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
      themeId: themes.find(t => t.slug === 'personal-development')?._id,
      difficulty: 'intermediate',
      estimatedReadTime: 7,
      tags: ['Communication', 'Listening Skills', 'Relationships', 'Leadership'],
      isPublished: true,
      publishedAt: new Date('2024-01-21')
    },
    {
      title: 'Finanzielle Intelligenz: Geld verstehen und vermehren',
      content: `
# Finanzielle Bildung für alle

Geld ist ein Werkzeug - lerne, es klug zu nutzen und für dich arbeiten zu lassen.

---

## Das Geld-Mindset

**Arme vs. Reiche Denkweise:**

**Arme Denkweise:**
- "Geld ist die Wurzel allen Übels"
- "Reiche Menschen sind gierig"
- "Ich kann mir das nicht leisten"
- "Geld macht nicht glücklich"

**Reiche Denkweise:**
- "Geld ist ein Werkzeug für Freiheit"
- "Ich kann Gutes mit Geld bewirken"
- "Wie kann ich mir das leisten?"
- "Geld gibt mir Optionen"

**Die wichtigste Regel:**
Bezahle dich selbst zuerst - spare bevor du ausgibst!

---

## Die 50/30/20 Regel

**50% Grundbedürfnisse:**
- Miete/Hypothek
- Lebensmittel
- Transport
- Versicherungen
- Mindest-Kreditraten

**30% Wünsche:**
- Entertainment
- Restaurants
- Hobbys
- Shopping
- Reisen

**20% Sparen & Investieren:**
- Notgroschen (3-6 Monate Ausgaben)
- Altersvorsorge
- Investitionen
- Schuldenabbau

---

## Der Zinseszinseffekt

**Das 8. Weltwunder:**
"Der Zinseszins ist das achte Weltwunder. Wer ihn versteht, verdient ihn. Wer ihn nicht versteht, bezahlt ihn." - Einstein

**Beispiel: 25 vs. 35 Jahre:**
- Person A: Spart 10 Jahre lang 2.000€/Jahr (20.000€ gesamt)
- Person B: Spart 30 Jahre lang 2.000€/Jahr (60.000€ gesamt)
- Rendite: 7% pro Jahr

**Ergebnis nach 40 Jahren:**
- Person A (früher Start): ~340.000€
- Person B (später Start): ~245.000€

**Zeit schlägt Betrag!**

---

## Investment-Grundlagen

**Die Investment-Pyramide:**

**Fundament - Notgroschen:**
- 3-6 Monate Ausgaben
- Sofort verfügbar
- Tagesgeld oder Festgeld

**Aufbau - Diversifizierte Investments:**
- ETFs (Exchange Traded Funds)
- Aktien großer Unternehmen
- Immobilien (REITs)
- Rohstoffe

**Spitze - Spekulative Investments:**
- Einzelaktien
- Kryptowährungen
- Derivate
- Startups

**Goldene Regeln:**
- Nur investieren, was du verstehst
- Niemals alles auf eine Karte setzen
- Emotionen raushalten
- Langfristig denken (10+ Jahre)

---

## Schulden intelligent nutzen

**Gute vs. Schlechte Schulden:**

**Gute Schulden:**
- Immobilienkredit (Wertsteigerung)
- Bildungskredit (Einkommenssteigerung)
- Unternehmenskredit (Cashflow-Generierung)

**Schlechte Schulden:**
- Konsumkredite
- Kreditkarten-Schulden
- Auto-Leasing für Luxus
- Urlaubs-Kredite

**Schulden-Schneeball-Methode:**
1. Minimum auf alle Schulden zahlen
2. Kleinste Schuld zuerst komplett tilgen
3. Freigewordenen Betrag auf nächste Schuld
4. Wiederholen bis schuldenfrei

---

## Dein Finanz-Action-Plan

**Woche 1: Analyse**
- Alle Einnahmen und Ausgaben auflisten
- Nettovermögen berechnen
- Finanziele definieren

**Woche 2: Optimierung**
- Unnötige Ausgaben streichen
- Einsparpotentiale finden
- Notgroschen aufbauen beginnen

**Woche 3: Automatisierung**
- Daueraufträge für Sparen einrichten
- Investment-Depot eröffnen
- Monatlichen ETF-Sparplan starten

**Woche 4: Bildung**
- Finanz-Podcast abonnieren
- Ein Buch über Investieren lesen
- Mit finanziell erfolgreichen Menschen sprechen

**Langfristig:**
- Jährliche Finanz-Review
- Sparziele jährlich erhöhen
- Neue Investment-Möglichkeiten prüfen
      `,
      summary: 'Baue finanzielle Intelligenz auf und lerne, wie Geld für dich arbeiten kann.',
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
      themeId: themes.find(t => t.slug === 'business')?._id,
      difficulty: 'intermediate',
      estimatedReadTime: 10,
      tags: ['Finance', 'Investment', 'Money Management', 'Wealth Building'],
      isPublished: true,
      publishedAt: new Date('2024-01-24')
    },
    {
      title: 'Der Klimawandel: Verstehen und handeln',
      content: `
# Klimawandel verstehen

Der Klimawandel ist real - aber was bedeutet das konkret und was kannst du tun?

---

## Die Fakten zum Klimawandel

**Was ist der Klimawandel?**
Langfristige Änderung der durchschnittlichen Wetter- und Temperaturbedingungen auf der Erde.

**Hauptursachen:**
- Verbrennung fossiler Brennstoffe (75%)
- Entwaldung (11%)
- Landwirtschaft (9%)
- Industrieprozesse (5%)

**Wichtige Zahlen:**
- Globale Erwärmung: +1,1°C seit 1880
- CO₂-Konzentration: 421 ppm (höchster Wert seit 3 Mio. Jahren)
- Meeresspiegel: +21 cm seit 1880
- Arktisches Eis: -13% pro Jahrzehnt

---

## Auswirkungen bereits heute

**Extreme Wetterereignisse:**
- Hitzewellen werden häufiger und intensiver
- Dürren in manchen Regionen
- Überschwemmungen in anderen Gebieten
- Stärkere Stürme und Hurrikane

**Ökosystem-Veränderungen:**
- Artensterben beschleunigt sich
- Korallenbleiche nimmt zu
- Gletscher schmelzen weltweit
- Permafrost taut auf

**Gesellschaftliche Folgen:**
- Ernteausfälle und Nahrungsmittelknappheit
- Wasserknappheit in vielen Regionen
- Klimamigration nimmt zu
- Gesundheitsrisiken steigen

> "Wir sind die erste Generation, die den Klimawandel spürt, und die letzte, die etwas dagegen tun kann."

---

## Die Pariser Klimaziele

**Das 1,5°C-Ziel:**
Begrenzung der Erderwärmung auf 1,5°C über dem vorindustriellen Niveau.

**Was bedeutet das?**
- Halbierung der Emissionen bis 2030
- Netto-Null-Emissionen bis 2050
- Massive Investitionen in erneuerbare Energien
- Schutz und Wiederherstellung von Wäldern

**Aktuelle Situation:**
Wir sind auf einem 2,7°C-Pfad - deutlich über dem Ziel!

---

## Dein persönlicher CO₂-Fußabdruck

**Durchschnittlicher CO₂-Ausstoß pro Person in Deutschland:**
- 11,2 Tonnen CO₂ pro Jahr
- Ziel für 1,5°C: 2,3 Tonnen pro Jahr

**Größte Verursacher:**
1. **Wohnen** (2,8 t) - Heizen, Strom
2. **Mobilität** (2,2 t) - Auto, Flüge
3. **Ernährung** (1,7 t) - Fleisch, Import
4. **Konsum** (3,6 t) - Kleidung, Elektronik
5. **Öffentlich** (0,9 t) - Infrastruktur

---

## Konkrete Handlungsmöglichkeiten

**Sofort umsetzbar:**

**Energie sparen:**
- LED-Lampen verwenden (-80% Stromverbrauch)
- Heizung um 1°C senken (-6% Energie)
- Geräte ganz ausschalten (kein Standby)
- Ökostrom-Anbieter wählen

**Mobilität überdenken:**
- Kurze Strecken zu Fuß oder mit Rad
- Öffentliche Verkehrsmittel nutzen
- Flugreisen reduzieren (1 Flug = 1 Jahr Autofahren)
- Carsharing statt eigenes Auto

**Ernährung anpassen:**
- Weniger Fleisch essen (1-2x pro Woche)
- Regional und saisonal einkaufen
- Lebensmittelverschwendung vermeiden
- Mehr pflanzliche Proteine

**Konsum bewusster:**
- Dinge länger nutzen
- Reparieren statt wegwerfen
- Second-Hand kaufen
- Qualität vor Quantität

---

## Hoffnung und Lösungen

**Positive Entwicklungen:**
- Erneuerbare Energien werden günstiger
- Elektromobilität wächst exponentiell
- Neue Technologien entstehen (Carbon Capture)
- Bewusstsein steigt weltweit

**Technologische Durchbrüche:**
- Wasserstoff als Energiespeicher
- Künstliches Fleisch entwickelt sich
- Vertical Farming spart Ressourcen
- Kreislaufwirtschaft entsteht

**Dein Beitrag zählt:**
Jede eingesparte Tonne CO₂ macht einen Unterschied. Gemeinsam können wir das 1,5°C-Ziel noch erreichen!

**Werde zum Klimaschützer:**
- Berechne deinen CO₂-Fußabdruck
- Setze dir konkrete Reduktionsziele
- Inspiriere andere zum Mitmachen
- Unterstütze klimafreundliche Politik
      `,
      summary: 'Verstehe die Wissenschaft des Klimawandels und entdecke konkrete Handlungsmöglichkeiten.',
      imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800',
      themeId: themes.find(t => t.slug === 'science')?._id,
      difficulty: 'intermediate',
      estimatedReadTime: 9,
      tags: ['Climate Change', 'Environment', 'Sustainability', 'Science'],
      isPublished: true,
      publishedAt: new Date('2024-01-27')
    },
    {
      title: 'Produktivität steigern: Mehr erreichen mit weniger Stress',
      content: `
# Produktivität neu gedacht

Wahre Produktivität bedeutet nicht mehr zu arbeiten, sondern klüger zu arbeiten.

---

## Das Produktivitäts-Paradox

**Moderne Herausforderungen:**
- Informationsüberflutung
- Ständige Unterbrechungen
- Multitasking-Mythos
- Decision Fatigue
- Perfectionism Paralysis

**Die Wahrheit über Multitasking:**
Unser Gehirn kann nicht wirklich multitasken. Es wechselt schnell zwischen Aufgaben - das kostet 25% Produktivität!

> "Produktivität ist nicht alles, aber ohne Produktivität ist alles nichts." - Peter Drucker

---

## Das Pareto-Prinzip (80/20-Regel)

**Die mächtigste Produktivitätsregel:**
80% der Ergebnisse kommen von 20% der Aktivitäten.

**Praktische Anwendung:**
- 20% deiner Kunden bringen 80% des Umsatzes
- 20% deiner Aufgaben erzeugen 80% des Werts
- 20% deiner Gewohnheiten bestimmen 80% deines Lebens

**Frage dich täglich:**
"Welche 20% meiner Aufgaben werden 80% der Ergebnisse bringen?"

---

## Time Management Systeme

**Die Eisenhower-Matrix:**

**Quadrant 1: Wichtig + Dringlich**
- Krisen und Notfälle
- Deadlines
- Sofort erledigen

**Quadrant 2: Wichtig + Nicht dringlich**
- Prävention und Planung
- Lernen und Entwicklung
- Zeit hier investieren!

**Quadrant 3: Nicht wichtig + Dringlich**
- Unterbrechungen
- Manche E-Mails
- Delegieren oder ablehnen

**Quadrant 4: Nicht wichtig + Nicht dringlich**
- Zeitverschwender
- Social Media scrollen
- Eliminieren!

---

## Deep Work vs. Shallow Work

**Deep Work:**
- Kognitive anspruchsvolle Aufgaben
- Hohe Konzentration erforderlich
- Wertvoll und schwer ersetzbar
- Beispiele: Strategieentwicklung, Lernen, Kreativarbeit

**Shallow Work:**
- Logistische Aufgaben
- Wenig kognitive Anstrengung
- Leicht ersetzbar
- Beispiele: E-Mails, Meetings, Administration

**Deep Work Strategien:**
1. **Monastic:** Komplette Isolation von Ablenkungen
2. **Bimodal:** Feste Deep Work Perioden
3. **Rhythmic:** Täglich zur gleichen Zeit
4. **Journalistic:** Jede freie Minute nutzen

---

## Die perfekte Morgenroutine

**Die ersten 90 Minuten entscheiden:**
Dein Gehirn ist morgens am leistungsfähigsten für komplexe Aufgaben.

**Optimaler Morgen:**

**6:00 - Aufstehen ohne Snooze**
- Wasser trinken
- 5 Minuten Meditation
- Kurze Bewegung

**6:30 - Wichtigste Aufgabe (MIT)**
- Eine Most Important Task
- 90 Minuten fokussierte Arbeit
- Handy stumm/weg

**8:00 - Energie auftanken**
- Gesundes Frühstück
- Kurze Pause
- Tag planen

**Goldene Regeln:**
- Keine E-Mails vor 9 Uhr
- Wichtigstes zuerst
- Ein Task nach dem anderen

---

## Anti-Prokrastinations-Strategien

**Die 2-Minuten-Regel:**
Wenn etwas weniger als 2 Minuten dauert, sofort erledigen.

**Die 5-Minuten-Regel:**
Bei Aufschieberitis: "Nur 5 Minuten" - oft machst du weiter.

**Eat the Frog:**
Schwerste/unangenehmste Aufgabe zuerst am Morgen.

**Pomodoro-Technik:**
- 25 Minuten fokussierte Arbeit
- 5 Minuten Pause
- Nach 4 Zyklen: 30 Minuten Pause

**Implementation Intentions:**
"Wenn [Situation], dann werde ich [Verhalten]"
"Wenn ich Lust auf Social Media habe, dann mache ich 5 Liegestütze"

---

## Dein Produktivitäts-System

**Wöchentliche Planung:**
1. Ziele der Woche definieren
2. 3 Most Important Tasks pro Tag
3. Zeitblöcke für Deep Work
4. Pufferzeiten einplanen

**Tägliche Rituale:**
- Morgens: Top 3 Prioritäten
- Mittags: Kurze Reflexion
- Abends: Tag abschließen, morgen vorbereiten

**Tools & Apps:**
- Todoist oder Any.do (Aufgaben)
- Toggl (Zeiterfassung)
- Forest (Fokus)
- RescueTime (Analyse)

**Wöchentliche Review:**
- Was lief gut?
- Wo gab es Probleme?
- Was kann ich optimieren?
- Neue Experimente für nächste Woche?

**Erinnere dich:**
Produktivität ist ein Marathon, kein Sprint. Kleine, konstante Verbesserungen führen zu großen Ergebnissen.
      `,
      summary: 'Entwickle ein effektives Produktivitätssystem und lerne, mehr mit weniger Stress zu erreichen.',
      imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
      themeId: themes.find(t => t.slug === 'personal-development')?._id,
      difficulty: 'intermediate',
      estimatedReadTime: 8,
      tags: ['Productivity', 'Time Management', 'Focus', 'Organization'],
      isPublished: true,
      publishedAt: new Date('2024-01-30')
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
      lessonId: lessons.find(l => l.title === 'Die Macht der Gewohnheiten verstehen')?._id,
      title: 'Gewohnheiten Quiz',
      questions: [
        {
          question: 'Aus welchen drei Komponenten besteht der Gewohnheits-Loop?',
          type: 'multiple_choice',
          options: [
            'Denken, Handeln, Belohnen',
            'Auslöser, Routine, Belohnung',
            'Planen, Ausführen, Bewerten',
            'Motivation, Aktion, Reflexion'
          ],
          correctAnswer: 1,
          explanation: 'Der Gewohnheits-Loop besteht aus Auslöser (Cue), Routine (Verhalten) und Belohnung (Reward).'
        },
        {
          question: 'Laut der 1%-Regel: Wenn ich mich jeden Tag um 1% verbessere, wie viel besser bin ich nach einem Jahr?',
          type: 'multiple_choice',
          options: [
            'Etwa 4x besser',
            'Etwa 37x besser',
            'Etwa 365x besser',
            'Etwa 100x besser'
          ],
          correctAnswer: 1,
          explanation: 'Durch den Zinseszinseffekt wird man nach einem Jahr etwa 37x besser (1,01^365 ≈ 37,78).'
        },
        {
          question: 'Was ist die 2-Minuten-Regel für neue Gewohnheiten?',
          type: 'multiple_choice',
          options: [
            'Gewohnheiten sollten mindestens 2 Minuten dauern',
            'Neue Gewohnheiten sollten höchstens 2 Minuten dauern',
            'Man braucht 2 Minuten um eine Gewohnheit zu starten',
            'Gewohnheiten entstehen nach 2 Minuten'
          ],
          correctAnswer: 1,
          explanation: 'Die 2-Minuten-Regel besagt, dass neue Gewohnheiten zunächst auf maximal 2 Minuten reduziert werden sollten, um sie leichter zu etablieren.'
        }
      ],
      passingScore: 70,
      timeLimit: 300
    },
    {
      lessonId: lessons.find(l => l.title === 'Stressmanagement: Von Panik zu innerer Ruhe')?._id,
      title: 'Stressmanagement Quiz',
      questions: [
        {
          question: 'Was ist der Unterschied zwischen Eustress und Distress?',
          type: 'multiple_choice',
          options: [
            'Eustress ist schädlich, Distress ist nützlich',
            'Eustress ist positiver Stress, Distress ist negativer Stress',
            'Eustress ist körperlich, Distress ist mental',
            'Es gibt keinen Unterschied'
          ],
          correctAnswer: 1,
          explanation: 'Eustress ist positiver, motivierender Stress, während Distress negativer, überwältigender Stress ist.'
        },
        {
          question: 'Wie funktioniert die 4-7-8 Atemtechnik?',
          type: 'multiple_choice',
          options: [
            '4 Sekunden ausatmen, 7 Sekunden einatmen, 8 Sekunden halten',
            '4 Sekunden einatmen, 7 Sekunden halten, 8 Sekunden ausatmen',
            '4 Atemzüge, 7 Sekunden Pause, 8 Wiederholungen',
            '4 Minuten atmen, 7 Minuten Pause, 8 Minuten Meditation'
          ],
          correctAnswer: 1,
          explanation: 'Die 4-7-8 Technik: 4 Sekunden einatmen, 7 Sekunden Atem anhalten, 8 Sekunden ausatmen.'
        },
        {
          question: 'Welche der folgenden Strategien gehört NICHT zu den 4 Säulen der Stressresilienz?',
          type: 'multiple_choice',
          options: [
            'Körperliche Gesundheit',
            'Mentale Flexibilität',
            'Finanzielle Sicherheit',
            'Soziale Verbindungen'
          ],
          correctAnswer: 2,
          explanation: 'Die 4 Säulen sind: Körperliche Gesundheit, Mentale Flexibilität, Soziale Verbindungen und Sinnhaftigkeit.'
        }
      ],
      passingScore: 70,
      timeLimit: 300
    },
    {
      lessonId: lessons.find(l => l.title === 'Erfolgreiche Kommunikation: Die Kunst des Zuhörens')?._id,
      title: 'Kommunikation Quiz',
      questions: [
        {
          question: 'Wie viel Prozent unserer Kommunikation macht die Körpersprache aus?',
          type: 'multiple_choice',
          options: [
            '7%',
            '38%',
            '55%',
            '93%'
          ],
          correctAnswer: 2,
          explanation: 'Körpersprache macht 55% der Kommunikation aus, Tonfall 38% und Worte nur 7%.'
        },
        {
          question: 'Was bedeutet die SOLER-Technik beim aktiven Zuhören?',
          type: 'multiple_choice',
          options: [
            'Sprechen, Organisieren, Lernen, Entwickeln, Reagieren',
            'Sitzen/Stehen offen, Offener Blickkontakt, Lean forward, Entspannt, Reagieren',
            'Sammeln, Ordnen, Logisch denken, Empathisch sein, Reflektieren',
            'Schweigen, Offen sein, Langsam sprechen, Ernst bleiben, Respektieren'
          ],
          correctAnswer: 1,
          explanation: 'SOLER steht für: Sitzen/Stehen (offene Körperhaltung), Offener Blickkontakt, Lean forward (vorwärts lehnen), Entspannt bleiben, Reagieren angemessen.'
        },
        {
          question: 'Was ist das DESC-Modell für schwierige Gespräche?',
          type: 'multiple_choice',
          options: [
            'Describe, Express, Specify, Consequences',
            'Decide, Engage, Support, Conclude',
            'Discuss, Evaluate, Solve, Confirm',
            'Define, Explain, Suggest, Complete'
          ],
          correctAnswer: 0,
          explanation: 'DESC steht für: Describe (beschreiben), Express (Gefühle ausdrücken), Specify (Wünsche konkretisieren), Consequences (Konsequenzen aufzeigen).'
        }
      ],
      passingScore: 70,
      timeLimit: 300
    },
    {
      lessonId: lessons.find(l => l.title === 'Finanzielle Intelligenz: Geld verstehen und vermehren')?._id,
      title: 'Finanzielle Intelligenz Quiz',
      questions: [
        {
          question: 'Was besagt die 50/30/20 Regel?',
          type: 'multiple_choice',
          options: [
            '50% Sparen, 30% Investieren, 20% Ausgeben',
            '50% Grundbedürfnisse, 30% Wünsche, 20% Sparen',
            '50% Arbeit, 30% Familie, 20% Hobbys',
            '50% Aktien, 30% Anleihen, 20% Cash'
          ],
          correctAnswer: 1,
          explanation: 'Die 50/30/20 Regel teilt das Einkommen auf: 50% für Grundbedürfnisse, 30% für Wünsche, 20% für Sparen und Investieren.'
        },
        {
          question: 'Was ist der Zinseszinseffekt?',
          type: 'multiple_choice',
          options: [
            'Zinsen werden nur auf den ursprünglichen Betrag berechnet',
            'Zinsen werden auch auf bereits erhaltene Zinsen berechnet',
            'Zinsen werden verdoppelt',
            'Zinsen werden halbiert'
          ],
          correctAnswer: 1,
          explanation: 'Beim Zinseszinseffekt werden Zinsen auch auf bereits erhaltene Zinsen berechnet, wodurch das Wachstum exponentiell wird.'
        },
        {
          question: 'Was sind "gute Schulden"?',
          type: 'multiple_choice',
          options: [
            'Kreditkarten-Schulden',
            'Konsumkredite',
            'Immobilienkredit',
            'Urlaubs-Kredite'
          ],
          correctAnswer: 2,
          explanation: 'Gute Schulden wie Immobilienkredite helfen beim Vermögensaufbau, da sie in wertsteigende Assets investieren.'
        }
      ],
      passingScore: 70,
      timeLimit: 300
    },
    {
      lessonId: lessons.find(l => l.title === 'Der Klimawandel: Verstehen und handeln')?._id,
      title: 'Klimawandel Quiz',
      questions: [
        {
          question: 'Um wie viel Grad ist die globale Temperatur seit 1880 gestiegen?',
          type: 'multiple_choice',
          options: [
            '0,5°C',
            '1,1°C',
            '2,0°C',
            '3,0°C'
          ],
          correctAnswer: 1,
          explanation: 'Die globale Durchschnittstemperatur ist seit 1880 um etwa 1,1°C gestiegen.'
        },
        {
          question: 'Was ist das Hauptziel des Pariser Klimaabkommens?',
          type: 'multiple_choice',
          options: [
            'Erderwärmung auf 2°C begrenzen',
            'Erderwärmung auf 1,5°C begrenzen',
            'CO₂-Emissionen halbieren',
            'Alle Kohlekraftwerke schließen'
          ],
          correctAnswer: 1,
          explanation: 'Das Pariser Abkommen zielt darauf ab, die Erderwärmung auf möglichst 1,5°C über dem vorindustriellen Niveau zu begrenzen.'
        },
        {
          question: 'Welcher Bereich verursacht den größten Teil des persönlichen CO₂-Fußabdrucks?',
          type: 'multiple_choice',
          options: [
            'Ernährung',
            'Mobilität',
            'Konsum',
            'Wohnen'
          ],
          correctAnswer: 2,
          explanation: 'Der Konsum (Kleidung, Elektronik, etc.) verursacht mit etwa 3,6 Tonnen CO₂ pro Jahr den größten Teil des persönlichen Fußabdrucks.'
        }
      ],
      passingScore: 70,
      timeLimit: 300
    },
    {
      lessonId: lessons.find(l => l.title === 'Produktivität steigern: Mehr erreichen mit weniger Stress')?._id,
      title: 'Produktivität Quiz',
      questions: [
        {
          question: 'Was besagt das Pareto-Prinzip (80/20-Regel)?',
          type: 'multiple_choice',
          options: [
            '80% der Zeit sollte für Arbeit, 20% für Pause verwendet werden',
            '80% der Ergebnisse kommen von 20% der Aktivitäten',
            '80% der Aufgaben sind unwichtig, 20% sind wichtig',
            '80% der Menschen sind unproduktiv, 20% sind produktiv'
          ],
          correctAnswer: 1,
          explanation: 'Das Pareto-Prinzip besagt, dass 80% der Ergebnisse von 20% der Aktivitäten kommen.'
        },
        {
          question: 'In welchem Quadrant der Eisenhower-Matrix sollten Sie die meiste Zeit verbringen?',
          type: 'multiple_choice',
          options: [
            'Wichtig + Dringlich',
            'Wichtig + Nicht dringlich',
            'Nicht wichtig + Dringlich',
            'Nicht wichtig + Nicht dringlich'
          ],
          correctAnswer: 1,
          explanation: 'Quadrant 2 (Wichtig + Nicht dringlich) ist optimal - hier passieren Prävention, Planung und Entwicklung.'
        },
        {
          question: 'Wie lange dauert ein Pomodoro-Arbeitsblock?',
          type: 'multiple_choice',
          options: [
            '15 Minuten',
            '25 Minuten',
            '45 Minuten',
            '60 Minuten'
          ],
          correctAnswer: 1,
          explanation: 'Ein Pomodoro-Block dauert 25 Minuten, gefolgt von einer 5-minütigen Pause.'
        }
      ],
      passingScore: 70,
      timeLimit: 300
    }
  ];

  for (const quizData of quizzes) {
    if (quizData.lessonId) {
      await Quiz.findOneAndUpdate(
        { lessonId: quizData.lessonId },
        quizData,
        { upsert: true, new: true }
      );
    }
  }

  console.log('✅ Quizzes seeded successfully');
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    await clearDatabase();
    
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
    console.log(`📊 Created ${themes.length} themes, ${lessons.length} lessons, and ${lessons.length} quizzes`);
    
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