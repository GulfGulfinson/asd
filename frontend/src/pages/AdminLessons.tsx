import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { themesAPI } from '../services/api';
import ReactMarkdown from 'react-markdown';
import { BookOpen, Tag, Image as ImageIcon, CheckCircle, ChevronDown, ChevronUp, Layers, Star, Eye, Save, XCircle } from 'lucide-react';

interface Lesson {
  _id: string;
  title: string;
  summary: string;
  content?: string;
  themeId?: { _id: string; name: string; color: string } | string;
  difficulty: string;
  isPublished: boolean;
  imageUrl?: string;
  tags?: string[];
  createdAt: string;
}

interface Theme {
  _id: string;
  name: string;
  color: string;
}

const difficulties = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const AdminLessons: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'slides'>('general');
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchLessons = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/admin/lessons');
      const data = res.data;
      if (data.success) {
        setLessons(data.data);
      } else {
        setError(data.error || 'Fehler beim Laden der Lektionen');
      }
    } catch (err) {
      setError('Fehler beim Laden der Lektionen');
    } finally {
      setLoading(false);
    }
  };

  const fetchThemes = async () => {
    try {
      const res = await themesAPI.getAll();
      setThemes(res.data || res);
    } catch {
      setThemes([]);
    }
  };

  useEffect(() => {
    fetchLessons();
    fetchThemes();
    // eslint-disable-next-line
  }, []);

  const handleEdit = (id: string) => {
    const lesson = lessons.find(l => l._id === id);
    if (!lesson) return;
    setEditLesson(lesson);
    setEditForm({
      title: lesson.title,
      summary: lesson.summary,
      themeId: typeof lesson.themeId === 'object' ? lesson.themeId._id : lesson.themeId,
      difficulty: lesson.difficulty,
      isPublished: lesson.isPublished,
      imageUrl: lesson.imageUrl || '',
      tags: lesson.tags ? lesson.tags.join(', ') : '',
    });
    setActiveTab('general');
    setEditModalOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEditForm((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' && e.target instanceof HTMLInputElement ? e.target.checked : value,
    }));
  };

  const handleSlideChange = (field: string, value: string) => {
    setSlides(prev => prev.map((slide, i) => i === currentSlideIdx ? { ...slide, [field]: value } : slide));
  };
  const handleAddSlideAfter = () => {
    setSlides(prev => [
      ...prev.slice(0, currentSlideIdx + 1),
      { title: '', content: '', imageUrl: '' },
      ...prev.slice(currentSlideIdx + 1)
    ]);
    setCurrentSlideIdx(idx => idx + 1);
  };
  const handleDeleteSlide = () => {
    setSlides(prev => {
      const newSlides = prev.filter((_, i) => i !== currentSlideIdx);
      return newSlides.length === 0 ? [{ title: '', content: '', imageUrl: '' }] : newSlides;
    });
    setCurrentSlideIdx(idx => Math.max(0, idx - (currentSlideIdx === 0 ? 0 : 1)));
  };
  const handlePrevSlide = () => setCurrentSlideIdx(idx => Math.max(0, idx - 1));
  const handleNextSlide = () => setCurrentSlideIdx(idx => Math.min(slides.length - 1, idx + 1));

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLesson) return;
    setSaving(true);
    try {
      const payload = {
        ...editForm,
        tags: editForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      };
      const res = await api.put(`/admin/lessons/${editLesson._id}`, payload);
      const data = res.data;
      if (data.success) {
        setLessons(lessons.map(l => l._id === editLesson._id ? data.data : l));
        setEditModalOpen(false);
        setEditLesson(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        alert(data.error || 'Fehler beim Speichern');
      }
    } catch {
      alert('Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Lektion wirklich löschen?')) return;
    try {
      const res = await api.delete(`/admin/lessons/${id}`);
      const data = res.data;
      if (data.success) {
        setLessons(lessons.filter(l => l._id !== id));
      } else {
        alert(data.error || 'Fehler beim Löschen');
      }
    } catch {
      alert('Fehler beim Löschen');
    }
  };

  const handleCreate = () => {
    alert('Create lesson (coming soon)');
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 animate-fadeIn">
        <BookOpen className="w-8 h-8 text-primary-600 animate-popIn" />
        <h2 className="text-3xl font-bold text-primary-700 tracking-tight">Lektion-Übersicht</h2>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500">Alle Lektionen verwalten, bearbeiten oder löschen</span>
        <button onClick={handleCreate} className="btn-primary animate-popIn">+ Neue Lektion</button>
      </div>
      {loading ? (
        <div className="flex items-center gap-2 animate-fadeIn">
          <svg className="animate-spin h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
          <span className="text-primary-600">Lade Lektionen...</span>
        </div>
      ) : error ? (
        <div className="text-red-600 animate-fadeIn">{error}</div>
      ) : (
        <div className="overflow-x-auto animate-slideInUp">
          <table className="min-w-full bg-white border rounded shadow text-sm">
            <thead className="bg-primary-50">
              <tr>
                <th className="px-3 py-2 border-b font-semibold text-primary-700 text-left"><BookOpen className="inline w-4 h-4 mr-1 text-primary-400" />Titel</th>
                <th className="px-3 py-2 border-b font-semibold text-primary-700 text-left"><Layers className="inline w-4 h-4 mr-1 text-blue-400" />Thema</th>
                <th className="px-3 py-2 border-b font-semibold text-primary-700 text-left"><Star className="inline w-4 h-4 mr-1 text-yellow-400" />Schwierigkeit</th>
                <th className="px-3 py-2 border-b font-semibold text-primary-700 text-left"><Eye className="inline w-4 h-4 mr-1 text-indigo-400" />Veröffentlicht</th>
                <th className="px-3 py-2 border-b font-semibold text-primary-700 text-left">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson, idx) => (
                <tr key={lesson._id} className={`transition-all duration-300 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-primary-50 group animate-fadeIn`} style={{ animationDelay: `${idx * 40}ms` }}>
                  <td className="px-3 py-2 border-b">
                    <span className="inline-flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary-400" />
                      <span className="font-medium text-gray-900 group-hover:text-primary-700 transition-colors">{lesson.title}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b">
                    <span className="inline-flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-400" />
                      <span>{typeof lesson.themeId === 'object' ? lesson.themeId.name : lesson.themeId}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b">
                    <span className="inline-flex items-center gap-2">
                      <Star className={`w-4 h-4 ${lesson.difficulty === 'beginner' ? 'text-green-400' : lesson.difficulty === 'intermediate' ? 'text-yellow-400' : 'text-red-400'}`} />
                      <span className="capitalize">{lesson.difficulty}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b">
                    <span className="inline-flex items-center gap-2">
                      <Eye className={`w-4 h-4 ${lesson.isPublished ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className={lesson.isPublished ? 'text-green-700' : 'text-gray-500'}>{lesson.isPublished ? 'Ja' : 'Nein'}</span>
                    </span>
                  </td>
                  <td className="px-3 py-2 border-b space-x-2 flex items-center">
                    <button onClick={() => handleEdit(lesson._id)} className="btn-secondary flex items-center gap-1 animate-popIn"><EditIcon />Bearbeiten</button>
                    <button onClick={() => handleDelete(lesson._id)} className="btn-danger flex items-center gap-1 animate-popIn"><XCircle className="w-4 h-4" />Löschen</button>
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
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-slideInUp">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl transition-colors"
              onClick={() => setEditModalOpen(false)}
              aria-label="Schließen"
            >
              <XCircle className="w-7 h-7" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-8 h-8 text-primary-600 animate-popIn" />
              <h3 className="text-2xl font-bold text-primary-700 tracking-tight">Lektion bearbeiten</h3>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-5">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <label className="block text-sm font-semibold mb-1">Titel</label>
              </div>
              <input type="text" name="title" value={editForm.title} onChange={handleEditFormChange} className="input w-full" required maxLength={200} />
              <div className="flex items-center gap-2 mt-2">
                <Layers className="w-5 h-5 text-blue-400" />
                <label className="block text-sm font-semibold mb-1">Zusammenfassung</label>
              </div>
              <textarea name="summary" value={editForm.summary} onChange={handleEditFormChange} className="input w-full" required maxLength={500} />
              <div className="flex items-center gap-2 mt-2">
                <Tag className="w-5 h-5 text-green-500" />
                <label className="block text-sm font-semibold mb-1">Tags (Komma-getrennt)</label>
              </div>
              <input type="text" name="tags" value={editForm.tags} onChange={handleEditFormChange} className="input w-full" />
              <div className="flex items-center gap-2 mt-2">
                <ImageIcon className="w-5 h-5 text-pink-400" />
                <label className="block text-sm font-semibold mb-1">Bild-URL</label>
              </div>
              <input type="text" name="imageUrl" value={editForm.imageUrl} onChange={handleEditFormChange} className="input w-full" />
              <div className="flex items-center gap-2 mt-2">
                <Eye className="w-5 h-5 text-indigo-400" />
                <label className="block text-sm font-semibold mb-1">Veröffentlicht</label>
                <input type="checkbox" name="isPublished" checked={!!editForm.isPublished} onChange={handleEditFormChange} id="isPublished" className="ml-2" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <ChevronDown className="w-5 h-5 text-gray-400" />
                <label className="block text-sm font-semibold mb-1">Thema</label>
              </div>
              <select name="themeId" value={editForm.themeId} onChange={handleEditFormChange} className="input w-full" required>
                <option value="">Bitte wählen</option>
                {themes.map(theme => (
                  <option key={theme._id} value={theme._id}>{theme.name}</option>
                ))}
              </select>
              <div className="flex items-center gap-2 mt-2">
                <ChevronUp className="w-5 h-5 text-gray-400" />
                <label className="block text-sm font-semibold mb-1">Schwierigkeit</label>
              </div>
              <select name="difficulty" value={editForm.difficulty} onChange={handleEditFormChange} className="input w-full" required>
                {difficulties.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
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

export default AdminLessons;

function EditIcon() {
  return <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L5 12.828a2 2 0 010-2.828L9 13z" /></svg>;
}