import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import LessonDetail from './pages/LessonDetail';
import QuizPage from './pages/QuizPage';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import Cookies from './pages/Cookies';
import CookieConsentBanner from './components/CookieConsentBanner';
import Admin from './pages/Admin';
import AdminLessons from './pages/AdminLessons';
import AdminQuizzes from './pages/AdminQuizzes';
import AdminThemes from './pages/AdminThemes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <CookieConsentBanner />
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/cookies" element={<Cookies />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/lessons" element={
              <ProtectedRoute>
                <Lessons />
              </ProtectedRoute>
            } />
            <Route path="/lessons/:id" element={
              <ProtectedRoute>
                <LessonDetail />
              </ProtectedRoute>
            } />
            <Route path="/quiz/:lessonId" element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }>
              <Route path="lessons" element={<AdminLessons />} />
              <Route path="quizzes" element={<AdminQuizzes />} />
              <Route path="themes" element={<AdminThemes />} />
              {/* Room for more: users, analytics, etc. */}
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
