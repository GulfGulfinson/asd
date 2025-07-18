import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useEffect, useState } from 'react';

const Admin: React.FC = () => {
  const [stats, setStats] = useState<{ userCount: number; lessonCount: number; quizCount: number; themeCount: number } | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      setStatsError(null);
      try {
        const res = await adminAPI.getStats();
        setStats(res.data);
      } catch {
        setStatsError('Fehler beim Laden der Admin-Metriken');
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <nav className="mb-8 flex gap-4">
        <Link to="/admin/lessons" className="text-blue-600 hover:underline">Lessons</Link>
        <Link to="/admin/quizzes" className="text-blue-600 hover:underline">Quizzes</Link>
        <Link to="/admin/themes" className="text-blue-600 hover:underline">Themes</Link>
        {/* Room for more: Users, Analytics, etc. */}
      </nav>
      <div className="bg-white rounded shadow p-6 mb-8">
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-primary-700 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01" /></svg>
            Admin Metriken
          </h3>
          {loadingStats ? (
            <div className="text-primary-500 animate-pulse">Lade Metriken...</div>
          ) : statsError ? (
            <div className="text-red-500">{statsError}</div>
          ) : stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-blue-100 rounded-lg p-4 flex flex-col items-center animate-fadeIn">
                <svg className="w-7 h-7 text-blue-500 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3" /></svg>
                <span className="text-2xl font-bold text-blue-700">{stats.lessonCount}</span>
                <span className="text-xs text-blue-700">Lektionen</span>
              </div>
              <div className="bg-yellow-100 rounded-lg p-4 flex flex-col items-center animate-fadeIn">
                <svg className="w-7 h-7 text-yellow-500 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 17l-4 4m0 0l-4-4m4 4V3" /></svg>
                <span className="text-2xl font-bold text-yellow-700">{stats.quizCount}</span>
                <span className="text-xs text-yellow-700">Quizzes</span>
              </div>
              <div className="bg-green-100 rounded-lg p-4 flex flex-col items-center animate-fadeIn">
                <svg className="w-7 h-7 text-green-500 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>
                <span className="text-2xl font-bold text-green-700">{stats.themeCount}</span>
                <span className="text-xs text-green-700">Themen</span>
              </div>
              <div className="bg-purple-100 rounded-lg p-4 flex flex-col items-center animate-fadeIn">
                <svg className="w-7 h-7 text-purple-500 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5a4 4 0 10-8 0 4 4 0 008 0z" /></svg>
                <span className="text-2xl font-bold text-purple-700">{stats.userCount}</span>
                <span className="text-xs text-purple-700">Nutzer</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 mb-4">
          <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20.5c4.142 0 7.5-3.358 7.5-7.5S16.142 5.5 12 5.5 4.5 8.858 4.5 13s3.358 7.5 7.5 7.5z" /></svg>
          </span>
          <div>
            <h2 className="text-2xl font-semibold text-primary-700 mb-1">Willkommen im Admin-Bereich!</h2>
            <p className="text-gray-600">Hier kannst du Lektionen, Quizzes und Themen verwalten. Nutze die Navigation oben, um Inhalte zu bearbeiten oder neue anzulegen.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center">
            <svg className="w-8 h-8 text-blue-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0H3" /></svg>
            <span className="font-semibold text-blue-700">Lektion-Management</span>
            <p className="text-xs text-gray-500 text-center mt-1">Erstelle, bearbeite oder lösche Lernlektionen für deine Nutzer.</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 flex flex-col items-center">
            <svg className="w-8 h-8 text-yellow-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 17l-4 4m0 0l-4-4m4 4V3" /></svg>
            <span className="font-semibold text-yellow-700">Quiz-Management</span>
            <p className="text-xs text-gray-500 text-center mt-1">Füge neue Quizzes hinzu oder passe bestehende an, um das Lernerlebnis zu verbessern.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center">
            <svg className="w-8 h-8 text-green-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg>
            <span className="font-semibold text-green-700">Themen-Management</span>
            <p className="text-xs text-gray-500 text-center mt-1">Verwalte die verfügbaren Themen und deren Eigenschaften.</p>
          </div>
        </div>
        <div className="mt-8 text-sm text-gray-400 text-center">
          <span>💡 Tipp: Nutze die Admin-Oberfläche regelmäßig, um deine Inhalte aktuell und spannend zu halten!</span>
        </div>
      </div>
      <div className="bg-white rounded shadow p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin; 