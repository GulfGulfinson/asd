import { Quiz } from '../models';

export const seedQuizzes = async (lessons: any[]) => {
  try {
    // Clear existing quizzes
    await Quiz.deleteMany({});
    
    const quizData = {
      // Gesundheit & Fitness
      'Grundlagen einer gesunden Ernährung': [
        {
          question: 'Welche Nährstoffe sind für den Körper essentiell?',
          type: 'multiple-choice',
          options: ['Kohlenhydrate, Proteine, Fette', 'Nur Vitamine', 'Nur Mineralien', 'Nur Wasser'],
          correctAnswer: 0,
          points: 10
        },
        {
          question: 'Wie viele Portionen Obst und Gemüse sollte man täglich essen?',
          type: 'multiple-choice',
          options: ['2 Portionen', '5 Portionen', '10 Portionen', '1 Portion'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist der glykämische Index?',
          type: 'multiple-choice',
          options: ['Ein Maß für Süße', 'Ein Maß für den Blutzuckeranstieg', 'Ein Maß für Kalorien', 'Ein Maß für Vitamine'],
          correctAnswer: 1,
          points: 10
        }
      ],
      'Fitness für Einsteiger': [
        {
          question: 'Wie oft sollten Anfänger pro Woche trainieren?',
          type: 'multiple-choice',
          options: ['Täglich', '2-3 mal pro Woche', 'Einmal pro Woche', 'Nur am Wochenende'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist beim Krafttraining für Anfänger wichtig?',
          type: 'multiple-choice',
          options: ['Maximales Gewicht', 'Korrekte Ausführung', 'Schnelle Bewegungen', 'Lange Trainingszeiten'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Wie lange sollte eine Aufwärmphase dauern?',
          type: 'multiple-choice',
          options: ['2 Minuten', '5-10 Minuten', '20 Minuten', 'Gar nicht nötig'],
          correctAnswer: 1,
          points: 10
        }
      ],

      // Sprachen lernen
      'Effektive Sprachlernmethoden': [
        {
          question: 'Was ist die effektivste Methode zum Vokabellernen?',
          type: 'multiple-choice',
          options: ['Karteikarten', 'Wiederholung in Abständen', 'Einmaliges Lesen', 'Übersetzen'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Wie oft sollte man eine neue Sprache üben?',
          type: 'multiple-choice',
          options: ['Einmal pro Woche', 'Täglich', 'Einmal pro Monat', 'Nur im Urlaub'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist beim Sprachenlernen am wichtigsten?',
          type: 'multiple-choice',
          options: ['Grammatik', 'Vokabeln', 'Sprechen üben', 'Schreiben'],
          correctAnswer: 2,
          points: 10
        }
      ],
      'Vokabeln effektiv lernen und behalten': [
        {
          question: 'Was ist das Spaced-Repetition-System?',
          type: 'multiple-choice',
          options: ['Schnelles Lernen', 'Lernen in zeitlichen Abständen', 'Kontinuierliches Lernen', 'Lernen ohne Pausen'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Wie viele neue Vokabeln sollte man täglich lernen?',
          type: 'multiple-choice',
          options: ['100 Vokabeln', '10-20 Vokabeln', '5 Vokabeln', '50 Vokabeln'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was hilft beim Vokabellernen am meisten?',
          type: 'multiple-choice',
          options: ['Kontext und Beispiele', 'Auswendig lernen', 'Nur lesen', 'Übersetzen'],
          correctAnswer: 0,
          points: 10
        }
      ],

      // Psychologie
      'Grundlagen der menschlichen Psyche': [
        {
          question: 'Was beschreibt das Unterbewusstsein?',
          type: 'multiple-choice',
          options: ['Bewusste Gedanken', 'Automatische Prozesse', 'Logisches Denken', 'Erinnerungen'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was sind die Grundemotionen nach Ekman?',
          type: 'multiple-choice',
          options: ['Freude, Trauer, Wut, Angst, Überraschung, Ekel', 'Nur Freude und Trauer', 'Liebe und Hass', 'Ruhe und Aufregung'],
          correctAnswer: 0,
          points: 10
        },
        {
          question: 'Was ist kognitive Dissonanz?',
          type: 'multiple-choice',
          options: ['Vergesslichkeit', 'Widersprüchliche Überzeugungen', 'Konzentrationsschwäche', 'Kreativität'],
          correctAnswer: 1,
          points: 10
        }
      ],
      'Stressmanagement und Resilienz': [
        {
          question: 'Was ist Resilienz?',
          type: 'multiple-choice',
          options: ['Widerstandsfähigkeit', 'Schwäche', 'Vermeidung', 'Aggression'],
          correctAnswer: 0,
          points: 10
        },
        {
          question: 'Welche Technik hilft bei Stress?',
          type: 'multiple-choice',
          options: ['Vermeidung', 'Atemübungen', 'Ignorieren', 'Mehr arbeiten'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist ein wichtiger Resiliezfaktor?',
          type: 'multiple-choice',
          options: ['Isolation', 'Soziale Unterstützung', 'Perfektionismus', 'Kontrolle über alles'],
          correctAnswer: 1,
          points: 10
        }
      ],

      // Business
      'Startup Grundlagen: Von der Idee zum Unternehmen': [
        {
          question: 'Was bedeutet MVP im Startup-Kontext?',
          type: 'multiple-choice',
          options: ['Most Valuable Player', 'Minimum Viable Product', 'Maximum Value Proposition', 'Modern Virtual Platform'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist ein Business Model Canvas?',
          type: 'multiple-choice',
          options: ['Eine Malvorlage', 'Ein Geschäftsmodell-Framework', 'Ein Computerprogramm', 'Eine Marketingstrategie'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist wichtig für einen Startup-Erfolg?',
          type: 'multiple-choice',
          options: ['Perfektes Produkt von Anfang an', 'Kundenfeedback und Iteration', 'Viel Geld', 'Große Büros'],
          correctAnswer: 1,
          points: 10
        }
      ],
      'Grundlagen des Projektmanagements': [
        {
          question: 'Was ist der kritische Pfad in einem Projekt?',
          type: 'multiple-choice',
          options: ['Der kürzeste Weg', 'Der längste Weg ohne Puffer', 'Der billigste Weg', 'Der einfachste Weg'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was bedeutet Scrum?',
          type: 'multiple-choice',
          options: ['Ein Rugby-Begriff', 'Ein agiles Framework', 'Eine Programmiersprache', 'Ein Tool'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist ein Sprint in Scrum?',
          type: 'multiple-choice',
          options: ['Ein Lauf', 'Ein Zeitraum für die Entwicklung', 'Ein Meeting', 'Ein Dokument'],
          correctAnswer: 1,
          points: 10
        }
      ],

      // Design & UX
      'UX Design Grundlagen: Nutzerzentrisches Design': [
        {
          question: 'Was bedeutet UX?',
          type: 'multiple-choice',
          options: ['User Experience', 'User eXpert', 'Ultra eXtreme', 'Unique eXperience'],
          correctAnswer: 0,
          points: 10
        },
        {
          question: 'Was ist ein Wireframe?',
          type: 'multiple-choice',
          options: ['Ein Draht', 'Eine Grundrisszeichnung für Interfaces', 'Ein Tool', 'Eine Farbe'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist wichtig für gute UX?',
          type: 'multiple-choice',
          options: ['Schöne Farben', 'Benutzerfreundlichkeit', 'Viele Features', 'Komplexität'],
          correctAnswer: 1,
          points: 10
        }
      ],
      'Farbtheorie und visuelles Design': [
        {
          question: 'Was sind Komplementärfarben?',
          type: 'multiple-choice',
          options: ['Ähnliche Farben', 'Gegenüberliegende Farben im Farbkreis', 'Dunkle Farben', 'Helle Farben'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist der Goldene Schnitt?',
          type: 'multiple-choice',
          options: ['1:1 Verhältnis', '1:1,618 Verhältnis', '2:1 Verhältnis', '3:1 Verhältnis'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist Weißraum im Design?',
          type: 'multiple-choice',
          options: ['Nur weiße Bereiche', 'Leerer Raum um Elemente', 'Fehler im Design', 'Verschwendung'],
          correctAnswer: 1,
          points: 10
        }
      ],

      // Produktivität
      'Zeitmanagement: Die wichtigsten Techniken': [
        {
          question: 'Was ist die Pomodoro-Technik?',
          type: 'multiple-choice',
          options: ['Eine Kochmethode', '25 Min arbeiten, 5 Min Pause', 'Eine App', 'Ein italienisches Wort'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was besagt das Pareto-Prinzip?',
          type: 'multiple-choice',
          options: ['50/50 Regel', '80/20 Regel', '90/10 Regel', '70/30 Regel'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist Timeboxing?',
          type: 'multiple-choice',
          options: ['Uhren sammeln', 'Feste Zeitslots für Aufgaben', 'Zeitverschwendung', 'Ein Sport'],
          correctAnswer: 1,
          points: 10
        }
      ],
      'Digitale Tools für mehr Effizienz': [
        {
          question: 'Was ist ein Kanban-Board?',
          type: 'multiple-choice',
          options: ['Ein japanisches Gericht', 'Ein visuelles Organisationstool', 'Eine Software', 'Ein Meeting'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was bedeutet Automatisierung?',
          type: 'multiple-choice',
          options: ['Alles manuell machen', 'Wiederkehrende Aufgaben automatisch erledigen', 'Roboter bauen', 'Schneller arbeiten'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist Cloud Computing?',
          type: 'multiple-choice',
          options: ['Wetter vorhersagen', 'Online-Datenspeicherung und -verarbeitung', 'Ein Computerspiel', 'Eine App'],
          correctAnswer: 1,
          points: 10
        }
      ],

      // Marketing
      'Grundlagen des digitalen Marketings': [
        {
          question: 'Was ist SEO?',
          type: 'multiple-choice',
          options: ['Search Engine Optimization', 'Social Engagement Online', 'Sales Engagement Optimization', 'Strategic Executive Officer'],
          correctAnswer: 0,
          points: 10
        },
        {
          question: 'Was ist eine Conversion Rate?',
          type: 'multiple-choice',
          options: ['Währungsumrechnung', 'Verhältnis von Besuchern zu Käufern', 'Internetgeschwindigkeit', 'Datenübertragung'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist Content Marketing?',
          type: 'multiple-choice',
          options: ['Werbung schalten', 'Wertvollen Inhalt erstellen', 'Spam versenden', 'Preise senken'],
          correctAnswer: 1,
          points: 10
        }
      ],
      'Social Media Marketing erfolgreich umsetzen': [
        {
          question: 'Was ist Engagement auf Social Media?',
          type: 'multiple-choice',
          options: ['Verlobung', 'Interaktion mit Inhalten', 'Bezahlung', 'Anmeldung'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist ein Influencer?',
          type: 'multiple-choice',
          options: ['Ein Virus', 'Person mit großer Reichweite', 'Ein Tool', 'Eine App'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist wichtig für Social Media Erfolg?',
          type: 'multiple-choice',
          options: ['Viele Posts', 'Regelmäßiger, wertvoller Content', 'Teure Werbung', 'Viele Follower kaufen'],
          correctAnswer: 1,
          points: 10
        }
      ],

      // Persönlichkeitsentwicklung
      'Kommunikationsfähigkeiten verbessern': [
        {
          question: 'Was ist aktives Zuhören?',
          type: 'multiple-choice',
          options: ['Laut hören', 'Aufmerksam zuhören und nachfragen', 'Schnell antworten', 'Unterbrechen'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist nonverbale Kommunikation?',
          type: 'multiple-choice',
          options: ['Sprechen ohne Worte', 'Körpersprache und Gestik', 'Schreiben', 'Schweigen'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was hilft bei schwierigen Gesprächen?',
          type: 'multiple-choice',
          options: ['Laut werden', 'Empathie und Verständnis', 'Weglaufen', 'Ignorieren'],
          correctAnswer: 1,
          points: 10
        }
      ],
      'Selbstbewusstsein und Charisma entwickeln': [
        {
          question: 'Was stärkt das Selbstbewusstsein?',
          type: 'multiple-choice',
          options: ['Andere kritisieren', 'Erfolge feiern und aus Fehlern lernen', 'Alles vermeiden', 'Sich verstecken'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Was ist Charisma?',
          type: 'multiple-choice',
          options: ['Aussehen', 'Natürliche Ausstrahlung und Überzeugungskraft', 'Lautstärke', 'Reichtum'],
          correctAnswer: 1,
          points: 10
        },
        {
          question: 'Wie entwickelt man Charisma?',
          type: 'multiple-choice',
          options: ['Arrogant sein', 'Authentisch und interessiert an anderen sein', 'Viel reden', 'Angeben'],
          correctAnswer: 1,
          points: 10
        }
      ]
    };

    const createdQuizzes = [];
    
    for (const lesson of lessons) {
      const questions = quizData[lesson.title as keyof typeof quizData];
      if (questions) {
        const quiz = new Quiz({
          lessonId: lesson._id,
          title: `Quiz: ${lesson.title}`,
          questions: questions,
          passingScore: 70,
          timeLimit: 300
        });
        
        const savedQuiz = await quiz.save();
        createdQuizzes.push(savedQuiz);
      }
    }

    console.log(`✅ Created ${createdQuizzes.length} quizzes`);
    return createdQuizzes;
  } catch (error) {
    console.error('❌ Error seeding quizzes:', error);
    throw error;
  }
}; 