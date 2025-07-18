import React, { useEffect, useState } from 'react';
import { quizzesAPI } from '../services/api';
import { BookOpen, Layers, Star, Eye, CheckCircle, XCircle, Edit as EditIcon, Save, PlusCircle, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { lessonsAPI } from '../services/api';

const questionTypes = [
  { value: 'multiple-choice', label: 'Multiple Choice' },
  { value: 'true-false', label: 'True/False' },
  { value: 'fill-in-the-blank', label: 'Fill in the Blank' },
];

const AdminQuizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editQuiz, setEditQuiz] = useState<any | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<any>({});
  const [creating, setCreating] = useState(false);
  const [createValidationError, setCreateValidationError] = useState<string | null>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);

  const fetchQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await quizzesAPI.adminList();
      setQuizzes(res.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await lessonsAPI.getAll({ limit: 1000 });
      let lessonsArr = [];
      if (Array.isArray(res.data)) {
        lessonsArr = res.data;
      } else if (Array.isArray(res.data?.data)) {
        lessonsArr = res.data.data;
      } else if (Array.isArray(res)) {
        lessonsArr = res;
      }
      setAllLessons(lessonsArr);
    } catch {
      setAllLessons([]);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    fetchLessons();
  }, []);

  const handleEdit = (id: string) => {
    const quiz = quizzes.find(q => q._id === id);
    if (!quiz) return;
    // Map correctAnswer index to string if needed, and ensure points is set
    const questions = quiz.questions ? quiz.questions.map((q: any) => {
      let correctAnswer = q.correctAnswer;
      // If correctAnswer is a number (index), map to option string
      if (typeof correctAnswer === 'number' && Array.isArray(q.options)) {
        correctAnswer = q.options[correctAnswer] ?? '';
      }
      // If correctAnswer is a string, trim it
      if (typeof correctAnswer === 'string') {
        correctAnswer = correctAnswer.trim();
      }
      // Ensure points is set
      let points = typeof q.points === 'number' && !isNaN(q.points) ? q.points : 10;
      return {
        ...q,
        correctAnswer,
        points,
      };
    }) : [];
    setEditQuiz(quiz);
    setEditForm({
      title: quiz.title,
      passingScore: quiz.passingScore,
      timeLimit: quiz.timeLimit || '',
      questions,
    });
    setCurrentQuestionIdx(0);
    setEditModalOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEditForm((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // Question editing
  const handleQuestionChange = (field: string, value: string | string[] | number, idx: number) => {
    setEditForm((prev: any) => {
      let updatedQuestions = prev.questions.map((q: any, i: number) => {
        if (i !== idx) return q;
        let updated = { ...q, [field]: value };
        // If options are changed, trim and filter out empty options, and reset correctAnswer if needed
        if (field === 'options') {
          const trimmedOptions = (value as string[]).map(opt => opt.trim()).filter(opt => opt);
          if (!trimmedOptions.includes(updated.correctAnswer)) {
            updated.correctAnswer = '';
          }
          updated.options = trimmedOptions;
        }
        // If correctAnswer is changed, trim it
        if (field === 'correctAnswer') {
          updated.correctAnswer = (value as string).trim();
        }
        return updated;
      });
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };
  const handleAddQuestion = () => {
    setEditForm((prev: any) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: '', type: 'multiple-choice', options: ['', ''], correctAnswer: '', explanation: '', points: 10 },
      ],
    }));
    setCurrentQuestionIdx(editForm.questions.length);
  };
  const handleDeleteQuestion = (idx: number) => {
    setEditForm((prev: any) => ({
      ...prev,
      questions: prev.questions.filter((_: any, i: number) => i !== idx),
    }));
    setCurrentQuestionIdx((prevIdx) => Math.max(0, prevIdx - (idx === 0 ? 0 : 1)));
  };
  const handlePrevQuestion = () => setCurrentQuestionIdx(idx => Math.max(0, idx - 1));
  const handleNextQuestion = () => setCurrentQuestionIdx(idx => Math.min(editForm.questions.length - 1, idx + 1));

  const validateQuiz = () => {
    for (let i = 0; i < editForm.questions.length; i++) {
      const q = editForm.questions[i];
      if (!q.question || !q.type) {
        return `Frage ${i + 1}: Fragetext und Typ sind erforderlich.`;
      }
      if (typeof q.points !== 'number' || isNaN(q.points) || q.points <= 0) {
        return `Frage ${i + 1}: Punkte müssen eine positive Zahl sein.`;
      }
      if (q.type === 'multiple-choice') {
        const options = Array.isArray(q.options) ? q.options.map((opt: string) => opt.trim()).filter((opt: string) => opt) : [];
        const correctAnswer = String(q.correctAnswer ?? '').trim();
        if (options.length < 2) {
          return `Frage ${i + 1}: Mindestens zwei Antwortoptionen sind erforderlich und dürfen nicht leer sein.`;
        }
        if (!correctAnswer || !options.includes(correctAnswer)) {
          return `Frage ${i + 1}: Eine gültige korrekte Antwort muss ausgewählt werden.`;
        }
      } else if (q.type === 'true-false') {
        const correctAnswer = String(q.correctAnswer ?? '').trim();
        if (correctAnswer !== 'true' && correctAnswer !== 'false') {
          return `Frage ${i + 1}: Die korrekte Antwort muss 'Wahr' oder 'Falsch' sein.`;
        }
      } else if (q.type === 'fill-in-the-blank') {
        const correctAnswer = String(q.correctAnswer ?? '').trim();
        if (!correctAnswer) {
          return `Frage ${i + 1}: Die korrekte Antwort darf nicht leer sein.`;
        }
      }
    }
    return null;
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editQuiz) return;
    setValidationError(null);
    // Sanitize all options and correct answers before saving
    const sanitizedQuestions = editForm.questions.map((q: any) => {
      let options = Array.isArray(q.options) ? q.options.map((opt: string) => opt.trim()).filter((opt: string) => opt) : [];
      let correctAnswer = String(q.correctAnswer ?? '').trim();
      let points = typeof q.points === 'number' && !isNaN(q.points) ? q.points : 10;
      if (q.type === 'multiple-choice' && !options.includes(correctAnswer)) {
        correctAnswer = '';
      }
      if (q.type === 'true-false' && (correctAnswer !== 'true' && correctAnswer !== 'false')) {
        correctAnswer = '';
      }
      if (q.type === 'fill-in-the-blank' && !correctAnswer) {
        correctAnswer = '';
      }
      return {
        ...q,
        options,
        correctAnswer,
        points,
      };
    });
    const validationMsg = validateQuiz();
    if (validationMsg) {
      setValidationError(validationMsg);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...editQuiz,
        ...editForm,
        timeLimit: editForm.timeLimit ? Number(editForm.timeLimit) : undefined,
        questions: sanitizedQuestions,
      };
      const res = await quizzesAPI.adminUpdate(editQuiz._id, payload);
      const data = res.data;
      if (res.success) {
        setQuizzes(quizzes.map(q => q._id === editQuiz._id ? data : q));
        setEditModalOpen(false);
        setEditQuiz(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        alert(res.error || 'Fehler beim Speichern');
      }
    } catch {
      alert('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Quiz wirklich löschen?')) return;
    setDeletingId(id);
    try {
      const res = await quizzesAPI.adminDelete(id);
      if (res.success) {
        setQuizzes((prev) => prev.filter((q) => q._id !== id));
      } else {
        alert(res.error || 'Fehler beim Löschen');
      }
    } catch {
      alert('Fehler beim Löschen');
    } finally {
      setDeletingId(null);
    }
  };

  // --- CREATE QUIZ ---
  const handleOpenCreate = () => {
    setCreateForm({
      lessonId: '',
      title: '',
      passingScore: 60,
      timeLimit: '',
      questions: [
        { question: '', type: 'multiple-choice', options: ['', ''], correctAnswer: '', explanation: '' },
      ],
    });
    setCreateValidationError(null);
    setCreateModalOpen(true);
  };
  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setCreateForm((prev: any) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };
  const handleCreateQuestionChange = (field: string, value: string | string[] | number, idx: number) => {
    setCreateForm((prev: any) => {
      let updatedQuestions = prev.questions.map((q: any, i: number) => {
        if (i !== idx) return q;
        let updated = { ...q, [field]: value };
        if (field === 'options') {
          const trimmedOptions = (value as string[]).map(opt => opt.trim()).filter(opt => opt);
          if (!trimmedOptions.includes(updated.correctAnswer)) {
            updated.correctAnswer = '';
          }
          updated.options = trimmedOptions;
        }
        if (field === 'correctAnswer') {
          updated.correctAnswer = (value as string).trim();
        }
        return updated;
      });
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };
  const handleAddCreateQuestion = () => {
    setCreateForm((prev: any) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: '', type: 'multiple-choice', options: ['', ''], correctAnswer: '', explanation: '' },
      ],
    }));
  };
  const handleDeleteCreateQuestion = (idx: number) => {
    setCreateForm((prev: any) => ({
      ...prev,
      questions: prev.questions.filter((_: any, i: number) => i !== idx),
    }));
  };
  const handlePrevCreateQuestion = (idx: number) => Math.max(0, idx - 1);
  const handleNextCreateQuestion = (idx: number) => Math.min(createForm.questions.length - 1, idx + 1);

  const validateCreateQuiz = () => {
    if (!createForm.lessonId) return 'Bitte eine Lektion auswählen.';
    if (!createForm.title) return 'Titel ist erforderlich.';
    if (!createForm.questions || createForm.questions.length === 0) return 'Mindestens eine Frage ist erforderlich.';
    for (let i = 0; i < createForm.questions.length; i++) {
      const q = createForm.questions[i];
      if (!q.question || !q.type) {
        return `Frage ${i + 1}: Fragetext und Typ sind erforderlich.`;
      }
      if (q.type === 'multiple-choice') {
        const options = Array.isArray(q.options) ? q.options.map((opt: string) => opt.trim()).filter((opt: string) => opt) : [];
        const correctAnswer = String(q.correctAnswer ?? '').trim();
        if (options.length < 2) {
          return `Frage ${i + 1}: Mindestens zwei Antwortoptionen sind erforderlich und dürfen nicht leer sein.`;
        }
        if (!correctAnswer || !options.includes(correctAnswer)) {
          return `Frage ${i + 1}: Eine gültige korrekte Antwort muss ausgewählt werden.`;
        }
      } else if (q.type === 'true-false') {
        const correctAnswer = String(q.correctAnswer ?? '').trim();
        if (correctAnswer !== 'true' && correctAnswer !== 'false') {
          return `Frage ${i + 1}: Die korrekte Antwort muss 'Wahr' oder 'Falsch' sein.`;
        }
      } else if (q.type === 'fill-in-the-blank') {
        const correctAnswer = String(q.correctAnswer ?? '').trim();
        if (!correctAnswer) {
          return `Frage ${i + 1}: Die korrekte Antwort darf nicht leer sein.`;
        }
      }
    }
    return null;
  };
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateValidationError(null);
    const validationMsg = validateCreateQuiz();
    if (validationMsg) {
      setCreateValidationError(validationMsg);
      return;
    }
    setCreating(true);
    try {
      const payload = {
        ...createForm,
        timeLimit: createForm.timeLimit ? Number(createForm.timeLimit) : undefined,
        questions: createForm.questions.map((q: any) => {
          let options = Array.isArray(q.options) ? q.options.map((opt: string) => opt.trim()).filter((opt: string) => opt) : [];
          let correctAnswer = String(q.correctAnswer ?? '').trim();
          if (q.type === 'multiple-choice' && !options.includes(correctAnswer)) {
            correctAnswer = '';
          }
          if (q.type === 'true-false' && (correctAnswer !== 'true' && correctAnswer !== 'false')) {
            correctAnswer = '';
          }
          if (q.type === 'fill-in-the-blank' && !correctAnswer) {
            correctAnswer = '';
          }
          return {
            ...q,
            options,
            correctAnswer,
          };
        }),
      };
      const res = await quizzesAPI.adminCreate(payload);
      const data = res.data;
      if (res.success) {
        setQuizzes(qs => [...qs, data]);
        setCreateModalOpen(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        setCreateValidationError(res.error || 'Fehler beim Erstellen');
      }
    } catch {
      setCreateValidationError('Fehler beim Erstellen');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 animate-fadeIn">
        <BookOpen className="w-8 h-8 text-primary-600 animate-popIn" />
        <h2 className="text-3xl font-bold text-primary-700 tracking-tight">Quiz-Übersicht</h2>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500">Alle Quizzes verwalten, bearbeiten oder löschen</span>
        <button className="btn-primary animate-popIn" onClick={handleOpenCreate}>+ Neues Quiz</button>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 animate-fadeIn">
          <svg className="animate-spin h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          <span className="text-primary-600">Lade Quizzes...</span>
        </div>
      ) : error ? (
        <div className="text-red-600 animate-fadeIn">{error}</div>
      ) : (
        <div className="overflow-x-auto animate-slideInUp">
          <table className="min-w-full bg-white border rounded shadow text-sm">
            <thead className="bg-primary-50">
              <tr>
                <th className="px-3 py-2 border-b font-semibold text-primary-700 text-left"><BookOpen className="inline w-4 h-4 mr-1 text-primary-400" />Titel</th>
                <th className="px-3 py-2 border-b font-semibold text-primary-700 text-left"><Layers className="inline w-4 h-4 mr-1 text-blue-400" />Lektion</th>
                <th className="px-3 py-2 border-b font-semibold text-primary-700 text-left"><Star className="inline w-4 h-4 mr-1 text-yellow-400" />Fragen</th>
                <th className="px-3 py-2 border-b font-semibold text-primary-700 text-left"><Eye className="inline w-4 h-4 mr-1 text-indigo-400" />Versuche</th>
                <th className="px-3 py-2 border-b font-semibold text-primary-700 text-left">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, idx) => (
                <tr key={quiz._id} className={`transition-all duration-300 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-primary-50 group animate-fadeIn`} style={{ animationDelay: `${idx * 40}ms` }}>
                  <td className="px-3 py-2 border-b">
                    <span className="inline-flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary-400" />
                      <span className="font-medium text-gray-900 group-hover:text-primary-700 transition-colors">{quiz.title}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b">
                    <span className="inline-flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-400" />
                      <span>{quiz.lessonId?.title || quiz.lessonId || '-'}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b">
                    <span className="inline-flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{quiz.questions?.length || 0}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b">
                    <span className="inline-flex items-center gap-2">
                      <Eye className="w-4 h-4 text-indigo-400" />
                      <span>{quiz.attemptsCount || 0}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b space-x-2 flex items-center">
                    <button onClick={() => handleEdit(quiz._id)} className="btn-secondary flex items-center gap-1 animate-popIn"><EditIcon className="w-4 h-4 text-primary-500" />Bearbeiten</button>
                    <button onClick={() => handleDelete(quiz._id)} className="btn-danger flex items-center gap-1 animate-popIn" disabled={deletingId === quiz._id}><XCircle className="w-4 h-4" />{deletingId === quiz._id ? 'Löschen...' : 'Löschen'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative animate-slideInUp max-h-screen overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl transition-colors"
              onClick={() => setEditModalOpen(false)}
              aria-label="Schließen"
            >
              <XCircle className="w-7 h-7" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-primary-600 animate-popIn" />
              <h3 className="text-2xl font-bold text-primary-700 tracking-tight">Quiz bearbeiten</h3>
            </div>
            {validationError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded animate-fadeIn">
                {validationError}
              </div>
            )}
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <label className="block text-sm font-semibold mb-1">Titel</label>
              </div>
              <input type="text" name="title" value={editForm.title} onChange={handleEditFormChange} className="input w-full" required maxLength={200} />
              <div className="flex items-center gap-2 mt-2">
                <ChevronUp className="w-5 h-5 text-gray-400" />
                <label className="block text-sm font-semibold mb-1">Passing Score (%)</label>
              </div>
              <input type="number" name="passingScore" value={editForm.passingScore} onChange={handleEditFormChange} className="input w-full" min={0} max={100} required />
              <div className="flex items-center gap-2 mt-2">
                <ChevronDown className="w-5 h-5 text-gray-400" />
                <label className="block text-sm font-semibold mb-1">Zeitlimit (Minuten, optional)</label>
              </div>
              <input type="number" name="timeLimit" value={editForm.timeLimit} onChange={handleEditFormChange} className="input w-full" min={0} />

              {/* Question Carousel */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">Fragen ({editForm.questions?.length || 0})</span>
                  <button type="button" className="ml-auto btn-primary flex items-center gap-1" onClick={handleAddQuestion}><PlusCircle className="w-4 h-4" />Frage hinzufügen</button>
                </div>
                {editForm.questions && editForm.questions.length > 0 && (
                  <div className="border rounded-lg p-4 bg-gray-50 animate-fadeIn">
                    <div className="flex items-center justify-between mb-2">
                      <button type="button" className="btn-secondary flex items-center gap-1" onClick={handlePrevQuestion} disabled={currentQuestionIdx === 0}><ChevronUp className="w-4 h-4" />Vorherige</button>
                      <span className="text-sm text-gray-600">Frage {currentQuestionIdx + 1} / {editForm.questions.length}</span>
                      <button type="button" className="btn-secondary flex items-center gap-1" onClick={handleNextQuestion} disabled={currentQuestionIdx === editForm.questions.length - 1}>Nächste<ChevronDown className="w-4 h-4" /></button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1">Fragetext</label>
                        <input type="text" className="input w-full" value={editForm.questions[currentQuestionIdx].question} onChange={e => handleQuestionChange('question', e.target.value, currentQuestionIdx)} required maxLength={300} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Fragetyp</label>
                        <select className="input w-full" value={editForm.questions[currentQuestionIdx].type} onChange={e => handleQuestionChange('type', e.target.value, currentQuestionIdx)}>
                          {questionTypes.map(qt => <option key={qt.value} value={qt.value}>{qt.label}</option>)}
                        </select>
                      </div>
                      {editForm.questions[currentQuestionIdx].type === 'multiple-choice' && (
                        <div>
                          <label className="block text-xs font-semibold mb-1">Antwortoptionen</label>
                          {(editForm.questions[currentQuestionIdx].options && editForm.questions[currentQuestionIdx].options.length > 0)
                            ? editForm.questions[currentQuestionIdx].options.map((opt: string, optIdx: number) => (
                                <div key={optIdx} className="flex items-center gap-2 mb-1">
                                  <input type="text" className="input flex-1" value={opt} onChange={e => {
                                    const newOptions = [...editForm.questions[currentQuestionIdx].options];
                                    newOptions[optIdx] = e.target.value;
                                    handleQuestionChange('options', newOptions, currentQuestionIdx);
                                  }} required maxLength={100} />
                                  <button type="button" className="btn-danger px-2 py-1" onClick={() => {
                                    const newOptions = editForm.questions[currentQuestionIdx].options.filter((_: string, i: number) => i !== optIdx);
                                    handleQuestionChange('options', newOptions, currentQuestionIdx);
                                  }} disabled={editForm.questions[currentQuestionIdx].options.length <= 2}><Trash2 className="w-4 h-4" /></button>
                                </div>
                              ))
                            : <div className="text-gray-400 text-xs mb-2">Noch keine Optionen vorhanden.</div>
                          }
                          <button
                            type="button"
                            className="btn-primary flex items-center gap-1 mt-2"
                            onClick={() => {
                              setEditForm((prev: any) => {
                                const questions = [...prev.questions];
                                const options = Array.isArray(questions[currentQuestionIdx].options)
                                  ? [...questions[currentQuestionIdx].options, '']
                                  : [''];
                                questions[currentQuestionIdx] = {
                                  ...questions[currentQuestionIdx],
                                  options,
                                };
                                return { ...prev, questions };
                              });
                            }}
                          >
                            <PlusCircle className="w-4 h-4" /> Option hinzufügen
                          </button>
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-semibold mb-1">Korrekte Antwort</label>
                        {editForm.questions[currentQuestionIdx].type === 'multiple-choice' ? (
                          <select className="input w-full" value={editForm.questions[currentQuestionIdx].correctAnswer} onChange={e => handleQuestionChange('correctAnswer', e.target.value, currentQuestionIdx)}>
                            <option value="">Bitte wählen</option>
                            {editForm.questions[currentQuestionIdx].options.map((opt: string, optIdx: number) => (
                              <option key={optIdx} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : editForm.questions[currentQuestionIdx].type === 'true-false' ? (
                          <select className="input w-full" value={editForm.questions[currentQuestionIdx].correctAnswer} onChange={e => handleQuestionChange('correctAnswer', e.target.value, currentQuestionIdx)}>
                            <option value="true">Wahr</option>
                            <option value="false">Falsch</option>
                          </select>
                        ) : (
                          <input type="text" className="input w-full" value={editForm.questions[currentQuestionIdx].correctAnswer} onChange={e => handleQuestionChange('correctAnswer', e.target.value, currentQuestionIdx)} />
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Punkte</label>
                        <input type="number" className="input w-full" min={1} value={editForm.questions[currentQuestionIdx].points ?? 10} onChange={e => handleQuestionChange('points', Number(e.target.value), currentQuestionIdx)} required />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1">Erklärung (optional)</label>
                        <input type="text" className="input w-full" value={editForm.questions[currentQuestionIdx].explanation || ''} onChange={e => handleQuestionChange('explanation', e.target.value, currentQuestionIdx)} maxLength={300} />
                      </div>
                      <div className="flex justify-end mt-2">
                        <button type="button" className="btn-danger flex items-center gap-1" onClick={() => handleDeleteQuestion(currentQuestionIdx)} disabled={editForm.questions.length <= 1}><Trash2 className="w-4 h-4" />Frage löschen</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="btn-secondary" onClick={() => setEditModalOpen(false)}>Abbrechen</button>
                <button type="submit" className="btn-primary flex items-center gap-2" disabled={saving}>
                  <Save className="w-5 h-5" />
                  {saving ? 'Speichern...' : 'Speichern'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative animate-slideInUp max-h-screen overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl transition-colors"
              onClick={() => setCreateModalOpen(false)}
              aria-label="Schließen"
            >
              <XCircle className="w-7 h-7" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-primary-600 animate-popIn" />
              <h3 className="text-2xl font-bold text-primary-700 tracking-tight">Neues Quiz erstellen</h3>
            </div>
            {createValidationError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded animate-fadeIn">
                {createValidationError}
              </div>
            )}
            <form onSubmit={handleCreateSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1">Lektion</label>
                <select name="lessonId" value={createForm.lessonId} onChange={handleCreateFormChange} className="input w-full" required>
                  <option value="">Bitte wählen</option>
                  {allLessons.filter(l => !quizzes.some(q => q.lessonId?._id === l._id)).map((lesson: any) => (
                    <option key={lesson._id} value={lesson._id}>{lesson.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Titel</label>
                <input type="text" name="title" value={createForm.title} onChange={handleCreateFormChange} className="input w-full" required maxLength={200} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Passing Score (%)</label>
                <input type="number" name="passingScore" value={createForm.passingScore} onChange={handleCreateFormChange} className="input w-full" min={0} max={100} required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Zeitlimit (Minuten, optional)</label>
                <input type="number" name="timeLimit" value={createForm.timeLimit} onChange={handleCreateFormChange} className="input w-full" min={0} />
              </div>
              {/* Question Carousel (reuse logic) */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">Fragen ({createForm.questions?.length || 0})</span>
                  <button type="button" className="ml-auto btn-primary flex items-center gap-1" onClick={handleAddCreateQuestion}><PlusCircle className="w-4 h-4" />Frage hinzufügen</button>
                </div>
                {createForm.questions && createForm.questions.length > 0 && (
                  <div className="border rounded-lg p-4 bg-gray-50 animate-fadeIn">
                    {/* Only show one question at a time for editing */}
                    {createForm.questions.map((q: any, idx: number) => (
                      <div key={idx} className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Frage {idx + 1} / {createForm.questions.length}</span>
                          <button type="button" className="btn-danger flex items-center gap-1" onClick={() => handleDeleteCreateQuestion(idx)} disabled={createForm.questions.length <= 1}><Trash2 className="w-4 h-4" />Frage löschen</button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold mb-1">Fragetext</label>
                            <input type="text" className="input w-full" value={q.question} onChange={e => handleCreateQuestionChange('question', e.target.value, idx)} required maxLength={300} />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">Fragetyp</label>
                            <select className="input w-full" value={q.type} onChange={e => handleCreateQuestionChange('type', e.target.value, idx)}>
                              {questionTypes.map(qt => <option key={qt.value} value={qt.value}>{qt.label}</option>)}
                            </select>
                          </div>
                          {q.type === 'multiple-choice' && (
                            <div>
                              <label className="block text-xs font-semibold mb-1">Antwortoptionen</label>
                              {(q.options && q.options.length > 0)
                                ? q.options.map((opt: string, optIdx: number) => (
                                    <div key={optIdx} className="flex items-center gap-2 mb-1">
                                      <input type="text" className="input flex-1" value={opt} onChange={e => {
                                        const newOptions = [...q.options];
                                        newOptions[optIdx] = e.target.value;
                                        handleCreateQuestionChange('options', newOptions, idx);
                                      }} required maxLength={100} />
                                      <button type="button" className="btn-danger px-2 py-1" onClick={() => {
                                        const newOptions = q.options.filter((_: string, i: number) => i !== optIdx);
                                        handleCreateQuestionChange('options', newOptions, idx);
                                      }} disabled={q.options.length <= 2}><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                  ))
                                : <div className="text-gray-400 text-xs mb-2">Noch keine Optionen vorhanden.</div>
                              }
                              <button
                                type="button"
                                className="btn-primary flex items-center gap-1 mt-2"
                                onClick={() => {
                                  setCreateForm((prev: any) => {
                                    const questions = [...prev.questions];
                                    const options = Array.isArray(questions[idx].options)
                                      ? [...questions[idx].options, '']
                                      : [''];
                                    questions[idx] = {
                                      ...questions[idx],
                                      options,
                                    };
                                    return { ...prev, questions };
                                  });
                                }}
                              >
                                <PlusCircle className="w-4 h-4" /> Option hinzufügen
                              </button>
                            </div>
                          )}
                          <div>
                            <label className="block text-xs font-semibold mb-1">Korrekte Antwort</label>
                            {q.type === 'multiple-choice' ? (
                              <select className="input w-full" value={q.correctAnswer} onChange={e => handleCreateQuestionChange('correctAnswer', e.target.value, idx)}>
                                <option value="">Bitte wählen</option>
                                {q.options.map((opt: string, optIdx: number) => (
                                  <option key={optIdx} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : q.type === 'true-false' ? (
                              <select className="input w-full" value={q.correctAnswer} onChange={e => handleCreateQuestionChange('correctAnswer', e.target.value, idx)}>
                                <option value="true">Wahr</option>
                                <option value="false">Falsch</option>
                              </select>
                            ) : (
                              <input type="text" className="input w-full" value={q.correctAnswer} onChange={e => handleCreateQuestionChange('correctAnswer', e.target.value, idx)} />
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-semibold mb-1">Erklärung (optional)</label>
                            <input type="text" className="input w-full" value={q.explanation || ''} onChange={e => handleCreateQuestionChange('explanation', e.target.value, idx)} maxLength={300} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" className="btn-secondary" onClick={() => setCreateModalOpen(false)}>Abbrechen</button>
                <button type="submit" className="btn-primary flex items-center gap-2" disabled={creating}>
                  <Save className="w-5 h-5" />
                  {creating ? 'Erstellen...' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="fixed top-8 right-8 z-50 animate-fadeIn">
          <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded shadow-lg">
            <CheckCircle className="w-5 h-5" />
            <span>Erfolgreich gespeichert!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuizzes; 