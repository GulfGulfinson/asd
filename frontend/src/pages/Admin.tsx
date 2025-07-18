import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Admin: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <nav className="mb-8 flex gap-4">
        <Link to="/admin/lessons" className="text-blue-600 hover:underline">Lessons</Link>
        <Link to="/admin/quizzes" className="text-blue-600 hover:underline">Quizzes</Link>
        <Link to="/admin/themes" className="text-blue-600 hover:underline">Themes</Link>
        {/* Room for more: Users, Analytics, etc. */}
      </nav>
      <div className="bg-white rounded shadow p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin; 