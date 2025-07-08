import { Quiz } from '../models';

export const seedQuizzes = async (lessons: any[]) => {
  try {
    // Clear existing quizzes
    await Quiz.deleteMany({});
    
    const quizzes = [];
    
    for (const lesson of lessons) {
      // Create 1 quiz per lesson
      const quiz = createQuizForLesson(lesson);
      if (quiz) {
        quizzes.push(quiz);
      }
    }
    
    const createdQuizzes = await Quiz.insertMany(quizzes);
    console.log(`✅ Created ${createdQuizzes.length} quizzes`);
    return createdQuizzes;
  } catch (error) {
    console.error('❌ Error seeding quizzes:', error);
    throw error;
  }
};

const createQuizForLesson = (lesson: any) => {
  const quizTemplates = getQuizQuestionsByTheme(lesson.tags[0]); // Use first tag as theme indicator
  
  if (!quizTemplates || quizTemplates.length === 0) {
    return null;
  }
  
  return {
    lessonId: lesson._id,
    title: `Quiz: ${lesson.title}`,
    questions: quizTemplates,
    passingScore: 70,
    timeLimit: 10, // 10 minutes
    attemptsCount: 0,
    averageScore: 0
  };
};

const getQuizQuestionsByTheme = (theme: string) => {
  const questionTemplates: Record<string, any[]> = {
    'grundlagen': [
      {
        question: 'Was ist eine Variable in der Programmierung?',
        type: 'multiple-choice',
        options: [
          'Ein Container für Daten',
          'Eine mathematische Funktion',
          'Ein Programmierwerkzeug',
          'Eine Art von Computer'
        ],
        correctAnswer: 0,
        explanation: 'Eine Variable ist ein benannter Container, der Daten speichert.',
        points: 10
      },
      {
        question: 'Welcher Datentyp wird für Ganzzahlen verwendet?',
        type: 'multiple-choice',
        options: ['String', 'Integer', 'Boolean', 'Float'],
        correctAnswer: 1,
        explanation: 'Integer (int) ist der Datentyp für Ganzzahlen.',
        points: 10
      },
      {
        question: 'Variablen können ihren Wert während der Programmausführung ändern.',
        type: 'true-false',
        options: ['Wahr', 'Falsch'],
        correctAnswer: 0,
        explanation: 'Ja, der Wert von Variablen kann während der Ausführung geändert werden.',
        points: 5
      }
    ],
    'kontrollstrukturen': [
      {
        question: 'Welche Anweisung wird für Bedingungen verwendet?',
        type: 'multiple-choice',
        options: ['for', 'if', 'while', 'switch'],
        correctAnswer: 1,
        explanation: 'if-Anweisungen werden für bedingte Ausführung verwendet.',
        points: 10
      },
      {
        question: 'Eine for-Schleife wird nur einmal ausgeführt.',
        type: 'true-false',
        options: ['Wahr', 'Falsch'],
        correctAnswer: 1,
        explanation: 'Eine for-Schleife kann mehrmals ausgeführt werden, je nach Bedingung.',
        points: 5
      },
      {
        question: 'Vervollständigen Sie: "while (bedingung) { ___ }"',
        type: 'fill-in-the-blank',
        correctAnswer: 'code',
        explanation: 'In einer while-Schleife wird der Code-Block ausgeführt.',
        points: 15
      }
    ],
    'funktionen': [
      {
        question: 'Was ist der Hauptzweck von Funktionen?',
        type: 'multiple-choice',
        options: [
          'Code wiederverwenden',
          'Speicher sparen',
          'Programme verlangsamen',
          'Fehler erzeugen'
        ],
        correctAnswer: 0,
        explanation: 'Funktionen ermöglichen die Wiederverwendung von Code.',
        points: 10
      },
      {
        question: 'Funktionen können Parameter haben.',
        type: 'true-false',
        options: ['Wahr', 'Falsch'],
        correctAnswer: 0,
        explanation: 'Funktionen können Parameter entgegennehmen.',
        points: 5
      }
    ],
    'data-science': [
      {
        question: 'Was bedeutet EDA in Data Science?',
        type: 'multiple-choice',
        options: [
          'Explorative Datenanalyse',
          'Experimentelle Datenauswertung',
          'Externe Datenanbindung',
          'Elektronische Datenarchivierung'
        ],
        correctAnswer: 0,
        explanation: 'EDA steht für Explorative Datenanalyse.',
        points: 10
      },
      {
        question: 'Data Science kombiniert nur Statistik und Programmierung.',
        type: 'true-false',
        options: ['Wahr', 'Falsch'],
        correctAnswer: 1,
        explanation: 'Data Science kombiniert Statistik, Programmierung UND Domänenwissen.',
        points: 5
      }
    ],
    'pandas': [
      {
        question: 'Was ist die Hauptdatenstruktur in Pandas?',
        type: 'multiple-choice',
        options: ['Array', 'DataFrame', 'List', 'Dictionary'],
        correctAnswer: 1,
        explanation: 'DataFrame ist die wichtigste Datenstruktur in Pandas.',
        points: 10
      },
      {
        question: 'Mit welchem Befehl lädt man eine CSV-Datei in Pandas?',
        type: 'multiple-choice',
        options: ['pd.load_csv()', 'pd.read_csv()', 'pd.import_csv()', 'pd.get_csv()'],
        correctAnswer: 1,
        explanation: 'pd.read_csv() ist die Standardfunktion zum Laden von CSV-Dateien.',
        points: 15
      }
    ],
    'html5': [
      {
        question: 'Welches Tag definiert die Hauptstruktur eines HTML-Dokuments?',
        type: 'multiple-choice',
        options: ['<body>', '<html>', '<head>', '<main>'],
        correctAnswer: 1,
        explanation: 'Das <html>-Tag umschließt das gesamte HTML-Dokument.',
        points: 10
      },
      {
        question: 'HTML5 unterstützt native Video-Wiedergabe.',
        type: 'true-false',
        options: ['Wahr', 'Falsch'],
        correctAnswer: 0,
        explanation: 'HTML5 bringt das <video>-Tag für native Videowiedergabe mit.',
        points: 5
      }
    ],
    'startup': [
      {
        question: 'Was bedeutet MVP im Startup-Kontext?',
        type: 'multiple-choice',
        options: [
          'Most Valuable Player',
          'Minimum Viable Product',
          'Maximum Value Proposition',
          'Minimal Variable Process'
        ],
        correctAnswer: 1,
        explanation: 'MVP steht für Minimum Viable Product.',
        points: 10
      },
      {
        question: 'Ein Startup sollte sofort perfekt sein.',
        type: 'true-false',
        options: ['Wahr', 'Falsch'],
        correctAnswer: 1,
        explanation: 'Startups folgen dem Prinzip "Build-Measure-Learn" und verbessern sich iterativ.',
        points: 5
      }
    ],
    'ux-design': [
      {
        question: 'Was steht im Mittelpunkt von UX Design?',
        type: 'multiple-choice',
        options: ['Die Technologie', 'Der Nutzer', 'Das Design', 'Der Gewinn'],
        correctAnswer: 1,
        explanation: 'UX Design ist nutzer-zentriert und stellt den Nutzer in den Mittelpunkt.',
        points: 10
      },
      {
        question: 'Usability Testing sollte erst am Ende durchgeführt werden.',
        type: 'true-false',
        options: ['Wahr', 'Falsch'],
        correctAnswer: 1,
        explanation: 'Usability Testing sollte iterativ während des gesamten Designprozesses stattfinden.',
        points: 5
      }
    ]
  };

  return questionTemplates[theme] || [];
}; 