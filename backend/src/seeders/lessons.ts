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
      // Create 3-5 lessons per theme
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
    publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
    viewsCount: Math.floor(Math.random() * 1000) + 50,
    likesCount: Math.floor(Math.random() * 100) + 10
  }));
};

const getLessonTemplatesForTheme = (themeSlug: string) => {
  const templates: Record<string, any[]> = {
    'programmierung': [
      {
        title: 'Grundlagen der Programmierung: Variablen und Datentypen',
        summary: 'Lerne die fundamentalen Konzepte von Variablen und Datentypen in der Programmierung.',
        content: `
# Variablen und Datentypen

Variablen sind einer der grundlegendsten Konzepte in der Programmierung. Sie fungieren als Container für Daten, die während der Ausführung eines Programms gespeichert und manipuliert werden können.

## Was sind Variablen?

Eine Variable ist im Wesentlichen ein benannter Speicherplatz in Ihrem Computer, in dem Sie Daten speichern können. Stellen Sie sich eine Variable wie eine Schachtel vor, auf der ein Etikett steht. Das Etikett ist der Name der Variable, und der Inhalt der Schachtel sind die Daten.

## Datentypen

Verschiedene Arten von Daten erfordern verschiedene Datentypen:

**Primitive Datentypen:**
- **Integer (Ganzzahlen)**: 42, -17, 0
- **Float/Double (Dezimalzahlen)**: 3.14, -0.5, 2.71828
- **Boolean (Wahrheitswerte)**: true, false
- **String (Text)**: "Hallo Welt", "Programmierung"
- **Character (Einzelzeichen)**: 'A', '7', '@'

## Variablen in verschiedenen Sprachen

**JavaScript:**
\`\`\`javascript
let name = "Max";
const alter = 25;
var istStudent = true;
\`\`\`

**Python:**
\`\`\`python
name = "Max"
alter = 25
ist_student = True
\`\`\`

**Java:**
\`\`\`java
String name = "Max";
int alter = 25;
boolean istStudent = true;
\`\`\`

## Best Practices

1. **Aussagekräftige Namen**: Verwenden Sie Namen, die den Zweck der Variable beschreiben
2. **Konsistente Namenskonventionen**: camelCase, snake_case oder PascalCase
3. **Initialisierung**: Initialisieren Sie Variablen bei der Deklaration
4. **Gültigkeitsbereich**: Verstehen Sie, wo Ihre Variablen gültig sind

## Übung

Versuchen Sie, Variablen für folgende Szenarien zu erstellen:
- Den Namen eines Benutzers
- Das Alter einer Person
- Ob ein Benutzer eingeloggt ist
- Die Anzahl der Artikel in einem Warenkorb

Das Verständnis von Variablen und Datentypen ist der erste Schritt zu erfolgreichem Programmieren!
        `,
        difficulty: 'beginner',
        tags: ['grundlagen', 'variablen', 'datentypen', 'programmierung']
      },
      {
        title: 'Kontrollstrukturen: if-else und Schleifen',
        summary: 'Verstehe, wie du den Programmfluss mit Bedingungen und Schleifen steuern kannst.',
        content: `
# Kontrollstrukturen in der Programmierung

Kontrollstrukturen bestimmen die Reihenfolge, in der Code ausgeführt wird. Sie sind das Rückgrat jeder Programmlogik.

## Bedingte Anweisungen (if-else)

Mit if-else-Anweisungen können Sie Entscheidungen in Ihrem Code treffen:

\`\`\`javascript
let temperatur = 22;

if (temperatur > 25) {
    console.log("Es ist warm!");
} else if (temperatur > 15) {
    console.log("Es ist angenehm.");
} else {
    console.log("Es ist kalt!");
}
\`\`\`

## Schleifen

Schleifen ermöglichen es, Code mehrfach zu wiederholen:

### For-Schleife
\`\`\`javascript
for (let i = 0; i < 5; i++) {
    console.log("Durchlauf " + i);
}
\`\`\`

### While-Schleife
\`\`\`javascript
let counter = 0;
while (counter < 3) {
    console.log("Counter: " + counter);
    counter++;
}
\`\`\`

### Do-While-Schleife
\`\`\`javascript
let zahl;
do {
    zahl = Math.random();
    console.log("Zahl: " + zahl);
} while (zahl < 0.5);
\`\`\`

## Switch-Anweisungen

Für mehrere Bedingungen gibt es switch:

\`\`\`javascript
let tag = "Montag";

switch (tag) {
    case "Montag":
        console.log("Wochenstart!");
        break;
    case "Freitag":
        console.log("Fast Wochenende!");
        break;
    default:
        console.log("Ein normaler Tag");
}
\`\`\`

## Praktische Anwendung

Diese Strukturen werden verwendet für:
- Benutzereingaben validieren
- Listen durchlaufen
- Menüs erstellen
- Spielelogik implementieren
- Datenverarbeitung

Beherrschen Sie diese Grundlagen, und Sie können komplexe Programme schreiben!
        `,
        difficulty: 'beginner',
        tags: ['kontrollstrukturen', 'if-else', 'schleifen', 'logik']
      },
      {
        title: 'Funktionen: Code organisieren und wiederverwenden',
        summary: 'Lerne, wie du deinen Code mit Funktionen strukturierst und wiederverwendbar machst.',
        content: `
# Funktionen in der Programmierung

Funktionen sind wiederverwendbare Codeblöcke, die eine bestimmte Aufgabe erfüllen. Sie sind essentiell für sauberen, organisierten Code.

## Was sind Funktionen?

Eine Funktion ist wie ein kleines Programm in Ihrem Programm. Sie nimmt Eingaben (Parameter) entgegen, verarbeitet sie und gibt ein Ergebnis zurück.

## Funktionsdefinition

**JavaScript:**
\`\`\`javascript
function addiere(a, b) {
    return a + b;
}

// Arrow Function (moderne Syntax)
const multipliziere = (a, b) => a * b;
\`\`\`

**Python:**
\`\`\`python
def addiere(a, b):
    return a + b

def begruessung(name="Welt"):
    return f"Hallo, {name}!"
\`\`\`

## Parameter und Argumente

- **Parameter**: Platzhalter in der Funktionsdefinition
- **Argumente**: Tatsächliche Werte beim Funktionsaufruf

\`\`\`javascript
function berechtneFlaeche(laenge, breite = 1) {  // breite hat Standardwert
    return laenge * breite;
}

let flaeche = berechtneFlaeche(5, 3);  // 15
let quadrat = berechtneFlaeche(4);     // 4 (breite = 1)
\`\`\`

## Gültigkeitsbereich (Scope)

\`\`\`javascript
let globalVar = "Ich bin global";

function beispielFunktion() {
    let lokalVar = "Ich bin lokal";
    console.log(globalVar);  // Funktioniert
    console.log(lokalVar);   // Funktioniert
}

console.log(globalVar);      // Funktioniert
// console.log(lokalVar);    // Fehler! Variable nicht verfügbar
\`\`\`

## Rückgabewerte

\`\`\`javascript
function istGerade(zahl) {
    return zahl % 2 === 0;
}

function verarbeiteArray(arr) {
    return {
        laenge: arr.length,
        summe: arr.reduce((sum, num) => sum + num, 0),
        durchschnitt: arr.reduce((sum, num) => sum + num, 0) / arr.length
    };
}
\`\`\`

## Höhere Funktionen

Funktionen können andere Funktionen als Parameter nehmen:

\`\`\`javascript
function fuehreAus(operation, a, b) {
    return operation(a, b);
}

const addiere = (x, y) => x + y;
const multipliziere = (x, y) => x * y;

console.log(fuehreAus(addiere, 5, 3));      // 8
console.log(fuehreAus(multipliziere, 5, 3)); // 15
\`\`\`

## Best Practices

1. **Eindeutige Namen**: Funktionsname sollte beschreiben, was sie tut
2. **Eine Aufgabe**: Jede Funktion sollte nur eine Sache tun
3. **Kurz halten**: Funktionen sollten nicht zu lang sein
4. **Dokumentation**: Kommentiere komplexe Funktionen

Funktionen machen Ihren Code modularer, testbarer und wartbarer!
        `,
        difficulty: 'intermediate',
        tags: ['funktionen', 'code-organisation', 'parameter', 'scope']
      },
      {
        title: 'Objektorientierte Programmierung: Klassen und Objekte',
        summary: 'Verstehe die Konzepte der objektorientierten Programmierung und wie du Klassen erstellst.',
        content: `
# Objektorientierte Programmierung (OOP)

Die objektorientierte Programmierung ist ein Paradigma, das Code in wiederverwendbare "Objekte" organisiert, die Daten und Funktionen kapseln.

## Grundkonzepte

### Klassen und Objekte
Eine **Klasse** ist ein Bauplan für Objekte, während ein **Objekt** eine Instanz einer Klasse ist.

**JavaScript:**
\`\`\`javascript
class Auto {
    constructor(marke, modell, jahr) {
        this.marke = marke;
        this.modell = modell;
        this.jahr = jahr;
        this.geschwindigkeit = 0;
    }
    
    beschleunigen(kmh) {
        this.geschwindigkeit += kmh;
        console.log(\`Neue Geschwindigkeit: \${this.geschwindigkeit} km/h\`);
    }
    
    bremsen() {
        this.geschwindigkeit = 0;
        console.log("Auto gestoppt");
    }
}

// Objekt erstellen
const meinAuto = new Auto("BMW", "X5", 2023);
meinAuto.beschleunigen(50); // Neue Geschwindigkeit: 50 km/h
\`\`\`

## Die vier Säulen der OOP

### 1. Kapselung (Encapsulation)
Daten und Methoden werden in einer Einheit zusammengefasst und von außen geschützt.

\`\`\`javascript
class Bankkonto {
    #kontostand; // Private Eigenschaft
    
    constructor(anfangssaldo) {
        this.#kontostand = anfangssaldo;
    }
    
    einzahlen(betrag) {
        if (betrag > 0) {
            this.#kontostand += betrag;
        }
    }
    
    getSaldo() {
        return this.#kontostand;
    }
}
\`\`\`

### 2. Vererbung (Inheritance)
Neue Klassen können Eigenschaften und Methoden von bestehenden Klassen übernehmen.

\`\`\`javascript
class Fahrzeug {
    constructor(marke, jahr) {
        this.marke = marke;
        this.jahr = jahr;
    }
    
    starten() {
        console.log("Fahrzeug gestartet");
    }
}

class Motorrad extends Fahrzeug {
    constructor(marke, jahr, hubraum) {
        super(marke, jahr); // Elternkonstruktor aufrufen
        this.hubraum = hubraum;
    }
    
    wheelie() {
        console.log("Wheelie!");
    }
}
\`\`\`

### 3. Polymorphismus
Objekte verschiedener Klassen können über dieselbe Schnittstelle verwendet werden.

\`\`\`javascript
class Tier {
    lautGeben() {
        console.log("Tier macht Geräusch");
    }
}

class Hund extends Tier {
    lautGeben() {
        console.log("Wau wau!");
    }
}

class Katze extends Tier {
    lautGeben() {
        console.log("Miau!");
    }
}

const tiere = [new Hund(), new Katze()];
tiere.forEach(tier => tier.lautGeben()); // Polymorphe Verwendung
\`\`\`

### 4. Abstraktion
Komplexe Implementierungsdetails werden vor dem Benutzer verborgen.

\`\`\`javascript
class Waschmaschine {
    #motor;
    #pumpe;
    #heizelement;
    
    waschen(programm) {
        this.#vorbereiten();
        this.#waschzyklus(programm);
        this.#schleudern();
        this.#fertig();
    }
    
    #vorbereiten() { /* Interne Logik */ }
    #waschzyklus(programm) { /* Interne Logik */ }
    #schleudern() { /* Interne Logik */ }
    #fertig() { console.log("Waschgang beendet"); }
}
\`\`\`

OOP macht Code wartbarer, wiederverwendbarer und einfacher zu verstehen!
        `,
        difficulty: 'intermediate',
        tags: ['oop', 'klassen', 'objekte', 'vererbung']
      },
      {
        title: 'Datenstrukturen: Arrays, Listen und Maps',
        summary: 'Lerne die wichtigsten Datenstrukturen und wann du sie einsetzt.',
        content: `
# Datenstrukturen in der Programmierung

Datenstrukturen sind verschiedene Wege, Daten zu organisieren und zu speichern, um effizient darauf zugreifen zu können.

## Arrays (Listen)

Arrays sind geordnete Sammlungen von Elementen des gleichen oder verschiedener Typen.

\`\`\`javascript
// Array erstellen
const früchte = ['Apfel', 'Banane', 'Orange'];
const zahlen = [1, 2, 3, 4, 5];

// Zugriff auf Elemente
console.log(früchte[0]); // "Apfel"
console.log(früchte.length); // 3

// Elemente hinzufügen
früchte.push('Traube'); // Am Ende hinzufügen
früchte.unshift('Mango'); // Am Anfang hinzufügen

// Elemente entfernen
const letztesFrucht = früchte.pop(); // Letztes Element entfernen
const erstesFrucht = früchte.shift(); // Erstes Element entfernen
\`\`\`

## Array-Methoden

\`\`\`javascript
const zahlen = [1, 2, 3, 4, 5];

// map: Transformiert jedes Element
const verdoppelt = zahlen.map(x => x * 2); // [2, 4, 6, 8, 10]

// filter: Filtert Elemente nach Bedingung
const gerade = zahlen.filter(x => x % 2 === 0); // [2, 4]

// reduce: Reduziert Array auf einen Wert
const summe = zahlen.reduce((acc, x) => acc + x, 0); // 15

// find: Findet erstes Element, das Bedingung erfüllt
const gefunden = zahlen.find(x => x > 3); // 4

// forEach: Führt Funktion für jedes Element aus
zahlen.forEach(x => console.log(x));
\`\`\`

## Maps (Schlüssel-Wert-Paare)

Maps speichern Daten als Schlüssel-Wert-Paare.

\`\`\`javascript
// Map erstellen
const benutzer = new Map();

// Werte setzen
benutzer.set('name', 'Max');
benutzer.set('alter', 25);
benutzer.set('stadt', 'Berlin');

// Werte abrufen
console.log(benutzer.get('name')); // "Max"

// Prüfen ob Schlüssel existiert
console.log(benutzer.has('email')); // false

// Über Map iterieren
for (const [schlüssel, wert] of benutzer) {
    console.log(\`\${schlüssel}: \${wert}\`);
}
\`\`\`

## Sets (Eindeutige Werte)

Sets speichern nur eindeutige Werte.

\`\`\`javascript
const eindeutigeZahlen = new Set([1, 2, 2, 3, 3, 4]);
console.log(eindeutigeZahlen); // Set { 1, 2, 3, 4 }

// Werte hinzufügen
eindeutigeZahlen.add(5);

// Prüfen ob Wert existiert
console.log(eindeutigeZahlen.has(3)); // true

// Größe ermitteln
console.log(eindeutigeZahlen.size); // 5
\`\`\`

## Wann welche Datenstruktur?

**Arrays verwenden für:**
- Geordnete Listen
- Wenn Reihenfolge wichtig ist
- Indexbasierter Zugriff

**Maps verwenden für:**
- Schlüssel-Wert-Zuordnungen
- Wenn Schlüssel keine Strings sind
- Häufiges Hinzufügen/Entfernen

**Sets verwenden für:**
- Eindeutige Werte
- Duplikate vermeiden
- Mengenoperationen

Die richtige Datenstruktur macht Ihren Code effizienter und lesbarer!
        `,
        difficulty: 'beginner',
        tags: ['datenstrukturen', 'arrays', 'maps', 'sets']
      },
      {
        title: 'Error Handling: Fehler elegant behandeln',
        summary: 'Lerne, wie du Fehler in deinen Programmen abfängst und behandelst.',
        content: `
# Error Handling in der Programmierung

Fehlerbehandlung ist essentiell für robuste Software. Lerne, wie du Fehler vorhersagen, abfangen und elegant behandeln kannst.

## Try-Catch-Finally

\`\`\`javascript
try {
    // Code, der einen Fehler verursachen könnte
    const result = riskyOperation();
    console.log("Erfolg:", result);
} catch (error) {
    // Fehlerbehandlung
    console.error("Ein Fehler ist aufgetreten:", error.message);
} finally {
    // Code, der immer ausgeführt wird
    console.log("Aufräumen...");
}
\`\`\`

## Verschiedene Fehlertypen

\`\`\`javascript
// ReferenceError
try {
    console.log(nichtDefiniereVariable);
} catch (error) {
    if (error instanceof ReferenceError) {
        console.log("Variable nicht definiert");
    }
}

// TypeError
try {
    null.someMethod();
} catch (error) {
    if (error instanceof TypeError) {
        console.log("Methode auf null/undefined aufgerufen");
    }
}

// SyntaxError (zur Laufzeit nicht abfangbar)
// RangeError
try {
    const arr = new Array(-1); // Negative Länge
} catch (error) {
    if (error instanceof RangeError) {
        console.log("Ungültiger Wertebereich");
    }
}
\`\`\`

## Eigene Fehler werfen

\`\`\`javascript
function teileDurch(a, b) {
    if (b === 0) {
        throw new Error("Division durch Null ist nicht erlaubt");
    }
    return a / b;
}

function validateAge(age) {
    if (age < 0) {
        throw new RangeError("Alter kann nicht negativ sein");
    }
    if (age > 150) {
        throw new RangeError("Alter zu hoch");
    }
    return true;
}

try {
    validateAge(-5);
} catch (error) {
    console.error("Validierungsfehler:", error.message);
}
\`\`\`

## Async/Await Error Handling

\`\`\`javascript
async function fetchUserData(userId) {
    try {
        const response = await fetch(\`/api/users/\${userId}\`);
        
        if (!response.ok) {
            throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
        }
        
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error);
        throw error; // Fehler weiterleiten
    }
}

// Verwendung
async function displayUser(userId) {
    try {
        const user = await fetchUserData(userId);
        console.log("Benutzer geladen:", user);
    } catch (error) {
        console.log("Benutzer konnte nicht geladen werden");
    }
}
\`\`\`

## Promise Error Handling

\`\`\`javascript
fetch('/api/data')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Daten erhalten:', data);
    })
    .catch(error => {
        console.error('Fehler:', error);
    })
    .finally(() => {
        console.log('Anfrage abgeschlossen');
    });
\`\`\`

## Defensive Programmierung

\`\`\`javascript
function processArray(arr) {
    // Eingabe validieren
    if (!Array.isArray(arr)) {
        throw new TypeError("Parameter muss ein Array sein");
    }
    
    if (arr.length === 0) {
        return []; // Graceful handling
    }
    
    return arr.map(item => {
        // Jedes Element prüfen
        if (typeof item !== 'number') {
            console.warn(\`Warnung: \${item} ist keine Zahl\`);
            return 0; // Fallback-Wert
        }
        return item * 2;
    });
}
\`\`\`

## Error Boundaries (React)

\`\`\`javascript
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    
    componentDidCatch(error, errorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return <h1>Etwas ist schiefgelaufen.</h1>;
        }
        return this.props.children;
    }
}
\`\`\`

## Best Practices

1. **Spezifische Fehler fangen**: Verwende verschiedene catch-Blöcke für verschiedene Fehlertypen
2. **Nicht alle Fehler schlucken**: Log Fehler für Debugging
3. **Graceful Degradation**: Biete Fallback-Lösungen
4. **User-friendly Messages**: Zeige Benutzern verständliche Fehlermeldungen
5. **Fail Fast**: Fehler früh erkennen und behandeln

Gute Fehlerbehandlung macht deine Software robust und benutzerfreundlich!
        `,
        difficulty: 'intermediate',
        tags: ['error-handling', 'try-catch', 'debugging', 'robustheit']
      }
    ],
    
    'data-science': [
      {
        title: 'Einführung in Data Science: Was ist Datenanalyse?',
        summary: 'Entdecke die Grundlagen der Datenanalyse und lerne die wichtigsten Konzepte kennen.',
        content: `
# Einführung in Data Science

Data Science ist die Kunst und Wissenschaft, aus Daten wertvolle Erkenntnisse zu gewinnen. In unserer digitalen Welt sind Daten das neue Öl.

## Was ist Data Science?

Data Science kombiniert verschiedene Disziplinen:
- **Statistik**: Mathematische Methoden zur Datenanalyse
- **Informatik**: Programmierung und Algorithmen
- **Domänenwissen**: Verständnis des Geschäftsbereichs
- **Datenvisualisierung**: Darstellung von Erkenntnissen

## Der Data Science Prozess

### 1. Problemdefinition
Bevor Sie mit der Analyse beginnen, müssen Sie verstehen:
- Welche Frage soll beantwortet werden?
- Welche Geschäftsziele verfolgen wir?
- Was sind die Erfolgskriterien?

### 2. Datensammlung
Daten können aus verschiedenen Quellen stammen:
- Datenbanken
- APIs
- Webseiten (Web Scraping)
- Sensoren und IoT-Geräte
- Umfragen und Studien

### 3. Datenbereinigung
Raw Data ist selten perfekt:
- Fehlende Werte behandeln
- Duplikate entfernen
- Inkonsistenzen korrigieren
- Datentypen anpassen

### 4. Explorative Datenanalyse (EDA)
\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt

# Daten laden
df = pd.read_csv('data.csv')

# Grundlegende Statistiken
print(df.describe())

# Datentypen prüfen
print(df.info())

# Visualisierung
df['column'].hist()
plt.show()
\`\`\`

### 5. Modellierung
Je nach Problem verschiedene Ansätze:
- **Supervised Learning**: Mit bekannten Antworten lernen
- **Unsupervised Learning**: Muster in Daten finden
- **Reinforcement Learning**: Durch Belohnung lernen

### 6. Evaluation
Modelle bewerten:
- Accuracy, Precision, Recall
- Cross-Validation
- A/B Testing

### 7. Deployment
Modelle in Produktion bringen:
- APIs erstellen
- Dashboard entwickeln
- Automatisierte Berichte

## Wichtige Tools

**Programmiersprachen:**
- Python (pandas, numpy, scikit-learn)
- R (statistisch fokussiert)
- SQL (Datenbankabfragen)

**Visualisierung:**
- Tableau
- Power BI
- Python (matplotlib, seaborn, plotly)

**Big Data:**
- Hadoop
- Spark
- ElasticSearch

## Karrierewege

- **Data Analyst**: Fokus auf Berichterstattung
- **Data Scientist**: Modellentwicklung
- **Data Engineer**: Dateninfrastruktur
- **ML Engineer**: Modelle in Produktion

Data Science verändert Branchen von Gesundheitswesen bis Finanzwesen. Starten Sie Ihre Reise heute!
        `,
        difficulty: 'beginner',
        tags: ['data-science', 'datenanalyse', 'einführung', 'prozess']
      },
      {
        title: 'Python für Data Science: Pandas Grundlagen',
        summary: 'Lerne die wichtigste Python-Bibliothek für Datenmanipulation kennen.',
        content: `
# Pandas: Die Grundlage der Datenanalyse in Python

Pandas ist die wichtigste Bibliothek für Datenmanipulation in Python. Sie macht die Arbeit mit strukturierten Daten einfach und effizient.

## Installation und Import

\`\`\`python
# Installation
pip install pandas

# Import
import pandas as pd
import numpy as np
\`\`\`

## Grundlegende Datenstrukturen

### Series (eindimensional)
\`\`\`python
# Series erstellen
s = pd.Series([1, 3, 5, np.nan, 6, 8])
print(s)

# Mit Index
s = pd.Series([1, 2, 3], index=['a', 'b', 'c'])
print(s['a'])  # 1
\`\`\`

### DataFrame (zweidimensional)
\`\`\`python
# DataFrame erstellen
data = {
    'Name': ['Anna', 'Bob', 'Charlie'],
    'Alter': [25, 30, 35],
    'Stadt': ['Berlin', 'München', 'Hamburg']
}
df = pd.DataFrame(data)
print(df)
\`\`\`

## Daten laden und speichern

\`\`\`python
# CSV laden
df = pd.read_csv('datei.csv')

# Excel laden
df = pd.read_excel('datei.xlsx')

# JSON laden
df = pd.read_json('datei.json')

# Speichern
df.to_csv('output.csv', index=False)
\`\`\`

## Datenexploration

\`\`\`python
# Überblick
print(df.head())        # Erste 5 Zeilen
print(df.tail())        # Letzte 5 Zeilen
print(df.info())        # Datentypen und Nullwerte
print(df.describe())    # Statistische Zusammenfassung

# Shape
print(df.shape)         # (Zeilen, Spalten)

# Spalten
print(df.columns)       # Spaltennamen
\`\`\`

## Datenauswahl

\`\`\`python
# Spalte auswählen
namen = df['Name']
alter = df.Alter  # Alternative

# Mehrere Spalten
subset = df[['Name', 'Alter']]

# Zeilen auswählen
erste_zeile = df.iloc[0]    # Nach Position
bestimmte_zeile = df.loc[0] # Nach Index

# Bedingungen
erwachsene = df[df['Alter'] >= 18]
berliner = df[df['Stadt'] == 'Berlin']

# Kombination
junge_berliner = df[(df['Alter'] < 30) & (df['Stadt'] == 'Berlin')]
\`\`\`

## Datenmanipulation

\`\`\`python
# Neue Spalte hinzufügen
df['Altersgruppe'] = df['Alter'].apply(lambda x: 'Jung' if x < 30 else 'Alt')

# Spalte löschen
df = df.drop('Stadt', axis=1)

# Werte ändern
df.loc[df['Name'] == 'Anna', 'Alter'] = 26

# Sortieren
df_sorted = df.sort_values('Alter', ascending=False)
\`\`\`

## Fehlende Werte behandeln

\`\`\`python
# Fehlende Werte finden
print(df.isnull().sum())

# Zeilen mit NaN löschen
df_clean = df.dropna()

# Werte ersetzen
df_filled = df.fillna(0)  # Mit 0 füllen
df_filled = df.fillna(df.mean())  # Mit Durchschnitt füllen
\`\`\`

## Gruppierung und Aggregation

\`\`\`python
# Gruppieren
grouped = df.groupby('Stadt')

# Aggregation
result = df.groupby('Stadt').agg({
    'Alter': ['mean', 'max', 'min'],
    'Name': 'count'
})

# Value counts
stadt_counts = df['Stadt'].value_counts()
\`\`\`

## Praktisches Beispiel

\`\`\`python
# Verkaufsdaten analysieren
verkaufe = pd.read_csv('verkaufe.csv')

# Grundlegende Exploration
print("Datensatz Shape:", verkaufe.shape)
print("\\nFehlende Werte:")
print(verkaufe.isnull().sum())

# Umsatz nach Monat
verkaufe['Datum'] = pd.to_datetime(verkaufe['Datum'])
verkaufe['Monat'] = verkaufe['Datum'].dt.month

monatlicher_umsatz = verkaufe.groupby('Monat')['Umsatz'].sum()
print("\\nMonatlicher Umsatz:")
print(monatlicher_umsatz)

# Top 5 Produkte
top_produkte = verkaufe.groupby('Produkt')['Menge'].sum().sort_values(ascending=False).head()
print("\\nTop 5 Produkte:")
print(top_produkte)
\`\`\`

Pandas macht Datenanalyse zugänglich und effizient. Mit diesen Grundlagen können Sie bereits komplexe Datenmanipulationen durchführen!
        `,
        difficulty: 'intermediate',
        tags: ['python', 'pandas', 'datenmanipulation', 'dataframe']
      },
      {
        title: 'Machine Learning Basics: Supervised vs Unsupervised Learning',
        summary: 'Verstehe die Grundlagen des maschinellen Lernens und die verschiedenen Lernarten.',
        content: `
# Machine Learning Grundlagen

Machine Learning ist ein Teilbereich der künstlichen Intelligenz, der Computern ermöglicht, aus Daten zu lernen, ohne explizit programmiert zu werden.

## Was ist Machine Learning?

Machine Learning verwendet Algorithmen, um Muster in Daten zu identifizieren und Vorhersagen oder Entscheidungen zu treffen.

**Traditionelle Programmierung:**
Input + Programm → Output

**Machine Learning:**
Input + Output → Programm (Modell)

## Supervised Learning (Überwachtes Lernen)

Bei überwachtem Lernen trainieren wir Modelle mit Eingabe-Ausgabe-Paaren.

### Beispiele:
- **E-Mail-Spam-Erkennung**: Text → Spam/Nicht-Spam
- **Bildklassifikation**: Bild → Katze/Hund
- **Preisvorhersage**: Hauseigenschaften → Preis

### Algorithmen:
\`\`\`python
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

# Lineare Regression für Preisvorhersage
model = LinearRegression()
model.fit(X_train, y_train)
predictions = model.predict(X_test)

# Entscheidungsbaum für Klassifikation
classifier = DecisionTreeClassifier()
classifier.fit(X_train, y_train)
classes = classifier.predict(X_test)
\`\`\`

## Unsupervised Learning (Unüberwachtes Lernen)

Hier suchen wir Muster in Daten ohne vorgegebene Antworten.

### Clustering (Gruppierung)
\`\`\`python
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt

# K-Means Clustering
kmeans = KMeans(n_clusters=3)
clusters = kmeans.fit_predict(data)

plt.scatter(data[:, 0], data[:, 1], c=clusters)
plt.title('Customer Segments')
plt.show()
\`\`\`

### Dimensionalitätsreduktion
\`\`\`python
from sklearn.decomposition import PCA

# Principal Component Analysis
pca = PCA(n_components=2)
reduced_data = pca.fit_transform(high_dim_data)
\`\`\`

## Der ML Workflow

### 1. Problemdefinition
- Was wollen wir vorhersagen?
- Welche Art von Problem ist es?
- Welche Daten benötigen wir?

### 2. Datensammlung
\`\`\`python
import pandas as pd

# Daten laden
df = pd.read_csv('data.csv')

# Fehlende Werte behandeln
df = df.fillna(df.mean())

# Kategorische Variablen encodieren
df_encoded = pd.get_dummies(df)
\`\`\`

### 3. Feature Engineering
\`\`\`python
# Neue Features erstellen
df['price_per_sqft'] = df['price'] / df['square_feet']
df['age'] = 2024 - df['year_built']

# Features skalieren
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
\`\`\`

### 4. Modellauswahl und Training
\`\`\`python
from sklearn.model_selection import train_test_split

# Daten aufteilen
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Verschiedene Modelle testen
models = {
    'Linear Regression': LinearRegression(),
    'Random Forest': RandomForestRegressor(),
    'SVM': SVR()
}

for name, model in models.items():
    model.fit(X_train, y_train)
    score = model.score(X_test, y_test)
    print(f'{name}: {score:.3f}')
\`\`\`

### 5. Evaluation
\`\`\`python
from sklearn.metrics import mean_squared_error, accuracy_score

# Regression Metriken
mse = mean_squared_error(y_test, predictions)
rmse = np.sqrt(mse)

# Klassifikation Metriken
accuracy = accuracy_score(y_test, predictions)
\`\`\`

## Reinforcement Learning

Lernen durch Belohnung und Bestrafung.

**Beispiele:**
- Spiele (AlphaGo, Chess)
- Robotik
- Autonomous Vehicles
- Trading Algorithmen

## Common Pitfalls

1. **Overfitting**: Modell lernt Training-Daten auswendig
2. **Underfitting**: Modell ist zu simpel
3. **Data Leakage**: Zukunftsinformationen im Training
4. **Bias in Data**: Verzerrte Trainingsdaten

Machine Learning ist mächtig, aber erfordert sorgfältige Anwendung!
        `,
        difficulty: 'intermediate',
        tags: ['machine-learning', 'supervised', 'unsupervised', 'ai']
      },
      {
        title: 'Data Visualization: Daten zum Leben erwecken',
        summary: 'Lerne, wie du Daten effektiv visualisierst und Geschichten erzählst.',
        content: `
# Data Visualization

Eine gute Datenvisualisierung kann komplexe Informationen auf einen Blick verständlich machen und wichtige Insights aufdecken.

## Warum Visualisierung wichtig ist

"Ein Bild sagt mehr als tausend Worte" – das gilt besonders für Daten.

**Vorteile:**
- Schnelle Mustererkennung
- Outlier-Identifikation
- Trend-Analyse
- Effektive Kommunikation

## Grundlegende Diagrammtypen

### Liniendiagramme
Ideal für Zeitreihen und Trends.

\`\`\`python
import matplotlib.pyplot as plt
import pandas as pd

# Zeitreihen-Daten
dates = pd.date_range('2024-01-01', periods=12, freq='M')
sales = [100, 120, 115, 140, 155, 170, 165, 180, 190, 185, 200, 220]

plt.figure(figsize=(10, 6))
plt.plot(dates, sales, marker='o', linewidth=2)
plt.title('Monatliche Verkäufe 2024')
plt.xlabel('Monat')
plt.ylabel('Verkäufe (in Tsd. €)')
plt.grid(True, alpha=0.3)
plt.show()
\`\`\`

### Balkendiagramme
Perfekt für Kategorienvergleiche.

\`\`\`python
categories = ['A', 'B', 'C', 'D', 'E']
values = [23, 45, 56, 78, 32]

plt.figure(figsize=(8, 6))
bars = plt.bar(categories, values, color=['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'])
plt.title('Verkäufe nach Kategorie')
plt.ylabel('Anzahl')

# Werte auf Balken anzeigen
for bar, value in zip(bars, values):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1, 
             str(value), ha='center', va='bottom')
plt.show()
\`\`\`

### Scatterplots
Zeigen Beziehungen zwischen zwei Variablen.

\`\`\`python
import numpy as np

# Korrelierte Daten generieren
x = np.random.normal(50, 15, 100)
y = x * 1.2 + np.random.normal(0, 10, 100)

plt.figure(figsize=(8, 6))
plt.scatter(x, y, alpha=0.6, color='#E74C3C')
plt.xlabel('Variable X')
plt.ylabel('Variable Y')
plt.title('Korrelation zwischen X und Y')

# Trendlinie hinzufügen
z = np.polyfit(x, y, 1)
p = np.poly1d(z)
plt.plot(x, p(x), "r--", alpha=0.8)
plt.show()
\`\`\`

## Erweiterte Visualisierungen

### Heatmaps
\`\`\`python
import seaborn as sns

# Korrelationsmatrix
corr_matrix = df.corr()

plt.figure(figsize=(10, 8))
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', center=0)
plt.title('Korrelationsmatrix')
plt.show()
\`\`\`

### Box Plots
\`\`\`python
# Verteilung verschiedener Gruppen
data = [np.random.normal(100, 15, 100),
        np.random.normal(120, 20, 100),
        np.random.normal(110, 10, 100)]

plt.figure(figsize=(8, 6))
plt.boxplot(data, labels=['Gruppe A', 'Gruppe B', 'Gruppe C'])
plt.title('Verteilung nach Gruppen')
plt.ylabel('Werte')
plt.show()
\`\`\`

## Interaktive Visualisierungen

### Plotly
\`\`\`python
import plotly.express as px

# Interaktiver Scatterplot
fig = px.scatter(df, x='x_column', y='y_column', 
                 color='category', size='size_column',
                 hover_data=['additional_info'])
fig.show()

# Interaktive Zeitreihe
fig = px.line(df, x='date', y='value', 
              title='Interaktive Zeitreihe')
fig.show()
\`\`\`

## Dashboard mit Streamlit

\`\`\`python
import streamlit as st
import plotly.express as px

st.title('Sales Dashboard')

# Sidebar für Filter
st.sidebar.header('Filter')
year = st.sidebar.selectbox('Jahr', [2022, 2023, 2024])
category = st.sidebar.multiselect('Kategorie', ['A', 'B', 'C'])

# Metriken anzeigen
col1, col2, col3 = st.columns(3)
with col1:
    st.metric('Total Sales', '€1.2M', '↑12%')
with col2:
    st.metric('Customers', '2,341', '↑5%')
with col3:
    st.metric('Conversion', '3.2%', '↓0.3%')

# Charts
fig = px.line(filtered_data, x='date', y='sales')
st.plotly_chart(fig)
\`\`\`

## Design Principles

### 1. Klarheit vor Schönheit
- Entferne unnötige Elemente
- Fokus auf die Hauptbotschaft
- Konsistente Farben und Schriftarten

### 2. Richtige Chart-Wahl
- **Zeit**: Liniendiagramm
- **Vergleich**: Balkendiagramm
- **Anteil**: Kreisdiagramm (sparsam verwenden)
- **Korrelation**: Scatterplot
- **Verteilung**: Histogramm, Box Plot

### 3. Farbpsychologie
\`\`\`python
# Gute Farbpaletten
colors_sequential = ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6']
colors_diverging = ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b']
colors_qualitative = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
\`\`\`

## Common Mistakes

1. **3D-Charts**: Oft schwer lesbar
2. **Zu viele Farben**: Überforderung
3. **Falsche Skalierung**: Misleading
4. **Kreisdiagramme mit vielen Kategorien**: Unlesbar
5. **Fehlende Kontext**: Keine Achsenbeschriftung

## Tools Übersicht

**Python:**
- matplotlib (Grundlagen)
- seaborn (Statistische Plots)
- plotly (Interaktiv)
- bokeh (Web-basiert)

**R:**
- ggplot2 (Grammar of Graphics)
- shiny (Interaktive Apps)

**Business Tools:**
- Tableau
- Power BI
- Looker

Gute Visualisierung macht Daten zu Geschichten!
        `,
        difficulty: 'intermediate',
        tags: ['visualization', 'charts', 'matplotlib', 'storytelling']
      }
    ],
    
    'web-development': [
      {
        title: 'HTML5 Grundlagen: Die Struktur des Webs',
        summary: 'Lerne die Grundbausteine von Webseiten mit modernem HTML5 kennen.',
        content: `
# HTML5: Die Grundlage des modernen Webs

HTML (HyperText Markup Language) ist die Struktursprache des Internets. HTML5 ist die neueste Version mit vielen mächtigen Features.

## Grundstruktur eines HTML-Dokuments

\`\`\`html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meine erste Webseite</title>
</head>
<body>
    <h1>Willkommen zu HTML5!</h1>
    <p>Dies ist ein Paragraph.</p>
</body>
</html>
\`\`\`

## Wichtige Meta-Tags

\`\`\`html
<head>
    <!-- Zeichensatz -->
    <meta charset="UTF-8">
    
    <!-- Responsive Design -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO -->
    <meta name="description" content="Beschreibung der Seite">
    <meta name="keywords" content="HTML, CSS, JavaScript">
    
    <!-- Social Media -->
    <meta property="og:title" content="Seitentitel">
    <meta property="og:description" content="Beschreibung">
    <meta property="og:image" content="bild.jpg">
</head>
\`\`\`

## Semantische HTML5 Elemente

\`\`\`html
<body>
    <header>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">Über uns</a></li>
                <li><a href="#contact">Kontakt</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="home">
            <h1>Hauptüberschrift</h1>
            <article>
                <h2>Artikel-Titel</h2>
                <p>Artikel-Inhalt...</p>
            </article>
        </section>
        
        <aside>
            <h3>Sidebar</h3>
            <p>Zusätzliche Informationen</p>
        </aside>
    </main>
    
    <footer>
        <p>&copy; 2024 Meine Webseite</p>
    </footer>
</body>
\`\`\`

## Wichtige HTML-Elemente

### Überschriften
\`\`\`html
<h1>Hauptüberschrift</h1>
<h2>Unterüberschrift</h2>
<h3>Unter-Unterüberschrift</h3>
<!-- h4, h5, h6 -->
\`\`\`

### Text-Formatierung
\`\`\`html
<p>Ein normaler Paragraph mit <strong>wichtigem Text</strong> und <em>betontem Text</em>.</p>
<blockquote>Ein Zitat aus einer anderen Quelle.</blockquote>
<code>console.log("Code-Beispiel");</code>
<pre>
    Vorformatierter Text
    behält Leerzeichen
    und Zeilenumbrüche
</pre>
\`\`\`

### Listen
\`\`\`html
<!-- Ungeordnete Liste -->
<ul>
    <li>Element 1</li>
    <li>Element 2</li>
    <li>Element 3</li>
</ul>

<!-- Geordnete Liste -->
<ol>
    <li>Erster Schritt</li>
    <li>Zweiter Schritt</li>
    <li>Dritter Schritt</li>
</ol>

<!-- Definitionsliste -->
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language</dd>
    <dt>CSS</dt>
    <dd>Cascading Style Sheets</dd>
</dl>
\`\`\`

### Links und Bilder
\`\`\`html
<!-- Links -->
<a href="https://example.com">Externer Link</a>
<a href="#section">Interner Link</a>
<a href="mailto:info@example.com">E-Mail Link</a>
<a href="tel:+49123456789">Telefon Link</a>

<!-- Bilder -->
<img src="bild.jpg" alt="Beschreibung des Bildes" width="300" height="200">

<!-- Responsive Bilder -->
<picture>
    <source media="(max-width: 768px)" srcset="bild-mobil.jpg">
    <source media="(max-width: 1200px)" srcset="bild-tablet.jpg">
    <img src="bild-desktop.jpg" alt="Responsive Bild">
</picture>
\`\`\`

### Tabellen
\`\`\`html
<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Alter</th>
            <th>Stadt</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Anna</td>
            <td>25</td>
            <td>Berlin</td>
        </tr>
        <tr>
            <td>Bob</td>
            <td>30</td>
            <td>München</td>
        </tr>
    </tbody>
</table>
\`\`\`

## HTML5 Multimedia

### Video
\`\`\`html
<video controls width="640" height="360">
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    Ihr Browser unterstützt das Video-Element nicht.
</video>
\`\`\`

### Audio
\`\`\`html
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    Ihr Browser unterstützt das Audio-Element nicht.
</audio>
\`\`\`

## Formulare

\`\`\`html
<form action="/submit" method="post">
    <fieldset>
        <legend>Kontaktformular</legend>
        
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        
        <label for="email">E-Mail:</label>
        <input type="email" id="email" name="email" required>
        
        <label for="message">Nachricht:</label>
        <textarea id="message" name="message" rows="4" cols="50"></textarea>
        
        <button type="submit">Senden</button>
    </fieldset>
</form>
\`\`\`

## Best Practices

1. **Semantisches HTML**: Verwenden Sie Elemente nach ihrer Bedeutung
2. **Accessibility**: Alt-Texte, Labels, semantische Struktur
3. **Validierung**: Prüfen Sie Ihr HTML mit dem W3C Validator
4. **Performance**: Optimieren Sie Bilder und minimieren Sie Code

HTML5 bildet das Fundament für moderne, zugängliche Webseiten!
        `,
        difficulty: 'beginner',
        tags: ['html5', 'web-development', 'semantik', 'struktur']
      }
    ],
    
    'business': [
      {
        title: 'Startup Grundlagen: Von der Idee zum Unternehmen',
        summary: 'Lerne die wichtigsten Schritte zum Aufbau eines erfolgreichen Startups.',
        content: `
# Startup Grundlagen: Der Weg zum erfolgreichen Unternehmen

Ein Startup zu gründen ist eine aufregende Reise voller Herausforderungen und Chancen. Hier sind die fundamentalen Schritte.

## Was ist ein Startup?

Ein Startup ist ein junges Unternehmen, das:
- Ein skalierbares Geschäftsmodell entwickelt
- Innovative Lösungen für bestehende Probleme bietet
- Schnelles Wachstum anstrebt
- Meist technologieorientiert ist

## Phase 1: Ideenfindung und Validierung

### Problemidentifikation
\`\`\`
Fragen Sie sich:
- Welches Problem löse ich?
- Wie groß ist dieses Problem?
- Wer hat dieses Problem?
- Wie lösen Menschen es heute?
\`\`\`

### Zielgruppenanalyse
**Persona-Entwicklung:**
- Demografische Daten
- Verhalten und Gewohnheiten
- Bedürfnisse und Schmerzpunkte
- Kaufentscheidungsprozess

### MVP (Minimum Viable Product)
Entwickeln Sie die einfachste Version Ihres Produkts:
- Kernfunktionalität fokussieren
- Schnell zum Markt
- Frühes Kundenfeedback sammeln
- Iterieren basierend auf Learnings

### Lean Startup Methodik
**Build-Measure-Learn Zyklus:**
1. **Build**: MVP entwickeln
2. **Measure**: Metriken sammeln
3. **Learn**: Erkenntnisse ableiten
4. **Pivot or Persevere**: Kurs anpassen oder beibehalten

## Phase 2: Geschäftsmodell-Entwicklung

### Business Model Canvas
**9 Schlüsselbereiche:**
1. **Key Partners**: Wichtige Partner
2. **Key Activities**: Kernaktivitäten
3. **Key Resources**: Schlüsselressourcen
4. **Value Proposition**: Wertversprechen
5. **Customer Relationships**: Kundenbeziehungen
6. **Channels**: Vertriebskanäle
7. **Customer Segments**: Kundensegmente
8. **Cost Structure**: Kostenstruktur
9. **Revenue Streams**: Einnahmequellen

### Monetarisierungsstrategien
- **SaaS**: Software as a Service (Abonnements)
- **Freemium**: Grundversion kostenlos, Premium kostenpflichtig
- **Marketplace**: Provision bei Transaktionen
- **Advertising**: Werbeeinnahmen
- **E-Commerce**: Direkter Produktverkauf

## Phase 3: Team Building

### Gründerteam
**Ideale Zusammensetzung:**
- **Technical Co-Founder**: Produktentwicklung
- **Business Co-Founder**: Marketing, Sales, Operations
- **Domain Expert**: Branchenkenntnisse

### Equity-Verteilung
**Typische Aufteilung:**
- Gründer: 60-80%
- Early Employees: 10-20%
- Advisor: 1-5%
- Investor: Je nach Finanzierungsrunde

### Kultur aufbauen
- Vision und Mission definieren
- Werte festlegen
- Offene Kommunikation fördern
- Fehlerkultur etablieren

## Phase 4: Finanzierung

### Finanzierungsphasen
**Pre-Seed (0-50k €):**
- Eigene Mittel
- Friends & Family
- Bootstrapping

**Seed (50k-500k €):**
- Angel Investor
- Seed Funds
- Accelerator

**Series A (500k-5M €):**
- Venture Capital
- Strategic Investor

### Investor Pitch
**Pitch Deck Struktur:**
1. Problem
2. Lösung
3. Marktgröße
4. Geschäftsmodell
5. Traction
6. Konkurrenz
7. Team
8. Finanzprognose
9. Finanzierungsbedarf

## Phase 5: Skalierung

### Key Performance Indicators (KPIs)
**SaaS Metriken:**
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Customer Lifetime Value (CLV)
- Churn Rate
- Net Promoter Score (NPS)

### Growth Hacking
- Virale Mechanismen
- Content Marketing
- SEO/SEM
- Social Media
- Partnerships
- Referral Programme

### Operationalisierung
- Prozesse dokumentieren
- Tools und Systeme implementieren
- Quality Assurance
- Customer Support skalieren

## Häufige Fehler vermeiden

1. **Zu lange im Stealth Mode**: Frühes Kundenfeedback ist wichtig
2. **Feature Creep**: Fokus auf Kernfunktionalität behalten
3. **Falsche Hiring-Entscheidungen**: Culture Fit beachten
4. **Cashflow ignorieren**: Runway im Blick behalten
5. **Markt überschätzen**: Realistische Marktgröße analysieren

## Erfolg messen

**Quantitative Metriken:**
- Umsatzwachstum
- Kundenwachstum
- Produktnutzung

**Qualitative Indikatoren:**
- Kundenzufriedenheit
- Team-Motivation
- Marktposition

Ein erfolgreiches Startup braucht Vision, Ausdauer und die Fähigkeit zu lernen und sich anzupassen!
        `,
        difficulty: 'intermediate',
        tags: ['startup', 'geschäftsmodell', 'mvp', 'finanzierung']
      }
    ],
    
    'design-ux': [
      {
        title: 'UX Design Grundlagen: Nutzerzentrisches Design',
        summary: 'Verstehe die Prinzipien von User Experience Design und wie du nutzerfreundliche Interfaces erstellst.',
        content: `
# UX Design: Den Nutzer in den Mittelpunkt stellen

User Experience (UX) Design ist die Kunst, Produkte zu schaffen, die nicht nur funktional, sondern auch freudvoll zu nutzen sind.

## Was ist UX Design?

UX Design umfasst alle Aspekte der Nutzerinteraktion mit einem Produkt:
- **Usability**: Wie einfach ist das Produkt zu nutzen?
- **Accessibility**: Ist es für alle zugänglich?
- **Utility**: Löst es das Problem des Nutzers?
- **Desirability**: Wollen Menschen es nutzen?

## Der UX Design Prozess

### 1. Research & Discovery
**User Research Methoden:**
- **Interviews**: Tiefe Einblicke in Nutzerbedürfnisse
- **Surveys**: Quantitative Daten sammeln
- **Observation**: Nutzer in ihrer natürlichen Umgebung beobachten
- **Analytics**: Bestehende Nutzungsdaten analysieren

**Competitive Analysis:**
- Direkte Konkurrenten analysieren
- Best Practices identifizieren
- Marktlücken finden

### 2. Define & Synthesize
**User Personas erstellen:**
\`\`\`
Persona: "Tech-affine Anna"
- Alter: 28
- Beruf: Marketing Managerin
- Ziele: Effizienz steigern, neue Tools lernen
- Frustrationen: Komplexe Interfaces, schlechte Mobile Experience
- Devices: iPhone, MacBook, iPad
\`\`\`

**User Journey Mapping:**
1. **Awareness**: Wie wird der Nutzer aufmerksam?
2. **Consideration**: Welche Optionen prüft er?
3. **Purchase**: Wie trifft er die Entscheidung?
4. **Onboarding**: Wie startet er mit dem Produkt?
5. **Usage**: Wie nutzt er es regelmäßig?
6. **Advocacy**: Wird er zum Botschafter?

### 3. Ideation & Conceptualization
**Design Thinking Methoden:**
- **Brainstorming**: Alle Ideen sammeln
- **Crazy 8s**: 8 Lösungen in 8 Minuten skizzieren
- **How Might We**: Probleme in Chancen umwandeln

**Information Architecture:**
- Sitemap erstellen
- Content-Hierarchie definieren
- Navigation strukturieren

### 4. Prototyping
**Fidelity-Stufen:**

**Low-Fidelity (Sketches):**
- Schnell und günstig
- Fokus auf Konzept
- Einfache Stifte und Papier

**Mid-Fidelity (Wireframes):**
- Digitale Skizzen
- Grundlegendes Layout
- Tools: Figma, Sketch, Adobe XD

**High-Fidelity (Mockups):**
- Finale Designs
- Echte Inhalte
- Pixel-perfekt

### 5. Testing & Iteration
**Usability Testing:**
- **Moderated**: Direktes Feedback
- **Unmoderated**: Natürliches Verhalten
- **A/B Testing**: Varianten vergleichen

**Testing-Protokoll:**
1. Aufgaben definieren
2. Erfolgs-Metriken festlegen
3. Test durchführen
4. Beobachtungen dokumentieren
5. Verbesserungen ableiten

## UX Design Prinzipien

### 1. User-Centered Design
- Nutzer in jeden Entscheidungsprozess einbeziehen
- Annahmen durch Daten ersetzen
- Empathie für Nutzer entwickeln

### 2. Consistency (Konsistenz)
\`\`\`
Design System Komponenten:
- Farben: Primary, Secondary, Grays
- Typography: Headlines, Body, Captions
- Spacing: 8px Grid System
- Components: Buttons, Forms, Cards
\`\`\`

### 3. Feedback & Communication
- **Loading States**: Nutzer über Fortschritt informieren
- **Error Messages**: Hilfreiche, actionable Nachrichten
- **Success Confirmations**: Positive Bestätigung geben

### 4. Accessibility (Barrierefreiheit)
**WCAG Guidelines beachten:**
- **Farbkontrast**: Mindestens 4.5:1 Ratio
- **Keyboard Navigation**: Alle Funktionen per Tastatur erreichbar
- **Screen Reader**: Semantisches HTML verwenden
- **Alt-Texte**: Bilder beschreiben

## Mobile-First Design

### Responsive Design Prinzipien
\`\`\`css
/* Mobile First Approach */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding: 2rem;
  }
}
\`\`\`

### Touch-Friendly Design
- **Mindest-Touch-Target**: 44px x 44px
- **Thumb-Zones**: Wichtige Funktionen in erreichbare Bereiche
- **Swipe Gestures**: Intuitive Navigation

## UX Writing

### Microcopy Optimierung
**Vorher:**
"Ein Fehler ist aufgetreten"

**Nachher:**
"Ups! Das hat nicht geklappt. Versuchen Sie es in einem Moment erneut."

### Tone of Voice
- **Freundlich**: Persönlich und zugänglich
- **Klar**: Einfache, verständliche Sprache
- **Hilfreich**: Lösungsorientiert
- **Konsistent**: Einheitlicher Stil

## Tools und Software

**Design Tools:**
- Figma (kollaborativ, web-basiert)
- Sketch (Mac-only, Plugin-Ökosystem)
- Adobe XD (Adobe Integration)

**Prototyping:**
- InVision
- Marvel
- Principle

**User Research:**
- Hotjar (Heatmaps, Recordings)
- Maze (Usability Testing)
- Typeform (Surveys)

**Collaboration:**
- Miro (Whiteboards)
- Notion (Dokumentation)
- Slack (Kommunikation)

## KPIs für UX Design

**Quantitative Metriken:**
- Task Success Rate
- Time on Task
- Error Rate
- Conversion Rate

**Qualitative Metriken:**
- System Usability Scale (SUS)
- Net Promoter Score (NPS)
- Customer Satisfaction (CSAT)

Gutes UX Design ist unsichtbar – Nutzer erreichen ihre Ziele, ohne über das Interface nachdenken zu müssen!
        `,
        difficulty: 'intermediate',
        tags: ['ux-design', 'user-research', 'prototyping', 'usability']
      }
    ]
  };

  return templates[themeSlug] || [];
}; 